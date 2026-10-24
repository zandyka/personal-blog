import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';
import {
  SiReact,
  SiTypescript,
  SiFlutter,
  SiAndroid,
  SiPython,
  SiDocker,
  SiNextdotjs,
  SiTailwindcss,
  SiFirebase,
  SiVite,
  SiPhp,
  SiFigma,
  SiLaravel,
  SiSupabase,
  SiNodedotjs,
  SiDart,
  SiMysql,
  SiGooglegemini,
  SiJavascript,
  SiPostgresql,
  SiExpress,
  SiAnthropic,
  SiBootstrap,
  SiTensorflow,
  SiCss,
  SiHtml5,
  SiGit,
  SiAndroidstudio,
  SiPostman,
  SiLinux,
  SiGithub,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { TbBrandAdobePhotoshop } from 'react-icons/tb';

// 3 Dynamic Marquee Rows with Official Real Vector Brand Logos
const ROW_1 = [
  { name: 'React', color: '#61DAFB', icon: <SiReact size={18} color="#61DAFB" /> },
  { name: 'TypeScript', color: '#3178C6', icon: <SiTypescript size={18} color="#3178C6" /> },
  { name: 'Flutter', color: '#02569B', icon: <SiFlutter size={18} color="#02569B" /> },
  { name: 'Android', color: '#3DDC84', icon: <SiAndroid size={18} color="#3DDC84" /> },
  { name: 'Python', color: '#3776AB', icon: <SiPython size={18} color="#3776AB" /> },
  { name: 'Docker', color: '#2496ED', icon: <SiDocker size={18} color="#2496ED" /> },
  { name: 'Next.js', color: '#FFFFFF', icon: <SiNextdotjs size={18} color="#FFFFFF" /> },
  { name: 'TailwindCSS', color: '#06B6D4', icon: <SiTailwindcss size={18} color="#06B6D4" /> },
  { name: 'Firebase', color: '#FFCA28', icon: <SiFirebase size={18} color="#FFCA28" /> },
  { name: 'Vite', color: '#646CFF', icon: <SiVite size={18} color="#646CFF" /> },
  { name: 'PHP', color: '#777BB4', icon: <SiPhp size={18} color="#777BB4" /> },
  { name: 'Figma', color: '#F24E1E', icon: <SiFigma size={18} color="#F24E1E" /> },
];

const ROW_2 = [
  { name: 'Laravel', color: '#FF2D20', icon: <SiLaravel size={18} color="#FF2D20" /> },
  { name: 'Java', color: '#ED8B00', icon: <FaJava size={18} color="#ED8B00" /> },
  { name: 'Supabase', color: '#3ECF8E', icon: <SiSupabase size={18} color="#3ECF8E" /> },
  { name: 'Node.js', color: '#5FA04E', icon: <SiNodedotjs size={18} color="#5FA04E" /> },
  { name: 'Dart', color: '#0175C2', icon: <SiDart size={18} color="#0175C2" /> },
  { name: 'MySQL', color: '#4479A1', icon: <SiMysql size={18} color="#4479A1" /> },
  { name: 'Google Gemini', color: '#8860D0', icon: <SiGooglegemini size={18} color="#8860D0" /> },
  { name: 'JavaScript', color: '#F7DF1E', icon: <SiJavascript size={18} color="#F7DF1E" /> },
  { name: 'PostgreSQL', color: '#4169E1', icon: <SiPostgresql size={18} color="#4169E1" /> },
  { name: 'Express.js', color: '#FFFFFF', icon: <SiExpress size={18} color="#FFFFFF" /> },
  { name: 'Claude AI', color: '#D97757', icon: <SiAnthropic size={18} color="#D97757" /> },
  { name: 'Bootstrap 5', color: '#7952B3', icon: <SiBootstrap size={18} color="#7952B3" /> },
];

const ROW_3 = [
  { name: 'TensorFlow AI', color: '#FF6F00', icon: <SiTensorflow size={18} color="#FF6F00" /> },
  { name: 'CSS3', color: '#1572B6', icon: <SiCss size={18} color="#1572B6" /> },
  { name: 'HTML5', color: '#E34F26', icon: <SiHtml5 size={18} color="#E34F26" /> },
  { name: 'Git', color: '#F05032', icon: <SiGit size={18} color="#F05032" /> },
  { name: 'Adobe Photoshop', color: '#31A8FF', icon: <TbBrandAdobePhotoshop size={18} color="#31A8FF" /> },
  { name: 'Android Studio', color: '#3DDC84', icon: <SiAndroidstudio size={18} color="#3DDC84" /> },
  { name: 'Postman', color: '#FF6C37', icon: <SiPostman size={18} color="#FF6C37" /> },
  { name: 'Linux', color: '#FCC624', icon: <SiLinux size={18} color="#FCC624" /> },
  { name: 'GitHub', color: '#FFFFFF', icon: <SiGithub size={18} color="#FFFFFF" /> },
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
                width: '20px',
                height: '20px',
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
