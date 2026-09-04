import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Terminal,
  Cpu,
  Database,
  Palette,
  ShieldCheck,
  GitBranch,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

// SVG Brand Icons
const ICONS = {
  react: (
    <svg viewBox="-11.5 -10.23174 23 20.46348" width="18" height="18" fill="#61DAFB">
      <circle cx="0" cy="0" r="2.05" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#3178C6">
      <path d="M1.5 0h21a1.5 1.5 0 011.5 1.5v21a1.5 1.5 0 01-1.5 1.5h-21A1.5 1.5 0 010 22.5v-21A1.5 1.5 0 011.5 0zM12 7.5H5.25v2.25h2.25v8.25h2.25V9.75H12V7.5zm4.5 4.5c1.5 0 2.625.75 2.625 2.25v.375c0 1.5-1.125 2.25-2.625 2.25h-3v-6.75h3.375c1.125 0 1.875.75 1.875 1.875zm-.75 2.625c.375 0 .75-.375.75-.75v-.375c0-.375-.375-.75-.75-.75H15v1.875h.75z" />
    </svg>
  ),
  flutter: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#54C5F8" d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37z" />
      <path fill="#29B6F6" d="M14.286 9.686L8.6 15.371l5.686 5.686h7.4l-9.4-9.371z" />
      <path fill="#0277BD" d="M14.286 21.057l-2.857-2.857 2.857-2.857 2.857 2.857-2.857 2.857z" />
    </svg>
  ),
  android: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#3DDC84">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.412 13.8533 8.1 12 8.1s-3.5902.312-5.1368.8497L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#3776AB" d="M11.91 0C5.9 0 6.27 2.58 6.27 2.58l.01 2.67h5.73v.81H3.92S0 5.61 0 11.64c0 6.02 3.42 5.8 3.42 5.8h2.04v-2.87s-.11-3.42 3.37-3.42h5.81s3.26.05 3.26-3.18V2.58S18.35 0 11.91 0zm-2.8 1.83c.56 0 1.01.46 1.01 1.02s-.45 1.02-1.01 1.02a1.02 1.02 0 110-2.04z" />
      <path fill="#FFD43B" d="M12.09 24c6.01 0 5.64-2.58 5.64-2.58l-.01-2.67H12v-.81h8.08s3.92.45 3.92-5.58c0-6.02-3.42-5.8-3.42-5.8h-2.04v2.87s.11 3.42-3.37 3.42H9.36s-3.26-.05-3.26 3.18v5.39S5.65 24 12.09 24zm2.8-1.83c-.56 0-1.01-.46-1.01-1.02s.45-1.02 1.01-1.02a1.02 1.02 0 110 2.04z" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#2496ED">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.954 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.145a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m5.884 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.186.186v1.888c0 .102.083.185.186.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m-2.954 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.145a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.186v1.888c0 .102.082.185.184.185M23.75 9.89c-.615-.36-1.503-.435-2.227-.247-.36.09-.72.27-.99.54-.45-.48-1.08-.75-1.74-.75-.24 0-.51.03-.75.09-.33-.78-.96-1.35-1.77-1.62l-.48-.15-.3.42c-.54.78-.81 1.71-.81 2.67v.45c0 .24.03.48.06.72-.6.18-1.2.27-1.83.27H2.22c-.63 0-1.23.27-1.65.75-.42.48-.63 1.11-.57 1.74.3 2.88 1.77 5.4 4.17 7.02 2.1 1.41 4.59 2.16 7.14 2.16 7.68 0 12.06-4.59 12.69-10.74.03-.3.21-.57.48-.69.69-.3 1.23-.75 1.56-1.32.24-.42.27-.87.12-1.32-.12-.42-.42-.75-.81-.96" />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.632 17.518l-5.748-7.46v7.46H10.1V6.482h1.784l5.856 7.63v-7.63h1.784v11.036h-1.892z" />
    </svg>
  ),
  tailwindcss: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#38BDF8">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
    </svg>
  ),
  firebase: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#FFA000" d="M3.89 15.67L6.2 1.25a.8.8 0 011.5-.24l3.5 6.55z" />
      <path fill="#F57C00" d="M13.78 7.33l-2.6-4.9a.8.8 0 00-1.42 0L2.1 18.42l9.04 5.08a1.6 1.6 0 001.55 0l9.21-5.18z" />
      <path fill="#FFCA28" d="M21.9 18.42L16.27 7.7a.8.8 0 00-1.42 0l-1.07 2.02z" />
    </svg>
  ),
  vite: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#BD34FE" d="M23.275 3.328L12.56.24a.8.8 0 00-.456.003L1.378 3.518a.8.8 0 00-.547.935l4.57 17.514a.8.8 0 001.074.55l16.143-6.177a.8.8 0 00.518-.76l.7-11.458a.8.8 0 00-.56-.794z" />
      <path fill="#FFD622" d="M14.28 1.133L8.2 13.383h4.482l-3.36 8.766L20.89 8.64h-5.06l4.24-7.507z" />
    </svg>
  ),
  php: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#777BB4">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-5.75 6.5h3c1.5 0 2.5.5 2.5 1.75s-.75 2-2.25 2H8.25L7.5 14H5.5l1.5-7.5h-.75zm6.5 0h2.25l-.75 3.75h1.75c1.5 0 2.25.75 2.25 1.75s-.75 2-2.25 2h-3.25l1.5-7.5h-1.5zm-5 1.5l-.5 2.25h1c.75 0 1.25-.25 1.25-.75s-.25-.75-.75-.75H7.75z" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#F24E1E" d="M8 24a4 4 0 01-4-4 4 4 0 014-4h4v4a4 4 0 01-4 4z" />
      <path fill="#A259FF" d="M4 12a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" />
      <path fill="#F24E1E" d="M4 4a4 4 0 014-4h4v8H8a4 4 0 01-4-4z" />
      <path fill="#FF7262" d="M12 0h4a4 4 0 014 4 4 4 0 01-4 4h-4V0z" />
      <path fill="#1ABCFE" d="M20 12a4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4z" />
    </svg>
  ),
  laravel: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF2D20">
      <path d="M23.644 6.185L13.79.497a1.44 1.44 0 00-1.464 0L2.472 6.185a1.439 1.439 0 00-.722 1.253v11.378c0 .524.28 1.002.722 1.253l9.854 5.688a1.44 1.44 0 001.464 0l9.854-5.688a1.44 1.44 0 00.722-1.253V7.438a1.44 1.44 0 00-.722-1.253zM12.022 2.658l7.986 4.61-3.642 2.1-7.986-4.61 3.642-2.1zm-8.232 5.86l7.464 4.31v8.62L3.79 17.138V8.518zm9.464 12.93v-8.62l7.464-4.31v8.62l-7.464 4.31z" />
    </svg>
  ),
  java: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#ED8B00">
      <path d="M8.851 18.56s-.917.534.667.733c2.083.25 3.333.217 5.75-.25 0 0 .767.483 1.517.65-4.417 1.417-10.017-.183-7.934-1.133m-1.05-3.467s-1.083.717.5.95c2.617.383 4.883.433 8.35-.35 0 0 .533.483 1.183.633-4.917 1.483-12.017.067-10.033-1.233m7.733-5.267c.783.867-.233 1.7-.233 1.7s2.4-1.233 1.3-2.733c-1.15-1.567-2.333-2.333-4.667-3.5 0 0 1.9 1.133 3.6 4.533m-7.067 12.2s-1.85.35-3.233-.5c0 0 1.05.5 3.3.433 2.917-.083 6.6-.717 9.2-3.133 0 0-.583.733-2.317 1.367-2.6 1.017-5.183 1.767-6.95 1.833m13.067-9.5c0 3.3-2.7 5.967-6.034 5.967-2.883 0-5.267-2.033-5.85-4.733 1.483.4 3.017.617 4.617.617 3.35 0 6.183-.933 7.267-1.851M13.2 0C7.75 3.1 9.9 6.2 9.9 6.2c-1.833-2.1-1.3-4.3 3.3-6.2" />
    </svg>
  ),
  supabase: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#3ECF8E">
      <path d="M21.362 9.354H12V.312a.312.312 0 00-.533-.22L.429 11.13a.936.936 0 00.655 1.597H12v9.043a.312.312 0 00.533.22L23.57 10.95a.936.936 0 00-.655-1.597z" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#5FA04E">
      <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm-1.02 18.06c-3.1 0-4.04-1.36-4.04-3.24h1.8c0 1.12.52 1.66 2.24 1.66 1.48 0 2.06-.5 2.06-1.34 0-.74-.38-1.12-1.92-1.46l-1.22-.26c-2.12-.46-3-1.34-3-3 0-1.86 1.42-3.08 3.94-3.08 2.76 0 3.84 1.28 3.84 3.1h-1.8c0-1.02-.48-1.52-2.04-1.52-1.36 0-1.94.46-1.94 1.24 0 .72.4 1.04 1.76 1.34l1.22.26c2.28.5 3.18 1.4 3.18 3.12 0 2.1-1.48 3.18-4.02 3.18z" />
    </svg>
  ),
  dart: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#0075BA">
      <path d="M4.108 0L0 4.108v15.784L4.108 24H19.89L24 19.892V4.108L19.892 0H4.108zm2.148 4.296h11.488l3.064 3.064v9.28l-3.064 3.064H6.256l-3.064-3.064V7.36l3.064-3.064z" />
    </svg>
  ),
  mysql: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#4479A1">
      <path d="M16.56 10.32c-.08-.54-.34-1.44-1.18-1.9-.92-.5-2.22-.44-3.1.28-.62.52-.92 1.26-.88 2.06.06 1.06.84 1.76 1.84 1.94 1.38.24 2.82-.44 3.32-2.38M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.78 12.82c-.38 1.4-1.58 2.5-3.02 2.82-1.74.38-3.56-.24-4.52-1.7-.58-.88-.78-1.94-.68-2.98.16-1.68 1.28-3.08 2.86-3.64 1.8-.64 3.88-.12 4.98 1.44.44.62.62 1.34.62 2.1 0 .66-.08 1.32-.24 1.96z" />
    </svg>
  ),
  gemini: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="#1A73E8" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#F7DF1E">
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.017-.888-1.798-2.876-2.607-.82-.338-1.43-.615-1.43-1.07 0-.442.348-.714.95-.714.615 0 1.008.24 1.328.752l1.92-1.22c-.628-1.066-1.565-1.606-3.23-1.606-2.072 0-3.324 1.157-3.324 2.89 0 1.543.957 2.376 2.766 3.037.935.342 1.52.645 1.52 1.196 0 .54-.473.818-1.218.818-.89 0-1.4-.412-1.782-1.123l-2.022 1.166c.642 1.32 1.764 1.94 3.784 1.94 2.457 0 3.738-1.205 3.738-3.072v-.037h.036v-.35zm-8.877-6.24h-2.472v7.19c0 1.488-.567 1.996-1.776 1.996-.708 0-1.19-.133-1.56-.356l-.504 1.916c.498.246 1.322.42 2.298.42 2.656 0 3.99-1.25 3.99-3.798v-7.368h.024z" />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#4169E1">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V17h-2v1.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93c.33.05.66.07 1 .07s.67-.02 1-.07zM17.9 15.2c-.42-.72-1.07-1.2-2-1.2h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V5h2c1.1 0 2 .9 2 2v1h1c1.1 0 2 .9 2 2 0 1.63-.98 3.03-2.39 3.66.5.6.89 1.31 1.29 2.54z" />
    </svg>
  ),
  express: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.75 13.5l-2.5-3.5 2.5-3.5h-2.25l-1.5 2.25-1.5-2.25H10.25l2.5 3.5-2.5 3.5h2.25l1.5-2.25 1.5 2.25h2.25zM8.25 7h-4.5v10h4.5v-1.75H5.5v-2.5h2.5v-1.75H5.5V8.75h2.75V7z" />
    </svg>
  ),
  claude: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#D97757">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm0 3a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
    </svg>
  ),
  tensorflow: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF6F00">
      <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.95L1.292 5.856zM22.708 5.856L12.46 0v24l4.095-2.378V7.95l6.153-2.094z" />
    </svg>
  ),
  css3: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1572B6">
      <path d="M1.5 0h21l-1.9 21.7L12 24l-8.6-2.3L1.5 0zm17.1 5.3H5.4l.4 4.5h10.9l-.5 5.5-4.2 1.2-4.2-1.2-.3-2.9H4.9l.5 5.3 6.6 1.8 6.6-1.8 1-10.4H18.6z" />
    </svg>
  ),
  html5: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#E34F26">
      <path d="M1.5 0h21l-1.9 21.7L12 24l-8.6-2.3L1.5 0zm16.4 5.3H6.1l.3 3.6h9.6l-.3 3.7H7.1l.3 3.6h8.1l-.4 4.3-3.1.9-3.1-.9-.2-2.1H6.1l.4 4.5 5.5 1.5 5.5-1.5 1.4-15.6z" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#F05032">
      <path d="M23.546 10.93L13.067.452a1.503 1.503 0 00-2.126 0L8.815 2.58l3.197 3.197a1.867 1.867 0 012.36 2.372l3.076 3.076a1.862 1.862 0 012.35 2.383l-.008.008 3.756 3.755a1.504 1.504 0 002.126 0l1.874-1.874a1.503 1.503 0 000-2.126v-.002zm-12.8 1.107l-3.2-3.2L.454 15.93a1.503 1.503 0 000 2.126l7.098 7.098a1.503 1.503 0 002.126 0l6.452-6.452-3.2-3.2a1.867 1.867 0 01-2.184.535z" />
    </svg>
  ),
  bootstrap: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#7952B3">
      <path d="M21.5 4.5c0-1.4-1.1-2.5-2.5-2.5H5C3.6 2 2.5 3.1 2.5 4.5v15c0 1.4 1.1 2.5 2.5 2.5h14c1.4 0 2.5-1.1 2.5-2.5v-15zm-6.2 9.2c0 1.8-1.5 2.8-3.9 2.8H8V7.5h3.3c2.1 0 3.4.9 3.4 2.4 0 1.1-.7 1.9-1.8 2.2 1.4.3 2.4 1.3 2.4 2.6zM10.4 9.1v2.3h1.1c1.1 0 1.8-.4 1.8-1.1 0-.8-.7-1.2-1.8-1.2h-1.1zm0 3.8v2.6h1.4c1.2 0 2-.5 2-1.3 0-.9-.8-1.3-2-1.3h-1.4z" />
    </svg>
  ),
  photoshop: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#31A8FF">
      <path d="M0 0v24h24V0H0zm2.25 2.25h19.5v19.5H2.25V2.25zm4.8 4.2h3.9c2.7 0 4.2 1.3 4.2 3.5 0 2.3-1.6 3.6-4.3 3.6H9.3v3.9H7.05v-11zm2.25 2.1v3h1.6c1.3 0 2-.6 2-1.5 0-1-.7-1.5-2-1.5h-1.6zm7.2 4.65c.9-.4 1.9-.6 2.8-.6 1.4 0 2.2.6 2.2 1.6 0 .9-.7 1.4-1.9 1.7l-1.3.4c-1.8.5-2.8 1.4-2.8 2.9 0 2.1 1.7 3.3 4.3 3.3 1.1 0 2.3-.3 3.2-.8l-.6-1.8c-.8.5-1.7.7-2.6.7-1.4 0-2.2-.6-2.2-1.5 0-.8.7-1.4 1.9-1.7l1.3-.4c2-.6 2.9-1.5 2.9-3 0-2.1-1.6-3.2-4.1-3.2-1.1 0-2.2.3-3 .7l.8 1.8z" />
    </svg>
  ),
};

