import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, ZoomIn } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import { useTilt } from '../../hooks/useTilt';

// Desain tampil utuh sesuai rasio aslinya; info muncul saat hover (selalu tampil di layar sentuh).
export default function DesignTile({ item, index, onOpen }) {
  const { playHover, playClick } = useSoundContext();
  const reduce = useReducedMotion();
  const tilt = useTilt({ max: 8, glare: 0.22 });

  const open = () => {
    playClick();
    onOpen();
  };

  return (
    // Pembungkus luar: animasi masuk. Elemen dalam: miring mengikuti kursor.
    // Dipisah supaya keduanya tidak berebut rotateX.
    <motion.div
      className="ds-tile-wrap"
      initial={reduce ? false : { opacity: 0, y: 50, rotateX: -16, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.06 }}
      style={{ transformPerspective: 1000 }}
    >
      <motion.div
        {...tilt.handlers}
        onMouseEnter={playHover}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Lihat desain ${item.title}`}
        className="ds-tile"
        style={{ '--ds-accent': item.accent, aspectRatio: String(item.ratio), ...tilt.style }}
      >
        <motion.span style={tilt.glareStyle} aria-hidden="true" />
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-tile__ig"
            title={`Buka ${item.platform} di Instagram`}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
          >
            <Instagram size={13} />
            <span>{item.platform}</span>
          </a>
        )}

        <div className="ds-tile__info">
          <span className="ds-tile__cat">{item.category}</span>
          <span className="ds-tile__title">{item.title}</span>
          <span className="ds-tile__zoom" aria-hidden="true">
            <ZoomIn size={13} />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
