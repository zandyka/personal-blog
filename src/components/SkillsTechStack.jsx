import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';
import {
  React as ReactIcon,
  TypeScript,
  Flutter,
  Android,
  Python,
  Docker,
  NextJs,
  TailwindCSS,
  Firebase,
  ViteJS,
  PHP,
  Figma,
  Laravel,
  Java,
  Supabase,
  NodeJs,
  Dart,
  MySQL,
  Gemini,
  JavaScript,
  PostgreSQL,
  ExpressJsDark,
  ClaudeAI,
  Bootstrap5,
  Tensorflow,
  CSS3,
  HTML5,
  Git,
  Photoshop,
  Postman,
  Linux,
  GitHubDark,
} from 'developer-icons';

// 3 Dynamic Marquee Rows with Official Vector Logos from developer-icons (xandemon)
const ROW_1 = [
  { name: 'React', icon: <ReactIcon size={20} /> },
  { name: 'TypeScript', icon: <TypeScript size={20} /> },
  { name: 'Flutter', icon: <Flutter size={20} /> },
  { name: 'Android', icon: <Android size={20} /> },
  { name: 'Python', icon: <Python size={20} /> },
  { name: 'Docker', icon: <Docker size={20} /> },
  { name: 'Next.js', icon: <NextJs size={20} /> },
  { name: 'TailwindCSS', icon: <TailwindCSS size={20} /> },
  { name: 'Firebase', icon: <Firebase size={20} /> },
  { name: 'Vite', icon: <ViteJS size={20} /> },
  { name: 'PHP', icon: <PHP size={20} /> },
  { name: 'Figma', icon: <Figma size={20} /> },
];

const ROW_2 = [
  { name: 'Laravel', icon: <Laravel size={20} /> },
  { name: 'Java', icon: <Java size={20} /> },
  { name: 'Supabase', icon: <Supabase size={20} /> },
  { name: 'Node.js', icon: <NodeJs size={20} /> },
  { name: 'Dart', icon: <Dart size={20} /> },
  { name: 'MySQL', icon: <MySQL size={20} /> },
  { name: 'Google Gemini', icon: <Gemini size={20} /> },
  { name: 'JavaScript', icon: <JavaScript size={20} /> },
  { name: 'PostgreSQL', icon: <PostgreSQL size={20} /> },
  { name: 'Express.js', icon: <ExpressJsDark size={20} /> },
  { name: 'Claude AI', icon: <ClaudeAI size={20} /> },
  { name: 'Bootstrap 5', icon: <Bootstrap5 size={20} /> },
];

const ROW_3 = [
  { name: 'TensorFlow AI', icon: <Tensorflow size={20} /> },
  { name: 'CSS3', icon: <CSS3 size={20} /> },
  { name: 'HTML5', icon: <HTML5 size={20} /> },
  { name: 'Git', icon: <Git size={20} /> },
  { name: 'Adobe Photoshop', icon: <Photoshop size={20} /> },
  { name: 'Postman', icon: <Postman size={20} /> },
  { name: 'Linux', icon: <Linux size={20} /> },
  { name: 'GitHub', icon: <GitHubDark size={20} /> },
];

export default function SkillsTechStack() {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const renderMarqueeRow = (items, direction = 'left', speed = 35) => {
    const tripleList = [...items, ...items, ...items];

    return (
      <div
        className={`skills-marquee-row ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{
          display: 'flex',
          gap: '14px',
          width: 'max-content',
          willChange: 'transform',
          animationDuration: `${speed}s`,
        }}
      >
        {tripleList.map((skill, idx) => (
          <div
            key={`${skill.name}-${idx}`}
            onClick={playClick}
            onMouseEnter={playHover}
            className="skill-pill-card"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '999px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
              boxShadow: '0 4px 16px var(--shadow-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                flexShrink: 0,
              }}
            >
              {skill.icon}
            </div>
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.2px',
              }}
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="tech-stack"
      ref={ref}
      style={{
        padding: '56px 0 60px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto 36px',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            TECH STACK
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.9rem)',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 auto 14px',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Skills &amp; Technology Stack</span>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
              }}
            />
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
      </div>

      {/* Animated Marquee Cloud (3 Rows) */}
      <div
        className="skills-cloud-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Subtle Edge Fog Overlays for Infinite Smooth Depth */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '120px',
            background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '120px',
            background: 'linear-gradient(to left, var(--bg) 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {renderMarqueeRow(ROW_1, 'left', 40)}
        {renderMarqueeRow(ROW_2, 'right', 46)}
        {renderMarqueeRow(ROW_3, 'left', 38)}
      </div>

      {/* Infinite Marquee CSS Keyframes & Hover Physics */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }

        @keyframes marqueeScrollRight {
          0% {
            transform: translate3d(-33.3333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .skills-marquee-row {
          display: flex;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee-left {
          animation-name: marqueeScrollLeft;
        }

        .marquee-right {
          animation-name: marqueeScrollRight;
        }

        .skills-cloud-wrapper:hover .skills-marquee-row {
          animation-play-state: paused;
        }

        .skill-pill-card:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: var(--accent) !important;
          box-shadow: 0 8px 24px var(--accent-glow) !important;
          background-color: var(--surface-2) !important;
        }

        @media (max-width: 768px) {
          .skill-pill-card {
            padding: 8px 16px !important;
            gap: 8px !important;
          }
          .skill-pill-card span {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </section>
  );
}
