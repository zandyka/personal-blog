import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowDownRight, Github, Linkedin, Instagram, Mail, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundContext } from './ui/SoundProvider';
import SpotlightOverlay from './ui/SpotlightOverlay';

const GREETING_FONTS = [
  { name: 'Playfair Italic', font: "'Playfair Display', 'Georgia', serif", style: 'italic', weight: 600 },
  { name: 'JetBrains Mono', font: "'JetBrains Mono', monospace", style: 'normal', weight: 600 },
  { name: 'Caveat Script', font: "'Caveat', cursive", style: 'normal', weight: 700, sizeAdjust: true },
  { name: 'Cinzel Roman', font: "'Cinzel', 'Times New Roman', serif", style: 'normal', weight: 700, letterSpacing: '0.06em' },
  { name: 'Space Grotesk', font: "'Space Grotesk', sans-serif", style: 'normal', weight: 700 },
  { name: 'Syne Display', font: "'Syne', sans-serif", style: 'italic', weight: 800 },
];

const HERO_LINES = [
  { text: 'WEB & DESIGN,', delay: 0 },
  { text: 'MOBILE APPS', delay: 0.15 },
  { text: 'DEVELOPER', delay: 0.3 },
];

const SOCIALS = [
  { icon: Github, href: 'https://github.com/zandyka', label: 'GitHub', y: -10 },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/zacky-andyka/', label: 'LinkedIn', y: 10 },
  { icon: Instagram, href: 'https://www.instagram.com/zandyka._/', label: 'Instagram', x: 8 },
];

