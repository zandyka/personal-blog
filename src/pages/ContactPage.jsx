import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SocialMarquee from '../components/ui/SocialMarquee';
import ContactFormGlass from '../components/ContactFormGlass';
import ContactFAQ from '../components/ContactFAQ';
import ProfileAIChatbox from '../components/ProfileAIChatbox';

export default function ContactPage() {
  return (
    <div className="page-container" style={{ paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%' }}
      >
        {/* Page Hero Header */}
        <div
          className="contact-hero-header"
          style={{
            textAlign: 'center',
            padding: 'clamp(28px, 5vh, 50px) 20px 24px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
              }}
            />
            GET IN TOUCH
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              marginBottom: '14px',
              color: 'var(--text)',
            }}
          >
            Let's Start a{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Conversation.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: '0 auto',
              maxWidth: '600px',
            }}
          >
            Punya proyek menarik, peluang karir, atau ingin berkolaborasi? Pilih channel favorit Anda, kirim pesan langsung, atau tanyakan profil saya via asisten AI.
          </p>
        </div>

        {/* Laptop Side-by-Side Grid: Moving Socials (Left) & Direct Transmission Form (Right) */}
        <div className="contact-main-split-grid">
          {/* Left Column: Moving Social Contacts Panel */}
          <div className="contact-grid-col-left">
            <div
              className="glassmorphic-card contact-social-card"
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              {/* Background ambient radial lights */}
              <div
                style={{
                  position: 'absolute',
                  top: '15%',
                  right: '10%',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              {/* Panel Header */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
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
                  CHANNELS &amp; NETWORKS
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
                    fontWeight: 800,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Koneksi Media Sosial
                </h2>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: '0.86rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  Hubungi saya secara langsung melalui media sosial, repositori kode, atau channel musik aktif di bawah ini.
                </p>
              </div>

              {/* Center: Moving Social Cards Track */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  margin: '4px 0',
                  overflow: 'hidden',
                }}
              >
                <SocialMarquee compact={true} />
              </div>

              {/* Panel Footer */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                    Available for Work &bull; Respon Cepat
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                  Kota Medan &bull; WIB (UTC+7)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Transmission Form */}
          <div className="contact-grid-col-right">
            <ContactFormGlass />
          </div>
        </div>

        {/* Section 3: Interactive Ask Zacky AI Profile Chatbox */}
        <div style={{ marginTop: '36px', borderTop: '1px solid var(--border)' }}>
          <ProfileAIChatbox />
        </div>

        {/* Section 4: Interactive Frequently Asked Questions */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <ContactFAQ />
        </div>
      </motion.div>

      <style>{`
        .contact-main-split-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 28px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 24px;
          align-items: stretch;
        }

        .contact-grid-col-left,
        .contact-grid-col-right {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1023px) {
          .contact-main-split-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 0 16px !important;
          }
          .contact-social-card {
            padding: 24px 20px !important;
          }
        }

        @media (max-width: 640px) {
          .contact-hero-header {
            padding: 24px 16px 14px !important;
          }
          .contact-hero-header h1 {
            font-size: 1.95rem !important;
            margin-bottom: 10px !important;
          }
          .contact-hero-header p {
            font-size: 0.88rem !important;
            line-height: 1.5 !important;
          }
          .contact-main-split-grid {
            padding: 0 12px !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}