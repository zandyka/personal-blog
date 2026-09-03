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
    period: 'Jun 2023 â€“ Jul 2023',
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
    period: 'Feb 2022 â€“ Apr 2022',
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
        padding: '90px 20px',
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
          style={{ textAlign: 'center', marginBottom: '60px' }}
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

        {/* Certifications Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {CERTIFICATIONS.map((cert) => (
            <motion.div
              key={cert.id}
              variants={fadeUp}
              onMouseEnter={playHover}
              whileHover={{ y: -6 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: '4px solid var(--accent)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header: Icon & Type Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(101, 98, 245, 0.12)',
                      border: '1px solid rgba(101, 98, 245, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    <Award size={24} />
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border)',
                      color: 'var(--accent)',
                    }}
                  >
                    {cert.credentialType}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    margin: '0 0 6px',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.3,
                  }}
                >
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: 500,
                  }}
                >
                  {cert.issuer}
                </p>

                {/* Period */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                  }}
                >
                  <Calendar size={14} />
                  <span>{cert.period}</span>
                </div>

                {/* Focus Area */}
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                    }}
                  >
                    Focus Area
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      color: 'var(--text)',
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    {cert.focusArea}
                  </p>
                </div>
              </div>

              {/* Skills Gained Tags */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cert.skillsGained.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
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
      </div>
    </section>
  );
};

export default Certifications;

