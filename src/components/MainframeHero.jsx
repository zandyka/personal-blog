import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { ArrowDown } from 'lucide-react';
import Cat3DCanvas from './ui/Cat3DCanvas';

// Available 3D Models in 3d/ folder
const MEME_MODELS = [
  {
    id: 'maxwell',
    name: 'Maxwell Cat',
    url: '/3d/maxwell_the_cat_with_bones_animation.glb',
  },
  {
    id: 'cat_box',
    name: 'Cat in Box',
    url: '/3d/cat_box_meme.glb',
  },
  {
    id: 'oiia',
    name: 'Oiia Cat',
    url: '/3d/oiiaioooooiai_cat.glb',
  },
];

// Custom useTypewriter Hook
function useTypewriter(text, speed = 32, startDelay = 400) {
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

  // 3D Model Selection State
  const [selectedModel, setSelectedModel] = useState(MEME_MODELS[0]);
  const catCanvasRef = useRef(null);

  // Redesigned punchy typewriter description
  const { displayed, done } = useTypewriter(
    'Eksplorasi karya fotografi komersial, perancangan identitas visual, hingga dokumentasi momen berkesan di berbagai kegiatan kampus dan organisasi.',
    28,
    450
  );

  const handleScrollToSection = () => {
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
        padding: '90px clamp(20px, 5vw, 64px) 50px',
      }}
    >
      {/* 1. Ambient Dynamic Studio Backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 75% 55%, var(--accent-glow) 0%, transparent 60%), radial-gradient(circle at 20% 25%, var(--accent-2-dim) 0%, transparent 50%)',
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
          gridTemplateColumns: 'minmax(0, 1.18fr) minmax(0, 0.92fr)',
          alignItems: 'center',
          gap: 'clamp(28px, 4vw, 64px)',
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: Revamped High-End Typography & Actions */}
        <div style={{ maxWidth: '640px', zIndex: 12 }}>
          {/* Crisp Eyebrow Badge (No heavy blur bug) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--text)',
              }}
            >
              VISUAL ARCHIVE &bull; PORTFOLIO ALBUM
            </span>
          </motion.div>

          {/* Bold, Expressive Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3.3rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            Koleksi Karya Visual &amp;{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dokumentasi Kreatif.
            </span>
          </motion.h1>

          {/* Typewriter Subtitle Description */}
          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '28px',
              fontSize: 'clamp(0.95rem, 1.25vw, 1.08rem)',
              lineHeight: 1.65,
              fontWeight: 400,
              minHeight: '56px',
              letterSpacing: '-0.01em',
              maxWidth: '560px',
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

          {/* Clean Scroll Down Action */}
          <div style={{ marginTop: '32px' }} className="hero-scroll-btn-desktop">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={handleScrollToSection}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <ArrowDown size={14} />
              </div>
              <span>Jelajahi galeri visual di bawah</span>
            </motion.button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Cat Stage (Touching the floor) */}
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
          {/* Luminous Ambient Aura Behind Mascot */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '52%',
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

          {/* Hologram Stage Pedestal Ring (Positioned directly under the floor level) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '58px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(380px, 80vw)',
              height: '64px',
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
              width: 'clamp(300px, 35vw, 490px)',
              height: 'clamp(300px, 35vw, 490px)',
              zIndex: 5,
              userSelect: 'none',
            }}
            className="mascot-3d-viewport"
          >
            <Cat3DCanvas
              ref={catCanvasRef}
              modelUrl={selectedModel.url}
              autoRotate={true}
              onClick={handleMascotClick}
            />
          </div>

          {/* Model Switcher Chips (Clean & Minimalist) */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '4px',
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
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '12px',
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

          {/* Mobile-only Scroll Down Action below 3D Model */}
          <div className="hero-scroll-btn-mobile">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToSection}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <ArrowDown size={14} />
              </div>
              <span>Jelajahi galeri visual di bawah</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Blink & Responsiveness */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .hero-scroll-btn-mobile {
          display: none;
        }

        @media (max-width: 960px) {
          .hero-grid-container {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            padding-top: 16px;
          }
          .hero-cat-stage-container {
            margin-top: 10px;
            margin-bottom: 8px;
          }
          .mascot-3d-viewport {
            width: clamp(260px, 72vw, 340px) !important;
            height: clamp(260px, 72vw, 340px) !important;
          }
          .hero-scroll-btn-desktop {
            display: none !important;
          }
          .hero-scroll-btn-mobile {
            display: flex !important;
            margin-top: 24px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
