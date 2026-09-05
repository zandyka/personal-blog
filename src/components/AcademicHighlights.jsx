import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap,
  Award,
  BookOpen,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const ACADEMIC_COURSES = [
  {
    code: 'TI-301',
    name: 'Rekayasa Perangkat Lunak',
    grade: 'A',
    description: 'Penerapan SDLC, pemodelan sistem UML, arsitektur microservice vs monolith, dan pengujian software terstruktur.',
    topics: ['Agile / Scrum', 'UML Architecture', 'Design Patterns', 'Software Testing'],
  },
  {
    code: 'TI-204',
    name: 'Sistem Basis Data & SQL',
    grade: 'A',
    description: 'Desain skema database relasional ternormalisasi (3NF), integritas data ACID, indexing, dan optimasi query kompleks.',
    topics: ['MySQL 8', 'Normalisasi 3NF', 'Query Optimization', 'Relational Schema'],
  },
  {
    code: 'TI-308',
    name: 'Pemrograman Web & REST API',
    grade: 'A',
    description: 'Arsitektur web modern decoupled dengan React.js SPA, perancangan RESTful API aman, autentikasi token, dan database.',
    topics: ['React.js', 'RESTful API', 'Backend Architecture', 'State Management'],
  },
  {
    code: 'TI-312',
    name: 'Pemrograman Mobile Terapan',
    grade: 'A',
    description: 'Pengembangan aplikasi mobile berbasis Flutter & Android SDK sesuai standar SKKNI BNSP dari Digitalent Kominfo RI.',
    topics: ['Flutter', 'Android SDK', 'UI Components', 'Stateful Lifecycles'],
  },
  {
    code: 'TI-202',
    name: 'Komunikasi Data & Jaringan',
    grade: 'A',
    description: 'Protokol model OSI & TCP/IP, pengalamatan subnetting IPv4, routing & switching, serta media transmisi kabel fiber optik.',
    topics: ['TCP/IP Model', 'Fiber Optics', 'Routing & Switching', 'Network Security'],
  },
  {
    code: 'TI-315',
    name: 'Kecerdasan Buatan & Visi Komputer',
    grade: 'A',
    description: 'Konsep deep learning, klasifikasi citra, pengenalan gestur tangan real-time, dan deployment model on-device AI.',
    topics: ['Computer Vision', 'TensorFlow', 'Convolutional Models', 'On-Device AI'],
  },
];

export default function AcademicHighlights() {
  const { playHover, playClick } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeCourse, setActiveCourse] = useState(ACADEMIC_COURSES[0]);

  return (
    <section
      ref={ref}
      style={{
        padding: '72px 20px',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            <GraduationCap size={14} />
            <span>Academic Foundation &amp; Applied Research</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Pendidikan &amp; Keunggulan Akademis
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.96rem',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Lulusan berpredikat <strong>Cum Laude (IPK 3.84 / 4.00)</strong> dari Universitas Sumatera Utara, membuktikan integritas akademis tinggi, penguasaan teori komputasi, dan riset inovasi AI terapan.
          </p>
        </motion.div>

        {/* 1. Academic Honors & Degree Credential Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: 'clamp(20px, 3.5vw, 32px)',
            marginBottom: '36px',
            boxShadow: '0 10px 30px var(--shadow-color)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {/* Left: Institution & Degree */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <GraduationCap size={28} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Universitas Sumatera Utara (USU)
                </span>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.28rem', fontWeight: 700, color: 'var(--text)' }}>
                  Teknik Informatika
                </h3>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Fakultas Vokasi &bull; Terakreditasi Nasional &bull; Kota Medan
                </p>
              </div>
            </div>

            {/* Middle: Cum Laude Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 20px',
                borderRadius: '16px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  flexShrink: 0,
                }}
              >
                <Award size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    3.84
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 4.00</span>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Predikat Cum Laude (Dengan Pujian)
                </span>
              </div>
            </div>

            {/* Right: Certified Standard Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
                <span>Standar Kompetensi Kerja Nasional (SKKNI BNSP)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-2)' }} />
                <span>Google Gemini Certified &amp; Huawei ICT Academy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text)' }}>
                <ShieldCheck size={16} style={{ color: '#34d399' }} />
                <span>Dicoding Indonesia &amp; Microsoft Fabric Certified</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Featured AI Capstone & Innovation Spotlight */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '32px',
            alignItems: 'stretch',
            marginBottom: '40px',
          }}
          className="academic-split-container"
        >
          {/* Spotlight Card: Handspeak AI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px var(--shadow-color)',
            }}
          >
            {/* Spotlight Header Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '210px',
                overflow: 'hidden',
                background: '#0a0a0f',
              }}
            >
              <img
                src="/projects/handspeak.webp"
                alt="Handspeak BISINDO Sign Language Translator AI"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, var(--surface) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 59, 29, 0.9)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  Featured Research &amp; Capstone
                </span>
              </div>
            </div>

            {/* Spotlight Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
                  Handspeak — BISINDO Sign Language Translator
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                  Aplikasi Mobile AI Berbasis Computer Vision &amp; Deep Learning
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                Proyek inovasi yang memecahkan kendala komunikasi inklusif bagi komunitas <strong>Teman Tuli</strong> di Indonesia. Mengintegrasikan algoritma Computer Vision dan model deep learning TensorFlow untuk mendeteksi landmark gestur tangan secara real-time melalui kamera ponsel cerdas dan menerjemahkannya ke dalam teks dan ucapan.
              </p>

              {/* Tech Stack Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Flutter Mobile', 'Python', 'TensorFlow Lite', 'Computer Vision', 'MediaPipe', 'Real-Time Inference'].map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 9px',
                      borderRadius: '6px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Impact Callout */}
              <div
                style={{
                  marginTop: 'auto',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(129, 140, 248, 0.08)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Sparkles size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
                  Mendemonstrasikan kemampuan merancang solusi AI aplikatif yang berdampak sosial nyata bagi masyarakat.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Core Coursework Mastery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 10px 30px var(--shadow-color)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <BookOpen size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Core Curriculum
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                Mata Kuliah Inti Unggulan
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Pilihan mata kuliah fondasi teknologi yang diselesaikan dengan predikat nilai sempurna (Grade A):
              </p>
            </div>

            {/* List of Courses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {ACADEMIC_COURSES.map((course) => {
                const isSelected = activeCourse.code === course.code;
                return (
                  <div
                    key={course.code}
                    onClick={() => {
                      playClick();
                      setActiveCourse(course);
                    }}
                    onMouseEnter={() => {
                      playHover();
                      setActiveCourse(course);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--surface-2)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-dim)' }}>
                          {course.code}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: isSelected ? 'var(--accent)' : 'var(--text)' }}>
                          {course.name}
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {course.topics.slice(0, 2).join(' &bull; ')}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(52, 211, 153, 0.15)',
                        color: '#34d399',
                        fontWeight: 800,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'JetBrains Mono', monospace",
                        flexShrink: 0,
                      }}
                    >
                      {course.grade}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Course Quick Focus Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse.code}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '6px' }}>
                  {activeCourse.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {activeCourse.topics.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .academic-split-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}