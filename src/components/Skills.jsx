import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code2,
  Server,
  Smartphone,
  Database as DbIcon,
  Palette,
  Network,
  Cpu,
  Layers,
  Terminal,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'database', label: 'Database' },
  { id: 'design', label: 'Design' },
  { id: 'networking', label: 'Networking' },
];

const TECH_STACK = [
  {
    name: 'PHP',
    category: 'backend',
    color: '#8892BF',
    level: 'Advanced',
    desc: 'Backend scripting, PDO & OOP architecture',
    icon: Terminal,
  },
  {
    name: 'Java',
    category: 'mobile',
    color: '#E76F00',
    level: 'Intermediate',
    desc: 'Object-oriented programming & Android dev',
    icon: Cpu,
  },
  {
    name: 'Dart',
    category: 'mobile',
    color: '#0075BA',
    level: 'Proficient',
    desc: 'Asynchronous programming & Flutter state',
    icon: Code2,
  },
  {
    name: 'Flutter',
    category: 'mobile',
    color: '#54C5F8',
    level: 'Proficient',
    desc: 'Cross-platform apps, UI widgets, TFLite AI',
    icon: Layers,
  },
  {
    name: 'React',
    category: 'frontend',
    color: '#61DAFB',
    level: 'Proficient',
    desc: 'Modern SPA development, Hooks, component UI',
    icon: Code2,
  },
  {
    name: 'Laravel',
    category: 'backend',
    color: '#FF2D20',
    level: 'Intermediate',
    desc: 'MVC web applications, Eloquent ORM & APIs',
    icon: Server,
  },
  {
    name: 'Bootstrap 5',
    category: 'frontend',
    color: '#7952B3',
    level: 'Advanced',
    desc: 'Responsive web layout, utilities & components',
    icon: Palette,
  },
  {
    name: 'MySQL',
    category: 'database',
    color: '#00758F',
    level: 'Advanced',
    desc: 'Relational schema design, complex queries',
    icon: DbIcon,
  },
  {
    name: 'MariaDB',
    category: 'database',
    color: '#C0765A',
    level: 'Advanced',
    desc: 'Database optimization, administration & phpMyAdmin',
    icon: DbIcon,
  },
  {
    name: 'Figma',
    category: 'design',
    color: '#F24E1E',
    level: 'Proficient',
    desc: 'UI/UX prototyping, visual assets & typography',
    icon: Palette,
  },
  {
    name: 'Android Studio',
    category: 'mobile',
    color: '#3DDC84',
    level: 'Intermediate',
    desc: 'Native build toolchain, SDKs & emulators',
    icon: Smartphone,
  },
  {
    name: 'Fiber Optic & GPON',
    category: 'networking',
    color: 'var(--accent)',
    level: 'Certified',
    desc: 'Optical splicing, OLT/ONT config & troubleshooting',
    icon: Network,
  },
];

const SKILL_PILLS = {
  technical: [
    'Web Development',
    'Mobile App Development',
    'Database Architecture',
    'IT Troubleshooting',
    'System Maintenance',
    'Data Management',
    'Dashboard / BI Visualization',
    'API Integration',
    'Version Control (Git)',
  ],
  soft: [
    'Attention to Detail & Accuracy',
    'Banking Procedure Discipline',
    'Problem Solving & Analysis',
    'Adaptability in Multidisciplinary Teams',
    'Public Speaking & Presentation',
    'Team Leadership & Coordination',
    'Documentation & Reporting',
  ],
  networking: [
    'Fiber Optic Installation & Splicing',
    'GPON Network Infrastructure',
    'Network Troubleshooting & Diagnostics',
    'Hardware & Workstation Maintenance',
    'LAN/WAN Configuration Fundamentals',
  ],
};

const CompetencyCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { playClick, playHover } = useSoundContext();

  const slides = [
    {
      id: 'technical',
      tabLabel: 'Technical',
      title: 'Technical Competencies',
      subtitle: 'Core Architecture, Web & Mobile Systems',
      category: 'Software Engineering',
      color: 'var(--accent)',
      badgeBg: 'var(--accent-dim)',
      badgeBorder: 'var(--accent-border)',
      glowColor: 'var(--accent-glow)',
      icon: Zap,
      description:
        'Architectural design patterns, full-stack web architectures, mobile application lifecycles, and relational database governance.',
      skills: SKILL_PILLS.technical,
      counter: '01 / 03',
    },
    {
      id: 'soft',
      tabLabel: 'Operational',
      title: 'Operational & Soft Skills',
      subtitle: 'Banking Governance & Professional Execution',
      category: 'Enterprise & Banking',
      color: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      glowColor: 'rgba(16, 185, 129, 0.2)',
      icon: ShieldCheck,
      description:
        'Disciplined adherence to corporate banking workflows, confidential data archival, analytical problem resolution, and adaptive team coordination.',
      skills: SKILL_PILLS.soft,
      counter: '02 / 03',
    },
    {
      id: 'networking',
      tabLabel: 'Networking',
      title: 'Networking & Field Engineering',
      subtitle: 'Optical Infrastructure & Physical Systems',
      category: 'Telecommunication Infrastructure',
      color: '#FFAA00',
      badgeBg: 'rgba(255, 170, 0, 0.12)',
      badgeBorder: 'rgba(255, 170, 0, 0.3)',
      glowColor: 'rgba(255, 170, 0, 0.2)',
      icon: Network,
      description:
        'Certified vocational field competency in optical fiber fusion splicing, GPON distribution architectures, OTDR testing, and physical line repairs.',
      skills: SKILL_PILLS.networking,
      counter: '03 / 03',
    },
  ];

  // Auto-play timer (5.5s)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const goToSlide = (index) => {
    playClick();
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  const nextSlide = () => {
    playClick();
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    playClick();
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[activeSlide];
  const CurrentIcon = current.icon;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <div
      className="competency-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        marginTop: '30px',
        position: 'relative',
      }}
    >
      {/* Section Sub-Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span
          style={{
            color: current.color,
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
            transition: 'color 0.3s',
          }}
        >
          Specialized Domains
        </span>
        <h3
          style={{
            fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 8px',
          }}
        >
          Core Competencies Slideshow
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.92rem',
            maxWidth: '560px',
            margin: '0 auto',
            fontWeight: 300,
          }}
        >
          Explore verified operational standards, software engineering principles, and field networking capabilities.
        </p>
      </div>

      {/* Top Carousel Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {slides.map((s, idx) => {
          const isActive = idx === activeSlide;
          const TabIcon = s.icon;
          return (
            <motion.button
              key={s.id}
              onClick={() => goToSlide(idx)}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                background: isActive ? s.badgeBg : 'var(--surface)',
                border: `1px solid ${isActive ? s.color : 'var(--border)'}`,
                color: isActive ? s.color : 'var(--text-muted)',
                transition: 'all 0.25s',
              }}
            >
              <TabIcon size={15} style={{ color: isActive ? s.color : 'inherit' }} />
              <span>{s.tabLabel}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Slide Card Container */}
      <div
        className="carousel-card-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: `0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${current.glowColor}`,
          transition: 'box-shadow 0.4s ease',
          padding: 'clamp(20px, 4vw, 36px)',
        }}
      >
        {/* Glowing Top Border Gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${current.color}, transparent)`,
            transition: 'background 0.4s ease',
          }}
        />

        {/* Animated Slide Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Header: Icon, Category & Slide Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '18px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: current.badgeBg,
                    border: `1px solid ${current.badgeBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: current.color,
                    boxShadow: `0 8px 20px ${current.glowColor}`,
                    flexShrink: 0,
                  }}
                >
                  <CurrentIcon size={24} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: current.color,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    {current.category}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                      fontWeight: 700,
                      color: 'var(--text)',
                      lineHeight: 1.2,
                    }}
                  >
                    {current.title}
                  </h3>
                  <p
                    style={{
                      margin: '3px 0 0',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {current.subtitle}
                  </p>
                </div>
              </div>

              {/* Counter Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: current.color,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: current.badgeBg,
                    border: `1px solid ${current.badgeBorder}`,
                  }}
                >
                  {current.counter}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '22px',
                maxWidth: '780px',
              }}
            >
              {current.description}
            </p>

            {/* Skills Grid */}
            <div
              className="carousel-skills-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              {current.skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: current.badgeBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: current.color,
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={12} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text)',
                      lineHeight: 1.3,
                    }}
                  >
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Bottom Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {/* Left Arrow Button */}
          <motion.button
            onClick={prevSlide}
            onMouseEnter={playHover}
            whileHover={{ scale: 1.1, backgroundColor: current.badgeBg }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Previous Competency Domain"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Center Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {slides.map((s, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  onMouseEnter={playHover}
                  style={{
                    width: isActive ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: isActive ? current.color : 'var(--border-light)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? `0 0 10px ${current.color}` : 'none',
                  }}
                  title={s.title}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <motion.button
            onClick={nextSlide}
            onMouseEnter={playHover}
            whileHover={{ scale: 1.1, backgroundColor: current.badgeBg }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Next Competency Domain"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const Skills = ({ preview = false }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredTech =
    activeCategory === 'all'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === activeCategory);

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
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <section
      id="skills"
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
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: '40px' }}
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
            Technical Stack
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
            Skills & Capabilities
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
            Technical competencies honed through formal academic training, software projects, and practical field internships.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={playHover}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--bg)' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tech Stack Grid — 3 Columns */}
        <motion.div
          layout
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="skills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px',
            marginBottom: '60px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredTech.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  layout
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={playHover}
                  whileHover={{
                    y: -6,
                    boxShadow: `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${tech.color}25`,
                    borderColor: tech.color,
                  }}
                  className="skill-card"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'default',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle Top Border Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)`,
                    }}
                  />

                  <div>
                    {/* Header: Icon + Name + Badge */}
                    <div
                      className="skill-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="skill-icon-box"
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: `${tech.color}15`,
                            border: `1px solid ${tech.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: tech.color,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={22} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <h3
                            className="skill-name"
                            style={{
                              margin: 0,
                              fontSize: '1.05rem',
                              fontWeight: 600,
                              color: 'var(--text)',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                          >
                            {tech.name}
                          </h3>
                          <span
                            className="skill-category"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              textTransform: 'capitalize',
                              display: 'block',
                            }}
                          >
                            {tech.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className="skill-level"
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {tech.level}
                      </span>
                    </div>

                    <p
                      className="skill-desc"
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        margin: 0,
                        fontWeight: 300,
                      }}
                    >
                      {tech.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Skill Category Competency Carousel Section */}
        {!preview && <CompetencyCarousel />}

        <style>{`
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          @media (max-width: 860px) {
            .skills-grid {
              gap: 8px !important;
            }
            .skill-card {
              padding: 12px 10px !important;
              border-radius: 12px !important;
            }
            .skill-icon-box {
              width: 32px !important;
              height: 32px !important;
              border-radius: 8px !important;
            }
            .skill-icon-box svg {
              width: 16px !important;
              height: 16px !important;
            }
            .skill-name {
              font-size: 0.85rem !important;
            }
            .skill-category {
              font-size: 0.65rem !important;
            }
            .skill-level {
              font-size: 0.62rem !important;
              padding: 2px 5px !important;
            }
            .skill-desc {
              font-size: 0.72rem !important;
              line-height: 1.35 !important;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
          @media (max-width: 520px) {
            .skills-grid {
              gap: 6px !important;
            }
            .skill-card {
              padding: 8px 6px !important;
              border-radius: 10px !important;
            }
            .skill-icon-box {
              width: 28px !important;
              height: 28px !important;
            }
            .skill-icon-box svg {
              width: 14px !important;
              height: 14px !important;
            }
            .skill-name {
              font-size: 0.74rem !important;
            }
            .skill-category {
              display: none !important;
            }
            .skill-level {
              display: none !important;
            }
            .skill-desc {
              display: none !important;
            }
          }
          @media (max-width: 600px) {
            .carousel-skills-grid {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Skills;


