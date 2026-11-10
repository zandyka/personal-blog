import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar, CheckCircle2, ChevronRight, Image, ArrowUpRight } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import SectionHead from './home/SectionHead';

const LOCATIONS = [
  {
    id: 'ptpn',
    order: '01',
    name: 'PT Perkebunan Nusantara III Holding (Persero)',
    shortName: 'PTPN III Holding',
    role: 'Officer Data Support Intern · Strategi & Pengembangan SDM',
    period: 'September 2026 - Sekarang',
    logo: '/journey/logos/ptpn.webp',
    photo: '/journey/aboutptpn.png',
    photoPosition: 'center center',
    accent: '#059669',
    address: 'Gedung Agro Plaza, Jl. H. R. Rasuna Said Kav. X-2 No. 1, Kuningan, Jakarta Selatan',
    // { text, to } = capaian yang punya halaman proyek sendiri
    highlights: [
      { text: 'Dashboard Eksekutif DSPS — tugas, agenda & proyek strategis', to: '/projects' },
      { text: 'Portal LM Entitas — pelaporan Laporan Manajemen PTPN Group', to: '/projects' },
      { text: 'Rekap penyerapan magang PTPN Group, tersinkron Google Sheets', to: '/projects' },
      'Konsolidasi anggaran pelatihan (RKAP) untuk pelaporan korporat',
    ],
  },
  {
    id: 'bpjs',
    order: '02',
    name: 'BPJS Ketenagakerjaan Medan Kota',
    shortName: 'BPJSTK Medan Kota',
    role: 'IT Team Coordinator & Admin Support Intern',
    period: 'Agustus 2025 - Desember 2025',
    logo: '/journey/logos/bpjs.webp',
    photo: '/journey/aboutbpjs.png',
    photoPosition: 'center center',
    accent: '#10b981',
    address: 'BPJS Ketenagakerjaan Kantor Cabang Medan Kota, Jl. Pattimura No. 334, Medan',
    highlights: [
      'Membangun sistem informasi SIGMA BPJSTK',
      'Troubleshooting teknis aplikasi mobile JMO',
      'Monitoring analitik dataset 198 peserta magang',
    ],
  },
  {
    id: 'bank-sumut',
    order: '03',
    name: 'PT. Bank Sumut (Kantor Pusat)',
    shortName: 'Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Juni 2025 - Juli 2025',
    logo: '/journey/logos/bank-sumut.webp',
    photo: '/journey/aboutbanksumut.png',
    photoPosition: 'center center',
    accent: '#0284c7',
    address: 'Jl. Imam Bonjol No. 18, Petisah Tengah, Medan',
    highlights: [
      'Pemrosesan transaksi operasional sesuai SOP',
      'Dashboard analitik visual volume transaksi',
      'Rekonsiliasi harian data kliring perbankan',
    ],
  },
  {
    id: 'bsi',
    order: '04',
    name: 'PT. Bank Syariah Indonesia (BSI)',
    shortName: 'Bank BSI',
    role: 'Back Office Intern (MBKM)',
    period: 'Maret 2025 - Mei 2025',
    logo: '/journey/logos/bsi.webp',
    photo: '/journey/aboutsbi.png',
    photoPosition: 'center center',
    accent: '#00a39d',
    address: 'Kantor Cabang Medan Area, Kota Medan',
    highlights: [
      'Verifikasi keabsahan data operasional perbankan',
      'Standarisasi kepatuhan dokumen pembiayaan',
      'Sertifikasi Magang MBKM BSI Terverifikasi',
    ],
  },
  {
    id: 'usu',
    order: '05',
    name: 'Universitas Sumatera Utara (USU)',
    shortName: 'Kampus USU',
    role: 'D3 Teknik Informatika · Kadiv Media Kreatif HIMTI',
    period: '2023 - 2026',
    logo: '/journey/logos/usu.webp',
    photo: '/journey/aboutusu.png',
    photoPosition: 'center center',
    accent: '#818cf8',
    address: 'Jl. Dr. T. Mansur No. 9, Padang Bulan, Medan',
    highlights: [
      'Lulus dengan predikat cum laude',
      'Kepala Divisi Media Kreatif HIMTI USU',
      'Riset Inovasi AI HandSpeak BISINDO Translator',
    ],
  },
  {
    id: 'telkom',
    order: '06',
    name: 'PT. Telkom Akses Indonesia',
    shortName: 'Telkom Akses',
    role: 'Fiber Technician Intern',
    period: 'Februari 2022 - April 2022',
    logo: '/journey/logos/telkom.webp',
    photo: '/journey/abouttelom.png',
    photoPosition: 'center center',
    accent: '#ef4444',
    address: 'Regional Area Medan, Sumatera Utara',
    highlights: [
      'Fusion Splicing kabel serat optik presisi',
      'Pengujian transmisi jaringan OPM & OTDR',
      'Maintenance infrastruktur lapangan FTTH / GPON',
    ],
  },
  {
    id: 'smk',
    order: '07',
    name: 'SMK Darussalam Medan',
    shortName: 'SMK Darussalam',
    role: 'Teknik Komputer & Jaringan (TKJ)',
    period: '2020 - 2023',
    logo: '/logos/logo smk darussalam.jpg',
    photo: '/journey/aboutsmk.png',
    photoPosition: 'center center',
    accent: '#38bdf8',
    address: 'Jl. Darussalam No. 26 ABC, Sei Sikambing D, Kota Medan',
    highlights: [
      'Kompetensi Kejuruan Teknik Komputer & Jaringan (TKJ)',
      'Instalasi Jaringan Komputer, LAN, Routing & Mikrotik',
      'Predikat Peserta Terbaik Uji Kompetensi Keahlian (UKK)',
    ],
  },
];

