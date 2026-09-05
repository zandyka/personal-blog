import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { useTheme } from '../hooks/useTheme';

export default function SplashScreen({ onComplete }) {
  const { playWhoosh, playSuccess } = useSoundContext();
  const { theme } = useTheme();
  const isLight = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.classList.contains('light'));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock body scroll while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Progress animation over ~1.4 seconds
    const duration = 1400;
    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      setProgress(Math.floor(fraction * 100));

      if (fraction < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        try {
          playSuccess?.();
        } catch {}

        const exitTimer = setTimeout(() => {
          try {
            playWhoosh?.();
          } catch {}
          onComplete?.();
        }, 180);

        return () => clearTimeout(exitTimer);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete, playSuccess, playWhoosh]);

  const handleSkip = () => {
    try {
      playWhoosh?.();
    } catch {}
    onComplete?.();
  };

  return (
    <motion.div
      key="splash-screen"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      }}
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: isLight ? '#FAF8F5' : '#070709',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Tactical Dot Grid Background Pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isLight
            ? 'radial-gradient(circle, rgba(25, 24, 26, 0.08) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Ambient Radial Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 45vw, 550px)',
          height: 'clamp(280px, 45vw, 550px)',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 59, 29, 0.16) 0%, rgba(255, 170, 0, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Centered Typography Container: ONLY "Hello I'm.." */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* Kinetic Typography "Hello I'm.." */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.4rem, 7vw, 5.2rem)',
              fontWeight: 800,
              color: isLight ? '#19181A' : '#ffffff',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            {"Hello I'm..".split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.1 + index * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'inline-block',
                  color: char === '.' ? (isLight ? '#2563EB' : '#FF3B1D') : (isLight ? '#19181A' : '#ffffff'),
                  fontWeight: char === '.' ? 900 : 700,
                  textShadow: char === '.' ? (isLight ? '0 0 20px rgba(37, 99, 235, 0.5)' : '0 0 20px #FF3B1D') : (isLight ? '0 0 30px rgba(25, 24, 26, 0.08)' : '0 0 30px rgba(255, 255, 255, 0.2)'),
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>

          {/* Glowing Blinking Caret */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
            style={{
              display: 'inline-block',
              width: 'clamp(3px, 0.5vw, 5px)',
              height: 'clamp(2rem, 6vw, 4.4rem)',
              background: isLight ? '#2563EB' : '#FF3B1D',
              boxShadow: isLight ? '0 0 14px rgba(37, 99, 235, 0.6)' : '0 0 14px #FF3B1D',
              marginLeft: '6px',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Minimal Progress Line Indicator */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '120px' }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            height: '2px',
            background: isLight ? 'rgba(25, 24, 26, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: isLight ? 'linear-gradient(90deg, #2563EB, #7C3AED)' : 'linear-gradient(90deg, #FF3B1D, #FFAA00)',
              borderRadius: '2px',
              boxShadow: isLight ? '0 0 10px rgba(37, 99, 235, 0.5)' : '0 0 10px #FF3B1D',
              transition: 'width 0.05s linear',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
