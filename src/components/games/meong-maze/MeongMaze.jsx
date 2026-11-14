import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsRight, Play, RotateCcw, Trophy } from 'lucide-react';
import { createMeongMaze, VIEW } from './engine';
import { TopBar, formatInt, useGameAudio, usePopups } from '../shared/GameChrome';
import { loadBest, saveBest } from '../shared/audio';
import { fitPixelCanvas, loadCat, saveChoice } from '../shared/retro';
import CatPicker from '../shared/CatPicker';

const DIR_KEYS = {
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
};

const panelMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

export default function MeongMaze({ onExit }) {
  const canvasRef = useRef(null);
  const screenRef = useRef(null);
  const engineRef = useRef(null);
  const audio = useGameAudio();
  const [phase, setPhase] = useState('menu'); // menu | ready | play | dying | over
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => loadBest('meong-maze'));
  const [cat, setCat] = useState(loadCat);
  const [ready, setReady] = useState(false);
  const [popRef, pushPop] = usePopups(2);

  const scoreRef = useRef(null);
  const levelRef = useRef(null);
  const livesRef = useRef(null);
  const pounceRef = useRef(null);
  const frightRef = useRef(null);
  const shown = useRef({});
  const phaseRef = useRef('menu');
  const pausedRef = useRef(false);
  const bestRef = useRef(best);

  useEffect(() => {
    const engine = createMeongMaze(canvasRef.current, {
      audio,
      onPopup: pushPop,
      onHud: (h) => {
        const s = shown.current;
        if (s.score !== h.score) {
          s.score = h.score;
          if (scoreRef.current) scoreRef.current.textContent = formatInt(h.score);
        }
        if (s.level !== h.level) {
          s.level = h.level;
          if (levelRef.current) levelRef.current.textContent = h.level;
        }
        if (s.lives !== h.lives) {
          s.lives = h.lives;
          if (livesRef.current) livesRef.current.textContent = '♥'.repeat(Math.max(0, h.lives));
        }
        const pounce = Math.round(Math.max(0, Math.min(1, h.pounce)) * 100);
        if (s.pounce !== pounce) {
          s.pounce = pounce;
          if (pounceRef.current) pounceRef.current.style.transform = `scaleX(${pounce / 100})`;
        }
        const fright = Math.round(h.fright * 100);
        if (s.fright !== fright) {
          s.fright = fright;
          if (frightRef.current) frightRef.current.style.transform = `scaleX(${fright / 100})`;
        }
      },
      onState: (state, payload) => {
        phaseRef.current = state;
        setPhase(state);
        if (state === 'over' && payload) {
          const isBest = payload.score > bestRef.current;
          if (isBest) {
            bestRef.current = payload.score;
            saveBest('meong-maze', payload.score);
            setBest(payload.score);
          }
          setResult({ ...payload, isBest });
        }
      },
    });
    engineRef.current = engine;
    if (import.meta.env.DEV || import.meta.env.VITE_PG_DEBUG) window.__pg = { game: 'meong-maze', engine };
    setReady(true);

    const fit = () => {
      const box = screenRef.current;
      if (box) fitPixelCanvas(canvasRef.current, box.clientWidth - 24, box.clientHeight - 24, VIEW.w, VIEW.h);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(screenRef.current);
    fit();
    return () => {
      ro.disconnect();
      engineRef.current = null;
      setReady(false);
      engine.destroy();
    };
  }, [audio, pushPop]);

  useEffect(() => {
    if (!ready) return;
    engineRef.current?.setHero(cat);
    saveChoice('pg-survivor-hero', cat);
  }, [cat, ready]);

  const applyPause = useCallback(
    (p) => {
      const active = phaseRef.current === 'play' || phaseRef.current === 'ready';
      if (p && !active) return;
      pausedRef.current = p;
      setPaused(p);
      engineRef.current?.setPaused(p);
      audio.setPaused(p);
    },
    [audio],
  );

  const start = useCallback(() => {
    audio.unlock();
    setResult(null);
    pausedRef.current = false;
    setPaused(false);
    audio.setPaused(false);
    engineRef.current?.setPaused(false);
    engineRef.current?.start();
  }, [audio]);

  const toMenu = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    audio.setPaused(false);
    engineRef.current?.setPaused(false);
    engineRef.current?.toMenu();
  }, [audio]);

  useEffect(() => {
    const down = (e) => {
      const ph = phaseRef.current;
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (ph === 'play' || ph === 'ready') applyPause(!pausedRef.current);
        else if (e.code === 'Escape') onExit();
        return;
      }
      if (e.code === 'Enter') {
        e.preventDefault();
        if (pausedRef.current) applyPause(false);
        else if (ph === 'menu' || ph === 'over') start();
        return;
      }
      const d = DIR_KEYS[e.code];
      if (d) {
        e.preventDefault();
        engineRef.current?.setDir(d[0], d[1]);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (ph === 'menu') start();
        else if (!e.repeat) engineRef.current?.pounce();
      }
    };
    const hide = () => {
      if (document.hidden) applyPause(true);
    };
    const blur = () => applyPause(true);
    window.addEventListener('keydown', down);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('blur', blur);
    };
  }, [applyPause, onExit, start]);

  // Geser di layar untuk mengubah arah (sentuh)
  const swipe = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) engineRef.current?.setDir(Math.sign(dx), 0);
    else engineRef.current?.setDir(0, Math.sign(dy));
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    swipe.current = null;
  };

  const playing = phase === 'play' || phase === 'ready' || phase === 'dying';

  return (
    <div className="gm-game gm-game--pixel gm-game--retro rt-maze">
      <TopBar title="Meong Maze" tag="Retro Maze Chase" paused={paused} canPause={phase === 'play' || phase === 'ready'} onPause={() => applyPause(!paused)} onExit={onExit} />

      <div className="rt-stage" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div className={`rt-hud ${playing ? 'is-on' : ''}`}>
          <div>
            <span className="gm-label">Skor</span>
            <b ref={scoreRef}>0</b>
          </div>
          <div>
            <span className="gm-label">Level</span>
            <b ref={levelRef}>1</b>
          </div>
          <div>
            <span className="gm-label">Nyawa</span>
            <b ref={livesRef} className="rt-lives">
              ♥♥♥
            </b>
          </div>
          <div>
            <span className="gm-label">Terkam</span>
            <span className="rt-meter">
              <i ref={pounceRef} />
            </span>
            <span className="rt-meter rt-meter--fright">
              <i ref={frightRef} />
            </span>
          </div>
        </div>
        <div className="rt-screen" ref={screenRef}>
          <div className="rt-bezel">
            <canvas ref={canvasRef} />
          </div>
        </div>
        {playing && (
          <div className="rt-pad">
            <span className="rt-pad__hint">Geser layar untuk berbelok</span>
            <button type="button" className="gm-touch gm-touch--accent" aria-label="Terkam" onPointerDown={(e) => {
              e.stopPropagation();
              engineRef.current?.pounce();
            }}>
              <ChevronsRight size={26} />
            </button>
          </div>
        )}
      </div>
      <div className="gm-pops" ref={popRef} aria-live="polite" />

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel gm-panel--hero">
              <span className="gm-kicker">Retro Maze Chase</span>
              <h2 className="gm-title">
                Meong <em>Maze</em>
              </h2>
              <p className="gm-sub">Punguti semua remah ikan di rumah sebelum robot penyedot debu menangkapmu. Catnip membuat robot korslet dan bisa diterkam.</p>
              <CatPicker value={cat} onChange={setCat} />
              <ul className="gm-keys gm-keys--touch">
                <li>
                  <kbd>Geser</kbd>
                  <span>Berbelok</span>
                </li>
                <li>
                  <kbd>
                    <ChevronsRight size={11} />
                  </kbd>
                  <span>Terkam</span>
                </li>
              </ul>
              <ul className="gm-keys gm-keys--desk">
                <li>
                  <kbd>W</kbd>
                  <kbd>A</kbd>
                  <kbd>S</kbd>
                  <kbd>D</kbd>
                  <span>Gerak</span>
                </li>
                <li>
                  <kbd>Spasi</kbd>
                  <span>Terkam</span>
                </li>
                <li>
                  <kbd>Esc</kbd>
                  <span>Jeda</span>
                </li>
              </ul>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={start} data-cursor-label="Mulai">
                  <Play size={18} /> Mulai
                </button>
              </div>
              <div className="gm-best">
                <Trophy size={14} /> Skor terbaik <b>{formatInt(best)}</b>
              </div>
            </div>
          </motion.div>
        )}

        {paused && (
          <motion.div key="pause" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">Dijeda</span>
              <h2 className="gm-title gm-title--sm">Robot ikut berhenti</h2>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={() => applyPause(false)}>
                  <Play size={18} /> Lanjutkan
                </button>
                <button type="button" className="gm-btn" onClick={toMenu}>
                  Menu utama
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'over' && result && (
          <motion.div key="over" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">{result.isBest ? 'Rekor baru!' : 'Game over'}</span>
              <h2 className="gm-title gm-title--score">{formatInt(result.score)}</h2>
              <div className="gm-results">
                <div>
                  <Trophy size={16} />
                  <b>{result.level}</b>
                  <span>level tercapai</span>
                </div>
              </div>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={start} data-cursor-label="Lagi">
                  <RotateCcw size={18} /> Main Lagi
                </button>
                <button type="button" className="gm-btn" onClick={toMenu}>
                  Menu utama
                </button>
              </div>
              <div className="gm-best">
                <Trophy size={14} /> Skor terbaik <b>{formatInt(best)}</b>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
