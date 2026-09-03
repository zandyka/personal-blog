import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Award,
  Calendar,
  ExternalLink,
  ZoomIn,
  X,
  FileCheck,
  Grid,
  Cpu,
  Briefcase,
  Trophy,
  Network,
  Sparkles,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const CERTIFICATIONS = [
  {
    id: 'vsga-jmp',
    title: 'Junior Mobile Programmer (JMP)',
    issuer: 'VSGA Kominfo — Digital Talent Scholarship',
    period: 'April 2023 - Mei 2023',
    focusArea: 'Pengembangan Aplikasi Android, Arsitektur Mobile & Siklus Hidup Aplikasi',
    credentialType: 'Standar SKKNI',
    category: 'Pemerintah & SKKNI',
    skillsGained: ['Mobile Programming', 'Android Studio', 'Java/Kotlin', 'Standar SKKNI'],
    image: '/certificates/serti vsga jmp-1.png',
  },
  {
    id: 'vsga-jwd',
    title: 'Junior Web Developer (JWD)',
    issuer: 'VSGA Kominfo — Digital Talent Scholarship',
    period: 'Agustus 2024',
    focusArea: 'Pemrograman Web Dinamis, Database Integration & Arsitektur RESTful API',
    credentialType: 'Standar SKKNI',
    category: 'Pemerintah & SKKNI',
    skillsGained: ['Web Programming', 'PHP', 'MySQL', 'RESTful API'],
    image: '/certificates/sertif vsga kominfo-1.png',
  },
  {
    id: 'dicoding-fabric',
    title: 'Belajar Penerapan Data Science dengan Microsoft Fabric',
    issuer: 'Dicoding Indonesia & Microsoft',
    period: '2024',
    focusArea: 'Penerapan Data Science Modern, Cloud Analytics & Ekosistem Microsoft Fabric',
    credentialType: 'Industry Certification',
    category: 'AI & Data Science',
    skillsGained: ['Data Science', 'Microsoft Fabric', 'Cloud Analytics', 'Data Engineering'],
    image: '/certificates/sertifikat dicoding belajar penerapan data science dengan microsoft fabric.png',
  },
  {
    id: 'google-gemini',
    title: 'Google Gemini Certified Student',
    issuer: 'Google & Gemini Academy',
    period: '2024',
    focusArea: 'Generative AI, Prompt Engineering & Model Multimodal Google Gemini',
    credentialType: 'Global Tech Certification',
    category: 'AI & Data Science',
    skillsGained: ['Generative AI', 'Prompt Engineering', 'Google Gemini', 'Multimodal AI'],
    image: '/certificates/sertif gemini certified student.png',
  },
  {
    id: 'claude-ai',
    title: 'Claude AI Certified Practitioner',
    issuer: 'Anthropic & AI Training Academy',
    period: '2024',
    focusArea: 'Large Language Models, Automasi Alur Kerja AI & Prompt Design',
    credentialType: 'Global Tech Certification',
    category: 'AI & Data Science',
    skillsGained: ['Claude AI', 'LLM Workflow', 'Prompt Design', 'AI Automation'],
    image: '/certificates/sertif ai claude zacky andyka-1.png',
  },
  {
    id: 'ai-fundamentals',
    title: 'Artificial Intelligence Fundamentals & Applications',
    issuer: 'AI Academy & Global Certification',
    period: '2024',
    focusArea: 'Konsep Kecerdasan Buatan, Algoritma Machine Learning & Model Terapan',
    credentialType: 'Professional Certification',
    category: 'AI & Data Science',
    skillsGained: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'Python'],
    image: '/certificates/Sertif Ai Zacky Andyka.png',
  },
  {
    id: 'datacom',
    title: 'Data Communication & Network Fundamentals',
    issuer: 'Datacom Certification Body',
    period: '2023',
    focusArea: 'Arsitektur Komunikasi Data, Protokol Jaringan & Routing Switching',
    credentialType: 'Network Certification',
    category: 'Jaringan & Lainnya',
    skillsGained: ['Data Communication', 'Network Protocols', 'Routing & Switching', 'IP Addressing'],
    image: '/certificates/Sertif Datacom Zacky Andyka.png',
  },
  {
    id: 'mbkm-bpjs',
    title: 'Sertifikat Magang MBKM BPJS Ketenagakerjaan',
    issuer: 'BPJS Ketenagakerjaan & Kemendikbudristek',
    period: 'September 2025 - Desember 2025',
    focusArea: 'IT Support, Pemeliharaan Database Peserta & Operasional Dashboard',
    credentialType: 'Magang Berdampak MBKM',
    category: 'Magang & Profesi',
    skillsGained: ['IT Support', 'Database Operations', 'JMO Troubleshooting', 'Administrative Governance'],
    image: '/certificates/sertif akhir mbkm bpjs-1.png',
  },
  {
    id: 'mbkm-bsi',
    title: 'Sertifikat Magang MBKM Bank Syariah Indonesia',
    issuer: 'PT Bank Syariah Indonesia Tbk (BSI)',
    period: 'Maret 2025 - Mei 2025',
    focusArea: 'Back Office Operations, Verifikasi Data Perbankan & Kepatuhan Arsip',
    credentialType: 'Magang Berdampak MBKM',
    category: 'Magang & Profesi',
    skillsGained: ['Banking Operations', 'Financial Data Verification', 'Archival Management'],
    image: '/certificates/sertif mbkm bsi-1.png',
  },
  {
    id: 'ukk-bnsp',
    title: 'Sertifikat Uji Kompetensi Keahlian (UKK) TKJ',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP) / LSP',
    period: '2022',
    focusArea: 'Administrasi Server, Troubleshooting Jaringan & Sistem Komputer',
    credentialType: 'Sertifikasi BNSP / LSP',
    category: 'Pemerintah & SKKNI',
    skillsGained: ['Network Administration', 'Server Configuration', 'Hardware & System Support'],
    image: '/certificates/sertif kompetensi ukk-1.png',
  },
  {
    id: 'lomba-it-network',
    title: 'Penghargaan Lomba IT Network Configuration',
    issuer: 'Kompetisi Bidang Kejuruan Jaringan Komputer',
    period: '2021',
    focusArea: 'Konfigurasi Routing, Subnetting & Troubleshooting Jaringan Terpadu',
    credentialType: 'Penghargaan Kejuaraan',
    category: 'Penghargaan & Lomba',
    skillsGained: ['Network Configuration', 'Network Troubleshooting', 'Subnetting'],
    image: '/certificates/sertif it network configuration hut smk.png',
  },
  {
    id: 'lomba-fotografi-coca-cola',
    title: 'Penghargaan Lomba Fotografi Produk Coca-Cola',
    issuer: 'Kompetisi Fotografi Komersial Kreatif',
    period: '2022',
    focusArea: 'Fotografi Produk Komersial, Studio Lighting & Visual Composition',
    credentialType: 'Penghargaan Kejuaraan',
    category: 'Penghargaan & Lomba',
    skillsGained: ['Commercial Photography', 'Product Lighting', 'Color Grading', 'Visual Composition'],
    image: '/certificates/sertif lomba fotografi produk coca cola.png',
  },
  {
    id: 'lomba-fotografi-smk',
    title: 'Penghargaan Lomba Seni & Fotografi Sekolah',
    issuer: 'Ajang Kompetisi Fotografi Kejuruan',
    period: '2021',
    focusArea: 'Eksplorasi Sudut Pandang, Komposisi Visual & Storytelling Fotografi',
    credentialType: 'Penghargaan Kejuaraan',
    category: 'Penghargaan & Lomba',
    skillsGained: ['Photography Composition', 'Street Photography', 'Visual Storytelling'],
    image: '/certificates/sertif lomba fotografi smk-1.png',
  },
  {
    id: 'training-english',
    title: 'Pelatihan Bahasa Inggris & Komunikasi Profesional',
    issuer: 'English Language Development Program',
    period: '2023',
    focusArea: 'Komunikasi Bisnis, Presentasi Teknis & Tata Bahasa Inggris Kerja',
    credentialType: 'Pelatihan Profesional',
    category: 'Jaringan & Lainnya',
    skillsGained: ['Professional English', 'Workplace Communication', 'Technical Vocabulary'],
    image: '/certificates/sertif training bahasa inggris-1.png',
  },
];

