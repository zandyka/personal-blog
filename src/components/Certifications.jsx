import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Award,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  BookmarkCheck,
  Image as ImageIcon,
  ZoomIn,
  X,
  FileCheck,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const CERTIFICATIONS = [
  {
    id: 'vsga-mobile',
    title: 'Junior Mobile Programmer',
    issuer: 'VSGA Kominfo (Digital Talent Scholarship)',
    period: 'Jun 2023 - Jul 2023',
    focusArea: 'Mobile Application Programming & Android Architecture Fundamentals',
    credentialType: 'Government Accreditation',
    skillsGained: ['Mobile Development', 'Android Studio', 'Java / Kotlin Basics', 'App Lifecycle'],
    image: null, // Ready to receive certificate photo
  },
  {
    id: 'vsga-web',
    title: 'Junior Web Developer',
    issuer: 'VSGA Kominfo (Digital Talent Scholarship)',
    period: 'Agu 2024',
    focusArea: 'Web Application Programming, Database Integration & Frontend Standards',
    credentialType: 'Government Accreditation',
    skillsGained: ['Web Programming', 'PHP / MySQL', 'Responsive Layout', 'REST Architecture'],
    image: null, // Ready to receive certificate photo
  },
  {
    id: 'telkom-fiber',
    title: 'Certified Fiber Technician',
    issuer: 'PT. Telkom Akses Indonesia',
    period: 'Feb 2022 - Apr 2022',
    focusArea: 'Fiber Optic Deployment, GPON Infrastructure & Optical Diagnostics',
    credentialType: 'Industry Certification',
    skillsGained: ['Fiber Optic Splicing', 'GPON Systems', 'OTDR / OPM Testing', 'Field Troubleshooting'],
    image: null, // Ready to receive certificate photo
  },
];

const Certifications = () => {
  const { playClick, playHover } = useSoundContext();
  const [activeCert, setActiveCert] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <section
      id="certifications"
      ref={ref}
      style={{
        padding: '44px 20px 60px',
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
            Credentials &amp; Licenses
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
            Certifications &amp; Accreditations
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
              maxWidth: '620px',
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            Sertifikasi resmi terakreditasi standar nasional (Kominfo / SKKNI) dan industri yang memvalidasi kompetensi di bidang mobile, web, dan infrastruktur jaringan.
          </p>
        </motion.div>

        {/* Certifications Grid — 3 Columns */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="cert-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {CERTIFICATIONS.map((cert) => (
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
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <div>
                {/* Certificate Photo Frame / Placeholder Area */}
                <div
                  onClick={() => {
                    if (cert.image) {
                      playClick();
                      setActiveCert(cert);
                    }
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: cert.image
                      ? 'var(--surface-2)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    border: cert.image ? '1px solid var(--border)' : '1px dashed var(--border)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: cert.image ? 'pointer' : 'default',
                  }}
                >
                  {cert.image ? (
                    <>
                      <img
                        src={cert.image}
                        alt={cert.title}
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
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <ZoomIn size={14} />
                      </div>
                    </>
                  ) : (
                    /* Elegant Certificate Placeholder */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent)',
                        }}
                      >
                        <FileCheck size={20} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                            display: 'block',
                          }}
                        >
                          Area Foto Sertifikat
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            display: 'block',
                            marginTop: '2px',
                          }}
                        >
                          Siap menampilkan sertifikat
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Header: Issuer & Period */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '10px',
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
                    fontSize: '1.05rem',
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
                    margin: '0 0 12px',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  {cert.issuer}
                </p>
              </div>

              {/* Skills Gained Tags */}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cert.skillsGained.map((skill) => (
                    <span
                      key={skill}
                      className="cert-tag"
                      style={{
                        fontSize: '0.7rem',
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
                  maxWidth: '820px',
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
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: 'var(--text)' }}>
                    {activeCert.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent)' }}>
                    {activeCert.issuer} &bull; {activeCert.period}
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
