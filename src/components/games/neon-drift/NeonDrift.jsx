import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Gauge, Play, RotateCcw, Shield, Trophy, Zap } from 'lucide-react';
import { createNeonDrift } from './engine';
import { HoldButton, TopBar, formatInt, useGameAudio, usePopups } from '../shared/GameChrome';
import { loadBest, saveBest } from '../shared/audio';

const KEYS = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowUp: 'nitro',
  KeyW: 'nitro',
  ShiftLeft: 'nitro',
  ShiftRight: 'nitro',
  Space: 'nitro',
  ArrowDown: 'brake',
  KeyS: 'brake',
};

const panelMotion = {
  initial: { opacity: 0, y: 26, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.98 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function NeonDrift({ onExit }) {
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const audio = useGameAudio();
  const [phase, setPhase] = useState('menu'); // menu | countdown | run | crash | over
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => loadBest('neon-drift'));
  const [failed, setFailed] = useState(false);
  const [popRef, pushPop] = usePopups();

  const scoreRef = useRef(null);
  const speedRef = useRef(null);
  const nitroRef = useRef(null);
  const nitroWrapRef = useRef(null);
  const multRef = useRef(null);
  const comboRef = useRef(null);
  const shieldRef = useRef(null);
  const distRef = useRef(null);
  const zoneRef = useRef(null);
  const shown = useRef({});
  const phaseRef = useRef('menu');
  const pausedRef = useRef(false);
  const bestRef = useRef(best);

  useEffect(() => {
    let engine;
    try {
      engine = createNeonDrift(stageRef.current, {
        audio,
        onPopup: pushPop,
        onZone: (name, n) => {
          const el = zoneRef.current;
          if (!el) return;
          el.innerHTML = '';
          const small = document.createElement('span');
          small.textContent = `Zona ${n}`;
          const big = document.createElement('strong');
          big.textContent = name;
          el.append(small, big);
          el.classList.remove('is-on');
          void el.offsetWidth;
          el.classList.add('is-on');
        },
        onHud: (h) => {
          const s = shown.current;
          if (s.score !== h.score) {
            s.score = h.score;
            if (scoreRef.current) scoreRef.current.textContent = formatInt(h.score);
          }
          if (s.speed !== h.speed) {
            s.speed = h.speed;
            if (speedRef.current) speedRef.current.textContent = h.speed;
          }
          if (nitroRef.current) nitroRef.current.style.transform = `scaleX(${h.nitro.toFixed(3)})`;
          if (s.boosting !== h.boosting) {
            s.boosting = h.boosting;
            nitroWrapRef.current?.classList.toggle('is-boost', h.boosting);
          }
          if (s.mult !== h.mult) {
            s.mult = h.mult;
            if (multRef.current) {
              multRef.current.textContent = `x${h.mult}`;
              multRef.current.parentElement.classList.toggle('is-on', h.mult > 1);
            }
          }
          if (comboRef.current) comboRef.current.style.transform = `scaleX(${h.comboT.toFixed(3)})`;
          if (s.shield !== h.shield) {
            s.shield = h.shield;
            shieldRef.current?.classList.toggle('is-on', h.shield);
          }
          const km = (h.dist / 1000).toFixed(2);
          if (s.km !== km) {
            s.km = km;
            if (distRef.current) distRef.current.textContent = km;
          }
        },
        onState: (state, payload) => {
          const next = state === 'menu' ? 'menu' : state;
          phaseRef.current = next;
          setPhase(next);
          if (state === 'over' && payload) {
            const isBest = payload.score > bestRef.current;
            if (isBest) {
              bestRef.current = payload.score;
              saveBest('neon-drift', payload.score);
              setBest(payload.score);
            }
            setResult({ ...payload, isBest });
          }
        },
      });
    } catch (err) {
      console.error('Neon Drift gagal dimulai:', err);
      setFailed(true);
      return undefined;
    }
    engineRef.current = engine;
    return () => {
      engineRef.current = null;
      engine.destroy();
    };
  }, [audio, pushPop]);

  const start = useCallback(() => {
    audio.unlock();
    setResult(null);
    setPaused(false);
    pausedRef.current = false;
    audio.setPaused(false);
    engineRef.current?.setPaused(false);
    engineRef.current?.startRun();
  }, [audio]);

  const applyPause = useCallback(
    (p) => {
      const active = phaseRef.current === 'run' || phaseRef.current === 'countdown';
      if (p && !active) return;
      pausedRef.current = p;
      setPaused(p);
      engineRef.current?.setPaused(p);
      audio.setPaused(p);
    },
    [audio],
  );

  const toMenu = useCallback(() => {
    applyPause(false);
    pausedRef.current = false;
    setPaused(false);
    audio.setPaused(false);
    engineRef.current?.setPaused(false);
    engineRef.current?.toMenu();
  }, [applyPause, audio]);

  useEffect(() => {
    const down = (e) => {
      if (e.repeat && KEYS[e.code]) {
        e.preventDefault();
        return;
      }
      const ph = phaseRef.current;
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (ph === 'run' || ph === 'countdown') applyPause(!pausedRef.current);
        else if (e.code === 'Escape') onExit();
        return;
      }
      if ((e.code === 'Enter' || e.code === 'Space') && (ph === 'menu' || ph === 'over')) {
        e.preventDefault();
        start();
        return;
      }
      if (e.code === 'Enter' && pausedRef.current) {
        e.preventDefault();
        applyPause(false);
        return;
      }
      const k = KEYS[e.code];
      if (k) {
        e.preventDefault();
        engineRef.current?.press(k, true);
      }
    };
    const up = (e) => {
      const k = KEYS[e.code];
      if (k) engineRef.current?.press(k, false);
    };
    const autoPause = () => {
      if (document.hidden) applyPause(true);
    };
    const blur = () => applyPause(true);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    document.addEventListener('visibilitychange', autoPause);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.removeEventListener('visibilitychange', autoPause);
      window.removeEventListener('blur', blur);
    };
  }, [applyPause, onExit, start]);

  const hold = (key) => (down) => engineRef.current?.press(key, down);
  const playing = phase === 'run' || phase === 'countdown' || phase === 'crash';

  return (
    <div className="gm-game gm-game--drift">
      <div ref={stageRef} className="gm-stage" />
      <div className="gm-vignette" aria-hidden="true" />

      <TopBar title="Neon Drift" tag="Endless Racing" paused={paused} canPause={phase === 'run' || phase === 'countdown'} onPause={() => applyPause(!paused)} onExit={onExit} />

      {/* HUD */}
      <div className={`gm-hud ${playing ? 'is-on' : ''}`} aria-hidden={!playing}>
        <div className="gm-hud__tl">
          <span className="gm-label">Skor</span>
          <div className="gm-score" ref={scoreRef}>
            0
          </div>
          <div className="gm-mult">
            <b ref={multRef}>x1</b>
            <span className="gm-mult__bar">
              <i ref={comboRef} />
            </span>
          </div>
        </div>
        <div className="gm-hud__tr">
          <div className="gm-stat">
            <span className="gm-label">Jarak</span>
            <span className="gm-stat__v">
              <b ref={distRef}>0.00</b> km
            </span>
          </div>
          <div className="gm-stat">
            <span className="gm-label">Terbaik</span>
            <span className="gm-stat__v">
              <b>{formatInt(best)}</b>
            </span>
          </div>
        </div>
        <div className="gm-speedo">
          <div className="gm-speedo__row">
            <span ref={shieldRef} className="gm-shield" title="Perisai">
              <Shield size={15} />
            </span>
            <div className="gm-speedo__num">
              <b ref={speedRef}>0</b>
              <span>km/h</span>
            </div>
            <span className="gm-shield gm-shield--ghost" aria-hidden="true">
              <Zap size={15} />
            </span>
          </div>
          <div className="gm-nitro" ref={nitroWrapRef}>
            <span className="gm-label">Nitro</span>
            <span className="gm-nitro__track">
              <i ref={nitroRef} />
            </span>
          </div>
        </div>
        <div className="gm-zone" ref={zoneRef} />
      </div>
      <div className="gm-pops" ref={popRef} aria-live="polite" />

      {/* Kontrol sentuh */}
      {playing && (
        <div className="gm-touchpad">
          <div className="gm-touchpad__side">
            <HoldButton onHold={hold('left')} label="Belok kiri">
              <ChevronLeft size={30} />
            </HoldButton>
            <HoldButton onHold={hold('right')} label="Belok kanan">
              <ChevronRight size={30} />
            </HoldButton>
          </div>
          <div className="gm-touchpad__side">
            <HoldButton onHold={hold('brake')} label="Rem" className="gm-touch--sm">
              REM
            </HoldButton>
            <HoldButton onHold={hold('nitro')} label="Nitro" className="gm-touch--accent">
              <Flame size={26} />
            </HoldButton>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {failed && (
          <motion.div key="fail" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <h2 className="gm-title gm-title--sm">WebGL tidak tersedia</h2>
              <p className="gm-sub">Perangkat atau browser ini tidak bisa menjalankan grafis 3D. Coba browser lain atau aktifkan akselerasi hardware.</p>
              <div className="gm-actions">
                <button type="button" className="gm-btn" onClick={onExit}>
                  Kembali
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!failed && phase === 'menu' && (
          <motion.div key="menu" className="gm-overlay gm-overlay--clear gm-overlay--side" {...panelMotion}>
            <div className="gm-panel gm-panel--hero">
              <span className="gm-kicker">Endless Racing · 3D</span>
              <h2 className="gm-title">
                Neon <em>Drift</em>
              </h2>
              <p className="gm-sub">Melaju di jalan raya neon, selip di antara lalu lintas, dan kumpulkan near miss untuk mengisi nitro.</p>
              <ul className="gm-keys gm-keys--touch">
                <li>
                  <kbd>◀</kbd>
                  <kbd>▶</kbd>
                  <span>Kemudi</span>
                </li>
                <li>
                  <kbd>
                    <Flame size={11} />
                  </kbd>
                  <span>Tahan untuk nitro</span>
                </li>
                <li>
                  <kbd>REM</kbd>
                  <span>Perlambat</span>
                </li>
              </ul>
              <ul className="gm-keys gm-keys--desk">
                <li>
                  <kbd>A</kbd>
                  <kbd>D</kbd>
                  <span>Kemudi</span>
                </li>
                <li>
                  <kbd>Shift</kbd>
                  <span>Nitro</span>
                </li>
                <li>
                  <kbd>S</kbd>
                  <span>Rem</span>
                </li>
                <li>
                  <kbd>Esc</kbd>
                  <span>Jeda</span>
                </li>
              </ul>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={start} data-cursor-label="Mulai">
                  <Play size={18} /> Mulai Balapan
                </button>
              </div>
              <div className="gm-best">
                <Trophy size={14} /> Skor terbaik <b>{formatInt(best)}</b>
              </div>
            </div>
          </motion.div>
        )}

        {!failed && paused && (
          <motion.div key="pause" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">Dijeda</span>
              <h2 className="gm-title gm-title--sm">Tarik napas dulu</h2>
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

        {!failed && phase === 'over' && result && (
          <motion.div key="over" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">{result.isBest ? 'Rekor baru!' : 'Tabrakan'}</span>
              <h2 className="gm-title gm-title--score">{formatInt(result.score)}</h2>
              <div className="gm-results">
                <div>
                  <Gauge size={16} />
                  <b>{Math.round(result.topSpeed)}</b>
                  <span>km/h tertinggi</span>
                </div>
                <div>
                  <Zap size={16} />
                  <b>{result.near}</b>
                  <span>near miss</span>
                </div>
                <div>
                  <Trophy size={16} />
                  <b>{(result.dist / 1000).toFixed(2)}</b>
                  <span>km ditempuh</span>
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
