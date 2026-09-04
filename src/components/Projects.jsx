import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Smartphone,
  Globe,
  BarChart3,
  Palette,
  Sparkles,
  Layers,
  ZoomIn,
  X,
  ExternalLink,
  Instagram,
  Printer,
  Compass,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

// 1. Featured Software Projects (from user's 'projek' folder)
const SOFTWARE_PROJECTS = [
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
  },
  {
    id: 'mahaasyik',
    title: 'Mahaasyik Resto — Sistem Manajemen & Pemesanan Restoran Berbasis Web',
    category: 'Full-Stack Web & Payment Gateway',
    typeIcon: Globe,
    accent: '#FFAA00',
    description:
      'Platform aplikasi web manajemen dan pemesanan restoran komprehensif berstandar production-ready dengan arsitektur decoupled (React.js SPA & Laravel 11 REST API). Mendigitalkan operasional kuliner mulai dari katalog menu interaktif, reservasi meja cerdas dengan down payment (DP) otomatis, integrasi Midtrans Snap payment gateway (QRIS, e-wallet, VA), hingga manajemen pesanan dan dashboard analitik omzet.',
    techStack: ['React.js 18', 'Laravel 11', 'TailwindCSS', 'Midtrans Snap', 'MySQL 8', 'RESTful API'],
    image: '/projects/Mahaasyik.webp',
  },
  {
    id: 'sigma-bpjstk',
    title: 'SIGMA BPJSTK — Sistem Informasi & Monitoring Aktivitas MBKM BPJS Ketenagakerjaan',
    category: 'Enterprise Web & Monitoring System',
    typeIcon: Layers,
    accent: '#10B981',
    description:
      'Platform web terpadu berarsitektur decoupled (React.js SPA & Laravel RESTful API) untuk mendigitalkan, memonitor, dan mengevaluasi seluruh siklus program MBKM BPJS Ketenagakerjaan. Dilengkapi presensi geotagging GPS, kurikulum 6 modul jaminan sosial, pusat penilaian (grading center), audit log, serta role-based access control (RBAC) untuk 198 mahasiswa peserta, mentor koordinator, dan administrator.',
    techStack: ['React.js', 'Laravel 11', 'TailwindCSS', 'MySQL', 'Geolocation API', 'RBAC'],
    image: '/projects/sigma-bpjstk.png',
  },
  {
    id: 'bank-sumut',
    title: 'Visualisasi Rekapan Operasional Bank Sumut',
    category: 'Banking Analytics & Operational Dashboard',
    typeIcon: BarChart3,
    accent: '#0284C7',
    description:
      'Dashboard web visualisasi dan analitik data rekapan transaksi operasional harian PT Bank Sumut. Menyajikan pemantauan transaksi tunai & non-tunai per unit kantor cabang, rasio produktivitas teller, tren volume transaksi bulanan, serta rekapitulasi data kliring dan payment perbankan secara terstruktur dan real-time.',
    techStack: ['Web Dashboard', 'Data Analytics', 'Chart.js', 'Banking Operations', 'Financial Reporting'],
    image: '/projects/visualisasi-bank-sumut.png',
  },
];

// 2. Physical & Print Designs (from user's 'hasil desain fisik' folder)
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

// 3. Digital & Social Media Designs (from user's 'desain ig' folder)
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

