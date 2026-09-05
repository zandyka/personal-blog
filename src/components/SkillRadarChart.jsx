import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code2,
  Database,
  Building2,
  Network,
  Palette,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const SKILL_AXES = [
  {
    id: 'software',
    name: 'Software Engineering',
    shortName: 'Software Dev',
    score: 92,
    icon: Code2,
    accent: '#818cf8',
    summary:
      'Perancangan aplikasi web & mobile modern berarsitektur decoupled (React.js, Laravel 11, Flutter) dengan standar clean code dan performa optimal.',
    tools: ['React.js', 'Laravel 11', 'Flutter', 'RESTful API', 'TailwindCSS', 'Python'],
    evidence: 'Handspeak AI, SIGMA BPJSTK, Mahaasyik Resto',
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    shortName: 'Data & SQL',
    score: 88,
    icon: Database,
    accent: '#38bdf8',
    summary:
      'Manajemen database relasional, pembersihan dataset, visualisasi performa bisnis, dan integrasi cloud analytics berbasis Microsoft Fabric & Python.',
    tools: ['MySQL 8', 'PostgreSQL', 'Microsoft Fabric', 'Chart.js', 'Pandas', 'Excel Analytics'],
    evidence: 'Visualisasi Bank Sumut, Dashboard MBKM BPJS',
  },
  {
    id: 'banking',
    name: 'Banking Operations',
    shortName: 'Banking Ops',
    score: 90,
    icon: Building2,
    accent: '#fbbf24',
    summary:
      'Pemrosesan transaksi harian, kliring perbankan, verifikasi kearsipan data nasabah, dan kepatuhan SOP perbankan dengan toleransi kesalahan nol.',
    tools: ['SOP Perbankan', 'Verifikasi Data', 'Arsip Digital', 'Kliring Transaksi', 'Kepatuhan Audit'],
    evidence: 'Magang PT. Bank Sumut & Bank Syariah Indonesia',
  },
  {
    id: 'network',
    name: 'Network & Infrastructure',
    shortName: 'Networking',
    score: 84,
    icon: Network,
    accent: '#34d399',
    summary:
      'Konfigurasi jaringan fisik & kabel fiber optik GPON, pengukuran redaman OPM/OTDR, fusion splicing, serta troubleshooting hardware dan sistem IT.',
    tools: ['Fiber Optic (GPON)', 'Fusion Splicing', 'OTDR/OPM', 'Routing & Switching', 'LAN / Hardware'],
    evidence: 'Magang PT. Telkom Akses & IT Support BPJS',
  },
  {
    id: 'design',
    name: 'UI/UX & Visual Design',
    shortName: 'Design & UI',
    score: 91,
    icon: Palette,
    accent: '#c084fc',
    summary:
      'Perancangan identitas visual, UI wireframing di Figma, serta desain media cetak skala besar (backdrop panggung, lanyard, standing banner, merchandise).',
    tools: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Print Production', 'Corporate Branding'],
    evidence: 'Kadiv Media Kreatif HIMTI & Pubdok PKKMB Vokasi 2025',
  },
  {
    id: 'media',
    name: 'Commercial Photography',
    shortName: 'Photography',
    score: 89,
    icon: Camera,
    accent: '#f43f5e',
    summary:
      'Fotografi produk komersial advertising (water splash, dramatic lighting), liputan dokumentasi event panggung, dan color grading profesional.',
    tools: ['Studio Lighting', 'Commercial Retouch', 'Adobe Lightroom', 'Event Pubdok', 'Visual Composition'],
    evidence: 'Komersial Coca-Cola, Live Event Rindu Tenang, HIMTI Games',
  },
];

