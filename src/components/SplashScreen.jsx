import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

export default function SplashScreen({ onComplete }) {
  const { playWhoosh, playSuccess } = useSoundContext();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock body scroll while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Progress bar animation (~1.6 seconds)
    const duration = 1600;
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

        // Complete and exit
        const exitTimer = setTimeout(() => {
          try {
            playWhoosh?.();
          } catch {}
          onComplete?.();
        }, 220);

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
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      }}
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: '#070709',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Tactical Dot Grid Pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 50vw, 600px)',
          height: 'clamp(280px, 50vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 59, 29, 0.18) 0%, rgba(255, 170, 0, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Centered Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {/* Step 1: Waving Hand & "Hello I'm.." kinetic split-text */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            padding: '8px 18px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Waving Hand Emoji */}
          <motion.span
            animate={{ rotate: [0, 18, -12, 18, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut',
            }}
            style={{
              display: 'inline-block',
              transformOrigin: '70% 70%',
              fontSize: '1.25rem',
            }}
          >
            👋
          </motion.span>

          {/* Kinetic character-by-character typography for "Hello I'm.." */}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              fontWeight: 600,
              color: '#f1f5f9',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {"Hello I'm..".split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.12 + index * 0.05,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'inline-block',
                  color: char === '.' ? '#FF3B1D' : '#f1f5f9',
                  fontWeight: char === '.' ? 800 : 600,
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
              width: '2.5px',
              height: '16px',
              background: '#FF3B1D',
              boxShadow: '0 0 10px #FF3B1D',
              marginLeft: '2px',
            }}
          />
        </div>

        {/* Step 2: Big Bold Name Reveal ("ZACKY ANDYKA") */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.72,
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 8.5vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #ffffff 15%, #FF3B1D 65%, #FFAA00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 50px rgba(255, 59, 29, 0.35)',
              userSelect: 'none',
            }}
          >
            ZACKY ANDYKA
          </h1>
        </motion.div>

        {/* Step 3: Subtitle & Status Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(255, 255, 255, 0.65)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span>Web &amp; Mobile Developer</span>
          <Sparkles size={13} style={{ color: '#FFAA00', marginLeft: '2px' }} />
        </motion.div>

        {/* Step 4: Minimal Loading Progress Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '160px' }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF3B1D, #FFAA00)',
              borderRadius: '2px',
              boxShadow: '0 0 10px #FF3B1D',
              transition: 'width 0.06s linear',
            }}
          />
        </motion.div>

        {/* Tap to skip prompt */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          style={{
            marginTop: '16px',
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          tap anywhere to enter
        </motion.span>
      </div>
    </motion.div>
  );
}
