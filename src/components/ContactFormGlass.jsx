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
        height: '100%',
      }}
    >
      {/* Background ambient radial lights */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
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
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-2-dim) 0%, transparent 70%)',
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
          borderRadius: '26px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 20px 60px var(--shadow-color)',
          overflow: 'hidden',
          padding: 'clamp(22px, 3.5vw, 42px)',
          height: '100%',
        }}
      >
        {/* Card Header (Clean: No 'Online & Ready' box) */}
        <div
          className="glass-card-header"
          style={{
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              fontWeight: 700,
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
            className="glass-card-title"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Kirim Pesan Langsung
          </h2>
        </div>

        {/* Topic Pills */}
        <div className="glass-topic-wrapper" style={{ marginBottom: '22px' }}>
          <div
            className="glass-topic-label"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--text-dim)',
              marginBottom: '9px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Tag size={12} />
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
                  className="glass-topic-btn"
                  style={{
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: isSelected
                      ? '1px solid var(--accent)'
                      : '1px solid var(--border)',
                    background: isSelected
                      ? 'var(--accent-dim)'
                      : 'var(--surface-2)',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Form Fields */}
        <form onSubmit={handleSubmit} className="glass-form-fields" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 2-Column row: Name & Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label
                htmlFor="contact-name"
                className="glass-field-label"
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '7px',
                }}
              >
                Nama Lengkap *
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '14px',
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
                    padding: '12px 14px 12px 40px',
                    borderRadius: '13px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '13.5px',
                    outline: 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="glass-field-label"
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '7px',
                }}
              >
                Alamat Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '14px',
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
                    padding: '12px 14px 12px 40px',
                    borderRadius: '13px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '13.5px',
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
              className="glass-field-label"
              style={{
                display: 'block',
                fontSize: '11.5px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-muted)',
                marginBottom: '7px',
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
              className="glass-input-no-icon"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '13px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '13.5px',
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
                marginBottom: '7px',
              }}
            >
              <label
                htmlFor="contact-message"
                className="glass-field-label"
                style={{
                  fontSize: '11.5px',
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
                  color: 'var(--text-dim)',
                }}
              >
                {form.message.length} karakter
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Ceritakan tentang proyek, tawaran, atau ide yang ingin Anda diskusikan..."
              required
              className="glass-textarea"
              style={{
                width: '100%',
                padding: '14px 15px',
                borderRadius: '14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '13.5px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                minHeight: '110px',
                transition: 'all 0.25s ease',
                fontFamily: 'inherit',
              }}
            />
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
                  gap: '10px',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>Pesan berhasil terkirim! Terima kasih, Zacky akan segera merespons Anda.</span>
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
                  gap: '10px',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
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
              gap: '9px',
              padding: '14px 28px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: 'none',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px var(--accent-glow)',
              marginTop: '4px',
              overflow: 'hidden',
              transition: 'box-shadow 0.25s ease',
            }}
            className="submit-glass-btn"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <span>Kirim Pesan Sekarang</span>
                <Send size={15} />
              </>
            )}
          </motion.button>
        </form>
      </div>

      <style>{`
        .glass-input:focus,
        .glass-input-no-icon:focus,
        .glass-textarea:focus {
          border-color: var(--accent) !important;
          background: var(--surface) !important;
          box-shadow: 0 0 18px var(--accent-glow) !important;
        }

        .submit-glass-btn:hover {
          box-shadow: 0 12px 36px var(--accent-glow) !important;
        }

        .spin-animation {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile specific responsiveness - sleek, compact, elegant */
        @media (max-width: 640px) {
          .glass-form-wrapper {
            padding: 0 12px !important;
          }
          .glassmorphic-card {
            padding: 20px 16px !important;
            border-radius: 20px !important;
          }
          .glass-card-header {
            padding-bottom: 12px !important;
            margin-bottom: 16px !important;
          }
          .glass-card-title {
            font-size: 1.3rem !important;
          }
          .glass-info-strip {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            margin-bottom: 16px !important;
          }
          .glass-info-item {
            padding: 7px 11px !important;
            font-size: 11.5px !important;
            border-radius: 10px !important;
          }
          .glass-topic-wrapper {
            margin-bottom: 16px !important;
          }
          .glass-topic-label {
            font-size: 10px !important;
            margin-bottom: 7px !important;
          }
          .glass-topic-btn {
            padding: 5px 11px !important;
            font-size: 11px !important;
          }
          .glass-form-fields {
            gap: 13px !important;
          }
          .glass-field-label {
            font-size: 11px !important;
            margin-bottom: 5px !important;
          }
          .glass-input {
            padding: 10px 13px 10px 36px !important;
            font-size: 13px !important;
            border-radius: 11px !important;
          }
          .glass-input-no-icon {
            padding: 10px 13px !important;
            font-size: 13px !important;
            border-radius: 11px !important;
          }
          .glass-textarea {
            padding: 10px 13px !important;
            font-size: 13px !important;
            border-radius: 12px !important;
            min-height: 90px !important;
          }
          .submit-glass-btn {
            padding: 12px 18px !important;
            font-size: 12px !important;
            border-radius: 11px !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
