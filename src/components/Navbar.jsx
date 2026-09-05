import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Mail,
  Volume2,
  VolumeX,
  ChevronDown,
  Cat,
  PawPrint,
  Image,
} from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import ThemeToggle from './ui/ThemeToggle';
import { usePet } from '../hooks/usePet';
import { scrollToDirectMessage } from '../utils/scrollHelper';

const ABOUT_DROPDOWN = [
  { label: 'About Me', path: '/about', icon: User },
  { label: 'Experience', path: '/experience', icon: Briefcase },
  { label: 'Projects', path: '/projects', icon: FolderGit2 },
  { label: 'Album Gallery', path: '/album', icon: Image },
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
          background: isActive ? 'var(--accent-dim)' : 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          position: 'relative',
          transition: 'border-color 0.2s, background 0.2s, color 0.2s',
        }}
      >
        <Icon size={17} />
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

export default function Navbar() {
  const { playClick, playHover, soundEnabled, toggleSound } = useSoundContext();
  const { currentPet, isPetVisible, cyclePet, togglePetVisibility } = usePet();
  const location = useLocation();
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    if (e) e.preventDefault();
    playClick();
    navigate('/contact');
  };

  // Real-time Digital Clock (HH:mm:ss)
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dropdown state for "About ⌵"
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';
  const isContact = location.pathname === '/contact';
  const isAboutActive = ['/about', '/experience', '/projects', '/album'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      {/* =========================================================================
          DESKTOP TOP BAR (Full width layout matching screenshot)
          ========================================================================= */}
      <header
        className="desktop-top-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '76px',
          padding: '0 clamp(20px, 4vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
          pointerEvents: 'none', // Allow clicking behind transparent areas
        }}
      >
        {/* Left: Live Digital Clock (18:08:30) */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
              fontWeight: 700,
              letterSpacing: '3px',
              color: 'var(--text)',
              userSelect: 'none',
            }}
          >
            {timeString || '18:08:30'}
          </span>
        </div>

        {/* Center: Floating Pill Navbar (Home | About ⌵ | Contact) */}
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 6px',
            borderRadius: '999px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px var(--shadow-color)',
            position: 'relative',
          }}
        >
          {/* Home */}
          <Link
            to="/"
            onClick={playClick}
            onMouseEnter={playHover}
            style={{
              padding: '7px 20px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              color: isHome ? 'var(--text)' : 'var(--text-muted)',
              background: isHome ? 'var(--surface-2)' : 'transparent',
              boxShadow: isHome ? '0 2px 10px var(--shadow-color)' : 'none',
              transition: 'all 0.2s ease',
              display: 'inline-block',
            }}
          >
            Home
          </Link>

          {/* About with dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                playClick();
                setDropdownOpen((p) => !p);
              }}
              onMouseEnter={() => setDropdownOpen(true)}
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                color: isAboutActive ? 'var(--text)' : 'var(--text-muted)',
                background: isAboutActive && !isHome ? 'var(--surface-2)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>About</span>
              <ChevronDown
                size={13}
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseLeave={() => setDropdownOpen(false)}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '180px',
                    borderRadius: '16px',
                    background: 'var(--surface, #101015)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    zIndex: 100,
                  }}
                >
                  {ABOUT_DROPDOWN.map(({ label, path, icon: Icon }) => {
                    const active = location.pathname.startsWith(path);
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => {
                          playClick();
                          setDropdownOpen(false);
                        }}
                        onMouseEnter={playHover}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 14px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: active ? 'var(--accent, #FF3B1D)' : 'var(--text)',
                          background: active ? 'rgba(255, 59, 29, 0.08)' : 'transparent',
                          transition: 'background 0.15s, color 0.15s',
                        }}
                      >
                        <Icon size={15} />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            onClick={playClick}
            onMouseEnter={playHover}
            style={{
              padding: '7px 20px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              color: isContact ? 'var(--text)' : 'var(--text-muted)',
              background: isContact ? 'var(--surface-2)' : 'transparent',
              boxShadow: isContact ? '0 2px 10px var(--shadow-color)' : 'none',
              transition: 'all 0.2s ease',
              display: 'inline-block',
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Circular Icon Actions (Pet Controls & Theme) */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Pet Visibility Toggle (Cat Head) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playClick();
              togglePetVisibility();
            }}
            title={isPetVisible ? 'Sembunyikan Pet' : 'Tampilkan Pet'}
            aria-label="Toggle Pet Visibility"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: isPetVisible ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              background: isPetVisible ? 'var(--accent-dim)' : 'transparent',
              color: isPetVisible ? 'var(--accent)' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s, color 0.2s',
            }}
          >
            <Cat size={16} />
          </motion.button>

          {/* Pet Switcher (PawPrint) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playClick();
              cyclePet();
            }}
            title={`Ganti Pet (${currentPet.name})`}
            aria-label="Ganti Pet"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isPetVisible ? 1 : 0.45,
              transition: 'opacity 0.2s, border-color 0.2s, color 0.2s',
            }}
          >
            <PawPrint size={15} />
          </motion.button>

          {/* Theme Toggle (Sun / Moon) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* =========================================================================
          MOBILE TOP MINIMAL BAR
          ========================================================================= */}
      <header className="mobile-top-bar">
        <Link to="/" onClick={playClick} style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <img
              src="/icon.png"
              alt="Zacky Andyka"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </Link>

        {/* Live Clock on Mobile Top */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: 'var(--text-muted)',
          }}
        >
          {timeString}
        </span>

        {/* Right Mobile Actions: Pet Toggle, Pet Switcher, Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Pet Visibility Toggle (Cat Head) */}
          <button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: isPetVisible ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              background: isPetVisible ? 'var(--accent-dim)' : 'var(--surface)',
              color: isPetVisible ? 'var(--accent)' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s, color 0.2s',
            }}
            onClick={() => {
              playClick();
              togglePetVisibility();
            }}
            title={isPetVisible ? 'Sembunyikan Pet' : 'Tampilkan Pet'}
            aria-label="Toggle Pet Visibility"
          >
            <Cat size={15} />
          </button>

          {/* Pet Switcher (PawPrint) */}
          <button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isPetVisible ? 1 : 0.45,
              transition: 'opacity 0.2s, border-color 0.2s, color 0.2s',
            }}
            onClick={() => {
              playClick();
              cyclePet();
            }}
            title={`Ganti Pet (${currentPet.name})`}
            aria-label="Ganti Pet"
          >
            <PawPrint size={14} />
          </button>

          {/* Sound Toggle */}
          <button
            style={{
              width: '32px',
              height: '32px',
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
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE BOTTOM FLOATING DOCK NAVBAR
          ========================================================================= */}
      <nav className="mobile-dock-nav" role="navigation" aria-label="Mobile Navigation">
        <DockButton
          to="/"
          icon={Home}
          label="Home"
          isActive={location.pathname === '/'}
          onClick={playClick}
          onHover={playHover}
        />
        <DockButton
          to="/about"
          icon={User}
          label="About"
          isActive={location.pathname.startsWith('/about')}
          onClick={playClick}
          onHover={playHover}
        />
        <div className="dock-divider" />
        <DockButton
          to="/experience"
          icon={Briefcase}
          label="Experience"
          isActive={location.pathname.startsWith('/experience')}
          onClick={playClick}
          onHover={playHover}
        />
        <DockButton
          to="/projects"
          icon={FolderGit2}
          label="Projects"
          isActive={location.pathname.startsWith('/projects')}
          onClick={playClick}
          onHover={playHover}
        />
        <div className="dock-divider" />
        <DockButton
          to="/contact"
          icon={Mail}
          label="Contact"
          isActive={location.pathname === '/contact'}
          onClick={playClick}
          onHover={playHover}
        />
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </div>
      </nav>

      {/* Responsive Visibility Controls */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-top-header { display: flex !important; }
          .mobile-top-bar { display: none !important; }
          .mobile-dock-nav { display: none !important; }
        }
        @media (max-width: 859px) {
          .desktop-top-header { display: none !important; }
          .mobile-top-bar {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 52px !important;
            padding: 0 16px !important;
            align-items: center !important;
            justify-content: space-between !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border-bottom: 1px solid var(--border) !important;
            z-index: 1000 !important;
          }
          .mobile-dock-nav {
            display: flex !important;
            position: fixed !important;
            bottom: 16px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 9999 !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 5px !important;
            padding: 5px 10px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            border: 1px solid var(--border) !important;
            border-radius: 9999px !important;
            box-shadow: 0 12px 36px var(--shadow-color) !important;
            max-width: calc(100vw - 24px) !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .mobile-dock-nav::-webkit-scrollbar {
            display: none !important;
          }
          .dock-divider {
            width: 1px !important;
            height: 18px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            margin: 0 1px !important;
            flex-shrink: 0 !important;
          }
          .dock-circle-btn {
            width: 36px !important;
            height: 36px !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
