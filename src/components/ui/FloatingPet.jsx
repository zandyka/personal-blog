import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundContext } from './SoundProvider';
import { usePet } from '../../hooks/usePet';

export default function FloatingPet() {
  const { playWhoosh, playClick } = useSoundContext();
  const { currentPet, isPetVisible, cyclePet } = usePet();

  const [isMobile, setIsMobile] = useState(false);
  const [posX, setPosX] = useState(80);
  const [moveDuration, setMoveDuration] = useState(0);
  const [facingRight, setFacingRight] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle' | 'walking' | 'running'
  const [speech, setSpeech] = useState({ text: '', show: false });
  const [dustPuffs, setDustPuffs] = useState([]);

  const currentXRef = useRef(80);
  const isRunningRef = useRef(false);
  const runTimerRef = useRef(null);
  const wanderTimerRef = useRef(null);
  const speechTimerRef = useRef(null);

  // Responsive check for bottom dock positioning
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show brief greeting when cat changes or first mounts
  useEffect(() => {
    if (!isPetVisible) return;
    const timer = setTimeout(() => {
      setSpeech({ text: currentPet.defaultQuote, show: true });
      speechTimerRef.current = setTimeout(() => {
        setSpeech((prev) => ({ ...prev, show: false }));
      }, 2500);
    }, 800);

    return () => {
      clearTimeout(timer);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [currentPet.id, isPetVisible]);

  // Calm, slow autonomous wandering
  const scheduleNextWander = useCallback(() => {
    if (isRunningRef.current || !isPetVisible) return;

    // Pick a leisurely pause time between walks (5.5 to 9.5 seconds)
    const pauseTime = 5500 + Math.random() * 4000;

    wanderTimerRef.current = setTimeout(() => {
      if (isRunningRef.current) return;

      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const minX = 24;
      const maxX = Math.max(minX, screenW - 110);

      // Choose a reasonable nearby target rather than jumping wildly across screen
      const curX = currentXRef.current;
      const strollDistance = 140 + Math.random() * 220; // 140px to 360px per stroll
      const goRight = Math.random() > 0.5 ? curX + strollDistance <= maxX : curX - strollDistance < minX;

      let nextX = goRight ? curX + strollDistance : curX - strollDistance;
      nextX = Math.max(minX, Math.min(maxX, nextX));

      const actualDistance = Math.abs(nextX - curX);
      if (actualDistance < 50) {
        scheduleNextWander();
        return;
      }

      // Very slow, calm speed (~32px per second)
      const walkSpeed = 32;
      const duration = actualDistance / walkSpeed;

      // Set direction once before walk starts
      setFacingRight(nextX > curX);
      setStatus('walking');
      setMoveDuration(duration);
      setPosX(nextX);
      currentXRef.current = nextX;

      // Chance for a cute thought while walking
      if (Math.random() < 0.25) {
        setSpeech({ text: currentPet.defaultQuote, show: true });
        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          setSpeech((prev) => ({ ...prev, show: false }));
        }, 2200);
      }

      // Transition to idle when walking finishes
      setTimeout(() => {
        if (!isRunningRef.current) {
          setStatus('idle');
          scheduleNextWander();
        }
      }, duration * 1000);
    }, pauseTime);
  }, [isPetVisible, currentPet]);

  useEffect(() => {
    scheduleNextWander();
    return () => {
      if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
    };
  }, [scheduleNextWander]);

  // Click handler to make the pet RUN
  const handlePetClick = (e) => {
    e.stopPropagation();

    try {
      playWhoosh?.();
      playClick?.();
    } catch {}

    if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
    if (runTimerRef.current) clearTimeout(runTimerRef.current);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    isRunningRef.current = true;
    setStatus('running');

    const screenW = window.innerWidth;
    const curX = currentXRef.current;

    // Run away to the farther side of screen
    const runRight = curX < screenW / 2;
    const edgePadding = 32;
    const escapeX = runRight ? screenW - edgePadding - 90 : edgePadding;
    const distance = Math.abs(escapeX - curX);

    // Fast running speed (~340px/s)
    const sprintDuration = Math.max(1.0, Math.min(1.8, distance / 340));

    setFacingRight(runRight);
    setMoveDuration(sprintDuration);
    setPosX(escapeX);
    currentXRef.current = escapeX;

    // Startled speech bubble
    setSpeech({ text: currentPet.runQuote, show: true });

    // Spawn dust puff animation
    const puffs = [
      { id: Date.now(), x: curX + (runRight ? -12 : 12) },
      { id: Date.now() + 1, x: curX + (runRight ? -26 : 26) },
    ];
    setDustPuffs(puffs);
    setTimeout(() => setDustPuffs([]), 600);

    // Stop running after reaching destination
    runTimerRef.current = setTimeout(() => {
      isRunningRef.current = false;
      setStatus('idle');
      setSpeech({ text: currentPet.catchQuote, show: true });

      speechTimerRef.current = setTimeout(() => {
        setSpeech((prev) => ({ ...prev, show: false }));
      }, 2400);

      scheduleNextWander();
    }, sprintDuration * 1000);
  };

  const isRunning = status === 'running';
  const isWalking = status === 'walking';

  if (!isPetVisible) return null;

  return (
    <div
      aria-label="Interactive Floating Pet Track"
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
            initial={{ opacity: 0.85, scale: 0.4, y: 0 }}
            animate={{ opacity: 0, scale: 1.3, y: -16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            style={{
              position: 'absolute',
              left: puff.x,
              bottom: '8px',
              fontSize: '1rem',
              pointerEvents: 'none',
            }}
          >
            💨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Layer 1: Horizontal Position Track (Smooth linear / ease-out motion, NO rotation) */}
      <motion.div
        animate={{
          x: posX,
        }}
        transition={{
          duration: moveDuration,
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
        onClick={handlePetClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
          cyclePet();
        }}
      >
        {/* Speech Bubble / Thought Balloon */}
        <AnimatePresence>
          {speech.show && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.85 }}
              transition={{ duration: 0.18 }}
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
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <span>{speech.text}</span>
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

        {/* Layer 2: Direction Flip Container (scaleX only, NO rotate) */}
        <div
          style={{
            transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
            transition: 'transform 0.28s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* Layer 3: Vertical bobbing & gait wobble */}
          <motion.div
            animate={
              isRunning
                ? {
                    y: [0, -8, 0],
                    rotate: [-5, 5, -5],
                    scaleY: [0.94, 1.04, 0.94],
                  }
                : isWalking
                ? {
                    y: [0, -3, 0],
                    rotate: [-1.2, 1.2, -1.2],
                    scaleY: [0.98, 1.02, 0.98],
                  }
                : {
                    y: [0, -1.5, 0],
                    rotate: 0,
                    scaleY: [1, 1.02, 1],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: isRunning ? 0.22 : isWalking ? 0.6 : 3.0,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.22))',
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
        </div>
      </motion.div>
    </div>
  );
}
