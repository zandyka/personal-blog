import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera, Palette, Users, Grid } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Photography',
    title: 'Fotografi',
    caption: 'fotografi 9_16',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/fotografi 9_16.png',
    alt: 'Fotografi 9:16',
  },
  {
    id: 2,
    category: 'Creative',
    title: 'X Banner Produk Inovasi',
    caption: 'x banner produk inovasi 1_1',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/x banner produk inovasi 1_1.png',
    alt: 'X Banner Produk Inovasi 1:1',
  },
  {
    id: 3,
    category: 'Creative',
    title: 'Design ID Card',
    caption: 'design id card 4_3',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/design id card 4_3.png',
    alt: 'Design ID Card 4:3',
  },
  {
    id: 4,
    category: 'Events',
    title: 'Event Organizer Rindu Tenang',
    caption: 'event organizer rindu tenang 16_9',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/event organizer rindu tenang 16_9.png',
    alt: 'Event Organizer Rindu Tenang 16:9',
  },
  {
    id: 5,
    category: 'Events',
    title: 'Event',
    caption: 'event 9_16',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/event 9_16.png',
    alt: 'Event 9:16',
  },
  {
    id: 6,
    category: 'Photography',
    title: 'Tim Publikasi Dokumentasi PKKMB Vokasi 2025',
    caption: 'tim publikasi dokumentasi pkkmb vokasi 2025 4_3',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/tim publikasi dokumentasi pkkmb vokasi 2025 4_3.png',
    alt: 'Tim Publikasi Dokumentasi PKKMB Vokasi 2025 4:3',
  },
  {
    id: 7,
    category: 'Creative',
    title: 'Banner Sidang',
    caption: 'banner sidang 1_1',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/banner sidang 1_1.png',
    alt: 'Banner Sidang 1:1',
  },
  {
    id: 8,
    category: 'Events',
    title: 'Mengajar Komputer di PKBM Bintula',
    caption: 'mengajar komputer di pkbm bintula 16_9',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/mengajar komputer di pkbm bintula 16_9.png',
    alt: 'Mengajar Komputer di PKBM Bintula 16:9',
  },
  {
    id: 9,
    category: 'Events',
    title: 'Magang BPJS',
    caption: 'magang bpjs 9_16',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/magang bpjs 9_16.png',
    alt: 'Magang BPJS 9:16',
  },
];

const CATEGORIES = [
  { id: 'All', icon: Grid },
  { id: 'Photography', icon: Camera },
  { id: 'Creative', icon: Palette },
  { id: 'Events', icon: Users },
];

const CATEGORY_ICON_MAP = {
  Photography: Camera,
  Creative: Palette,
  Events: Users,
};

function GalleryCard({ item, index, onClick }) {
  const { playHover, playClick } = useSoundContext();
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const CategoryIcon = CATEGORY_ICON_MAP[item.category] || Camera;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => { playClick(); onClick(item); }}
      onMouseEnter={() => { playHover(); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      className="gallery-card-root"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: item.aspectRatio || '1 / 1',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.14)',
      }}
    >
      {/* Ratio badge in top-left */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '2px 8px',
          borderRadius: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          fontSize: '9px',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.75)',
          letterSpacing: '1px',
          zIndex: 2,
        }}
      >
        {item.ratioLabel}
      </div>
      {/* Real Image artwork with smooth zoom */}
      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />

      {/* Hover / tap overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="gallery-card-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(10px, 2.5vw, 16px)',
        }}
      >
        <span
          className="gallery-card-cat"
          style={{
            fontSize: 'clamp(0.58rem, 0.75vw, 0.68rem)',
            fontWeight: 700,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            marginBottom: '2px',
          }}
        >
          {item.category}
        </span>
        <span
          className="gallery-card-title"
          style={{
            fontSize: 'clamp(0.76rem, 1.05vw, 0.95rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: '4px',
          }}
        >
          {item.title}
        </span>
        <span
          className="gallery-card-caption"
          style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.35,
          }}
        >
          {item.caption}
        </span>
        <div
          className="gallery-zoom-btn"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ZoomIn size={13} color="#fff" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Lightbox({ item, onClose }) {
  const { playClick } = useSoundContext();
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => { playClick(); onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '20px',
          overflow: 'hidden', maxWidth: '640px', width: '100%',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          maxHeight: '70vh',
          background: '#070709',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img
            src={item.src}
            alt={item.title}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-2)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {item.category}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.6 }}>
                {item.caption}
              </p>
            </div>
            <button
              onClick={() => { playClick(); onClose(); }}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '8px', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '16px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const { playClick } = useSoundContext();
  const { ref: titleRef, inView: titleVisible } = useInView({ threshold: 0.2, triggerOnce: true });

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === activeCategory);

  return (
    <section style={{ padding: '48px 0', background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 24 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '24px' }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Visual Work
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: '12px' }}>
            Gallery
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', lineHeight: 1.7 }}>
            A collection of photography, creative media, and event documentation work.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}
        >
          {CATEGORIES.map(({ id, icon: Icon }) => {
            const active = activeCategory === id;
            return (
              <motion.button
                key={id}
                onClick={() => { playClick(); setActiveCategory(id); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '999px', fontSize: '0.82rem',
                  fontWeight: active ? 600 : 400, cursor: 'pointer',
                  background: active ? 'var(--accent)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  border: active ? '1px solid transparent' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={13} />
                {id}
              </motion.button>
            );
          })}
        </motion.div>

        {/* 3-Column Balanced Masonry Layout */}
        <div
          className="gallery-masonry-wrapper"
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
        >
          {[0, 1, 2].map((colIndex) => {
            const colItems = filtered.filter((_, idx) => idx % 3 === colIndex);
            return (
              <div
                key={colIndex}
                className="gallery-masonry-col"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minWidth: 0,
                }}
              >
                <AnimatePresence mode="popLayout">
                  {colItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GalleryCard item={item} index={colIndex * 3 + i} onClick={setSelectedItem} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .gallery-masonry-wrapper {
              gap: 8px !important;
            }
            .gallery-masonry-col {
              gap: 8px !important;
            }
            .gallery-card-root {
              border-radius: 10px !important;
            }
            .gallery-card-caption {
              display: none !important;
            }
            .gallery-zoom-btn {
              display: none !important;
            }
          }
          @media (max-width: 480px) {
            .gallery-masonry-wrapper {
              gap: 6px !important;
            }
            .gallery-masonry-col {
              gap: 6px !important;
            }
            .gallery-card-root {
              border-radius: 8px !important;
            }
          }
        `}</style>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}