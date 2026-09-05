import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Palette, Users, Grid, Sparkles, ZoomIn, X, Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../components/ui/SoundProvider';
import MainframeHero from '../components/MainframeHero';

const ALBUM_ITEMS = [
  {
    id: 'photo-coca-cola',
    title: 'Fotografi Komersial Produk Coca-Cola',
    category: 'Photography',
    date: '2024',
    caption: 'Sesi fotografi produk dengan efek water splash dan pencahayaan dramatis untuk kebutuhan advertising.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/fotografi produk coca cola (9_16).png',
  },
  {
    id: 'design-xbanner',
    title: 'Desain X-Banner Produk Inovasi',
    category: 'Creative',
    date: '2024',
    caption: 'Perancangan media promosi visual dan tata letak informasi produk inovasi untuk kebutuhan presentasi teknologi.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/x banner produk inovasi 1_1.png',
  },
  {
    id: 'design-idcard',
    title: 'Desain ID Card Staff Internship',
    category: 'Creative',
    date: '2024',
    caption: 'Perancangan identitas kartu tanda pengenal staff internship dengan tipografi modern dan tata letak visual yang presisi.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/design id card 4_3.png',
  },
  {
    id: 'event-rindu-tenang',
    title: 'Event Organizer — Rindu Tenang',
    category: 'Events',
    date: '2023',
    caption: 'Dokumentasi manajemen operasional panggung dan koordinasi kepanitiaan pada pagelaran musik dan seni Rindu Tenang.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/event organizer rindu tenang 16_9.png',
  },
  {
    id: 'event-live-stage',
    title: 'Dokumentasi Live Event Musik',
    category: 'Events',
    date: '2023',
    caption: 'Liputan momen interaktif dan atmosfer panggung pada rangkaian kegiatan acara kampus dalam format vertikal.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/event 9_16.png',
  },
  {
    id: 'event-himti-games',
    title: 'Dokumentasi Turnamen HIMTI Games',
    category: 'Events',
    date: '2023',
    caption: 'Liputan dokumentasi visual turnamen e-sports dan kompetisi olahraga tahunan Himpunan Mahasiswa TI.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/event himti games (9_16).png',
  },
  {
    id: 'tim-pubdok-pkkmb',
    title: 'Tim Pubdok PKKMB Vokasi 2025',
    category: 'Events',
    date: '2025',
    caption: 'Aksi dokumentasi visual tim publikasi dalam mengabadikan dinamika orientasi mahasiswa baru Fakultas Vokasi USU 2025.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/tim publikasi dokumentasi pkkmb vokasi 2025 4_3.png',
  },
  {
    id: 'banner-sidang',
    title: 'Desain Banner Sidang Meja Hijau',
    category: 'Creative',
    date: '2025',
    caption: 'Perancangan banner perayaan kelulusan dan ucapan selamat sidang tugas akhir program studi Teknik Informatika.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/banner sidang 1_1.png',
  },
  {
    id: 'pkbm-bintula',
    title: 'Pengabdian Mengajar Komputer PKBM Bintula',
    category: 'Events',
    date: '2024',
    caption: 'Program pelatihan literasi digital dan pengenalan aplikasi perkantoran bagi para peserta didik di PKBM Bintula.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/mengajar komputer di pkbm bintula 16_9.png',
  },
  {
    id: 'magang-bpjs',
    title: 'Aktivitas Magang BPJS Ketenagakerjaan',
    category: 'Events',
    date: '2024',
    caption: 'Dokumentasi profesional selama bertugas di BPJS Ketenagakerjaan pada bagian IT support dan rekonsiliasi data operasional.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/magang bpjs 9_16.png',
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All Media', icon: Grid },
  { id: 'Photography', label: 'Photography', icon: Camera },
  { id: 'Creative', label: 'Design & Visuals', icon: Palette },
  { id: 'Events', label: 'Events & Campus', icon: Users },
];

export default function AlbumPage() {
  const { playClick, playHover } = useSoundContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    document.title = 'Visual Album — Muhammad Daffa Zacky Andyka';
    window.scrollTo(0, 0);
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? ALBUM_ITEMS
      : ALBUM_ITEMS.filter((item) => item.category === activeCategory);

  const handleScrollToAlbum = () => {
    const section = document.getElementById('album-gallery-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* 1. Mainframe Mouse-Scrub Hero Section */}
      <MainframeHero onExploreClick={handleScrollToAlbum} />

      {/* 2. Full Visual Album Showcase Section */}
      <section
        id="album-gallery-section"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--bg)',
          padding: '80px clamp(16px, 5vw, 64px) 120px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                Visual Documentation & Media
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              The Visual Album
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.98rem',
                maxWidth: '600px',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Kumpulan arsip visual komprehensif yang merangkum karya fotografi, desain publikasi, dokumentasi event kampus, dan pengabdian masyarakat.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '40px',
              flexWrap: 'wrap',
            }}
          >
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = activeCategory === id;
              const count = id === 'All' ? ALBUM_ITEMS.length : ALBUM_ITEMS.filter((i) => i.category === id).length;
              return (
                <motion.button
                  key={id}
                  onClick={() => {
                    playClick();
                    setActiveCategory(id);
                  }}
                  onMouseEnter={playHover}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'var(--surface)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                    boxShadow: active ? '0 4px 14px var(--accent-glow)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: active ? 0.9 : 0.6,
                      background: active ? 'rgba(255,255,255,0.25)' : 'var(--surface-2)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                    }}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Balanced 3-Column Masonry Grid */}
          <div
            className="album-masonry-wrapper"
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            {[0, 1, 2].map((colIndex) => {
              const colItems = filteredItems.filter((_, idx) => idx % 3 === colIndex);
              return (
                <div
                  key={colIndex}
                  className="album-masonry-col"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minWidth: 0,
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {colItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.35 }}
                        className="album-card"
                        onClick={() => {
                          playClick();
                          setSelectedPhoto(item);
                        }}
                        style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px var(--shadow-color)',
                          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                          <img
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          />

                          {/* Hover Zoom & Info Overlay */}
                          <div
                            className="album-card-overlay"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background:
                                'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.82) 100%)',
                              opacity: 0,
                              transition: 'opacity 0.28s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              padding: '16px',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--accent)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.category} • {item.date}
                            </span>
                            <h4
                              style={{
                                color: '#ffffff',
                                margin: 0,
                                fontSize: '0.98rem',
                                fontWeight: 700,
                                lineHeight: 1.3,
                              }}
                            >
                              {item.title}
                            </h4>
                          </div>

                          {/* Zoom Icon Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'rgba(0,0,0,0.65)',
                              backdropFilter: 'blur(6px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              opacity: 0.85,
                            }}
                          >
                            <ZoomIn size={14} />
                          </div>
                        </div>

                        {/* Card Footer Details */}
                        <div style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600 }}>
                              {item.category}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
                              {item.date}
                            </span>
                          </div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.35 }}>
                            {item.title}
                          </h4>
                          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {item.caption}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 5, 8, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                background: 'var(--surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20,
                }}
              >
                <X size={18} />
              </button>

              {/* Photo Display Frame */}
              <div
                style={{
                  width: '100%',
                  maxHeight: '68vh',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '68vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {/* Photo Information */}
              <div style={{ padding: '20px 24px', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {selectedPhoto.category}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>•</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {selectedPhoto.date}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                  {selectedPhoto.title}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .album-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-border) !important;
          box-shadow: 0 12px 32px var(--shadow-color) !important;
        }
        .album-card:hover .album-card-overlay {
          opacity: 1 !important;
        }
        .album-card:hover img {
          transform: scale(1.03);
        }
        @media (max-width: 768px) {
          .album-masonry-wrapper {
            gap: 10px !important;
          }
          .album-masonry-col {
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
