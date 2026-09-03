import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Instagram, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useSoundContext } from './ui/SoundProvider';

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'zackyandyka1@gmail.com',
    href: 'mailto:zackyandyka1@gmail.com',
    color: '#EA4335',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/zacky-andyka',
    href: 'https://www.linkedin.com/in/zacky-andyka/',
    color: '#0A66C2',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@zandyka._',
    href: 'https://www.instagram.com/zandyka._/',
    color: '#E1306C',
  },
];

export default function Contact() {
  const { playClick, playHover, playSuccess } = useSoundContext();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    setErrorMessage('');
    playClick();

    try {
      // Direct send to Zacky's Gmail via FormSubmit AJAX (no app opened, sent directly over HTTPS)
      const res = await fetch('https://formsubmit.co/ajax/zackyandyka1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `New Message from ${form.name} via Portfolio`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await res.json();

      if (res.ok || data.success === 'true' || data.success === true) {
        playSuccess();
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.message || 'Failed to send');
      }
    } catch (err) {
      console.error('Send error:', err);
      // Fallback: in case of offline/network block, offer mailto
      setStatus('error');
      setErrorMessage('Direct transmission failed. You can also send directly via email link.');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  };

  return (
    <section id="contact" style={{ padding: '90px 0', background: 'var(--bg)', position: 'relative' }}>
      <div className="container" ref={ref}>
        {/* Section Header */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '48px', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Get In Touch
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Contact Me
          </h2>
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Punya pertanyaan, tawaran kerja, atau proyek kolaborasi? Kirim pesan langsung ke email saya di bawah ini.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left: Contact Info Cards */}
          <motion.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                width: 'fit-content',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'pulse-glow 2s infinite',
                }}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.5px' }}>
                Open for Opportunities
              </span>
            </div>

            {CONTACT_LINKS.map(({ icon: Icon, label, value, href, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                whileHover={{ x: 4, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '11px',
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} style={{ color }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text)',
                      fontWeight: 500,
                      marginTop: '2px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Direct Send Message Form */}
          <motion.div
            {...fadeUp(0.18)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              padding: '28px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Kirim Pesan Langsung</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  fontWeight: 600,
                }}
              >
                Auto-Send
              </span>
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-2)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-2-dim)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Alamat Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="email@anda.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent-2)';
                      e.target.style.boxShadow = '0 0 0 3px var(--accent-2-dim)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Pesan
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Tulis pesan Anda di sini..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-2)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-2-dim)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                />
              </div>

              {/* Status Notice */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#22c55e',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Pesan berhasil dikirim langsung ke zackyandyka1@gmail.com!</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{errorMessage || 'Gagal mengirim. Silakan coba kembali.'}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: status === 'sending' ? 1 : 1.02, y: status === 'sending' ? 0 : -1 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: status === 'success' ? '#22c55e' : 'var(--accent-2)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                  transition: 'background-color 0.25s, opacity 0.2s',
                  opacity: status === 'sending' ? 0.8 : 1,
                  marginTop: '4px',
                }}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Mengirim Pesan...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Terkirim!</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Kirim Pesan Sekarang</span>
                  </>
                )}
              </motion.button>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0' }}>
                Pesan akan langsung diteruskan ke inbox Gmail tanpa membuka aplikasi eksternal.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}