import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Smartphone, Globe, Eye, Sparkles, Layers, Cpu, Database, BarChart3, Palette } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const PROJECTS = [
  {
    id: 'bisindo',
    title: 'BISINDO Sign Language Translator',
    category: 'Mobile App',
    typeIcon: Smartphone,
    accent: '#54C5F8',
    description: 'Real-time Indonesian sign language translator powered by offline TensorFlow Lite computer vision.',
    techStack: ['Flutter', 'Dart', 'TFLite'],
    previewIcon: Cpu,
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'bpjs-dashboard',
    title: 'BPJS Performance Dashboard',
    category: 'Web App',
    typeIcon: Globe,
    accent: '#10B981',
    description: 'Operational analytics dashboard for tracking intern performance and JMO account activations.',
    techStack: ['PHP', 'MySQL', 'Chart.js'],
    previewIcon: BarChart3,
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'web-management',
    title: 'Enterprise Web Application',
    category: 'Web App',
    typeIcon: Globe,
    accent: '#61DAFB',
    description: 'Enterprise data management platform featuring secure role-based access control and REST APIs.',
    techStack: ['React', 'Laravel', 'MySQL'],
    previewIcon: Database,
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'mobile-suites',
    title: 'Android & Flutter Ecosystem',
    category: 'Mobile App',
    typeIcon: Smartphone,
    accent: '#E76F00',
    description: 'Modular Android utilities with local SQLite persistence, reactive state, and hardware integration.',
    techStack: ['Flutter', 'Java', 'Android'],
    previewIcon: Layers,
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
];

const DESIGN_PROJECTS = [
  {
    id: 'banking-ui',
    title: 'Mobile Banking App UI/UX',
    category: 'UI/UX Case Study',
    accent: '#FF3B1D',
    description: 'Modern mobile banking interface featuring biometric authentication and streamlined transfer flows.',
    tools: ['Figma', 'UI/UX', 'Mobile Flow'],
    icon: Palette,
    figmaUrl: 'https://www.figma.com/@zandyka',
  },
  {
    id: 'himti-brand',
    title: 'HIMTI USU Brand Identity',
    category: 'Brand Identity',
    accent: '#FFAA00',
    description: 'Comprehensive visual branding guidelines, event promotion kits, and social media design systems.',
    tools: ['Figma', 'Branding', 'Vector Art'],
    icon: Sparkles,
    figmaUrl: 'https://www.figma.com/@zandyka',
  },
  {
    id: 'analytics-kit',
    title: 'Enterprise Analytics UI Kit',
    category: 'Design System',
    accent: '#61DAFB',
    description: 'High-contrast dark mode dashboard UI kit with data visualization cards and responsive components.',
    tools: ['Figma', 'Design System', 'Dark Mode'],
    icon: Layers,
    figmaUrl: 'https://www.figma.com/@zandyka',
  },
  {
    id: 'bisindo-design',
    title: 'Sign Language AI Companion',
    category: 'Product Design',
    accent: '#10B981',
    description: 'Human-centered mobile interface designed for real-time camera gesture recognition accessibility.',
    tools: ['Figma', 'Accessibility', 'Prototyping'],
    icon: Smartphone,
    figmaUrl: 'https://www.figma.com/@zandyka',
  },
];

const Projects = () => {
  const { playClick, playHover } = useSoundContext();
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
      id="projects"
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
            Portfolio Showcase
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
            Featured Projects
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
            Selected software development, mobile intelligence, and data visualization applications.
          </p>
        </motion.div>

        {/* 2x2 Projects Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {PROJECTS.map((project) => {
            const TypeIcon = project.typeIcon;
            const PreviewIcon = project.previewIcon;

            return (
              <motion.div
                key={project.id}
                variants={fadeUp}
                onMouseEnter={playHover}
                whileHover={{ y: -8 }}
                className="project-card"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Visual Banner Preview */}
                <div
                  className="project-img-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 7',
                    background: `radial-gradient(circle at center, ${project.accent}15 0%, rgba(255, 255, 255, 0.02) 80%)`,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Category Badge (Top-Right) */}
                  <div
                    className="project-cat-badge"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '999px',
                      background: 'rgba(7, 7, 9, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--text)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    <TypeIcon size={12} style={{ color: project.accent }} />
                    <span>{project.category}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className="project-watermark"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${project.accent}18`,
                      border: `1px solid ${project.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: project.accent,
                      boxShadow: `0 6px 18px ${project.accent}20`,
                      zIndex: 1,
                    }}
                  >
                    <PreviewIcon size={22} />
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className="project-content-box"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      className="project-title"
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        lineHeight: 1.3,
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="project-desc"
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.45,
                        margin: '0 0 12px',
                        fontWeight: 300,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div
                      className="project-tech-tags"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '5px',
                        marginBottom: '14px',
                      }}
                    >
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="project-tag"
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    className="project-actions"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      onMouseEnter={playHover}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title="View Source Code"
                      aria-label="View Source Code"
                      className="project-action-btn"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Github size={15} />
                    </motion.a>

                    <motion.a
                      href={project.demoUrl}
                      onClick={(e) => {
                        playClick();
                        if (project.demoUrl === '#') {
                          e.preventDefault();
                          alert(`Interactive preview for "${project.title}" will open upon demo deployment.`);
                        }
                      }}
                      onMouseEnter={playHover}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title="Live Demonstration"
                      aria-label="Live Demonstration"
                      className="project-action-btn"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 59, 29, 0.1)',
                        border: '1px solid rgba(255, 59, 29, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <ExternalLink size={15} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section Divider */}
        <div style={{ height: '60px' }} />

        {/* Design Section Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <span
            style={{
              color: 'var(--accent-2)',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Creative & UI/UX
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 10px',
              letterSpacing: '-0.02em',
            }}
          >
            Design Works
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent-2)',
              margin: '0 auto 14px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              maxWidth: '540px',
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            UI/UX prototyping, design systems, and visual identity projects created with Figma.
          </p>
        </motion.div>

        {/* Design Projects 2x2 Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {DESIGN_PROJECTS.map((design) => {
            const Icon = design.icon;
            return (
              <motion.div
                key={design.id}
                variants={fadeUp}
                onMouseEnter={playHover}
                whileHover={{ y: -6 }}
                className="project-card"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Visual Banner Preview */}
                <div
                  className="project-img-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 7',
                    background: `radial-gradient(circle at center, ${design.accent}15 0%, rgba(255, 255, 255, 0.02) 80%)`,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Category Badge */}
                  <div
                    className="project-cat-badge"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '999px',
                      background: 'rgba(7, 7, 9, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--text)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    <Palette size={12} style={{ color: design.accent }} />
                    <span>{design.category}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className="project-watermark"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${design.accent}18`,
                      border: `1px solid ${design.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: design.accent,
                      boxShadow: `0 6px 18px ${design.accent}20`,
                      zIndex: 1,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className="project-content-box"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      className="project-title"
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        lineHeight: 1.3,
                      }}
                    >
                      {design.title}
                    </h3>

                    <p
                      className="project-desc"
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.45,
                        margin: '0 0 12px',
                        fontWeight: 300,
                      }}
                    >
                      {design.description}
                    </p>

                    {/* Tools Tags */}
                    <div
                      className="project-tech-tags"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '5px',
                        marginBottom: '14px',
                      }}
                    >
                      {design.tools.map((tool) => (
                        <span
                          key={tool}
                          className="project-tag"
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div
                    className="project-actions"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <motion.a
                      href={design.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      onMouseEnter={playHover}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      title="View in Figma"
                      aria-label="View Design"
                      className="project-action-btn"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${design.accent}15`,
                        border: `1px solid ${design.accent}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: design.accent,
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <ExternalLink size={15} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <style>{`
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          @media (max-width: 860px) {
            .projects-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
            .project-card {
              border-radius: 14px !important;
            }
            .project-cat-badge {
              padding: 3px 7px !important;
              font-size: 0.62rem !important;
              top: 8px !important;
              right: 8px !important;
            }
            .project-watermark {
              width: 38px !important;
              height: 38px !important;
              border-radius: 10px !important;
            }
            .project-watermark svg {
              width: 18px !important;
              height: 18px !important;
            }
            .project-content-box {
              padding: 14px 12px !important;
            }
            .project-title {
              font-size: 0.92rem !important;
              margin-bottom: 4px !important;
            }
            .project-desc {
              font-size: 0.76rem !important;
              line-height: 1.35 !important;
              margin-bottom: 10px !important;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .project-tag {
              font-size: 0.65rem !important;
              padding: 2px 6px !important;
            }
            .project-action-btn {
              width: 28px !important;
              height: 28px !important;
              border-radius: 6px !important;
            }
            .project-action-btn svg {
              width: 13px !important;
              height: 13px !important;
            }
          }
          @media (max-width: 480px) {
            .projects-grid {
              gap: 8px !important;
            }
            .project-content-box {
              padding: 10px 8px !important;
            }
            .project-title {
              font-size: 0.82rem !important;
            }
            .project-desc {
              font-size: 0.72rem !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Projects;

