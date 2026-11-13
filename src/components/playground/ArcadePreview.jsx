import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Ghost, Hand } from 'lucide-react';
import { spriteUrl } from '../games/swarm-survivor/sprites';

// Pratinjau animasi mini untuk kartu "Coming Soon" — murni CSS kecuali huruf kuis.

function Pacman() {
  return (
    <div className="pv pv--pacman" aria-hidden="true">
      <span className="pv-dots" />
      <span className="pv-pac" />
      <Ghost className="pv-ghost" size={26} />
    </div>
  );
}

// Tumpukan balok + satu tetromino-T yang jatuh berulang.
const STACK = [
  [0, 4, '#38bdf8'], [1, 4, '#38bdf8'], [2, 4, '#a855f7'], [5, 4, '#facc15'], [6, 4, '#facc15'], [7, 4, '#22c55e'],
  [8, 4, '#22c55e'], [0, 3, '#f97316'], [1, 3, '#f97316'], [7, 3, '#ef4444'], [8, 3, '#ef4444'], [8, 2, '#ef4444'],
];
const PIECE = [[3, 0], [4, 0], [5, 0], [4, 1]];

function Tetris() {
  return (
    <div className="pv pv--tetris" aria-hidden="true">
      <div className="pv-board">
        {STACK.map(([x, y, c]) => (
          <span key={`${x}-${y}`} className="pv-cell" style={{ '--x': x, '--y': y, background: c }} />
        ))}
        <div className="pv-piece">
          {PIECE.map(([x, y]) => (
            <span key={`${x}-${y}`} className="pv-cell" style={{ '--x': x, '--y': y, background: '#38bdf8' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function Quiz() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % LETTERS.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="pv pv--quiz" aria-hidden="true">
      <Hand className="pv-hand" size={30} />
      <div className="pv-timer">
        <svg viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" className="pv-timer__track" />
          <circle key={i} cx="22" cy="22" r="19" className="pv-timer__run" />
        </svg>
        <span key={`l-${i}`} className="pv-letter">
          {LETTERS[i]}
        </span>
      </div>
      <span className="pv-xp">+10 XP</span>
    </div>
  );
}

// Jalan neon dengan matahari, kisi perspektif, dan mobil yang berayun.
function Drift() {
  return (
    <div className="pv pv--stage pv--drift" aria-hidden="true">
      <span className="pvd-sun" />
      <span className="pvd-grid" />
      <span className="pvd-car">
        <i />
      </span>
    </div>
  );
}

// Taman malam bergaya pixel: tiga kucing situs dikerubungi serangga.
const FOES = [
  [-46, -34, 0], [44, -30, 0.5], [-42, 32, 1.0], [46, 34, 1.5], [0, -44, 2.0], [-50, 2, 2.5], [50, -4, 0.9], [8, 44, 1.8],
];

function Survivor() {
  const reduce = useReducedMotion();
  const art = useMemo(
    () => ({
      cats: ['maxwell', 'akmal', 'usu'].map((id) => [spriteUrl(id, 0, 1), spriteUrl(id, 1, 1)]),
      bug: spriteUrl('drone', 0, 1),
      slime: spriteUrl('splitter', 0, 1),
    }),
    [],
  );
  const [f, setF] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setF((n) => 1 - n), 190);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="pv pv--stage pv--survivor" aria-hidden="true">
      {FOES.map(([x, y, d], i) => (
        <img key={i} src={i % 3 === 2 ? art.slime : art.bug} alt="" className="pvs-foe" style={{ '--fx': `${x}cqw`, '--fy': `${y}cqh`, animationDelay: `${d}s` }} />
      ))}
      <span className="pvs-pulse" />
      <span className="pvs-cats">
        {art.cats.map((frames, i) => (
          <img key={i} src={frames[(f + i) % 2]} alt="" />
        ))}
      </span>
    </div>
  );
}

export default function ArcadePreview({ kind }) {
  if (kind === 'pacman') return <Pacman />;
  if (kind === 'tetris') return <Tetris />;
  if (kind === 'drift') return <Drift />;
  if (kind === 'survivor') return <Survivor />;
  return <Quiz />;
}
