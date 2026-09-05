import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const FAQ_ITEMS = [
  {
    id: 'core-value',
    question: 'Apa keahlian utama dan nilai tambah yang Anda tawarkan?',
    answer:
      'Lulusan TI USU (IPK 3.84 Cum Laude) dengan kombinasi kuat antara rekayasa perangkat lunak (Full-Stack Web & Mobile AI) dan ketelitian operasional perbankan (Bank Sumut, BSI KCP Medan Area, BPJS Ketenagakerjaan Medan Kota). Terbiasa membangun solusi teknologi yang solutif, scalable, dan terstruktur rapi.',
    tag: 'Keahlian & Profil',
  },
  {
    id: 'notice-period',
    question: 'Kapan Anda bisa mulai bergabung (Notice Period)?',
    answer:
      'Saya berstatus "Available Immediately" (siap bergabung dan mulai bekerja secepatnya). Seluruh kewajiban studi akademis di Universitas Sumatera Utara telah selesai dengan predikat Cum Laude.',
    tag: 'Ketersediaan Kerja',
  },
  {
    id: 'roles',
    question: 'Posisi atau peran apa yang paling Anda kuasai?',
    answer:
      'Fokus utama saya terbagi ke dalam tiga domain utama: (1) Software Engineer / Full-Stack Web Developer (React.js, Laravel, REST API), (2) Mobile AI Developer (Flutter, TensorFlow Lite), dan (3) Banking Operations & IT Support Specialist (rekonsiliasi data, audit kepatuhan, dan otomasi alur kerja).',
    tag: 'Spesialisasi Karir',
  },
  {
    id: 'tech-stack',
    question: 'Tech stack apa saja yang menjadi senjata utama Anda?',
    answer:
      'Frontend: React.js, Tailwind CSS, Vite, JavaScript modern. Backend & Database: Laravel 11, PHP, RESTful API, MySQL. Mobile & AI: Flutter, Dart, Python, TensorFlow Lite, dan MediaPipe Computer Vision.',
    tag: 'Teknologi & Tools',
  },
  {
    id: 'handspeak-ai',
    question: 'Bagaimana teknologi dan inovasi di balik proyek Handspeak AI?',
    answer:
      'Handspeak adalah aplikasi mobile penerjemah bahasa isyarat BISINDO secara real-time. Menggunakan Computer Vision (MediaPipe) untuk melacak landmark tangan dan model deep learning TensorFlow Lite teroptimasi untuk inferensi cepat langsung di perangkat mobile (on-device AI).',
    tag: 'Riset AI & Mobile',
  },
  {
    id: 'freelance-service',
    question: 'Apakah Anda menerima proyek freelance web development atau desain grafis?',
    answer:
      'Tentu saja! Saya aktif melayani: (1) Pembuatan web, landing page, dan sistem web kustom, (2) Desain identitas brand komersial (kartu identitas, banner, merchandise), dan (3) Fotografi komersial & liputan dokumentasi event.',
    tag: 'Layanan & Freelance',
  },
  {
    id: 'nda-compliance',
    question: 'Apakah Anda bersedia menandatangani NDA untuk proyek sensitif?',
    answer:
      'Sangat bersedia. Berbekal pengalaman kerja di institusi perbankan dengan standar kepatuhan tinggi, saya memegang teguh integritas kode, privasi klien, dan kerahasiaan data pada setiap kolaborasi.',
    tag: 'Kepatuhan & Integritas',
  },
  {
    id: 'contact-speed',
    question: 'Berapa lama estimasi respon jika saya mengirimkan penawaran atau pesan?',
    answer:
      'Saya rutin memantau kotak masuk email dan WhatsApp. Untuk komunikasi profesional melalui email (zackyandyka1@gmail.com) atau form kontak langsung di halaman ini, saya biasanya merespon dalam kurun waktu kurang dari 24 jam.',
    tag: 'Respon & Komunikasi',
  },
];

const INITIAL_COUNT = 4;

export default function ContactFAQ() {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [expandedId, setExpandedId] = useState('core-value');
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, INITIAL_COUNT);
  const remainingCount = FAQ_ITEMS.length - INITIAL_COUNT;

  const toggleAccordion = (id) => {
    playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleShowAll = () => {
    playClick();
    setShowAll((prev) => !prev);
  };

  return (
    <section
      ref={ref}
      className="faq-section"
      style={{
        padding: '54px 20px 24px',
        maxWidth: '860px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        style={{ textAlign: 'center', marginBottom: '28px' }}
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
          <HelpCircle size={14} />
          <span>Quick Answers &bull; FAQ</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            margin: '0 0 10px',
          }}
        >
          Pertanyaan yang Sering Diajukan
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.92rem',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Jawaban lugas seputar latar belakang, ketersediaan kerja, spesialisasi teknis, dan alur kolaborasi profesional.
        </p>
      </motion.div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence initial={false}>
          {displayedFaqs.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, delay: idx < INITIAL_COUNT ? idx * 0.04 : (idx - INITIAL_COUNT) * 0.04 }}
                className="faq-accordion-item"
                style={{
                  borderRadius: '16px',
                  background: 'var(--surface)',
                  border: isExpanded ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                  overflow: 'hidden',
                  boxShadow: isExpanded ? '0 8px 24px var(--shadow-color)' : 'none',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
              >
                {/* Question Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  onMouseEnter={playHover}
                  className="faq-question-btn"
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isExpanded ? 'var(--accent)' : 'var(--text-dim)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        flexShrink: 0,
                      }}
                    >
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 'clamp(0.88rem, 1.15vw, 0.98rem)',
                        fontWeight: 700,
                        color: isExpanded ? 'var(--accent)' : 'var(--text)',
                        transition: 'color 0.2s ease',
                        lineHeight: 1.45,
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: isExpanded ? 'var(--accent-dim)' : 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isExpanded ? 'var(--accent)' : 'var(--text-muted)',
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="faq-answer-inner"
                        style={{
                          borderTop: '1px dashed var(--border)',
                          padding: '12px 18px 16px 46px',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 10px',
                            color: 'var(--text-muted)',
                            fontSize: '0.88rem',
                            lineHeight: 1.62,
                          }}
                        >
                          {faq.answer}
                        </p>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            background: 'var(--accent-dim)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--accent-border)',
                          }}
                        >
                          &bull; {faq.tag}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* More Questions? Expand/Collapse Button */}
      <div style={{ textAlign: 'center', marginTop: '22px' }}>
        <button
          type="button"
          onClick={handleToggleShowAll}
          onMouseEnter={playHover}
          className="faq-more-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 20px',
            borderRadius: '999px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px var(--shadow-color)',
          }}
        >
          <span>{showAll ? 'Show Less' : `More Questions? (${remainingCount}+)`}</span>
          <ChevronDown
            size={15}
            style={{
              transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
              color: 'var(--accent)',
            }}
          />
        </button>
      </div>

      <style>{`
        .faq-more-btn:hover {
          border-color: var(--accent-border) !important;
          background: var(--surface-2) !important;
          color: var(--accent) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 640px) {
          .faq-section {
            padding: 38px 12px 20px !important;
          }
          .faq-question-btn {
            padding: 12px 14px !important;
            gap: 10px !important;
          }
          .faq-answer-inner {
            padding: 10px 14px 14px 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