// 3 Dynamic Marquee Rows
const ROW_1 = [
  { name: 'React', color: '#61DAFB', icon: ICONS.react },
  { name: 'TypeScript', color: '#3178C6', icon: ICONS.typescript },
  { name: 'Flutter', color: '#54C5F8', icon: ICONS.flutter },
  { name: 'Android', color: '#3DDC84', icon: ICONS.android },
  { name: 'Python', color: '#3776AB', icon: ICONS.python },
  { name: 'Docker', color: '#2496ED', icon: ICONS.docker },
  { name: 'Next.js', color: '#ffffff', icon: ICONS.nextjs },
  { name: 'TailwindCSS', color: '#38BDF8', icon: ICONS.tailwindcss },
  { name: 'Firebase', color: '#FFCA28', icon: ICONS.firebase },
  { name: 'Vite', color: '#646CFF', icon: ICONS.vite },
  { name: 'PHP', color: '#777BB4', icon: ICONS.php },
  { name: 'Figma', color: '#F24E1E', icon: ICONS.figma },
];

const ROW_2 = [
  { name: 'Laravel', color: '#FF2D20', icon: ICONS.laravel },
  { name: 'Java', color: '#ED8B00', icon: ICONS.java },
  { name: 'Supabase', color: '#3ECF8E', icon: ICONS.supabase },
  { name: 'Node.js', color: '#5FA04E', icon: ICONS.nodejs },
  { name: 'Dart', color: '#0075BA', icon: ICONS.dart },
  { name: 'MySQL', color: '#4479A1', icon: ICONS.mysql },
  { name: 'Google Gemini AI', color: '#1A73E8', icon: ICONS.gemini },
  { name: 'JavaScript', color: '#F7DF1E', icon: ICONS.javascript },
  { name: 'PostgreSQL', color: '#4169E1', icon: ICONS.postgresql },
  { name: 'Express.js', color: '#ffffff', icon: ICONS.express },
  { name: 'Claude AI', color: '#D97757', icon: ICONS.claude },
  { name: 'Bootstrap 5', color: '#7952B3', icon: ICONS.bootstrap },
];

