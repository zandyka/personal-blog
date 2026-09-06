import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Globe,
  Sparkles,
  ArrowUpRight,
  ZoomIn,
  X,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import {
  FEATURED_GALLERY_ITEMS,
  GalleryCard,
  Lightbox,
} from './Gallery';

// Exactly the 2 requested software projects (Handspeak & Mahaasyik)
const HOMEPAGE_PROJECTS = [
  {
    id: 'handspeak',
    title: 'Handspeak — BISINDO Sign Language Translator',
    category: 'Mobile AI Application',
    typeIcon: Smartphone,
    accent: '#FF3B1D',
    description:
      'Aplikasi penerjemah bahasa isyarat Indonesia (BISINDO) secara real-time berbasis kecerdasan buatan (Computer Vision & Machine Learning) untuk menjembatani komunikasi inklusif bagi teman tuli.',
    techStack: ['Flutter', 'Python', 'TensorFlow', 'Computer Vision', 'Mobile AI'],
    image: '/projects/handspeak.webp',
    previewUrl: '/playground#handspeak',
  },
  {
    id: 'mahaasyik',
    title: 'Mahaasyik Resto — Sistem Manajemen & Pemesanan Restoran Berbasis Web',
    category: 'Full-Stack Web & Payment Gateway',
    typeIcon: Globe,
    accent: '#FFAA00',
    description:
      'Platform aplikasi web manajemen dan pemesanan restoran komprehensif berstandar production-ready dengan arsitektur decoupled (React.js SPA & Laravel 11 REST API). Mendigitalkan operasional kuliner mulai dari katalog menu interaktif, reservasi meja cerdas dengan down payment (DP) otomatis, integrasi Midtrans Snap payment gateway, hingga manajemen pesanan dan dashboard analitik omzet.',
    techStack: ['React.js 18', 'Laravel 11', 'TailwindCSS', 'Midtrans Snap', 'MySQL 8'],
    image: '/projects/Mahaasyik.webp',
  },
];

