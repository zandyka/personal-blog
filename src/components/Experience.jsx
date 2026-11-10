import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Building2,
  Calendar,
  Landmark,
  Network,
  Server,
  Users,
  Award,
  BookOpen,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import { Parallax, ScrollReveal } from './ui/ScrollMotion';
import { useTilt } from '../hooks/useTilt';

// 1. Work Experiences in chronological timeline order (starting from Telkom Akses)
const WORK_EXPERIENCES = [
  {
    id: 'telkom-akses',
    company: 'PT. Telkom Akses Indonesia',
    role: 'Fiber Technician Intern',
    period: 'Februari 2022 - April 2022',
    type: 'Internship',
    logo: '/logos/trim/telkom.webp',
    logoWide: true,
    icon: Network,
    description:
      'Melakukan penyambungan kabel fiber optik (fusion splicing), pengujian redaman OPM/OTDR, serta pemeliharaan infrastruktur jaringan GPON di lapangan.',
    tags: ['Fiber Optic', 'GPON Infrastructure', 'Field Diagnostics', 'Fusion Splicing'],
  },
  {
    id: 'bsi',
    company: 'PT. Bank Syariah Indonesia (BSI)',
    role: 'Back Office Intern',
    period: 'Maret 2025 - Juni 2025',
    type: 'Internship',
    logo: '/logos/trim/bsi.webp',
    logoWide: true,
    icon: Landmark,
    description:
      'Bertanggung jawab atas verifikasi data operasional perbankan, tata kelola kearsipan dokumen nasabah, dan kepatuhan administrasi dengan standar kerahasiaan tinggi.',
    tags: ['Banking Admin', 'Data Verification', 'Compliance', 'Archival Management'],
  },
  {
    id: 'bank-sumut',
    company: 'PT. Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Juni 2025 - Juli 2025',
    type: 'Internship',
    logo: '/logos/trim/bank-sumut.webp',
    logoWide: true,
    logoBg: '#224192',
    icon: Building2,
    description:
      'Mendukung pemrosesan transaksi harian nasabah, penanganan pertanyaan layanan, serta penerapan standar operasional prosedur (SOP) perbankan.',
    tags: ['Banking Operations', 'Transaction Processing', 'Customer Service'],
  },
  {
    id: 'bpjs',
    company: 'BPJS Ketenagakerjaan',
    role: 'IT Team Coordinator & Admin Support Intern',
    period: 'Agustus 2025 - Desember 2025',
    type: 'Internship',
    logo: '/logos/trim/bpjs.webp',
    logoWide: true,
    icon: Server,
    description:
      'Mengembangkan dashboard analitik performa magang, melakukan troubleshooting aplikasi JMO (Jamsostek Mobile), dan mengelola dataset kepesertaan.',
    tags: ['IT Support', 'Dashboard Analytics', 'Data Management', 'JMO Troubleshooting'],
  },
  {
    id: 'ptpn',
    company: 'PT Perkebunan Nusantara III Holding (Persero)',
    role: 'Officer Data Support Intern',
    period: 'September 2026 - Sekarang',
    type: 'Internship',
    logo: '/logos/logo ptpn.png',
    logoWide: true,
    logoBg: '#ffffff',
    icon: Building2,
    description:
      'Mengembangkan sistem dashboard Learning & Development (L&D) terpusat untuk monitoring data pelatihan seluruh PTPN Group (Holding, Subholding, dan anak perusahaan), mengonsolidasikan anggaran RKAP ke dalam dashboard, serta mengotomasi alur pemrosesan data manual untuk meningkatkan efisiensi dan akurasi pelaporan.',
    tags: ['Officer Data Support', 'L&D Dashboard', 'PTPN Holding', 'RKAP Budgeting', 'Data Automation'],
  },
];

