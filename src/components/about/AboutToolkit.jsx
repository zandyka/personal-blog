import { motion } from 'framer-motion';
import {
  React as ReactIcon,
  NextJs,
  TypeScript,
  JavaScript,
  TailwindCSS,
  ViteJS,
  HTML5,
  Bootstrap5,
  Laravel,
  PHP,
  NodeJs,
  ExpressJsDark,
  Supabase,
  PostgreSQL,
  MySQL,
  Firebase,
  Flutter,
  Dart,
  Android,
  Python,
  Tensorflow,
  Gemini,
  ClaudeAI,
  Figma,
  Git,
  GitHubDark,
  Docker,
  Postman,
  Linux,
} from 'developer-icons';
import SectionHead from '../home/SectionHead';

// Dikelompokkan per bidang supaya terbaca "dipakai untuk apa", bukan sekadar deret logo.
// Adobe sengaja tidak dicantumkan: Figma adalah alat desain utama.
const GROUPS = [
  {
    label: 'Frontend',
    note: 'Antarmuka web yang cepat dan rapi.',
    tools: [
      ['React', ReactIcon],
      ['Next.js', NextJs],
      ['TypeScript', TypeScript],
      ['JavaScript', JavaScript],
      ['Tailwind CSS', TailwindCSS],
      ['Vite', ViteJS],
      ['HTML & CSS', HTML5],
      ['Bootstrap 5', Bootstrap5],
    ],
  },
  {
    label: 'Backend & data',
    note: 'API, database, dan integrasi antar-sistem.',
    tools: [
      ['Laravel', Laravel],
      ['PHP', PHP],
      ['Node.js', NodeJs],
      ['Express.js', ExpressJsDark],
      ['Supabase', Supabase],
      ['PostgreSQL', PostgreSQL],
      ['MySQL & MariaDB', MySQL],
      ['Firebase', Firebase],
    ],
  },
  {
    label: 'Mobile & AI',
    note: 'Aplikasi ponsel dan model yang jalan di perangkat.',
    tools: [
      ['Flutter', Flutter],
      ['Dart', Dart],
      ['Android (Java)', Android],
      ['Python', Python],
      ['TensorFlow Lite', Tensorflow],
      ['Gemini API', Gemini],
      ['Claude', ClaudeAI],
    ],
  },
  {
    label: 'Desain & tools',
    note: 'Desain antarmuka, kolaborasi, dan deploy.',
    tools: [
      ['Figma', Figma],
      ['Git', Git],
      ['GitHub', GitHubDark],
      ['Docker', Docker],
      ['Postman', Postman],
      ['Linux', Linux],
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1];

export default function AboutToolkit() {
  const total = GROUPS.reduce((n, g) => n + g.tools.length, 0);

  return (
    <section className="ab-sec" id="tech-stack">
      <div className="h-wrap">
        <SectionHead index="02" label="Perkakas" aside={`${total} alat, 4 bidang`}>
          Alat <em>kerja</em>.
        </SectionHead>

        <div className="ab-tools">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              className="ab-tools__group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: EASE, delay: gi * 0.08 }}
            >
              <span className="h-mono">0{gi + 1}</span>
              <h3>{g.label}</h3>
              <p>{g.note}</p>
              <ul className="ab-tools__list">
                {g.tools.map(([name, Icon]) => (
                  <li key={name} className="ab-tool">
                    <span className="ab-tool__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
