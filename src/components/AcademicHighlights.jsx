import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap,
  Sparkles,
  Cpu,
  Layers,
  Smartphone,
  CheckCircle2,
  BrainCircuit,
  Zap,
  BookOpen,
  Gamepad2,
  Activity,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const KEY_METRICS = [
  {
    label: 'Best Validation Accuracy',
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
    sub: '100% Skenario Passed',
    icon: ShieldCheck,
    color: '#f59e0b',
  },
];

const PILLARS = [
  {
    id: 'pipeline',
    title: 'Pipeline ML On-Device',
    subtitle: 'MediaPipe 3D Landmarks & Dense Neural Network',
    icon: Cpu,
    color: '#818cf8',
    description:
      'Arsitektur pemrosesan on-device yang mengekstraksi 21 koordinat 3D sendi tangan secara instan, dinormalisasi menjadi vektor fitur 176 dimensi yang kebal terhadap skala maupun pergeseran posisi tangan.',
    details: [
      'MediaPipe Hand Landmarker mengekstraksi 21 titik koordinat 3D dari frame kamera',
      'HandFeatureExtractor mengonversi data menjadi 176D scale-invariant feature vector',
      'Dense Neural Network (176D → 768 → 384 → 192 → 26) dengan ReLU, L2 Regularization, dan Dropout',
      'Dikonversi ke format TensorFlow Lite (.tflite) terkuantisasi untuk eksekusi ultra-ringan di Android',
    ],
  },
  {
    id: 'detection',
    title: 'Deteksi Real-Time Cerdas',
    subtitle: 'Dual-Threshold, Frame Skipping & Anti-Duplikat',
    icon: Zap,
    color: '#38bdf8',
    description:
      'Sistem inferensi kamera responsif yang dioptimalkan untuk perangkat keras smartphone tanpa menguras daya baterai ataupun menyebabkan frame drop pada layar kamera.',
    details: [
      'Memproses ~9 frame per detik menggunakan mekanisme frame skipping selektif (interval min. 110ms)',
      'Dual-threshold filtering: Live preview display (skor ≥ 0.55) & Commit karakter kata (skor ≥ 0.65)',
      'Mekanisme cooldown anti-duplikasi 650ms dan konsistensi frame (minimal 2 dari 5 frame)',
      'Koreksi otomatis rotasi kamera depan (mirror flip) untuk kenyamanan pengguna kidal maupun kanan',
    ],
  },
  {
    id: 'ecosystem',
    title: 'Ekosistem Belajar & Gamifikasi',
    subtitle: 'Kamus A–Z, 4 Mode Quiz & Progress Tracker',
    icon: Gamepad2,
    color: '#34d399',
    description:
      'Mengintegrasikan antarmuka penerjemahan bahasa isyarat dengan modul edukasi komprehensif agar pengguna awam dapat mempelajari BISINDO secara menyenangkan dan terukur.',
    details: [
      'Kamus visual interaktif huruf A–Z dilengkapi panduan postur gestur tangan',
      '4 Mode Quiz interaktif: Tebak Huruf, Tebak Kosakata, Peragakan Gestur (Kamera AI), dan Susun Kata',
      'Sistem gamifikasi berbasis XP points, level progression, daily streaks, dan achievement badge',
      'Progress analytics: rekap statistik belajar, mistake tracker cerdas, dan grafik perkembangan',
    ],
  },
];

const PIPELINE_STEPS = [
  { step: '01', title: 'Camera Stream', desc: 'Frame YUV420 Kamera HP' },
  { step: '02', title: 'Frame Selector', desc: '~9 FPS (Frame Skipping)' },
  { step: '03', title: 'MediaPipe 3D', desc: '21 Titik Landmark Tangan' },
  { step: '04', title: 'Feature Vector', desc: '176D Scale-Invariant' },
  { step: '05', title: 'TFLite Classifier', desc: 'DNN 768-384-192-26' },
  { step: '06', title: 'Dual-Threshold', desc: 'Live (≥0.55) & Commit (≥0.65)' },
  { step: '07', title: 'Real-Time Output', desc: 'Teks & Suara (TTS)' },
];

