import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ZoomIn, X } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import { CERTIFICATIONS } from '../data/certifications';

const NARROW_QUERY = '(max-width: 860px)';

const useColumnCount = () => {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow ? 2 : 3;
};

// Masonry seimbang: tiap sertifikat masuk ke kolom yang saat ini paling pendek.
const toColumns = (items, count) => {
  const cols = Array.from({ length: count }, () => ({ height: 0, items: [] }));
  items.forEach((item) => {
    const shortest = cols.reduce((a, b) => (b.height < a.height ? b : a));
    shortest.items.push(item);
    shortest.height += 1 / item.ratio;
  });
  return cols.map((c) => c.items);
};

function CertCard({ cert, index, onOpen }) {
  const { playHover } = useSoundContext();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      tabIndex={0}
      aria-label={`Lihat sertifikat ${cert.title}`}
      onClick={() => onOpen(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(cert);
        }
      }}
      onMouseEnter={() => { playHover(); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="cert-tile"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: String(cert.ratio),
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--surface-2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.14)',
        transform: 'translateZ(0)',
      }}
    >
      <img
        src={cert.image}
        alt={cert.title}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Overlay hanya saat hover, sama seperti kartu galeri */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="cert-tile-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(10px, 2.5vw, 16px)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: 'clamp(0.58rem, 0.75vw, 0.68rem)',
            fontWeight: 700,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            marginBottom: '2px',
          }}
        >
          {cert.credentialType}
        </span>
        <span
          style={{
            fontSize: 'clamp(0.76rem, 1.05vw, 0.95rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.25,
          }}
        >
          {cert.title}
        </span>
        <div
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

const Certifications = () => {
  const { playClick } = useSoundContext();
  const [activeCert, setActiveCert] = useState(null);
  const columnCount = useColumnCount();
  const columns = useMemo(() => toColumns(CERTIFICATIONS, columnCount), [columnCount]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const open = (cert) => {
    playClick();
    setActiveCert(cert);
  };
  const close = () => {
    playClick();
    setActiveCert(null);
  };

  useEffect(() => {
    if (!activeCert) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeCert]);

  return (
    <section
      id="certifications"
      ref={ref}
      style={{
        padding: '50px 16px 80px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Credentials &amp; Accreditations
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Sertifikasi &amp; Penghargaan Resmi
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          />
        </motion.div>

        {/* Masonry grid: foto saja, seperti galeri */}
        <div className="cert-masonry" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {columns.map((items, colIndex) => (
            <div
              key={colIndex}
              className="cert-masonry-col"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}
            >
              {items.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} index={colIndex + i * columnCount} onOpen={open} />
              ))}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {activeCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              role="dialog"
              aria-modal="true"
              aria-label={activeCert.title}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  maxWidth: '880px',
                  width: '100%',
                  maxHeight: '92vh',
                  overflow: 'hidden',
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    background: '#0a0a0f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                  }}
                >
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '78vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <button
                    onClick={close}
                    aria-label="Tutup"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 600, color: 'var(--text)' }}>
                    {activeCert.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {activeCert.issuer} &middot; {activeCert.period}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @media (max-width: 860px) {
            #certifications {
              padding: 36px 12px 60px !important;
            }
            .cert-masonry,
            .cert-masonry-col {
              gap: 8px !important;
            }
            .cert-tile {
              border-radius: 10px !important;
            }
          }
          @media (hover: none) {
            .cert-tile-overlay {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Certifications;
