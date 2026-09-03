import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Award,
  Calendar,
  ZoomIn,
  X,
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
    skillsGained: ['Mobile Programming', 'Android Studio', 'Java/Kotlin', 'Standar SKKNI'],
    image: '/certificates/serti vsga jmp-1.webp',
  },
  {
    id: 'vsga-jwd',
    title: 'Junior Web Developer (JWD)',
    issuer: 'VSGA Kominfo — Digital Talent Scholarship',
    period: 'Agustus 2024',
    focusArea: 'Pemrograman Web Dinamis, Database Integration & Arsitektur RESTful API',
    credentialType: 'Standar SKKNI',
    skillsGained: ['Web Programming', 'PHP', 'MySQL', 'RESTful API'],
    image: '/certificates/sertif vsga kominfo-1.webp',
  },
  {
    id: 'dicoding-fabric',
    title: 'Belajar Penerapan Data Science dengan Microsoft Fabric',
    issuer: 'Dicoding Indonesia & Microsoft',
    period: '2025',
    focusArea: 'Penerapan Data Science Modern, Cloud Analytics & Ekosistem Microsoft Fabric',
    credentialType: 'Industry Certification',
    skillsGained: ['Data Science', 'Microsoft Fabric', 'Cloud Analytics', 'Data Engineering'],
    image: '/certificates/sertifikat dicoding belajar penerapan data science dengan microsoft fabric.webp',
  },
  {
    id: 'google-gemini',
    title: 'Google Gemini Certified Student',
    issuer: 'Google & Gemini Academy',
    period: '2025',
    focusArea: 'Generative AI, Prompt Engineering & Model Multimodal Google Gemini',
    credentialType: 'Global Tech Certification',
    skillsGained: ['Generative AI', 'Prompt Engineering', 'Google Gemini', 'Multimodal AI'],
    image: '/certificates/sertif gemini certified student.webp',
  },
  {
    id: 'claude-ai',
    title: 'Claude AI Certified Practitioner',
    issuer: 'Anthropic & AI Training Academy',
    period: '2025',
    focusArea: 'Large Language Models, Automasi Alur Kerja AI & Prompt Design',
    credentialType: 'Global Tech Certification',
    skillsGained: ['Claude AI', 'LLM Workflow', 'Prompt Design', 'AI Automation'],
    image: '/certificates/sertif ai claude zacky andyka-1.webp',
  },
  {
    id: 'huawei-ai',
    title: 'Artificial Intelligence Fundamentals & Applications',
    issuer: 'Huawei ICT Academy',
    period: '2025',
    focusArea: 'Konsep Kecerdasan Buatan, Algoritma Machine Learning & Model Terapan',
    credentialType: 'Huawei Certification',
    skillsGained: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'Python'],
    image: '/certificates/Sertif Ai Zacky Andyka.webp',
  },
  {
    id: 'huawei-datacom',
    title: 'Data Communication & Network Fundamentals',
    issuer: 'Huawei ICT Academy',
    period: '2025',
    focusArea: 'Arsitektur Komunikasi Data, Protokol Jaringan & Routing Switching',
    credentialType: 'Huawei Certification',
    skillsGained: ['Data Communication', 'Network Protocols', 'Routing & Switching', 'IP Addressing'],
    image: '/certificates/Sertif Datacom Zacky Andyka.webp',
  },
  {
    id: 'mbkm-bpjs',
    title: 'Sertifikat Magang MBKM BPJS Ketenagakerjaan',
    issuer: 'BPJS Ketenagakerjaan & Kemendikbudristek',
    period: 'Sep 2025 - Des 2025',
    focusArea: 'IT Support, Pemeliharaan Database Peserta & Operasional Dashboard',
    credentialType: 'Magang Berdampak MBKM',
    skillsGained: ['IT Support', 'Database Operations', 'JMO Troubleshooting', 'Administrative Governance'],
    image: '/certificates/sertif akhir mbkm bpjs-1.webp',
  },
  {
    id: 'mbkm-bsi',
    title: 'Sertifikat Magang MBKM Bank Syariah Indonesia',
    issuer: 'PT Bank Syariah Indonesia Tbk (BSI)',
    period: 'Mar 2025 - Mei 2025',
    focusArea: 'Back Office Operations, Verifikasi Data Perbankan & Kepatuhan Arsip',
    credentialType: 'Magang Berdampak MBKM',
    skillsGained: ['Banking Operations', 'Financial Data Verification', 'Archival Management'],
    image: '/certificates/sertif mbkm bsi-1.webp',
  },
  {
    id: 'ukk-bnsp',
    title: 'Sertifikat Uji Kompetensi Keahlian (UKK) TKJ',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP) / LSP',
    period: '2023',
    focusArea: 'Administrasi Server, Troubleshooting Jaringan & Sistem Komputer',
    credentialType: 'Sertifikasi BNSP / LSP',
    skillsGained: ['Network Administration', 'Server Configuration', 'Hardware & System Support'],
    image: '/certificates/sertif kompetensi ukk-1.webp',
  },
  {
    id: 'lomba-it-network',
    title: 'Penghargaan Kejuaraan IT Network Configuration',
    issuer: 'Kompetisi Bidang Kejuruan Jaringan Komputer',
    period: '2022',
    focusArea: 'Konfigurasi Routing, Subnetting & Troubleshooting Jaringan Terpadu',
    credentialType: 'Penghargaan Kejuaraan',
    skillsGained: ['Network Configuration', 'Network Troubleshooting', 'Subnetting'],
    image: '/certificates/sertif it network configuration hut smk.webp',
  },
  {
    id: 'lomba-fotografi-coca-cola',
    title: 'Penghargaan Lomba Fotografi Produk Coca-Cola',
    issuer: 'Kompetisi Fotografi Komersial Kreatif',
    period: '2022',
    focusArea: 'Fotografi Produk Komersial, Studio Lighting & Visual Composition',
    credentialType: 'Penghargaan Kejuaraan',
    skillsGained: ['Commercial Photography', 'Product Lighting', 'Color Grading', 'Visual Composition'],
    image: '/certificates/sertif lomba fotografi produk coca cola.webp',
  },
  {
    id: 'lomba-fotografi-smk',
    title: 'Penghargaan Lomba Fotografi SMK',
    issuer: 'Ajang Kompetisi Fotografi Kejuruan',
    period: '2022',
    focusArea: 'Eksplorasi Sudut Pandang, Komposisi Visual & Storytelling Fotografi',
    credentialType: 'Penghargaan Kejuaraan',
    skillsGained: ['Photography Composition', 'Street Photography', 'Visual Storytelling'],
    image: '/certificates/sertif lomba fotografi smk-1.webp',
  },
  {
    id: 'training-english',
    title: 'Pelatihan Bahasa Inggris & Komunikasi Profesional',
    issuer: 'English Language Development Program',
    period: '2023',
    focusArea: 'Komunikasi Bisnis, Presentasi Teknis & Tata Bahasa Inggris Kerja',
    credentialType: 'Pelatihan Profesional',
    skillsGained: ['Professional English', 'Workplace Communication', 'Technical Vocabulary'],
    image: '/certificates/sertif training bahasa inggris-1.webp',
  },
];

