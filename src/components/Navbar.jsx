import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import ThemeToggle from './ui/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
];

const Navbar = () => {
  const { playClick, playHover, toggleSound, soundEnabled } = useSoundContext();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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
      {/* Desktop nav */}
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
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--bg)',
            letterSpacing: '-0.02em',
          }}>ZA</span>
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
        <button style={iconBtnStyle} onClick={() => { playClick(); toggleSound(); }} title="Toggle sound">
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <ThemeToggle />
      </nav>

      {/* Mobile navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '12px 16px',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
        transition: 'all 0.3s ease',
      }} className="mobile-menu-btn" role="navigation">
        <Link to="/" onClick={() => { playClick(); setIsMobileOpen(false); }} style={{ textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--bg)' }}>ZA</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button style={iconBtnStyle} onClick={() => { playClick(); toggleSound(); }}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <ThemeToggle />
          <button
            style={{ ...iconBtnStyle, color: 'var(--text)' }}
            onClick={() => { playClick(); setIsMobileOpen(!isMobileOpen); }}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              background: 'var(--bg)',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {NAV_ITEMS.map(({ label, path }, i) => {
              const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
              return (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={path}
                    onClick={() => { playClick(); setIsMobileOpen(false); }}
                    style={{
                      display: 'block',
                      padding: '16px 0',
                      fontSize: '24px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: isActive ? 'var(--accent)' : 'var(--text)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;