import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundContext } from './SoundProvider';
import { Sparkles, Shuffle } from 'lucide-react';

const PETS = [
  {
    id: 'maxwell',
    name: 'Maxwell',
    tag: 'Loaf Cat',
    src: '/pet/maxwell.png',
    defaultQuote: 'Meow~ 🍞',
    runQuote: 'NYOOOM!! 💨',
    catchQuote: 'Phew.. kenyang 🐾',
  },
  {
    id: 'akmal',
    name: 'Akmal',
    tag: 'Munchkin',
    src: '/pet/akmal.png',
    defaultQuote: 'O_O mantau dev',
    runQuote: 'KABUURRR!! ⚡',
    catchQuote: 'Aman dari bug 😼',
  },
  {
    id: 'usu',
    name: 'Kucing USU',
    tag: 'Anak USU',
    src: '/pet/kucing-usu.png',
    defaultQuote: 'Kuliah lagi.. 🎓',
    runQuote: 'TELAT KELAS!! 🏃💨',
    catchQuote: 'Dosen belum datang 😹',
  },
];

export default function FloatingPet() {
  const { playWhoosh, playClick } = useSoundContext();
  const [petIndex, setPetIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [targetX, setTargetX] = useState(80);
  const [facingRight, setFacingRight] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle' | 'walking' | 'running'
  const [speech, setSpeech] = useState({ text: 'Meow~ 🐾', show: false });
  const [showControls, setShowControls] = useState(false);
  const [dustPuffs, setDustPuffs] = useState([]);

  const currentXRef = useRef(80);
  const runTimeoutRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const wanderTimeoutRef = useRef(null);

  const currentPet = PETS[petIndex];

  // Screen size detection for bottom position
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Display initial brief greeting after mount
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      setSpeech({ text: currentPet.defaultQuote, show: true });
      speechTimeoutRef.current = setTimeout(() => {
        setSpeech((prev) => ({ ...prev, show: false }));
      }, 2600);
    }, 1200);

    return () => clearTimeout(greetingTimer);
  }, [petIndex]);

  // Autonomous wandering routine
  const planNextWander = useCallback(() => {
    if (status === 'running') return;

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const minX = 24;
    const maxX = Math.max(minX, screenW - 120);

    // Pick random target X
    const newX = Math.floor(minX + Math.random() * (maxX - minX));
    const distance = Math.abs(newX - currentXRef.current);

    // Only walk if distance is meaningful
    if (distance > 60) {
      setFacingRight(newX > currentXRef.current);
      setStatus('walking');
      setTargetX(newX);

      // Random chance to say something while strolling
      if (Math.random() < 0.35) {
        setSpeech({ text: currentPet.defaultQuote, show: true });
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
          setSpeech((prev) => ({ ...prev, show: false }));
        }, 2200);
      }

      // Calculate walking duration based on distance (~70px/sec)
      const walkDuration = Math.max(1.8, Math.min(5.5, distance / 70));
      setTimeout(() => {
        currentXRef.current = newX;
        setStatus('idle');
      }, walkDuration * 1000);
    }

    // Schedule next move in 4 to 8 seconds
    const nextInterval = 4000 + Math.random() * 4500;
    wanderTimeoutRef.current = setTimeout(planNextWander, nextInterval);
  }, [status, currentPet]);

  useEffect(() => {
    wanderTimeoutRef.current = setTimeout(planNextWander, 3000);
    return () => {
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current);
    };
  }, [planNextWander]);

  // Switch pet handler
  const switchPet = useCallback(
    (e) => {
      e?.stopPropagation();
      try {
        playClick?.();
      } catch {}

      setPetIndex((prev) => (prev + 1) % PETS.length);
      setStatus('idle');
      setSpeech({ text: 'Poof! ✨', show: true });

      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = setTimeout(() => {
        setSpeech((prev) => ({ ...prev, show: false }));
      }, 1800);
    },
    [playClick]
  );

  // Click handler to make the pet RUN
  const handlePetClick = (e) => {
    e.stopPropagation();

    try {
      playWhoosh?.();
      playClick?.();
    } catch {}

    const screenW = window.innerWidth;
    const currentX = currentXRef.current;

    // Run away to opposite side of screen
    const runToRight = currentX < screenW / 2;
    const padding = 30;
    const escapeX = runToRight ? screenW - padding - 85 : padding;

    setFacingRight(runToRight);
    setStatus('running');
    setTargetX(escapeX);
    currentXRef.current = escapeX;

    // Show startled panic quote
    setSpeech({ text: currentPet.runQuote, show: true });

    // Spawn dust puff animation particles
    const newPuffs = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: currentX + (runToRight ? -15 - i * 14 : 15 + i * 14),
    }));
    setDustPuffs(newPuffs);
    setTimeout(() => setDustPuffs([]), 700);

    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

    // Duration of sprint (~1.4s)
    runTimeoutRef.current = setTimeout(() => {
      setStatus('idle');
      setSpeech({ text: currentPet.catchQuote, show: true });

      speechTimeoutRef.current = setTimeout(() => {
        setSpeech((prev) => ({ ...prev, show: false }));
      }, 2400);

      // Resume regular wander after pause
      wanderTimeoutRef.current = setTimeout(planNextWander, 3500);
    }, 1400);
  };

  const isRunning = status === 'running';
  const isWalking = status === 'walking';

  return (
    <div
      aria-label="Interactive Floating Pet"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: isMobile ? '76px' : '14px',
        zIndex: 80,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
      }}
    >
      {/* Running Dust Puff Particles */}
      <AnimatePresence>
        {dustPuffs.map((puff, idx) => (
          <motion.div
            key={puff.id}
            initial={{ opacity: 0.8, scale: 0.4, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, delay: idx * 0.08 }}
            style={{
              position: 'absolute',
              left: puff.x,
              bottom: '12px',
              fontSize: '1.1rem',
              pointerEvents: 'none',
            }}
          >
            💨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Animated Pet Container */}
      <motion.div
        animate={{
          x: targetX,
        }}
        transition={{
          duration: isRunning ? 1.35 : isWalking ? 3.2 : 0.8,
          ease: isRunning ? [0.22, 1, 0.36, 1] : 'easeInOut',
        }}
        onUpdate={(latest) => {
          if (typeof latest.x === 'number') {
            currentXRef.current = latest.x;
          }
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 'clamp(58px, 8vw, 76px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handlePetClick}
        onDoubleClick={switchPet}
      >
        {/* Speech Bubble / Thought Balloon */}
        <AnimatePresence>
          {(speech.show || showControls) && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
                boxShadow: '0 6px 20px var(--shadow-color)',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'auto',
                zIndex: 10,
              }}
            >
              <span>{speech.show ? speech.text : currentPet.name}</span>
              {/* Pet switcher quick button */}
              <button
                type="button"
                onClick={switchPet}
                title="Ganti pet (atau double click)"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: '2px',
                }}
              >
                <Shuffle size={11} />
              </button>

              {/* Triangle Tail */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid var(--border)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet Image with dynamic bobbing / running wobble */}
        <motion.div
          animate={
            isRunning
              ? {
                  y: [0, -14, 0],
                  rotate: [-14, 14, -14],
                  scaleX: facingRight ? [1.12, 1.22, 1.12] : [-1.12, -1.22, -1.12],
                  scaleY: [0.84, 1.05, 0.84],
                }
              : isWalking
              ? {
                  y: [0, -6, 0],
                  rotate: [-4, 4, -4],
                  scaleX: facingRight ? 1 : -1,
                  scaleY: [0.96, 1.04, 0.96],
                }
              : {
                  y: [0, -3, 0],
                  rotate: [-1.5, 1.5, -1.5],
                  scaleX: facingRight ? 1 : -1,
                  scaleY: [1, 1.03, 1],
                }
          }
          transition={{
            repeat: Infinity,
            duration: isRunning ? 0.2 : isWalking ? 0.42 : 2.6,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.28))',
          }}
        >
          <img
            src={currentPet.src}
            alt={currentPet.name}
            draggable={false}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '74px',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
