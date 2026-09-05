import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Smartphone,
  Globe,
  BarChart3,
  Layers,
  ZoomIn,
  X,
  ExternalLink,
  Instagram,
  Printer,
  Code2,
  Sparkles,
  ArrowUpRight,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

// 1. Featured Software Projects
const SOFTWARE_PROJECTS = [
  {
    id: 'handspeak',
    title: 'Handspeak: BISINDO Sign Language Translator',
    subtitle: 'Mobile AI & Computer Vision',
    category: 'Mobile AI Application',
    typeIcon: Smartphone,
    accent: '#FF3B1D',
    highlightBadge: 'Computer Vision AI',
    description:
      'Aplikasi mobile penerjemah bahasa isyarat Indonesia (BISINDO) secara real-time berbasis kecerdasan buatan (Computer Vision & Machine Learning) untuk menjembatani komunikasi inklusif bagi teman tuli.',
    techStack: ['Flutter', 'Python', 'TensorFlow Lite', 'MediaPipe', 'Mobile AI'],
    metrics: [
      { label: 'Metode', value: 'Real-Time CV' },
      { label: 'Platform', value: 'Android / iOS' },
    ],
    image: '/projects/handspeak.webp',
  },
  {
    id: 'mahaasyik',
    title: 'Mahaasyik Resto: Sistem Manajemen & Pemesanan Restoran',
    subtitle: 'Full-Stack Web & Payment Gateway',
    category: 'Full-Stack Web App',
    typeIcon: Globe,
    accent: '#FFAA00',
    highlightBadge: 'Production Ready',
    description:
      'Platform aplikasi web manajemen dan pemesanan restoran komprehensif berarsitektur decoupled (React.js SPA & Laravel 11 REST API). Mendigitalkan katalog menu, reservasi meja cerdas dengan DP otomatis, hingga integrasi Midtrans Snap payment gateway.',
    techStack: ['React.js 18', 'Laravel 11', 'TailwindCSS', 'Midtrans Snap', 'MySQL 8', 'RESTful API'],
    metrics: [
      { label: 'Arsitektur', value: 'Decoupled' },
      { label: 'Payment', value: 'Midtrans QRIS/VA' },
    ],
    image: '/projects/Mahaasyik.webp',
  },
  {
    id: 'sigma-bpjstk',
    title: 'SIGMA BPJSTK: Sistem Monitoring Aktivitas MBKM',
    subtitle: 'Enterprise Web & Geolocation System',
    category: 'Enterprise Web System',
    typeIcon: Layers,
    accent: '#10B981',
    highlightBadge: 'Enterprise Deployment',
    description:
      'Platform web terpadu berarsitektur decoupled (React.js SPA & Laravel RESTful API) untuk memonitor seluruh siklus program MBKM BPJS Ketenagakerjaan dengan presensi geotagging GPS, modul jaminan sosial, dan role-based access control (RBAC).',
    techStack: ['React.js', 'Laravel 11', 'TailwindCSS', 'MySQL', 'Geolocation API', 'RBAC'],
    metrics: [
      { label: 'Peserta', value: '198 Mahasiswa' },
      { label: 'Keamanan', value: 'Role-Based RBAC' },
    ],
    image: '/projects/sigma-bpjstk.png',
  },
  {
    id: 'bank-sumut',
    title: 'Visualisasi Rekapan Operasional Bank Sumut',
    subtitle: 'Banking Analytics & Financial Reporting',
    category: 'Banking Web Dashboard',
    typeIcon: BarChart3,
    accent: '#0284C7',
    highlightBadge: 'Financial BI',
    description:
      'Dashboard web analitik visual data rekapan transaksi operasional harian PT Bank Sumut. Menyajikan pemantauan transaksi tunai & non-tunai cabang, rasio produktivitas teller, dan tren volume transaksi bulanan secara terstruktur dan real-time.',
    techStack: ['Web Dashboard', 'Data Analytics', 'Chart.js', 'Banking Operations', 'Financial BI'],
    metrics: [
      { label: 'Sektor', value: 'Perbankan' },
      { label: 'Output', value: 'Analytics BI' },
    ],
    image: '/projects/visualisasi-bank-sumut.png',
  },
];

