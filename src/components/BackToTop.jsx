import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const BackToTop = () => {
  const { playClick } = useSoundContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="back-to-top-btn"
          style={{
            position: 'fixed',
            zIndex: 900,
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          whileHover={{ scale: 1.08, borderColor: 'var(--accent)' }}
          whileTap={{ scale: 0.92 }}
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
      <style>{`
        .back-to-top-btn {
          bottom: 28px;
          right: 28px;
        }
        @media (max-width: 859px) {
          .back-to-top-btn {
            bottom: 84px !important;
            right: 18px !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default BackToTop;