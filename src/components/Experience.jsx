import React from 'react';
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

const WORK_EXPERIENCES = [
  {
    id: 'bsi',
    company: 'PT. Bank Syariah Indonesia (BSI)',
    role: 'Back Office Intern',
    period: 'Maret 2025 - Mei 2025',
    type: 'Internship',
    icon: Landmark,
    description:
      'Bertanggung jawab atas verifikasi data operasional perbankan, tata kelola kearsipan dokumen nasabah, dan kepatuhan administrasi dengan standar kerahasiaan tinggi.',
    tags: ['Banking Admin', 'Data Verification', 'Compliance'],
  },
  {
    id: 'bank-sumut',
    company: 'PT. Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Jun 2025 - Jul 2025',
    type: 'Internship',
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
    icon: Server,
    description:
      'Mengembangkan dashboard analitik performa magang, melakukan troubleshooting aplikasi JMO (Jamsostek Mobile), dan mengelola dataset kepesertaan.',
    tags: ['IT Support', 'Dashboard Analytics', 'Data Management', 'JMO Troubleshooting'],
  },
  {
    id: 'telkom-akses',
    company: 'PT. Telkom Akses Indonesia',
    role: 'Fiber Technician Intern',
    period: 'Feb 2022 - Apr 2022',
    type: 'Internship',
    icon: Network,
    description:
      'Melakukan penyambungan kabel fiber optik (fusion splicing), pengujian redaman OPM/OTDR, serta pemeliharaan infrastruktur jaringan GPON di lapangan.',
    tags: ['Fiber Optic', 'GPON Infrastructure', 'Field Diagnostics', 'Fusion Splicing'],
  },
];

const TRAINING_EXPERIENCES = [
  {
    id: 'vsga-kominfo',
    company: 'Vocational School Graduate Academy (VSGA)',
    organizer: 'Digital Talent Scholarship (DTS) — Kominfo RI',
    role: 'Pelatihan Junior Mobile Programmer & Junior Web Developer',
    period: '2023 - 2024',
    type: 'Pelatihan',
    icon: Award,
    description:
      'Mengikuti program pelatihan intensif peningkatan kompetensi digital berbasis SKKNI yang diselenggarakan oleh Digitalent Kementerian Komunikasi dan Informatika (Kominfo RI), berfokus pada perancangan arsitektur aplikasi mobile Android dan pengembangan sistem web dinamis.',
    tags: ['Kominfo RI', 'Digitalent', 'VSGA', 'Digital Talent Scholarship', 'Standar SKKNI'],
  },
];

const ACTIVITY_EXPERIENCES = [
  {
    id: 'himti',
    company: 'HIMTI Universitas Sumatera Utara',
    role: 'Head of Creative Media Division (Kadiv Media Kreatif)',
    period: '2024 - 2025',
    type: 'Organisasi',
    icon: Users,
    description:
      'Memimpin divisi media kreatif dalam perancangan identitas visual organisasi, standarisasi aset grafis, pengelolaan publikasi media sosial, serta supervisi tim dokumentasi kegiatan himpunan.',
    tags: ['HIMTI USU', 'Kadiv Media Kreatif', 'Creative Direction', 'Team Leadership'],
  },
  {
    id: 'pkbm',
    company: 'PKBM Bintula (Pusat Kegiatan Belajar Masyarakat)',
    role: 'Volunteer Pengajar Komputer & Literasi Digital',
    period: '2024',
    type: 'Volunteer',
    icon: BookOpen,
    description:
      'Aksi sosial pengabdian masyarakat dengan memberikan edukasi dan pendampingan dasar-dasar pengoperasian komputer, aplikasi perkantoran, dan pemanfaatan internet produktif untuk para peserta didik.',
    tags: ['Pengabdian Masyarakat', 'Volunteer', 'Edukasi Komputer', 'Digital Literacy'],
  },
  {
    id: 'pkkmb',
    company: 'PKKMB Fakultas Vokasi USU 2025',
    role: 'Tim Publikasi & Dokumentasi (Pubdok)',
    period: '2025',
    type: 'Kepanitiaan',
    icon: Camera,
    description:
      'Bertanggung jawab penuh atas liputan fotografi, videografi, dan publikasi konten visual selama masa orientasi dan penyambutan mahasiswa baru Fakultas Vokasi USU 2025.',
    tags: ['PKKMB Vokasi 2025', 'Pubdok', 'Media Coverage', 'Dokumentasi Acara'],
  },
  {
    id: 'rindu-tenang',
    company: 'Pagelaran Seni & Musik "Rindu Tenang"',
    role: 'Event Organizer & Stage Coordinator',
    period: '2024',
    type: 'Event Organizer',
    icon: Sparkles,
    description:
      'Mengkoordinasikan manajemen operasional panggung, logistik perlengkapan pementasan, serta koordinasi lintas divisi guna menyukseskan gelaran acara seni musik Rindu Tenang.',
    tags: ['Event Organizer', 'Stage Management', 'Live Event Production'],
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const isEven = index % 2 === 0;
  const Icon = item.icon;
  const badgeStyle = getBadgeStyle(item.type);

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
        {/* Header: Company & Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: badgeStyle.bg,
                border: `1px solid ${badgeStyle.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: badgeStyle.color,
                flexShrink: 0,
              }}
            >
              <Icon size={19} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}
              >
                {item.company}
              </h3>
              {item.organizer && (
                <p
                  style={{
                    margin: '1px 0 0',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {item.organizer}
                </p>
              )}
              <p
                style={{
                  margin: '2px 0 0',
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
            Rekam jejak pengalaman magang dan kerja profesional di bidang perbankan syariah, IT &amp; analisis data, dan instalasi jaringan telekomunikasi.
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
