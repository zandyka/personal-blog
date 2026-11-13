import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ChevronsDown, Play, RotateCcw, RotateCw, Trophy, Zap } from 'lucide-react';
import { createPolyblok, VIEW } from './engine';
import { HoldButton, TopBar, formatInt, useGameAudio, usePopups } from '../shared/GameChrome';
import { loadBest, saveBest } from '../shared/audio';
import { fitPixelCanvas } from '../shared/retro';

const HOLD_KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowDown: 'down', KeyS: 'down' };
const ROTATE_KEYS = new Set(['ArrowUp', 'KeyW', 'KeyX']);
const SURGE_KEYS = new Set(['KeyZ', 'ShiftLeft', 'ShiftRight']);

const panelMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

export default function Polyblok({ onExit }) {
  const canvasRef = useRef(null);
  const nextRef = useRef(null);
  const screenRef = useRef(null);
  const engineRef = useRef(null);
  const audio = useGameAudio();
  const [phase, setPhase] = useState('menu'); // menu | play | over
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => loadBest('polyblok'));
  const [popRef, pushPop] = usePopups(2);

  const scoreRef = useRef(null);
  const linesRef = useRef(null);
  const levelRef = useRef(null);
  const surgeRef = useRef(null);
  const surgeWrapRef = useRef(null);
  const shown = useRef({});
  const phaseRef = useRef('menu');
  const pausedRef = useRef(false);
  const bestRef = useRef(best);

  useEffect(() => {
    const engine = createPolyblok(canvasRef.current, nextRef.current, {
      audio,
      onPopup: pushPop,
      onHud: (h) => {
        const s = shown.current;
        if (s.score !== h.score) {
          s.score = h.score;
          if (scoreRef.current) scoreRef.current.textContent = formatInt(h.score);
        }
        if (s.lines !== h.lines) {
          s.lines = h.lines;
          if (linesRef.current) linesRef.current.textContent = h.lines;
        }
        if (s.level !== h.level) {
          s.level = h.level;
          if (levelRef.current) levelRef.current.textContent = h.level;
        }
        if (s.surge !== h.surge) {
          s.surge = h.surge;
          if (surgeRef.current) surgeRef.current.style.transform = `scaleY(${h.surge.toFixed(3)})`;
          surgeWrapRef.current?.classList.toggle('is-ready', h.surge >= 1);
        }
      },
      onState: (state, payload) => {
        phaseRef.current = state;
        setPhase(state);
        if (state === 'over' && payload) {
          const isBest = payload.score > bestRef.current;
          if (isBest) {
            bestRef.current = payload.score;
            saveBest('polyblok', payload.score);
            setBest(payload.score);
          }
          setResult({ ...payload, isBest });
        }
      },
    });
    engineRef.current = engine;
    if (import.meta.env.DEV) window.__pg = { game: 'polyblok', engine };

    const fit = () => {
      const box = screenRef.current;
      if (box) fitPixelCanvas(canvasRef.current, box.clientWidth - 24 - 96, box.clientHeight - 24, VIEW.w, VIEW.h);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(screenRef.current);
    fit();
    return () => {
      ro.disconnect();
      engineRef.current = null;
      engine.destroy();
    };
  }, [audio, pushPop]);

  const applyPause = useCallback(
    (p) => {
      if (p && phaseRef.current !== 'play') return;
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
        if (ph === 'play') applyPause(!pausedRef.current);
        else if (e.code === 'Escape') onExit();
        return;
      }
      if (e.code === 'Enter') {
        e.preventDefault();
        if (pausedRef.current) applyPause(false);
        else if (ph !== 'play') start();
        return;
      }
      if (ph !== 'play' || pausedRef.current) {
        if (e.code === 'Space' && ph === 'menu') {
          e.preventDefault();
          start();
        }
        return;
      }
      const hold = HOLD_KEYS[e.code];
      if (hold) {
        e.preventDefault();
        if (!e.repeat) engineRef.current?.press(hold, true);
      } else if (ROTATE_KEYS.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) engineRef.current?.rotate();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) engineRef.current?.drop();
      } else if (SURGE_KEYS.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) engineRef.current?.surge();
      }
    };
    const up = (e) => {
      const hold = HOLD_KEYS[e.code];
      if (hold) engineRef.current?.press(hold, false);
    };
    const hide = () => {
      if (document.hidden) applyPause(true);
    };
    const blur = () => applyPause(true);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('blur', blur);
    };
  }, [applyPause, onExit, start]);

  const hold = (key) => (d) => engineRef.current?.press(key, d);
  const tap = (fn) => (d) => d && engineRef.current?.[fn]();
  const playing = phase === 'play';

  return (
    <div className="gm-game gm-game--pixel gm-game--retro rt-blok">
      <TopBar title="Polyblok Matrix" tag="Retro Block Puzzle" paused={paused} canPause={playing} onPause={() => applyPause(!paused)} onExit={onExit} />

      <div className="rt-stage">
        <div className={`rt-hud ${playing ? 'is-on' : ''}`}>
          <div>
            <span className="gm-label">Skor</span>
            <b ref={scoreRef}>0</b>
          </div>
          <div>
            <span className="gm-label">Baris</span>
            <b ref={linesRef}>0</b>
          </div>
          <div>
            <span className="gm-label">Level</span>
            <b ref={levelRef}>1</b>
          </div>
        </div>
        <div className="rt-screen" ref={screenRef}>
          <div className="rt-row">
            <div className="rt-bezel">
              <canvas ref={canvasRef} />
            </div>
            <aside className="rt-side">
              <span className="gm-label">Berikut</span>
              <canvas ref={nextRef} width={48} height={104} className="rt-next" />
              <span className="gm-label">Surge</span>
              <button type="button" ref={surgeWrapRef} className="rt-surge" onClick={() => engineRef.current?.surge()} aria-label="Aktifkan Surge" data-cursor-label="Surge">
                <i ref={surgeRef} />
                <Zap size={16} />
              </button>
            </aside>
          </div>
        </div>
        {playing && (
          <div className="rt-pad rt-pad--blok">
            <div>
              <HoldButton onHold={hold('left')} label="Kiri">
                <ArrowLeft size={24} />
              </HoldButton>
              <HoldButton onHold={hold('down')} label="Turun" className="gm-touch--sm">
                <ArrowDown size={20} />
              </HoldButton>
              <HoldButton onHold={hold('right')} label="Kanan">
                <ArrowRight size={24} />
              </HoldButton>
            </div>
            <div>
              <HoldButton onHold={tap('drop')} label="Jatuhkan" className="gm-touch--sm">
                <ChevronsDown size={20} />
              </HoldButton>
              <HoldButton onHold={tap('rotate')} label="Putar" className="gm-touch--accent">
                <RotateCw size={26} />
              </HoldButton>
            </div>
          </div>
        )}
      </div>
      <div className="gm-pops" ref={popRef} aria-live="polite" />

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel gm-panel--hero">
              <span className="gm-kicker">Retro Block Puzzle</span>
              <h2 className="gm-title">
                Polyblok <em>Matrix</em>
              </h2>
              <p className="gm-sub">Susun balok berisi satu sampai lima petak hingga barisnya penuh. Tiap baris mengisi Surge; saat penuh, hapus tiga baris terbawah sekaligus.</p>
              <ul className="gm-keys gm-keys--touch">
                <li>
                  <kbd>◀</kbd>
                  <kbd>▶</kbd>
                  <span>Geser</span>
                </li>
                <li>
                  <kbd>↻</kbd>
                  <span>Putar</span>
                </li>
                <li>
                  <kbd>⚡</kbd>
                  <span>Surge</span>
                </li>
              </ul>
              <ul className="gm-keys gm-keys--desk">
                <li>
                  <kbd>←</kbd>
                  <kbd>→</kbd>
                  <span>Geser</span>
                </li>
                <li>
                  <kbd>↑</kbd>
                  <span>Putar</span>
                </li>
                <li>
                  <kbd>Spasi</kbd>
                  <span>Jatuhkan</span>
                </li>
                <li>
                  <kbd>Z</kbd>
                  <span>Surge</span>
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
              <h2 className="gm-title gm-title--sm">Balok menunggu</h2>
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
              <span className="gm-kicker">{result.isBest ? 'Rekor baru!' : 'Tumpukan penuh'}</span>
              <h2 className="gm-title gm-title--score">{formatInt(result.score)}</h2>
              <div className="gm-results">
                <div>
                  <Zap size={16} />
                  <b>{result.lines}</b>
                  <span>baris</span>
                </div>
                <div>
                  <Trophy size={16} />
                  <b>{result.level}</b>
                  <span>level</span>
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
