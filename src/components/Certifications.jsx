import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Calendar, CheckCircle2, ShieldCheck, ExternalLink, BookmarkCheck } from 'lucide-react';
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
  },
  {
    id: 'vsga-web',
    title: 'Junior Web Developer',
    issuer: 'VSGA Kominfo (Digital Talent Scholarship)',
    period: 'Aug 2024',
    focusArea: 'Web Application Programming, Database Integration & Frontend Standards',
    credentialType: 'Government Accreditation',
    skillsGained: ['Web Programming', 'PHP / MySQL', 'Responsive Layout', 'REST Architecture'],
  },
  {
    id: 'telkom-fiber',
    title: 'Certified Fiber Technician',
    issuer: 'PT. Telkom Akses Indonesia',
    period: 'Feb 2022 - Apr 2022',
    focusArea: 'Fiber Optic Deployment, GPON Infrastructure & Optical Diagnostics',
    credentialType: 'Industry Certification',
    skillsGained: ['Fiber Optic Splicing', 'GPON Systems', 'OTDR / OPM Testing', 'Field Troubleshooting'],
  },
];

const Certifications = () => {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
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
        padding: '44px 20px',
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
          style={{ textAlign: 'center', marginBottom: '28px' }}
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
            Credentials & Training
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
            Certifications
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
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            Vocational and industry-standard certifications verifying competencies in mobile, web, and network infrastructure.
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
                borderRadius: '14px',
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
                {/* Header: Icon & Period Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    className="cert-icon"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: 'rgba(255, 59, 29, 0.12)',
                      border: '1px solid rgba(255, 59, 29, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    <Award size={18} />
                  </div>

                  <span
                    className="cert-period"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Calendar size={11} />
                    <span>{cert.period}</span>
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="cert-title"
                  style={{
                    margin: '0 0 4px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.25,
                  }}
                >
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p
                  className="cert-issuer"
                  style={{
                    margin: '0 0 12px',
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {cert.issuer}
                </p>
              </div>

              {/* Skills Gained Tags (Max 2-3) */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cert.skillsGained.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="cert-tag"
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
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

        <style>{`
          .cert-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          @media (max-width: 860px) {
            .cert-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .cert-card {
              padding: 12px 10px !important;
              border-radius: 12px !important;
            }
            .cert-icon {
              width: 28px !important;
              height: 28px !important;
              border-radius: 8px !important;
            }
            .cert-icon svg {
              width: 15px !important;
              height: 15px !important;
            }
            .cert-title {
              font-size: 0.85rem !important;
              margin-bottom: 3px !important;
            }
            .cert-issuer {
              font-size: 0.72rem !important;
              margin-bottom: 8px !important;
            }
            .cert-period {
              font-size: 0.65rem !important;
            }
            .cert-tag {
              font-size: 0.62rem !important;
              padding: 2px 5px !important;
            }
          }
          @media (max-width: 480px) {
            .cert-grid {
              gap: 8px !important;
            }
            .cert-card {
              padding: 10px 8px !important;
              border-radius: 10px !important;
            }
            .cert-title {
              font-size: 0.8rem !important;
            }
            .cert-issuer {
              font-size: 0.68rem !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Certifications;

