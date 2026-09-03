import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera, Palette, Users, Grid } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';

const GALLERY_ITEMS = [
  {
    id: 1, category: 'Photography', title: 'Urban Landscape',
    caption: 'Street photography capturing everyday moments',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(145deg, #180503 0%, #FF3B1D 60%, #FFAA00 100%)',
    alt: 'Urban Landscape Street Photography',
  },
  {
    id: 2, category: 'Events', title: 'HIMTI Event Documentation',
    caption: 'Creative media coverage for organizational events at USU',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #09090b 0%, #1f1412 50%, #FF3B1D 100%)',
    alt: 'HIMTI Event Documentation at USU',
  },
  {
    id: 3, category: 'Creative', title: 'Design Work — Figma',
    caption: 'Visual identity and social media content creation',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #FFAA00 0%, #FF3B1D 100%)',
    alt: 'Design Work with Figma',
  },
  {
    id: 4, category: 'Photography', title: 'Portrait Session',
    caption: 'Natural light portrait photography',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(145deg, #140908 0%, #2a110e 50%, #FF4500 100%)',
    alt: 'Natural Light Portrait Photography',
  },
  {
    id: 5, category: 'Creative', title: 'Social Media Content',
    caption: 'Instagram promotional content for HIMTI USU',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #FF3B1D 0%, #FF7744 100%)',
    alt: 'Social Media Content for HIMTI',
  },
  {
    id: 6, category: 'Events', title: 'Team Collaboration',
    caption: 'Event coordination and team documentation',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #18181c 0%, #2b1f1a 50%, #FFAA00 100%)',
    alt: 'Team Collaboration Documentation',
  },
  {
    id: 7, category: 'Photography', title: 'Nature & Architecture',
    caption: 'Exploring visual composition in everyday settings',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(145deg, #0d0605 0%, #24110d 60%, #FF3B1D 100%)',
    alt: 'Nature and Architecture Photography',
  },
  {
    id: 8, category: 'Creative', title: 'Brand Identity',
    caption: 'Poster, banner, and print design using Figma',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #FF5500 0%, #FFAA00 100%)',
    alt: 'Brand Identity and Print Design',
  },
  {
    id: 9, category: 'Events', title: 'Tech Exhibition',
    caption: 'Student technology project showcase at USU',
    ratio: '1:1', width: 1, height: 1,
    bg: 'linear-gradient(135deg, #1a0805 0%, #FF3B1D 50%, #FFAA00 100%)',
    alt: 'Tech Exhibition Showcase at USU',
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
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => { playClick(); onClick(item); }}
      onMouseEnter={() => { playHover(); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      className="gallery-card-root"
      style={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Background artwork with smooth zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: item.bg,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Elegant idle category icon in center (faint, disappears on hover) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 0 : 0.3,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }}
      >
        <CategoryIcon size={26} color="#ffffff" />
      </div>

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
        <div style={{ position: 'relative', aspectRatio: '16 / 10', width: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: item.bg }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: 'rgba(255,255,255,0.5)',
            fontWeight: 400, letterSpacing: '1px',
          }}>
            {item.alt}
          </div>
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

        {/* Grid */}
        <motion.div
          layout
          className="gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <GalleryCard item={item} index={i} onClick={setSelectedItem} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <style>{`
          @media (max-width: 768px) {
            .gallery-grid {
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
            .gallery-grid {
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