export default function JourneyMap() {
  const { playHover, playClick } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);

  return (
    <section ref={ref} className="ab-sec ab-sec--last journey-section" style={{ position: 'relative' }}>
      <div className="h-wrap">
        <SectionHead wide index="03" label="Perjalanan" aside="2020 — sekarang">
          Jejak <em>perjalanan</em>.
        </SectionHead>

        {/* MOBILE ONLY: Horizontal Quick-Select Rail */}
        <div className="journey-mobile-rail">
          {LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  playClick();
                  setSelectedLocation(loc);
                }}
                className={`journey-mobile-pill ${isSelected ? 'active' : ''}`}
                style={{
                  border: isSelected ? `1.5px solid ${loc.accent}` : '1px solid var(--border)',
                  background: isSelected ? `${loc.accent}15` : 'var(--surface)',
                  color: isSelected ? loc.accent : 'var(--text-muted)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '24px',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px 5px',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={loc.logo}
                    alt={loc.shortName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {loc.shortName}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Directed Journey Experience */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
            gap: '24px',
            alignItems: 'start',
          }}
          className="journey-roadmap-container"
        >
          {/* LEFT: Structured Route Stepper */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="journey-timeline-sidebar"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 8px 24px var(--shadow-color)',
            }}
          >
            {/* Stepper Timeline List */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Connected Track Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  left: '43px',
                  top: '18px',
                  bottom: '18px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 1,
                }}
              />

              {LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;

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
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--surface-2)' : 'transparent',
                      border: isSelected ? `1.5px solid ${loc.accent}` : '1px solid transparent',
                      boxShadow: isSelected ? `0 4px 14px ${loc.accent}20` : 'none',
                      transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {/* Station Real Brand Logo */}
                    <div
                      style={{
                        width: '64px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        border: isSelected ? `2px solid ${loc.accent}` : `1.5px solid var(--border)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 0 14px ${loc.accent}40` : 'none',
                        flexShrink: 0,
                        overflow: 'hidden',
                        padding: '6px 8px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={loc.logo}
                        alt={loc.shortName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>

                    {/* Milestone Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: isSelected ? `${loc.accent}25` : 'var(--surface-2)',
                            color: isSelected ? loc.accent : 'var(--text-dim)',
                            border: `1px solid ${isSelected ? `${loc.accent}50` : 'var(--border)'}`,
                          }}
                        >
                          {loc.period}
                        </span>
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: 'var(--text)',
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

                    {/* Chevron Indicator */}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="journey-card-inner"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: 'clamp(20px, 3vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 8px 24px var(--shadow-color)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header with Real Brand Logo, Period & Role */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '88px',
                        height: '52px',
                        borderRadius: '14px',
                        background: '#ffffff',
                        border: `1.5px solid ${selectedLocation.accent}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 12px',
                        boxShadow: `0 4px 16px ${selectedLocation.accent}20`,
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={selectedLocation.logo}
                        alt={selectedLocation.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3
                        className="journey-card-title"
                        style={{ margin: '0 0 3px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}
                      >
                        {selectedLocation.name}
                      </h3>
                      <span style={{ fontSize: '0.88rem', color: selectedLocation.accent, fontWeight: 700 }}>
                        {selectedLocation.role}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'var(--text-dim)',
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={14} />
                    <span>{selectedLocation.period}</span>
                  </div>
                </div>

                {/* Milestone Photo / Documentation Display */}
                <div
                  style={{
                    width: '100%',
                    height: 'clamp(210px, 26vw, 260px)',
                    borderRadius: '16px',
                    background: 'var(--surface-2)',
                    border: selectedLocation.photo ? '1px solid var(--border)' : '1.5px dashed var(--border)',
                    boxShadow: selectedLocation.photo ? '0 6px 20px rgba(0, 0, 0, 0.2)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'var(--text-dim)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {selectedLocation.photo ? (
                    <img
                      src={selectedLocation.photo}
                      alt={selectedLocation.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: selectedLocation.photoPosition || 'center center',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: selectedLocation.accent,
                        }}
                      >
                        <Image size={20} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Dokumentasi Kegiatan • {selectedLocation.shortName}
                      </span>
                    </>
                  )}
                </div>

                {/* Clean Address Line */}
                <div
                  className="journey-address-box"
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
                  <span style={{ fontSize: '0.86rem', color: 'var(--text)', fontWeight: 500, wordBreak: 'break-word', minWidth: 0 }}>
                    {selectedLocation.address}
                  </span>
                </div>

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
                    Capaian &amp; kontribusi
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedLocation.highlights.map((h) => {
                      const text = typeof h === 'string' ? h : h.text;
                      const rowStyle = {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.85rem',
                        color: 'var(--text)',
                        textDecoration: 'none',
                      };
                      const content = (
                        <>
                          <CheckCircle2 size={15} style={{ color: selectedLocation.accent, flexShrink: 0 }} />
                          <span>{text}</span>
                          {h.to && <ArrowUpRight size={14} style={{ color: selectedLocation.accent, flexShrink: 0 }} />}
                        </>
                      );
                      return h.to ? (
                        <Link key={text} to={h.to} onClick={playClick} onMouseEnter={playHover} className="journey-hl-link" style={rowStyle}>
                          {content}
                        </Link>
                      ) : (
                        <div key={text} style={rowStyle}>
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 880px) {
          .journey-mobile-rail {
            display: none !important;
          }
          .journey-timeline-sidebar {
            display: block !important;
          }
        }
        .journey-hl-link span { background: linear-gradient(currentColor, currentColor) 0 100% / 0% 1px no-repeat; transition: background-size 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .journey-hl-link:hover span { background-size: 100% 1px; }
        @media (max-width: 879px) {
          .journey-mobile-rail {
            display: flex !important;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            padding: 4px 2px 14px;
            margin-bottom: 8px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .journey-mobile-rail::-webkit-scrollbar {
            display: none;
          }
          .journey-mobile-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }
          .journey-roadmap-container {
            display: block !important;
          }
          .journey-timeline-sidebar {
            display: none !important;
          }
          .journey-card-inner {
            padding: 16px 14px !important;
            border-radius: 16px !important;
            gap: 14px !important;
          }
          .journey-card-title {
            font-size: 1.15rem !important;
          }
          .journey-address-box {
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
