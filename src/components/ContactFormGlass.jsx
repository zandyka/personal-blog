import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Mail,
  User,
  MessageSquare,
  Tag,
  Clock,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const SUBJECT_TOPICS = [
  { label: '💼 Tawaran Kerja', subject: 'Tawaran Kerja / Rekrutmen' },
  { label: '🚀 Kolaborasi Proyek', subject: 'Kolaborasi Proyek Software/Web' },
  { label: '☕ Diskusi Santai', subject: 'Diskusi & Networking' },
  { label: '🎨 Jasa Desain Grafis', subject: 'Inquiry Desain Grafis & Brand' },
];

export default function ContactFormGlass() {
  const { playClick, playHover, playSuccess } = useSoundContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const selectTopic = (subj) => {
    playClick();
    setForm((p) => ({ ...p, subject: subj }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    setErrorMessage('');
    playClick();

    try {
      // Direct send to Zacky's Gmail via FormSubmit AJAX
      const res = await fetch('https://formsubmit.co/ajax/zackyandyka1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || 'New Message from Contact Page',
          message: form.message,
          _subject: `[Contact Page] ${form.subject || 'Direct Message'} from ${form.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await res.json();

      if (res.ok || data.success === 'true' || data.success === true) {
        playSuccess();
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 7000);
      } else {
        throw new Error(data.message || 'Transmission failed');
      }
    } catch (err) {
      console.error('Send error:', err);
      setStatus('error');
      setErrorMessage('Pengiriman langsung gagal. Anda tetap dapat mengirim via email ke zackyandyka1@gmail.com.');
    }
  };

  return (
    <div
      className="glass-form-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      {/* Background ambient radial lights to give true glass refraction */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 59, 29, 0.22) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 170, 0, 0.18) 0%, transparent 70%)',
          filter: 'blur(54px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Glassmorphic Card Container */}
      <div
        className="glassmorphic-card"
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '28px',
          background: 'rgba(15, 15, 21, 0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          padding: 'clamp(28px, 4vw, 48px)',
        }}
      >
        {/* Card Header & Live Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '20px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={13} />
              DIRECT TRANSMISSION
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Kirim Pesan Langsung
            </h2>
          </div>

          {/* Online status indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '7px 16px',
              borderRadius: '999px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#22c55e',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 10px #22c55e',
              }}
            />
            STATUS: ONLINE &amp; READY
          </div>
        </div>

        {/* Quick Info Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12.5px',
              color: 'var(--text-muted)',
            }}
          >
            <MapPin size={15} style={{ color: 'var(--accent)' }} />
            <span>Medan, Indonesia (GMT+7)</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12.5px',
              color: 'var(--text-muted)',
            }}
          >
            <Clock size={15} style={{ color: 'var(--accent)' }} />
            <span>Waktu Respons: &lt; 24 Jam</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12.5px',
              color: 'var(--text-muted)',
            }}
          >
            <Briefcase size={15} style={{ color: 'var(--accent)' }} />
            <span>Freelance / Full-time Role</span>
          </div>
        </div>

        {/* Topic Pills */}
        <div style={{ marginBottom: '26px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--text-dim)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Tag size={13} />
            PILIH TOPIK PESAN (OPSIONAL)
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {SUBJECT_TOPICS.map((t) => {
              const isSelected = form.subject === t.subject;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => selectTopic(t.subject)}
                  onMouseEnter={playHover}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    border: isSelected
                      ? '1px solid var(--accent)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected
                      ? 'rgba(255, 59, 29, 0.16)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(255, 59, 29, 0.25)' : 'none',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 2-Column row: Name & Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
            }}
          >
            <div>
              <label
                htmlFor="contact-name"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                Nama Lengkap *
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                />
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: John Doe"
                  required
                  className="glass-input"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-email"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                Alamat Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                />
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                  className="glass-input"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="contact-subject"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Subjek Pesan
            </label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Contoh: Inquiry Proyek Aplikasi Web"
              className="glass-input"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.25s ease',
              }}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label
                htmlFor="contact-message"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                }}
              >
                Isi Pesan *
              </label>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-dim)',
                }}
              >
                {form.message.length} karakter
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Ceritakan tentang proyek, pertanyaan, atau ide yang ingin Anda diskusikan..."
                required
                className="glass-input"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '130px',
                  transition: 'all 0.25s ease',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Feedback messages */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span>Pesan berhasil terkirim! Terima kasih, Zacky akan segera membaca dan merespons pesan Anda.</span>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={status === 'sending'}
            onMouseEnter={playHover}
            whileHover={{ scale: status === 'sending' ? 1 : 1.015 }}
            whileTap={{ scale: status === 'sending' ? 1 : 0.985 }}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 32px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FF3B1D 0%, #FFAA00 100%)',
              color: '#070709',
              fontSize: '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: 'none',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 30px rgba(255, 59, 29, 0.32)',
              marginTop: '8px',
              overflow: 'hidden',
              transition: 'box-shadow 0.25s ease',
            }}
            className="submit-glass-btn"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={18} className="spin-animation" />
                <span>Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <span>Kirim Pesan Sekarang</span>
                <Send size={16} />
              </>
            )}
          </motion.button>
        </form>
      </div>

      <style>{`
        .glass-input:focus {
          border-color: var(--accent) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 20px rgba(255, 59, 29, 0.22) !important;
        }

        .submit-glass-btn:hover {
          box-shadow: 0 14px 40px rgba(255, 59, 29, 0.45) !important;
        }

        .spin-animation {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
