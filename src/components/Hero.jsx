import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Instagram } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import SpotlightOverlay from './ui/SpotlightOverlay';

// Electric Vermilion Energy Glyph (Zacky Brand Palette: #FF3B1D)
const EnergyBolt = () => {
  const { playHover } = useSoundContext();
  return (
    <motion.span
      onMouseEnter={playHover}
      whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 22px #FF3B1D)' }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 0.08em',
        verticalAlign: 'middle',
        cursor: 'pointer',
      }}
    >
      <svg
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '0.84em',
          width: 'auto',
          filter: 'drop-shadow(0 0 14px rgba(255, 59, 29, 0.75))',
        }}
      >
        <path
          d="M48 6L14 54H42L34 94L72 44H44L48 6Z"
          stroke="#FF3B1D"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
};

// Sunfire Amber Tech Core Glyph (Zacky Brand Palette: #FFAA00)
const TechCore = () => {
  const { playHover } = useSoundContext();
  return (
    <motion.span
      onMouseEnter={playHover}
      whileHover={{ rotate: 90, scale: 1.15, filter: 'drop-shadow(0 0 22px #FFAA00)' }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 0.08em',
        verticalAlign: 'middle',
        cursor: 'pointer',
      }}
    >
      <svg
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '0.82em',
          width: 'auto',
          filter: 'drop-shadow(0 0 14px rgba(255, 170, 0, 0.75))',
        }}
      >
        <polygon
          points="45,8 56,34 82,45 56,56 45,82 34,56 8,45 34,34"
          stroke="#FFAA00"
          strokeWidth="6"
          strokeLinejoin="round"
          fill="rgba(255, 170, 0, 0.12)"
        />
        <circle cx="45" cy="45" r="4.5" fill="#FFAA00" />
      </svg>
    </motion.span>
  );
};

export default function Hero() {
  const { playClick, playHover } = useSoundContext();

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--bg, #070709)',
        overflow: 'hidden',
        userSelect: 'none',
        paddingTop: 'clamp(72px, 10vh, 100px)',
        paddingBottom: 'clamp(36px, 5vh, 60px)',
      }}
    >
      {/* Tactical Dot Grid Background */}
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Atmospheric Spotlight Beams */}
      <SpotlightOverlay />

      {/* Diagonal Glass Sheen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '65vw',
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 30%, transparent 55%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Main Content Stage */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 44px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

          {/* =========================================================================
              LINE 1: [Bio snippet on left] + [WEB & MOBILE] + [Floating GitHub]
              ========================================================================= */}
          <div
            className="hero-line-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap: 'clamp(16px, 3vw, 40px)',
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Bio Snippet */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="hero-bio-left"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 0.9vw, 12px)',
                color: 'var(--text-muted, #94a3b8)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                lineHeight: 1.6,
                maxWidth: '240px',
                fontWeight: 600,
                textAlign: 'right',
                paddingBottom: '0.8em',
              }}
            >
              <span style={{ color: 'var(--accent, #FF3B1D)', fontWeight: 700 }}>// CREATIVE DEVELOPER</span>
              <br />
              HI, I'M ZACKY ANDYKA.
              <br />
              BUILDING WEB &amp; MOBILE
              <br />
              SOLUTIONS FOR BANKING.
            </motion.div>

            {/* Title: WEB & MOBILE with floating GitHub */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <motion.a
                href="https://github.com/zandyka"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.85, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.2, color: 'var(--accent, #FF3B1D)' }}
                transition={{ delay: 0.5, duration: 0.4 }}
                title="GitHub @zandyka"
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-6px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  zIndex: 20,
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Github size={24} strokeWidth={1.8} />
              </motion.a>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hero-headline"
                style={{
                  fontSize: 'clamp(2.6rem, 8.8vw, 9.2rem)',
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: '-0.035em',
                  margin: 0,
                  background: 'linear-gradient(180deg, #FFFFFF 25%, #E2E8F0 65%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                WEB &amp; MOBILE
              </motion.h1>
            </div>
          </div>

          {/* =========================================================================
              LINE 2: [Floating LinkedIn] + [SOFT] + [EnergyBolt] + [WARE]
              ========================================================================= */}
          <div
            className="hero-line-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              position: 'relative',
              width: '100%',
              marginTop: '-0.04em',
            }}
          >
            <motion.a
              href="https://www.linkedin.com/in/zacky-andyka/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.85, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.2, color: 'var(--accent, #FF3B1D)' }}
              transition={{ delay: 0.6, duration: 0.4 }}
              title="LinkedIn @zacky-andyka"
              style={{
                position: 'absolute',
                top: '-14px',
                left: 'clamp(6px, 1.5vw, 20px)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                zIndex: 20,
                display: 'flex',
                padding: '4px',
              }}
            >
              <Linkedin size={24} strokeWidth={1.8} />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hero-headline"
              style={{
                fontSize: 'clamp(2.6rem, 8.8vw, 9.2rem)',
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                margin: 0,
                background: 'linear-gradient(180deg, #FFFFFF 25%, #E2E8F0 65%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <span>SOFT</span>
              <EnergyBolt />
              <span>WARE</span>
            </motion.h1>
          </div>

          {/* =========================================================================
              LINE 3: [EN] + [TechCore] + [GINEER] + [Instagram] + [Collab note]
              ========================================================================= */}
          <div
            className="hero-line-3"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'clamp(16px, 3vw, 40px)',
              position: 'relative',
              width: '100%',
              marginTop: '-0.04em',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hero-headline"
                style={{
                  fontSize: 'clamp(2.6rem, 8.8vw, 9.2rem)',
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: '-0.035em',
                  margin: 0,
                  background: 'linear-gradient(180deg, #FFFFFF 25%, #E2E8F0 65%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>EN</span>
                <TechCore />
                <span>GINEER</span>
              </motion.h1>

              {/* Floating Instagram */}
              <motion.a
                href="https://www.instagram.com/zandyka._/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.85, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.2, color: 'var(--accent-2, #FFAA00)' }}
                transition={{ delay: 0.7, duration: 0.4 }}
                title="Instagram @zandyka._"
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-6px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  zIndex: 20,
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Instagram size={24} strokeWidth={1.8} />
              </motion.a>
            </div>

            {/* Collaboration Note */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hero-collab-right"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(8.5px, 0.85vw, 11px)',
                color: 'var(--text-muted, #94a3b8)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                lineHeight: 1.6,
                maxWidth: '240px',
                fontWeight: 600,
                textAlign: 'left',
                paddingBottom: '0.8em',
              }}
            >
              <span style={{ color: 'var(--accent-2, #FFAA00)', fontWeight: 700 }}>● OPEN TO COLLAB</span>
              <br />
              GLOBAL &amp; REMOTE
              <br />
              MEDAN, INDONESIA
              <br />
              CLASS OF 2026.
            </motion.div>
          </div>

        </div>
      </main>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          zIndex: 10,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: '9px',
            color: 'var(--text-dim)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          scroll
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={13} style={{ color: 'var(--text-dim)' }} />
        </motion.div>
      </motion.div>

      {/* Mobile Responsive Layout Styles */}
      <style>{`
        @media (max-width: 859px) {
          .hero-bio-left {
            display: none !important;
          }
          .hero-collab-right {
            display: none !important;
          }
          .hero-line-1 {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
