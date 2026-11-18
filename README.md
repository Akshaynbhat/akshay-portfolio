# Akshay N Bhat — Portfolio

React + TypeScript + Tailwind CSS v4 + Framer Motion, built with Vite. Static output, so it deploys anywhere.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serve the production build
```

## Deploy

- **Vercel / Netlify:** import the repo. Build command `npm run build`, output directory `dist`.
- **GitHub Pages:** push `dist/` to a `gh-pages` branch (paths are relative, so sub-paths work).

After deploying, open `index.html` and change `og:image` to the full URL (e.g. `https://yourdomain.com/og.jpg`) so link previews show your photo.

## Editing content

Almost everything lives in **`src/data.ts`**: profile, projects, experience, skills, achievements, leadership and certificates.

- **Add a certificate:** put the PDF in `public/certs/<slug>.pdf`, a JPG preview in `public/certs/thumbs/<slug>.jpg`, then add an entry to `certs`.
  (Make a preview with `pdftoppm -r 110 -jpeg -singlefile file.pdf public/certs/thumbs/<slug>`.)
- **Replace the résumé:** overwrite `public/Akshay_N_Bhat_Resume.pdf`.
- **Replace the photo:** overwrite `src/assets/akshay.jpg`.
- **Project art:** each project picks a line drawing via `motif` (see `src/Motif.tsx`).

## Contact form

Messages go straight to your Gmail through Web3Forms. The access key lives in `.env`, which is kept out of Git.

- **Building on your own computer** (`npm run build`): works as is, because `.env` is in the folder.
- **Deploying from GitHub to Vercel or Netlify:** `.env` isn't uploaded, so add the key in the host's settings:
  Vercel → Project → Settings → Environment Variables → name `VITE_WEB3FORMS_KEY`, value = your key → redeploy.
  (Netlify: Site configuration → Environment variables, same name.)
- After deploying, change the form's Website URL in the Web3Forms dashboard from `localhost` to your live address.

Without a key, the form falls back to opening the visitor's email app.

## Theme

Colours are CSS variables at the top of `src/index.css` (`--accent` is the vermilion). Light and dark themes are both defined there.
