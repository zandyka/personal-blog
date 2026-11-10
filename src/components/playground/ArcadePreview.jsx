import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Ghost, Hand } from 'lucide-react';

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

export default function ArcadePreview({ kind }) {
  if (kind === 'pacman') return <Pacman />;
  if (kind === 'tetris') return <Tetris />;
  return <Quiz />;
}
