import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { ArrowDown, Check, Copy, Camera, Palette, Users, Grid } from 'lucide-react';
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
function useTypewriter(text, speed = 36, startDelay = 500) {
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

  // 3D Model Selection State
  const [selectedModel, setSelectedModel] = useState(MEME_MODELS[0]);
  const catCanvasRef = useRef(null);

  // Typewriter text adapted to the Album & Visual Gallery
  const { displayed, done } = useTypewriter(
    'Selamat datang di galeri visual. Dokumentasi karya fotografi komersial, perancangan desain kreatif, hingga rekam jejak event berkesan.',
    34,
    500
  );

  // Trigger pill visibility at 400ms
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

    const email = 'zackyandyka1@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

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
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.95fr)',
          alignItems: 'center',
          gap: 'clamp(24px, 4vw, 60px)',
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: Adapted Album Text & Actions */}
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
            Visual Album &amp; Creative Works,
            <br />
            Dokumentasi Fotografi, Desain Grafis &amp; Event Kampus
          </div>

          {/* Typewriter Text */}
          <p
            style={{
              color: 'var(--text)',
              marginBottom: '28px',
              fontSize: 'clamp(18px, 3.8vw, 26px)',
              lineHeight: 1.4,
              fontWeight: 500,
              minHeight: '68px',
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

          {/* Action Pill Buttons tailored to Album categories */}
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
            {[
              { label: 'Semua Galeri', icon: Grid },
              { label: 'Fotografi Komersial', icon: Camera },
              { label: 'Desain & Kreatif', icon: Palette },
              { label: 'Dokumentasi Event', icon: Users },
            ].map(({ label, icon: Icon }, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleScrollToSection}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  justifyContent: 'center',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '999px',
                  fontSize: 'clamp(13px, 2vw, 14.5px)',
                  fontWeight: 500,
                  padding: '7px 18px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px var(--shadow-color)',
                  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
                }}
              >
                <Icon size={14} style={{ color: 'var(--accent)' }} />
                <span>{label}</span>
              </motion.button>
            ))}

            {/* Email Contact Pill */}
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
                fontSize: 'clamp(13px, 2vw, 14.5px)',
                fontWeight: 500,
                padding: '7px 18px',
                gap: '8px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>
                Hubungi:{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  zackyandyka1@gmail.com
                </span>
              </span>
              {copied ? <Check size={13} style={{ color: 'var(--accent)' }} /> : <Copy size={13} />}
            </motion.button>
          </div>

          {/* Clean Scroll Down Action without drag/orbit instruction text */}
          <div style={{ marginTop: '36px' }}>
            <button
              onClick={handleScrollToSection}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
              }}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <ArrowDown size={15} style={{ color: 'var(--accent)' }} />
              </motion.span>
              <span>Lihat Galeri Foto &amp; Dokumentasi</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Cat Stage (Directly touching the floor) */}
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

          {/* Hologram Stage Pedestal Ring (Positioned right under the model at floor level) */}
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

          {/* Model Switcher Chips (Clean & Minimalist - No Depan/Kanan/Belakang text) */}
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
        </div>
      </div>

      {/* Embedded CSS for Blink & Responsiveness */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
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
            width: clamp(250px, 68vw, 340px) !important;
            height: clamp(250px, 68vw, 340px) !important;
          }
        }
      `}</style>
    </section>
  );
}
