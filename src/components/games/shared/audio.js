// Mesin audio kecil untuk game Playground: efek sintetis, dengung mesin, dan musik
// generatif. Semuanya dibuat dengan Web Audio, jadi tidak ada berkas suara yang diunduh.

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

const PATTERNS = {
  // Synthwave santai untuk balapan
  drive: {
    bpm: 104,
    bars: [
      { root: 45, tones: [57, 60, 64, 69] },
      { root: 41, tones: [57, 60, 65, 69] },
      { root: 48, tones: [55, 60, 64, 67] },
      { root: 43, tones: [55, 59, 62, 67] },
    ],
    arpType: 'triangle',
    arpVol: 0.05,
  },
  // Lebih gelap dan mendesak untuk arena
  arena: {
    bpm: 122,
    bars: [
      { root: 38, tones: [57, 62, 65, 69] },
      { root: 38, tones: [57, 62, 65, 72] },
      { root: 34, tones: [58, 62, 65, 70] },
      { root: 36, tones: [55, 60, 64, 72] },
    ],
    arpType: 'square',
    arpVol: 0.028,
  },
};

export function createGameAudio() {
  let ctx = null;
  let master = null;
  let musicBus = null;
  let enabled = true;
  let noiseBuf = null;
  let engine = null;
  let music = null;
  let disposed = false;

  const ensure = () => {
    if (disposed) return null;
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = enabled ? 1 : 0;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ctx.destination);

      // Bus musik dengan gema tipis agar terasa lapang
      musicBus = ctx.createGain();
      musicBus.gain.value = 0.9;
      const delay = ctx.createDelay(1);
      delay.delayTime.value = 0.29;
      const fb = ctx.createGain();
      fb.gain.value = 0.32;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      musicBus.connect(master);
      musicBus.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      const len = ctx.sampleRate;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } catch {
      ctx = null;
    }
    return ctx;
  };

  const unlock = () => {
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  };

  const tone = ({ freq = 440, to, dur = 0.12, type = 'sine', vol = 0.12, delay = 0, attack = 0.006, out } = {}) => {
    if (!enabled || !ensure()) return;
    try {
      const t = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(out || master);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {
      /* abaikan */
    }
  };

  const noise = ({ dur = 0.2, vol = 0.15, from = 1200, to, q = 0.8, type = 'bandpass', delay = 0, out } = {}) => {
    if (!enabled || !ensure()) return;
    try {
      const t = ctx.currentTime + delay;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.Q.value = q;
      f.frequency.setValueAtTime(from, t);
      if (to) f.frequency.exponentialRampToValueAtTime(Math.max(30, to), t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f);
      f.connect(g);
      g.connect(out || master);
      src.start(t, Math.random() * 0.5);
      src.stop(t + dur + 0.02);
    } catch {
      /* abaikan */
    }
  };

  // ---- Dengung mesin (balapan) ----
  const startEngine = () => {
    if (engine || !ensure()) return;
    try {
      const g = ctx.createGain();
      g.gain.value = 0;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 500;
      lp.Q.value = 2;
      const o1 = ctx.createOscillator();
      o1.type = 'sawtooth';
      const o2 = ctx.createOscillator();
      o2.type = 'square';
      const g2 = ctx.createGain();
      g2.gain.value = 0.35;
      o1.connect(lp);
      o2.connect(g2);
      g2.connect(lp);
      lp.connect(g);
      g.connect(master);
      // desis angin
      const wind = ctx.createBufferSource();
      wind.buffer = noiseBuf;
      wind.loop = true;
      const wf = ctx.createBiquadFilter();
      wf.type = 'bandpass';
      wf.frequency.value = 900;
      wf.Q.value = 0.5;
      const wg = ctx.createGain();
      wg.gain.value = 0;
      wind.connect(wf);
      wf.connect(wg);
      wg.connect(master);
      o1.start();
      o2.start();
      wind.start();
      engine = { g, lp, o1, o2, wind, wf, wg };
    } catch {
      engine = null;
    }
  };

  const setEngine = (n, boost = 0) => {
    if (!engine || !ctx) return;
    const t = ctx.currentTime;
    const f = 52 + n * 78 + boost * 26;
    engine.o1.frequency.setTargetAtTime(f, t, 0.08);
    engine.o2.frequency.setTargetAtTime(f * 0.5, t, 0.08);
    engine.lp.frequency.setTargetAtTime(380 + n * 900 + boost * 900, t, 0.1);
    engine.g.gain.setTargetAtTime(0.045 + n * 0.03 + boost * 0.03, t, 0.1);
    engine.wf.frequency.setTargetAtTime(700 + n * 1500 + boost * 900, t, 0.1);
    engine.wg.gain.setTargetAtTime(0.01 + n * 0.035 + boost * 0.04, t, 0.1);
  };

  const stopEngine = () => {
    if (!engine || !ctx) return;
    const e = engine;
    engine = null;
    const t = ctx.currentTime;
    e.g.gain.setTargetAtTime(0, t, 0.08);
    e.wg.gain.setTargetAtTime(0, t, 0.08);
    setTimeout(() => {
      try {
        e.o1.stop();
        e.o2.stop();
        e.wind.stop();
      } catch {
        /* sudah berhenti */
      }
    }, 500);
  };

  // ---- Musik generatif ----
  const startMusic = (name) => {
    if (music || !ensure()) return;
    const p = PATTERNS[name] || PATTERNS.drive;
    const stepDur = 60 / p.bpm / 4;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
    bus.connect(musicBus);
    const dry = ctx.createGain();
    dry.gain.value = 0;
    dry.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
    dry.connect(master);
    const state = { step: 0, next: ctx.currentTime + 0.1, bus, dry, timer: 0 };

    const schedule = () => {
      if (!ctx || ctx.state !== 'running') return;
      while (state.next < ctx.currentTime + 0.18) {
        const s = state.step % 16;
        const bar = p.bars[Math.floor(state.step / 16) % p.bars.length];
        const d = Math.max(0, state.next - ctx.currentTime);
        if (enabled) {
          // bass tiap 1/8
          if (s % 2 === 0) {
            const up = s === 6 || s === 14;
            tone({ freq: midi(bar.root + (up ? 12 : 0)), dur: stepDur * 1.7, type: 'sawtooth', vol: 0.055, delay: d, out: dry });
            tone({ freq: midi(bar.root - 12), dur: stepDur * 1.7, type: 'sine', vol: 0.08, delay: d, out: dry });
          }
          // arpeggio naik-turun
          const order = [0, 1, 2, 3, 2, 1, 3, 2];
          const note = bar.tones[order[s % 8]] + (s >= 8 ? 12 : 0);
          tone({ freq: midi(note), dur: stepDur * 1.4, type: p.arpType, vol: p.arpVol * (s % 4 === 0 ? 1.3 : 1), delay: d, out: bus });
          // kick, snare, hi-hat
          if (s % 4 === 0) tone({ freq: 130, to: 42, dur: 0.16, type: 'sine', vol: 0.2, delay: d, out: dry });
          if (s === 4 || s === 12) noise({ dur: 0.12, vol: 0.05, from: 1800, q: 0.6, delay: d, out: dry });
          if (s % 2 === 1) noise({ dur: 0.03, vol: 0.022, from: 7000, type: 'highpass', delay: d, out: dry });
        }
        state.step += 1;
        state.next += stepDur;
      }
    };
    state.timer = setInterval(schedule, 50);
    music = state;
  };

  const stopMusic = () => {
    if (!music) return;
    clearInterval(music.timer);
    const m = music;
    music = null;
    try {
      m.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      m.dry.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setTimeout(() => {
        m.bus.disconnect();
        m.dry.disconnect();
      }, 900);
    } catch {
      /* abaikan */
    }
  };

  const setEnabled = (v) => {
    enabled = !!v;
    if (ctx && master) master.gain.setTargetAtTime(enabled ? 1 : 0, ctx.currentTime, 0.03);
  };

  // Saat jeda: hentikan jam audio supaya musik dan mesin ikut diam.
  const setPaused = (p) => {
    if (!ctx) return;
    if (p && ctx.state === 'running') ctx.suspend().catch(() => {});
    else if (!p && ctx.state === 'suspended') {
      if (music) music.next = ctx.currentTime + 0.1;
      ctx.resume().catch(() => {});
    }
  };

  const dispose = () => {
    stopMusic();
    stopEngine();
    disposed = true;
    const c = ctx;
    ctx = null;
    if (c) setTimeout(() => c.close().catch(() => {}), 300);
  };

  return { unlock, tone, noise, startEngine, setEngine, stopEngine, startMusic, stopMusic, setEnabled, setPaused, dispose };
}

// ---- Skor terbaik ----
export function loadBest(key) {
  try {
    return Number(localStorage.getItem(`pg-best-${key}`)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(key, value) {
  try {
    localStorage.setItem(`pg-best-${key}`, String(Math.floor(value)));
  } catch {
    /* penyimpanan tak tersedia — skor hanya berlaku di sesi ini */
  }
}
