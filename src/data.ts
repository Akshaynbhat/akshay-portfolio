// All content lives here. Edit this file to update the site.
// Everything below comes from Akshay's resume, his GitHub READMEs and the certificate PDFs.

export const profile = {
  name: 'Akshay N Bhat',
  first: 'Akshay',
  last: 'N Bhat',
  email: 'akshaybhat2006@gmail.com',
  linkedin: 'https://www.linkedin.com/in/akshaynbhat14/',
  github: 'https://github.com/Akshaynbhat',
  resume: './Akshay_N_Bhat_Resume.pdf',
  location: 'Bengaluru, Karnataka, India',
  college: 'B.N.M. Institute of Technology',
  collegeShort: 'BNMIT',
  degree: 'Bachelor of Engineering',
  department: 'Information Science & Engineering',
  standing: '2024 – 2028 (expected) · 5th semester',
  cgpa: '9.4',
  objective:
    'Passionate 3rd year B.E. student at BNM Institute of Technology with hands-on experience in building AI, blockchain, and full-stack projects. Looking for opportunities in backend development or software engineering where I can contribute and grow.',
  hobbies: ['Hindustani classical music', 'Dance', 'Cricket', 'Kabaddi'],
  interests: ['Backend engineering', 'Full-stack web development', 'AI/ML systems', 'Blockchain applications'],
}

export type Category = 'AI / ML' | 'Blockchain' | 'Security' | 'Full-stack' | 'Hardware' | 'Data'

export type Project = {
  slug: string
  title: string
  kicker: string
  summary: string
  problem: string
  features: string[]
  architecture?: { layer: string; tech: string }[]
  stack: string[]
  categories: Category[]
  repo?: string
  live?: string
  role?: string
  note?: string
  highlight?: string
  year?: string
  images?: { src: string; alt: string }[]
}

