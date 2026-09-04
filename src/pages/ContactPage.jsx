import { motion } from 'framer-motion';
import SocialMarquee from '../components/ui/SocialMarquee';
import ContactFormGlass from '../components/ContactFormGlass';

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
            padding: 'clamp(28px, 6vh, 60px) 20px 16px',
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
            Punya proyek menarik, peluang karir, atau ingin berkolaborasi? Pilih channel favorit Anda di bawah atau kirim transmisi pesan langsung.
          </p>
        </div>

        {/* Section 1: Animated Moving Social Marquee (Dual-row cards matching screenshot) */}
        <SocialMarquee />

        {/* Section 2: Glassmorphic Direct Transmission Form */}
        <div style={{ marginTop: '16px' }}>
          <ContactFormGlass />
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .contact-hero-header {
            padding: 24px 16px 8px !important;
          }
          .contact-hero-header h1 {
            font-size: 1.95rem !important;
            margin-bottom: 10px !important;
          }
          .contact-hero-header p {
            font-size: 0.88rem !important;
            line-height: 1.5 !important;
          }
        }
      `}</style>
    </div>
  );
}
