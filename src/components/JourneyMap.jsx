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
  ArrowRight,
  ChevronRight,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const LOCATIONS = [
  {
    id: 'usu',
    order: '01',
    name: 'Universitas Sumatera Utara (USU)',
    shortName: 'Kampus USU',
    role: 'Mahasiswa D3 TI (Cum Laude) & Kadiv Media HIMTI',
    period: '2021 - 2025',
    category: 'education',
    categoryLabel: 'Pendidikan & Organisasi',
    icon: GraduationCap,
    accent: '#818cf8',
    address: 'Jl. Dr. T. Mansur No. 9, Padang Bulan, Medan',
    summary:
      'Pusat kegiatan perkuliahan akademik, riset skripsi aplikasi AI Handspeak BISINDO Translator, serta kepemimpinan Divisi Media Kreatif HIMTI USU untuk publikasi dan visual branding.',
    highlights: [
      'Lulus predikat Cum Laude (IPK 3.84 / 4.00)',
      'Memimpin Divisi Media Kreatif HIMTI USU',
      'Riset & publikasi aplikasi AI Handspeak BISINDO Translator',
    ],
  },
  {
    id: 'telkom',
    order: '02',
    name: 'PT. Telkom Akses Indonesia',
    shortName: 'Telkom Akses',
    role: 'Fiber Technician Intern',
    period: 'Februari 2022 - April 2022',
    category: 'it',
    categoryLabel: 'Infrastruktur Jaringan',
    icon: Network,
    accent: '#ef4444',
    address: 'Regional Area Medan, Sumatera Utara',
    summary:
      'Praktik lapangan pemeliharaan jaringan telekomunikasi kabel fiber optik, penyambungan fusion splicing kabel distribusi GPON, dan uji redaman OPM/OTDR.',
    highlights: [
      'Penyambungan kabel fiber optik presisi tinggi (Fusion Splicing)',
      'Pengujian redaman jaringan transmisi OPM & OTDR',
      'Pemeliharaan infrastruktur jaringan lapangan FTTH / GPON',
    ],
  },
  {
    id: 'pkbm',
    order: '03',
    name: 'PKBM Bintula (Bina Tunas Muda)',
    shortName: 'PKBM Bintula',
    role: 'Volunteer Pengajar Komputer & MS Office',
    period: '2024',
    category: 'education',
    categoryLabel: 'Aksi Sosial & Literasi',
    icon: BookOpen,
    accent: '#f59e0b',
    address: 'Kota Medan, Sumatera Utara',
    summary:
      'Aksi sosial pengabdian masyarakat mengajarkan keterampilan literasi digital dan aplikasi perkantoran (Word, Excel, PowerPoint) untuk peserta Paket A, B, dan C.',
    highlights: [
      'Pelatihan literasi digital dan komputer aplikatif bagi masyarakat',
      'Pendampingan intensif Microsoft Office (Word, Excel, PowerPoint)',
      'Edukasi inklusif bagi peserta kesetaraan Paket A, B, dan C',
    ],
  },
  {
    id: 'bsi',
    order: '04',
    name: 'PT. Bank Syariah Indonesia (BSI)',
    shortName: 'Bank BSI',
    role: 'Back Office Intern (MBKM)',
    period: 'Maret 2025 - Mei 2025',
    category: 'banking',
    categoryLabel: 'Perbankan Syariah',
    icon: Landmark,
    accent: '#00a39d',
    address: 'Kantor Cabang Medan, Sumatera Utara',
    summary:
      'Bertanggung jawab atas verifikasi keabsahan data perbankan nasabah, standarisasi administrasi dokumen pembiayaan, dan kearsipan berbasis kepatuhan perbankan ketat.',
    highlights: [
      'Verifikasi keabsahan data operasional perbankan',
      'Standarisasi arsip & kepatuhan dokumen pembiayaan nasabah',
      'Sertifikasi Magang MBKM BSI Terverifikasi',
    ],
  },
  {
    id: 'bank-sumut',
    order: '05',
    name: 'PT. Bank Sumut (Kantor Pusat)',
    shortName: 'Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Juni 2025 - Juli 2025',
    category: 'banking',
    categoryLabel: 'Perbankan Daerah',
    icon: Building2,
    accent: '#0284c7',
    address: 'Jl. Imam Bonjol No. 18, Petisah Tengah, Medan',
    summary:
      'Mendukung operasional perbankan harian, pemrosesan transaksi teller & customer service, serta analisis data kliring dan rekapitulasi volume perbankan.',
    highlights: [
      'Pemrosesan transaksi operasional sesuai standar SOP ketat',
      'Membangun dashboard analitik visual volume transaksi Bank Sumut',
      'Rekonsiliasi harian dan audit data kliring perbankan',
    ],
  },
  {
    id: 'bpjs',
    order: '06',
    name: 'BPJS Ketenagakerjaan',
    shortName: 'BPJSTK Medan',
    role: 'IT / Admin Support Intern',
    period: 'September 2025 - Desember 2025',
    category: 'it',
    categoryLabel: 'IT & Jaminan Sosial',
    icon: Server,
    accent: '#10b981',
    address: 'Jl. Pattimura No. 334, Medan',
    summary:
      'Mengembangkan platform sistem informasi SIGMA BPJSTK, analitik dataset peserta magang, serta penanganan troubleshooting teknis aplikasi mobile JMO.',
    highlights: [
      'Membangun sistem informasi SIGMA BPJSTK berbasis React & Laravel',
      'Troubleshooting teknis dan pendampingan aplikasi mobile JMO',
      'Monitoring dan visualisasi analitik dataset 198 peserta magang',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Semua Perjalanan' },
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
            <span>Mobility &amp; Field Milestones</span>
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
            My Journey Map &bull; Rekam Jejak Lapangan
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.96rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Peta rute terarah menelusuri mobilitas pengalaman di dunia perbankan, BUMN infrastruktur telekomunikasi, almamater kampus, dan pengabdian sosial di Kota Medan.
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
                    // If current selection is not in filtered list, select first available
                    const newFiltered =
                      c.id === 'all'
                        ? LOCATIONS
                        : LOCATIONS.filter((l) => l.category === c.id);
                    if (newFiltered.length > 0 && !newFiltered.some((l) => l.id === selectedLocation.id)) {
                      setSelectedLocation(newFiltered[0]);
                    }
                  }}
                  onMouseEnter={playHover}
                  style={{
                    padding: '7px 16px',
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

        {/* 2-Column Directed Journey Experience */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
            gap: '28px',
            alignItems: 'start',
          }}
          className="journey-roadmap-container"
        >
          {/* LEFT: Structured Route Stepper / Stations Tracker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 10px 30px var(--shadow-color)',
            }}
          >
            {/* Header Track Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={16} style={{ color: 'var(--accent)' }} />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--text)',
                  }}
                >
                  Rute Destinasi Pengalaman
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--accent)',
                  background: 'var(--accent-dim)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--accent-border)',
                  fontWeight: 700,
                }}
              >
                {filteredLocations.length} Destinasi
              </span>
            </div>

            {/* Stepper Timeline List */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Connected Track Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  left: '21px',
                  top: '18px',
                  bottom: '18px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 1,
                }}
              />

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
                    onMouseEnter={playHover}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--surface-2)' : 'transparent',
                      border: isSelected ? `1.5px solid ${loc.accent}` : '1px solid transparent',
                      boxShadow: isSelected ? `0 4px 18px ${loc.accent}20` : 'none',
                      transition: 'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {/* Station Number Node */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: isSelected ? loc.accent : 'var(--surface)',
                        border: isSelected ? `2px solid #ffffff` : `1.5px solid var(--border)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#ffffff' : loc.accent,
                        boxShadow: isSelected ? `0 0 16px ${loc.accent}70` : '0 2px 6px rgba(0,0,0,0.08)',
                        flexShrink: 0,
                        transition: 'all 0.22s ease',
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    {/* Milestone Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isSelected ? `${loc.accent}25` : 'var(--surface-2)',
                            color: isSelected ? loc.accent : 'var(--text-dim)',
                            border: `1px solid ${isSelected ? `${loc.accent}50` : 'var(--border)'}`,
                          }}
                        >
                          {loc.period}
                        </span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: 'var(--text-dim)',
                            fontWeight: 600,
                          }}
                        >
                          {loc.categoryLabel}
                        </span>
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '0.94rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--text)' : 'var(--text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {loc.name}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.78rem',
                          color: isSelected ? loc.accent : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {loc.role}
                      </p>
                    </div>

                    {/* Active Arrow Indicator */}
                    <div
                      style={{
                        color: isSelected ? loc.accent : 'transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)' }}>
              Pilih salah satu destinasi untuk melihat rincian capaian kerja
            </div>
          </motion.div>

          {/* RIGHT: Active Milestone Profile & Impact Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: 'clamp(22px, 3.5vw, 30px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: '0 10px 30px var(--shadow-color)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Badge & Time Period */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: `${selectedLocation.accent}15`,
                      color: selectedLocation.accent,
                      border: `1px solid ${selectedLocation.accent}35`,
                    }}
                  >
                    {selectedLocation.categoryLabel}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: 'var(--text-dim)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <Calendar size={13} />
                    <span>{selectedLocation.period}</span>
                  </div>
                </div>

                {/* Institution Title & Role Header */}
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)' }}>
                    {selectedLocation.name}
                  </h3>
                  <span style={{ fontSize: '0.92rem', color: selectedLocation.accent, fontWeight: 600 }}>
                    {selectedLocation.role}
                  </span>
                </div>

                {/* Clean Address Line (No raw coords/radar grid) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <MapPin size={16} style={{ color: selectedLocation.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500 }}>
                    {selectedLocation.address}
                  </span>
                </div>

                {/* Narrative Summary */}
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {selectedLocation.summary}
                </p>

                {/* Key Deliverables & Highlights */}
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--text-dim)',
                      marginBottom: '10px',
                    }}
                  >
                    Fokus Kontribusi &amp; Capaian Nyata:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedLocation.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.83rem',
                          color: 'var(--text)',
                          lineHeight: 1.45,
                        }}
                      >
                        <CheckCircle2 size={15} style={{ color: selectedLocation.accent, flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Bottom Callout */}
                <div
                  style={{
                    marginTop: 'auto',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: `${selectedLocation.accent}10`,
                    border: `1px solid ${selectedLocation.accent}25`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Sparkles size={16} style={{ color: selectedLocation.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                    Pengalaman lapangan di Kota Medan yang memperkuat kompetensi teknis, adaptabilitas profesional, dan kepekaan sosial.
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .journey-roadmap-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}