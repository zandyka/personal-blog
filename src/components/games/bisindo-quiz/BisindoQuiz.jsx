import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Eye, EyeOff, Flame, Hand, Play, RotateCcw, SkipForward, Target, Trophy } from 'lucide-react';
import { useHandSpeakAI } from '../../handspeak/useHandSpeakAI';
import { TopBar, formatInt, useGameAudio } from '../shared/GameChrome';
import { loadBest, saveBest } from '../shared/audio';

const ROUND_SECONDS = 60;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
// Tebak Isyarat memakai kamus bergambar; Y dan Z berbagi satu kotak, jadi tidak ditanyakan.
const GUESS_LETTERS = LETTERS.slice(0, 24);

// Posisi tiap kotak huruf di gambar kamus (1080×1080, kisi 5×5).
const CELL_X = [117, 288, 458, 628, 797];
const CELL_Y = [243, 402, 560, 717, 875];
const signStyle = (letter) => {
  const i = Math.min(24, LETTERS.indexOf(letter));
  return {
    backgroundImage: 'url(/handspeak/kamus_bisindo.jpg)',
    backgroundSize: `${(1080 / 170) * 100}% ${(1080 / 158) * 100}%`,
    backgroundPosition: `${(CELL_X[i % 5] / (1080 - 170)) * 100}% ${(CELL_Y[Math.floor(i / 5)] / (1080 - 158)) * 100}%`,
  };
};

const pickLetter = (pool, prev) => {
  let l = prev;
  while (l === prev) l = pool[Math.floor(Math.random() * pool.length)];
  return l;
};
const makeGuess = (prev) => {
  const answer = pickLetter(GUESS_LETTERS, prev);
  const options = [answer];
  while (options.length < 4) {
    const o = GUESS_LETTERS[Math.floor(Math.random() * GUESS_LETTERS.length)];
    if (!options.includes(o)) options.push(o);
  }
  return { answer, options: options.sort(() => Math.random() - 0.5) };
};

const panelMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

// Kamera + model hanya dimuat saat mode Peragakan dipilih.
function CameraStage({ target, active, onMatch }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ai = useHandSpeakAI(videoRef, canvasRef);
  const { startCamera, isModelReady, isCameraActive, currentLetter, confidence, error } = ai;
  const holdRef = useRef(null);
  const [hold, setHold] = useState(0);

  useEffect(() => {
    if (isModelReady && !isCameraActive && !error) startCamera();
  }, [isModelReady, isCameraActive, error, startCamera]);

  // Isyarat dihitung benar bila ditahan stabil setengah detik.
  const matching = active && currentLetter === target && confidence >= 0.6;
  useEffect(() => {
    if (!matching) {
      holdRef.current = null;
      return undefined;
    }
    holdRef.current = performance.now();
    const id = setInterval(() => {
      const t = holdRef.current ? (performance.now() - holdRef.current) / 500 : 0;
      setHold(Math.min(1, t));
      if (t >= 1) {
        holdRef.current = null;
        clearInterval(id);
        onMatch();
      }
    }, 50);
    return () => {
      clearInterval(id);
      setHold(0);
    };
  }, [matching, target, onMatch]);

  return (
    <div className="bq-cam">
      <video ref={videoRef} playsInline muted style={{ display: isCameraActive ? 'block' : 'none' }} />
      <canvas ref={canvasRef} style={{ display: isCameraActive ? 'block' : 'none' }} />
      {!isCameraActive && <div className="bq-cam__wait">{error || (isModelReady ? 'Menunggu izin kamera…' : 'Memuat model pengenal isyarat…')}</div>}
      {isCameraActive && (
        <div className="bq-cam__read">
          <span>
            Terbaca <b>{currentLetter}</b>
          </span>
          <span>{Math.round(confidence * 100)}%</span>
          <i style={{ transform: `scaleX(${matching ? hold : 0})` }} />
        </div>
      )}
    </div>
  );
}