const Projects = () => {
  const { playClick, playHover } = useSoundContext();
  const [activeModal, setActiveModal] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: '50px 20px 80px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* =========================================================================
            SECTION 1: FEATURED SOFTWARE PROJECTS (Handspeak & Mahaasyik)
            ========================================================================= */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
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
            Software &amp; Digital Products
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Featured Projects
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              maxWidth: '620px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Aplikasi mobile kecerdasan buatan (AI), sistem web full-stack, enterprise monitoring MBKM, dan dashboard analitik operasional perbankan.
          </p>
        </motion.div>

        {/* 2 Projects Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="projects-software-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {SOFTWARE_PROJECTS.map((project) => {
            const TypeIcon = project.typeIcon;

            return (
              <motion.div
                key={project.id}
                variants={fadeUp}
                onClick={() => {
                  playClick();
                  setActiveModal({
                    title: project.title,
                    category: project.category,
                    image: project.image,
                    description: project.description,
                    tags: project.techStack,
                    status: project.status,
                  });
                }}
                onMouseEnter={playHover}
                whileHover={{ y: -6 }}
                className="project-software-card"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${project.accent}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  minWidth: 0,
                  cursor: 'pointer',
                }}
              >
                {/* 16:7 Visual Banner Preview */}
                <div
                  onClick={() => {
                    playClick();
                    setActiveModal({
                      title: project.title,
                      category: project.category,
                      image: project.image,
                      description: project.description,
                      tags: project.techStack,
                      status: project.status,
                    });
                  }}
                  className="project-banner-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 7',
                    background: '#0a0a0f',
                    borderBottom: '1px solid var(--border)',
                    overflow: 'hidden',
                    cursor: 'pointer',
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
                  {/* Category Pill on top right */}
                  <div
                    className="project-category-badge"
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
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    <TypeIcon size={12} style={{ color: project.accent }} />
                    <span>{project.category}</span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div
                    className="project-zoom-overlay"
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
                    <ZoomIn size={14} />
                  </div>
                </div>

                {/* Card Content */}
                <div
                  className="project-software-content"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      className="project-software-title"
                      style={{
                        margin: '0 0 8px',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        lineHeight: 1.35,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="project-software-desc"
                      style={{
                        fontSize: '0.86rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        margin: '0 0 14px',
                        fontWeight: 300,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div
                      className="project-software-tags"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '16px',
                      }}
                    >
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 9px',
                            borderRadius: '6px',
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

                  {/* Actions Footer */}
                  <div
                    className="project-software-footer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <button
                      onClick={() => {
                        playClick();
                        setActiveModal({
                          title: project.title,
                          category: project.category,
                          image: project.image,
                          description: project.description,
                          tags: project.techStack,
                        });
                      }}
                      onMouseEnter={playHover}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 0',
                      }}
                    >
                      Detail Preview &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =========================================================================
            SECTION 2: DESAIN DIGITAL & INSTAGRAM (Digital & Social Media Design)
            ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
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
            Digital &amp; Social Media Design
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Desain Feed Instagram &amp; Digital
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              maxWidth: '640px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Perancangan strategi identitas visual media sosial, publikasi informasi resmi, dan desain feed terpadu untuk organisasi dan kepanitiaan.
          </p>
        </motion.div>

        {/* Digital Designs Grid: 2 cols desktop & mobile */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="designs-digital-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {DIGITAL_DESIGNS.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              onClick={() => {
                playClick();
                setActiveModal({
                  title: item.title,
                  category: item.category,
                  image: item.image,
                  description: item.description,
                  tags: item.tools,
                  platform: item.platform,
                  url: item.url,
                });
              }}
              onMouseEnter={playHover}
              whileHover={{ y: -6 }}
              className="design-digital-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${item.accent}`,
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              <div>
                {/* Visual Banner 4:3 */}
                <div
                  className="digital-photo-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: '#0a0a0f',
                    overflow: 'hidden',
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
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick();
                    }}
                    onMouseEnter={playHover}
                    title={`Buka ${item.platform} di Instagram`}
                    className="digital-ig-badge"
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
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      zIndex: 3,
                      transition: 'background-color 0.2s, transform 0.2s',
                    }}
                  >
                    <Instagram size={13} style={{ color: item.accent }} />
                    <span>{item.platform}</span>
                    <ExternalLink size={11} style={{ opacity: 0.75 }} />
                  </a>

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
                    <ZoomIn size={14} />
                  </div>
                </div>

                {/* Content */}
                <div className="digital-card-content" style={{ padding: '18px 18px 12px' }}>
                  <span
                    className="digital-cat-badge"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: item.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {item.category}
                  </span>
                  <h3
                    className="digital-title"
                    style={{
                      margin: '0 0 8px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="digital-desc"
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Tools & Instagram Link footer */}
              <div
                className="digital-footer"
                style={{
                  padding: '12px 18px 16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
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
                        fontSize: '0.72rem',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
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
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(225, 48, 108, 0.12)',
                    border: '1px solid rgba(225, 48, 108, 0.3)',
                    color: '#FF6484',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Instagram size={13} />
                  <span>Kunjungi IG</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* =========================================================================
            SECTION 3: HASIL DESAIN FISIK (Physical & Print Media)
            ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <span
            style={{
              color: 'var(--accent-2)',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Physical &amp; Print Media
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Hasil Desain Fisik
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent-2)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              maxWidth: '640px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Portofolio perancangan materi cetak dan fisik seperti lanyard resmi, kartu pengenal panitia &amp; magang, spanduk acara, backdrop seremoni, dan x-banner ekshibisi.
          </p>
        </motion.div>

        {/* Physical Designs Grid: 3 cols desktop, 2 cols mobile */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="designs-physical-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '20px',
            
          }}
        >
          {PHYSICAL_DESIGNS.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              onClick={() => {
                playClick();
                setActiveModal({
                  title: item.title,
                  category: item.category,
                  image: item.image,
                  description: item.description,
                  tags: item.tools,
                });
              }}
              onMouseEnter={playHover}
              whileHover={{ y: -6 }}
              className="design-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${item.accent}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              <div>
                {/* Photo Frame 4:3 or 16:10 */}
                <div
                  className="design-photo-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: '#0a0a0f',
                    overflow: 'hidden',
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
                      top: '8px',
                      right: '8px',
                      width: '26px',
                      height: '26px',
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

                {/* Info Box */}
                <div style={{ padding: '14px 14px 10px' }}>
                  <span
                    className="design-cat-badge"
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: item.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {item.category}
                  </span>
                  <h3
                    className="design-title"
                    style={{
                      margin: '0 0 6px',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="design-desc"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Tools footer (Desktop only) */}
              <div
                className="design-tools-footer"
                style={{
                  padding: '10px 14px 12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px',
                }}
              >
                {item.tools.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* =========================================================================
            UNIVERSAL MODAL LIGHTBOX
            ========================================================================= */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClick();
                setActiveModal(null);
              }}
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
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: '68vh',
                    background: '#0a0a0f',
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
                      maxHeight: '68vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <button
                    onClick={() => {
                      playClick();
                      setActiveModal(null);
                    }}
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
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {activeModal.category}
                    </span>
                    {activeModal.platform && (
                      <>
                        <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--accent-2)' }}>
                          {activeModal.platform}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: 'var(--text)' }}>
                    {activeModal.title}
                  </h3>
                  <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {activeModal.description}
                  </p>
                  {activeModal.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {activeModal.tags.map((t) => (
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
                  )}

                  {activeModal.url && (
                    <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <a
                        href={activeModal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(225, 48, 108, 0.15)',
                          border: '1px solid rgba(225, 48, 108, 0.35)',
                          color: '#FF6484',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Instagram size={15} />
                        <span>Kunjungi Akun Instagram Resmi</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .design-card:hover .design-photo-box img,
          .design-digital-card:hover .digital-photo-box img,
          .project-software-card:hover .project-banner-box img {
            transform: scale(1.04);
          }

          @media (max-width: 860px) {
            #projects {
              padding: 36px 12px 60px !important;
            }

            /* Section 1: Software Projects - 2 Columns on Mobile */
            .projects-software-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 10px !important;
              margin-bottom: 48px !important;
            }
            .project-software-card {
              border-radius: 10px !important;
            }
            .project-category-badge {
              font-size: 0.58rem !important;
              padding: 2px 6px !important;
              top: 6px !important;
              right: 6px !important;
              max-width: 85% !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            .project-category-badge span {
              display: none !important;
            }
            .project-software-content {
              padding: 10px 10px 12px !important;
            }
            .project-software-title {
              font-size: 0.82rem !important;
              line-height: 1.25 !important;
              margin-bottom: 4px !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
            .project-software-desc {
              display: none !important;
            }
            .project-software-tags {
              display: none !important;
            }
            .project-software-footer {
              display: none !important;
            }

            /* Section 2: Digital & Social Media Design - 2 Columns on Mobile */
            .designs-digital-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 10px !important;
              margin-bottom: 48px !important;
            }
            .design-digital-card {
              border-radius: 10px !important;
            }
            .digital-card-content {
              padding: 10px 10px 12px !important;
            }
            .digital-cat-badge {
              font-size: 0.58rem !important;
            }
            .digital-title {
              font-size: 0.82rem !important;
              line-height: 1.25 !important;
              margin-bottom: 4px !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
            .digital-desc {
              display: none !important;
            }
            .digital-footer {
              display: none !important;
            }
            .digital-ig-badge {
              padding: 4px 6px !important;
              top: 6px !important;
              right: 6px !important;
              gap: 0 !important;
            }
            .digital-ig-badge span,
            .digital-ig-badge svg:last-child {
              display: none !important;
            }

            /* Section 3: Physical & Print Media - 2 Columns on Mobile */
            .designs-physical-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 10px !important;
              margin-bottom: 0 !important;
            }
            .design-card {
              border-radius: 10px !important;
            }
            .design-title {
              font-size: 0.82rem !important;
              line-height: 1.25 !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
            .design-desc {
              display: none !important;
            }
            .design-tools-footer {
              display: none !important;
            }
            .design-cat-badge {
              font-size: 0.58rem !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Projects;
