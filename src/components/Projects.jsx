import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Smartphone, Globe, Eye, Sparkles, Layers, Cpu, Database, BarChart3 } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const PROJECTS = [
  {
    id: 'bisindo',
    title: 'BISINDO Sign Language Translator App',
    category: 'Mobile App',
    typeIcon: Smartphone,
    accent: '#54C5F8',
    description:
      'A cutting-edge mobile application for real-time translation of BISINDO (Indonesian Sign Language) two-handed gestures into text. Powered by Computer Vision, Roboflow custom dataset, and lightweight TensorFlow Lite (TFLite) offline inference.',
    techStack: ['Flutter', 'Dart', 'TensorFlow Lite', 'Computer Vision', 'Roboflow', 'Android Studio'],
    previewIcon: Cpu,
    highlights: 'Real-time gesture recognition with zero cloud latency',
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'bpjs-dashboard',
    title: 'BPJS Intern Performance Dashboard',
    category: 'Web App',
    typeIcon: Globe,
    accent: '#10B981',
    description:
      'Internal management and analytics dashboard developed during the BPJS Ketenagakerjaan internship. Visualizes intern KPI performance, JMO (Jamsostek Mobile) activation tracking, and participant analytics with interactive charts.',
    techStack: ['PHP', 'MySQL', 'Bootstrap 5', 'Chart.js', 'Data Visualization', 'AdminLTE'],
    previewIcon: BarChart3,
    highlights: 'Automated data metrics and operational reporting',
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'web-management',
    title: 'Full-Stack Enterprise Web Application',
    category: 'Web App',
    typeIcon: Globe,
    accent: '#61DAFB',
    description:
      'Modular web application featuring secure role-based access control (RBAC), relational database transactions, responsive interface, and robust RESTful API endpoints for corporate data management.',
    techStack: ['React', 'PHP / Laravel', 'MySQL', 'MariaDB', 'REST APIs', 'Tailwind CSS'],
    previewIcon: Database,
    highlights: 'Secure CRUD transactions & responsive modern frontend',
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
  },
  {
    id: 'mobile-suites',
    title: 'Android & Flutter Utility Ecosystem',
    category: 'Mobile App',
    typeIcon: Smartphone,
    accent: '#E76F00',
    description:
      'Suite of mobile applications engineered with Java and Flutter. Demonstrates custom widget architecture, local SQLite persistence, reactive state management, and device hardware integration.',
    techStack: ['Flutter', 'Java', 'Android Studio', 'SQLite', 'Material UI', 'REST Client'],
    previewIcon: Layers,
    highlights: 'Offline-first architecture and smooth UI transitions',
    githubUrl: 'https://github.com/zackyandyka',
    demoUrl: '#',
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
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* 16:9 Aspect Ratio Image / Placeholder Div */}
                <div
                  className="project-img-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle Grid Lines in preview */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                      `,
                      backgroundSize: '24px 24px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Category Badge (Top-Right) */}
                  <div
                    className="project-cat-badge"
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: 'rgba(10, 10, 10, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    <TypeIcon size={13} style={{ color: project.accent }} />
                    <span>{project.category}</span>
                  </div>

                  {/* Preview Watermark Icon */}
                  <div
                    className="project-watermark"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: `${project.accent}15`,
                      border: `1px solid ${project.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: project.accent,
                      marginBottom: '10px',
                      boxShadow: `0 8px 24px ${project.accent}20`,
                      zIndex: 1,
                    }}
                  >
                    <PreviewIcon size={30} />
                  </div>

                  <span
                    className="project-mockup-label"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      zIndex: 1,
                    }}
                  >
                    16:9 Project Mockup Frame
                  </span>
                </div>

                {/* Content Section */}
                <div
                  className="project-content-box"
                  style={{
                    padding: '24px',
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
                        margin: '0 0 10px',
                        fontSize: '1.2rem',
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
                        fontSize: '0.88rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        margin: '0 0 16px',
                        fontWeight: 300,
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Highlights Pill */}
                    <div
                      className="project-highlight"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 59, 29, 0.08)',
                        border: '1px solid rgba(255, 59, 29, 0.2)',
                        color: 'var(--accent)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        marginBottom: '16px',
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{project.highlights}</span>
                    </div>

                    {/* Tech Tags */}
                    <div
                      className="project-tech-tags"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '20px',
                      }}
                    >
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="project-tag"
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
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
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span className="project-actions-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Source & Demo
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
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
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
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
                        <Github size={17} />
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
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
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
                        <ExternalLink size={17} />
                      </motion.a>
                    </div>
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
            gap: 24px;
          }
          @media (max-width: 860px) {
            .projects-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
            .project-card {
              border-radius: 14px !important;
            }
            .project-img-box {
              padding: 12px 10px !important;
            }
            .project-cat-badge {
              padding: 3px 8px !important;
              font-size: 0.65rem !important;
              top: 8px !important;
              right: 8px !important;
            }
            .project-watermark {
              width: 44px !important;
              height: 44px !important;
              border-radius: 12px !important;
              margin-bottom: 4px !important;
            }
            .project-watermark svg {
              width: 22px !important;
              height: 22px !important;
            }
            .project-mockup-label {
              display: none !important;
            }
            .project-content-box {
              padding: 16px 12px !important;
            }
            .project-title {
              font-size: 0.95rem !important;
              margin-bottom: 6px !important;
            }
            .project-desc {
              font-size: 0.76rem !important;
              line-height: 1.4 !important;
              margin-bottom: 8px !important;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .project-highlight {
              font-size: 0.65rem !important;
              padding: 3px 8px !important;
              margin-bottom: 8px !important;
            }
            .project-tag {
              font-size: 0.68rem !important;
              padding: 3px 7px !important;
            }
            .project-actions {
              padding-top: 10px !important;
            }
            .project-actions-label {
              font-size: 0.72rem !important;
            }
            .project-action-btn {
              width: 32px !important;
              height: 32px !important;
              border-radius: 8px !important;
            }
            .project-action-btn svg {
              width: 15px !important;
              height: 15px !important;
            }
          }
          @media (max-width: 480px) {
            .projects-grid {
              gap: 10px !important;
            }
            .project-content-box {
              padding: 12px 10px !important;
            }
            .project-title {
              font-size: 0.88rem !important;
              line-height: 1.25 !important;
            }
            .project-desc {
              font-size: 0.72rem !important;
              -webkit-line-clamp: 2;
            }
            .project-actions-label {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Projects;