// 2. Training Experiences separated into JMP and JWD
const TRAINING_EXPERIENCES = [
  {
    id: 'vsga-jmp',
    company: 'Vocational School Graduate Academy (VSGA)',
    organizer: 'Digital Talent Scholarship (DTS) — Kominfo RI',
    role: 'Junior Mobile Programmer (JMP)',
    period: 'April 2023 - Mei 2023',
    type: 'Pelatihan',
    logo: '/logos/logo kominfo.png',
    icon: Award,
    description:
      'Pelatihan intensif pengembangan aplikasi mobile Android berbasis standar SKKNI dari Digitalent Kominfo RI, mencakup arsitektur aplikasi mobile, komponen UI/UX interaktif, dan manajemen siklus hidup aplikasi.',
    tags: ['Kominfo RI', 'Digitalent', 'VSGA', 'Junior Mobile Programmer', 'Standar SKKNI'],
  },
  {
    id: 'vsga-jwd',
    company: 'Vocational School Graduate Academy (VSGA)',
    organizer: 'Digital Talent Scholarship (DTS) — Kominfo RI',
    role: 'Junior Web Developer (JWD)',
    period: 'Agustus 2024',
    type: 'Pelatihan',
    logo: '/logos/logo kominfo.png',
    icon: Award,
    description:
      'Pelatihan intensif pemrograman web dinamis berstandar SKKNI dari Digitalent Kominfo RI, mencakup perancangan struktur database relasional, arsitektur REST API, dan integrasi frontend modern.',
    tags: ['Kominfo RI', 'Digitalent', 'VSGA', 'Junior Web Developer', 'Web Programming'],
  },
];

// 3. Activity Experiences (Organisasi, Volunteer, Kepanitiaan, Event)
const ACTIVITY_EXPERIENCES = [
  {
    id: 'himti',
    company: 'Himpunan Mahasiswa Teknik Informatika (HIMTI)',
    role: 'Head of Creative Media Division (Kadiv Media Kreatif)',
    period: '2024 - 2025',
    type: 'Organisasi',
    logo: '/logos/logo himti.png',
    logoBg: '#121212',
    icon: Users,
    description:
      'Memimpin divisi media kreatif dalam perancangan identitas visual organisasi, standarisasi aset grafis, pengelolaan publikasi media sosial, serta supervisi tim dokumentasi kegiatan himpunan.',
    tags: ['HIMTI USU', 'Kadiv Media Kreatif', 'Creative Direction', 'Team Leadership'],
  },
  {
    id: 'pkbm',
    company: 'PKBM Bintula (Bina Tunas Muda Cakrawala)',
    role: 'Volunteer Pengajar Komputer & Microsoft Office',
    period: '2024',
    type: 'Volunteer',
    logo: '/logos/trim/pkbm.webp',
    logoWide: true,
    icon: BookOpen,
    description:
      'Aksi sosial pengabdian masyarakat dengan memberikan pengajaran dan pendampingan literasi komputer dasar serta aplikasi perkantoran Microsoft Office (Word, Excel, PowerPoint) kepada peserta didik program kesetaraan Paket A (setara SD), Paket B (setara SMP), dan Paket C (setara SMA).',
    tags: ['Pengabdian Masyarakat', 'Volunteer', 'Komputer Dasar', 'Microsoft Office', 'Paket A, B, C'],
  },
  {
    id: 'pkkmb',
    company: 'PKKMB Fakultas Vokasi USU 2025',
    role: 'Tim Publikasi, Dokumentasi & Desain Kreatif',
    period: '2025',
    type: 'Kepanitiaan',
    logo: '/logos/trim/pkkmb.webp',
    logoWide: true,
    icon: Camera,
    description:
      'Bertanggung jawab penuh atas liputan fotografi, videografi, dan publikasi konten visual selama masa orientasi mahasiswa baru Fakultas Vokasi USU 2025. Sekaligus menjadi perancang utama untuk seluruh kebutuhan desain fisik dan digital acara, mencakup backdrop panggung utama, kartu tanda pengenal (ID card), badge nama peserta & panitia, serta desain feed Instagram resmi.',
    tags: ['PKKMB Vokasi 2025', 'Pubdok', 'Desain Backdrop', 'Desain ID Card', 'Badge Nama', 'Feed Instagram'],
  },
  {
    id: 'rindu-tenang',
    company: 'Pagelaran Seni & Musik "Rindu Tenang"',
    role: 'Divisi Ticketing & Logistik',
    period: '2024',
    type: 'Event Organizer',
    logo: '/logos/trim/rindu-tenang.webp',
    logoWide: true,
    icon: Sparkles,
    description:
      'Bertanggung jawab atas manajemen sistem ticketing (penjualan, pendataan, dan validasi tiket pengunjung) serta pengelolaan logistik perlengkapan acara dan operasional panggung guna menyukseskan gelaran acara seni musik Rindu Tenang.',
    tags: ['Ticketing System', 'Logistik Acara', 'Event Organizer', 'Stage Operations'],
  },
];

