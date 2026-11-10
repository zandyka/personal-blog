import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import { OUTRO_QUOTE, STATS } from './homeData';

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

// Kutipan besar (gaya tipografi homepage awal) + angka yang menghitung naik saat terlihat.
export default function StatsBand() {
  const { playHover, playClick } = useSoundContext();
  return (
    <section className="h-sec h-stats">
      <div className="h-wrap">
        <motion.h2
          className="h-quote"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {OUTRO_QUOTE.map((line, i) => (
            <span key={line} className="h-quote__mask">
              <motion.span
                className={`h-quote__line h-quote__line--${i + 1}`}
                variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } }}
              >
                {i === 0 && <span className="h-quote__mark">&ldquo; </span>}
                {line}
                {i === OUTRO_QUOTE.length - 1 && <span className="h-quote__mark">.&rdquo;</span>}
              </motion.span>
            </span>
          ))}
        </motion.h2>

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
