import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';

/*
 * Splash: huruf "ZACKY ANDYKA" berputar masuk satu per satu secara 3D,
 * penghitung 000–100 dan garis progres, lalu tirai kolom terangkat.
 * variant "short" dipakai saat kembali ke Home: lebih cepat.
 */

const COLUMNS = 6;
const EASE = [0.76, 0, 0.24, 1];
const OUT = [0.16, 1, 0.3, 1];
const WORDS = ['ZACKY', 'ANDYKA'];
const ROLES = ['Web Developer', 'AI Engineer', 'Graphic Designer'];

const pad3 = (n) => String(n).padStart(3, '0');

export default function SplashScreen({ onComplete, variant = 'full' }) {
  const { playWhoosh, playSuccess } = useSoundContext();
  const short = variant === 'short';
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      playWhoosh?.();
    } catch {
      /* suara opsional */
    }
    onComplete?.();
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = short ? 800 : reduce ? 1100 : 2300;
    const start = performance.now();
    let raf = 0;
    let exitTimer = 0;

    const tick = (now) => {
      // timestamp rAF bisa sedikit lebih awal dari `start`, jadi dijepit ke 0..1
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        if (!short) {
          try {
            playSuccess?.();
          } catch {
            /* suara opsional */
          }
        }
        exitTimer = window.setTimeout(() => finishRef.current(), short ? 80 : 320);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
    };
  }, [short, playSuccess]);

  const exitDuration = short ? 0.6 : 0.85;
  const role = ROLES[Math.min(ROLES.length - 1, Math.floor((progress / 100) * ROLES.length))];
  let letterIndex = 0;

  return (
    <motion.div
      key="splash-screen"
      role="status"
      aria-label="Memuat portfolio"
      onClick={finish}
      initial="enter"
      animate="enter"
      exit="exit"
      variants={{
        enter: { opacity: 1 },
        exit: { opacity: 0, transition: { delay: exitDuration + COLUMNS * 0.055 + 0.15, duration: 0.01 } },
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 99999, cursor: 'pointer', overflow: 'hidden' }}
    >
      {/* Tirai kolom: lapisan aksen di belakang, lapisan latar di depan */}
      {Array.from({ length: COLUMNS }).map((_, i) => (
        <div key={i} aria-hidden="true">
          {['var(--accent-solid)', 'var(--bg)'].map((bg, layer) => (
            <motion.div
              key={bg}
              variants={{
                enter: { y: '0%' },
                exit: { y: '-100%', transition: { duration: exitDuration, ease: EASE, delay: (layer === 0 ? 0.1 : 0) + i * 0.055 } },
              }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(i * 100) / COLUMNS}%`,
                width: `calc(${100 / COLUMNS}% + 1px)`,
                background: bg,
              }}
            />
          ))}
        </div>
      ))}

      <motion.div
        variants={{ enter: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
        style={{
          position: 'absolute',
          inset: 0,
          padding: 'clamp(20px, 4vw, 56px)',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          color: 'var(--text)',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: 'var(--text-muted)' }}>
          <span>Portfolio — 2026</span>
          <span style={{ color: 'var(--accent)' }}>{role}</span>
        </div>

        {/* Nama: tiap huruf berputar masuk pada sumbu X */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 900 }}>
          <div
            aria-hidden="true"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.6rem, 11.5vw, 11rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              textTransform: 'none',
              textAlign: 'center',
            }}
          >
            {WORDS.map((word, w) => (
              <div key={word} style={{ display: 'flex', justifyContent: 'center', color: w === 1 ? 'var(--accent)' : 'var(--text)' }}>
                {[...word].map((ch) => {
                  const i = letterIndex++;
                  return (
                    <motion.span
                      key={i}
                      initial={{ rotateX: -95, y: '40%', opacity: 0 }}
                      animate={{ rotateX: 0, y: '0%', opacity: 1 }}
                      transition={{ duration: short ? 0.5 : 0.9, ease: OUT, delay: (short ? 0.02 : 0.07) * i }}
                      style={{ display: 'inline-block', transformOrigin: '50% 100%', backfaceVisibility: 'hidden' }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(40px, 7vw, 96px)',
                lineHeight: 0.8,
                letterSpacing: '-0.05em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pad3(progress)}
            </span>
            <span style={{ color: 'var(--text-muted)', textAlign: 'right' }}>Klik untuk lewati</span>
          </div>
          <div style={{ height: 2, background: 'var(--border)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
