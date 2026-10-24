import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import { useTheme } from '../hooks/useTheme';
import GradientWaves from './ui/GradientWaves';
import { scrollToDirectMessage } from '../utils/scrollHelper';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Projects', path: '/projects' },
  { label: 'Album Gallery', path: '/album' },
  { label: 'Playground', path: '/playground' },
  { label: 'Contact', path: '/contact' },
];

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/zandyka', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/zacky-andyka/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/zandyka._/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:zackyandyka1@gmail.com', label: 'Email' },
];

const Footer = () => {
  const { playClick, playHover } = useSoundContext();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const isDark = theme === 'dark';
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/about';
  const isAboutDark = isAboutPage && isDark;

  const handleHireMeClick = (e) => {
    e.preventDefault();
    playClick();
    navigate('/contact');
  };

  return (
    <footer
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
        minHeight: isAboutPage ? 'clamp(540px, 72vh, 660px)' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isAboutPage ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Background Gradient Waves */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: isAboutDark ? 1 : 0.65,
        }}
      >
        <GradientWaves
          horizonColor={isDark ? '#121214' : '#e4e4e7'}
          waveColor={isDark ? '#3f3f46' : '#cbd5e1'}
          crestColor={isDark ? '#f4f4f5' : '#ffffff'}
          backgroundColor="transparent"
          speed={0.2}
          amplitude={isAboutPage ? 2.6 : 2.0}
          relief={isAboutPage ? 1.0 : 0.8}
          lightAngle={130}
          mouseInteraction={true}
          swellOnClick={false}
          waveScale={isAboutPage ? 0.38 : 0.45}
          swell={28}
          turbulence={14}
          lightMode={!isDark}
          grain={0.22}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* CTA Section — Homepage only */}
        {isHomePage && (
          <div
            style={{
              padding: 'clamp(60px, 10vh, 120px) 24px',
              textAlign: 'center',
              borderBottom: '1px solid var(--border)',
            }}
          >
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
              <button
                onClick={handleHireMeClick}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Hire Me <ArrowUpRight size={14} />
              </button>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '999px',
                  background: 'transparent',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--border)',
                }}
              >
                View Resume
              </a>
            </motion.div>
          </div>
        )}

        {/* Footer Content */}
        <div className={`footer-main-container ${isAboutPage ? 'footer-about-container' : ''}`}>
          {/* Brand Icon */}
          <div className="footer-brand-col">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                background: 'var(--surface-2)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
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
            <p
              className={isAboutDark ? 'footer-dark-badge-text' : ''}
              style={{
                fontSize: '0.82rem',
                color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '280px',
              }}
            >
              Building digital solutions with passion and precision.
            </p>
          </div>

          {/* Links & Socials Split with Center Divider Line */}
          <div className="footer-nav-socials-wrapper">
            {/* Links */}
            <div className="footer-links-col">
              <h4
                className={`font-mono ${isAboutDark ? 'footer-dark-badge-header' : ''}`}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: isAboutDark ? '12px' : '16px',
                }}
              >
                LINKS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isAboutDark ? '8px' : '10px' }}>
                {NAV_LINKS.map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className={isAboutDark ? 'footer-dark-badge-link' : ''}
                    style={{
                      fontSize: '0.88rem',
                      color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="footer-socials-col">
              <h4
                className={`font-mono ${isAboutDark ? 'footer-dark-badge-header' : ''}`}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: isAboutDark ? '12px' : '16px',
                }}
              >
                SOCIALS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isAboutDark ? '8px' : '10px' }}>
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className={isAboutDark ? 'footer-dark-badge-link' : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.88rem',
                      color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
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
            <h4
              className={`font-mono ${isAboutDark ? 'footer-dark-badge-header' : ''}`}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isAboutDark ? '#a1a1aa' : 'var(--text-muted)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: isAboutDark ? '10px' : '14px',
              }}
            >
              LOCAL TIME
            </h4>
            <div style={{ marginBottom: isAboutDark ? '6px' : '4px' }}>
              <p
                className={`font-mono ${isAboutDark ? 'footer-dark-badge-time' : ''}`}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isAboutDark ? '#ffffff' : 'var(--text)',
                  margin: 0,
                }}
              >
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Asia/Jakarta',
                  hour12: true,
                })}
              </p>
            </div>
            <div>
              <p
                className={isAboutDark ? 'footer-dark-badge-sub' : ''}
                style={{
                  fontSize: '0.8rem',
                  color: isAboutDark ? '#a1a1aa' : 'var(--text-dim)',
                  margin: 0,
                }}
              >
                Jakarta (WIB), UTC+7
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
          }}
        >
          <span>&copy; {year} Zacky Andyka &bull; Portfolio</span>
        </div>
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
        .footer-about-container {
          padding-top: clamp(160px, 24vh, 280px) !important;
          padding-bottom: 48px !important;
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

        /* Dark Mode Badge Styling (specifically for About Page in Dark Mode) */
        .footer-dark-badge-text {
          background: #222222 !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          display: inline-block !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
        }
        .footer-dark-badge-header {
          background: #222222 !important;
          border-radius: 4px !important;
          padding: 3px 8px !important;
          display: inline-block !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
        }
        .footer-dark-badge-link {
          background: #222222 !important;
          border-radius: 4px !important;
          padding: 3px 8px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          width: fit-content !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
          transition: all 0.2s ease !important;
        }
        .footer-dark-badge-link:hover {
          background: #2e2e34 !important;
          color: #ffffff !important;
        }
        .footer-dark-badge-time {
          background: #222222 !important;
          border-radius: 4px !important;
          padding: 4px 10px !important;
          display: inline-block !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
        }
        .footer-dark-badge-sub {
          background: #222222 !important;
          border-radius: 4px !important;
          padding: 3px 8px !important;
          display: inline-block !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
        }

        @media (max-width: 768px) {
          .footer-main-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 28px !important;
            padding: 32px 20px !important;
          }
          .footer-about-container {
            padding-top: clamp(120px, 18vh, 180px) !important;
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
            display: block !important;
            background: transparent !important;
            border: none !important;
            padding: 4px 0 0 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
