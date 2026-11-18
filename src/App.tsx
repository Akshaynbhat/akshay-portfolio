import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import photo from './assets/akshay.jpg'
import {
  categories, certs, clubs, experience, hackathons, profile, projects, skills,
  type Category, type Cert, type Project,
} from './data'

/* ───────────────────────── helpers ───────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const

// The hosted preview can't serve PDFs or downloads; a normal build shows every link.
const PREVIEW = import.meta.env.VITE_PREVIEW === '1'

const ResumeCtx = createContext<() => void>(() => {})

// Every resume button opens the in-page viewer, which also offers the PDF download.
function ResumeLink({ className, children }: { className?: string; children: ReactNode }) {
  const open = useContext(ResumeCtx)
  return <button type="button" onClick={open} className={className}>{children}</button>
}

function ResumeViewer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockScroll(open)
  useEscape(onClose, open)
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-ink/70 p-4 md:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Resume"
            className="my-auto h-fit w-full max-w-3xl border border-line bg-paper"
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3">
              <span className="label">Resume — {profile.name}</span>
              <div className="flex items-center gap-5">
                {!PREVIEW && <a href={profile.resume} download className="bg-accent px-3.5 py-1.5 text-sm text-accent-ink hover:opacity-85">Download PDF ↓</a>}
                <button onClick={onClose} className="label !text-ink hover:!text-accent" autoFocus>Close ✕</button>
              </div>
            </div>
            <div className="bg-panel p-3 md:p-6">
              <img src="./projects/resume-preview.jpg" alt={`Resume of ${profile.name}`} className="w-full bg-white shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)]" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.dataset.theme as 'light' | 'dark') || 'light',
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable */ }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))] as const
}

function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}

function useEscape(fn: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fn, active])
}

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`inline-block h-[0.8em] w-[0.8em] ${className}`} aria-hidden="true">
    <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

