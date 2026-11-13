import { lazy, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './games.css';

// Tiap game dimuat terpisah, jadi three.js dan mesin game baru diunduh saat dimainkan.
const GAMES = {
  'neon-drift': lazy(() => import('./neon-drift/NeonDrift')),
};

export const isGameId = (id) => Object.prototype.hasOwnProperty.call(GAMES, id || '');

function Loader() {
  return (
    <div className="gm-loader" role="status">
      <span className="gm-loader__ring" aria-hidden="true" />
      <span>Menyiapkan arena…</span>
    </div>
  );
}

export default function GameModal({ gameId, onClose }) {
  const Game = GAMES[gameId];

  useEffect(() => {
    if (!Game) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [Game]);

  return createPortal(
    <AnimatePresence>
      {Game && (
        <motion.div
          key={gameId}
          className="gm-root"
          role="dialog"
          aria-modal="true"
          aria-label="Game"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<Loader />}>
            <Game onExit={onClose} />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
