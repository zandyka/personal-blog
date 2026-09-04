import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Briefcase, FolderGit2, Users2, Globe, Award, CheckCircle2 } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import InteractiveLanyard from './InteractiveLanyard';

const CountUp = ({ end, duration = 1.5, decimals = 0, suffix = '', inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const startValue = 0;
    const endValue = parseFloat(end);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const STATS = [
  {
    label: 'IPK Kuliah',
    sub: 'Teknik Informatika (USU)',
    value: '3.84',
    decimals: 2,
    suffix: '',
    icon: GraduationCap,
    accent: 'var(--accent)',
  },
  {
    label: 'Pengalaman',
    sub: 'Banking, IT & Telco',
    value: '4',
    decimals: 0,
    suffix: ' Magang',
    icon: Briefcase,
    accent: '#54C5F8',
  },
  {
    label: 'Proyek Selesai',
    sub: 'AI, Web & Mobile',
    value: '4',
    decimals: 0,
    suffix: '+',
    icon: FolderGit2,
    accent: '#10B981',
  },
  {
    label: 'Sertifikasi',
    sub: 'Dicoding, Google & BNSP',
    value: '5',
    decimals: 0,
    suffix: '+',
    icon: Award,
    accent: 'var(--accent-2)',
  },
];

const LANGUAGES = [
  { lang: 'Indonesian', level: 'Native', tag: 'Bahasa Ibu' },
  { lang: 'English', level: 'Intermediate', tag: 'Professional Working' },
];

const About = () => {
  const { playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section
      id="about"
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
          maxWidth: '1100px',
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
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Overview
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            About Me
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          />
        </motion.div>

        {/* 2-Column Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* Left: Interactive 3D Lanyard & ID Badge */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <InteractiveLanyard />
          </motion.div>

          {/* Right: Content & Stats */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
            style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
          >
            {/* Bio Paragraphs */}
            <motion.div variants={fadeUp}>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '10px',
                  lineHeight: 1.35,
                }}
              >
                Bridging{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Software Engineering</span>,{' '}
                <span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>Banking Operations</span> &amp; Infrastructure.
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Lulusan <strong>Teknik Informatika USU</strong> dengan rekam jejak di bidang operasional perbankan (BSI & Bank Sumut), IT support & dashboard analytics (BPJS Ketenagakerjaan), serta infrastruktur fiber optik (Telkom Akses). Mengutamakan akurasi, efisiensi kerja, dan kode yang tangguh.
              </p>
            </motion.div>

            {/* Stat Cards 2x2 Grid - 2 per row on mobile and desktop */}
            <motion.div
              variants={stagger}
              className="about-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    onMouseEnter={playHover}
                    whileHover={{ y: -3 }}
                    className="about-stat-card"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '16px',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        className="about-stat-label"
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </span>
                      <div
                        className="about-stat-icon"
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'var(--surface-2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.accent,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} />
                      </div>
                    </div>
                    <div
                      className="about-stat-value"
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        letterSpacing: '-0.5px',
                        marginBottom: '2px',
                      }}
                    >
                      <CountUp
                        end={stat.value}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                        inView={inView}
                      />
                    </div>
                    <div
                      className="about-stat-sub"
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {stat.sub}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Language Badges */}
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px',
                paddingTop: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Globe size={15} style={{ color: 'var(--accent)' }} />
                <span>Languages:</span>
              </span>
              {LANGUAGES.map((item) => (
                <div
                  key={item.lang}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontSize: '0.78rem',
                  }}
                >
                  <CheckCircle2 size={13} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.lang}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({item.level})</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .about-grid {
            grid-template-columns: 0.85fr 1.15fr !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 859px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .about-stat-card {
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }
          .about-stat-icon {
            width: 26px !important;
            height: 26px !important;
          }
          .about-stat-label {
            font-size: 0.72rem !important;
          }
          .about-stat-value {
            font-size: 1.25rem !important;
          }
          .about-stat-sub {
            font-size: 0.68rem !important;
            line-height: 1.25 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;