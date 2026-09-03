import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Instagram, Mail, Heart } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import InfiniteMarquee from './ui/InfiniteMarquee';

const MARQUEE_ITEMS = [
  'Open to Opportunities',
  'Web Development',
  'Mobile Development',
  'Banking Operations',
  'UI/UX Design',
  'Problem Solving',
  'System Optimization',
];

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
];

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/zandyka', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/zacky-andyka/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/zandyka._/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:zackyandyka1@gmail.com', label: 'Email' },
];

const Footer = () => {
  const { playClick, playHover } = useSoundContext();
  const location = useLocation();
  const year = new Date().getFullYear();

  const isHomePage = location.pathname === '/';

  return (
    <footer style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Marquee ribbon */}
      <InfiniteMarquee items={MARQUEE_ITEMS} speed={35} />

      {/* CTA Section — Homepage only */}
      {isHomePage && (
        <div style={{
          padding: 'clamp(60px, 10vh, 120px) 24px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            Let's Work{' '}
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Together</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              maxWidth: '480px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Have a project in mind? Let's build something extraordinary that solves real problems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/about"
              onClick={playClick}
              onMouseEnter={playHover}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '999px',
                background: 'var(--accent)', color: 'var(--bg)',
                fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}
            >
              Hire Me <ArrowUpRight size={14} />
            </Link>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '999px',
                background: 'transparent', color: 'var(--text)',
                fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                border: '1px solid var(--border)',
              }}
            >
              View Resume
            </a>
          </motion.div>
        </div>
      )}

      {/* Footer Content */}
      <div className="footer-main-container">
        {/* Brand Icon */}
        <div className="footer-brand-col">
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            overflow: 'hidden', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '12px',
            background: 'var(--surface-2)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}>
            <img
              src="/icon.png"
              alt="Zacky Andyka Icon"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
            Building digital solutions with passion and precision.
          </p>
        </div>

        {/* Links & Socials Split with Center Divider Line */}
        <div className="footer-nav-socials-wrapper">
          {/* Links */}
          <div className="footer-links-col">
            <h4 className="font-mono" style={{
              fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              LINKS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={playClick}
                  onMouseEnter={playHover}
                  style={{
                    fontSize: '0.88rem', color: 'var(--text-muted)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="footer-socials-col">
            <h4 className="font-mono" style={{
              fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              SOCIALS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={playClick}
                  onMouseEnter={playHover}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '0.88rem', color: 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={15} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Local time */}
        <div className="footer-time-col">
          <h4 className="font-mono" style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px',
          }}>
            LOCAL TIME
          </h4>
          <p className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: true,
            })}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
            Jakarta (WIB), UTC+7
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
        fontSize: '0.75rem', color: 'var(--text-dim)',
      }}>
        <span>&copy; {year} Zacky Andyka. Made with</span>
        <Heart size={12} style={{ color: 'var(--accent)' }} fill="var(--accent)" />
      </div>

      <style>{`
        .footer-main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
          display: grid;
          grid-template-columns: 1.4fr 2fr 1fr;
          gap: 40px;
          align-items: flex-start;
        }
        .footer-nav-socials-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }
        .footer-links-col {
          border-right: 1px solid var(--border);
          padding-right: 28px;
        }
        .footer-socials-col {
          padding-left: 8px;
        }

        @media (max-width: 768px) {
          .footer-main-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 28px !important;
            padding: 32px 20px !important;
          }
          .footer-nav-socials-wrapper {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0 !important;
            width: 100% !important;
          }
          .footer-links-col {
            border-right: 1px solid var(--border) !important;
            padding-right: 20px !important;
          }
          .footer-socials-col {
            padding-left: 20px !important;
          }
          .footer-time-col {
            width: 100% !important;
            max-width: 220px !important;
            background: var(--surface) !important;
            border: 1px solid var(--border) !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;