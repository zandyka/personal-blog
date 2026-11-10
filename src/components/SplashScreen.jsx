import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { SPLASH_FRAMES } from './home/homeData';

/*
 * Splash "contact sheet": viewfinder memutar foto-foto asli sambil menghitung
 * 0–100, lalu tirai kolom terangkat. Foto terakhir = potret di hero.
 * variant "short" dipakai saat kembali ke Home: hanya hitungan cepat.
 */

const COLUMNS = 6;
const EASE = [0.76, 0, 0.24, 1];

const pad3 = (n) => String(n).padStart(3, '0');

export default function SplashScreen({ onComplete, variant = 'full' }) {
  const { playWhoosh, playSuccess } = useSoundContext();
  const short = variant === 'short';
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState(0);
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

  // Muat foto viewfinder lebih dulu.
  useEffect(() => {
    if (short) return;
    SPLASH_FRAMES.forEach(({ src }) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, [short]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = short ? 750 : reduce ? 1100 : 2350;
    const start = performance.now();
    let raf = 0;
    let exitTimer = 0;

    const tick = (now) => {
      // timestamp rAF bisa sedikit lebih awal dari `start`, jadi dijepit ke 0..1
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      // pelan di awal, cepat di tengah, melambat di akhir
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (!short && !reduce) setFrame(Math.min(SPLASH_FRAMES.length - 1, Math.floor(t * SPLASH_FRAMES.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        if (!short) {
          setFrame(SPLASH_FRAMES.length - 1);
          try {
            playSuccess?.();
          } catch {
            /* suara opsional */
          }
        }
        exitTimer = window.setTimeout(() => finishRef.current(), short ? 80 : 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
    };
  }, [short, playSuccess]);

  const exitDuration = short ? 0.6 : 0.85;

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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Tirai kolom: lapisan aksen di belakang, lapisan latar di depan */}
      {Array.from({ length: COLUMNS }).map((_, i) => (
        <div key={i} aria-hidden="true">
          <motion.div
            variants={{ enter: { y: '0%' }, exit: { y: '-100%', transition: { duration: exitDuration, ease: EASE, delay: 0.1 + i * 0.055 } } }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(i * 100) / COLUMNS}%`,
              width: `calc(${100 / COLUMNS}% + 1px)`,
              background: 'var(--accent-solid)',
            }}
          />
          <motion.div
            variants={{ enter: { y: '0%' }, exit: { y: '-100%', transition: { duration: exitDuration, ease: EASE, delay: i * 0.055 } } }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(i * 100) / COLUMNS}%`,
              width: `calc(${100 / COLUMNS}% + 1px)`,
              background: 'var(--bg)',
            }}
          />
        </div>
      ))}

      {/* Konten */}
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
          <span>Zacky Andyka</span>
          <span>Portfolio — 2026</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!short && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(150px, 19vw, 230px)',
                  aspectRatio: '4 / 5',
                  background: 'var(--surface)',
                }}
              >
                {SPLASH_FRAMES.map((f, i) => (
                  <img
                    key={f.src}
                    src={f.src}
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: i === frame ? 1 : 0,
                    }}
                  />
                ))}
                {/* sudut viewfinder */}
                {[
                  { top: -8, left: -8, borderWidth: '1px 0 0 1px' },
                  { top: -8, right: -8, borderWidth: '1px 1px 0 0' },
                  { bottom: -8, left: -8, borderWidth: '0 0 1px 1px' },
                  { bottom: -8, right: -8, borderWidth: '0 1px 1px 0' },
                ].map((pos, i) => (
                  <span
                    key={i}
                    style={{ position: 'absolute', width: 16, height: 16, borderStyle: 'solid', borderColor: 'var(--accent)', ...pos }}
                  />
                ))}
              </div>
              <span style={{ color: 'var(--text-muted)', minHeight: '1.6em' }}>
                {String(frame + 1).padStart(2, '0')}/{String(SPLASH_FRAMES.length).padStart(2, '0')} — {SPLASH_FRAMES[frame].caption}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <span
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: short ? 'clamp(64px, 11vw, 140px)' : 'clamp(84px, 16vw, 220px)',
              lineHeight: 0.8,
              letterSpacing: '-0.04em',
              textTransform: 'none',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad3(progress)}
          </span>
          <span style={{ color: 'var(--text-muted)', textAlign: 'right', paddingBottom: 6 }}>
            {short ? 'Kembali ke beranda' : 'Mencetak arsip'}
            <br />
            Klik untuk lewati
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