export default function BisindoQuiz({ onExit }) {
  const audio = useGameAudio();
  const [phase, setPhase] = useState('menu'); // menu | play | over
  const [mode, setMode] = useState('guess'); // guess | camera
  const [time, setTime] = useState(ROUND_SECONDS);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(() => ({ answer: 'A', options: ['A', 'B', 'C', 'D'] }));
  const [flash, setFlash] = useState(null); // 'good' | 'bad'
  const [hint, setHint] = useState(true);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => ({ guess: loadBest('bisindo-guess'), camera: loadBest('bisindo-camera') }));

  const stats = useRef({ correct: 0, wrong: 0, bestStreak: 0, roundAt: 0, endAt: 0, xp: 0, streak: 0 });
  const phaseRef = useRef('menu');
  const modeRef = useRef(mode);
  const roundRef = useRef(round);
  const bestRef = useRef(best);

  const nextRound = useCallback((prev) => {
    const r = modeRef.current === 'camera' ? { answer: pickLetter(LETTERS, prev), options: [] } : makeGuess(prev);
    stats.current.roundAt = performance.now();
    roundRef.current = r;
    setRound(r);
  }, []);

  const start = useCallback(
    (m) => {
      audio.unlock();
      modeRef.current = m;
      setMode(m);
      stats.current = { correct: 0, wrong: 0, bestStreak: 0, roundAt: performance.now(), endAt: performance.now() + ROUND_SECONDS * 1000, xp: 0, streak: 0 };
      setXp(0);
      setStreak(0);
      setTime(ROUND_SECONDS);
      setResult(null);
      nextRound(null);
      phaseRef.current = 'play';
      setPhase('play');
      audio.startMusic('arena');
    },
    [audio, nextRound],
  );

  const finish = useCallback(() => {
    if (phaseRef.current !== 'play') return;
    phaseRef.current = 'over';
    setPhase('over');
    audio.stopMusic();
    audio.tone({ freq: 523, dur: 0.12, type: 'square', vol: 0.09 });
    audio.tone({ freq: 392, dur: 0.3, type: 'square', vol: 0.09, delay: 0.12 });
    const s = stats.current;
    const key = modeRef.current === 'camera' ? 'camera' : 'guess';
    const isBest = s.xp > bestRef.current[key];
    if (isBest) {
      bestRef.current = { ...bestRef.current, [key]: s.xp };
      saveBest(`bisindo-${key}`, s.xp);
      setBest(bestRef.current);
    }
    setResult({ xp: s.xp, correct: s.correct, wrong: s.wrong, bestStreak: s.bestStreak, isBest });
  }, [audio]);

  // penghitung waktu
  useEffect(() => {
    if (phase !== 'play') return undefined;
    const id = setInterval(() => {
      const left = (stats.current.endAt - performance.now()) / 1000;
      if (left <= 0) {
        setTime(0);
        finish();
      } else setTime(left);
    }, 100);
    return () => clearInterval(id);
  }, [phase, finish]);

  const pulse = (kind) => {
    setFlash(kind);
    setTimeout(() => setFlash(null), 260);
  };

  const correct = useCallback(() => {
    if (phaseRef.current !== 'play') return;
    const s = stats.current;
    const took = (performance.now() - s.roundAt) / 1000;
    s.streak += 1;
    s.correct += 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    const gain = Math.round((10 + Math.max(0, 10 - took * 2.5)) * (1 + Math.min(10, s.streak - 1) * 0.1));
    s.xp += gain;
    setXp(s.xp);
    setStreak(s.streak);
    pulse('good');
    audio.tone({ freq: 660 + Math.min(8, s.streak) * 40, to: 1320, dur: 0.12, type: 'square', vol: 0.08 });
    nextRound(roundRef.current.answer);
  }, [audio, nextRound]);

  const miss = useCallback(
    (penalty) => {
      if (phaseRef.current !== 'play') return;
      const s = stats.current;
      s.streak = 0;
      s.wrong += 1;
      s.endAt -= penalty * 1000;
      setStreak(0);
      pulse('bad');
      audio.tone({ freq: 180, to: 90, dur: 0.18, type: 'sawtooth', vol: 0.09 });
      nextRound(roundRef.current.answer);
    },
    [audio, nextRound],
  );

  const answer = useCallback(
    (letter) => {
      if (letter === roundRef.current.answer) correct();
      else miss(2);
    },
    [correct, miss],
  );

  const toMenu = useCallback(() => {
    phaseRef.current = 'menu';
    setPhase('menu');
    audio.stopMusic();
  }, [audio]);

  useEffect(() => {
    const down = (e) => {
      const ph = phaseRef.current;
      if (e.code === 'Escape') {
        e.preventDefault();
        if (ph === 'play') toMenu();
        else onExit();
        return;
      }
      if (ph !== 'play') return;
      if (modeRef.current === 'guess') {
        const i = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4'].indexOf(e.code);
        const opt = roundRef.current.options[i % 4];
        if (i >= 0 && opt) {
          e.preventDefault();
          answer(opt);
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) miss(3);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [answer, miss, onExit, toMenu]);

  useEffect(() => {
    if (import.meta.env.DEV) window.__pg = { game: 'bisindo-quiz', answer: () => roundRef.current.answer };
  }, []);

  const mult = useMemo(() => (1 + Math.min(10, Math.max(0, streak - 1)) * 0.1).toFixed(1), [streak]);
  const playing = phase === 'play';

  return (
    <div className={`gm-game gm-game--pixel gm-game--retro rt-quiz ${flash ? `is-${flash}` : ''}`}>
      <TopBar title="BISINDO Speed Quiz" tag="Retro Sign Quiz" canPause={false} onExit={onExit} />

      <div className="rt-stage">
        <div className={`rt-hud ${playing ? 'is-on' : ''}`}>
          <div>
            <span className="gm-label">XP</span>
            <b className="bq-xp">{formatInt(xp)}</b>
          </div>
          <div>
            <span className="gm-label">Beruntun</span>
            <b>
              {streak} <small>x{mult}</small>
            </b>
          </div>
          <div>
            <span className="gm-label">Waktu</span>
            <b className={time < 10 ? 'is-low' : ''}>{Math.ceil(time)}</b>
          </div>
        </div>
        <span className="bq-timer" aria-hidden="true">
          <i style={{ transform: `scaleX(${Math.max(0, time / ROUND_SECONDS)})` }} />
        </span>

        {playing && mode === 'guess' && (
          <div className="bq-board">
            <div className="bq-sign" style={signStyle(round.answer)} key={round.answer}>
              <span className="bq-sign__mask">?</span>
            </div>
            <p className="bq-ask">Huruf apa isyarat ini?</p>
            <div className="bq-options">
              {round.options.map((o, i) => (
                <button key={o} type="button" className="bq-option" data-letter={o} onClick={() => answer(o)} data-cursor-label="Pilih">
                  <kbd>{i + 1}</kbd>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {playing && mode === 'camera' && (
          <div className="bq-board bq-board--cam">
            <div className="bq-target">
              <span className="gm-label">Peragakan huruf</span>
              <strong key={round.answer}>{round.answer}</strong>
              {hint && <div className="bq-sign bq-sign--hint" style={signStyle(round.answer)} />}
              <div className="bq-target__actions">
                <button type="button" className="gm-btn" onClick={() => setHint((h) => !h)}>
                  {hint ? <EyeOff size={14} /> : <Eye size={14} />} Contekan
                </button>
                <button type="button" className="gm-btn" onClick={() => miss(3)}>
                  <SkipForward size={14} /> Lewati
                </button>
              </div>
            </div>
            <CameraStage target={round.answer} active={playing} onMatch={correct} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel gm-panel--hero">
              <span className="gm-kicker">Retro Sign Quiz · 60 detik</span>
              <h2 className="gm-title">
                BISINDO <em>Speed Quiz</em>
              </h2>
              <p className="gm-sub">Kumpulkan XP sebanyak mungkin dalam satu menit. Jawaban beruntun menaikkan pengali; jawaban cepat memberi bonus.</p>
              <div className="bq-modes">
                <button type="button" className="bq-mode" onClick={() => start('guess')} data-cursor-label="Main">
                  <Hand size={26} />
                  <strong>Tebak Isyarat</strong>
                  <span>Lihat gambar isyarat, pilih hurufnya. Tanpa kamera.</span>
                  <em>
                    <Trophy size={12} /> {formatInt(best.guess)} XP
                  </em>
                </button>
                <button type="button" className="bq-mode" onClick={() => start('camera')} data-cursor-label="Main">
                  <Camera size={26} />
                  <strong>Peragakan</strong>
                  <span>Peragakan huruf di depan webcam; AI HandSpeak yang menilai.</span>
                  <em>
                    <Trophy size={12} /> {formatInt(best.camera)} XP
                  </em>
                </button>
              </div>
              <ul className="gm-keys gm-keys--desk">
                <li>
                  <kbd>1</kbd>
                  <kbd>2</kbd>
                  <kbd>3</kbd>
                  <kbd>4</kbd>
                  <span>Pilih jawaban</span>
                </li>
                <li>
                  <kbd>Spasi</kbd>
                  <span>Lewati (mode kamera)</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {phase === 'over' && result && (
          <motion.div key="over" className="gm-overlay" {...panelMotion}>
            <div className="gm-panel">
              <span className="gm-kicker">{result.isBest ? 'Rekor baru!' : 'Waktu habis'}</span>
              <h2 className="gm-title gm-title--score">{formatInt(result.xp)} XP</h2>
              <div className="gm-results">
                <div>
                  <Target size={16} />
                  <b>{result.correct}</b>
                  <span>benar</span>
                </div>
                <div>
                  <SkipForward size={16} />
                  <b>{result.wrong}</b>
                  <span>{mode === 'camera' ? 'dilewati' : 'salah'}</span>
                </div>
                <div>
                  <Flame size={16} />
                  <b>{result.bestStreak}</b>
                  <span>beruntun terbaik</span>
                </div>
              </div>
              <div className="gm-actions">
                <button type="button" className="gm-btn gm-btn--primary" onClick={() => start(mode)} data-cursor-label="Lagi">
                  <RotateCcw size={18} /> Main Lagi
                </button>
                <button type="button" className="gm-btn" onClick={toMenu}>
                  <Play size={16} /> Ganti mode
                </button>
              </div>
              <div className="gm-best">
                <Trophy size={14} /> XP terbaik <b>{formatInt(best[mode === 'camera' ? 'camera' : 'guess'])}</b>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