const getBadgeStyle = (type) => {
  switch (type) {
    case 'Organisasi':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
        color: '#10B981',
      };
    case 'Volunteer':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)',
        color: '#F59E0B',
      };
    case 'Kepanitiaan':
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        border: 'rgba(59, 130, 246, 0.3)',
        color: '#3B82F6',
      };
    case 'Event Organizer':
      return {
        bg: 'rgba(192, 132, 252, 0.12)',
        border: 'rgba(192, 132, 252, 0.3)',
        color: '#C084FC',
      };
    case 'Pelatihan':
      return {
        bg: 'var(--accent-dim)',
        border: 'var(--accent-border)',
        color: 'var(--accent)',
      };
    default:
      return {
        bg: 'var(--accent-2-dim)',
        border: 'var(--accent-2-border)',
        color: 'var(--accent)',
      };
  }
};

const yearOf = (period) => (period.match(/\d{4}/) || [''])[0];

// Garis timeline yang terisi mengikuti scroll, dengan "komet" bercahaya di ujungnya.
// Ujung isian berada di 70% tinggi layar — titik kartu menyala saat melewati garis yang sama.
const TimelineTrack = ({ gradient, children }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const headTop = useTransform(fill, (v) => `${v * 100}%`);
  const lineBase = {
    position: 'absolute',
    left: '50%',
    top: '20px',
    bottom: '40px',
    width: '2px',
    transform: 'translateX(-50%)',
    zIndex: 1,
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div className="timeline-vertical-line" style={{ ...lineBase, background: 'var(--border)' }} />
      <div className="timeline-vertical-line" style={lineBase}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: gradient,
            transformOrigin: 'top',
            scaleY: reduce ? 1 : fill,
            borderRadius: '2px',
          }}
        />
        {!reduce && <motion.span className="timeline-comet" style={{ top: headTop }} aria-hidden="true" />}
      </div>
      {children}
    </div>
  );
};

