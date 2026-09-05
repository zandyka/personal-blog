import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Sparkles,
  Cpu,
  Zap,
  Gamepad2,
  Activity,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const KEY_METRICS = [
  {
    label: 'Akurasi Validasi',
    value: '94.71%',
    sub: '80 Epoch Pelatihan Model',
    icon: Sparkles,
    color: '#34d399',
  },
  {
    label: 'Macro F1-Score',
    value: '0.95',
    sub: '26 Kelas Huruf A–Z (BISINDO)',
    icon: BrainCircuit,
    color: '#818cf8',
  },
  {
    label: 'On-Device Processing',
    value: '100%',
    sub: 'Zero Cloud & Tanpa Internet',
    icon: Cpu,
    color: '#38bdf8',
  },
  {
    label: 'Pengujian Fungsional',
    value: '14 / 14',
    sub: '100% Skenario Terverifikasi',
    icon: ShieldCheck,
    color: '#f59e0b',
  },
];

const PILLARS = [
  {
    id: 'pipeline',
    tab: 'Pipeline ML On-Device',
    title: 'Pipeline ML On-Device',
    tag: 'MediaPipe & Dense Neural Network',
    icon: Cpu,
    color: '#818cf8',
    specs: [
      { label: 'Ekstraksi Landmark', val: '21 Titik Koordinat 3D (MediaPipe)' },
      { label: 'Vektor Fitur', val: '176 Dimensi Scale-Invariant' },
      { label: 'Arsitektur Model', val: 'Dense NN (176D → 768 → 384 → 192 → 26)' },
      { label: 'Runtime Deployment', val: 'TensorFlow Lite (.tflite) di Android' },
    ],
  },
  {
    id: 'detection',
    tab: 'Deteksi Real-Time',
    title: 'Deteksi Real-Time Cerdas',
    tag: 'Dual-Threshold & Anti-Duplikat',
    icon: Zap,
    color: '#38bdf8',
    specs: [
      { label: 'Frame Rate', val: '~9 FPS (Frame Skipping Selektif 110ms)' },
      { label: 'Dual-Threshold', val: 'Live Display (≥0.55) & Commit Kata (≥0.65)' },
      { label: 'Anti-Duplikat', val: 'Cooldown 650ms & Konsistensi Frame' },
      { label: 'Kamera Depan', val: 'Koreksi Otomatis Mirror-Flip' },
    ],
  },
  {
    id: 'ecosystem',
    tab: 'Ekosistem Belajar',
    title: 'Ekosistem Belajar & Kuis',
    tag: 'Kamus A–Z, 4 Mode Kuis & Gamifikasi',
    icon: Gamepad2,
    color: '#34d399',
    specs: [
      { label: 'Kamus Visual', val: 'Katalog Postur Gestur Huruf A–Z' },
      { label: 'Mode Kuis', val: '4 Mode: Tebak, Peragakan & Susun Kata' },
      { label: 'Gamifikasi', val: 'XP Points, Level, Daily Streaks & Badges' },
      { label: 'Tracking Progres', val: 'Mistake Tracker & Statistik Belajar' },
    ],
  },
];

const PIPELINE_FLOW = [
  { no: '01', title: 'Kamera HP', sub: 'YUV420 Stream' },
  { no: '02', title: 'Frame Select', sub: '~9 FPS Skipping' },
  { no: '03', title: 'MediaPipe', sub: '21 Landmark 3D' },
  { no: '04', title: 'Vektor Fitur', sub: '176D Invariant' },
  { no: '05', title: 'TFLite Model', sub: 'Dense Classifier' },
  { no: '06', title: 'Threshold', sub: '0.55 / 0.65 Commit' },
  { no: '07', title: 'Output Kata', sub: 'Teks & Suara (TTS)' },
];

