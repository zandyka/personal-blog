import React, { useState } from 'react';
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

        {/* Tech Stack Grid */}
        <motion.div
          layout
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
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
                          }}
                        >
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '1.05rem',
                              fontWeight: 600,
                              color: 'var(--text)',
                            }}
                          >
                            {tech.name}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              textTransform: 'capitalize',
                            }}
                          >
                            {tech.category}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {tech.level}
                      </span>
                    </div>

                    <p
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

        {/* Skill Category Pills Section */}
        {!preview && (
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Technical Skills */}
            <motion.div
              variants={fadeUp}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(101, 98, 245, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                  }}
                >
                  <Zap size={16} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  Technical Competencies
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SKILL_PILLS.technical.map((skill) => (
                  <span
                    key={skill}
                    onMouseEnter={playHover}
                    style={{
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Soft & Banking Skills */}
            <motion.div
              variants={fadeUp}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                  }}
                >
                  <CheckCircle size={16} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  Operational & Soft Skills
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SKILL_PILLS.soft.map((skill) => (
                  <span
                    key={skill}
                    onMouseEnter={playHover}
                    style={{
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Networking & Hardware */}
            <motion.div
              variants={fadeUp}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(84, 197, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#54C5F8',
                  }}
                >
                  <Network size={16} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  Networking & Field Engineering
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SKILL_PILLS.networking.map((skill) => (
                  <span
                    key={skill}
                    onMouseEnter={playHover}
                    style={{
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;