export default function HomeShowcase() {
  const { playClick, playHover } = useSoundContext();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const { ref: sectionRef, inView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  // Exclude the circled photo (id: 5 - HIMTI Games 9:16) so both columns align evenly and finish 'sebaris'
  const HOMEPAGE_GALLERY_COL_0 = FEATURED_GALLERY_ITEMS.filter(
    (item) => item.id === 1 || item.id === 3
  );
  const HOMEPAGE_GALLERY_COL_1 = FEATURED_GALLERY_ITEMS.filter(
    (item) => item.id === 2 || item.id === 4 || item.id === 6
  );

  return (
    <section
      id="home-showcase"
      ref={sectionRef}
      style={{
        padding: 'clamp(40px, 6vw, 72px) 0',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="home-showcase-split-grid">
        {/* =========================================================================
            LEFT COLUMN: GALLERY (Visual Work) - No Category Box
            ========================================================================= */}
        <div className="home-showcase-col-left">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '24px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)',
                }}
              />
              VISUAL WORK
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Gallery
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '480px',
              }}
            >
              Koleksi fotografi komersial, media kreatif, dan liputan aktivitas event.
            </p>
          </motion.div>

          {/* 2-Column Masonry Grid (No Category Filter Box) */}
          <div
            className="home-gallery-masonry"
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            {[0, 1].map((colIndex) => {
              const colItems = colIndex === 0 ? HOMEPAGE_GALLERY_COL_0 : HOMEPAGE_GALLERY_COL_1;
              return (
                <div
                  key={colIndex}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minWidth: 0,
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {colItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GalleryCard
                          item={item}
                          index={colIndex * 3 + i}
                          onClick={setSelectedPhoto}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Bottom Action: Link to Full Album Page */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/album"
              onClick={playClick}
              onMouseEnter={playHover}
              style={{ textDecoration: 'none' }}
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="showcase-nav-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '999px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px var(--shadow-color)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <span>Buka Semua Album</span>
                <ArrowUpRight size={15} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: FEATURED PROJECTS (Handspeak & Mahaasyik Atas-Bawah)
            ========================================================================= */}
        <div className="home-showcase-col-right">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{ marginBottom: '24px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 59, 29, 0.1)',
                border: '1px solid rgba(255, 59, 29, 0.25)',
                color: '#FF3B1D',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#FF3B1D',
                  boxShadow: '0 0 8px #FF3B1D',
                }}
              />
              SELECTED WORK
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Featured Projects
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '480px',
              }}
            >
              Aplikasi mobile AI real-time dan platform web komprehensif production-ready.
            </p>
          </motion.div>

          {/* 2 Projects Stacked Vertically (Atas - Bawah) */}
          <div
            className="home-projects-stack"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {HOMEPAGE_PROJECTS.map((project, idx) => {
              const TypeIcon = project.typeIcon;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    playClick();
                    setSelectedProject(project);
                  }}
                  onMouseEnter={playHover}
                  className="home-project-card"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${project.accent}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  }}
                >
                  {/* 16:7 Visual Banner */}
                  <div
                    className="home-project-banner"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 7',
                      background: 'var(--surface-2)',
                      borderBottom: '1px solid var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Category Pill */}
                    <div
                      className="home-project-cat-badge"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                      }}
                    >
                      <TypeIcon size={12} style={{ color: project.accent }} />
                      <span className="home-project-cat-text">{project.category}</span>
                    </div>

                    {/* Zoom Icon */}
                    <div
                      className="home-project-zoom-btn"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <ZoomIn size={13} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div
                    className="home-project-content"
                    style={{
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h3
                        className="home-project-title"
                        style={{
                          margin: '0 0 6px',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--text)',
                          lineHeight: 1.35,
                        }}
                      >
                        {project.title}
                      </h3>
                      <p
                        className="home-project-desc"
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.55,
                          margin: '0 0 12px',
                          fontWeight: 300,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div
                        className="home-project-tags"
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '5px',
                          marginBottom: '14px',
                        }}
                      >
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '5px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border)',
                              color: 'var(--text)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div
                      className="home-project-footer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      {project.id === 'handspeak' ? (
                        <Link
                          to="/playground#handspeak"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                          }}
                          onMouseEnter={playHover}
                          className="home-project-ai-btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 12px',
                            borderRadius: '999px',
                            background: 'rgba(255, 59, 29, 0.12)',
                            border: '1px solid rgba(255, 59, 29, 0.35)',
                            color: '#FF3B1D',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(255, 59, 29, 0.15)',
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Preview AI</span>
                        </Link>
                      ) : (
                        <div className="home-project-empty-spacer" />
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          setSelectedProject(project);
                        }}
                        onMouseEnter={playHover}
                        className="home-project-detail-btn"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 0',
                        }}
                      >
                        Detail Proyek &rarr;
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Action: Link to All Projects */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/projects"
              onClick={playClick}
              onMouseEnter={playHover}
              style={{ textDecoration: 'none' }}
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="showcase-nav-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '999px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px var(--shadow-color)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <span>Lihat Semua Proyek</span>
                <ArrowUpRight size={15} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PHOTO LIGHTBOX MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox item={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>

      {/* =========================================================================
          PROJECT DETAIL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playClick();
                  setSelectedProject(null);
                }}
                aria-label="Tutup Detail Proyek"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <X size={16} />
              </button>

              {/* Banner */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 8',
                  background: 'var(--surface-2)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Detail Body */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: selectedProject.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {selectedProject.category}
                  </span>
                </div>

                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: '1.25rem',
                    color: 'var(--text)',
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}
                >
                  {selectedProject.title}
                </h3>

                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                  }}
                >
                  {selectedProject.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {selectedProject.techStack.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.72rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* If Handspeak, Show direct Preview link button */}
                {selectedProject.id === 'handspeak' && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <Link
                      to="/playground#handspeak"
                      onClick={() => {
                        playClick();
                        setSelectedProject(null);
                      }}
                      onMouseEnter={playHover}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #FF3B1D, #ff6444)',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 18px rgba(255, 59, 29, 0.35)',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Buka Live AI Demo di Playground</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          STYLES (Split-Grid matching Contact Page)
          ========================================================================= */}
      <style>{`
        .home-showcase-split-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          gap: 32px;
          max-width: 1260px;
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 0 24px;
          align-items: stretch;
        }

        .home-showcase-col-left,
        .home-showcase-col-right {
          display: flex;
          flex-direction: column;
          min-width: 0;
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
        }

        .home-project-card:hover .home-project-banner img {
          transform: scale(1.04);
        }

        @media (max-width: 1023px) {
          .home-showcase-split-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 40px !important;
            padding: 0 16px !important;
          }
          .home-showcase-col-left,
          .home-showcase-col-right {
            width: 100% !important;
            max-width: 100% !important;
          }
        }

        /* Mobile View (HP): 2 Boxes in 1 Row for Projects Section */
        @media (max-width: 860px) {
          .home-projects-stack {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .home-project-card {
            border-radius: 12px !important;
          }
          .home-project-banner {
            aspect-ratio: 16 / 9 !important;
          }
          .home-project-cat-badge {
            padding: 3px 6px !important;
            top: 6px !important;
            right: 6px !important;
          }
          .home-project-cat-text {
            display: none !important;
          }
          .home-project-zoom-btn {
            display: none !important;
          }
          .home-project-content {
            padding: 10px 10px 12px !important;
          }
          .home-project-title {
            font-size: 0.8rem !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            min-height: 32px !important;
          }
          .home-project-desc {
            display: none !important;
          }
          .home-project-tags {
            display: none !important;
          }
          .home-project-footer {
            padding-top: 8px !important;
            margin-top: auto !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
          }
          .home-project-empty-spacer {
            display: none !important;
          }
          .home-project-ai-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 5px 8px !important;
            font-size: 0.7rem !important;
          }
          .home-project-detail-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 4px 6px !important;
            font-size: 0.72rem !important;
            text-align: center !important;
          }
        }

        @media (max-width: 640px) {
          .home-showcase-split-grid {
            padding: 0 12px !important;
            gap: 32px !important;
          }
          .home-gallery-masonry {
            gap: 8px !important;
          }
          .home-projects-stack {
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
