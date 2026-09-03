import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SkillsTypography = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(44px, 6vh, 64px) 0',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        {/* Big typography quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(20px, 3vh, 32px)' }}
        >
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>&ldquo; </span>
            Web Development &amp; Design.
            <br />
            <span style={{ color: 'var(--accent)' }}>Mobile Apps.</span>
            <br />
            <span style={{
              color: 'var(--accent-2)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}>
              reliable banking
              <br />
              operations
            </span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>.</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>&rdquo;</span>
          </h2>
        </motion.div>

        {/* 3-column description grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
          }}
        >
          {/* Column 1 - Personal */}
          <div>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              I build digital solutions across{' '}
              <em style={{ color: 'var(--text)', fontStyle: 'italic', fontWeight: 600 }}>web</em>{' '}
              and{' '}
              <em style={{ color: 'var(--text)', fontStyle: 'italic', fontWeight: 600 }}>mobile platforms</em>{' '}
              that deliver measurable impact at scale.
            </p>
          </div>

          {/* Column 2 - Scope */}
          <div>
            <h4 className="font-mono" style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              SCOPE & PLATFORM
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              Focusing on responsive web apps, cross-platform mobile development with Flutter, and backend systems designed for production environments and operational efficiency.
            </p>
          </div>

          {/* Column 3 - Integration */}
          <div>
            <h4 className="font-mono" style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              INTEGRATION
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              Beyond code, I integrate operational workflows from banking and administrative environments, bringing structured process thinking to every digital solution.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsTypography;