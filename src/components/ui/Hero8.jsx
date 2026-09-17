import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSoundContext } from './SoundProvider';

// 8 Pure Photographic Moments of Zacky Andyka — NO LANYARDS OR ID CARDS
const LINE_1_IMAGES = [
  {
    url: '/gallery/potret sidang dengan papan bunga 9_16.webp',
    aspectRatio: 0.92,
    alt: 'Potret Sidang Kelulusan Zacky Andyka',
  },
  {
    url: '/gallery/fotbar wisuda.webp',
    aspectRatio: 1.25,
    alt: 'Wisuda Cum Laude Teknik Informatika USU',
  },
  {
    url: '/gallery/foto bersama karyawan (magang di BSI).webp',
    aspectRatio: 1.35,
    alt: 'Momen Kebersamaan Magang BSI KCP Medan Area',
  },
  {
    url: '/gallery/fotografi produk coca cola (9_16).webp',
    aspectRatio: 1.05,
    alt: 'Karya Fotografi Komersial Produk Coca-Cola',
  },
];

const LINE_2_IMAGES = [
  {
    url: '/gallery/fotbar sidang 9_16.webp',
    aspectRatio: 1.15,
    alt: 'Momen Perayaan Sidang Kelulusan Bersama Sahabat',
  },
  {
    url: '/gallery/on-boarding magang bsi 4_3.webp',
    aspectRatio: 1.33,
    alt: 'Sesi On-boarding Magang PT Bank Syariah Indonesia',
  },
  {
    url: '/gallery/mengajar komputer di pkbm bintula 16_9.webp',
    aspectRatio: 1.35,
    alt: 'Kegiatan Pengajaran Literasi Komputer di PKBM',
  },
  {
    url: '/gallery/Pelantikan HIMTI.webp',
    aspectRatio: 1.33,
    alt: 'Seremoni Pelantikan Pengurus HIMTI USU',
  },
];

// Showcase Banners that auto-rotate smoothly
const SHOWCASE_BANNERS = [
  {
    url: '/gallery/fotbar panitia pkkmb vokasi 2025.webp',
    alt: 'Dokumentasi Kepanitiaan Bersama PKKMB Vokasi 2025',
  },
  {
    url: '/gallery/Pelantikan HIMTI.webp',
    alt: 'Seremoni Pelantikan Pengurus HIMTI USU',
  },
  {
    url: '/gallery/foto bersama karyawan (magang di BSI).webp',
    alt: 'Kebersamaan Magang BSI KCP Medan Area',
  },
  {
    url: '/gallery/mengajar komputer di pkbm bintula 16_9.webp',
    alt: 'Kegiatan Pengajaran Literasi Komputer di PKBM',
  },
  {
    url: '/gallery/expo vokasi usu 2024 4_3.webp',
    alt: 'Pameran Karya Inovasi Expo Vokasi USU',
  },
  {
    url: '/gallery/fotbar wisuda.webp',
    alt: 'Momen Wisuda Sarjana Teknik Informatika USU',
  },
];

function HeroLine({
  leftText,
  rightText,
  images,
  alt,
  isInView,
  delay = 0,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const { playHover } = useSoundContext();

  const active = isInView || isHovered;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reverted shuffle interval to standard 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const currentImage = images[currentIndex];
  const baseMultiplier = isMobile ? 48 : (isHovered ? 125 : 105);
  const targetWidth = active ? Math.round(baseMultiplier * currentImage.aspectRatio) : 0;

  return (
    <div
      className="hero8-line-container"
      onMouseEnter={() => {
        playHover?.();
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
    >
      <motion.span
        layout
        className="hero8-text"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay }}
      >
        {leftText}
      </motion.span>

      <motion.div
        layout
        className="hero8-tile"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: targetWidth,
          opacity: active ? 1 : 0,
        }}
        transition={{
          width: { duration: 0.45, type: 'spring', bounce: 0 },
          opacity: { duration: 0.28 },
        }}
        style={{
          boxShadow: isHovered
            ? '0 12px 32px var(--shadow-color)'
            : '0 4px 16px rgba(0,0,0,0.12)',
        }}
      >
        <img
          key={currentImage.url}
          src={currentImage.url}
          alt={alt}
          className="hero8-tile-img"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
          loading="eager"
        />
      </motion.div>

      <motion.span
        layout
        className="hero8-text"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: delay + 0.12 }}
      >
        {rightText}
      </motion.span>
    </div>
  );
}

export default function Hero8({ onExploreClick }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [mounted, setMounted] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const { playClick } = useSoundContext();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate showcase banner every 5 seconds with crossfade
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % SHOWCASE_BANNERS.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, []);

  const active = isInView || mounted;

  const handleScroll = () => {
    try {
      playClick?.();
    } catch {}
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('gallery');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero8-section">
      {/* Ambient background glow accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 90vw)',
          height: '420px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 68%)',
          opacity: 0.65,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div ref={containerRef} className="hero8-content-wrapper">
        <div className="hero8-stack">
          {/* Typography with Expandable Media Tiles */}
          <div className="hero8-lines-wrapper">
            <HeroLine
              leftText="Capturing"
              rightText="Stories"
              images={LINE_1_IMAGES}
              alt="Momen dan cerita visual Zacky Andyka"
              isInView={active}
              delay={0.05}
            />
            <HeroLine
              leftText="Visualizing"
              rightText="Reality"
              images={LINE_2_IMAGES}
              alt="Dokumentasi dan visualisasi karya Zacky Andyka"
              isInView={active}
              delay={0.18}
            />
          </div>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="hero8-subtitle"
          >
            An archive of captured moments, creative media, and visual stories from my journey in design, university events, and personal achievements.
          </motion.p>

          {/* Large Showcase Banner with Auto-rotating Crossfade Photos */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="hero8-banner-card"
          >
            <div className="hero8-banner-aspect">
              <AnimatePresence initial={false}>
                <motion.img
                  key={SHOWCASE_BANNERS[bannerIndex].url}
                  src={SHOWCASE_BANNERS[bannerIndex].url}
                  alt={SHOWCASE_BANNERS[bannerIndex].alt}
                  className="hero8-banner-img"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="eager"
                />
              </AnimatePresence>
              <div aria-hidden="true" className="hero8-banner-overlay" />
            </div>
          </motion.div>

          {/* Smooth Scroll Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ marginTop: '4px' }}
          >
            <motion.button
              whileHover={{ y: 3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleScroll}
              className="hero8-explore-btn"
            >
              <span>Explore Visual Gallery</span>
              <div className="hero8-btn-icon">
                <ArrowDown size={13} />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero8-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--bg);
          padding-top: clamp(96px, 14vh, 130px);
          padding-bottom: clamp(48px, 8vh, 80px);
          padding-left: clamp(16px, 4vw, 48px);
          padding-right: clamp(16px, 4vw, 48px);
          overflow: hidden;
        }

        .hero8-content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .hero8-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(24px, 4vw, 44px);
          width: 100%;
        }

        .hero8-lines-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: clamp(8px, 1.6vw, 16px);
        }

        .hero8-line-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 1.8vw, 24px);
          width: 100%;
          cursor: pointer;
          user-select: none;
        }

        .hero8-text {
          font-size: clamp(1.85rem, 6.4vw, 6.4rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--text);
          white-space: nowrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .hero8-tile {
          height: clamp(38px, 6vw, 92px);
          border-radius: clamp(8px, 1.2vw, 16px);
          overflow: hidden;
          border: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--surface-2);
          transition: border-color 0.25s ease;
        }

        .hero8-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero8-subtitle {
          text-align: center;
          font-size: clamp(0.95rem, 1.25vw, 1.12rem);
          color: var(--text-muted);
          line-height: 1.68;
          max-width: 640px;
          margin: 0 auto;
        }

        .hero8-banner-card {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: clamp(14px, 2vw, 22px);
          border: 1px solid var(--border);
          box-shadow: 0 20px 60px var(--shadow-color);
          background: var(--surface);
        }

        .hero8-banner-aspect {
          position: relative;
          width: 100%;
          overflow: hidden;
          aspect-ratio: 16 / 9;
        }

        @media (min-width: 640px) {
          .hero8-banner-aspect {
            aspect-ratio: 21 / 9;
          }
        }

        .hero8-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero8-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%);
          pointer-events: none;
          z-index: 2;
        }

        .hero8-explore-btn {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.88rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transition: all 0.2s ease;
        }

        .hero8-btn-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        @media (max-width: 480px) {
          .hero8-text {
            font-size: clamp(1.45rem, 6.4vw, 1.95rem);
          }
          .hero8-line-container {
            gap: 6px;
          }
        }
      `}</style>
    </section>
  );
}
