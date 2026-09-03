import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Briefcase, FolderGit2, Users2, Globe, Award, CheckCircle2 } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

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
    label: 'IPK Terbaik',
    sub: 'Semester 4 & 5 (USU)',
    value: '4.00',
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
    label: 'Kepemimpinan',
    sub: 'Kadiv Media Kreatif',
    value: '1',
    decimals: 0,
    suffix: ' Organisasi',
    icon: Users2,
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
        padding: '90px 24px',
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
          style={{ textAlign: 'center', marginBottom: '50px' }}
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
          {/* Left: Photo Frame Placeholder (3:4 ratio) */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '3 / 4',
                borderRadius: '20px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '14px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Outer decorative borders */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-5px',
                  borderRadius: '24px',
                  border: '1px solid var(--accent-2-border)',
                  pointerEvents: 'none',
                }}
              />

              {/* Placeholder Inner Box */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '14px',
                  background: 'var(--surface-2)',
                  border: '1px dashed var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  textAlign: 'center',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'var(--accent-2-dim)',
                    border: '1.5px solid var(--accent-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-2)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  ZA
                </div>

                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: 'var(--text)', fontWeight: 600 }}>
                    Zacky Andyka
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    3:4 Profile Photo Placeholder
                  </p>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    color: 'var(--text)',
                  }}
                >
                  <Award size={14} style={{ color: 'var(--accent)' }} />
                  <span>Teknik Informatika USU</span>
                </div>
              </div>
            </div>
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
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '12px',
                  lineHeight: 1.4,
                }}
              >
                A versatile professional bridging{' '}
                <span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>Information Technology</span>,{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Banking Operations</span> &amp;{' '}
                <span style={{ color: 'var(--text)', fontWeight: 700 }}>Administration</span>.
              </h3>
              <p
                style={{
                  fontSize: '0.94rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  margin: '0 0 12px',
                  fontWeight: 400,
                }}
              >
                Zacky Andyka adalah lulusan <strong>Teknik Informatika dari Universitas Sumatera Utara (USU)</strong>{' '}
                dengan latar belakang multidisiplin di bidang operasional perbankan, administrasi, IT support,
                pengembangan aplikasi web/mobile, jaringan komputer, serta manajemen data.
              </p>
              <p
                style={{
                  fontSize: '0.94rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Pengalaman kerja terbukti melalui program magang di <strong>PT Bank Syariah Indonesia (BSI)</strong>,{' '}
                <strong>PT Bank Sumut</strong>, <strong>BPJS Ketenagakerjaan</strong>, dan{' '}
                <strong>PT Telkom Akses Indonesia</strong>. Berorientasi pada akurasi tinggi, disiplin prosedural,
                serta pemecahan masalah teknis secara adaptif.
              </p>
            </motion.div>

            {/* Stat Cards 2x2 Grid */}
            <motion.div
              variants={stagger}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </span>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'var(--surface-2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.accent,
                        }}
                      >
                        <Icon size={15} />
                      </div>
                    </div>
                    <div
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
        }
        @media (max-width: 859px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};

export default About;