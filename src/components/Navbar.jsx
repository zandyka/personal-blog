import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import ThemeToggle from './ui/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'About', path: '/about', icon: User },
  { label: 'Experience', path: '/experience', icon: Briefcase },
  { label: 'Projects', path: '/projects', icon: FolderGit2 },
  { label: 'Skills', path: '/skills', icon: Cpu },
];

const DockButton = ({ to, icon: Icon, label, isActive, onClick, onHover }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onHover}
      title={label}
      aria-label={label}
      style={{
        position: 'relative',
        textDecoration: 'none',
        display: 'inline-flex',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className="dock-circle-btn"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: isActive ? 'var(--accent-dim)' : 'rgba(255, 255, 255, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          position: 'relative',
          transition: 'border-color 0.2s, background 0.2s, color 0.2s',
        }}
      >
        <Icon size={17} />

        {/* Glowing Active Dot Indicator matching reference image */}
        {isActive && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

const Navbar = () => {
  const { playClick, playHover, toggleSound, soundEnabled } = useSoundContext();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle = {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 8px',
    borderRadius: '999px',
    background: scrolled ? 'var(--glass-bg)' : 'transparent',
    backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
    border: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
    boxShadow: scrolled ? '0 8px 32px var(--shadow-color)' : 'none',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    maxWidth: '680px',
  };

  const linkStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
    background: isActive ? 'var(--accent-dim)' : 'transparent',
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  });

  const iconBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'color 0.2s',
    flexShrink: 0,
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav style={navStyle} className="desktop-nav">
        {/* Logo */}
        <Link
          to="/"
          onClick={playClick}
          onMouseEnter={playHover}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            marginRight: '4px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--bg)',
              letterSpacing: '-0.02em',
            }}
          >
            ZA
          </span>
        </Link>

        {/* Links */}
        {NAV_ITEMS.map(({ label, path }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              style={linkStyle(isActive)}
              onClick={playClick}
              onMouseEnter={playHover}
            >
              {label}
            </Link>
          );
        })}

        {/* Utils */}
        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />
        <button
          style={iconBtnStyle}
          onClick={() => {
            playClick();
            toggleSound();
          }}
          title="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <ThemeToggle />
      </nav>

      {/* Mobile Top Minimal Brand Bar */}
      <header className="mobile-top-bar">
        <Link to="/" onClick={playClick} style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--accent-glow)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--bg)' }}>ZA</span>
          </div>
        </Link>

        <button
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            playClick();
            toggleSound();
          }}
          title="Toggle Sound"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </header>

      {/* Mobile Floating Bottom Dock Navbar (Pixel-perfect to reference image) */}
      <nav className="mobile-dock-nav" role="navigation" aria-label="Mobile Navigation">
        {/* Item 1: Home */}
        <DockButton
          to="/"
          icon={Home}
          label="Home"
          isActive={location.pathname === '/'}
          onClick={playClick}
          onHover={playHover}
        />

        {/* Item 2: About */}
        <DockButton
          to="/about"
          icon={User}
          label="About"
          isActive={location.pathname.startsWith('/about')}
          onClick={playClick}
          onHover={playHover}
        />

        {/* Divider 1 */}
        <div className="dock-divider" />

        {/* Item 3: Experience */}
        <DockButton
          to="/experience"
          icon={Briefcase}
          label="Experience"
          isActive={location.pathname.startsWith('/experience')}
          onClick={playClick}
          onHover={playHover}
        />

        {/* Item 4: Projects */}
        <DockButton
          to="/projects"
          icon={FolderGit2}
          label="Projects"
          isActive={location.pathname.startsWith('/projects')}
          onClick={playClick}
          onHover={playHover}
        />

        {/* Item 5: Skills */}
        <DockButton
          to="/skills"
          icon={Cpu}
          label="Skills"
          isActive={location.pathname.startsWith('/skills')}
          onClick={playClick}
          onHover={playHover}
        />

        {/* Divider 2 */}
        <div className="dock-divider" />

        {/* Item 6: Contact / Mail */}
        <motion.a
          href="mailto:zackyandyka1@gmail.com"
          onClick={playClick}
          onMouseEnter={playHover}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className="dock-circle-btn"
          title="Contact Email"
          aria-label="Contact Email"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <Mail size={17} />
        </motion.a>

        {/* Item 7: Theme Toggle */}
        <div className="dock-theme-wrapper">
          <ThemeToggle />
        </div>
      </nav>

      <style>{`
        .mobile-top-bar {
          display: none;
        }
        .mobile-dock-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }

          /* Mobile Top Bar */
          .mobile-top-bar {
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999;
            padding: 12px 18px;
            align-items: center;
            justifyContent: space-between;
            background: transparent;
            transition: all 0.3s ease;
          }

          /* Mobile Floating Dock Navbar */
          .mobile-dock-nav {
            display: flex !important;
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 9999px;
            background: var(--surface);
            border: 1px solid var(--border);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            max-width: 94vw;
            white-space: nowrap;
          }

          .dock-divider {
            width: 1px;
            height: 18px;
            background: var(--border);
            margin: 0 2px;
            flex-shrink: 0;
          }

          .dock-theme-wrapper button {
            width: 38px !important;
            height: 38px !important;
            border: 1px solid var(--border) !important;
            background: rgba(255, 255, 255, 0.03) !important;
          }
        }

        @media (max-width: 380px) {
          .mobile-dock-nav {
            gap: 4px !important;
            padding: 5px 8px !important;
            bottom: 14px !important;
          }
          .dock-circle-btn {
            width: 32px !important;
            height: 32px !important;
          }
          .dock-circle-btn svg {
            width: 14px !important;
            height: 14px !important;
          }
          .dock-theme-wrapper button {
            width: 32px !important;
            height: 32px !important;
          }
          .dock-theme-wrapper button svg {
            width: 14px !important;
            height: 14px !important;
          }
          .dock-divider {
            height: 14px !important;
            margin: 0 1px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;