export const projects: Project[] = [
  {
    slug: 'moneymal',
    title: 'MoneyMal',
    kicker: 'Financial forensics engine',
    summary:
      'Feeds a transaction CSV into a directed graph and exposes money-mule networks: circular fund flows, smurfing, fan-out and layered shell chains.',
    problem:
      'Money muling hides in the shape of transactions, not in any single one. Rule lists that look at payments one at a time miss the rings.',
    features: [
      'Seven detection algorithms: cycles, shell chains, smurfing (fan-in), fan-out, scatter-gather, structuring and velocity bursts',
      'Four-pillar scoring: PageRank-based graph proxy, burst-timing analysis, Isolation Forest and RBI/NPCI-style rules',
      'Labels each flagged account HUB, BRIDGE, MULE or LEAF and issues a BLOCK, REVIEW or APPROVE verdict',
      'Fuzzy column mapping, so CSVs with non-standard headers work without reformatting',
      'Submit-and-poll job queue: large files run in a background thread instead of timing out',
      'Interactive vis.js network graph with a five-tab Node Inspector for any account',
    ],
    architecture: [
      { layer: 'Frontend', tech: 'React 19, Vite, vis-network, Tailwind CSS, Framer Motion' },
      { layer: 'Backend', tech: 'Python, FastAPI, Uvicorn, ThreadPoolExecutor job queue' },
      { layer: 'Graph engine', tech: 'NetworkX MultiDiGraph' },
      { layer: 'ML', tech: 'scikit-learn Isolation Forest, PageRank / degree centrality' },
    ],
    stack: ['Python', 'FastAPI', 'NetworkX', 'scikit-learn', 'Pandas', 'React', 'vis.js'],
    categories: ['AI / ML', 'Data', 'Full-stack'],
    repo: 'https://github.com/Akshaynbhat/MoneyMal',
    highlight: 'Turns a raw transaction file into a clear map of who moved money to whom',
    role: 'Team project with Manas Prashant, Amogh Basavaraj and Chandra Prasad R.',
  },
  {
    slug: 'crimechain',
    title: 'CrimeChain',
    kicker: 'AI + blockchain crime records',
    summary:
      'Case records and evidence hashes go on Ethereum, so a changed file or edited FIR is caught the moment anyone checks it.',
    problem:
      'Centralised crime databases can be edited without a trace, police and courts work in separate systems, and nobody outside can prove evidence was not altered.',
    features: [
      'Solidity smart contract stores cases and SHA-256 evidence hashes on Ethereum (Sepolia)',
      'Separate portals for Police (create), Court (verify) and Public (view)',
      'NLP-based e-FIR generation pulls structured incident fields from free-text complaints',
      'Flask service scores cases for legal risk to help prioritise them',
      'MetaMask for identity and transaction signing; IPFS for evidence files',
    ],
    architecture: [
      { layer: 'Smart contract', tech: 'Solidity, Hardhat' },
      { layer: 'Chain + wallet', tech: 'Ethereum Sepolia, MetaMask' },
      { layer: 'Frontend', tech: 'HTML, CSS, JavaScript, ethers.js' },
      { layer: 'Backend', tech: 'Python, Flask, custom ML scoring model' },
    ],
    stack: ['Solidity', 'Ethereum', 'ethers.js', 'IPFS', 'Flask', 'NLP'],
    categories: ['Blockchain', 'AI / ML', 'Security'],
    repo: 'https://github.com/Akshaynbhat/Crime_Chain',
    live: 'https://crime-chain-orpin.vercel.app/',
    highlight: '3rd place, Dayanand Sagar Hackathon',
  },
  {
    slug: 'smart-wheelchair',
    title: 'IntelliWheel',
    kicker: 'Voice & EMG-controlled smart wheelchair',
    summary:
      'An assistive wheelchair you can drive by voice or by muscle signals, with obstacle detection and a companion app.',
    problem:
      'Many people with limited mobility cannot use a joystick. A second, independent way to steer gives them control back.',
    features: [
      'Dual control: spoken commands or EMG muscle signals',
      'Raw EMG is filtered, then muscle activations are classified into movement commands',
      'Ultrasonic obstacle detection that stops the chair within 10 cm',
      'Custom app built for the wheelchair system',
    ],
    stack: ['Embedded systems', 'EMG signal processing', 'Voice control', 'Sensors', 'Mobile app'],
    categories: ['Hardware', 'AI / ML'],
    repo: 'https://github.com/Akshaynbhat/Smart_Wheelchair',
    images: [
      { src: './projects/intelliwheel-front.jpg', alt: 'IntelliWheel from the front: EMG electrode straps on the seat and ultrasonic sensors on the footrest frame' },
      { src: './projects/intelliwheel-back.jpg', alt: 'IntelliWheel from the back: two geared motors driving the wheels by chain, with the control boards wired on a base plate' },
    ],
    highlight: 'Grand Finalist, FKCCI INNO Manthan 2026 (1,200+ teams)',
  },
  {
    slug: 'digisanchaar',
    title: 'DigiSanchaar',
    kicker: 'Tourist safety & e-FIR platform',
    summary:
      'An SOS button that records audio, has Gemini judge the distress, calls and emails your contacts, and files a provisional e-FIR with your live location.',
    problem:
      'A tourist in trouble may not speak the local language or know whom to call, and filing a report afterwards is slow.',
    features: [
      'SOS with countdown confirmation, live audio capture and AI distress analysis',
      'Automated phone calls through Twilio and email alerts through Resend',
      'Provisional e-FIR filed automatically with geolocation; citizens can track its status',
      'Police dashboard with live map, SOS audio evidence and missing-person / theft reports',
      'Interface in 11 languages, including Hindi, Kannada, Tamil, Telugu and Bengali',
    ],
    architecture: [
      { layer: 'App', tech: 'Next.js App Router, React, Tailwind CSS, shadcn/ui' },
      { layer: 'Backend', tech: 'Next.js Server Actions, Firebase Auth / Firestore / Storage' },
      { layer: 'AI', tech: 'Google Gemini via Genkit' },
      { layer: 'Comms', tech: 'Twilio (voice), Resend (email)' },
    ],
    stack: ['Next.js', 'TypeScript', 'Firebase', 'Gemini', 'Twilio', 'Tailwind CSS'],
    categories: ['Full-stack', 'AI / ML'],
    repo: 'https://github.com/Akshaynbhat/DigiSanchaar',
  },
  {
    slug: 'reliefnet',
    title: 'ReliefNet',
    kicker: 'Crowdsourced disaster relief',
    summary:
      'People report floods, fires and accidents with location and photos; admins verify them; donors only ever see verified relief channels.',
    problem:
      'In a disaster, news travels slowly and inaccurately, and fake donation links make people hesitant to give at all.',
    features: [
      'Disaster reports with location, description and media upload',
      'Admin review: verify, reject or remove duplicate reports',
      'Live map of verified incidents',
      'Verified donation channels with donation tracking',
      'Safety check, email alerts, multilingual interface and a Gemini-powered chatbot',
    ],
    architecture: [
      { layer: 'Frontend', tech: 'React, TypeScript, Vite' },
      { layer: 'Backend', tech: 'Firebase Auth, Firestore, Storage' },
      { layer: 'AI', tech: 'Google Gemini' },
    ],
    stack: ['React', 'TypeScript', 'Firebase', 'Gemini', 'Vite'],
    categories: ['Full-stack'],
    repo: 'https://github.com/Akshaynbhat/ReliefNet',
    live: 'https://semifinal-copy-of-reliefnet-623722579872.us-west1.run.app/',
  },
  {
    slug: 'trustfeed',
    title: 'TrustFeed',
    kicker: 'Fake media & misinformation analysis',
    summary:
      'Checks images, videos, text, links and public posts for signs of manipulated media, misleading content and coordinated spread, and shows the evidence along with its limits.',
    problem:
      'Edited images and misleading posts spread faster than anyone can check them, and a single “fake or real” score hides how unsure the answer is.',
    features: [
      'Pretrained image model, metadata checks, video keyframes and matching against known images',
      'Reverse image search to find where an image has appeared, and the earliest appearance found',
      'Rule-based text and link checks with claim extraction',
      'Traces spread on public platforms and flags accounts that repeatedly post the same items',
      'Dashboard with spread replay, heatmaps, monitoring, history and printable reports',
      'Published accuracy benchmark, including where the detector falls short',
    ],
    architecture: [
      { layer: 'Frontend', tech: 'React, TypeScript, Vite' },
      { layer: 'API', tech: 'Python, FastAPI, Uvicorn' },
      { layer: 'Media', tech: 'PyTorch, Transformers, OpenCV, PyAV, imagehash' },
      { layer: 'Network', tech: 'Co-sharing detection across public platforms' },
    ],
    stack: ['Python', 'FastAPI', 'PyTorch', 'OpenCV', 'React', 'TypeScript'],
    categories: ['AI / ML', 'Security', 'Full-stack'],
    repo: 'https://github.com/Amogh198/TrustFeed',
    highlight: 'Built at LAKSHYA 2026, SJBIT',
    role: 'I owned media forensics and image provenance: the detector, metadata, keyframes, perceptual hashing, web source search and the accuracy benchmark. Team: Akshay, Amogh, Bhuvan and Manas.',
  },
  {
    slug: 'hospital-db',
    title: 'HMS Pro',
    kicker: 'Hospital management system',
    summary:
      'A three-tier hospital system for patients, doctors, appointments, prescriptions and billing, with most of the rules enforced inside PostgreSQL.',
    problem:
      'Hospital records spread across patients, doctors, appointments and bills drift out of sync unless the database itself keeps them consistent.',
    features: [
      'Separate admin, doctor and patient roles',
      'Patient records, medical history and document uploads',
      'Appointment booking, with a trigger that blocks double bookings',
      'Prescriptions after each consultation',
      'Bills generated automatically, with paid and pending tracking',
      'Schema normalised to 3NF, with stored procedures, views and audit logging',
    ],
    architecture: [
      { layer: 'Frontend', tech: 'HTML, CSS, JavaScript' },
      { layer: 'Backend', tech: 'Python, Flask' },
      { layer: 'Database', tech: 'PostgreSQL: triggers, stored procedures, views, constraints' },
    ],
    stack: ['PostgreSQL', 'SQL', 'Python', 'Flask'],
    categories: ['Data', 'Full-stack'],
    repo: 'https://github.com/Akshaynbhat/Hospital_Management_Database',
  },
]

