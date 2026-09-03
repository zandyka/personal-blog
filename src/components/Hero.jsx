import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Instagram } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import SpotlightOverlay from './ui/SpotlightOverlay';

// Custom Geometric Electric Neon Blue Bolt SVG (matches reference image)
const NeonLightningBolt = () => {
  const { playHover } = useSoundContext();
  return (
    <motion.span
      onMouseEnter={playHover}
      whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 24px #38bdf8)' }}
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
        viewBox="0 0 90 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '0.84em',
          width: 'auto',
          filter: 'drop-shadow(0 0 16px #38bdf8)',
        }}
      >
        <path
          d="M54 6 L14 58 H46 L38 104 L82 48 H48 L54 6 Z"
          stroke="#38bdf8"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
};

// Custom Golden Yellow Robot Character SVG (matches reference image)
const GoldenRobot = () => {
  const { playHover } = useSoundContext();
  return (
    <motion.span
      onMouseEnter={playHover}
      whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.12 }}
      transition={{ duration: 0.5 }}
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
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '0.84em',
          width: 'auto',
          filter: 'drop-shadow(0 0 16px #facc15)',
        }}
      >
        {/* Antenna */}
        <line x1="50" y1="4" x2="50" y2="18" stroke="#facc15" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="50" cy="4" r="4.5" fill="#facc15" />

        {/* Ears */}
        <rect x="8" y="32" width="8" height="18" rx="3" fill="#facc15" />
        <rect x="84" y="32" width="8" height="18" rx="3" fill="#facc15" />

        {/* Head Outline */}
        <rect x="16" y="18" width="68" height="52" rx="14" stroke="#facc15" strokeWidth="6.5" />

        {/* Eyes */}
        <rect x="30" y="34" width="10" height="14" rx="4" fill="#facc15" />
        <rect x="60" y="34" width="10" height="14" rx="4" fill="#facc15" />

        {/* Mouth */}
        <line x1="36" y1="56" x2="64" y2="56" stroke="#facc15" strokeWidth="5.5" strokeLinecap="round" />
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
        background: '#070709',
        overflow: 'hidden',
        userSelect: 'none',
        paddingTop: 'clamp(80px, 12vh, 120px)',
        paddingBottom: 'clamp(40px, 6vh, 60px)',
      }}
    >
      {/* Dot Grid Background */}
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Atmospheric Spotlight Beams */}
      <SpotlightOverlay />

      {/* Diagonal Glass Beam Ray (matches screenshot top-left light sheen) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '70vw',
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 35%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Main Typography Stage */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>

          {/* =========================================================================
              LINE 1: [Bio Paragraph on Left] + [AI & DATA on Right] + [GitHub on top]
              ========================================================================= */}
          <div
            className="hero-line-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap: 'clamp(20px, 4vw, 56px)',
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Bio Paragraph on the Left */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hero-bio-left"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9.5px, 0.95vw, 13px)',
                color: 'var(--text-muted, #94a3b8)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                lineHeight: 1.6,
                maxWidth: '240px',
                fontWeight: 600,
                margin: 0,
                textAlign: 'right',
                paddingBottom: '0.6em',
              }}
            >
              HI, I'M ZACKY ANDYKA.
              <br />
              I BUILD SCALABLE
              <br />
              SYSTEMS BRIDGING
              <br />
              TECH &amp; BANKING.
            </motion.p>

            {/* Giant Title: AI & DATA + Floating GitHub Icon */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Floating GitHub Icon */}
              <motion.a
                href="https://github.com/zandyka"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.85, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.25, color: '#ffffff' }}
                transition={{ delay: 0.6, duration: 0.5 }}
                title="GitHub @zandyka"
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-8px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  zIndex: 20,
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Github size={26} strokeWidth={1.8} />
              </motion.a>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hero-title-text"
                style={{
                  fontSize: 'clamp(3.4rem, 11.5vw, 12rem)',
                  fontWeight: 900,
                  lineHeight: 0.86,
                  letterSpacing: '-0.04em',
                  margin: 0,
                  background: 'linear-gradient(180deg, #FFFFFF 15%, #E2E8F0 60%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                AI &amp; DATA
              </motion.h1>
            </div>
          </div>

          {/* =========================================================================
              LINE 2: [LinkedIn on top-left] + [SOFT] + [Neon Blue Bolt] + [WARE]
              ========================================================================= */}
          <div
            className="hero-line-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              position: 'relative',
              width: '100%',
              marginTop: '-0.06em',
            }}
          >
            {/* Floating LinkedIn Icon */}
            <motion.a
              href="https://www.linkedin.com/in/zacky-andyka/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.85, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.25, color: '#0A66C2' }}
              transition={{ delay: 0.7, duration: 0.5 }}
              title="LinkedIn @zacky-andyka"
              style={{
                position: 'absolute',
                top: '-18px',
                left: 'clamp(8px, 1.5vw, 24px)',
                color: 'rgba(255, 255, 255, 0.75)',
                textDecoration: 'none',
                zIndex: 20,
                display: 'flex',
                padding: '4px',
              }}
            >
              <Linkedin size={26} strokeWidth={1.8} />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hero-title-text"
              style={{
                fontSize: 'clamp(3.4rem, 11.5vw, 12rem)',
                fontWeight: 900,
                lineHeight: 0.86,
                letterSpacing: '-0.04em',
                margin: 0,
                background: 'linear-gradient(180deg, #FFFFFF 15%, #E2E8F0 60%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <span>SOFT</span>
              <NeonLightningBolt />
              <span>WARE</span>
            </motion.h1>
          </div>

          {/* =========================================================================
              LINE 3: [EN] + [Yellow Robot] + [GINEER] + [Instagram] + [Collab on Right]
              ========================================================================= */}
          <div
            className="hero-line-3"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'clamp(16px, 3vw, 48px)',
              position: 'relative',
              width: '100%',
              marginTop: '-0.06em',
            }}
          >
            {/* EN + Robot + GINEER Container */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hero-title-text"
                style={{
                  fontSize: 'clamp(3.4rem, 11.5vw, 12rem)',
                  fontWeight: 900,
                  lineHeight: 0.86,
                  letterSpacing: '-0.04em',
                  margin: 0,
                  background: 'linear-gradient(180deg, #FFFFFF 15%, #E2E8F0 60%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>EN</span>
                <GoldenRobot />
                <span>GINEER</span>
              </motion.h1>

              {/* Floating Instagram Icon above GINEER */}
              <motion.a
                href="https://www.instagram.com/zandyka._/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.85, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.25, color: '#E1306C' }}
                transition={{ delay: 0.8, duration: 0.5 }}
                title="Instagram @zandyka._"
                style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '-10px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  zIndex: 20,
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <Instagram size={26} strokeWidth={1.8} />
              </motion.a>
            </div>

            {/* Collaboration Note on the Right */}
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="hero-collab-right"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 0.88vw, 12px)',
                color: 'var(--text-muted, #94a3b8)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                lineHeight: 1.6,
                maxWidth: '260px',
                fontWeight: 600,
                margin: 0,
                textAlign: 'left',
                paddingBottom: '0.6em',
              }}
            >
              OPEN TO ALL FORMS OF
              <br />
              COLLABORATION,
              <br />
              REGARDLESS OF LOCATION
              <br />
              AND LANGUAGE.
            </motion.p>
          </div>

        </div>
      </main>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '20px',
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

      {/* Responsive adjustments */}
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
