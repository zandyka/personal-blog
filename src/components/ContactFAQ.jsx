import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Briefcase,
  Layers,
  Send,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const FAQ_ITEMS = [
  {
    id: 'relocation',
    category: 'career',
    question: 'Apakah Anda bersedia relokasi atau bekerja on-site di luar kota Medan (misal: Jakarta)?',
    answer:
      'Ya, sangat bersedia! Saya sangat terbuka untuk kesempatan kerja On-Site, Hybrid, maupun Remote di kota-kota besar seperti Jakarta, Bandung, Surabaya, atau lokasi lainnya untuk peluang karir profesional yang tepat.',
    tag: 'Relokasi & Mobilitas',
  },
  {
    id: 'notice-period',
    category: 'career',
    question: 'Kapan Anda bisa mulai bergabung (Notice Period)?',
    answer:
      'Saya berstatus "Available Immediately" (siap bergabung dan mulai bekerja secepatnya). Saya telah menyelesaikan seluruh kewajiban studi akademis di Universitas Sumatera Utara dengan predikat Cum Laude (IPK 3.84).',
    tag: 'Ketersediaan Kerja',
  },
  {
    id: 'roles',
    category: 'career',
    question: 'Posisi atau peran apa yang paling Anda minati dan kuasai?',
    answer:
      'Fokus utama saya terbagi ke dalam tiga domain utama: (1) Software Engineer / Full-Stack Web Developer (React.js, Laravel, REST API), (2) Banking Operations & IT Support Specialist (rekonsiliasi data, audit kepatuhan, pemeliharaan sistem), dan (3) Data Analytics & BI Reporting.',
    tag: 'Spesialisasi Karir',
  },
  {
    id: 'freelance',
    category: 'service',
    question: 'Apakah Anda menerima proyek freelance di bidang Web, Fotografi, atau Desain?',
    answer:
      'Tentu saja! Selain pengembangan sistem software, saya aktif menerima proyek komersial untuk: (1) Pembuatan web & landing page kustom, (2) Fotografi produk komersial & liputan dokumentasi event, dan (3) Desain identitas visual (banner, lanyard, kartu identitas, dan media cetak).',
    tag: 'Jasa & Kolaborasi',
  },
  {
    id: 'contact-speed',
    category: 'service',
    question: 'Berapa lama estimasi respon jika saya mengirimkan pesan atau penawaran?',
    answer:
      'Saya rutin memantau kotak masuk email dan pesan WhatsApp. Untuk komunikasi profesional melalui email (zackyandyka1@gmail.com) atau LinkedIn, saya biasanya merespon dalam kurun waktu kurang dari 24 jam di hari kerja.',
    tag: 'Respon & Komunikasi',
  },
];

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Semua Pertanyaan' },
  { id: 'career', label: 'Karier & Rekrutmen' },
  { id: 'service', label: 'Proyek & Layanan' },
];

export default function ContactFAQ() {
  const { playClick, playHover } = useSoundContext();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState('relocation');

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleAccordion = (id) => {
    playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={ref}
      style={{
        padding: '64px 20px 20px',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '32px' }}
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
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            margin: '0 0 10px',
          }}
        >
          Pertanyaan yang Sering Diajukan
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.94rem',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Jawaban ringkas dan lugas seputar kesiapan kerja, mobilitas lokasi, spesialisasi teknis, dan alur kolaborasi proyek.
        </p>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: '20px',
          }}
        >
          {FAQ_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat.id);
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
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredFaqs.map((faq, idx) => {
          const isExpanded = expandedId === faq.id;

          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
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
                onClick={() => toggleAccordion(faq.id)}
                onMouseEnter={playHover}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: isExpanded ? 'var(--accent)' : 'var(--text-dim)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(0.92rem, 1.2vw, 1.02rem)',
                      fontWeight: 700,
                      color: isExpanded ? 'var(--accent)' : 'var(--text)',
                      transition: 'color 0.2s ease',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </span>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
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
                  <ChevronDown size={16} />
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
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 20px 18px 56px',
                        borderTop: '1px dashed var(--border)',
                        paddingTop: '14px',
                      }}
                    >
                      <p
                        style={{
                          margin: '0 0 10px',
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem',
                          lineHeight: 1.65,
                        }}
                      >
                        {faq.answer}
                      </p>
                      <span
                        style={{
                          fontSize: '11px',
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
      </div>
    </section>
  );
}