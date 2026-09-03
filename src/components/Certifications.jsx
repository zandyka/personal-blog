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
    issuer: 'VSGA Kominfo — DTS',
    period: 'April 2023 - Mei 2023',
    focusArea: 'Pengembangan Aplikasi Android, Arsitektur Mobile & Siklus Hidup Aplikasi',
    credentialType: 'Standar SKKNI',
    skillsGained: ['Mobile Programming', 'Android Studio', 'Java/Kotlin', 'Standar SKKNI'],
    image: '/certificates/serti vsga jmp-1.webp',
  },
  {
    id: 'vsga-jwd',
    title: 'Junior Web Developer (JWD)',
    issuer: 'VSGA Kominfo — DTS',
    period: 'Agustus 2024',
    focusArea: 'Pemrograman Web Dinamis, Database Integration & Arsitektur RESTful API',
    credentialType: 'Standar SKKNI',
    skillsGained: ['Web Programming', 'PHP', 'MySQL', 'RESTful API'],
    image: '/certificates/sertif vsga kominfo-1.webp',
  },
  {
    id: 'dicoding-fabric',
    title: 'Data Science dengan Microsoft Fabric',
    issuer: 'Dicoding & Microsoft',
    period: '2025',
    focusArea: 'Penerapan Data Science Modern, Cloud Analytics & Ekosistem Microsoft Fabric',
    credentialType: 'Industry Cert',
    skillsGained: ['Data Science', 'Microsoft Fabric', 'Cloud Analytics', 'Data Engineering'],
    image: '/certificates/sertifikat dicoding belajar penerapan data science dengan microsoft fabric.webp',
  },
  {
    id: 'google-gemini',
    title: 'Google Gemini Certified Student',
    issuer: 'Google & Gemini Academy',
    period: '2025',
    focusArea: 'Generative AI, Prompt Engineering & Model Multimodal Google Gemini',
    credentialType: 'Global Tech Cert',
    skillsGained: ['Generative AI', 'Prompt Engineering', 'Google Gemini', 'Multimodal AI'],
    image: '/certificates/sertif gemini certified student.webp',
  },
  {
    id: 'claude-ai',
    title: 'Claude AI Certified Practitioner',
    issuer: 'Anthropic & AI Academy',
    period: '2025',
    focusArea: 'Large Language Models, Automasi Alur Kerja AI & Prompt Design',
    credentialType: 'Global Tech Cert',
    skillsGained: ['Claude AI', 'LLM Workflow', 'Prompt Design', 'AI Automation'],
    image: '/certificates/sertif ai claude zacky andyka-1.webp',
  },
  {
    id: 'huawei-ai',
    title: 'AI Fundamentals & Applications',
    issuer: 'Huawei ICT Academy',
    period: '2025',
    focusArea: 'Konsep Kecerdasan Buatan, Algoritma Machine Learning & Model Terapan',
    credentialType: 'Huawei Cert',
    skillsGained: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'Python'],
    image: '/certificates/Sertif Ai Zacky Andyka.webp',
  },
  {
    id: 'huawei-datacom',
    title: 'Data Communication & Network',
    issuer: 'Huawei ICT Academy',
    period: '2025',
    focusArea: 'Arsitektur Komunikasi Data, Protokol Jaringan & Routing Switching',
    credentialType: 'Huawei Cert',
    skillsGained: ['Data Communication', 'Network Protocols', 'Routing & Switching', 'IP Addressing'],
    image: '/certificates/Sertif Datacom Zacky Andyka.webp',
  },
  {
    id: 'mbkm-bpjs',
    title: 'Sertifikat Magang MBKM BPJS',
    issuer: 'BPJS Ketenagakerjaan',
    period: 'Sep 2025 - Des 2025',
    focusArea: 'IT Support, Pemeliharaan Database Peserta & Operasional Dashboard',
    credentialType: 'Magang MBKM',
    skillsGained: ['IT Support', 'Database Operations', 'JMO Troubleshooting', 'Administrative Governance'],
    image: '/certificates/sertif akhir mbkm bpjs-1.webp',
  },
  {
    id: 'mbkm-bsi',
    title: 'Sertifikat Magang MBKM Bank BSI',
    issuer: 'PT Bank Syariah Indonesia',
    period: 'Mar 2025 - Mei 2025',
    focusArea: 'Back Office Operations, Verifikasi Data Perbankan & Kepatuhan Arsip',
    credentialType: 'Magang MBKM',
    skillsGained: ['Banking Operations', 'Financial Data Verification', 'Archival Management'],
    image: '/certificates/sertif mbkm bsi-1.webp',
  },
  {
    id: 'ukk-bnsp',
    title: 'Uji Kompetensi Keahlian (UKK) TKJ',
    issuer: 'BNSP / LSP',
    period: '2023',
    focusArea: 'Administrasi Server, Troubleshooting Jaringan & Sistem Komputer',
    credentialType: 'Sertifikasi BNSP',
    skillsGained: ['Network Administration', 'Server Configuration', 'Hardware & System Support'],
    image: '/certificates/sertif kompetensi ukk-1.webp',
  },
  {
    id: 'lomba-it-network',
    title: 'Kejuaraan IT Network Configuration',
    issuer: 'Kompetisi SMK Jaringan',
    period: '2022',
    focusArea: 'Konfigurasi Routing, Subnetting & Troubleshooting Jaringan Terpadu',
    credentialType: 'Penghargaan',
    skillsGained: ['Network Configuration', 'Network Troubleshooting', 'Subnetting'],
    image: '/certificates/sertif it network configuration hut smk.webp',
  },
  {
    id: 'lomba-fotografi-coca-cola',
    title: 'Lomba Fotografi Produk Coca-Cola',
    issuer: 'Kompetisi Fotografi Komersial',
    period: '2022',
    focusArea: 'Fotografi Produk Komersial, Studio Lighting & Visual Composition',
    credentialType: 'Penghargaan',
    skillsGained: ['Commercial Photography', 'Product Lighting', 'Color Grading', 'Visual Composition'],
    image: '/certificates/sertif lomba fotografi produk coca cola.webp',
  },
  {
    id: 'lomba-fotografi-smk',
    title: 'Penghargaan Lomba Fotografi SMK',
    issuer: 'Ajang Fotografi Kejuruan',
    period: '2022',
    focusArea: 'Eksplorasi Sudut Pandang, Komposisi Visual & Storytelling Fotografi',
    credentialType: 'Penghargaan',
    skillsGained: ['Photography Composition', 'Street Photography', 'Visual Storytelling'],
    image: '/certificates/sertif lomba fotografi smk-1.webp',
  },
  {
    id: 'training-english',
    title: 'Pelatihan Bahasa Inggris Profesional',
    issuer: 'English Language Program',
    period: '2023',
    focusArea: 'Komunikasi Bisnis, Presentasi Teknis & Tata Bahasa Inggris Kerja',
    credentialType: 'Pelatihan',
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
          width: '100%',
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
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: '100%', minWidth: 0 }}>
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
                    minWidth: 0,
                  }}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
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
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <ZoomIn size={12} />
                  </div>
                </div>

                {/* Header: Credential Type & Period */}
                <div
                  className="cert-header-meta"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '4px',
                    marginBottom: '6px',
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  <span
                    className="cert-badge"
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
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
                    wordBreak: 'break-word',
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
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            width: 100%;
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

          /* Tablet & Mobile: 2 Compact Columns Perfectly Fitting Screen */
          @media (max-width: 860px) {
            #certifications {
              padding: 36px 12px 60px !important;
            }
            .cert-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
              width: 100% !important;
            }
            .cert-card {
              padding: 8px !important;
              border-radius: 10px !important;
              border-left-width: 2.5px !important;
            }
            .cert-photo-frame {
              margin-bottom: 6px !important;
              border-radius: 6px !important;
            }
            .cert-header-meta {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 1px !important;
              margin-bottom: 3px !important;
            }
            .cert-badge {
              font-size: 0.54rem !important;
              letter-spacing: 0.2px !important;
              line-height: 1.2 !important;
            }
            .cert-period {
              font-size: 0.56rem !important;
            }
            .cert-title {
              font-size: 0.72rem !important;
              line-height: 1.22 !important;
              margin-bottom: 2px !important;
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
            .cert-issuer {
              font-size: 0.62rem !important;
              line-height: 1.2 !important;
              margin: 0 !important;
            }
            .cert-desktop-details {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Certifications;
