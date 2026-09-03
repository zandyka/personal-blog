import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowDownRight, Github, Linkedin, Instagram, Mail, Sparkles, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundContext } from './ui/SoundProvider';
import SpotlightOverlay from './ui/SpotlightOverlay';

const HERO_LINES = [
  { text: 'GRAPHIC DESIGNER,', delay: 0 },
  { text: 'WEB &', delay: 0.15 },
  { text: 'AI ENGINEER', delay: 0.3 },
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
        paddingTop: 'clamp(80px, 12vh, 130px)',
        paddingBottom: 'clamp(32px, 5vh, 60px)',
        zIndex: 10,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Hero text block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 24px' }}>

          {/* Line 1: intro text + WEB & */}
          <div className="hero-line-1" style={{ display: 'flex', gap: '32px', alignItems: 'center', position: 'relative' }}>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              style={{
                fontSize: 'clamp(9px, 1vw, 12px)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                lineHeight: 1.6,
                maxWidth: '220px',
                fontWeight: 500,
                padding: '0 16px',
                display: 'none',
              }}
              className="hero-intro-text"
            >
              Hi, I'm Zacky Andyka. I build solutions bridging tech & banking.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.2rem, 7.5vw, 7.8rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
              }}
              className="text-gradient-static"
            >
              GRAPHIC DESIGNER,
            </motion.h1>
          </div>

          {/* Line 2: WEB & with floating socials */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.2rem, 7.5vw, 7.8rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
              }}
              className="text-gradient-static"
            >
              <span>WEB &amp;</span>
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

          {/* Line 3: AI ENGINEER + tag line */}
          <div className="hero-line-3" style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', position: 'relative' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(2.2rem, 7.5vw, 7.8rem)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: 0,
                padding: '0 16px',
              }}
              className="text-gradient-static"
            >
              AI ENGINEER
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
                padding: '0 16px',
                display: 'none',
              }}
              className="hero-tagline-text"
            >
              Open to all forms of collaboration, regardless of location and language.
            </motion.p>
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
            padding: '12px 40px',
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
          .hero-intro-text { display: block !important; }
          .hero-tagline-text { display: block !important; }
          .hero-socials-float { display: block !important; }
          .hero-mobile-socials { display: none !important; }
        }
        @media (max-width: 859px) {
          #hero {
            min-height: auto !important;
            overflow: visible !important;
            padding-bottom: 60px !important;
          }
          .hero-line-1 {
            flex-direction: column-reverse !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .hero-line-3 {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .hero-intro-text {
            display: none !important;
          }
          .hero-tagline-text {
            display: block !important;
            max-width: 100% !important;
            font-size: 11px !important;
            letter-spacing: 0.12em !important;
            line-height: 1.5 !important;
            margin-top: 10px !important;
          }
          .hero-mobile-socials {
            display: flex !important;
          }
          .hero-socials-float {
            display: none !important;
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