const CATEGORIES = [
  { id: 'All', label: 'Semua', icon: Grid },
  { id: 'Pemerintah & SKKNI', label: 'SKKNI & Kominfo', icon: Award },
  { id: 'AI & Data Science', label: 'AI & Data Science', icon: Cpu },
  { id: 'Magang & Profesi', label: 'Magang MBKM', icon: Briefcase },
  { id: 'Penghargaan & Lomba', label: 'Penghargaan & Lomba', icon: Trophy },
  { id: 'Jaringan & Lainnya', label: 'Jaringan & Lainnya', icon: Network },
];

const Certifications = () => {
  const { playClick, playHover } = useSoundContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCert, setActiveCert] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredCerts =
    activeCategory === 'All'
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.category === activeCategory);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
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
      id="certifications"
      ref={ref}
      style={{
        padding: '54px 20px 80px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontSize: '0.85rem',
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
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
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
              width: '60px',
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
            }}
          >
            Dokumentasi lengkap sertifikasi kompetensi standar SKKNI, pelatihan AI global, sertifikat magang resmi MBKM, dan penghargaan kompetisi.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '36px',
          }}
        >
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => {
                  playClick();
                  setActiveCategory(id);
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: isActive ? 'var(--accent-dim)' : 'var(--surface)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#000000' : 'var(--text-muted)',
                    fontWeight: 700,
                    marginLeft: '2px',
                  }}
                >
                  {id === 'All'
                    ? CERTIFICATIONS.length
                    : CERTIFICATIONS.filter((c) => c.category === id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Certifications Grid */}
        <motion.div
          key={activeCategory}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="cert-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {filteredCerts.map((cert) => (
            <motion.div
              key={cert.id}
              variants={fadeUp}
              onMouseEnter={playHover}
              whileHover={{ y: -6 }}
              className="cert-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <div>
                {/* Certificate Photo Frame / Lightbox Trigger */}
                <div
                  onClick={() => {
                    playClick();
                    setActiveCert(cert);
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
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
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.65)',
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

                {/* Header: Credential Type & Period */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    {cert.credentialType}
                  </span>

                  <span
                    className="cert-period"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Calendar size={12} />
                    <span>{cert.period}</span>
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="cert-title"
                  style={{
                    margin: '0 0 6px',
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.3,
                  }}
                >
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p
                  className="cert-issuer"
                  style={{
                    margin: '0 0 10px',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  {cert.issuer}
                </p>

                {/* Focus Area / Description */}
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    margin: '0 0 12px',
                    fontWeight: 300,
                  }}
                >
                  {cert.focusArea}
                </p>
              </div>

              {/* Skills Gained Tags */}
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cert.skillsGained.map((skill) => (
                    <span
                      key={skill}
                      className="cert-tag"
                      style={{
                        fontSize: '0.68rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal Lightbox for Certificate Full View */}
        <AnimatePresence>
          {activeCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                playClick();
                setActiveCert(null);
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
                padding: '24px',
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
                  borderRadius: '20px',
                  maxWidth: '840px',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: '75vh',
                    background: '#0a0a0f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '75vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <button
                    onClick={() => {
                      playClick();
                      setActiveCert(null);
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
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
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {activeCert.credentialType}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {activeCert.period}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: 'var(--text)' }}>
                    {activeCert.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-2)' }}>
                    {activeCert.issuer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .cert-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          @media (max-width: 900px) {
            .cert-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 14px !important;
            }
          }
          @media (max-width: 580px) {
            .cert-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Certifications;
