import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera, Palette, Users, Grid, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';

// Featured 9 items displayed on Homepage & About preview
const FEATURED_GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Photography',
    title: 'Fotografi Komersial Produk Coca-Cola',
    caption: 'Sesi fotografi produk dengan efek water splash dan pencahayaan dramatis untuk kebutuhan advertising.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/fotografi produk coca cola (9_16).png',
    alt: 'Fotografi Komersial Produk Coca-Cola 9:16',
  },
  {
    id: 2,
    category: 'Creative',
    title: 'Desain X-Banner Produk Inovasi',
    caption: 'Perancangan media promosi visual dan tata letak informasi produk inovasi untuk kebutuhan presentasi teknologi.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/x banner produk inovasi 1_1.png',
    alt: 'Desain X-Banner Produk Inovasi 1:1',
  },
  {
    id: 3,
    category: 'Creative',
    title: 'Desain ID Card Staff Internship',
    caption: 'Perancangan identitas kartu tanda pengenal staff internship dengan tipografi modern dan tata letak visual yang presisi.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/design id card 4_3.png',
    alt: 'Desain ID Card Staff Internship 4:3',
  },
  {
    id: 4,
    category: 'Events',
    title: 'Event Organizer — Rindu Tenang',
    caption: 'Dokumentasi manajemen operasional panggung dan koordinasi kepanitiaan pada pagelaran musik dan seni Rindu Tenang.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/event organizer rindu tenang 16_9.png',
    alt: 'Event Organizer Rindu Tenang 16:9',
  },
  {
    id: 5,
    category: 'Events',
    title: 'Volunteer Event HIMTI Games',
    caption: 'Liputan dokumentasi visual turnamen e-sports dan kompetisi olahraga tahunan Himpunan Mahasiswa TI.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/event himti games (9_16).png',
    alt: 'Volunteer Event HIMTI Games 9:16',
  },
  {
    id: 6,
    category: 'Photography',
    title: 'Tim Pubdok PKKMB Vokasi 2025',
    caption: 'Aksi dokumentasi visual tim publikasi dalam mengabadikan dinamika orientasi mahasiswa baru Fakultas Vokasi USU 2025.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/tim publikasi dokumentasi pkkmb vokasi 2025 4_3.png',
    alt: 'Tim Pubdok PKKMB Vokasi 2025 4:3',
  },
  {
    id: 7,
    category: 'Creative',
    title: 'Desain Banner Sidang',
    caption: 'Perancangan banner perayaan kelulusan dan ucapan selamat sidang tugas akhir program studi Teknik Informatika.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/banner sidang 1_1.png',
    alt: 'Desain Banner Sidang 1:1',
  },
  {
    id: 8,
    category: 'Events',
    title: 'Memberikan Pelajaran Komputer PKBM Bina Tunas Muda',
    caption: 'Program pelatihan literasi digital dan pengenalan aplikasi perkantoran bagi para peserta didik di PKBM Bintula.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/mengajar komputer di pkbm bintula 16_9.png',
    alt: 'Memberikan Pelajaran Komputer PKBM Bina Tunas Muda 16:9',
  },
  {
    id: 9,
    category: 'Events',
    title: 'Aktivitas Magang BPJS Ketenagakerjaan',
    caption: 'Dokumentasi profesional selama bertugas di BPJS Ketenagakerjaan pada bagian IT support dan rekonsiliasi data operasional.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/magang bpjs 9_16.png',
    alt: 'Aktivitas Magang BPJS Ketenagakerjaan 9:16',
  },
];