const Hero = () => {
  const { playClick, playHover } = useSoundContext();
  const location = useLocation();
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % GREETING_FONTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: 'clamp(480px, 80vh, 740px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Dot grid background */}
      <div
        className="dot-grid"
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      {/* Spotlight beams */}
      <SpotlightOverlay />

      {/* Main content */}
      <main style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(108px, 15vh, 156px)',
        paddingBottom: 'clamp(32px, 5vh, 60px)',
        zIndex: 10,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Hero text block - with generous left clearance from the Available sidebar */}
        <div
          className="hero-text-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '0 clamp(20px, 3.5vw, 44px)',
            paddingLeft: 'clamp(56px, 7vw, 110px)',
          }}
        >

          {/* Typographic Identity Capsule for Zacky Andyka */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="hero-intro-eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 18px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              width: 'fit-content',
              marginBottom: 'clamp(10px, 1.8vh, 16px)',
            }}
          >
            {/* Dynamic Font Changing Greeting + Title Case Name */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minWidth: '56px',
                  justifyContent: 'flex-start',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={fontIndex}
                    initial={{ opacity: 0, y: 4, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -4, filter: 'blur(3px)' }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{
                      fontFamily: GREETING_FONTS[fontIndex].font,
                      fontStyle: GREETING_FONTS[fontIndex].style,
                      fontWeight: GREETING_FONTS[fontIndex].weight,
                      letterSpacing: GREETING_FONTS[fontIndex].letterSpacing || 'normal',
                      fontSize: GREETING_FONTS[fontIndex].sizeAdjust
                        ? `calc(clamp(13px, 1.15vw, 15px) * 1.15)`
                        : 'clamp(13px, 1.15vw, 15px)',
                      color: 'var(--accent)',
                      display: 'inline-block',
                      lineHeight: 1,
                    }}
                  >
                    Hi, I'm
                  </motion.span>
                </AnimatePresence>
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(13px, 1.15vw, 15px)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  textShadow: '0 0 16px rgba(255, 255, 255, 0.2)',
                  lineHeight: 1,
                }}
              >
                Zacky Andyka
              </span>
            </div>
          </motion.div>

          {/* Line 1: WEB & DESIGN, */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(2.3rem, 7.5vw, 7.6rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              margin: 0,
              padding: 0,
              textAlign: 'left',
            }}
            className="text-gradient-static"
          >
            WEB &amp; DESIGN,
          </motion.h1>

          {/* Line 2: MOBILE APPS with desktop floating socials */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              gap: '24px',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.3rem, 7.5vw, 7.6rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              className="text-gradient-static"
            >
              <span>MOBILE APPS</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', margin: '0 0.08em', color: 'var(--accent)' }}
              >
                <Sparkles style={{ width: '0.36em', height: '0.36em' }} />
              </motion.span>
            </motion.h1>

            {/* Desktop Socials Row - placed neatly on the right side of Line 2 */}
            <div
              className="hero-socials-float"
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginRight: '20px',
              }}
            >
              {SOCIALS.map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.15, opacity: 1 }}
                  onMouseEnter={() => { playHover(); setHoveredSocial(label); }}
                  onMouseLeave={() => setHoveredSocial(null)}
                  onClick={playClick}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Line 3: DEVELOPER + Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.3rem, 7.5vw, 7.6rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: 0,
              }}
              className="text-gradient-static"
            >
              DEVELOPER
            </motion.h1>

            {/* Tagline beside AI ENGINEER */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="hero-tagline-wrapper"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '0.4em',
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              </div>
              <p
                style={{
                  fontSize: 'clamp(9.5px, 0.85vw, 11.5px)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  lineHeight: 1.6,
                  maxWidth: '240px',
                  fontWeight: 500,
                  margin: 0,
                }}
                className="hero-tagline-text"
              >
                Open to all forms of collaboration, regardless of location and language.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mobile social links - placed right under the typography block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="hero-mobile-socials"
          style={{
            gap: '12px',
            alignItems: 'center',
            padding: '14px clamp(16px, 3vw, 36px)',
            display: 'none',
          }}
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              aria-label={label}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              }}
            >
              <Icon size={18} />
            </a>
          ))}
          <a
            href="mailto:zackyandyka1@gmail.com"
            onClick={playClick}
            aria-label="Email"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            <Mail size={18} />
          </a>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            margin: '0 auto',
            maxWidth: '1400px',
            width: '100%',
            padding: '0 32px',
            marginTop: 'clamp(40px, 6vh, 80px)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}>
            {/* Divider line */}
            <div className="hide-mobile" style={{
              flex: 1,
              height: '1px',
              background: 'var(--border)',
            }} />

            {/* Location tag */}
            <span className="font-mono" style={{
              fontSize: 'clamp(9px, 1vw, 12px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              MEDAN, ID — 2026
            </span>

            {/* View Resume expanding pill */}
            <motion.a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hero-resume-pill"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--text)',
                height: '48px',
                width: '48px',
                borderRadius: '999px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 8px 30px var(--shadow-color)',
                transition: 'width 0.5s cubic-bezier(0.23,1,0.32,1)',
                cursor: 'pointer',
              }}
            >
              <span style={{
                whiteSpace: 'nowrap',
                opacity: 0,
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--bg)',
                paddingLeft: '20px',
                paddingRight: '52px',
                transition: 'opacity 0.2s',
              }} className="pill-label">
                View Resume
              </span>
              <div style={{
                position: 'absolute',
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                color: 'var(--bg)',
                transition: 'transform 0.5s',
              }} className="pill-icon">
                <ArrowDownRight size={18} />
              </div>
            </motion.a>
          </div>
        </motion.div>
      </main>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 10,
        }}
      >
        <span className="font-mono" style={{
          fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '3px', textTransform: 'uppercase',
        }}>scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={14} style={{ color: 'var(--text-dim)' }} />
        </motion.div>
      </motion.div>

      {/* Responsive adjustments */}
      <style>{`
        @media (min-width: 860px) {
          .hero-intro-eyebrow { display: inline-flex !important; }
          .hero-socials-float { display: flex !important; }
          .hero-mobile-socials { display: none !important; }
        }
        @media (max-width: 859px) {
          #hero {
            min-height: auto !important;
            overflow: visible !important;
            padding-bottom: 60px !important;
          }
          .hero-text-container {
            padding-left: clamp(32px, 8vw, 50px) !important;
            padding-right: 16px !important;
          }
          .hero-intro-eyebrow {
            display: inline-flex !important;
            margin-bottom: 8px !important;
          }
          .hero-socials-float {
            display: none !important;
          }
          .hero-mobile-socials {
            display: flex !important;
          }
          .hero-tagline-wrapper {
            margin-top: 10px !important;
            padding-left: 0 !important;
          }
          .hero-tagline-text {
            max-width: 100% !important;
            font-size: 11px !important;
            letter-spacing: 0.12em !important;
            line-height: 1.5 !important;
          }
        }
        .hero-resume-pill:hover {
          width: 180px !important;
        }
        .hero-resume-pill:hover .pill-label {
          opacity: 1 !important;
          transition-delay: 0.15s !important;
        }
        .hero-resume-pill:hover .pill-icon {
          transform: rotate(45deg) !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;