const ROW_3 = [
  { name: 'TensorFlow AI', color: '#FF6F00', icon: ICONS.tensorflow },
  { name: 'CSS3', color: '#1572B6', icon: ICONS.css3 },
  { name: 'HTML5', color: '#E34F26', icon: ICONS.html5 },
  { name: 'Git Version Control', color: '#F05032', icon: ICONS.git },
  { name: 'Adobe Photoshop', color: '#31A8FF', icon: ICONS.photoshop },
  { name: 'RESTful API', color: '#00B4D8', icon: <Terminal size={18} color="#00B4D8" /> },
  { name: 'Android Studio', color: '#3DDC84', icon: ICONS.android },
  { name: 'Fiber Optic & GPON', color: 'var(--accent)', icon: <Cpu size={18} color="var(--accent)" /> },
  { name: 'Database Architecture', color: '#4479A1', icon: <Database size={18} color="#4479A1" /> },
  { name: 'UI/UX Prototyping', color: '#FFAA00', icon: <Palette size={18} color="#FFAA00" /> },
  { name: 'Clean Architecture', color: '#10B981', icon: <ShieldCheck size={18} color="#10B981" /> },
  { name: 'Agile & Scrum', color: '#C084FC', icon: <GitBranch size={18} color="#C084FC" /> },
];