// Complete 21 items displayed exclusively on the Visual Album Page (/album)
const ALL_GALLERY_ITEMS = [
  ...FEATURED_GALLERY_ITEMS,
  {
    id: 10,
    category: 'Events',
    title: 'Dokumentasi Dinamika PKKMB Vokasi 2025',
    caption: 'Dokumentasi antusiasme dan interaksi mahasiswa baru dalam rangkaian pengenalan kehidupan kampus Fakultas Vokasi USU.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/dokumentasi kegiatan pkkmb 2025.png',
    alt: 'Dokumentasi Dinamika PKKMB Vokasi 2025 1:1',
  },
  {
    id: 11,
    category: 'Events',
    title: 'Pameran Karya Expo Vokasi USU 2024',
    caption: 'Partisipasi dan dokumentasi stand pameran karya inovasi teknologi mahasiswa pada gelaran tahunan Expo Vokasi USU.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/expo vokasi usu 2024 4_3.png',
    alt: 'Pameran Karya Expo Vokasi USU 2024 4:3',
  },
  {
    id: 12,
    category: 'Photography',
    title: 'Sidang Zacky',
    caption: 'Potret personal Zacky Andyka di depan deretan papan bunga ucapan selamat kelulusan sarjana Teknik Informatika USU.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/potret sidang dengan papan bunga 9_16.png',
    alt: 'Sidang Zacky 9:16',
  },
  {
    id: 13,
    category: 'Photography',
    title: 'Tim Publikasi & Dokumentasi Visual',
    caption: 'Aksi potret vertikal kru pubdok dalam mengabadikan momen-momen krusial sepanjang kegiatan orientasi kampus.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/tim publikasi dan dokumentasi pkkmb vokasi 2025 9_16.png',
    alt: 'Tim Publikasi dan Dokumentasi Visual 9:16',
  },
  {
    id: 14,
    category: 'Events',
    title: 'Keluarga Besar BSI KCP Medan Area',
    caption: 'Momen kebersamaan bersama jajaran karyawan dan staf Back Office PT. Bank Syariah Indonesia selama masa magang profesional.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/foto bersama karyawan (magang di BSI).png',
    alt: 'Keluarga Besar BSI KCP Medan Area 16:9',
  },
  {
    id: 15,
    category: 'Events',
    title: 'Pelatihan Layanan Operasional PKL Bank Sumut',
    caption: 'Dokumentasi dukungan administrasi dan kepanitiaan pada program pelatihan peningkatan kualitas layanan PT. Bank Sumut.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/program peningkatan kualitas satpam bank sumut (PKL Bank Sumut).png',
    alt: 'Pelatihan Layanan Operasional PKL Bank Sumut 1:1',
  },
  {
    id: 16,
    category: 'Events',
    title: 'Kepanitiaan Bersama PKKMB Vokasi 2025',
    caption: 'Momen kebersamaan seluruh divisi panitia pelaksana setelah sukses menyelenggarakan rangkaian orientasi kampus.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/fotbar panitia pkkmb vokasi 2025.png',
    alt: 'Kepanitiaan Bersama PKKMB Vokasi 2025 16:9',
  },
  {
    id: 17,
    category: 'Events',
    title: 'Momen Kelulusan Sidang Tugas Akhir',
    caption: 'Potret perayaan bersama rekan seperjuangan setelah menyelesaikan sidang meja hijau program studi Teknik Informatika USU.',
    aspectRatio: '9 / 16',
    ratioLabel: '9:16',
    src: '/gallery/fotbar sidang 9_16.png',
    alt: 'Momen Kelulusan Sidang Tugas Akhir 9:16',
  },
  {
    id: 18,
    category: 'Events',
    title: 'On-boarding Magang PT. Bank Syariah Indonesia',
    caption: 'Sesi pembekalan awal dan pengenalan alur kerja operasional perbankan syariah pada kantor cabang Medan Area.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/on-boarding magang bsi 4_3.png',
    alt: 'On-boarding Magang PT. Bank Syariah Indonesia 4:3',
  },
  {
    id: 19,
    category: 'Events',
    title: 'Panitia PKKMB 2025',
    caption: 'Koordinasi lapangan tim pendamping mahasiswa baru dalam mengawal kelancaran aktivitas orientasi akademik kampus.',
    aspectRatio: '4 / 3',
    ratioLabel: '4:3',
    src: '/gallery/panitia pkkmb 2025 4_3.png',
    alt: 'Panitia PKKMB 2025 4:3',
  },
  {
    id: 20,
    category: 'Events',
    title: 'Potret Wisuda Teknik Informatika USU',
    caption: 'Dokumentasi momen kelulusan wisuda sarjana Teknik Informatika dengan predikat Cum Laude di Universitas Sumatera Utara.',
    aspectRatio: '1 / 1',
    ratioLabel: '1:1',
    src: '/gallery/fotbar wisuda.png',
    alt: 'Potret Wisuda Teknik Informatika USU 1:1',
  },
  {
    id: 21,
    category: 'Events',
    title: 'Pelantikan Pengurus HIMTI USU',
    caption: 'Dokumentasi seremoni pelantikan kepengurusan Himpunan Mahasiswa Teknologi Informasi Universitas Sumatera Utara.',
    aspectRatio: '16 / 9',
    ratioLabel: '16:9',
    src: '/gallery/Pelantikan HIMTI.png',
    alt: 'Pelantikan Pengurus HIMTI USU 16:9',
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
          fontSize: '10px',
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

export default function Gallery({
  showAlbumButton = true,
  id = 'gallery',
  isFullAlbum = false,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const { playClick } = useSoundContext();
  const { ref: titleRef, inView: titleVisible } = useInView({ threshold: 0.2, triggerOnce: true });

  const rawItems = isFullAlbum ? ALL_GALLERY_ITEMS : FEATURED_GALLERY_ITEMS;
  const filtered = activeCategory === 'All'
    ? rawItems
    : rawItems.filter(i => i.category === activeCategory);

  return (
    <section id={id} style={{ padding: '48px 0', background: 'var(--bg)' }}>
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

        {/* Button to navigate to full Album Page */}
        {showAlbumButton && (
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/album"
              onClick={playClick}
              style={{ textDecoration: 'none' }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 30px',
                  borderRadius: '999px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px var(--shadow-color)',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
              >
                <span>My Album</span>
                <ArrowUpRight size={17} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </Link>
          </div>
        )}

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
            .gallery-card-overlay {
              display: none !important;
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