import { motion } from 'framer-motion';
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
            Punya proyek menarik, peluang karir, atau ingin berkolaborasi? Kirim pesan langsung di bawah, pilih channel favorit Anda, atau tanyakan profil saya via asisten AI.
          </p>
        </div>

        {/* Laptop Side-by-Side Grid: Direct Transmission (Left) & Moving Socials (Right) */}
        <div className="contact-main-split-grid">
          {/* Left Column: Direct Transmission Form */}
          <div className="contact-grid-col-left">
            <ContactFormGlass />
          </div>

          {/* Right Column: Moving Social Contacts Panel */}
          <div className="contact-grid-col-right">
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
                padding: 'clamp(20px, 3vw, 32px) 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: '440px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Background ambient radial lights */}
              <div
                style={{
                  position: 'absolute',
                  top: '20%',
                  right: '15%',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              {/* Moving Social Cards Track (Clean: No extra text banners) */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                }}
              >
                <SocialMarquee compact={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Ask Zacky AI Profile Chatbox */}
        <div style={{ marginTop: '36px', borderTop: '1px solid var(--border)', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <ProfileAIChatbox />
        </div>

        {/* Section 4: Interactive Frequently Asked Questions */}
        <div style={{ borderTop: '1px solid var(--border)', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <ContactFAQ />
        </div>
      </motion.div>

      <style>{`
        .contact-main-split-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 28px;
          max-width: 1260px;
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 0 24px;
          align-items: stretch;
          overflow: hidden;
        }

        .contact-grid-col-left,
        .contact-grid-col-right {
          height: 100%;
          display: flex;
          flex-direction: column;
          min-width: 0;
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 1023px) {
          .contact-main-split-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 24px !important;
            padding: 0 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .contact-grid-col-left,
          .contact-grid-col-right {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }
          .contact-social-card {
            padding: 20px 0 !important;
            min-height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
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
            gap: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .contact-social-card {
            padding: 16px 0 !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}