import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Medal, Camera, Sparkles, Star, Award } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const CountUpNumber = ({ target, decimals = 0, suffix = '', inView }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const end = parseFloat(target);
    const duration = 1500;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(end * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setVal(end);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span>
      {decimals > 0 ? val.toFixed(decimals) : Math.floor(val)}
      {suffix}
    </span>
  );
};

const ACHIEVEMENTS = [
  {
    id: 'ukk',
    icon: Trophy,
    type: 'score',
    score: '95.85',
    decimals: 2,
    badgeText: 'Highest Score: 95.85',
    title: 'Best Participant — UKK SMK TKJ',
    subtitle: 'Uji Kompetensi Keahlian Teknik Komputer & Jaringan',
    description:
      'Achieved the top examination score across vocational cohorts in network engineering, server routing, and telecommunication infrastructure installation.',
    tags: ['Network Engineering', 'Cisco / Mikrotik', 'Top Graduate'],
  },
  {
    id: 'networking-comp',
    icon: Medal,
    type: 'rank',
    score: '1st',
    badgeText: '1st Place Winner',
    title: '1st Place IT Networking Competition',
    subtitle: 'SMKS TIK Darussalam Medan',
    description:
      'Won 1st place in the regional technical networking championship, excelling in high-speed router configuration, subnetting, and diagnostic troubleshooting.',
    tags: ['Champion', 'LAN / WAN Diagnostics', 'Network Speedrun'],
  },
  {
    id: 'photo-contest',
    icon: Camera,
    type: 'rank',
    score: '3rd',
    badgeText: '3rd Place Winner',
    title: '3rd Place — Coca-Cola Photo Contest',
    subtitle: 'National Creative Photography Contest',
    description:
      'Awarded 3rd place in nationwide creative visual storytelling competition, recognizing aesthetic composition, visual media craft, and photography precision.',
    tags: ['Visual Media', 'Photography', 'Creative Direction'],
  },
];

const Achievements = () => {
  const { playHover } = useSoundContext();
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
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <section
      id="achievements"
      ref={ref}
      style={{
        padding: '100px 24px',
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
            Recognition & Honors
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
            Key Achievements
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
            Honors received in competitive technical examinations, networking competitions, and creative visual media.
          </p>
        </motion.div>

        {/* 3 Achievement Cards Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {ACHIEVEMENTS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                onMouseEnter={playHover}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                }}
              >
                {/* Background Ambient Glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212, 168, 83, 0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <div>
                  {/* Top Badge & Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.2) 0%, rgba(212, 168, 83, 0.05) 100%)',
                        border: '1px solid rgba(212, 168, 83, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        boxShadow: '0 4px 15px rgba(212, 168, 83, 0.2)',
                      }}
                    >
                      <Icon size={26} />
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: '999px',
                        background: 'rgba(212, 168, 83, 0.12)',
                        border: '1px solid rgba(212, 168, 83, 0.3)',
                        color: 'var(--accent)',
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{item.badgeText}</span>
                    </span>
                  </div>

                  {/* Score / Rank Highlight */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, var(--text) 40%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        letterSpacing: '-1px',
                      }}
                    >
                      {item.type === 'score' ? (
                        <CountUpNumber target={item.score} decimals={item.decimals} inView={inView} />
                      ) : (
                        <span>{item.score} Place</span>
                      )}
                    </div>

                    <h3
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: 'var(--accent)',
                        fontWeight: 500,
                      }}
                    >
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                      fontWeight: 300,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Tags Footer */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.72rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