export default function AcademicHighlights() {
  const { playHover, playClick } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [activePillar, setActivePillar] = useState(PILLARS[0]);

  return (
    <section
      ref={ref}
      style={{
        padding: '76px 20px',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Typographic Hero Header */}
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
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(129, 140, 248, 0.1)',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              color: 'var(--accent)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '16px',
            }}
          >
            <GraduationCap size={15} />
            <span>Tugas Akhir • Applied AI Research</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              margin: '0 0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <span style={{ color: 'var(--text)' }}>Hand</span>
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Speak
            </span>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            <span>Real-Time On-Device BISINDO Sign Language Translator</span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>Teknik Informatika USU</span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>Predikat Cumlaude</span>
          </div>
        </motion.div>

        {/* 1. Key Performance Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {KEY_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 4px 16px var(--shadow-color)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  playHover();
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = metric.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: `${metric.color}15`,
                    border: `1px solid ${metric.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: metric.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: 'var(--text)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {metric.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: metric.color,
                      marginTop: '2px',
                    }}
                  >
                    {metric.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                    {metric.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* 2. Bento Grid: Visual Showcase & Technical Spec Sheet */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.25fr)',
            gap: '24px',
            alignItems: 'stretch',
            marginBottom: '28px',
          }}
          className="ta-showcase-grid"
        >
          {/* Left Column: Visual Showcase & Quick Tech Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px var(--shadow-color)',
            }}
          >
            {/* App Preview Image Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                background: '#0a0a0f',
              }}
            >
              <img
                src="/projects/handspeak.webp"
                alt="HandSpeak App"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.92,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, var(--surface) 0%, rgba(10,10,15,0.2) 60%, transparent 100%)',
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
                    background: 'rgba(129, 140, 248, 0.9)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  Real-Time AI
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(52, 211, 153, 0.9)',
                    color: '#0a0a0f',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  100% On-Device
                </span>
              </div>
            </div>

            {/* Concise Typography Specs */}
            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Mobile Computer Vision &bull; AI On-Device
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.55, fontWeight: 500 }}>
                  Penerjemah Bahasa Isyarat Indonesia (BISINDO) langsung di perangkat smartphone Android tanpa ketergantungan server internet.
                </p>
              </div>

              {/* Quick Tech Badges */}
              <div style={{ marginTop: 'auto' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--text-dim)',
                    marginBottom: '8px',
                  }}
                >
                  Tech Stack &amp; Metodologi
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Flutter', 'Dart', 'TensorFlow Lite', 'MediaPipe 3D', 'Python / Keras', 'Agile Scrum', 'Dataset Mendeley'].map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Spec Sheet Explorer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px var(--shadow-color)',
            }}
          >
            {/* Header Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {PILLARS.map((p) => {
                const isSelected = activePillar.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      playClick();
                      setActivePillar(p);
                    }}
                    onMouseEnter={playHover}
                    style={{
                      flex: '1 1 120px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isSelected ? `${p.color}15` : 'var(--surface-2)',
                      border: isSelected ? `1.5px solid ${p.color}` : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? p.color : 'var(--text-muted)',
                      }}
                    >
                      {p.tab}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Spec Sheet */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: activePillar.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    {activePillar.tag}
                  </span>
                  <h3
                    style={{
                      margin: '3px 0 0',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--text)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {activePillar.title}
                  </h3>
                </div>

                {/* Structured Spec Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {activePillar.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {spec.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: 'var(--text)',
                          textAlign: 'right',
                        }}
                      >
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Insight Callout */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={15} style={{ color: '#34d399' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
                  Performa Sempurna (F1 = 1.00): <strong>Huruf G, R, Z</strong>
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Target Optimasi: Kemiripan Gestur M &amp; N
              </span>
            </div>
          </motion.div>
        </div>

        {/* 3. Typographic Pipeline Flow Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '0 4px 16px var(--shadow-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--accent)',
              }}
            >
              Arsitektur Pipeline Deteksi Real-Time
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                fontWeight: 600,
              }}
            >
              Latensi: ~110ms / Frame
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
              gap: '10px',
            }}
          >
            {PIPELINE_FLOW.map((flow, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                    }}
                  >
                    {flow.no}
                  </span>
                  {idx < PIPELINE_FLOW.length - 1 && (
                    <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}
                >
                  {flow.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {flow.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ta-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}