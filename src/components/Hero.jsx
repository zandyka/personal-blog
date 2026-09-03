import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowDownRight, Github, Linkedin, Instagram, Mail, Sparkles, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundContext } from './ui/SoundProvider';
import SpotlightOverlay from './ui/SpotlightOverlay';

const HERO_LINES = [
  { text: 'WEB &', delay: 0 },
  { text: 'MOBILE', delay: 0.15 },
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
        paddingTop: 'clamp(40px, 6vh, 72px)',
        paddingBottom: 'clamp(20px, 3vh, 40px)',
        zIndex: 10,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Hero text block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 24px' }}>

          {/* Animated Intro Typography: "Hello I'm.." */}
          <motion.div
            key={`hero-greeting-${location.key}`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-greeting-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '10px',
              padding: '0 16px',
            }}
          >
            {/* Pill Capsule with Waving Hand & "Hello I'm.." character animation */}
            <div
              className="hero-greeting-capsule"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Waving Hand Emoji */}
              <motion.span
                animate={{ rotate: [0, 18, -10, 18, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
                style={{
                  display: 'inline-block',
                  transformOrigin: '70% 70%',
                  fontSize: '1rem',
                }}
              >
                👋
              </motion.span>

              {/* Kinetic Character-by-Character Typography for "Hello I'm.." */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {"Hello I'm..".split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.1 + index * 0.045,
                      duration: 0.35,
                      ease: 'easeOut',
                    }}
                    style={{
                      display: 'inline-block',
                      color: char === '.' ? 'var(--accent)' : 'inherit',
                      fontWeight: char === '.' ? 800 : 'inherit',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>

              {/* Glowing Blinking Cursor */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '14px',
                  background: 'var(--accent)',
                  marginLeft: '2px',
                  boxShadow: '0 0 6px var(--accent)',
                }}
              />
            </div>

            {/* Name Reveal Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'rgba(255, 59, 29, 0.1)',
                border: '1px solid rgba(255, 59, 29, 0.25)',
                color: 'var(--accent)',
                fontSize: 'clamp(0.82rem, 1.1vw, 0.95rem)',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              <span>Zacky Andyka</span>
              <Sparkles size={13} style={{ color: 'var(--accent-2)' }} />
            </motion.div>
          </motion.div>

          {/* Line 1: WEB & */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(3.2rem, 11vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
              }}
              className="text-gradient-static"
            >
              WEB &
            </motion.h1>
          </div>

          {/* Line 2: MOBILE with floating socials */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(3.2rem, 11vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
              }}
              className="text-gradient-static"
            >
              <span>MOBILE</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-flex', margin: '0 0.05em', color: 'var(--accent)' }}
              >
                <Sparkles style={{ width: '0.35em', height: '0.35em' }} />
              </motion.span>
            </motion.h1>

            {/* Floating social icons - desktop only */}
            <div className="hero-socials-float" style={{ position: 'absolute', right: '60px', top: '-40px', display: 'none' }}>
              {SOCIALS.map(({ icon: Icon, href, label, y, x }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.15 }}
                  onMouseEnter={() => { playHover(); setHoveredSocial(label); }}
                  onMouseLeave={() => setHoveredSocial(null)}
                  onClick={playClick}
                  style={{
                    position: 'absolute',
                    top: `${i * 55}px`,
                    right: `${i * 30}px`,
                    color: 'var(--accent)',
                    display: 'block',
                  }}
                  aria-label={label}
                >
                  <Icon size={28} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Line 3: DEVELOPER + tag line */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(3.2rem, 11vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
              }}
              className="text-gradient-static"
            >
              DEVELOPER
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              style={{
                fontSize: 'clamp(9px, 1vw, 12px)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                lineHeight: 1.6,
                maxWidth: '220px',
                fontWeight: 500,
                paddingBottom: '0.2em',
                display: 'none',
              }}
              className="hero-tagline-text"
            >
              Open to all forms of collaboration, regardless of location and language.
            </motion.p>
          </div>
        </div>

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
              download="Zacky_Andyka_CV.pdf"
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

        {/* Mobile social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="hero-mobile-socials"
          style={{
            display: 'flex',
            gap: '12px',
            padding: '0 32px',
            marginTop: '24px',
          }}
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', textDecoration: 'none',
              }}
            >
              <Icon size={16} />
            </a>
          ))}
          <a
            href="mailto:zackyandyka1@gmail.com"
            onClick={playClick}
            style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', textDecoration: 'none',
            }}
          >
            <Mail size={16} />
          </a>
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

      {/* Availability sidebar - desktop only */}
      <style>{`
        @media (min-width: 860px) {
          .hero-intro-text { display: block !important; }
          .hero-tagline-text { display: block !important; }
          .hero-socials-float { display: block !important; }
          .hero-mobile-socials { display: none !important; }
        }
        @media (max-width: 859px) {
          .hero-mobile-socials { display: flex !important; }
          .hero-socials-float { display: none !important; }
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