export default function AcademicHighlights() {
  const { playHover, playClick } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [activePillar, setActivePillar] = useState(PILLARS[0]);

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
              background: 'rgba(129, 140, 248, 0.1)',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              color: 'var(--accent)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            <GraduationCap size={14} />
            <span>Tugas Akhir • Applied AI Research</span>
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
            HandSpeak: Penerjemah BISINDO Real-Time
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.96rem',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Aplikasi mobile Android berbasis AI Computer Vision &amp; Deep Learning on-device untuk menerjemahkan huruf Bahasa Isyarat Indonesia (BISINDO) secara langsung tanpa internet. Proyek Tugas Akhir D3 Teknik Informatika USU Vokasi 2026 berpredikat <strong>Cumlaude</strong>.
          </p>
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
            marginBottom: '36px',
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
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
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
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: 'var(--text)',
                      lineHeight: 1.15,
                    }}
                  >
                    {metric.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metric.color, marginTop: '2px' }}>
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

        {/* 2. Main Two-Column Showcase: Visual Context & Interactive Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
            gap: '28px',
            alignItems: 'stretch',
            marginBottom: '36px',
          }}
          className="ta-showcase-grid"
        >
          {/* Left Column: Visual Research Preview & Core Narrative */}
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
              boxShadow: '0 10px 30px var(--shadow-color)',
            }}
          >
            {/* App Preview Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '220px',
                overflow: 'hidden',
                background: '#0a0a0f',
              }}
            >
              <img
                src="/projects/handspeak.webp"
                alt="HandSpeak BISINDO Real-Time Android App"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9,
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
                    background: 'rgba(129, 140, 248, 0.9)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  Proyek Tugas Akhir
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
                  Cumlaude 2026
                </span>
              </div>
            </div>

            {/* Content & Problem Narrative */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
                  Urgensi &amp; Latar Belakang Riset
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  Penyandang tunarungu di Indonesia mengandalkan BISINDO sebagai sarana komunikasi utama. Namun, minimnya pemahaman masyarakat umum memicu kesenjangan komunikasi yang nyata. Kebanyakan AI penerjemah bahasa isyarat di dunia ditujukan untuk ASL (American Sign Language) atau SIBI, serta bergantung pada server cloud yang lambat dan memerlukan internet aktif.
                </p>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(129, 140, 248, 0.08)',
                  border: '1px solid rgba(129, 140, 248, 0.2)',
                  fontSize: '0.84rem',
                  color: 'var(--text)',
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: 'var(--accent)' }}>Inovasi Kunci:</strong> HandSpeak memproses inferensi AI secara 100% <em>on-device</em> pada perangkat smartphone Android dengan latensi rendah, menjaga privasi data pengguna, dan dapat digunakan di area tanpa koneksi internet.
              </div>

              {/* Tech Stack Pills */}
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
                  Teknologi &amp; Metodologi Pengembangan
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Flutter & Dart',
                    'TensorFlow Lite',
                    'MediaPipe Hand Landmarker',
                    'Python & Keras',
                    'Agile / Scrum (4 Sprint)',
                    'Dataset Mendeley (Sanjaya, 2024)',
                  ].map((tech, idx) => (
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
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Three Core Solution Pillars (Interactive Explorer) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px var(--shadow-color)',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
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
                Tiga Solusi Utama yang Dibangun
              </span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                Arsitektur &amp; Fitur HandSpeak
              </h3>
            </div>

            {/* Pillar Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {PILLARS.map((p) => {
                const isSelected = activePillar.id === p.id;
                const Icon = p.icon;
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={16} style={{ color: isSelected ? p.color : 'var(--text-muted)', flexShrink: 0 }} />
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                        }}
                      >
                        {p.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Details Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: activePillar.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {activePillar.subtitle}
                  </div>
                  <h4 style={{ margin: '4px 0 8px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                    {activePillar.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {activePillar.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--text-dim)',
                    }}
                  >
                    Rincian Implementasi:
                  </span>
                  {activePillar.details.map((detail, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                        lineHeight: 1.45,
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: activePillar.color, flexShrink: 0, marginTop: '2px' }} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Benchmark Insight Callout */}
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
                <Activity size={15} style={{ color: '#34d399', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text)' }}>
                  Performa Sempurna (F1 = 1.00): <strong>Huruf G, R, Z</strong>
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Target Optimasi: Kemiripan gestur M &amp; N
              </span>
            </div>
          </motion.div>
        </div>

        {/* 3. Pipeline Flow Visualizer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 24px var(--shadow-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BrainCircuit size={16} style={{ color: 'var(--accent)' }} />
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--accent)',
              }}
            >
              End-to-End Real-Time Detection Pipeline
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {PIPELINE_STEPS.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 10px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {step.step}
                  </span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight size={11} style={{ color: 'var(--text-dim)' }} />
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {step.desc}
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
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}