export default function SkillRadarChart() {
  const { playHover, playClick } = useSoundContext();
  const [selectedSkill, setSelectedSkill] = useState(SKILL_AXES[0]);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Geometry calculations for 6-axis radar
  const size = 380;
  const center = size / 2;
  const radius = 135;
  const totalAxes = SKILL_AXES.length;

  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (radius * valuePercent) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric guide rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Polygon path of actual skill scores
  const polygonPoints = SKILL_AXES.map((skill, index) => {
    const { x, y } = getCoordinates(index, inView ? skill.score : 0);
    return `${x},${y}`;
  }).join(' ');

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
          style={{ textAlign: 'center', marginBottom: '44px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={13} />
            <span>Multi-Disciplinary Competency Matrix</span>
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
            Skill Radar &amp; Spektrum Keahlian
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.96rem',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Visualisasi pemetaan kompetensi 360° yang menggabungkan logika rekayasa perangkat lunak, ketelitian operasional perbankan, dan cita rasa estetika visual.
          </p>
        </motion.div>

        {/* 2-Column Responsive Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '36px',
            alignItems: 'center',
          }}
          className="radar-grid-container"
        >
          {/* LEFT: Interactive Radar Canvas/SVG */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px 16px 20px',
              boxShadow: '0 12px 36px var(--shadow-color)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1 / 1',
              }}
            >
              <svg
                viewBox={`0 0 ${size} ${size}`}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                  userSelect: 'none',
                }}
              >
                {/* SVG Definitions for Gradients */}
                <defs>
                  <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                    <stop offset="70%" stopColor="var(--accent-2)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="poly-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Subtle Ambient Radial Glow in center */}
                <circle cx={center} cy={center} r={radius * 1.05} fill="url(#radar-glow)" />

                {/* Concentric Guide Polygons */}
                {rings.map((ringScale, idx) => {
                  const ringPoints = SKILL_AXES.map((_, axisIdx) => {
                    const { x, y } = getCoordinates(axisIdx, ringScale * 100);
                    return `${x},${y}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={idx}
                      points={ringPoints}
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth={idx === rings.length - 1 ? '1.5' : '1'}
                      strokeDasharray={idx === rings.length - 1 ? 'none' : '3 3'}
                      opacity={0.65}
                    />
                  );
                })}

                {/* Axis Radial Lines */}
                {SKILL_AXES.map((_, idx) => {
                  const { x, y } = getCoordinates(idx, 100);
                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  );
                })}

                {/* Filled Radar Area */}
                <motion.polygon
                  points={polygonPoints}
                  fill="url(#poly-gradient)"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 12px var(--accent-glow))',
                    transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Interactive Axis Vertex Nodes */}
                {SKILL_AXES.map((skill, idx) => {
                  const { x, y } = getCoordinates(idx, inView ? skill.score : 0);
                  const isSelected = selectedSkill.id === skill.id;

                  return (
                    <g
                      key={skill.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        playClick();
                        setSelectedSkill(skill);
                      }}
                      onMouseEnter={() => {
                        playHover();
                        setSelectedSkill(skill);
                      }}
                    >
                      {/* Pulse aura when selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="14"
                          fill={skill.accent}
                          opacity="0.25"
                        />
                      )}
                      {/* Outer Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? '7' : '5'}
                        fill="var(--surface)"
                        stroke={skill.accent}
                        strokeWidth={isSelected ? '2.5' : '2'}
                        style={{
                          transition: 'all 0.25s ease',
                          filter: isSelected ? `drop-shadow(0 0 8px ${skill.accent})` : 'none',
                        }}
                      />
                    </g>
                  );
                })}

                {/* Axis Labels positioned outside radius */}
                {SKILL_AXES.map((skill, idx) => {
                  const { x, y } = getCoordinates(idx, 118);
                  const isSelected = selectedSkill.id === skill.id;

                  return (
                    <text
                      key={skill.id}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fill={isSelected ? skill.accent : 'var(--text-muted)'}
                      fontSize={isSelected ? '12px' : '10.5px'}
                      fontWeight={isSelected ? '700' : '600'}
                      fontFamily="'JetBrains Mono', monospace"
                      style={{
                        cursor: 'pointer',
                        transition: 'fill 0.2s, font-size 0.2s',
                        textShadow: isSelected ? '0 0 8px rgba(0,0,0,0.8)' : 'none',
                      }}
                      onClick={() => {
                        playClick();
                        setSelectedSkill(skill);
                      }}
                    >
                      {skill.shortName}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Quick Pill Switcher Below Radar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
                marginTop: '16px',
                width: '100%',
              }}
            >
              {SKILL_AXES.map((s) => {
                const active = selectedSkill.id === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      playClick();
                      setSelectedSkill(s);
                    }}
                    onMouseEnter={playHover}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: active ? `1px solid ${s.accent}` : '1px solid var(--border)',
                      background: active ? 'var(--surface-2)' : 'transparent',
                      color: active ? s.accent : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Icon size={12} />
                    <span>{s.shortName}</span>
                    <span style={{ opacity: 0.7, fontSize: '10px' }}>{s.score}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Competency Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSkill.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: 'clamp(20px, 3.5vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 12px 36px var(--shadow-color)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${selectedSkill.accent}, transparent)`,
                }}
              />

              {/* Title & Score Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--surface-2)',
                      border: `1px solid ${selectedSkill.accent}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selectedSkill.accent,
                    }}
                  >
                    {React.createElement(selectedSkill.icon, { size: 22 })}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 700, color: 'var(--text)' }}>
                      {selectedSkill.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: selectedSkill.accent,
                        fontWeight: 600,
                      }}
                    >
                      PROFICIENCY INDEX
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: selectedSkill.accent,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1,
                    }}
                  >
                    {selectedSkill.score}
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>%</span>
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Evaluated Level
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '999px',
                  background: 'var(--surface-2)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedSkill.score}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, var(--accent), ${selectedSkill.accent})`,
                    borderRadius: '999px',
                  }}
                />
              </div>

              {/* Summary Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                }}
              >
                {selectedSkill.summary}
              </p>

              {/* Key Technologies / Tools */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--text-dim)',
                    marginBottom: '8px',
                  }}
                >
                  Core Tools &amp; Frameworks
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSkill.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proof / Project Evidence */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <CheckCircle2 size={16} style={{ color: selectedSkill.accent, flexShrink: 0 }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.4 }}>
                  <strong style={{ color: selectedSkill.accent }}>Bukti Praktis:</strong>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>{selectedSkill.evidence}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .radar-grid-container {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}