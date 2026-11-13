import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronsRight,
  CircleDot,
  Crosshair,
  Flame,
  Gauge,
  HeartPulse,
  Layers,
  Magnet,
  MoveRight,
  Orbit,
  Play,
  Rocket,
  RotateCcw,
  Shield,
  Skull,
  Swords,
  Timer,
  Trophy,
  Wind,
  Zap,
} from 'lucide-react';
import { createSwarmSurvivor } from './engine';
import { HoldButton, TopBar, formatInt, useGameAudio, usePopups } from '../shared/GameChrome';
import { loadBest, saveBest } from '../shared/audio';

const ICONS = {
  damage: Flame,
  rate: Gauge,
  multi: Layers,
  pierce: MoveRight,
  orbit: Orbit,
  nova: CircleDot,
  missile: Rocket,
  chain: Zap,
  speed: Wind,
  hp: Shield,
  regen: HeartPulse,
  magnet: Magnet,
  crit: Crosshair,
  dash: ChevronsRight,
};

const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const DASH_KEYS = new Set(['Space', 'ShiftLeft', 'ShiftRight']);

const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const panelMotion = {
  initial: { opacity: 0, y: 26, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.98 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function SwarmSurvivor({ onExit }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const audio = useGameAudio();
  const [phase, setPhase] = useState('menu'); // menu | play | dead | over
  const [paused, setPaused] = useState(false);
  const [choices, setChoices] = useState(null);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => loadBest('swarm-survivor'));
  const [popRef, pushPop] = usePopups();

  const scoreRef = useRef(null);
  const waveRef = useRef(null);
  const timeRef = useRef(null);
  const killRef = useRef(null);
  const hpRef = useRef(null);
  const hpTextRef = useRef(null);
  const xpRef = useRef(null);
  const levelRef = useRef(null);
  const dashRef = useRef(null);
  const dashWrapRef = useRef(null);
  const bossRef = useRef(null);
  const bossWrapRef = useRef(null);
  const hurtRef = useRef(null);
  const bannerRef = useRef(null);
  const shown = useRef({});
  const phaseRef = useRef('menu');
  const pausedRef = useRef(false);
  const choicesRef = useRef(null);
  const bestRef = useRef(best);

  useEffect(() => {
    const engine = createSwarmSurvivor(canvasRef.current, {
      audio,
      onPopup: pushPop,
      onWave: (n, boss) => {
        const el = bannerRef.current;
        if (!el) return;
        el.innerHTML = '';
        const small = document.createElement('span');
        small.textContent = boss ? 'Peringatan' : 'Gelombang';
        const big = document.createElement('strong');
        big.textContent = boss ? 'BOS DATANG' : String(n).padStart(2, '0');
        el.append(small, big);
        el.classList.toggle('is-boss', boss);
        el.classList.remove('is-on');
        void el.offsetWidth;
        el.classList.add('is-on');
      },
      onLevelUp: (list) => {
        choicesRef.current = list;
        setChoices(list);
      },
      onHud: (h) => {
        const s = shown.current;
        if (s.score !== h.score) {
          s.score = h.score;
          if (scoreRef.current) scoreRef.current.textContent = formatInt(h.score);
        }
        if (s.wave !== h.wave) {
          s.wave = h.wave;
          if (waveRef.current) waveRef.current.textContent = h.wave;
        }
        const t = Math.floor(h.time);
        if (s.t !== t) {
          s.t = t;
          if (timeRef.current) timeRef.current.textContent = clock(t);
        }
        if (s.kills !== h.kills) {
          s.kills = h.kills;
          if (killRef.current) killRef.current.textContent = formatInt(h.kills);
        }
        const hp = Math.ceil(h.hp);
        if (s.hp !== hp || s.maxHp !== h.maxHp) {
          s.hp = hp;
          s.maxHp = h.maxHp;
          if (hpTextRef.current) hpTextRef.current.textContent = `${hp} / ${h.maxHp}`;
          if (hpRef.current) {
            hpRef.current.style.transform = `scaleX(${Math.max(0, h.hp / h.maxHp).toFixed(3)})`;
            hpRef.current.parentElement.classList.toggle('is-low', h.hp / h.maxHp < 0.3);
          }
        }
        if (xpRef.current) xpRef.current.style.transform = `scaleX(${h.xp.toFixed(3)})`;
        if (s.level !== h.level) {
          s.level = h.level;
          if (levelRef.current) levelRef.current.textContent = h.level;
        }
        if (dashRef.current) dashRef.current.style.transform = `scaleX(${Math.min(1, h.dash).toFixed(3)})`;
        const ready = h.dash >= 1;
        if (s.ready !== ready) {
          s.ready = ready;
          dashWrapRef.current?.classList.toggle('is-ready', ready);
        }
        const hasBoss = h.boss >= 0;
        if (s.hasBoss !== hasBoss) {
          s.hasBoss = hasBoss;
          bossWrapRef.current?.classList.toggle('is-on', hasBoss);
        }
        if (hasBoss && bossRef.current) bossRef.current.style.transform = `scaleX(${h.boss.toFixed(3)})`;
        if (hurtRef.current) hurtRef.current.style.opacity = (h.hurt * 0.85).toFixed(2);
      },
      onState: (state, payload) => {
        phaseRef.current = state;
        setPhase(state);
        if (state === 'play') {
          choicesRef.current = null;
          setChoices(null);
        }
        if (state === 'over' && payload) {
          const isBest = payload.score > bestRef.current;
          if (isBest) {
            bestRef.current = payload.score;
            saveBest('swarm-survivor', payload.score);
            setBest(payload.score);
          }
          setResult({ ...payload, isBest });
        }
      },
    });
    engineRef.current = engine;
    return () => {
      engineRef.current = null;
      engine.destroy();
    };
  }, [audio, pushPop]);

  const applyPause = useCallback(
    (p) => {
      if (p && (phaseRef.current !== 'play' || choicesRef.current)) return;
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
    choicesRef.current = null;
    setChoices(null);
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

  const choose = useCallback((id) => {
    engineRef.current?.choose(id);
  }, []);

  useEffect(() => {
    const down = (e) => {
      const ph = phaseRef.current;
      const list = choicesRef.current;
      if (list) {
        const i = ['Digit1', 'Digit2', 'Digit3', 'Numpad1', 'Numpad2', 'Numpad3'].indexOf(e.code);
        if (i >= 0 && list[i % 3]) {
          e.preventDefault();
          choose(list[i % 3].id);
        }
        if (MOVE_KEYS.has(e.code) || DASH_KEYS.has(e.code)) e.preventDefault();
        return;
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (ph === 'play') applyPause(!pausedRef.current);
        else if (e.code === 'Escape') onExit();
        return;
      }
      if (e.code === 'Enter' && pausedRef.current) {
        e.preventDefault();
        applyPause(false);
        return;
      }
      if ((e.code === 'Enter' && (ph === 'menu' || ph === 'over')) || (e.code === 'Space' && ph === 'menu')) {
        e.preventDefault();
        start();
        return;
      }
      if (MOVE_KEYS.has(e.code)) {
        e.preventDefault();
        engineRef.current?.setKey(e.code, true);
      } else if (DASH_KEYS.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) engineRef.current?.dash();
      }
    };
    const up = (e) => {
      if (MOVE_KEYS.has(e.code)) engineRef.current?.setKey(e.code, false);
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
  }, [applyPause, choose, onExit, start]);

  const playing = phase === 'play' || phase === 'dead';

  return (
    <div className="gm-game gm-game--survivor">
      <canvas ref={canvasRef} className="gm-canvas" />
      <div className="gm-vignette" aria-hidden="true" />
      <div className="gm-hurt" ref={hurtRef} aria-hidden="true" />

      <TopBar title="Swarm Survivor" tag="Arena Shooter" paused={paused} canPause={phase === 'play' && !choices} onPause={() => applyPause(!paused)} onExit={onExit} />

      <div className={`gm-hud ${playing ? 'is-on' : ''}`} aria-hidden={!playing}>
        <div className="gm-hud__tl">
          <span className="gm-label">Skor</span>
          <div className="gm-score" ref={scoreRef}>
            0
          </div>
          <div className="gm-chips">
            <span>
              <Swords size={12} /> Gelombang <b ref={waveRef}>0</b>
            </span>
            <span>
              <Timer size={12} /> <b ref={timeRef}>00:00</b>
            </span>
          </div>
        </div>
        <div className="gm-hud__tr">
          <div className="gm-stat">
            <span className="gm-label">Tumbang</span>
            <span className="gm-stat__v">
              <b ref={killRef}>0</b>
            </span>
          </div>
          <div className="gm-stat">
            <span className="gm-label">Terbaik</span>
            <span className="gm-stat__v">
              <b>{formatInt(best)}</b>
            </span>
          </div>
        </div>

        <div className="gm-boss" ref={bossWrapRef}>
          <span className="gm-label">
            <Skull size={12} /> Bos
          </span>
          <span className="gm-boss__track">
            <i ref={bossRef} />
          </span>
        </div>

        <div className="gm-vitals">
          <div className="gm-vitals__row">
            <span className="gm-level">
              <small>LV</small>
              <b ref={levelRef}>1</b>
            </span>
            <div className="gm-hp">
              <div className="gm-hp__head">
                <span className="gm-label">HP</span>
                <span className="gm-hp__num" ref={hpTextRef}>
                  100 / 100
                </span>
              </div>
              <span className="gm-hp__track">
                <i ref={hpRef} />
              </span>
            </div>
            <div className="gm-dash" ref={dashWrapRef}>
              <span className="gm-label">Dash</span>
              <span className="gm-dash__track">
                <i ref={dashRef} />
              </span>
            </div>
          </div>
          <span className="gm-xp">
            <i ref={xpRef} />
          </span>
        </div>
        <div className="gm-zone" ref={bannerRef} />
      </div>
      <div className="gm-pops" ref={popRef} aria-live="polite" />

      {phase === 'play' && !choices && (
        <div className="gm-touchpad gm-touchpad--right">
          <HoldButton onHold={(d) => d && engineRef.current?.dash()} label="Dash" className="gm-touch--accent">
            <ChevronsRight size={28} />
          </HoldButton>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" className="gm-overlay gm-overlay--clear gm-overlay--side" {...panelMotion}>
            <div className="gm-panel gm-panel--hero">
              <span className="gm-kicker">Arena Shooter · Roguelite</span>
              <h2 className="gm-title">
                Swarm <em>Survivor</em>
              </h2>
              <p className="gm-sub">Bertahan dari gelombang musuh yang terus membesar. Kumpulkan XP, pilih upgrade, dan kalahkan bos tiap lima gelombang.</p>
              <ul className="gm-keys gm-keys--touch">
                <li>
                  <kbd>Geser</kbd>
                  <span>Gerak, tembakan otomatis</span>
                </li>
                <li>
                  <kbd>
                    <ChevronsRight size={11} />
                  </kbd>
                  <span>Dash</span>
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
                  <kbd>Mouse</kbd>
                  <span>Bidik</span>
                </li>
                <li>
                  <kbd>Spasi</kbd>
                  <span>Dash</span>
                </li>
                <li>
                  <kbd>Esc</kbd>
                  <span>Jeda</span>
                </li>
              </ul>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={start} data-cursor-label="Mulai">
                  <Play size={18} /> Masuk Arena
                </button>
              </div>
              <div className="gm-best">
                <Trophy size={14} /> Skor terbaik <b>{formatInt(best)}</b>
              </div>
            </div>
          </motion.div>
        )}

        {choices && (
          <motion.div key="levelup" className="gm-overlay" {...panelMotion}>
            <div className="gm-levelup">
              <span className="gm-kicker">Naik level</span>
              <h2 className="gm-title gm-title--sm">Pilih satu upgrade</h2>
              <div className="gm-cards">
                {choices.map((c, i) => {
                  const Icon = ICONS[c.id] || Zap;
                  return (
                    <motion.button
                      key={`${c.id}-${c.level}`}
                      type="button"
                      className="gm-card"
                      onClick={() => choose(c.id)}
                      data-cursor-label="Pilih"
                      initial={{ opacity: 0, y: 30, rotateX: -18 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.07 }}
                    >
                      <span className="gm-card__key">{i + 1}</span>
                      <span className="gm-card__icon">
                        <Icon size={26} />
                      </span>
                      <strong>{c.name}</strong>
                      <span className="gm-card__desc">{c.desc}</span>
                      <span className="gm-card__pips" aria-label={`Level ${c.level + 1} dari ${c.max}`}>
                        {Array.from({ length: c.max }, (_, n) => (
                          <i key={n} className={n < c.level ? 'is-on' : n === c.level ? 'is-next' : ''} />
                        ))}
                      </span>
                      <span className="gm-card__tag">{c.level === 0 ? 'Baru' : `Lv ${c.level} → ${c.level + 1}`}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {paused && !choices && (
          <motion.div key="pause" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">Dijeda</span>
              <h2 className="gm-title gm-title--sm">Arena menunggu</h2>
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
              <span className="gm-kicker">{result.isBest ? 'Rekor baru!' : 'Kamu tumbang'}</span>
              <h2 className="gm-title gm-title--score">{formatInt(result.score)}</h2>
              <div className="gm-results">
                <div>
                  <Swords size={16} />
                  <b>{result.wave}</b>
                  <span>gelombang</span>
                </div>
                <div>
                  <Skull size={16} />
                  <b>{formatInt(result.kills)}</b>
                  <span>musuh tumbang</span>
                </div>
                <div>
                  <Timer size={16} />
                  <b>{clock(result.time)}</b>
                  <span>bertahan</span>
                </div>
                <div>
                  <Zap size={16} />
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
