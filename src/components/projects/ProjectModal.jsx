import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Instagram, ExternalLink } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Detail proyek / desain. items = daftar dalam satu bagian, index = yang sedang dibuka.
 * Tombol & panah keyboard (← →) berpindah antar item; Esc / klik latar menutup.
 */
export default function ProjectModal({ items, index, direction, onClose, onNavigate }) {
  const { playClick, playHover } = useSoundContext();
  const reduce = useReducedMotion();
  const item = index === null ? null : items[index];
  const hasNav = items.length > 1;

  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (hasNav && e.key === 'ArrowRight') onNavigate(1);
      if (hasNav && e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    // kunci scroll halaman di belakang modal
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item, hasNav, onClose, onNavigate]);

  const go = (step) => (e) => {
    e.stopPropagation();
    playClick();
    onNavigate(step);
  };

  const slide = {
    enter: (dir) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60, rotateY: dir * 12 }),
    center: { opacity: 1, x: 0, rotateY: 0 },
    exit: (dir) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60, rotateY: dir * -12 }),
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onClose();
          }}
          className="pm-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            className="pm-shell"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88, rotateX: 14, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotateX: -8, y: 20 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ transformPerspective: 1400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={item.key}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE }}
                style={{ transformPerspective: 1400 }}
                className="pm-body"
              >
                <div className="pm-media" style={{ '--pm-accent': item.accent }}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="pm-info">
                  <div className="pm-meta">
                    <span className="pm-cat" style={{ color: item.accent }}>
                      {item.category}
                    </span>
                    {item.context && <span className="pm-ctx">{item.context}</span>}
                    {item.platform && <span className="pm-ctx">{item.platform}</span>}
                  </div>
                  <h3 className="pm-title">{item.title}</h3>
                  <p className="pm-desc">{item.description}</p>
                  {item.tags?.length > 0 && (
                    <div className="pm-tags">
                      {item.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}

                  {(item.demo || item.url) && (
                    <div className="pm-actions">
                      {item.demo && (
                        <Link
                          to={item.demo}
                          onClick={() => {
                            playClick();
                            onClose();
                          }}
                          onMouseEnter={playHover}
                          className="pm-btn pm-btn--brand"
                        >
                          <Sparkles size={16} /> Buka live AI demo di Playground <ArrowUpRight size={15} />
                        </Link>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={playClick}
                          onMouseEnter={playHover}
                          className="pm-btn pm-btn--ig"
                        >
                          <Instagram size={15} /> Kunjungi akun Instagram <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Kontrol */}
            <button
              className="pm-close"
              aria-label="Tutup"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                onClose();
              }}
            >
              <X size={18} />
            </button>
            {hasNav && (
              <div className="pm-nav">
                <button aria-label="Sebelumnya" onClick={go(-1)} onMouseEnter={playHover}>
                  <ChevronLeft size={18} />
                </button>
                <span className="pm-count">
                  {index + 1} / {items.length}
                </span>
                <button aria-label="Berikutnya" onClick={go(1)} onMouseEnter={playHover}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