export const categories: ('All' | Category)[] = ['All', 'AI / ML', 'Blockchain', 'Security', 'Full-stack', 'Hardware', 'Data']

export type CertRef = string // slug of an entry in certs

export const experience: { role: string; org: string; when: string; where: string; points: string[]; tags: string[]; cert?: CertRef }[] = [
  {
    role: 'Artificial Intelligence & Cyber Security Intern',
    org: 'Theta Dynamics Private Limited',
    when: 'Jul – Aug 2026',
    where: 'Bengaluru · On-site',
    points: [
      'Performed web application security testing using Burp Suite and OWASP methodologies.',
      'Identified and analyzed vulnerabilities such as IDOR, SQL injection, XSS and authentication flaws.',
    ],
    tags: ['Cybersecurity', 'Ethical hacking', 'Burp Suite', 'OWASP'],
  },
  {
    role: 'Cybersecurity Research Intern',
    org: 'RV University — Cyber Security Cluster, SoCSE',
    when: 'Jun – Jul 2026',
    where: 'Bengaluru · Summer Internship Programme',
    points: [
      'Developed an AI-powered Zero Trust dashboard for intellectual property protection using FastAPI and ML.',
      'Researched Zero Trust Architecture (NIST SP 800-207) and insider threat detection techniques.',
    ],
    tags: ['FastAPI', 'Machine learning', 'Zero Trust', 'NIST SP 800-207'],
    cert: 'rv-university-internship',
  },
  {
    role: 'Internal Internship I — C++ and Embedded Systems',
    org: 'B.N.M. Institute of Technology',
    when: 'Jul – Aug 2025',
    where: 'Bengaluru · 3rd semester',
    points: ['Completed the department’s internal internship on C++ and embedded systems, 21 July – 9 August 2025.'],
    tags: ['C++', 'Embedded systems'],
    cert: 'bnmit-internship-cpp-embedded',
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript'] },
  { group: 'Web', items: ['React.js', 'React Native', 'Next.js', 'HTML5', 'CSS3', 'FastAPI', 'Flask', 'REST APIs'] },
  { group: 'Security', items: ['Kali Linux', 'Linux', 'Burp Suite', 'Nmap', 'Wireshark', 'Metasploit'] },
  { group: 'AI & data', items: ['Machine learning', 'NLP', 'Graph analytics', 'scikit-learn', 'Pandas', 'NetworkX'] },
  { group: 'Blockchain', items: ['Ethereum (Sepolia)', 'Solidity', 'Web3.js', 'ethers.js', 'IPFS', 'MetaMask'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'Firebase Firestore'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'] },
]

export const hackathons: { title: string; result: string; when: string; detail: string; project?: string; cert?: CertRef }[] = [
  {
    title: 'FKCCI INNO Manthan 2026',
    result: 'Grand Finalist',
    when: '2026',
    detail: 'Selected from 1,200+ teams to present IntelliWheel.',
    project: 'smart-wheelchair',
  },
  {
    title: 'Dayanand Sagar (DSCE) Hackathon',
    result: '3rd place',
    when: '22 Apr 2026',
    detail: 'With CrimeChain, an AI + blockchain crime reporting platform.',
    project: 'crimechain',
  },
  {
    title: 'LAKSHYA 2026 — SJBIT',
    result: 'Built TrustFeed',
    when: '2026',
    detail: 'Fake media and misinformation analysis, for problem DL-SJBIT-HK26-GOVP006.',
    project: 'trustfeed',
  },
  {
    title: 'RIFT ’26 Hackathon — PW Institute of Innovation',
    result: 'Participant',
    when: '19–20 Feb 2026',
    detail: 'With Team Aura.',
    cert: 'rift-26-hackathon',
  },
  {
    title: 'Tech Vision 2026 — CMR Institute of Technology',
    result: 'Consolation prize',
    when: '13 Feb 2026',
    detail: 'National-level project expo on Assistive Technology; the project was adjudged one of the outstanding solutions.',
    cert: 'tech-vision-2026',
  },
  {
    title: 'Unisys Innovation Program — Year 17',
    result: 'Participant',
    when: '2026',
    detail: 'Unisys India.',
    cert: 'unisys-innovation-program',
  },
]

export const clubs: { org: string; kind?: string; roles: { role: string; when: string; skills?: string }[] }[] = [
  {
    org: 'TEDxBNMIT',
    roles: [
      { role: 'Vice Lead', when: 'Aug 2026 – Present', skills: 'Leadership' },
      { role: 'Student Coordinator / Marketing', when: 'Dec 2025 – Present', skills: 'Team management and communication' },
    ],
  },
  {
    org: 'IEEE ITS BNMIT',
    kind: 'Part-time',
    roles: [{ role: 'Member', when: 'Jun 2026 – Present', skills: 'Information theory and event planning' }],
  },
  {
    org: 'TAG — Technology And Gaming Club, BNMIT',
    roles: [{ role: 'Marketing Head', when: '' }],
  },
]

export type Cert = {
  slug: string
  title: string
  issuer: string
  date: string
  iso: string
  track: 'Security' | 'AI & Data' | 'Internships & events'
  file?: string // defaults to ./certs/<slug>.pdf
  kind?: string
  credentialId?: string
  verify?: string
  verifyNote?: string
  extra?: string
}

const springboard = 'https://verify.onwingspan.com'

export const certs: Cert[] = [
  { slug: 'python-for-data-science', title: 'Python for Data Science', issuer: 'Infosys Springboard', date: '2 Nov 2026', iso: '2026-11-02', track: 'AI & Data', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'cisco-packet-tracer', title: 'Exploring Networking with Cisco Packet Tracer', issuer: 'Cisco Networking Academy', date: '2 Nov 2026', iso: '2026-11-02', track: 'Security', credentialId: 'ae691072-e83c-442f-bfa0-7cc84618b9fe' },
  { slug: 'cisco-ethical-hacker', title: 'Ethical Hacker', issuer: 'Cisco Networking Academy', date: '30 Jul 2026', iso: '2026-07-30', track: 'Security', credentialId: 'af70746d-31b6-4d90-8c71-1810fb858df1' },
  { slug: 'aws-cloud-security-foundations', title: 'AWS Academy Graduate — Cloud Security Foundations', issuer: 'AWS Academy', date: '29 Jul 2026', iso: '2026-07-29', track: 'Security', verify: 'https://www.credly.com/go/j7ywqu9U', extra: '20 hours · Training badge' },
  { slug: 'introduction-to-ai', title: 'Introduction to Artificial Intelligence', issuer: 'Infosys Springboard', date: '6 Apr 2026', iso: '2026-04-06', track: 'AI & Data', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'ai-for-all', title: 'Artificial Intelligence for All', issuer: 'Infosys Springboard', date: '6 Apr 2026', iso: '2026-04-06', track: 'AI & Data', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'cyber-security-foundation', title: 'Cyber Security Foundation Certification', issuer: 'Infosys Springboard', date: '1 Mar 2026', iso: '2026-03-01', track: 'Security', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'introduction-to-cyber-security', title: 'Introduction to Cyber Security', issuer: 'Infosys Springboard', date: '24 Feb 2026', iso: '2026-02-24', track: 'Security', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'fundamentals-of-cryptography', title: 'Fundamentals of Cryptography', issuer: 'Infosys Springboard', date: '21 Feb 2026', iso: '2026-02-21', track: 'Security', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'fundamentals-of-information-security', title: 'Fundamentals of Information Security', issuer: 'Infosys Springboard', date: '18 Feb 2026', iso: '2026-02-18', track: 'Security', verify: springboard, verifyNote: 'Scan the QR code on the certificate' },
  { slug: 'tokens-to-transformers', title: 'From Tokens to Transformers: A Course on GenAI × LLM Mastery', issuer: 'IIT Guwahati · Unstop', date: '', iso: '', track: 'AI & Data', file: './certs/tokens-to-transformers.jpg', kind: 'Certificate of participation' },
  { slug: 'rv-university-internship', title: 'Summer Internship Programme — Cyber Security Cluster', issuer: 'RV University', date: '1 Jun – 31 Jul 2026', iso: '2026-07-31', track: 'Internships & events', file: './certs/rv-university-internship.jpg', credentialId: 'RVU/B/SoCSE/CC/SIP/E/26/3331', kind: 'Certificate of completion' },
  { slug: 'unisys-innovation-program', title: 'Unisys Innovation Program (UIP) — Year 17', issuer: 'Unisys India', date: '2026', iso: '2026-07-09', track: 'Internships & events', kind: 'Certificate of participation' },
  { slug: 'rift-26-hackathon', title: 'RIFT ’26 Hackathon', issuer: 'PW Institute of Innovation', date: '19–20 Feb 2026', iso: '2026-02-20', track: 'Internships & events', file: './certs/rift-26-hackathon.jpg', credentialId: 'd8d6af1b-922d-4189-998d-c261e4af3baf', kind: 'Certificate of appreciation · Team Aura' },
  { slug: 'tech-vision-2026', title: 'Tech Vision 2026 — Consolation prize', issuer: 'CMR Institute of Technology', date: '13 Feb 2026', iso: '2026-02-13', track: 'Internships & events', kind: 'National-level project expo · Assistive Technology' },
  { slug: 'bnmit-internship-cpp-embedded', title: 'Internal Internship I — C++ and Embedded Systems', issuer: 'B.N.M. Institute of Technology', date: '21 Jul – 9 Aug 2025', iso: '2025-08-09', track: 'Internships & events', file: './certs/bnmit-internship-cpp-embedded.jpg', kind: 'Certificate of completion' },
]
