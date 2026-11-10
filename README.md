<div align="center">

# ⚡ Zacky Andyka — Personal Portfolio Website

Personal portfolio built with **React 18** and **Vite**, featuring an AI profile assistant ("Ask Zacky AI"), an in-browser BISINDO sign-language translator demo, WebGL visuals, and animated page transitions. Deployed on **Vercel**.

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## 🌟 Features

- **Ask Zacky AI** — chat assistant that answers questions about the profile. Common questions are answered instantly from a local knowledge base; other questions go to `/api/chat` (Google Gemini 2.5 Flash, with Groq Llama 3.3 as fallback, and a local fallback when no API key is set).
- **HandSpeak Playground** (`/playground`) — real-time BISINDO alphabet & word recognition in the browser: MediaPipe Hand Landmarker extracts hand landmarks, then a small dense neural network (weights in `public/models/*.bin`) runs in plain JavaScript.
- **WebGL visuals** — Three.js interactive ID-card lanyard and blinking-squares hero background, OGL morph slider on the gallery page.
- **Pages** — Home, About (journey map, GitHub contribution graph, certifications), Experience, Projects, Album/Gallery, Contact (FormSubmit AJAX form + FAQ), Playground.
- **Micro-interactions** — custom cursor, click sparks, floating pet, synthesized UI sounds (Web Audio API), dark/light theme with persistence.
- **Route-based code splitting** — every page is loaded lazily, so heavy libraries (Three.js, MediaPipe, OGL) are only downloaded on the pages that use them.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18, React Router v7 |
| Build | Vite 5 |
| Animation | Framer Motion, GSAP |
| 3D / WebGL | Three.js, OGL |
| AI / ML | MediaPipe Tasks Vision, custom JS inference; Gemini / Groq via serverless function |
| Icons | Lucide React, developer-icons |
| Styling | Vanilla CSS (custom properties) + inline styles |
| Hosting | Vercel (static + serverless `api/`), Vercel Analytics |
| Linting | ESLint 10 (flat config) |

---

## 📁 Project Structure

```text
fortoh/
├── api/
│   └── chat.js               # Serverless endpoint for Ask Zacky AI (origin check, rate limit, input limits)
├── public/                   # Static assets served as-is
│   ├── models/               # Hand landmarker + BISINDO dense-network weights (.bin)
│   ├── wasm/mediapipe/       # Self-hosted MediaPipe WASM runtime
│   ├── gallery/ designs/ certificates/ journey/ logos/ pet/ projects/ about/
│   ├── cv.pdf                # Downloadable CV (/cvats.pdf redirects here)
│   └── porto.pdf             # Downloadable portfolio
├── src/
│   ├── components/           # Page sections (Hero, About, Experience, Projects, Gallery, Contact…)
│   │   ├── handspeak/        # HandSpeak demo, model loader, feature extractor, labels
│   │   └── ui/               # Reusable effects (cursor, sparks, marquee, GradientWaves, MorphSlider…)
│   ├── data/profile.js       # Single source of truth for personal data & contact links
│   ├── hooks/                # useTheme, usePet
│   ├── pages/                # Route views (lazy-loaded from App.jsx)
│   ├── App.jsx               # Providers, global UI, routes
│   ├── index.css             # Design tokens, keyframes, theme variables
│   └── main.jsx              # React bootstrap
├── eslint.config.js
├── vercel.json               # Cache headers, redirects, SPA rewrite
└── vite.config.js            # Vite config + local /api/chat dev middleware
```

> Raw source materials (original photos, design files, certificates) live in root folders such as `foto untuk galery/` and `hasil desain fisik/`. They are git-ignored; only the optimized `.webp` copies in `public/` are deployed.

---

## 🚀 Getting Started

Requires **Node.js 18+**.

```bash
git clone https://github.com/zandyka/portofolio.git
cd portofolio
npm install
cp .env.example .env   # then fill in GEMINI_API_KEY (optional)
npm run dev            # http://localhost:5173
```

`npm run dev` also serves `/api/chat` locally through a Vite middleware, so the AI assistant works without Vercel CLI.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No | Google Gemini key ([AI Studio](https://aistudio.google.com/app/apikey)). Without any key, the assistant uses its local knowledge base. |
| `GROQ_API_KEY` | No | Groq key, used when Gemini fails or is not configured. |
| `ALLOWED_ORIGINS` | No | Extra hostnames allowed to call `/api/chat`, comma-separated (e.g. a custom domain). The site's own host is always allowed. |

Never prefix these with `VITE_` — Vite would embed them in the public JavaScript bundle.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 🔒 `/api/chat` protections

- Only requests whose `Origin`/`Referer` matches the site's own host (or `ALLOWED_ORIGINS`) are accepted.
- Per-IP rate limit: 15 requests per 5 minutes (in-memory, per serverless instance — enable **Vercel Firewall rate limiting** for stronger protection).
- Message limited to 1000 characters; history limited to the last 6 items of 1500 characters each.
- API keys are sent in request headers, never in URLs.

---

## 👤 Author

**Zacky Andyka**
- **Email:** [zackyandyka1@gmail.com](mailto:zackyandyka1@gmail.com)
- **LinkedIn:** [linkedin.com/in/zacky-andyka](https://www.linkedin.com/in/zacky-andyka/)
- **Instagram:** [@zandyka._](https://www.instagram.com/zandyka._/)
- **GitHub:** [@zandyka](https://github.com/zandyka)

---

## 📄 License

No open-source license has been chosen for this repository yet. Personal content (photos, design work, CV, certificates) belongs to the author.
