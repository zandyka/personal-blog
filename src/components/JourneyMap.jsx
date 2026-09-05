import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MapPin,
  Building2,
  GraduationCap,
  Network,
  Server,
  BookOpen,
  Landmark,
  Calendar,
  CheckCircle2,
  Navigation,
  Compass,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const LOCATIONS = [
  {
    id: 'usu',
    name: 'Universitas Sumatera Utara (USU)',
    shortName: 'Kampus USU',
    role: 'Mahasiswa Teknik Informatika & Kadiv Media HIMTI',
    period: '2021 - 2025',
    category: 'education',
    categoryLabel: 'Kampus & Organisasi',
    icon: GraduationCap,
    accent: '#818cf8',
    address: 'Jl. Dr. T. Mansur No. 9, Padang Bulan, Medan',
    coords: '3.5651° N, 98.6570° E',
    mapPos: { x: 32, y: 65 }, // Percentage position on map
    summary:
      'Pusat kegiatan perkuliahan akademik, riset skripsi aplikasi AI Handspeak, serta kepemimpinan Divisi Media Kreatif HIMTI USU untuk publikasi dan visual branding.',
    highlights: [
      'Lulus predikat Cum Laude (IPK 3.84)',
      'Memimpin divisi media kreatif HIMTI',
      'Riset Handspeak BISINDO Translator AI',
    ],
  },
  {
    id: 'bank-sumut',
    name: 'PT. Bank Sumut (Kantor Pusat)',
    shortName: 'Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Juni 2025 - Juli 2025',
    category: 'banking',
    categoryLabel: 'Perbankan',
    icon: Building2,
    accent: '#0284c7',
    address: 'Jl. Imam Bonjol No. 18, Petisah Tengah, Medan',
    coords: '3.5855° N, 98.6744° E',
    mapPos: { x: 55, y: 38 },
    summary:
      'Mendukung operasional perbankan harian, pemrosesan transaksi teller & customer service, serta analisis data kliring dan rekapitulasi volume perbankan.',
    highlights: [
      'Pemrosesan transaksi operasional SOP',
      'Membangun dashboard analitik Bank Sumut',
      'Audit & rekonsiliasi data kliring',
    ],
  },
  {
    id: 'bsi',
    name: 'PT. Bank Syariah Indonesia (BSI)',
    shortName: 'Bank BSI',
    role: 'Back Office Intern',
    period: 'Maret 2025 - Mei 2025',
    category: 'banking',
    categoryLabel: 'Perbankan',
    icon: Landmark,
    accent: '#00a39d',
    address: 'Kantor Cabang Medan, Sumatera Utara',
    coords: '3.5910° N, 98.6790° E',
    mapPos: { x: 68, y: 28 },
    summary:
      'Bertanggung jawab atas verifikasi keabsahan data perbankan, administrasi dokumen pembiayaan nasabah, dan kearsipan berbasis standar kepatuhan tinggi.',
    highlights: [
      'Verifikasi data operasional perbankan',
      'Standarisasi arsip & kepatuhan dokumen',
      'Sertifikasi Magang MBKM BSI Terverifikasi',
    ],
  },
  {
    id: 'bpjs',
    name: 'BPJS Ketenagakerjaan',
    shortName: 'BPJSTK Medan',
    role: 'IT / Admin Support Intern',
    period: 'September 2025 - Desember 2025',
    category: 'it',
    categoryLabel: 'IT & Jaminan Sosial',
    icon: Server,
    accent: '#10b981',
    address: 'Jl. Pattimura No. 334 / Medan',
    coords: '3.5780° N, 98.6650° E',
    mapPos: { x: 44, y: 48 },
    summary:
      'Mengembangkan platform sistem informasi SIGMA BPJSTK, analitik dataset peserta magang, serta penanganan troubleshooting teknis aplikasi mobile JMO.',
    highlights: [
      'Membangun sistem SIGMA BPJSTK (React & Laravel)',
      'Troubleshooting teknis aplikasi JMO',
      'Monitoring dan visualisasi dataset 198 peserta',
    ],
  },
  {
    id: 'telkom',
    name: 'PT. Telkom Akses Indonesia',
    shortName: 'Telkom Akses',
    role: 'Fiber Technician Intern',
    period: 'Februari 2022 - April 2022',
    category: 'it',
    categoryLabel: 'Infrastruktur Jaringan',
    icon: Network,
    accent: '#ef4444',
    address: 'Regional Medan, Sumatera Utara',
    coords: '3.6050° N, 98.6850° E',
    mapPos: { x: 78, y: 20 },
    summary:
      'Praktik lapangan pemeliharaan jaringan telekomunikasi kabel fiber optik, penyambungan fusion splicing kabel distribusi GPON, dan uji redaman OPM/OTDR.',
    highlights: [
      'Penyambungan kabel fiber optik (Fusion Splicing)',
      'Pengujian redaman jaringan OPM/OTDR',
      'Maintenance infrastruktur lapangan GPON',
    ],
  },
  {
    id: 'pkbm',
    name: 'PKBM Bintula (Bina Tunas Muda Cakrawala)',
    shortName: 'PKBM Bintula',
    role: 'Volunteer Pengajar Komputer & MS Office',
    period: '2024',
    category: 'education',
    categoryLabel: 'Aksi Sosial & Literasi',
    icon: BookOpen,
    accent: '#f59e0b',
    address: 'Kota Medan, Sumatera Utara',
    coords: '3.5600° N, 98.6920° E',
    mapPos: { x: 62, y: 78 },
    summary:
      'Aksi sosial pengabdian masyarakat mengajarkan keterampilan literasi digital dan aplikasi perkantoran (Word, Excel, PowerPoint) untuk peserta Paket A, B, dan C.',
    highlights: [
      'Pelatihan literasi digital masyarakat',
      'Pendampingan Microsoft Office aplikatif',
      'Edukasi inklusif bagi peserta Paket A, B, C',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Semua Jejak Lokasi' },
  { id: 'banking', label: 'Perbankan' },
  { id: 'it', label: 'IT & Jaringan' },
  { id: 'education', label: 'Kampus & Sosial' },
];

export default function JourneyMap() {
  const { playHover, playClick } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);

  const filteredLocations =
    activeCategory === 'all'
      ? LOCATIONS
      : LOCATIONS.filter((loc) => loc.category === activeCategory);

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
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '999px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
            }}
          >
            <Navigation size={13} />
            <span>Interactive Mobility &amp; Location Map</span>
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
            My Journey Map &bull; Jejak Rekam Lapangan
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
            Peta interaktif titik-titik dedikasi kerja di perbankan, BUMN, jaringan telekomunikasi, almamater kampus, dan pengabdian sosial di Kota Medan.
          </p>

          {/* Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '24px',
            }}
          >
            {CATEGORIES.map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    playClick();
                    setActiveCategory(c.id);
                  }}
                  onMouseEnter={playHover}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'var(--surface)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                    boxShadow: active ? '0 4px 12px var(--accent-glow)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 2-Column Map Visualizer Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '28px',
            alignItems: 'stretch',
          }}
          className="journey-grid-container"
        >
          {/* LEFT: Cyber-Tech Coordinate Grid Map Board */}
          <div
            style={{
              position: 'relative',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 36px var(--shadow-color)',
              overflow: 'hidden',
            }}
          >
            {/* Map Header Status Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  MEDAN RADAR GRID &bull; 3.5952° N, 98.6722° E
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-dim)',
                  background: 'var(--surface-2)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                }}
              >
                {filteredLocations.length} Titik Terdata
              </span>
            </div>

            {/* Interactive Grid Canvas Board Area */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                width: '100%',
                minHeight: '320px',
                borderRadius: '16px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* Background Grid Pattern */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                  opacity: 0.45,
                }}
              />

              {/* Concentric Radar Rings & Crosshairs */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  border: '1px dashed var(--border)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  pointerEvents: 'none',
                  opacity: 0.6,
                }}
              />

              {/* Connecting Topology Lines */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                {filteredLocations.map((loc, idx) => {
                  if (idx === 0) return null;
                  const prev = filteredLocations[idx - 1];
                  return (
                    <line
                      key={loc.id}
                      x1={`${prev.mapPos.x}%`}
                      y1={`${prev.mapPos.y}%`}
                      x2={`${loc.mapPos.x}%`}
                      y2={`${loc.mapPos.y}%`}
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.3"
                    />
                  );
                })}
              </svg>

              {/* Location Map Pins */}
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                const Icon = loc.icon;

                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      playClick();
                      setSelectedLocation(loc);
                    }}
                    onMouseEnter={() => {
                      playHover();
                    }}
                    style={{
                      position: 'absolute',
                      top: `${loc.mapPos.y}%`,
                      left: `${loc.mapPos.x}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 30 : 20,
                    }}
                  >
                    {/* Pulsing ring aura when selected */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: `${loc.accent}30`,
                          border: `1px solid ${loc.accent}`,
                          animation: 'pulse 1.8s infinite',
                        }}
                      />
                    )}

                    {/* Interactive Pin Node */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: isSelected ? '6px 12px' : '5px 10px',
                        borderRadius: '999px',
                        background: isSelected ? loc.accent : 'var(--surface)',
                        color: isSelected ? '#ffffff' : 'var(--text)',
                        border: isSelected ? `2px solid #ffffff` : `1.5px solid ${loc.accent}`,
                        boxShadow: isSelected
                          ? `0 0 20px ${loc.accent}80`
                          : '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.22s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon size={14} style={{ color: isSelected ? '#ffffff' : loc.accent }} />
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{loc.shortName}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper Text */}
            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11.5px', color: 'var(--text-dim)' }}>
              Klik pada salah satu penanda pin di atas untuk meninjau rincian institusi
            </div>
          </div>

          {/* RIGHT: Detailed Location Profile Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLocation.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: 'clamp(20px, 3.5vw, 30px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                boxShadow: '0 12px 36px var(--shadow-color)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: `${selectedLocation.accent}15`,
                    color: selectedLocation.accent,
                    border: `1px solid ${selectedLocation.accent}35`,
                  }}
                >
                  {selectedLocation.categoryLabel}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
                  <Calendar size={13} />
                  <span>{selectedLocation.period}</span>
                </div>
              </div>

              {/* Institution Title & Role */}
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)' }}>
                  {selectedLocation.name}
                </h3>
                <span style={{ fontSize: '0.9rem', color: selectedLocation.accent, fontWeight: 600 }}>
                  {selectedLocation.role}
                </span>
              </div>

              {/* Coordinates & Address */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <MapPin size={15} style={{ color: selectedLocation.accent, flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>
                    {selectedLocation.address}
                  </div>
                  <div style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-dim)', marginTop: '2px' }}>
                    GEO COORDS: {selectedLocation.coords}
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {selectedLocation.summary}
              </p>

              {/* Key Deliverables / Highlights */}
              <div style={{ marginTop: 'auto' }}>
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
                  Fokus Pengalaman &amp; Kontribusi
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedLocation.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: selectedLocation.accent, flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
          70% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
        }

        @media (max-width: 880px) {
          .journey-grid-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}