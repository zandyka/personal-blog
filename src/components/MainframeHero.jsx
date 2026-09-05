import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundContext } from './ui/SoundProvider';
import { ArrowDown, Check, Copy } from 'lucide-react';

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

  const videoRef = useRef(null);
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef(null);

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

  // Mouse-scrub video controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;

    const applySeek = () => {
      if (!video || isSeekingRef.current) return;
      if (!video.duration || isNaN(video.duration)) return;

      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.03) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      applySeek();
    };

    video.addEventListener('seeked', handleSeeked);

    // Mouse scrub on window
    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      if (prevXRef.current !== null && video.duration) {
        const delta = currentX - prevXRef.current;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
        applySeek();
      }
      prevXRef.current = currentX;
    };

    // Touch scrub on mobile devices
    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      if (prevXRef.current !== null && video.duration) {
        const delta = currentX - prevXRef.current;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
        applySeek();
      }
      prevXRef.current = currentX;
    };

    const handleResetX = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleResetX);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleResetX);

    // Initial frame preview
    const handleLoaded = () => {
      video.currentTime = 0.1;
    };
    video.addEventListener('loadedmetadata', handleLoaded);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoaded);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleResetX);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleResetX);
    };
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

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(20px, 5vw, 64px)',
      }}
    >
      {/* 1. Full-screen Mouse-Scrub Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '70% center',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 2. Ambient Atmosphere Tint Overlay for theme harmony and readability */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 50%, var(--bg) 0%, transparent 60%), linear-gradient(180deg, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)',
          opacity: 0.82,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Hero Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '620px',
          paddingTop: '60px',
        }}
      >
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
          Mainframe\'s Adaptive Response Interface Agent
        </div>

        {/* Typewriter Text */}
        <p
          style={{
            color: 'var(--text)',
            marginBottom: '28px',
            fontSize: 'clamp(18px, 4vw, 26px)',
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
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate'].map((label, idx) => (
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
          ))}

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
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
              fontSize: '0.82rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
            <span>Geser kursor horizontal untuk scrub video • Gulir untuk lihat galeri</span>
          </button>
        </div>
      </div>
    </section>
  );
}
