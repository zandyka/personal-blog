import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { ArrowDown, Check, Copy, RotateCw, Box, Sparkles } from 'lucide-react';
import Cat3DCanvas from './ui/Cat3DCanvas';

// Available 3D Models in 3d/ folder
const MEME_MODELS = [
  {
    id: 'maxwell',
    name: 'Maxwell Cat',
    url: '/3d/maxwell_the_cat_with_bones_animation.glb',
    badge: 'ANIMATED',
  },
  {
    id: 'cat_box',
    name: 'Cat in Box',
    url: '/3d/cat_box_meme.glb',
    badge: 'MEME',
  },
  {
    id: 'oiia',
    name: 'Oiia Cat',
    url: '/3d/oiiaioooooiai_cat.glb',
    badge: 'SPINNING',
  },
];

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

export default function MainframeHero({ onExploreClick }) {
  const { playClick, playHover } = useSoundContext();
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3D Model Selection & Control State
  const [selectedModel, setSelectedModel] = useState(MEME_MODELS[0]); // Default: Maxwell
  const [currentAngle, setCurrentAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true); // Default auto-rotate for 3D model
  const catCanvasRef = useRef(null);

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
    setAutoRotate(false);
    if (catCanvasRef.current) {
      catCanvasRef.current.setAngle(targetDeg);
    }
  };

  const handleMascotClick = () => {
    try {
      playClick?.();
    } catch {}
    if (catCanvasRef.current) {
      catCanvasRef.current.triggerSpinTrick();
    }
  };

  const handleModelChange = (model) => {
    try {
      playClick?.();
    } catch {}
    setSelectedModel(model);
  };

  // Direction label
  const getDirectionLabel = (deg) => {
    const norm = ((deg % 360) + 360) % 360;
    if (norm >= 315 || norm < 45) return 'Depan';
    if (norm >= 45 && norm < 135) return 'Kanan';
    if (norm >= 135 && norm < 225) return 'Belakang';
    return 'Kiri';
  };

  const directionName = getDirectionLabel(currentAngle);

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
          gridTemplateColumns: 'minmax(0, 1.12fr) minmax(0, 0.98fr)',
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

          {/* Scroll Down Call to Action */}
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
              <span>Drag / orbit model 3D 360° • Gulir ke bawah untuk lihat galeri</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Cat Stage */}
        <div
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
              bottom: '96px',
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

          {/* 3D Cat Canvas Viewport */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(280px, 34vw, 480px)',
              height: 'clamp(280px, 34vw, 480px)',
              zIndex: 5,
              userSelect: 'none',
            }}
            className="mascot-3d-viewport"
          >
            <Cat3DCanvas
              ref={catCanvasRef}
              modelUrl={selectedModel.url}
              autoRotate={autoRotate}
              onAngleChange={setCurrentAngle}
              onClick={handleMascotClick}
            />
          </div>

          {/* 3D HUD Controls & Model Switcher */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* Model Switcher Chips (Maxwell, Cat in Box, Oiia Cat) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border)',
                padding: '4px 6px',
                borderRadius: '999px',
                boxShadow: '0 4px 20px var(--shadow-color)',
              }}
            >
              {MEME_MODELS.map((m) => {
                const isActive = selectedModel.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleModelChange(m)}
                    onMouseEnter={playHover}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: 'none',
                      background: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Angle Presets & Auto-Spin Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--surface-2)',
                padding: '4px 8px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
              }}
            >
              {/* Direction Indicator */}
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  paddingRight: '4px',
                }}
              >
                {currentAngle}°
              </span>

              {[
                { label: 'Depan', deg: 0 },
                { label: 'Kanan', deg: 90 },
                { label: 'Belakang', deg: 180 },
                { label: 'Kiri', deg: 270 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setAnglePreset(item.deg)}
                  onMouseEnter={playHover}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '999px',
                    border: 'none',
                    background: directionName === item.label ? 'var(--accent)' : 'transparent',
                    color: directionName === item.label ? '#ffffff' : 'var(--text-muted)',
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
                  padding: '3px 8px',
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
            height: clamp(230px, 60vw, 320px) !important;
          }
        }
      `}</style>
    </section>
  );
}