const TimelineCard = ({ item, index, showYear = true }) => {
  const { playHover } = useSoundContext();
  const [imgError, setImgError] = useState(false);
  const reduce = useReducedMotion();
  const rowRef = useRef(null);
  // Menyala selama titiknya sudah melewati garis 70% layar (sinkron dengan isian garis).
  const { ref: nodeRef, inView: lit } = useInView({ rootMargin: '0px 0px -30% 0px' });

  const isEven = index % 2 === 0;
  const side = isEven ? -1 : 1;
  const Icon = item.icon;
  const badgeStyle = getBadgeStyle(item.type);
  const hasLogo = item.logo && !imgError;
  const isCurrent = /sekarang/i.test(item.period);

  // Masuk 3D: kartu berputar dari sisinya sendiri sambil bergeser ke tempatnya, mengikuti scroll.
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 100%', 'start 58%'] });
  const enter = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const x = useTransform(enter, [0, 1], [side * 70, 0]);
  const opacity = useTransform(enter, [0, 0.5, 1], [0, 0.85, 1]);
  const entryRotateY = useTransform(enter, [0, 1], [side * -32, 0]);
  const tilt = useTilt({ max: 6 });
  const rotateY = useTransform([entryRotateY, tilt.rotateY], ([a, b]) => a + b);

  const motionStyle = reduce
    ? {}
    : { x, opacity, rotateY, rotateX: tilt.rotateX, transformPerspective: 1100 };

  return (
    <div
      ref={rowRef}
      style={{
        position: 'relative',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: isEven ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
      className={`timeline-row ${isEven ? 'timeline-left' : 'timeline-right'}`}
    >
      {/* Tahun besar di sisi kosong seberang kartu, bergerak lebih lambat (parallax).
          Hanya muncul saat tahunnya berganti, supaya tidak berulang. */}
      {showYear && (
        <div
          className="timeline-year"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-8px',
            [isEven ? 'left' : 'right']: 'calc(50% + 44px)',
            textAlign: isEven ? 'left' : 'right',
            pointerEvents: 'none',
          }}
        >
          <Parallax speed={0.12}>
            <span
              className="timeline-year-num"
              style={{ WebkitTextStroke: `1.5px ${lit ? badgeStyle.color : 'var(--border)'}` }}
            >
              {yearOf(item.period)}
            </span>
            {isCurrent && (
              <span className="timeline-year-now" style={{ color: badgeStyle.color }}>
                <i style={{ background: badgeStyle.color }} /> Sedang berjalan
              </span>
            )}
          </Parallax>
        </div>
      )}

      {/* Center Node / Dot on Timeline */}
      <div
        ref={nodeRef}
        className="timeline-center-node"
        style={{
          position: 'absolute',
          left: '50%',
          top: '24px',
          transform: 'translateX(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: lit ? badgeStyle.color : 'var(--border)',
          border: '3px solid var(--bg)',
          boxShadow: lit ? `0 0 14px ${badgeStyle.color}` : 'none',
          zIndex: 3,
          transition: 'all 0.4s ease-out',
        }}
      >
        {isCurrent && <span className="timeline-node-pulse" style={{ borderColor: badgeStyle.color }} />}
      </div>

      {/* Card Body */}
      <motion.div
        {...tilt.handlers}
        onMouseEnter={playHover}
        whileHover={{ borderColor: badgeStyle.border }}
        className="timeline-card"
        style={{
          width: 'calc(50% - 36px)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '22px',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...motionStyle,
        }}
      >
        <motion.span style={tilt.glareStyle} aria-hidden="true" />
        {/* Card Header: Top row with Logo + Type Badge on left, and Period on right */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Logo + Type Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: hasLogo && item.logoWide ? '88px' : '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: hasLogo ? (item.logoBg || '#ffffff') : badgeStyle.bg,
                  border: `1px solid ${hasLogo ? (item.logoBg ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)') : badgeStyle.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: hasLogo ? (item.logoWide ? '6px 10px' : '6px') : 0,
                  color: badgeStyle.color,
                  flexShrink: 0,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {hasLogo ? (
                  <img
                    src={item.logo}
                    alt={item.company}
                    onError={() => setImgError(true)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: badgeStyle.bg,
                  border: `1px solid ${badgeStyle.border}`,
                  color: badgeStyle.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.type}
              </span>
            </div>

            {/* Period Badge on the right */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Calendar size={12} style={{ color: 'var(--accent)' }} />
              <span>{item.period}</span>
            </div>
          </div>

          {/* Full-width Title & Role without lateral squeeze */}
          <div>
            <h3
              style={{
                margin: '0 0 4px',
                fontSize: 'clamp(1rem, 2vw, 1.12rem)',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.35,
                wordBreak: 'break-word',
              }}
            >
              {item.company}
            </h3>
            {item.organizer && (
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                {item.organizer}
              </p>
            )}
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: badgeStyle.color,
                lineHeight: 1.35,
              }}
            >
              {item.role}
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 14px',
            fontWeight: 300,
          }}
        >
          {item.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.72rem',
                padding: '3px 9px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Angka yang naik dari 0 saat pertama kali terlihat.
const CountUp = ({ to }) => {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.6 });
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));
  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(value, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduce, to, value]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const START_YEAR = 2022;
const SUMMARY = [
  { value: WORK_EXPERIENCES.length, label: 'tempat magang profesional' },
  { value: TRAINING_EXPERIENCES.length, label: 'pelatihan berstandar SKKNI' },
  { value: ACTIVITY_EXPERIENCES.length, label: 'organisasi & kegiatan' },
  { value: new Date().getFullYear() - START_YEAR, label: `tahun rekam jejak, sejak ${START_YEAR}` },
];

const ExperienceSummary = () => (
  <div className="exp-summary">
    {SUMMARY.map((s, i) => (
      <motion.div
        key={s.label}
        className="exp-summary-item"
        initial={{ opacity: 0, y: 24, rotateX: -40 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
      >
        <strong>
          <CountUp to={s.value} />
        </strong>
        <span>{s.label}</span>
      </motion.div>
    ))}
  </div>
);

const Experience = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        padding: '44px 20px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Section 1: Professional Work Experience */}
        <ScrollReveal from={60} scale={0.92}>
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '32px' }}
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
              Career Timeline
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
              Professional Experience
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
                fontSize: '0.98rem',
                maxWidth: '620px',
                margin: '0 auto',
                fontWeight: 300,
              }}
            >
              Rekam jejak pengalaman magang dan kerja profesional yang diurutkan secara kronologis mulai dari telekomunikasi, perbankan, IT operasional hingga BUMN holding perkebunan.
            </p>
          </motion.div>
        </ScrollReveal>

        <ExperienceSummary />

        {/* Work Timeline Container */}
        <TimelineTrack gradient="linear-gradient(180deg, var(--accent) 0%, var(--accent-2-border) 90%, transparent 100%)">
          {WORK_EXPERIENCES.map((item, idx, arr) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={idx}
              showYear={idx === 0 || yearOf(arr[idx - 1].period) !== yearOf(item.period)}
            />
          ))}
        </TimelineTrack>

        {/* Section 2: Pelatihan Profesional (VSGA DTS Kominfo) */}
        <ScrollReveal from={60} scale={0.92}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginTop: '54px', marginBottom: '32px' }}
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
              Pelatihan &amp; Kompetensi
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
              Pelatihan Profesional
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
                fontSize: '0.98rem',
                maxWidth: '620px',
                margin: '0 auto',
                fontWeight: 300,
              }}
            >
              Program pelatihan peningkatan kompetensi digital nasional berstandar SKKNI yang diselenggarakan oleh Kementerian Kominfo RI.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Training Timeline Container */}
        <TimelineTrack gradient="linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 90%, transparent 100%)">
          {TRAINING_EXPERIENCES.map((item, idx, arr) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={idx}
              showYear={idx === 0 || yearOf(arr[idx - 1].period) !== yearOf(item.period)}
            />
          ))}
        </TimelineTrack>

        {/* Section 3: Keaktifan Kegiatan, Organisasi & Volunteer */}
        <ScrollReveal from={60} scale={0.92}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginTop: '54px', marginBottom: '32px' }}
          >
            <span
              style={{
                color: 'var(--accent-2)',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Activities &amp; Community
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
              Keaktifan Kegiatan, Organisasi &amp; Volunteer
            </h2>
            <div
              style={{
                width: '60px',
                height: '3px',
                background: 'var(--accent-2)',
                margin: '0 auto 16px',
                borderRadius: '2px',
              }}
            />
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.98rem',
                maxWidth: '640px',
                margin: '0 auto',
                fontWeight: 300,
              }}
            >
              Rekam jejak kontribusi kepengurusan organisasi mahasiswa, aksi sosial volunteer pengabdian masyarakat, kepanitiaan orientasi kampus, dan manajemen event.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Activity Timeline Container */}
        <TimelineTrack gradient="linear-gradient(180deg, var(--accent-2) 0%, var(--accent-dim) 90%, transparent 100%)">
          {ACTIVITY_EXPERIENCES.map((item, idx, arr) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={idx}
              showYear={idx === 0 || yearOf(arr[idx - 1].period) !== yearOf(item.period)}
            />
          ))}
        </TimelineTrack>
      </div>

      <style>{`
        /* Ringkasan angka di bawah judul pertama */
        .exp-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          max-width: 860px;
          margin: 0 auto 48px;
          perspective: 800px;
        }
        .exp-summary-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 18px;
          text-align: left;
          transform-origin: center top;
        }
        .exp-summary-item strong {
          display: block;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--text);
          margin-bottom: 6px;
        }
        .exp-summary-item > span { font-size: 0.8rem; color: var(--text-muted); line-height: 1.35; display: block; }

        /* Ujung garis yang bercahaya, bergerak turun mengikuti scroll */
        .timeline-comet {
          position: absolute;
          left: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fff;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 4px var(--accent-dim, rgba(255, 255, 255, 0.12)), 0 0 18px 4px var(--accent);
          z-index: 2;
        }

        /* Tahun besar bergaris di sisi kosong */
        .timeline-year-num {
          display: block;
          font-size: clamp(3.4rem, 7.5vw, 6.6rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 0.9;
          color: transparent;
          transition: -webkit-text-stroke-color 0.5s ease;
          user-select: none;
        }
        .timeline-year-now {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .timeline-year-now i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          animation: timelineBlink 1.6s ease-in-out infinite;
        }

        /* Cincin berdenyut pada pengalaman yang masih berjalan */
        .timeline-node-pulse {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 2px solid;
          animation: timelinePulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes timelinePulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes timelineBlink {
          50% { opacity: 0.25; }
        }
        @media (prefers-reduced-motion: reduce) {
          .timeline-node-pulse, .timeline-year-now i { animation: none; }
        }

        @media (max-width: 850px) {
          .exp-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 32px; }
          .exp-summary-item { padding: 12px 14px; }
          .timeline-year { display: none; }
          .timeline-vertical-line {
            left: 16px !important;
            transform: none !important;
          }
          .timeline-center-node {
            left: 16px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-row {
            justify-content: flex-end !important;
          }
          .timeline-card {
            width: calc(100% - 38px) !important;
            margin-left: 38px !important;
            padding: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
