import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import { SIDES_OUTRO, STATS } from './homeData';

const EASE = [0.16, 1, 0.3, 1];

function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setShown(value);
      return undefined;
    }
    const controls = animate(0, value, { duration: 1.8, ease: EASE, onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="h-stat__num">
      {shown.toFixed(decimals)}
      <small>{suffix}</small>
    </span>
  );
}

const withEmphasis = (text) =>
  text.split('*').map((chunk, i) => (i % 2 === 1 ? <em key={i}>{chunk}</em> : chunk));

// Kalimat penutup "dua sisi" + angka yang menghitung naik saat terlihat.
export default function StatsBand() {
  const { playHover, playClick } = useSoundContext();
  return (
    <section className="h-sec h-stats">
      <div className="h-wrap">
        <motion.p
          className="h-sides__outro"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {withEmphasis(SIDES_OUTRO)}
        </motion.p>

        <div className="h-stats__grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="h-stat"
              initial={{ opacity: 0, y: 40, rotateX: -50 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.09 }}
            >
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              <span className="h-mono">{s.label}</span>
              <span className="h-stat__note">{s.note}</span>
            </motion.div>
          ))}
        </div>

        <Link to="/about" className="h-link" onMouseEnter={playHover} onClick={playClick}>
          Selengkapnya tentang saya <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
