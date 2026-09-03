<div align="center">

# ⚡ Zacky Andyka — Personal Portfolio Website

An immersive, high-performance, and responsive personal portfolio web application built with **React 18**, **Vite**, **Framer Motion**, and **Three.js**. Designed with a bold, modern dark aesthetic, interactive 3D elements, real-time audio synthesis, and seamless page transitions.

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🌟 Key Highlights & Features

- **🔥 Bold & Daring Color Palette:** Crafted with an energetic *Electric Vermilion* (`#FF3B1D`) and *Sunfire Amber* (`#FFAA00`) accent system against a deep obsidian carbon backdrop (`#070709`), featuring dark/light mode toggle with persistent local storage.
- **💎 Interactive 3D Model:** A custom Three.js icosahedron crystal gem featuring an inner glow core, dual orbiting torus rings, mouse/touch hover tilt physics, and burst animations on click.
- **⚡ Canvas ClickSpark Particle System:** Pure HTML5 Canvas particle generator that spawns radiant spark trajectories with gravity physics on every mouse interaction.
- **⏳ Monogram Animated Intro:** Elegant full-screen loading sequence with animated "ZA" monogram drawing, progressive percentage counter, and smooth slide-up curtain exit.
- **🔊 Web Audio API Soundscape:** Custom Web Audio oscillator synthesis providing reactive hover, click, transition, and success sounds without heavy external audio files.
- **🎞️ Infinite Tech Marquees:** Smooth, CSS-accelerated infinite horizontal looping ribbons showcasing technology proficiencies and core roles.
- **💼 Structured Career Timeline:** Clearly decoupled sections for **Professional Work Experience** (Corporate Banking, IT Support, Network Engineering) and **Organizational Experience** (HIMTI USU Creative Media Leadership).
- **📸 Interactive Visual Archive:** Filterable masonry gallery showcasing photography, design work, and event coverage with lightbox modal preview.
- **✉️ Direct AJAX Contact Engine:** Seamless contact form communicating directly with FormSubmit AJAX API without requiring external mail client launch.
- **🚀 Route-Aware Auto Scroll:** Instant scroll-to-top execution on navigation transitions to preserve optimal viewport positioning.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Framework & Core** | React 18 (SPA Architecture), React Router v7 |
| **Build Tool** | Vite 5 |
| **3D & Canvas** | Three.js (WebGL), HTML5 Canvas 2D API |
| **Motion & Animation** | Framer Motion, Intersection Observer |
| **Audio Engine** | Web Audio API (Synthesized Oscillators) |
| **Iconography** | Lucide React |
| **Styling** | Vanilla Modern CSS (CSS Custom Properties, Glassmorphism, Responsive Grid) |

---

## 📁 Project Architecture

```text
fortoh/
├── public/                  # Static assets & downloadable PDFs (cv.pdf, porto.pdf)
├── src/
│   ├── components/          # Core feature components
│   │   ├── ui/              # Micro-interaction primitives (ClickSpark, SoundProvider, Marquee, Sidebar)
│   │   ├── About.jsx        # Profile background, education, and skill pillars
│   │   ├── Certifications.jsx # Verified credentials & achievements showcase
│   │   ├── Contact.jsx      # AJAX contact form & direct channels
│   │   ├── Experience.jsx   # Professional & organizational career timelines
│   │   ├── Footer.jsx       # Navigation links, local time widget, and dynamic CTA
│   │   ├── Gallery.jsx      # Filterable masonry media album & lightbox
│   │   ├── Hero.jsx         # Giant typography hero with spotlight effect
│   │   ├── LoadingScreen.jsx# SVG intro animation & progress loader
│   │   ├── Navbar.jsx       # Floating glassmorphism pill navigation
│   │   ├── ProfileModel3D.jsx # Three.js interactive gem canvas
│   │   ├── Projects.jsx     # Flagship projects showcase
│   │   └── Skills.jsx       # Technical proficiency badges
│   ├── data/
│   │   └── profile.js       # Centralized personal & career data source
│   ├── hooks/               # Custom React hooks (useTheme, useScrollReveal, useTypewriter)
│   ├── pages/               # Route views (HomePage, AboutPage, ExperiencePage, ProjectsPage, SkillsPage)
│   ├── App.jsx              # App root, providers, and route declarations
│   ├── index.css            # Design tokens, keyframes, utilities, and theme variables
│   └── main.jsx             # React DOM bootstrap
├── package.json             # Scripts & dependency definitions
├── vite.config.js           # Vite build & plugin configuration
└── README.md                # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (version 18.0 or higher) and **npm** installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zackyandyka/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/` (or the port indicated in your terminal).

### Production Build

To compile and bundle the application for production deployment:

```bash
npm run build
```

The optimized static production output will be generated inside the `dist/` directory, ready to deploy to **Vercel**, **Netlify**, **Cloudflare Pages**, or **GitHub Pages**.

To preview the production build locally:
```bash
npm run preview
```

---

## 👤 Author

**Zacky Andyka**  
- **Email:** [zackyandyka1@gmail.com](mailto:zackyandyka1@gmail.com)  
- **LinkedIn:** [linkedin.com/in/zacky-andyka](https://www.linkedin.com/in/zacky-andyka/)  
- **Instagram:** [@zandyka._](https://www.instagram.com/zandyka._/)  
- **GitHub:** [@zackyandyka](https://github.com/zackyandyka)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it as inspiration for your own portfolio.