import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { ArrowDown, Check, Copy, RotateCw, Sparkles, Compass, Eye } from 'lucide-react';

// Custom useTypewriter Hook as specified in prompt
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    timeoutId = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// 4 Angle Sprites from @[3d] assets
const CAT_SPRITES = {
  front: '/3d/cat-front.png',
  right: '/3d/cat-right.png',
  back: '/3d/cat-back.png',
  left: '/3d/cat-left.png',
};

export default function MainframeHero({ onExploreClick }) {
  const { playClick, playHover } = useSoundContext();
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3D Mascot State
  const [angle, setAngle] = useState(0); // 0 to 360 degrees
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isSpinningTrick, setIsSpinningTrick] = useState(false);

  const stageRef = useRef(null);
  const lastPointerX = useRef(0);
  const velocityX = useRef(0);
  const animFrameRef = useRef(null);

  // Preload all 4 sprites immediately so angle transitions have 0 latency
  useEffect(() => {
    Object.values(CAT_SPRITES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Typewriter text
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  // Trigger pill visibility at 400ms independent of typewriter
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotation loop if enabled
  useEffect(() => {
    if (!autoRotate || isDragging || isSpinningTrick) return;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 1.2) % 360);
    }, 24);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging, isSpinningTrick]);

  // Window mouse move: subtle tilt & cursor tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) return;
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({
        x: -yPercent * 10,
        y: xPercent * 14,
      });

      // If not dragging and not auto-rotating, moving cursor horizontally
      // gently shifts the mascot perspective between left, front, and right
      if (!autoRotate) {
        // Map cursor X: left (< -0.3) -> 270 (left), center -> 0 (front), right (> 0.3) -> 90 (right)
        const targetDeg = xPercent * 90;
        const normalized = (targetDeg + 360) % 360;
        setAngle((prev) => {
          // Smooth interpolation towards cursor
          const diff = ((normalized - prev + 540) % 360) - 180;
          return (prev + diff * 0.08 + 360) % 360;
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isDragging, autoRotate]);

  // Direct Drag Handler (Mouse & Touch on 3D Stage)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastPointerX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    velocityX.current = 0;
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - lastPointerX.current;
      lastPointerX.current = clientX;
      velocityX.current = deltaX;

      setAngle((prev) => {
        const next = prev + deltaX * 0.9;
        return (next % 360 + 360) % 360;
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Momentum / inertia coasting
    let curVel = velocityX.current * 0.8;
    const coast = () => {
      if (Math.abs(curVel) > 0.1) {
        setAngle((prev) => (prev + curVel + 360) % 360);
        curVel *= 0.92;
        animFrameRef.current = requestAnimationFrame(coast);
      }
    };
    animFrameRef.current = requestAnimationFrame(coast);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Playful click spin trick
  const handleMascotClick = () => {
    if (isSpinningTrick) return;
    try {
      playClick?.();
    } catch {}
    setIsSpinningTrick(true);
    const startAngle = angle;
    const targetAngle = startAngle + 360;
    const duration = 750;
    const startTime = performance.now();

    const spinStep = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAngle((startAngle + eased * 360) % 360);

      if (progress < 1) {
        requestAnimationFrame(spinStep);
      } else {
        setIsSpinningTrick(false);
      }
    };
    requestAnimationFrame(spinStep);
  };

  // Determine which sprite to display based on current normalized angle
  const normalizedAngle = ((angle % 360) + 360) % 360;
  let currentSprite = 'front';
  let subAngle = 0;

  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    currentSprite = 'front';
    subAngle = normalizedAngle >= 315 ? normalizedAngle - 360 : normalizedAngle;
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    currentSprite = 'right';
    subAngle = normalizedAngle - 90;
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    currentSprite = 'back';
    subAngle = normalizedAngle - 180;
  } else {
    currentSprite = 'left';
    subAngle = normalizedAngle - 270;
  }

  // Perspective 3D rotation transform values
  const currentRotateY = subAngle * 0.35 + tilt.y * 0.6;
  const currentRotateX = tilt.x * 0.7;

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    try {
      playClick?.();
    } catch {}

    const email = 'hello@mainframe.co';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handlePillClick = (label) => {
    try {
      playClick?.();
    } catch {}
    if (onExploreClick) {
      onExploreClick();
    } else {
      const albumSection = document.getElementById('album-gallery-section');
      if (albumSection) {
        albumSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const setAnglePreset = (targetDeg) => {
    try {
      playClick?.();
    } catch {}
    setAngle(targetDeg);
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg)',
        padding: '80px clamp(20px, 5vw, 64px) 40px',
      }}
    >
      {/* 1. Ambient Dynamic Studio Backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 75% 45%, var(--accent-glow) 0%, transparent 60%), radial-gradient(circle at 20% 20%, var(--accent-2-dim) 0%, transparent 50%)',
          opacity: 0.85,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Cyber Grid Matrix Dots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 2. Main Content Grid: Left Info & Right 3D Cat Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.95fr)',
          alignItems: 'center',
          gap: 'clamp(24px, 4vw, 60px)',
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: Mainframe Text & Actions */}
        <div style={{ maxWidth: '640px', zIndex: 12 }}>
          {/* Blurred Intro Label */}
          <div
            aria-hidden="true"
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              marginBottom: '20px',
              fontSize: 'clamp(18px, 3.8vw, 25px)',
              lineHeight: 1.3,
              fontWeight: 500,
              color: 'var(--text)',
              filter: 'blur(3.5px)',
              letterSpacing: '-0.01em',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </div>

          {/* Typewriter Text */}
          <p
            style={{
              color: 'var(--text)',
              marginBottom: '28px',
              fontSize: 'clamp(18px, 4vw, 27px)',
              lineHeight: 1.35,
              fontWeight: 500,
              minHeight: '62px',
              letterSpacing: '-0.015em',
            }}
          >
            {displayed}
            {!done && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.1em',
                  background: 'var(--accent)',
                  verticalAlign: 'middle',
                  marginLeft: '3px',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            )}
          </p>

          {/* Action Pill Buttons (Slide-up & Fade-in at 400ms) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(12px)',
              transition:
                'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate'].map(
              (label, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handlePillClick(label)}
                  onMouseEnter={playHover}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    fontSize: 'clamp(13px, 2vw, 15px)',
                    fontWeight: 500,
                    padding: '6px 18px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px var(--shadow-color)',
                    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
                  }}
                >
                  {label}
                </motion.button>
              )
            )}

            {/* Outline Pill Button: Reach us: hello@mainframe.co */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCopyEmail}
              onMouseEnter={playHover}
              title="Klik untuk menyalin email"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: copied ? 'var(--accent-dim)' : 'transparent',
                color: copied ? 'var(--accent)' : 'var(--text)',
                border: copied ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                borderRadius: '999px',
                fontSize: 'clamp(13px, 2vw, 15px)',
                fontWeight: 500,
                padding: '6px 18px',
                gap: '10px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>
                Reach us:{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  hello@mainframe.co
                </span>
              </span>
              {copied ? <Check size={13} style={{ color: 'var(--accent)' }} /> : <Copy size={13} />}
            </motion.button>
          </div>

          {/* Mouse-Scrub Hint & Scroll Down Call to Action */}
          <div
            style={{
              marginTop: '34px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <button
              onClick={() => {
                playClick?.();
                const albumSection = document.getElementById('album-gallery-section');
                if (albumSection) {
                  albumSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <ArrowDown size={14} style={{ color: 'var(--accent)' }} />
              </motion.span>
              <span>Putar / drag maskot 3D 360° • Gulir untuk lihat galeri</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Cat Mascot Stage */}
        <div
          ref={stageRef}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
          }}
          className="hero-cat-stage-container"
        >
          {/* Luminous Aura Behind Mascot */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(440px, 85vw)',
              height: 'min(440px, 85vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 68%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Hologram Stage Pedestal Ring */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(360px, 75vw)',
              height: '70px',
              borderRadius: '50%',
              border: '1px solid var(--accent-border)',
              background: 'radial-gradient(ellipse at center, var(--accent-dim) 0%, transparent 75%)',
              boxShadow: '0 0 35px var(--accent-glow)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* 3D Cat Interactive Viewport & Floating Motion */}
          <motion.div
            animate={{
              y: isDragging ? 0 : [-6, 6, -6],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.8,
              ease: 'easeInOut',
            }}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            onClick={handleMascotClick}
            title="Klik untuk melompat/berputar, drag untuk memutar 360°"
            style={{
              position: 'relative',
              width: 'clamp(280px, 32vw, 460px)',
              aspectRatio: '1 / 1',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
              zIndex: 5,
              perspective: '1000px',
            }}
            className="mascot-3d-viewport"
          >
            {/* The 3D Container with Perspective Transform */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transform: `perspective(1000px) rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg)`,
                transition: isDragging ? 'none' : 'transform 0.22s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* FRONT VIEW (0°) */}
              <img
                src={CAT_SPRITES.front}
                alt="Maskot Kucing USU - Depan"
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: currentSprite === 'front' ? 1 : 0,
                  transition: 'opacity 0.12s ease-out',
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.45))',
                  pointerEvents: 'none',
                  willChange: 'opacity, transform',
                }}
              />

              {/* RIGHT VIEW (90°) */}
              <img
                src={CAT_SPRITES.right}
                alt="Maskot Kucing USU - Kanan"
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: currentSprite === 'right' ? 1 : 0,
                  transition: 'opacity 0.12s ease-out',
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.45))',
                  pointerEvents: 'none',
                  willChange: 'opacity, transform',
                }}
              />

              {/* BACK VIEW (180°) */}
              <img
                src={CAT_SPRITES.back}
                alt="Maskot Kucing USU - Belakang"
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: currentSprite === 'back' ? 1 : 0,
                  transition: 'opacity 0.12s ease-out',
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.45))',
                  pointerEvents: 'none',
                  willChange: 'opacity, transform',
                }}
              />

              {/* LEFT VIEW (270°) */}
              <img
                src={CAT_SPRITES.left}
                alt="Maskot Kucing USU - Kiri"
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: currentSprite === 'left' ? 1 : 0,
                  transition: 'opacity 0.12s ease-out',
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.45))',
                  pointerEvents: 'none',
                  willChange: 'opacity, transform',
                }}
              />
            </div>
          </motion.div>

          {/* 3D HUD Controls & Presets */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Angle Badge HUD */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                color: 'var(--text)',
                boxShadow: '0 4px 18px var(--shadow-color)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <Compass size={12} style={{ color: 'var(--accent)' }} />
              <span>
                360° MASCOT • {Math.round(normalizedAngle)}° [{currentSprite}]
              </span>
            </div>

            {/* Quick Angle Presets & Auto-Spin Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--surface-2)',
                padding: '4px 6px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
              }}
            >
              {[
                { label: 'Depan', deg: 0, key: 'front' },
                { label: 'Kanan', deg: 90, key: 'right' },
                { label: 'Belakang', deg: 180, key: 'back' },
                { label: 'Kiri', deg: 270, key: 'left' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setAnglePreset(item.deg)}
                  onMouseEnter={playHover}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: 'none',
                    background: currentSprite === item.key ? 'var(--accent)' : 'transparent',
                    color: currentSprite === item.key ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div
                style={{
                  width: '1px',
                  height: '14px',
                  background: 'var(--border)',
                  margin: '0 2px',
                }}
              />

              {/* Auto Spin Toggle */}
              <button
                onClick={() => {
                  try {
                    playClick?.();
                  } catch {}
                  setAutoRotate((p) => !p);
                }}
                title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Putar 360° Otomatis'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: 'none',
                  background: autoRotate ? 'var(--accent-dim)' : 'transparent',
                  color: autoRotate ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                <RotateCw
                  size={11}
                  style={{
                    animation: autoRotate ? 'spin 3s linear infinite' : 'none',
                  }}
                />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Blink & Spin & Responsiveness */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 960px) {
          .hero-grid-container {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding-top: 20px;
          }
          .hero-cat-stage-container {
            order: -1;
            margin-bottom: 8px;
          }
          .mascot-3d-viewport {
            width: clamp(230px, 60vw, 320px) !important;
          }
        }
      `}</style>
    </section>
  );
}
