import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';

/**
 * LoadingScreen Component
 * 
 * Animated introductory loading screen displayed on the user's first visit in a session.
 * Features:
 * - Full-screen overlay with z-index 9999 and bg var(--bg)
 * - Large 'ZA' monogram text that scales and fades in
 * - Thin progress bar filling 0% -> 100% over ~2.5s
 * - Monospace percentage indicator
 * - Slides UP off viewport (translateY(-100vh)) with smooth easing when complete
 * - sessionStorage check for 'loadingShown'
 */
export default function LoadingScreen({ onComplete }) {
  // Sound system hooks
  const soundContext = (() => {
    try {
      return useSoundContext();
    } catch {
      return null;
    }
  })();
  const playWhoosh = soundContext?.playWhoosh || (() => {});
  const playSuccess = soundContext?.playSuccess || (() => {});

  // Check if loading screen was already shown this session
  const [alreadyShown] = useState(() => {
    try {
      return typeof window !== 'undefined' && Boolean(sessionStorage.getItem('loadingShown'));
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // If already shown in session, immediately call onComplete and do not render
  useEffect(() => {
    if (alreadyShown) {
      onComplete?.();
    }
  }, [alreadyShown, onComplete]);

  // Lock body scroll while loading screen is active
  useEffect(() => {
    if (!alreadyShown && !isDone) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [alreadyShown, isDone]);

  // Progress animation over ~2.5 seconds
  useEffect(() => {
    if (alreadyShown) return;

    let animId;
    const duration = 2500; // ~2.5 seconds
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const currentPercent = Math.min(100, Math.floor(fraction * 100));

      setProgress(currentPercent);

      if (fraction < 1) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        try {
          playSuccess();
        } catch {}

        // Brief hold at 100% before triggering exit slide
        const exitTimer = setTimeout(() => {
          try {
            playWhoosh();
          } catch {}
          setIsExiting(true);
        }, 200);

        return () => clearTimeout(exitTimer);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [alreadyShown, playSuccess, playWhoosh]);

  if (alreadyShown || isDone) {
    return null;
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        try {
          sessionStorage.setItem('loadingShown', 'true');
        } catch {}
        onComplete?.();
        setIsDone(true);
      }}
    >
      {!isExiting && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0 }}
          exit={{ y: '-100vh' }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle dot grid background pattern */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--text-dim, #4a4860) 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          />

          {/* Ambient glow behind monogram */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--glow, rgba(129, 140, 248, 0.15)) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          {/* Center Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Monogram 'ZA' */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                fontWeight: 800,
                color: 'var(--accent)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                userSelect: 'none',
                marginBottom: '28px',
                textShadow: '0 0 40px var(--accent-glow, rgba(129, 140, 248, 0.25))',
              }}
            >
              ZA
            </motion.div>

            {/* Progress Bar & Percentage */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Progress Bar Track */}
              <div
                style={{
                  width: '200px',
                  height: '2px',
                  background: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Progress Bar Fill */}
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--accent)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px var(--accent)',
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>

              {/* Percentage in JetBrains Mono */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  marginTop: '12px',
                  userSelect: 'none',
                }}
              >
                {progress}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}