export default function SkillsTechStack() {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const renderMarqueeRow = (items, direction = 'left', speed = 35) => {
    const tripleList = [...items, ...items, ...items];

    return (
      <div
        className={`skills-marquee-row ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{
          display: 'flex',
          gap: '14px',
          width: 'max-content',
          willChange: 'transform',
          animationDuration: `${speed}s`,
        }}
      >
        {tripleList.map((skill, idx) => (
          <div
            key={`${skill.name}-${idx}`}
            onClick={playClick}
            onMouseEnter={playHover}
            className="skill-pill-card"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '999px',
              background: 'rgba(14, 14, 20, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                flexShrink: 0,
              }}
            >
              {skill.icon}
            </div>
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.2px',
              }}
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="tech-stack"
      ref={ref}
      style={{
        padding: '56px 0 60px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto 36px',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            TECHNICAL STACK &amp; CAPABILITIES
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.9rem)',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 auto 14px',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Skills &amp; Technology Stack</span>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
              }}
            />
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              maxWidth: '640px',
              margin: '0 auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Teknologi, framework modern, ekosistem AI, database, dan tools desain visual yang saya kuasai dan gunakan secara aktif.
          </p>
        </motion.div>
      </div>

      {/* Animated Marquee Cloud (3 Rows) */}
      <div
        className="skills-cloud-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          padding: '8px 0 16px',
        }}
      >
        {/* Left & Right Edge Fade Masks */}
        <div className="skills-mask-left" />
        <div className="skills-mask-right" />

        {/* Row 1: Scroll Left */}
        {renderMarqueeRow(ROW_1, 'left', 36)}

        {/* Row 2: Scroll Right */}
        {renderMarqueeRow(ROW_2, 'right', 42)}

        {/* Row 3: Scroll Left */}
        {renderMarqueeRow(ROW_3, 'left', 38)}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-left {
          animation: scrollLeft linear infinite;
        }

        .marquee-right {
          animation: scrollRight linear infinite;
        }

        /* Marquee Continuous Non-Stop Flow (No pause on hover/click) */
        .skills-marquee-row {
          animation-play-state: running !important;
        }

        /* Pill Hover Glow */
        .skill-pill-card:hover {
          transform: translateY(-3px) scale(1.05) !important;
          border-color: rgba(255, 59, 29, 0.45) !important;
          box-shadow: 0 8px 24px rgba(255, 59, 29, 0.22) !important;
          background: rgba(22, 22, 32, 0.95) !important;
        }

        /* Edge Fade Masks */
        .skills-mask-left,
        .skills-mask-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }
        .skills-mask-left {
          left: 0;
          background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
        }
        .skills-mask-right {
          right: 0;
          background: linear-gradient(to left, var(--bg) 0%, transparent 100%);
        }

        @media (max-width: 768px) {
          .skill-pill-card {
            padding: 8px 14px !important;
            gap: 7px !important;
          }
          .skill-pill-card span {
            font-size: 0.78rem !important;
          }
          .skills-mask-left,
          .skills-mask-right {
            width: 44px !important;
          }
        }
      `}</style>
    </section>
  );
}