// 2. Digital & Social Media Designs
const DIGITAL_DESIGNS = [
  {
    id: 'ig-himti',
    title: 'Desain Feed & Identitas Media Sosial HIMTI USU',
    category: 'Social Media & Brand Identity',
    accent: '#FF3B1D',
    platform: 'Instagram (@himti_fvusu)',
    url: 'https://www.instagram.com/himti_fvusu/',
    description:
      'Perancangan sistem konten feed Instagram resmi organisasi HIMTI USU mencakup infografis teknologi, ucapan hari besar, rekap kegiatan, dan feed karusel berkesinambungan yang profesional.',
    tools: ['Figma', 'Photoshop', 'Grid Feed System', 'Content Strategy'],
    image: '/designs/digital/ig_himti.webp',
  },
  {
    id: 'ig-pkkmb',
    title: 'Desain Feed & Informasi Resmi PKKMB Vokasi USU 2025',
    category: 'Social Media & Event Campaign',
    accent: '#FFAA00',
    platform: 'Instagram (@simarmuda.fv.usu)',
    url: 'https://www.instagram.com/simarmuda.fv.usu/',
    description:
      'Desain visual feed informasi panduan mahasiswa baru, penugasan orientasi kampus, pengumuman jadwal, dan publikasi dokumentasi resmi masa orientasi PKKMB Vokasi USU 2025.',
    tools: ['Figma', 'Social Media Kit', 'Visual Campaign', 'Typography'],
    image: '/designs/digital/ig_pkkmb.webp',
  },
];