function Ext({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

function Section({ id, no, title, children, aside }: { id: string; no: string; title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section id={id} className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="label"><span className="text-accent">{no}</span> — {title}</p>
            {aside && <div className="mt-6 hidden max-w-[16rem] text-sm leading-relaxed text-muted lg:block">{aside}</div>}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}

/* ───────────────────────── nav ───────────────────────── */

const navLinks = [
  ['About', '#about'], ['Work', '#work'], ['Experience', '#experience'], ['Certificates', '#certificates'], ['Contact', '#contact'],
] as const
const allLinks = [
  ['About', '#about'], ['Skills', '#skills'], ['Work', '#work'], ['Experience', '#experience'], ['Certificates', '#certificates'],
  ['Hackathons', '#achievements'], ['Clubs', '#leadership'], ['Education', '#education'], ['Contact', '#contact'],
] as const

function Nav({ theme, toggle }: { theme: string; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useLockScroll(open)
  useEscape(() => setOpen(false), open)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled || open ? 'border-b border-line bg-paper/90 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10" aria-label="Main">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
            Akshay N Bhat<span className="text-accent">.</span>
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map(([l, h]) => (
              <li key={h}><a href={h} className="link-u text-sm">{l}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <button onClick={toggle} className="label !text-ink hover:!text-accent" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
              {theme === 'light' ? '◐ Dark' : '◑ Light'}
            </button>
            <ResumeLink className="hidden border border-ink px-3.5 py-1.5 text-sm transition-colors hover:bg-ink hover:text-paper sm:inline-block">
              Resume
            </ResumeLink>
            <button className="label !text-ink md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu">
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 bg-paper px-5 pt-24 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          >
            <ul className="space-y-1">
              {allLinks.map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i, ease }}>
                  <a href={h} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-line py-3">
                    <span className="label text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display text-4xl">{l}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <ResumeLink className="mt-8 inline-block border border-ink px-4 py-2">View resume</ResumeLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ───────────────────────── hero ───────────────────────── */

function Hero() {
  const line = (d: number) => ({ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay: d } })
  return (
    <header id="top" className="relative pt-16">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center border-b border-line py-4">
          <span className="label">Portfolio · 2026</span>
        </div>

        <div className="grid gap-10 pb-14 pt-10 md:grid-cols-12 md:gap-8 md:pt-14 lg:pb-16">
          <div className="flex flex-col md:col-span-7">
            <h1 className="display text-[clamp(3.6rem,15vw,10.75rem)] font-semibold md:text-[11.4vw] lg:text-[clamp(3.6rem,10.6vw,10.75rem)]">
              <motion.span className="block" {...line(0.05)}>{profile.first}</motion.span>
              <motion.span className="block whitespace-nowrap pl-[0.5em]" {...line(0.15)}>
                {profile.last}<span className="text-accent">.</span>
              </motion.span>
            </h1>

            <motion.div {...line(0.3)} className="mt-10 grid gap-8 md:mt-auto md:pt-12">
              <p className="max-w-[34rem] text-lg leading-relaxed md:text-xl">
                I enjoy problem solving, especially on the backend: APIs, data pipelines and the logic people rely on
                without seeing. I also like working on security and finding where web applications break.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#work" className="bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-85">See the work ↓</a>
                <ResumeLink className="border border-ink px-5 py-3 text-sm transition-colors hover:bg-ink hover:text-paper">Resume</ResumeLink>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5" aria-label="Highlights">
                {[
                  ['3rd place', 'DSCE Hackathon 2026'],
                  ['Grand Finalist', 'INNO Manthan 2026'],
                  ['2 internships', 'in cybersecurity'],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline gap-2 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 -translate-y-px rounded-full bg-accent" aria-hidden="true" />
                    <span className="font-medium">{k}</span>
                    <span className="text-muted">{v}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.figure
            className="md:col-span-5"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.1, ease, delay: 0.1 }}
          >
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-line pb-4">
              <span className="label">B.E. ISE · BNMIT</span>
              <p className="text-right leading-none">
                <span className="mr-3 font-mono text-sm font-bold uppercase tracking-wider">CGPA</span>
                <span className="font-display text-4xl font-bold tracking-tight md:text-5xl">{profile.cgpa}</span>
                <span className="ml-1 font-display text-lg text-muted">/ 10</span>
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-3 top-8 bottom-8 hidden w-px bg-accent md:block" aria-hidden="true" />
              <img
                src={photo}
                alt="Akshay N Bhat, smiling, arms crossed, on a rooftop with the Bengaluru skyline behind him"
                width={960} height={1280}
                className="aspect-[4/5] w-full object-cover object-[50%_35%] lg:aspect-[5/6]"
                fetchPriority="high"
              />
            </div>
          </motion.figure>
        </div>
      </div>
    </header>
  )
}

/* ───────────────────────── about ───────────────────────── */

function About() {
  return (
    <Section id="about" no="01" title="About">
      <Reveal>
        <p className="display max-w-4xl text-[clamp(1.9rem,3.6vw,3.2rem)] font-normal !leading-[1.1]">
          {profile.objective}
        </p>
      </Reveal>
      <Reveal delay={0.08} className="mt-14">
        <dl className="max-w-3xl divide-y divide-line border-y border-line text-sm">
          {[
            ['Studying', `B.E. ${profile.department}, ${profile.college}`],
            ['Standing', `5th semester (3rd year) · CGPA ${profile.cgpa} / 10`],
            ['Based in', profile.location],
            ['Career interests', profile.interests.join(' · ')],
            ['Hobbies', profile.hobbies.join(' · ')],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3.5 md:grid-cols-[12rem_1fr]">
              <dt className="label pt-0.5">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}

/* skills */

function Skills() {
  return (
    <Section id="skills" no="02" title="Skills" aside="What I reach for, grouped by where it gets used.">
      <ul className="border-t border-line">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 0.03}>
            <li className="group grid gap-2 border-b border-line py-5 md:grid-cols-[12rem_1fr] md:gap-8">
              <span className="font-display text-xl font-medium transition-colors group-hover:text-accent">{s.group}</span>
              <span className="leading-relaxed text-muted">
                {s.items.map((it, j) => (
                  <span key={it}>
                    <span className="text-ink">{it}</span>
                    {j < s.items.length - 1 && <>{' '}<span className="mx-1 text-muted/50">/</span>{' '}</>}
                  </span>
                ))}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

/* ───────────────────────── work ───────────────────────── */

function ProjectRow({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative grid w-full gap-4 border-b border-line py-8 text-left md:grid-cols-[4.5rem_1fr_15rem_1.5rem] md:gap-8 md:py-10"
      aria-label={`Open details for ${p.title}`}
    >
      <span className="absolute inset-y-0 -left-5 -right-5 -z-10 origin-left scale-x-0 bg-panel transition-transform duration-500 ease-out group-hover:scale-x-100 md:-left-6 md:-right-6" aria-hidden="true" />
      <span className="label pt-2">No. {String(i + 1).padStart(2, '0')}</span>
      <span>
        <span className="label block">{p.kicker}</span>
        <span className="display mt-2 block text-4xl font-semibold transition-transform duration-500 group-hover:translate-x-1.5 md:text-5xl">{p.title}</span>
        <span className="mt-3 block max-w-xl leading-relaxed text-muted">{p.summary}</span>
        {p.images && (
          <span className="mt-5 flex gap-3">
            {p.images.map((im) => (
              <img key={im.src} src={im.src} alt="" loading="lazy" className="h-28 w-24 border border-line object-cover transition-transform duration-500 group-hover:-translate-y-0.5 md:h-36 md:w-28" />
            ))}
          </span>
        )}
      </span>
      <span className="space-y-3 md:pt-2">
        {p.highlight && <span className="block font-mono text-xs leading-relaxed text-accent">{p.highlight}</span>}
        <span className="block font-mono text-xs leading-relaxed text-muted">{p.stack.join(' · ')}</span>
      </span>
      <span className="hidden pt-2 text-xl md:block"><Arrow className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" /></span>
    </button>
  )
}

function ProjectDrawer({ p, onClose, onNav }: { p: Project | null; onClose: () => void; onNav: (s: string) => void }) {
  useLockScroll(!!p)
  useEscape(onClose, !!p)
  const idx = p ? projects.findIndex((x) => x.slug === p.slug) : -1
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
          <motion.aside
            role="dialog" aria-modal="true" aria-labelledby="drawer-title"
            className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto border-l border-line bg-paper"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.55, ease }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-6 py-4 backdrop-blur md:px-10">
              <span className="label">Project {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              <button onClick={onClose} className="label !text-ink hover:!text-accent" autoFocus>Close ✕</button>
            </div>
            <div className="px-6 pb-16 pt-10 md:px-10" key={p.slug}>
              <p className="label">{p.kicker}</p>
              <h2 id="drawer-title" className="display mt-3 text-6xl font-semibold md:text-7xl">{p.title}</h2>
              {p.highlight && <p className="mt-5 font-mono text-sm text-accent">{p.highlight}</p>}
              <p className="mt-8 max-w-2xl text-xl leading-relaxed">{p.summary}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {p.repo && <Ext href={p.repo} className="border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-paper">Source on GitHub <Arrow /></Ext>}
                {p.live && <Ext href={p.live} className="bg-accent px-4 py-2 text-sm text-accent-ink hover:opacity-85">Live demo <Arrow /></Ext>}
              </div>

              {p.images && (
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {p.images.map((im, i) => (
                    <figure key={im.src}>
                      <div className="border border-line bg-panel">
                        <img src={im.src} alt={im.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                      </div>
                      <figcaption className="label mt-2">Fig. {i + 1} — {i === 0 ? 'Front' : 'Back'}</figcaption>
                    </figure>
                  ))}
                </div>
              )}

              <div className="mt-14 space-y-10 border-t border-line pt-10">
                <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                  <h3 className="label pt-1">The problem</h3>
                  <p className="text-lg leading-relaxed">{p.problem}</p>
                </div>
                {p.features.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                    <h3 className="label pt-1">What it does</h3>
                    <ol className="border-t border-line">
                      {p.features.map((f, i) => (
                        <li key={i} className="grid grid-cols-[2.2rem_1fr] border-b border-line py-3 text-[0.95rem] leading-relaxed">
                          <span className="pt-1 font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>{f}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {p.architecture && (
                  <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                    <h3 className="label pt-1">How it’s built</h3>
                    <dl className="border-t border-line text-sm">
                      {p.architecture.map((a) => (
                        <div key={a.layer} className="grid grid-cols-[8rem_1fr] gap-3 border-b border-line py-3">
                          <dt className="font-medium">{a.layer}</dt><dd className="text-muted">{a.tech}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                  <h3 className="label pt-1">Stack</h3>
                  <p className="font-mono text-sm">{p.stack.join('  ·  ')}</p>
                </div>
                {p.role && (
                  <div className="grid gap-3 md:grid-cols-[9rem_1fr]">
                    <h3 className="label pt-1">My part</h3>
                    <p className="text-sm leading-relaxed">{p.role}</p>
                  </div>
                )}
                {p.note && <p className="border-l-2 border-accent pl-4 text-sm text-muted">{p.note}</p>}
              </div>

              {next && (
                <button onClick={() => onNav(next.slug)} className="group mt-16 block w-full border-t border-line pt-6 text-left">
                  <span className="label">Next project</span>
                  <span className="display mt-2 block text-4xl font-semibold">
                    {next.title} <Arrow className="text-accent transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Work({ onOpen }: { onOpen: (slug: string) => void }) {
  const [filter, setFilter] = useState<'All' | Category>('All')
  const list = useMemo(() => projects.filter((p) => filter === 'All' || p.categories.includes(filter)), [filter])
  const indexOf = (p: Project) => projects.findIndex((x) => x.slug === p.slug)

  return (
    <Section id="work" no="03" title="Selected work" aside="Seven projects, from hackathon builds to coursework. Open any of them for the details.">
      <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="Filter projects">
        {categories.map((c) => {
          const count = c === 'All' ? projects.length : projects.filter((p) => p.categories.includes(c)).length
          return (
            <button
              key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)}
              className={`font-mono text-xs uppercase tracking-wider transition-colors ${filter === c ? 'text-accent' : 'text-muted hover:text-ink'}`}
            >
              {filter === c ? '● ' : ''}{c} <sup>{count}</sup>
            </button>
          )
        })}
      </div>

      <div className="isolate border-t border-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <ProjectRow p={p} i={indexOf(p)} onOpen={() => onOpen(p.slug)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Reveal className="mt-14">
        <Ext href={profile.github} className="group inline-flex items-baseline gap-3">
          <span className="link-u text-lg">More on GitHub</span>
          <span className="label !text-ink group-hover:!text-accent">@Akshaynbhat <Arrow /></span>
        </Ext>
      </Reveal>
    </Section>
  )
}

/* ───────────────────────── experience ───────────────────────── */

function CertButton({ slug, onCert }: { slug?: string; onCert: (s: string) => void }) {
  if (!slug) return null
  return (
    <button onClick={() => onCert(slug)} className="label link-u !text-ink hover:!text-accent">View certificate <Arrow /></button>
  )
}

function Experience({ onCert }: { onCert: (s: string) => void }) {
  return (
    <Section id="experience" no="04" title="Experience" aside="Two security internships in 2026, after a C++ and embedded systems internship at college.">
      <ol className="relative">
        <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line md:left-[calc(12rem+5px)]" aria-hidden="true" />
        {experience.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.06} className={i < experience.length - 1 ? 'pb-14' : ''}>
            <li className="relative grid gap-3 pl-8 md:grid-cols-[12rem_1fr] md:gap-0 md:pl-0">
              <div className="md:pr-8 md:text-right">
                <p className="font-mono text-sm">{e.when}</p>
                <p className="label mt-1">{e.where}</p>
              </div>
              <span className="absolute left-0 top-1 h-[11px] w-[11px] rounded-full border border-accent bg-paper md:left-[12rem]" aria-hidden="true">
                <span className="absolute inset-[2px] rounded-full bg-accent" />
              </span>
              <div className="md:pl-10">
                <h3 className="display text-3xl font-semibold md:text-4xl">{e.role}</h3>
                <p className="mt-1 font-medium">{e.org}</p>
                <ul className="mt-4 space-y-2 leading-relaxed">
                  {e.points.map((pt) => <li key={pt} className="max-w-2xl text-muted"><span className="mr-2 text-accent">→</span>{pt}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <p className="font-mono text-xs text-muted">{e.tags.join(' · ')}</p>
                  <CertButton slug={e.cert} onCert={onCert} />
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

/* ───────────────────────── certificates ───────────────────────── */

const certFile = (c: Cert) => c.file ?? `./certs/${c.slug}.pdf`

function CertLightbox({ c, onClose }: { c: Cert | null; onClose: () => void }) {
  useLockScroll(!!c)
  useEscape(onClose, !!c)
  const isPdf = c ? certFile(c).endsWith('.pdf') : false
  return (
    <AnimatePresence>
      {c && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 md:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="cert-title"
            className="grid max-h-full w-full max-w-6xl overflow-y-auto border border-line bg-paper lg:grid-cols-[1fr_22rem]"
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center bg-panel p-4 md:p-8">
              <img src={`./certs/thumbs/${c.slug}.jpg`} alt={`${c.title} certificate`} className="w-full shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)]" />
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <p className="label">{c.issuer}</p>
                <button onClick={onClose} className="label shrink-0 !text-ink hover:!text-accent" autoFocus>Close ✕</button>
              </div>
              <h3 id="cert-title" className="display mt-4 text-3xl font-semibold">{c.title}</h3>
              {c.kind && <p className="mt-2 text-sm text-muted">{c.kind}</p>}
              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                {c.date && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Date</dt><dd className="text-right">{c.date}</dd></div>}
                <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Area</dt><dd>{c.track}</dd></div>
                {c.extra && <div className="flex justify-between gap-4 py-3"><dt className="text-muted">Details</dt><dd className="text-right">{c.extra}</dd></div>}
                {c.credentialId && <div className="py-3"><dt className="text-muted">Credential ID</dt><dd className="mt-1 break-all font-mono text-xs">{c.credentialId}</dd></div>}
              </dl>
              <div className="mt-6 flex flex-col gap-3 lg:mt-auto lg:pt-8">
                {!(PREVIEW && isPdf) && (
                  <Ext href={certFile(c)} className="border border-ink px-4 py-2.5 text-center text-sm transition-colors hover:bg-ink hover:text-paper">
                    Open certificate {isPdf ? '(PDF)' : ''} <Arrow />
                  </Ext>
                )}
                {c.verify && <Ext href={c.verify} className="bg-accent px-4 py-2.5 text-center text-sm text-accent-ink hover:opacity-85">Verify <Arrow /></Ext>}
                {c.verifyNote && <p className="text-center text-xs text-muted">{c.verifyNote}</p>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const tracks = ['All', 'Security', 'AI & Data', 'Internships & events'] as const

function Certificates({ onCert }: { onCert: (s: string) => void }) {
  const [track, setTrack] = useState<(typeof tracks)[number]>('All')
  const list = certs.filter((c) => track === 'All' || c.track === track)

  return (
    <Section
      id="certificates" no="05" title="Certificates"
      aside={<>{certs.length} certificates: courses, internships and events. Click one to see it in full.</>}
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-2xl text-4xl font-semibold md:text-5xl">Mostly security, with a growing AI shelf.</h2>
        <div className="flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="Filter certificates">
          {tracks.map((t) => (
            <button key={t} role="tab" aria-selected={track === t} onClick={() => setTrack(t)}
              className={`font-mono text-xs uppercase tracking-wider ${track === t ? 'text-accent' : 'text-muted hover:text-ink'}`}>
              {track === t ? '● ' : ''}{t} <sup>{t === 'All' ? certs.length : certs.filter((c) => c.track === t).length}</sup>
            </button>
          ))}
        </div>
      </div>
      <motion.ul layout className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => (
            <motion.li key={c.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <button onClick={() => onCert(c.slug)} className="group block w-full text-left" aria-label={`View ${c.title} certificate`}>
                <div className="overflow-hidden border border-line bg-panel p-4">
                  <img
                    src={`./certs/thumbs/${c.slug}.jpg`} alt="" loading="lazy"
                    className="aspect-[1.414] w-full object-cover object-top shadow-[0_12px_30px_-18px_rgb(0_0_0/0.4)] transition-transform duration-500 group-hover:-translate-y-1"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p className="label">{c.issuer}</p>
                  {c.date && <p className="label shrink-0">{c.date}</p>}
                </div>
                <p className="mt-1.5 font-medium leading-snug transition-colors group-hover:text-accent">{c.title}</p>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  )
}

/* ───────────────────────── hackathons / clubs ───────────────────────── */

function Hackathons({ onOpen, onCert }: { onOpen: (slug: string) => void; onCert: (s: string) => void }) {
  return (
    <Section id="achievements" no="06" title="Hackathons & awards">
      <ul className="border-t border-line">
        {hackathons.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.03}>
            <li className="grid gap-2 border-b border-line py-6 md:grid-cols-[9rem_1fr_auto] md:gap-8">
              <span className="font-mono text-xs text-muted md:pt-1.5">{h.when}</span>
              <div>
                <h3 className="font-display text-xl font-medium md:text-2xl">
                  {h.title}
                  {h.result && <span className="ml-3 align-middle font-mono text-xs font-normal text-accent">{h.result}</span>}
                </h3>
                {h.detail && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{h.detail}</p>}
              </div>
              <div className="flex gap-5 md:justify-end md:pt-1.5">
                {h.project && (
                  <button onClick={() => onOpen(h.project!)} className="label link-u !text-ink hover:!text-accent">Project <Arrow /></button>
                )}
                {h.cert && <button onClick={() => onCert(h.cert!)} className="label link-u !text-ink hover:!text-accent">Certificate <Arrow /></button>}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

function Clubs() {
  return (
    <Section id="leadership" no="07" title="College clubs">
      <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
        {clubs.map((c, i) => (
          <Reveal key={c.org} delay={i * 0.05} className={i === 0 ? 'md:col-span-2' : ''}>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
              <h3 className="display text-3xl font-semibold md:text-4xl">{c.org}</h3>
              {c.kind && <span className="label shrink-0">{c.kind}</span>}
            </div>
            <ol className={`mt-6 grid gap-6 ${i === 0 ? 'md:grid-cols-2' : ''}`}>
              {c.roles.map((r) => (
                <li key={r.role} className="border-l border-accent pl-4">
                  <p className="text-lg font-medium">{r.role}</p>
                  {r.when && <p className="mt-0.5 font-mono text-xs text-muted">{r.when}</p>}
                  {r.skills && <p className="mt-2 text-sm text-muted">{r.skills}</p>}
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/* ───────────────────────── contact ───────────────────────── */

// Set VITE_WEB3FORMS_KEY in .env (free key from web3forms.com) and messages arrive in your inbox.
// Without a key, the form falls back to opening the visitor's email app.
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', botcheck: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const direct = !!FORM_KEY && !PREVIEW

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!direct) {
      const subject = encodeURIComponent(`Hello from ${form.name || 'your portfolio'}`)
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY, subject: `Portfolio message from ${form.name}`, from_name: 'akshay-portfolio',
          name: form.name, email: form.email, message: form.message, botcheck: form.botcheck,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus('sent')
      setForm({ name: '', email: '', message: '', botcheck: '' })
    } catch {
      setStatus('error')
    }
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  const field = 'w-full border-b border-line bg-transparent py-3 outline-none transition-colors placeholder:text-muted focus:border-accent'

  return (
    <Section id="contact" no="09" title="Contact">
      <div className="grid gap-14 lg:grid-cols-2">
        <Reveal>
          <h2 className="display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold">
            Internship, team, or a bug to find? <span className="text-accent">Write.</span>
          </h2>
          <div className="mt-10 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <a href={`mailto:${profile.email}`} className="link-u text-xl md:text-2xl">{profile.email}</a>
              <button onClick={copy} className="label !text-ink hover:!text-accent">{copied ? 'Copied ✓' : 'Copy'}</button>
            </div>
            <div className="flex gap-6 pt-2">
              <Ext href={profile.linkedin} className="link-u">LinkedIn <Arrow /></Ext>
              <Ext href={profile.github} className="link-u">GitHub <Arrow /></Ext>
              <ResumeLink className="link-u">Resume</ResumeLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          {status === 'sent' ? (
            <div className="border-l-2 border-accent py-2 pl-5">
              <p className="display text-3xl font-semibold">Thanks — message sent.</p>
              <p className="mt-2 text-muted">I’ll reply to the email you gave.</p>
              <button onClick={() => setStatus('idle')} className="label link-u mt-5 !text-ink">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <label className="block"><span className="label">Your name</span>
                <input required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              </label>
              <label className="block"><span className="label">Your email</span>
                <input required={direct} type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </label>
              <label className="block"><span className="label">Message</span>
                <textarea required rows={4} className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" checked={!!form.botcheck} onChange={(e) => setForm({ ...form, botcheck: e.target.checked ? 'on' : '' })} aria-hidden="true" />
              <button type="submit" disabled={status === 'sending'} className="bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : 'Send message →'}
              </button>
              {status === 'error' && <p className="text-sm text-accent">That didn’t go through. Please email {profile.email} directly.</p>}
              {!direct && <p className="text-xs text-muted">Opens your email app with the message filled in.</p>}
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}

function Education() {
  return (
    <Section id="education" no="08" title="Education">
      <Reveal>
        <div className="grid gap-8 border-y border-line py-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label">{profile.standing}</p>
            <h3 className="display mt-3 text-4xl font-semibold md:text-5xl">{profile.college}</h3>
            <p className="mt-3 text-lg">{profile.degree} — {profile.department}</p>
            <p className="mt-1 text-muted">Bengaluru, Karnataka</p>
          </div>
          <div className="md:text-right">
            <p className="display text-8xl font-semibold leading-none">{profile.cgpa}<span className="text-3xl text-muted">/10</span></p>
            <p className="label mt-2">CGPA</p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10">
        <p className="display select-none overflow-hidden whitespace-nowrap text-[12.2vw] font-semibold leading-[0.85] text-panel xl:text-[10.6rem]" aria-hidden="true">Akshay N Bhat</p>
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted">© 2026 {profile.name} · Bengaluru</span>
          <div className="flex gap-6">
            <Ext href={profile.linkedin} className="link-u">LinkedIn</Ext>
            <Ext href={profile.github} className="link-u">GitHub</Ext>
            <a href={`mailto:${profile.email}`} className="link-u">Email</a>
            <a href="#top" className="link-u">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ───────────────────────── app ───────────────────────── */

export default function App() {
  const [theme, toggle] = useTheme()
  const [slug, setSlug] = useState<string | null>(null)
  const [certSlug, setCertSlug] = useState<string | null>(null)
  const [resumeOpen, setResumeOpen] = useState(false)
  const project = projects.find((p) => p.slug === slug) ?? null
  const cert = certs.find((c) => c.slug === certSlug) ?? null

  return (
    <MotionConfig reducedMotion="user">
      <ResumeCtx.Provider value={() => setResumeOpen(true)}>
      <div className="grain">
        <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">Skip to content</a>
        <Nav theme={theme} toggle={toggle} />
        <Hero />
        <main>
          <About />
          <Skills />
          <Work onOpen={setSlug} />
          <Experience onCert={setCertSlug} />
          <Certificates onCert={setCertSlug} />
          <Hackathons onOpen={setSlug} onCert={setCertSlug} />
          <Clubs />
          <Education />
          <Contact />
        </main>
        <Footer />
        <ProjectDrawer p={project} onClose={() => setSlug(null)} onNav={setSlug} />
        <CertLightbox c={cert} onClose={() => setCertSlug(null)} />
        <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
      </div>
      </ResumeCtx.Provider>
    </MotionConfig>
  )
}
