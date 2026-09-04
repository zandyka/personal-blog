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
          style={{
            textAlign: 'center',
            padding: 'clamp(40px, 8vh, 72px) 20px 24px',
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
              background: 'rgba(255, 59, 29, 0.1)',
              border: '1px solid rgba(255, 59, 29, 0.28)',
              color: 'var(--accent)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
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
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Let's Start a{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF3B1D 0%, #FFAA00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Conversation.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              margin: '0 auto',
              maxWidth: '620px',
            }}
          >
            Punya proyek menarik, peluang karir, atau ingin berkolaborasi? Pilih channel favorit Anda di bawah atau kirim transmisi pesan langsung.
          </p>
        </div>

        {/* Section 1: Animated Moving Social Marquee (Dual-row cards matching screenshot) */}
        <SocialMarquee />

        {/* Section 2: Glassmorphic Direct Transmission Form */}
        <div style={{ marginTop: '28px' }}>
          <ContactFormGlass />
        </div>
      </motion.div>
    </div>
  );
}
