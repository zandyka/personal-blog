import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

// 1. Work Experiences in chronological timeline order (starting from Telkom Akses)
const WORK_EXPERIENCES = [
  {
    id: 'telkom-akses',
    company: 'PT. Telkom Akses Indonesia',
    role: 'Fiber Technician Intern',
    period: 'Februari 2022 - April 2022',
    type: 'Internship',
    logo: '/logos/logo telkom.png',
    icon: Network,
    description:
      'Melakukan penyambungan kabel fiber optik (fusion splicing), pengujian redaman OPM/OTDR, serta pemeliharaan infrastruktur jaringan GPON di lapangan.',
    tags: ['Fiber Optic', 'GPON Infrastructure', 'Field Diagnostics', 'Fusion Splicing'],
  },
  {
    id: 'bsi',
    company: 'PT. Bank Syariah Indonesia (BSI)',
    role: 'Back Office Intern',
    period: 'Maret 2025 - Mei 2025',
    type: 'Internship',
    logo: '/logos/logo bsi.png',
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
    logo: '/logos/logo bank sumut.png',
    logoBg: '#224192',
    icon: Building2,
    description:
      'Mendukung pemrosesan transaksi harian nasabah, penanganan pertanyaan layanan, serta penerapan standar operasional prosedur (SOP) perbankan.',
    tags: ['Banking Operations', 'Transaction Processing', 'Customer Service'],
  },
  {
    id: 'bpjs',
    company: 'BPJS Ketenagakerjaan',
    role: 'IT / Admin Support Intern',
    period: 'September 2025 - Desember 2025',
    type: 'Internship',
    logo: '/logos/logo bpjs.png',
    icon: Server,
    description:
      'Mengembangkan dashboard analitik performa magang, melakukan troubleshooting aplikasi JMO (Jamsostek Mobile), dan mengelola dataset kepesertaan.',
    tags: ['IT Support', 'Dashboard Analytics', 'Data Management', 'JMO Troubleshooting'],
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
    logo: '/logos/logo pkbm.png',
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
    logo: '/logos/logo pkkmb.png',
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
    logo: '/logos/logo rindu tenang.png',
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
        bg: 'rgba(255, 59, 29, 0.12)',
        border: 'rgba(255, 59, 29, 0.3)',
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

const TimelineCard = ({ item, index }) => {
  const { playHover } = useSoundContext();
  const [imgError, setImgError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const isEven = index % 2 === 0;
  const Icon = item.icon;
  const badgeStyle = getBadgeStyle(item.type);
  const hasLogo = item.logo && !imgError;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: isEven ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
      className={`timeline-row ${isEven ? 'timeline-left' : 'timeline-right'}`}
    >
      {/* Center Node / Dot on Timeline */}
      <div
        className="timeline-center-node"
        style={{
          position: 'absolute',
          left: '50%',
          top: '24px',
          transform: 'translateX(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: inView ? badgeStyle.color : 'var(--border)',
          border: '3px solid var(--bg)',
          boxShadow: inView ? `0 0 14px ${badgeStyle.color}` : 'none',
          zIndex: 3,
          transition: 'all 0.4s ease-out',
        }}
      />

      {/* Card Body */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isEven ? -40 : 40, y: 20 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        onMouseEnter={playHover}
        whileHover={{ y: -4, borderColor: badgeStyle.border }}
        className="timeline-card"
        style={{
          width: 'calc(50% - 36px)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '22px',
          position: 'relative',
          boxShadow: inView ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Header: Logo/Icon & Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: hasLogo ? (item.logoBg || '#ffffff') : badgeStyle.bg,
                border: `1px solid ${hasLogo ? (item.logoBg ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)') : badgeStyle.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: hasLogo ? '6px' : 0,
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
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.25,
                }}
              >
                {item.company}
              </h3>
              {item.organizer && (
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {item.organizer}
                </p>
              )}
              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: badgeStyle.color,
                }}
              >
                {item.role}
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '4px 10px',
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

        {/* Period */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          <Calendar size={13} />
          <span>{item.period}</span>
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
            Rekam jejak pengalaman magang dan kerja profesional yang diurutkan secara kronologis mulai dari telekomunikasi hingga perbankan dan IT operasional.
          </p>
        </motion.div>

        {/* Work Timeline Container */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            className="timeline-vertical-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent) 0%, var(--accent-2-border) 90%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {WORK_EXPERIENCES.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>

        {/* Section 2: Pelatihan Profesional (VSGA DTS Kominfo) */}
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

        {/* Training Timeline Container */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            className="timeline-vertical-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 90%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {TRAINING_EXPERIENCES.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>

        {/* Section 3: Keaktifan Kegiatan, Organisasi & Volunteer */}
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

        {/* Activity Timeline Container */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            className="timeline-vertical-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent-2) 0%, var(--accent-dim) 90%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {ACTIVITY_EXPERIENCES.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .timeline-vertical-line {
            left: 20px !important;
            transform: none !important;
          }
          .timeline-center-node {
            left: 20px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-row {
            justify-content: flex-end !important;
          }
          .timeline-card {
            width: calc(100% - 50px) !important;
            margin-left: 50px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
