import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';

// 10 Gallery Images in exact order from prompt
const GALLERY_IMAGES = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85',
];

const VIDEO_LEFT_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4';
const VIDEO_RIGHT_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4';

const RANDOM_SYMBOLS = ['8', '$', '^^', '%', '/'];

// Scattered grid layout algorithm as defined in specification
function buildLayout(count, cols) {
  const grid = [];
  let imgIdx = 0;
  let r = 0;
  while (imgIdx < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = imgIdx++;
    if (r % 3 === 0 && imgIdx < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = imgIdx++;
    }
    grid.push(row);
    r++;
  }
  return grid;
}

export default function AlbumPage() {
  const [cols, setCols] = useState(4);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [symbolIndex, setSymbolIndex] = useState(0);

  // DOM Refs
  const spacerRef = useRef(null);
  const cursorRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const blackPanelRef = useRef(null);
  const innerWrapperRef = useRef(null);
  const outroOverlayRef = useRef(null);
  const outroInfoRef = useRef(null);
  const outroBuyRef = useRef(null);
  const outroFooterRef = useRef(null);
  const cardsRef = useRef([]);

  // Logic refs
  const activeSideRef = useRef('right');
  const targetSeekTimeRef = useRef({ left: 0, right: 0 });
  const lastSymbolUpdateRef = useRef(0);
  const loadedVideosRef = useRef({ left: false, right: false });

  // Determine columns by window width
  const updateCols = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) setCols(2);
    else if (w < 1024) setCols(3);
    else setCols(4);
  }, []);

  useEffect(() => {
    updateCols();
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, [updateCols]);

  const gridLayout = buildLayout(GALLERY_IMAGES.length, cols);

  // 1A. Custom Cursor (Desktop Only)
  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  // Video Loaded check
  const checkVideosLoaded = () => {
    if (loadedVideosRef.current.left && loadedVideosRef.current.right) {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }
  };

  // 1G & 1H: Desktop Video Scrubbing Logic
  useEffect(() => {
    const leftVideo = leftVideoRef.current;
    const rightVideo = rightVideoRef.current;
    if (!leftVideo || !rightVideo) return;

    if (isTouchDevice) {
      // Mobile / Touch: Alternate auto-play
      let currentPlaying = 'left';
      leftVideo.style.display = 'block';
      rightVideo.style.display = 'none';
      leftVideo.play().catch(() => {});

      const handleLeftEnded = () => {
        currentPlaying = 'right';
        leftVideo.style.display = 'none';
        rightVideo.style.display = 'block';
        rightVideo.currentTime = 0;
        rightVideo.play().catch(() => {});
      };

      const handleRightEnded = () => {
        currentPlaying = 'left';
        rightVideo.style.display = 'none';
        leftVideo.style.display = 'block';
        leftVideo.currentTime = 0;
        leftVideo.play().catch(() => {});
      };

      leftVideo.addEventListener('ended', handleLeftEnded);
      rightVideo.addEventListener('ended', handleRightEnded);

      return () => {
        leftVideo.removeEventListener('ended', handleLeftEnded);
        rightVideo.removeEventListener('ended', handleRightEnded);
      };
    }

    // Desktop non-touch scrub controller
    let animId;
    let lastX = window.innerWidth / 2;

    const handleWindowMouseMove = (e) => {
      lastX = e.clientX;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });

    const scrubLoop = () => {
      animId = requestAnimationFrame(scrubLoop);

      const width = window.innerWidth;
      const centerX = width / 2;
      const deadZone = Math.max(30, width * 0.05);
      const cursorX = lastX;
      const distFromCenter = cursorX - centerX;

      // Inside dead zone: keep currentTime = 0 on both, show whichever was last active
      if (Math.abs(distFromCenter) <= deadZone) {
        if (leftVideo.duration) leftVideo.currentTime = 0;
        if (rightVideo.duration) rightVideo.currentTime = 0;
        if (activeSideRef.current === 'right') {
          rightVideo.style.display = 'block';
          leftVideo.style.display = 'none';
        } else {
          leftVideo.style.display = 'block';
          rightVideo.style.display = 'none';
        }
        return;
      }

      // Cursor moves LEFT of dead zone -> show RIGHT video, scrub it
      if (distFromCenter < -deadZone) {
        activeSideRef.current = 'right';
        rightVideo.style.display = 'block';
        leftVideo.style.display = 'none';

        const distance = centerX - deadZone - cursorX;
        const availableRange = centerX - deadZone;
        const progress = Math.max(0, Math.min(1, distance / (availableRange || 1)));

        if (rightVideo.duration && !rightVideo.seeking) {
          const targetTime = progress * rightVideo.duration;
          if (Math.abs(rightVideo.currentTime - targetTime) > 0.03) {
            rightVideo.currentTime = targetTime;
          }
        }
      }
      // Cursor moves RIGHT of dead zone -> show LEFT video, scrub it
      else if (distFromCenter > deadZone) {
        activeSideRef.current = 'left';
        leftVideo.style.display = 'block';
        rightVideo.style.display = 'none';

        const distance = cursorX - (centerX + deadZone);
        const availableRange = width - (centerX + deadZone);
        const progress = Math.max(0, Math.min(1, distance / (availableRange || 1)));

        if (leftVideo.duration && !leftVideo.seeking) {
          const targetTime = progress * leftVideo.duration;
          if (Math.abs(leftVideo.currentTime - targetTime) > 0.03) {
            leftVideo.currentTime = targetTime;
          }
        }
      }
    };

    animId = requestAnimationFrame(scrubLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [isTouchDevice]);

  // SECTION 2: Scroll Phase RAF-based Tracking & Card Scaling
  useEffect(() => {
    let animId;

    const updateScrollPhases = () => {
      animId = requestAnimationFrame(updateScrollPhases);

      const vh = window.innerHeight || 800;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      const innerWrapper = innerWrapperRef.current;
      const blackPanel = blackPanelRef.current;
      const outroOverlay = outroOverlayRef.current;
      const outroInfo = outroInfoRef.current;
      const outroBuy = outroBuyRef.current;
      const outroFooter = outroFooterRef.current;
      const canvas = canvasRef.current;

      if (!innerWrapper || !blackPanel) return;

      const wrapScrollHeight = innerWrapper.scrollHeight || 2000;
      const maxScroll = Math.max(0, wrapScrollHeight - vh);

      // Dynamically set spacer height
      if (spacerRef.current) {
        const totalHeight = vh + maxScroll + 2 * vh;
        if (spacerRef.current.style.height !== totalHeight + 'px') {
          spacerRef.current.style.height = totalHeight + 'px';
        }
      }

      // Responsive outro offset
      const isMobile = window.innerWidth < 640;
      const outroOffset = isMobile ? 132 : 166;

      // Random symbol throttled to 80ms on scroll
      const now = performance.now();
      if (now - lastSymbolUpdateRef.current > 80 && scrollY > 10) {
        lastSymbolUpdateRef.current = now;
        setSymbolIndex((prev) => (prev + 1) % RANDOM_SYMBOLS.length);
      }

      // Phase 1: scrollY 0 to vh (Black panel slides up from translateY(100vh) to 0)
      if (scrollY <= vh) {
        const panelTranslate = vh - scrollY;
        blackPanel.style.transform = `translate3d(0, ${panelTranslate}px, 0)`;
        innerWrapper.style.transform = 'translate3d(0, 0, 0)';

        if (canvas) canvas.style.visibility = 'visible';
        if (outroOverlay) outroOverlay.style.opacity = '0';
        if (outroInfo) outroInfo.style.transform = 'translate3d(0, 0, 0)';
        if (outroBuy) outroBuy.style.transform = 'scale(0)';
        if (outroFooter) outroFooter.style.opacity = '0';
      }
      // Phase 2: scrollY > vh and <= vh + maxScroll (Panel fixed at top, inner wrapper translates up)
      else if (scrollY > vh && scrollY <= vh + maxScroll) {
        blackPanel.style.transform = 'translate3d(0, 0, 0)';
        const innerTranslate = -(scrollY - vh);
        innerWrapper.style.transform = `translate3d(0, ${innerTranslate}px, 0)`;

        if (canvas) canvas.style.visibility = 'hidden';
        if (outroOverlay) outroOverlay.style.opacity = '0';
        if (outroInfo) outroInfo.style.transform = 'translate3d(0, 0, 0)';
        if (outroBuy) outroBuy.style.transform = 'scale(0)';
        if (outroFooter) outroFooter.style.opacity = '0';
      }
      // Outro Phase: scrollY > vh + maxScroll
      else {
        blackPanel.style.transform = 'translate3d(0, 0, 0)';
        innerWrapper.style.transform = `translate3d(0, -${maxScroll}px, 0)`;

        if (canvas) canvas.style.visibility = 'hidden';

        const outroDist = Math.max(1, vh - 100);
        const progress = Math.max(0, Math.min(1, (scrollY - vh - maxScroll) / outroDist));

        if (outroOverlay) outroOverlay.style.opacity = progress.toString();
        if (outroInfo) {
          outroInfo.style.transform = `translate3d(0, -${progress * outroOffset}px, 0)`;
        }
        if (outroBuy) {
          outroBuy.style.transform = `scale(${progress})`;
        }
        if (outroFooter) {
          outroFooter.style.opacity = progress.toString();
        }
      }

      // Card scale computation per frame based on vertical position
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const top = rect.top;
        const bottom = rect.bottom;

        if (bottom <= 0 || top >= vh) {
          card.style.transform = 'scale(0)';
          return;
        }

        const enter = Math.min(1, (vh - top) / (vh * 0.6));
        const exit = Math.min(1, bottom / (vh * 0.4));
        const scale = Math.max(0, Math.min(enter, exit));
        card.style.transform = `scale(${scale})`;
      });
    };

    animId = requestAnimationFrame(updateScrollPhases);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      id="scroll-spacer"
      ref={spacerRef}
      style={{
        position: 'relative',
        userSelect: 'none',
        background: '#ffffff',
        minHeight: '500vh',
        cursor: isTouchDevice ? 'auto' : 'none',
        fontFamily: "'Inter Tight', -apple-system, sans-serif",
      }}
      className="font-inter-tight"
    >
      {/* 1A. Custom Cursor (Desktop Only) */}
      {!isTouchDevice && (
        <div
          ref={cursorRef}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 50,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'exclusion',
            left: '-100px',
            top: '-100px',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22.75" stroke="#ffffff" strokeWidth="2.5" />
            {/* Custom decorative Japanese style glyph */}
            <path
              d="M17 17h14v3H25.5v12H22.5V20H17v-3zm0 9l3 6h-3l-3-6h3zm14 0l3 6h-3l-3-6h3z"
              fill="#ffffff"
            />
          </svg>
        </div>
      )}

      {/* 1B. Logo (Top Left) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 20,
          mixBlendMode: 'exclusion',
        }}
        className="prmpt-logo-container"
      >
        <svg viewBox="0 0 355 110" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Geometric 'prmpt' wordmark */}
          {/* p */}
          <path d="M12 28h18v56H12V28zm18 0c14 0 24 10 24 23s-10 23-24 23H12" stroke="#ffffff" strokeWidth="11" strokeLinejoin="miter" />
          {/* r */}
          <path d="M84 44v40m0-22c6-12 16-16 28-14" stroke="#ffffff" strokeWidth="11" strokeLinecap="square" />
          {/* m */}
          <path d="M136 44v40m0-22c6-14 18-18 27-8 6-14 18-18 27-8v38" stroke="#ffffff" strokeWidth="11" strokeLinecap="square" />
          {/* p */}
          <path d="M214 44h16v40h-16V44zm16 0c12 0 20 8 20 18s-8 18-20 18h-16" stroke="#ffffff" strokeWidth="11" strokeLinejoin="miter" />
          {/* t */}
          <path d="M276 30v54c0 4 4 8 10 8m-16-44h26" stroke="#ffffff" strokeWidth="11" strokeLinecap="square" />
          {/* (R) Circled Mark */}
          <circle cx="330" cy="40" r="14" stroke="#ffffff" strokeWidth="3" />
          <text x="330" y="45" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="'Inter Tight', sans-serif">R</text>
        </svg>
      </motion.div>

      {/* 1C. Caption (Below Logo, Left Side) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 20,
          mixBlendMode: 'exclusion',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '140%',
          letterSpacing: '-0.04em',
        }}
        className="prmpt-caption"
      >
        When switching between videos near the center, do not reset currentTime to 0 abruptly.
        Add a small dead zone: if cursor is within +/-50px of center, keep both videos at
        currentTime = 0 and show whichever was last active.
      </motion.div>

      {/* 1D. Header Navigation (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        style={{
          position: 'fixed',
          zIndex: 20,
          pointerEvents: 'none',
          mixBlendMode: 'exclusion',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '30px',
        }}
        className="prmpt-header-nav"
      >
        {/* "ABOUT" Link */}
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 500,
            fontSize: '15px',
            textTransform: 'uppercase',
            color: '#ffffff',
            cursor: 'pointer',
            padding: 0,
            pointerEvents: 'auto',
          }}
          className="prmpt-about-btn"
        >
          ABOUT
        </button>

        <div style={{ display: 'flex', alignItems: 'center' }} className="prmpt-nav-right-items">
          {/* Hamburger SVG Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle Menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}
          >
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="prmpt-hamburger-icon"
              style={{ display: 'block' }}
            >
              <path d="M0 14H40" stroke="#ffffff" strokeWidth="2.5" />
              <path d="M0 26H40" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </button>

          {/* "[ CART ]" */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 500,
              color: '#ffffff',
              cursor: 'pointer',
              padding: 0,
              pointerEvents: 'auto',
            }}
            className="prmpt-cart-text"
          >
            [ CART ]
          </button>
        </div>
      </motion.div>

      {/* 1E. Product Info (Bottom Right) */}
      <motion.div
        id="outro-info"
        ref={outroInfoRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 20,
          mixBlendMode: 'exclusion',
          color: '#ffffff',
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 500,
        }}
        className="prmpt-product-info"
        data-outro-offset="166"
      >
        <div className="prmpt-product-top-block">
          {/* Circle Icon with changing symbol on scroll */}
          <div className="prmpt-circle-symbol-wrapper">
            <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
              <circle cx="20" cy="20" r="18.75" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <span
              id="circle-symbol"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
              }}
              className="prmpt-symbol-text"
            >
              {RANDOM_SYMBOLS[symbolIndex]}
            </span>
          </div>

          {/* Collection Label */}
          <div
            style={{
              lineHeight: '100%',
              textAlign: 'center',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontWeight: 500,
            }}
            className="prmpt-collection-label"
          >
            ARCHIVE COLLECTION
            <br />
            &quot;PROMPT&quot;
          </div>
        </div>

        {/* Price */}
        <div
          style={{
            lineHeight: '100%',
            textAlign: 'center',
            letterSpacing: '-0.04em',
            color: '#ffffff',
            fontWeight: 500,
          }}
          className="prmpt-price-text"
        >
          $97,33
        </div>
      </motion.div>

      {/* 1F. "View" Button (Bottom Right, Initially Hidden) */}
      <div
        id="outro-buy"
        ref={outroBuyRef}
        style={{
          position: 'fixed',
          pointerEvents: 'auto',
          zIndex: 20,
          mixBlendMode: 'exclusion',
          background: '#ffffff',
          borderRadius: '1335px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'right bottom',
          transform: 'scale(0)',
          cursor: 'pointer',
          willChange: 'transform',
        }}
        className="prmpt-view-btn"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <span
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            mixBlendMode: 'exclusion',
            userSelect: 'none',
          }}
          className="prmpt-view-btn-text"
        >
          view
        </span>
      </div>

      {/* 1G. Video Container (Full Viewport Video Background) */}
      <div
        id="main-canvas"
        ref={canvasRef}
        style={{
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        className="prmpt-main-canvas"
      >
        {/* LEFT VIDEO */}
        <video
          ref={leftVideoRef}
          src={VIDEO_LEFT_URL}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => {
            loadedVideosRef.current.left = true;
            checkVideosLoaded();
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'none',
          }}
        />

        {/* RIGHT VIDEO */}
        <video
          ref={rightVideoRef}
          src={VIDEO_RIGHT_URL}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => {
            loadedVideosRef.current.right = true;
            checkVideosLoaded();
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* 1I. White Overlay for Outro */}
      <div
        id="outro-overlay"
        ref={outroOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 12,
          background: '#ffffff',
          opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* 1J. Footer (Bottom Left) */}
      <div
        id="outro-footer"
        ref={outroFooterRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          mixBlendMode: 'exclusion',
          opacity: 0,
          zIndex: 20,
          display: 'flex',
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 500,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: '#ffffff',
          willChange: 'opacity',
        }}
        className="prmpt-footer"
      >
        <span>PRMPT (R) 2026</span>
        <span>PRIVACY POLICY</span>
      </div>

      {/* =========================================================================
          SECTION 2: Black Panel (Gallery Phase)
          ========================================================================= */}
      <div
        id="black-panel"
        ref={blackPanelRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000000',
          zIndex: 10,
          transform: 'translate3d(0, 100vh, 0)',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {/* Inner Wrapper (translates up during Phase 2) */}
        <div
          id="bp-inner"
          ref={innerWrapperRef}
          style={{
            width: '100%',
            paddingTop: 'min(400px, 40vh)',
            paddingBottom: 'min(400px, 40vh)',
            paddingLeft: 'clamp(16px, 3vw, 40px)',
            paddingRight: 'clamp(16px, 3vw, 40px)',
            boxSizing: 'border-box',
            willChange: 'transform',
          }}
        >
          {/* Scattered Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: 'clamp(16px, 2.5vw, 32px)',
              maxWidth: '1800px',
              margin: '0 auto',
            }}
          >
            {gridLayout.map((row, rIdx) =>
              row.map((imgIdx, cIdx) => {
                const isLeftHalf = cIdx < cols / 2;
                const transformOrigin = isLeftHalf ? 'right bottom' : 'left bottom';
                const cardIndex = rIdx * cols + cIdx;

                if (imgIdx === -1) {
                  // Empty cell spacer
                  return (
                    <div
                      key={`spacer-${rIdx}-${cIdx}`}
                      style={{
                        aspectRatio: '2 / 3',
                        pointerEvents: 'none',
                      }}
                    />
                  );
                }

                const imgSrc = GALLERY_IMAGES[imgIdx];

                return (
                  <div
                    key={`card-${imgIdx}`}
                    ref={(el) => {
                      cardsRef.current[cardIndex] = el;
                    }}
                    className="bp-card"
                    style={{
                      position: 'relative',
                      aspectRatio: '2 / 3',
                      transformOrigin: transformOrigin,
                      transform: 'scale(0)',
                      willChange: 'transform',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      background: '#111111',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Archive Item ${imgIdx + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Navigation Modal Menu (when clicking ABOUT / Hamburger / CART) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0, 0, 0, 0.94)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(24px, 5vw, 48px)',
              color: '#ffffff',
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                PRMPT NAVIGATION
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <X size={26} />
              </button>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <ArrowLeft size={32} />
                <span>Return to Portfolio</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                About Me
              </Link>
              <Link
                to="/experience"
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                Experience
              </Link>
              <Link
                to="/projects"
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                Projects
              </Link>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                Contact
              </Link>
            </div>

            {/* Bottom Note */}
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
              PRMPT ARCHIVE COLLECTION 2026 • ALL RIGHTS RESERVED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Stylesheet */}
      <style>{`
        /* Responsive Breakpoints as defined in prompt */
        /* Desktop: >= 1024px */
        @media (min-width: 1024px) {
          .prmpt-logo-container {
            top: 32px;
            left: 32px;
            width: 355px;
          }
          .prmpt-caption {
            top: 244px;
            left: 32px;
            width: 692px;
          }
          .prmpt-header-nav {
            top: 32px;
            right: 32px;
            width: 330px;
          }
          .prmpt-about-btn {
            display: block !important;
          }
          .prmpt-nav-right-items {
            gap: 50px;
          }
          .prmpt-hamburger-icon {
            width: 30px;
            height: 30px;
          }
          .prmpt-cart-text {
            font-size: 15px;
          }
          .prmpt-product-info {
            right: 32px;
            bottom: 80px;
            width: 330px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .prmpt-product-top-block {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-bottom: 32px;
          }
          .prmpt-circle-symbol-wrapper {
            position: relative;
            width: 30px;
            height: 30px;
          }
          .prmpt-symbol-text {
            font-size: 15px;
          }
          .prmpt-collection-label {
            font-size: 30px;
            margin-top: 14px;
          }
          .prmpt-price-text {
            font-size: 80px;
          }
          .prmpt-view-btn {
            right: 32px;
            bottom: 32px;
            width: 330px;
            height: 174px;
          }
          .prmpt-view-btn-text {
            font-size: 110px;
          }
          .prmpt-main-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
          }
          .prmpt-footer {
            left: 16px;
            bottom: 32px;
            gap: 80px;
            font-size: 13px;
          }
        }

        /* Tablet: 640px - 1023px */
        @media (min-width: 640px) and (max-width: 1023px) {
          .prmpt-logo-container {
            top: 24px;
            left: 24px;
            width: 266px;
          }
          .prmpt-caption {
            top: 180px;
            left: 24px;
            width: calc(50vw - 48px);
          }
          .prmpt-header-nav {
            top: 24px;
            right: 24px;
            width: 280px;
          }
          .prmpt-about-btn {
            display: block !important;
          }
          .prmpt-nav-right-items {
            gap: 30px;
          }
          .prmpt-hamburger-icon {
            width: 26px;
            height: 26px;
          }
          .prmpt-cart-text {
            font-size: 14px;
          }
          .prmpt-product-info {
            right: 24px;
            bottom: 60px;
            width: 280px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .prmpt-product-top-block {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-bottom: 24px;
          }
          .prmpt-circle-symbol-wrapper {
            position: relative;
            width: 24px;
            height: 24px;
          }
          .prmpt-symbol-text {
            font-size: 13px;
          }
          .prmpt-collection-label {
            font-size: 24px;
            margin-top: 10px;
          }
          .prmpt-price-text {
            font-size: 68px;
          }
          .prmpt-view-btn {
            right: 24px;
            bottom: 24px;
            width: 280px;
            height: 140px;
          }
          .prmpt-view-btn-text {
            font-size: 88px;
          }
          .prmpt-main-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
          }
          .prmpt-footer {
            left: 16px;
            bottom: 28px;
            gap: 60px;
            font-size: 12px;
          }
        }

        /* Mobile: < 640px */
        @media (max-width: 639px) {
          .prmpt-logo-container {
            top: 16px;
            left: 16px;
            width: 124px;
          }
          .prmpt-caption {
            top: 118px;
            left: 16px;
            width: calc(100vw - 32px);
          }
          .prmpt-header-nav {
            top: 16px;
            right: 16px;
            width: auto;
          }
          .prmpt-about-btn {
            display: none !important;
          }
          .prmpt-nav-right-items {
            gap: 20px;
          }
          .prmpt-hamburger-icon {
            width: 24px;
            height: 24px;
          }
          .prmpt-cart-text {
            font-size: 13px;
          }
          .prmpt-product-info {
            left: 0;
            right: 0;
            bottom: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .prmpt-product-top-block {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 252px;
            margin-bottom: 12px;
          }
          .prmpt-circle-symbol-wrapper {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .prmpt-symbol-text {
            font-size: 10px;
          }
          .prmpt-collection-label {
            font-size: 20px;
            margin-top: 8px;
          }
          .prmpt-price-text {
            font-size: 60px;
          }
          .prmpt-view-btn {
            left: 16px;
            right: 16px;
            bottom: 60px;
            height: 100px;
          }
          .prmpt-view-btn-text {
            font-size: 72px;
          }
          .prmpt-main-canvas {
            position: fixed;
            left: 0;
            top: 220px;
            width: 100vw;
            height: calc(100vh - 220px);
            z-index: 0;
          }
          .prmpt-footer {
            left: 16px;
            right: 16px;
            bottom: 24px;
            justify-content: space-between;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