// 3. Physical & Print Media Designs
const PHYSICAL_DESIGNS = [
  {
    id: 'lanyard-id-himpunan',
    title: 'Desain Lanyard & ID Card Pengurus HIMTI',
    category: 'Merchandise & Identitas',
    accent: '#FF3B1D',
    description:
      'Identitas resmi fungsionaris kepengurusan Himpunan Mahasiswa Teknik Informatika (HIMTI) dengan tipografi tegas, tata letak modern, dan palet warna kontras.',
    tools: ['Figma', 'Vector Design', 'Sublimation Print'],
    image: '/designs/physical/Lanyard_ID_himpunan.webp',
  },
  {
    id: 'lanyard-panitia-pkkmb',
    title: 'Lanyard Panitia PKKMB Fakultas Vokasi USU 2025',
    category: 'Kepanitiaan Kampus',
    accent: '#3B82F6',
    description:
      'Desain tali lanyard resmi seluruh panitia masa orientasi PKKMB Vokasi USU 2025 dengan kombinasi warna almamater dan identitas acara.',
    tools: ['Figma', 'Event Branding', 'Sublimation Print'],
    image: '/designs/physical/lanyard_panitia_pkkmb.webp',
  },
  {
    id: 'id-card-panitia-pkkmb',
    title: 'ID Card Panitia PKKMB Fakultas Vokasi USU 2025',
    category: 'Kepanitiaan Kampus',
    accent: '#10B981',
    description:
      'Desain kartu tanda pengenal PVC panitia pelaksana kegiatan orientasi mahasiswa baru Vokasi USU dengan kode divisi dan hierarki informasi terstruktur.',
    tools: ['Figma', 'PVC Card', 'Event Signage'],
    image: '/designs/physical/id_card_panitia_pkkmb.webp',
  },
  {
    id: 'design-id-card-internship',
    title: 'Desain ID Card Staff Internship',
    category: 'Identitas Perusahaan',
    accent: '#C084FC',
    description:
      'Desain kartu tanda pengenal resmi staf magang dengan layout profesional, barcode verifikasi, dan standar hierarki visual institusi.',
    tools: ['Figma', 'Corporate Identity', 'Card Design'],
    image: '/designs/physical/design_id_card_internship_4_3.webp',
  },
  {
    id: 'poster-handspeak',
    title: 'Poster Promosi & Peluncuran Aplikasi Handspeak',
    category: 'Poster Inovasi AI',
    accent: '#FF3B1D',
    description:
      'Media publikasi cetak dan promosi fitur unggulan aplikasi penerjemah bahasa isyarat BISINDO berbasis Computer Vision AI.',
    tools: ['Figma', 'Product Showcase', 'Visual Layout'],
    image: '/designs/physical/poster_aplikasi_handspeak.webp',
  },
  {
    id: 'poster-menu-himti-games',
    title: 'Poster Menu Tenant & Konsumsi HIMTI Games',
    category: 'Event Signage',
    accent: '#FFAA00',
    description:
      'Desain daftar menu tenant makanan dan minuman pada venue acara kompetisi dengan layout harga yang mudah dibaca pengunjung.',
    tools: ['Graphic Design', 'Menu Layout', 'Typography'],
    image: '/designs/physical/poster_menu_makanan_di_event_himti_games.webp',
  },
  {
    id: 'lanyard-himti-games',
    title: 'Lanyard & Tali ID Event HIMTI Games',
    category: 'Event Merchandise',
    accent: '#F59E0B',
    description:
      'Desain tali lanyard cetak ganda dengan motif visual khas ajang kompetisi olahraga dan e-sports HIMTI Games.',
    tools: ['Vector Art', 'Sublimation Lanyard', 'Event Branding'],
    image: '/designs/physical/lanyard_event_himti_games.webp',
  },
  {
    id: 'spanduk-pelantikan',
    title: 'Spanduk Utama Pelantikan Pengurus HIMTI',
    category: 'Backdrop & Spanduk',
    accent: '#3B82F6',
    description:
      'Spanduk panggung seremoni pelantikan resmi badan pengurus harian HIMTI USU dengan kesan formal, berwibawa, dan megah.',
    tools: ['Large Format Banner', 'Vector Layout', 'Outdoor Print'],
    image: '/designs/physical/spanduk_pelantikan_himpunan.webp',
  },
  {
    id: 'x-banner-produk',
    title: 'X-Banner Pameran Karya Produk Inovasi',
    category: 'Standing X-Banner',
    accent: '#10B981',
    description:
      'Standing banner vertikal untuk ekshibisi pameran inovasi teknologi dengan infografis alur sistem dan fitur unggulan.',
    tools: ['Figma', 'Exhibition Display', 'Vector Infographic'],
    image: '/designs/physical/x_banner_produk_inovasi_1_1.webp',
  },
  {
    id: 'banner-sidang',
    title: 'Banner Apresiasi Sidang Sarjana / Ahli Madya',
    category: 'Banner Selebrasi',
    accent: '#EC4899',
    description:
      'Desain banner selebrasi kelulusan sidang tugas akhir dengan komposisi grafis elegan, ceria, dan tipografi modern.',
    tools: ['Figma', 'Celebration Banner', 'Print Media'],
    image: '/designs/physical/banner_sidang_1_1.webp',
  },
  {
    id: 'banner-wisuda-sirkel-1',
    title: 'Banner Wisuda Graduation Circles (Edisi I)',
    category: 'Banner Wisuda',
    accent: '#F59E0B',
    description:
      'Spanduk visual selebrasi kelulusan wisuda universitas dengan foto potret wisudawan dan elemen grafis selebrasi hangat.',
    tools: ['Figma', 'Outdoor Banner', 'Graduation Kit'],
    image: '/designs/physical/banner_wisuda_sirkel.webp',
  },
  {
    id: 'banner-wisuda-sirkel-2',
    title: 'Banner Wisuda Graduation Circles (Edisi II)',
    category: 'Banner Wisuda',
    accent: '#C084FC',
    description:
      'Desain banner ucapan selamat wisuda bertema selebrasi kelulusan penuh keceriaan untuk teman-teman terdekat.',
    tools: ['Figma', 'Large Format Banner', 'Photo Collage'],
    image: '/designs/physical/banner_wisuda_another_sirkel.webp',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'Semua Karya', count: 18, icon: LayoutGrid },
  { id: 'software', label: 'Software & AI', count: 4, icon: Code2 },
  { id: 'physical', label: 'Desain Fisik & Cetak', count: 12, icon: Printer },
  { id: 'digital', label: 'Digital & Medsos', count: 2, icon: Instagram },
];