const Certifications = () => {
  const { playClick, playHover } = useSoundContext();
  const [activeCert, setActiveCert] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };

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
              margin: '0 auto 14px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              maxWidth: '640px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.55,
            }}
          >
            Dokumentasi lengkap sertifikasi kompetensi standar SKKNI, pelatihan AI global, sertifikat magang resmi MBKM, dan penghargaan kompetisi.
          </p>
        </motion.div>

        {/* Certifications Grid: 3 cols desktop, 2 cols mobile */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="cert-grid"
        >
          {CERTIFICATIONS.map((cert) => (
            <motion.div
              key={cert.id}
              variants={fadeUp}
              onClick={() => {
                playClick();
                setActiveCert(cert);
              }}
              onMouseEnter={playHover}
              whileHover={{ y: -5 }}
              className="cert-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div>
                {/* Certificate Photo Frame */}
                <div
                  className="cert-photo-frame"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                      transition: 'transform 0.35s ease',
                    }}
                  />
                  <div
                    className="cert-zoom-btn"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
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

                {/* Header: Credential Type & Period */}
                <div
                  className="cert-header-meta"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    className="cert-badge"
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {cert.credentialType}
                  </span>

                  <span
                    className="cert-period"
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={10} />
                    <span>{cert.period}</span>
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="cert-title"
                  style={{
                    margin: '0 0 4px',
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
                    margin: '0 0 6px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.35,
                  }}
                >
                  {cert.issuer}
                </p>

                {/* Desktop-only: Description */}
                <div className="cert-desktop-details">
                  <p
                    className="cert-desc"
                    style={{
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      margin: '6px 0 10px',
                      fontWeight: 300,
                      fontSize: '0.78rem',
                    }}
                  >
                    {cert.focusArea}
                  </p>
                </div>
              </div>

              {/* Skills Gained Tags (Desktop only) */}
              <div
                className="cert-tags-wrapper cert-desktop-details"
                style={{
                  marginTop: 'auto',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cert.skillsGained.map((skill) => (
                    <span
                      key={skill}
                      className="cert-tag"
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.68rem',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile "Tap for preview" indicator */}
              <div className="cert-mobile-tap">
                <span>Ketuk untuk zoom &amp; detail &rarr;</span>
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
                  maxWidth: '840px',
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
                    src={activeCert.image}
                    alt={activeCert.title}
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
                      setActiveCert(null);
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
                <div style={{ padding: '16px 20px' }}>
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
                      {activeCert.credentialType}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {activeCert.period}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: 'var(--text)' }}>
                    {activeCert.title}
                  </h3>
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: 'var(--accent-2)' }}>
                    {activeCert.issuer}
                  </p>
                  <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {activeCert.focusArea}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {activeCert.skillsGained.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .cert-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .cert-card {
            padding: 16px;
          }
          .cert-title {
            font-size: 1.02rem;
          }
          .cert-issuer {
            font-size: 0.82rem;
          }
          .cert-desktop-details {
            display: block;
          }
          .cert-mobile-tap {
            display: none;
          }

          /* Tablet & Mobile: Clean, unified 2 Columns */
          @media (max-width: 820px) {
            .cert-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .cert-card {
              padding: 10px !important;
              border-radius: 12px !important;
            }
            .cert-header-meta {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 2px !important;
              margin-bottom: 4px !important;
            }
            .cert-badge {
              font-size: 0.6rem !important;
              letter-spacing: 0.3px !important;
            }
            .cert-period {
              font-size: 0.62rem !important;
            }
            .cert-title {
              font-size: 0.82rem !important;
              line-height: 1.25 !important;
              margin-bottom: 3px !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
            .cert-issuer {
              font-size: 0.7rem !important;
              line-height: 1.2 !important;
              margin-bottom: 4px !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            .cert-desktop-details {
              display: none !important;
            }
            .cert-mobile-tap {
              display: block !important;
              margin-top: 6px !important;
              padding-top: 6px !important;
              border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
              font-size: 0.62rem !important;
              color: var(--accent) !important;
              font-weight: 500 !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Certifications;
