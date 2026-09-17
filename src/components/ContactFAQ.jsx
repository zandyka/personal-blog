import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ChevronDown,
  HelpCircle,
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

const INITIAL_VISIBLE_COUNT = 5;

export default function ContactFAQ() {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeId, setActiveId] = useState('core-value');
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, INITIAL_VISIBLE_COUNT);

  const toggleFAQ = (id) => {
    playClick();
    setActiveId((prev) => (prev === id ? null : id));
  };

  const handleToggleShowAll = () => {
    playClick();
    setShowAll((prev) => !prev);
  };

  const handleScrollToContact = () => {
    playClick();
    const el = document.querySelector('.contact-main-split-grid') || document.querySelector('.contact-hero-header');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToAI = () => {
    playClick();
    const el = document.querySelector('.chatbox-section') || document.querySelector('.chatbox-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={ref} className="faq2-section">
      <div className="faq2-container">
        <div className="faq2-grid">
          {/* Left Column: Sticky Header & Action Buttons */}
          <div className="faq2-left-col">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="faq2-badge"
            >
              <HelpCircle size={14} />
              <span>Quick Answers &bull; FAQ</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="faq2-headline"
            >
              Ready to <br className="faq2-br-desktop" />
              collaborate?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="faq2-subtext"
            >
              Semua jawaban ringkas seputar spesialisasi teknis, ketersediaan kerja, kepatuhan NDA, dan alur kolaborasi profesional bersama Zacky Andyka.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="faq2-actions"
            >
              <button
                type="button"
                onClick={handleScrollToContact}
                onMouseEnter={playHover}
                className="faq2-btn-primary"
              >
                Kirim Pesan
              </button>

              <button
                type="button"
                onClick={handleScrollToAI}
                onMouseEnter={playHover}
                className="faq2-btn-secondary"
              >
                <span>Tanya Asisten AI</span>
                <ArrowRight size={15} className="faq2-btn-arrow" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Message Bubble FAQ List */}
          <div className="faq2-right-col">
            <div className="faq2-list">
              {displayedFaqs.map((item, idx) => {
                const isActive = activeId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: idx < INITIAL_VISIBLE_COUNT ? idx * 0.04 : 0.02,
                    }}
                    className="faq2-item"
                  >
                    {/* Question Row: Bubble + Circle Toggle */}
                    <div className="faq2-question-row">
                      <motion.button
                        type="button"
                        onClick={() => toggleFAQ(item.id)}
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.012 }}
                        whileTap={{ scale: 0.988 }}
                        className={`faq2-question-bubble ${isActive ? 'is-active' : ''}`}
                      >
                        <span className="faq2-question-text">{item.question}</span>
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => toggleFAQ(item.id)}
                        onMouseEnter={playHover}
                        className={`faq2-toggle-btn ${isActive ? 'is-active' : ''}`}
                        aria-label={isActive ? 'Tutup jawaban' : 'Buka jawaban'}
                      >
                        {isActive ? (
                          <Minus size={14} strokeWidth={2.5} />
                        ) : (
                          <Plus size={14} strokeWidth={2.5} />
                        )}
                      </button>
                    </div>

                    {/* Chat Bubble Reply (Answer) */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.28, ease: 'easeInOut' },
                          }}
                          className="faq2-answer-wrapper"
                        >
                          <motion.div
                            initial={{ scale: 0.85, y: -8 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: -8 }}
                            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                            className="faq2-bubble-container"
                          >
                            <div className="faq2-answer-bubble">
                              <p className="faq2-answer-text">{item.answer}</p>
                              {item.tag && (
                                <div className="faq2-answer-tag">
                                  <Sparkles size={11} />
                                  <span>{item.tag}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Expand / Collapse All Toggle */}
            {FAQ_ITEMS.length > INITIAL_VISIBLE_COUNT && (
              <div className="faq2-more-wrap">
                <button
                  type="button"
                  onClick={handleToggleShowAll}
                  onMouseEnter={playHover}
                  className="faq2-more-btn"
                >
                  <span>
                    {showAll
                      ? 'Tampilkan Lebih Sedikit'
                      : `Lihat Pertanyaan Lainnya (${FAQ_ITEMS.length - INITIAL_VISIBLE_COUNT}+)`}
                  </span>
                  <ChevronDown
                    size={15}
                    style={{
                      transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .faq2-section {
          width: 100%;
          box-sizing: border-box;
          padding: clamp(48px, 7vw, 84px) 24px clamp(36px, 5vw, 60px);
        }

        .faq2-container {
          max-width: 1260px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .faq2-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.75fr);
          gap: clamp(36px, 5vw, 68px);
          align-items: start;
        }

        /* Left Column Sticky Header */
        .faq2-left-col {
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 100px;
          align-self: flex-start;
        }

        .faq2-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 18px;
          width: fit-content;
        }

        .faq2-headline {
          font-size: clamp(2.4rem, 4.2vw, 3.8rem);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.035em;
          line-height: 1.08;
          margin: 0 0 16px;
        }

        .faq2-subtext {
          color: var(--text-muted);
          font-size: clamp(0.92rem, 1.15vw, 1.02rem);
          line-height: 1.62;
          margin: 0 0 28px;
          max-width: 440px;
        }

        .faq2-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .faq2-btn-primary {
          padding: 13px 26px;
          border-radius: 999px;
          background: var(--text);
          color: var(--bg);
          font-weight: 700;
          font-size: 0.92rem;
          border: none;
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 4px 18px var(--shadow-color);
          white-space: nowrap;
        }
        .faq2-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--shadow-color);
        }

        .faq2-btn-secondary {
          padding: 12px 22px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.22s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .faq2-btn-secondary:hover {
          border-color: var(--accent-border);
          color: var(--accent);
          background: var(--surface-2);
          transform: translateY(-2px);
        }
        .faq2-btn-arrow {
          transition: transform 0.2s ease;
        }
        .faq2-btn-secondary:hover .faq2-btn-arrow {
          transform: translateX(4px);
        }

        /* Right Column FAQ Stream */
        .faq2-right-col {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
        }

        .faq2-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .faq2-item {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .faq2-question-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          width: 100%;
        }

        .faq2-question-bubble {
          flex: 1;
          max-width: 86%;
          padding: 13px 22px;
          border-radius: 999px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        .faq2-question-bubble:hover {
          background: var(--surface-3);
          border-color: var(--border-light);
        }
        .faq2-question-bubble.is-active {
          background: var(--accent-dim);
          border-color: var(--accent-border);
          color: var(--accent);
        }

        .faq2-question-text {
          font-size: clamp(0.9rem, 1.1vw, 1rem);
          font-weight: 600;
          line-height: 1.45;
          letter-spacing: -0.01em;
        }

        .faq2-toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.22s ease;
        }
        .faq2-toggle-btn:hover {
          border-color: var(--accent-border);
          color: var(--text);
        }
        .faq2-toggle-btn.is-active {
          border-color: var(--accent-border);
          background: var(--accent-dim);
          color: var(--accent);
        }

        /* Reply Chat Bubble */
        .faq2-answer-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .faq2-bubble-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          width: 100%;
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .faq2-answer-bubble {
          align-self: flex-end;
          margin-left: auto;
          max-width: 86%;
          padding: 15px 22px;
          border-radius: 20px 20px 4px 20px;
          background: var(--accent);
          color: #ffffff;
          box-shadow: 0 8px 24px var(--accent-glow);
          box-sizing: border-box;
        }

        .faq2-answer-text {
          margin: 0;
          font-size: clamp(0.88rem, 1.05vw, 0.96rem);
          line-height: 1.62;
          color: #ffffff;
        }

        .faq2-answer-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.22);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: 0.5px;
        }

        /* Show More Toggle Button */
        .faq2-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 26px;
          width: 100%;
        }

        .faq2-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 999px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px var(--shadow-color);
        }
        .faq2-more-btn:hover {
          border-color: var(--accent-border);
          background: var(--surface-3);
          color: var(--accent);
          transform: translateY(-1px);
        }

        /* Tablet & Mobile Responsiveness */
        @media (max-width: 1023px) {
          .faq2-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .faq2-left-col {
            position: static !important;
            top: auto !important;
          }
          .faq2-headline {
            font-size: 2.5rem !important;
          }
          .faq2-br-desktop {
            display: none;
          }
          .faq2-subtext {
            max-width: 100% !important;
          }
        }

        @media (max-width: 640px) {
          .faq2-section {
            padding: 36px 14px 44px !important;
          }
          .faq2-headline {
            font-size: 2rem !important;
            margin-bottom: 12px !important;
          }
          .faq2-subtext {
            font-size: 0.88rem !important;
            line-height: 1.55 !important;
            margin-bottom: 20px !important;
          }
          .faq2-actions {
            width: 100% !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .faq2-btn-primary,
          .faq2-btn-secondary {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
            padding: 12px 18px !important;
          }
          .faq2-list {
            gap: 14px !important;
          }
          .faq2-question-bubble {
            max-width: 82% !important;
            padding: 10px 16px !important;
          }
          .faq2-question-text {
            font-size: 0.85rem !important;
            line-height: 1.4 !important;
          }
          .faq2-toggle-btn {
            width: 28px !important;
            height: 28px !important;
          }
          .faq2-answer-bubble {
            max-width: 90% !important;
            padding: 12px 16px !important;
            border-radius: 16px 16px 4px 16px !important;
          }
          .faq2-answer-text {
            font-size: 0.84rem !important;
            line-height: 1.55 !important;
          }
        }
      `}</style>
    </section>
  );
}