export default function Projects() {
  const { playClick, playHover } = useSoundContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleTabChange = (tabId) => {
    playClick();
    setActiveFilter(tabId);
  };

  const openModal = (item) => {
    playClick();
    setActiveModal(item);
  };

  const closeModal = () => {
    playClick();
    setActiveModal(null);
  };

  const showSoftware = activeFilter === 'all' || activeFilter === 'software';
  const showDigital = activeFilter === 'all' || activeFilter === 'digital';
  const showPhysical = activeFilter === 'all' || activeFilter === 'physical';

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: 'clamp(36px, 6vw, 70px) 20px 90px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* =========================================================================
            1. MASTER EDITORIAL HEADER & FILTER TABS (taste-skill Standard)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
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
            SELECTED WORKS &amp; PORTFOLIO
          </div>

          {/* Display Headline (No Em-Dashes, text-wrap: balance) */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5.2vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              color: 'var(--text)',
              margin: '0 auto 14px',
              maxWidth: '820px',
              textWrap: 'balance',
            }}
          >
            Crafted with Code, Data &amp;{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Visual Precision.
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
              maxWidth: '620px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
              textWrap: 'pretty',
            }}
          >
            Kompilasi rekayasa kecerdasan buatan, sistem web fullstack enterprise, dashboard analitik perbankan, dan identitas visual desain grafis.
          </p>

          {/* Interactive Filter Pills */}
          <div
            className="projects-filter-wrapper"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              margin: '0 auto',
            }}
          >
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onMouseEnter={playHover}
                  className="projects-filter-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    background: isActive ? 'var(--accent-dim)' : 'var(--surface-2)',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                    boxShadow: isActive ? '0 0 16px var(--accent-glow)' : 'none',
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? 'var(--accent)' : 'var(--text-dim)' }} />
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--accent)' : 'var(--surface)',
                      color: isActive ? '#ffffff' : 'var(--text-dim)',
                      fontWeight: 700,
                      marginLeft: '2px',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* =========================================================================
            2. SECTION: FEATURED SOFTWARE & AI (Asymmetric Bento Grid)
            ========================================================================= */}
        {showSoftware && (
          <div style={{ marginBottom: '64px' }}>
            {activeFilter === 'all' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 size={18} style={{ color: 'var(--accent)' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    Software &amp; AI Engineering
                  </h2>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                  }}
                >
                  4 Proyek Terpilih
                </span>
              </div>
            )}

            {/* Asymmetric Bento Showcase */}
            <div className="software-bento-grid">
              {SOFTWARE_PROJECTS.map((proj, idx) => {
                const TypeIcon = proj.typeIcon;

                return (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                    onClick={() => openModal({
                      title: proj.title,
                      category: proj.category,
                      image: proj.image,
                      description: proj.description,
                      tags: proj.techStack,
                      metrics: proj.metrics,
                    })}
                    onMouseEnter={playHover}
                    className="software-bento-card"
                    style={{
                      position: 'relative',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      boxShadow: '0 12px 36px var(--shadow-color)',
                      transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                    }}
                  >
                    {/* Visual Banner 16:9 */}
                    <div
                      className="software-banner-box"
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '16 / 8.5',
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={proj.image}
                        alt={proj.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      {/* Top Badges */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(0, 0, 0, 0.72)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.4px',
                        }}
                      >
                        <TypeIcon size={12} style={{ color: proj.accent }} />
                        <span>{proj.category}</span>
                      </div>

                      {/* Accent Dot / Pill on Right */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: 'rgba(0, 0, 0, 0.72)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: proj.accent,
                          fontSize: '10.5px',
                          fontWeight: 700,
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: proj.accent,
                            boxShadow: '0 0 6px ' + proj.accent,
                          }}
                        />
                        <span>{proj.highlightBadge}</span>
                      </div>

                      {/* Zoom hint overlay */}
                      <div
                        className="software-zoom-hint"
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <ZoomIn size={14} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div
                      style={{
                        padding: 'clamp(16px, 2.5vw, 24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: 'var(--text)',
                            margin: '0 0 8px',
                            lineHeight: 1.3,
                          }}
                        >
                          {proj.title}
                        </h3>

                        <p
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                            margin: '0 0 16px',
                            fontWeight: 400,
                          }}
                        >
                          {proj.description}
                        </p>
                      </div>

                      <div>
                        {/* Tech Stack Pills */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginBottom: '16px',
                          }}
                        >
                          {proj.techStack.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '7px',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                color: 'var(--text)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Card Bottom: Metrics + Detail CTA */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--border)',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '14px' }}>
                            {proj.metrics.map((m, mIdx) => (
                              <div key={mIdx} style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  {m.label}
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>

                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: proj.accent,
                            }}
                          >
                            <span>Detail Preview</span>
                            <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. SECTION: DIGITAL & SOCIAL MEDIA DESIGNS
            ========================================================================= */}
        {showDigital && (
          <div style={{ marginBottom: '64px' }}>
            {activeFilter === 'all' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Instagram size={18} style={{ color: '#E1306C' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    Desain Feed Instagram &amp; Media Sosial
                  </h2>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                  }}
                >
                  2 Sistem Konten
                </span>
              </div>
            )}

            <div
              className="designs-digital-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '24px',
              }}
            >
              {DIGITAL_DESIGNS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => openModal({
                    title: item.title,
                    category: item.category,
                    image: item.image,
                    description: item.description,
                    tags: item.tools,
                    platform: item.platform,
                    url: item.url,
                  })}
                  onMouseEnter={playHover}
                  className="digital-design-card"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px var(--shadow-color)',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  }}
                >
                  <div>
                    {/* Visual 4:3 */}
                    <div
                      className="digital-photo-box"
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4 / 3',
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 600,
                          zIndex: 2,
                        }}
                      >
                        <Instagram size={13} style={{ color: '#E1306C' }} />
                        <span>{item.platform}</span>
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <ZoomIn size={14} />
                      </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: item.accent,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        {item.category}
                      </span>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          letterSpacing: '-0.02em',
                          color: 'var(--text)',
                          margin: '0 0 8px',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.6,
                          margin: 0,
                          fontWeight: 400,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '14px 20px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.tools.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-dim)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                      }}
                      onMouseEnter={playHover}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(225, 48, 108, 0.12)',
                        border: '1px solid rgba(225, 48, 108, 0.3)',
                        color: '#FF6484',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Instagram size={13} />
                      <span>Kunjungi IG</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. SECTION: PHYSICAL & PRINT MEDIA DESIGNS (3-Col Grid)
            ========================================================================= */}
        {showPhysical && (
          <div style={{ marginBottom: '40px' }}>
            {activeFilter === 'all' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Printer size={18} style={{ color: 'var(--accent-2)' }} />
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'var(--text)',
                      margin: 0,
                    }}
                  >
                    Hasil Desain Fisik &amp; Cetak
                  </h2>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                  }}
                >
                  12 Karya Cetak
                </span>
              </div>
            )}

            <div
              className="designs-physical-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '20px',
              }}
            >
              {PHYSICAL_DESIGNS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => openModal({
                    title: item.title,
                    category: item.category,
                    image: item.image,
                    description: item.description,
                    tags: item.tools,
                  })}
                  onMouseEnter={playHover}
                  className="physical-design-card"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px var(--shadow-color)',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  }}
                >
                  <div>
                    {/* Visual 4:3 */}
                    <div
                      className="physical-photo-box"
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4 / 3',
                        background: 'var(--surface-2)',
                        overflow: 'hidden',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          fontSize: '10.5px',
                          fontWeight: 600,
                        }}
                      >
                        {item.category}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.7)',
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

                    <div style={{ padding: '16px' }}>
                      <h3
                        style={{
                          fontSize: '1.02rem',
                          fontWeight: 700,
                          letterSpacing: '-0.01em',
                          color: 'var(--text)',
                          margin: '0 0 6px',
                          lineHeight: 1.35,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.55,
                          margin: 0,
                          fontWeight: 400,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '10px 16px 14px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                    }}
                  >
                    {item.tools.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-dim)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. UNIVERSAL LIGHTBOX MODAL (Escape key & backdrop dismiss)
            ========================================================================= */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 16 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  maxWidth: '880px',
                  width: '100%',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
                  position: 'relative',
                }}
              >
                {/* Media frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: '66vh',
                    background: '#070709',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={activeModal.image}
                    alt={activeModal.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '66vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <button
                    onClick={closeModal}
                    title="Tutup Preview (Esc)"
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal info body */}
                <div style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 800,
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {activeModal.category}
                    </span>
                    {activeModal.platform && (
                      <>
                        <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
                        <span style={{ fontSize: '12px', color: 'var(--accent-2)', fontWeight: 600 }}>
                          {activeModal.platform}
                        </span>
                      </>
                    )}
                  </div>

                  <h3
                    style={{
                      margin: '0 0 10px',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 800,
                      color: 'var(--text)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                    }}
                  >
                    {activeModal.title}
                  </h3>

                  <p
                    style={{
                      margin: '0 0 18px',
                      fontSize: '0.92rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.65,
                    }}
                  >
                    {activeModal.description}
                  </p>

                  {/* Metrics if available */}
                  {activeModal.metrics && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '18px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {activeModal.metrics.map((m, idx) => (
                        <div key={idx}>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {m.label}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech / Tools tags */}
                  {activeModal.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {activeModal.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '4px 11px',
                            borderRadius: '8px',
                            background: 'var(--surface-2)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* External URL CTA */}
                  {activeModal.url && (
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <a
                        href={activeModal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          borderRadius: '12px',
                          background: 'rgba(225, 48, 108, 0.15)',
                          border: '1px solid rgba(225, 48, 108, 0.35)',
                          color: '#FF6484',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <Instagram size={16} />
                        <span>Kunjungi Akun Instagram Resmi</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            6. RESPONSIVE CSS & HOVER DYNAMICS
            ========================================================================= */}
        <style>{`
          .software-bento-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }

          .software-bento-card:hover {
            border-color: var(--accent) !important;
            box-shadow: 0 16px 44px var(--shadow-color), 0 0 24px var(--accent-glow) !important;
          }

          .software-bento-card:hover .software-banner-box img,
          .digital-design-card:hover .digital-photo-box img,
          .physical-design-card:hover .physical-photo-box img {
            transform: scale(1.04);
          }

          .digital-design-card:hover {
            border-color: rgba(225, 48, 108, 0.5) !important;
            box-shadow: 0 16px 40px var(--shadow-color), 0 0 20px rgba(225, 48, 108, 0.15) !important;
          }

          .physical-design-card:hover {
            border-color: var(--accent-2) !important;
            box-shadow: 0 14px 36px var(--shadow-color), 0 0 20px var(--accent-glow) !important;
          }

          @media (max-width: 1024px) {
            .designs-physical-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 16px !important;
            }
          }

          @media (max-width: 768px) {
            #projects {
              padding: 28px 12px 64px !important;
            }

            .software-bento-grid {
              grid-template-columns: 1fr !important;
              gap: 18px !important;
            }

            .designs-digital-grid {
              grid-template-columns: 1fr !important;
              gap: 18px !important;
            }

            .designs-physical-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 12px !important;
            }

            .projects-filter-wrapper {
              gap: 6px !important;
              overflow-x: auto !important;
              white-space: nowrap !important;
              justify-content: flex-start !important;
              padding-bottom: 6px !important;
              -webkit-overflow-scrolling: touch !important;
            }

            .projects-filter-btn {
              padding: 6px 13px !important;
              font-size: 11.5px !important;
              flex-shrink: 0 !important;
            }
          }

          @media (max-width: 480px) {
            .designs-physical-grid {
              gap: 10px !important;
            }
            .physical-design-card {
              border-radius: 12px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
