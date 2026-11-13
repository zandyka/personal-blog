// Swarm Survivor — arena shooter top-down (Canvas 2D).
// Bertahan dari gelombang musuh, kumpulkan XP, pilih upgrade tiap naik level.

const TAU = Math.PI * 2;
const ARENA = { w: 2800, h: 2000 };
const CELL = 64;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const damp = (dt, k) => 1 - Math.exp(-dt * k);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const C = {
  player: '#5ef2ff',
  bullet: '#bdfbff',
  crit: '#ffd15c',
  orbit: '#b47bff',
  nova: '#7fa8ff',
  missile: '#ff9f43',
  chain: '#e8f0ff',
  heart: '#ff5d8f',
  hostile: '#ff4d6d',
};

const ENEMY = {
  drone: { r: 12, hp: 16, spd: 98, dmg: 9, xp: 1, cost: 1, color: '#ff5d7d', sides: 3, from: 1, weight: 10 },
  dart: { r: 9, hp: 9, spd: 172, dmg: 7, xp: 1, cost: 1, color: '#ffb347', sides: 0, from: 2, weight: 6 },
  splitter: { r: 17, hp: 44, spd: 76, dmg: 11, xp: 3, cost: 3, color: '#5dff9b', sides: 4, from: 3, weight: 4 },
  mini: { r: 8, hp: 9, spd: 132, dmg: 6, xp: 1, cost: 0, color: '#5dff9b', sides: 4, from: 99, weight: 0 },
  spitter: { r: 14, hp: 34, spd: 74, dmg: 9, xp: 3, cost: 3, color: '#ff7bf2', sides: 5, from: 4, weight: 4 },
  brute: { r: 25, hp: 125, spd: 58, dmg: 20, xp: 6, cost: 5, color: '#b47bff', sides: 6, from: 5, weight: 3 },
  boss: { r: 58, hp: 1500, spd: 58, dmg: 26, xp: 60, cost: 0, color: '#ff3b5c', sides: 8, from: 99, weight: 0 },
};

export const UPGRADES = [
  { id: 'damage', name: 'Inti Plasma', desc: 'Damage semua senjata +25%', max: 6 },
  { id: 'rate', name: 'Pemicu Cepat', desc: 'Kecepatan tembak +18%', max: 6 },
  { id: 'multi', name: 'Laras Ganda', desc: '+1 peluru di setiap tembakan', max: 4 },
  { id: 'pierce', name: 'Peluru Tembus', desc: 'Peluru menembus +1 musuh', max: 4 },
  { id: 'orbit', name: 'Bilah Orbit', desc: '+1 bilah energi yang mengitarimu', max: 5 },
  { id: 'nova', name: 'Gelombang Nova', desc: 'Ledakan kejut berkala yang mementalkan musuh', max: 5 },
  { id: 'missile', name: 'Rudal Pelacak', desc: 'Rudal otomatis yang meledak di kerumunan', max: 5 },
  { id: 'chain', name: 'Petir Berantai', desc: 'Sambaran petir yang melompat antar musuh', max: 5 },
  { id: 'speed', name: 'Pendorong', desc: 'Kecepatan gerak +12%', max: 4 },
  { id: 'hp', name: 'Lapis Baja', desc: 'HP maksimum +25 dan pulih 30 HP', max: 5 },
  { id: 'regen', name: 'Nanobot', desc: 'Pulih 0,8 HP setiap detik', max: 4 },
  { id: 'magnet', name: 'Medan Magnet', desc: 'Jangkauan ambil XP +45%', max: 4 },
  { id: 'crit', name: 'Bidikan Tajam', desc: 'Peluang serangan kritikal +12%', max: 5 },
  { id: 'dash', name: 'Dash Kilat', desc: 'Cooldown dash 18% lebih singkat', max: 4 },
];

/* ---- sprite cahaya (di-cache per warna) ---- */
const glowCache = new Map();
function glowSprite(color) {
  let c = glowCache.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, `${color}ff`);
  gr.addColorStop(0.22, `${color}88`);
  gr.addColorStop(0.55, `${color}22`);
  gr.addColorStop(1, `${color}00`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  glowCache.set(color, c);
  return c;
}

// Awan warna digambar sekali ke kanvas kecil, lalu direntangkan: satu blit per frame.
let nebulaCanvas = null;
function nebulaLayer() {
  if (nebulaCanvas) return nebulaCanvas;
  const k = 0.125;
  const c = document.createElement('canvas');
  c.width = ARENA.w * k;
  c.height = ARENA.h * k;
  const g = c.getContext('2d');
  g.globalCompositeOperation = 'lighter';
  for (const n of NEBULA) {
    g.globalAlpha = n.a;
    g.drawImage(glowSprite(n.color), (n.x - n.size / 2) * k, (n.y - n.size / 2) * k, n.size * k, n.size * k);
  }
  nebulaCanvas = c;
  return c;
}

function compact(arr, dead) {
  let n = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!dead(arr[i])) arr[n++] = arr[i];
  }
  arr.length = n;
}

// Awan warna dan debu yang diam di dunia: memberi kedalaman dan rasa bergerak.
const NEBULA = [];
const NEBULA_COLORS = ['#4b2bd6', '#1f6bff', '#b02cc9', '#0fa6a0', '#6a3df0'];
for (let i = 0; i < 16; i++) {
  NEBULA.push({ x: ((i * 733) % 2800) + 60, y: ((i * 1291) % 2000) + 40, size: 620 + ((i * 197) % 520), color: NEBULA_COLORS[i % NEBULA_COLORS.length], a: 0.1 + ((i * 37) % 9) / 100 });
}
const DUST = [];
for (let i = 0; i < 150; i++) {
  DUST.push({ x: (i * 977.3) % 2800, y: (i * 613.7) % 2000, s: 1 + (i % 3) * 0.7, p: 0.5 + ((i * 31) % 40) / 100, ph: i * 1.7 });
}

export function createSwarmSurvivor(canvas, cb = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const audio = cb.audio;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let zoom = 1;

  const G = { phase: 'menu', paused: false, t: 0, time: 0, timeScale: 1, slow: 0, score: 0, kills: 0, shake: 0, hurt: 0, pending: 0, deadT: 0, gemStreak: 0, gemT: 0 };
  const L = {};
  const S = {};
  const P = { x: ARENA.w / 2, y: ARENA.h / 2, vx: 0, vy: 0, r: 13, hp: 100, aim: -Math.PI / 2, inv: 0, dashT: 0, dashCd: 0, dx: 0, dy: -1, fireT: 0, level: 1, xp: 0, xpNext: 6, orbA: 0, novaT: 2, missT: 1.5, chainT: 1 };
  const cam = { x: P.x, y: P.y };
  const input = { keys: new Set(), mx: 0, my: 0, mouse: false, jx: 0, jy: 0, joy: null };
  const wave = { n: 0, boss: false, budget: 0, spawnT: 0, timer: 0, rest: 0, live: false };
  const hud = {};

  let enemies = [];
  let spawns = [];
  let bullets = [];
  let ebullets = [];
  let missiles = [];
  let gems = [];
  let pickups = [];
  let parts = [];
  let rings = [];
  let texts = [];
  let bolts = [];
  let eid = 0;
  const sfxAt = {};

  const sfx = (name, gap, fn) => {
    if (!audio || G.phase === 'menu') return;
    const now = performance.now();
    if (now - (sfxAt[name] || 0) < gap) return;
    sfxAt[name] = now;
    fn();
  };

  /* ---- statistik turunan dari level upgrade ---- */
  const recalc = () => {
    S.dmgMul = 1 + 0.25 * L.damage;
    S.rate = 3.2 * (1 + 0.18 * L.rate);
    S.multi = 1 + L.multi;
    S.pierce = L.pierce;
    S.speed = 238 * (1 + 0.12 * L.speed);
    S.maxHp = 100 + 25 * L.hp;
    S.regen = 0.8 * L.regen;
    S.magnet = 95 * (1 + 0.45 * L.magnet);
    S.crit = 0.05 + 0.12 * L.crit;
    S.dashCd = 2.2 * 0.82 ** L.dash;
  };
  const xpFor = (lvl) => Math.floor(4 + lvl * 3 + lvl * lvl * 0.5);

  const reset = (attract) => {
    UPGRADES.forEach((u) => {
      L[u.id] = 0;
    });
    if (attract) {
      L.orbit = 3;
      L.multi = 2;
      L.rate = 2;
    }
    recalc();
    Object.assign(P, { x: ARENA.w / 2, y: ARENA.h / 2, vx: 0, vy: 0, hp: S.maxHp, inv: 0, dashT: 0, dashCd: 0, fireT: 0, level: 1, xp: 0, xpNext: xpFor(1), novaT: 2, missT: 1.5, chainT: 1 });
    Object.assign(G, { t: 0, time: 0, timeScale: 1, slow: 0, score: 0, kills: 0, shake: 0, hurt: 0, pending: 0, deadT: 0, gemStreak: 0, gemT: 0 });
    Object.assign(wave, { n: 0, boss: false, budget: 0, spawnT: 0, timer: 0, rest: attract ? 0 : 1.2, live: false });
    enemies = [];
    spawns = [];
    bullets = [];
    ebullets = [];
    missiles = [];
    gems = [];
    pickups = [];
    parts = [];
    rings = [];
    texts = [];
    bolts = [];
    cam.x = P.x;
    cam.y = P.y;
  };

  /* ---- efek ---- */
  const spark = (x, y, n, color, power = 160, size = 3, life = 0.5) => {
    for (let i = 0; i < n; i++) {
      if (parts.length > 520) return;
      const a = Math.random() * TAU;
      const s = power * rand(0.25, 1);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: life * rand(0.5, 1), max: life, size: size * rand(0.6, 1.4), color });
    }
  };
  const ring = (x, y, maxR, color, life = 0.45, w = 3) => rings.push({ x, y, r: 4, maxR, life, max: life, color, w });
  const floatText = (x, y, text, color, size = 15) => {
    if (texts.length > 46) texts.shift();
    texts.push({ x: x + rand(-8, 8), y, vy: -46, life: 0.75, max: 0.75, text, color, size });
  };

  /* ---- spatial hash untuk tabrakan ---- */
  const grid = new Map();
  let qid = 0;
  const gkey = (cx, cy) => (cx * 73856093) ^ (cy * 19349663);
  const buildGrid = () => {
    grid.clear();
    for (const e of enemies) {
      const x0 = Math.floor((e.x - e.r) / CELL);
      const x1 = Math.floor((e.x + e.r) / CELL);
      const y0 = Math.floor((e.y - e.r) / CELL);
      const y1 = Math.floor((e.y + e.r) / CELL);
      for (let cx = x0; cx <= x1; cx++) {
        for (let cy = y0; cy <= y1; cy++) {
          const k = gkey(cx, cy);
          let a = grid.get(k);
          if (!a) grid.set(k, (a = []));
          a.push(e);
        }
      }
    }
  };
  // Jangan memanggil forNear secara bersarang (penanda kunjungan dipakai bersama).
  const forNear = (x, y, r, fn) => {
    qid += 1;
    const x0 = Math.floor((x - r) / CELL);
    const x1 = Math.floor((x + r) / CELL);
    const y0 = Math.floor((y - r) / CELL);
    const y1 = Math.floor((y + r) / CELL);
    for (let cx = x0; cx <= x1; cx++) {
      for (let cy = y0; cy <= y1; cy++) {
        const a = grid.get(gkey(cx, cy));
        if (!a) continue;
        for (let i = 0; i < a.length; i++) {
          const e = a[i];
          if (e.mark !== qid) {
            e.mark = qid;
            fn(e);
          }
        }
      }
    }
  };

  /* ---- musuh ---- */
  const addEnemy = (type, x, y) => {
    const d = ENEMY[type];
    const n = Math.max(1, wave.n);
    const hpMul = type === 'boss' ? 1 + (n / 5 - 1) * 0.9 : 1 + (n - 1) * 0.14;
    const e = {
      id: ++eid,
      type,
      d,
      x: clamp(x, d.r, ARENA.w - d.r),
      y: clamp(y, d.r, ARENA.h - d.r),
      vx: 0,
      vy: 0,
      kx: 0,
      ky: 0,
      r: d.r,
      hp: d.hp * hpMul,
      maxHp: d.hp * hpMul,
      flash: 0,
      t: Math.random() * 10,
      cd: rand(1.2, 2.6),
      orbT: 0,
      rot: Math.random() * TAU,
      dead: false,
      mode: 0,
      modeT: 2.4,
      seq: 0,
      shots: 0,
      lx: 0,
      ly: 0,
      mark: 0,
      safe: 0,
    };
    enemies.push(e);
    return e;
  };
  const telegraph = (type, x, y, t = 0.75) => {
    const d = ENEMY[type];
    spawns.push({ type, x: clamp(x, d.r + 4, ARENA.w - d.r - 4), y: clamp(y, d.r + 4, ARENA.h - d.r - 4), t, max: t, color: d.color, r: d.r });
  };

  const dropGem = (x, y, v) => {
    if (gems.length > 260) {
      // gabungkan ke permata terdekat supaya jumlahnya tidak meledak
      gems[Math.floor(Math.random() * gems.length)].v += v;
      return;
    }
    const a = Math.random() * TAU;
    const s = rand(40, 130);
    gems.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, v, t: Math.random() * 6, pull: false });
  };

  const killEnemy = (e) => {
    if (e.dead) return;
    e.dead = true;
    const d = e.d;
    G.kills += 1;
    G.score += d.xp * 10;
    spark(e.x, e.y, Math.min(26, 6 + d.r), d.color, 150 + d.r * 5, 3.2, 0.55);
    ring(e.x, e.y, d.r * 2.6, d.color, 0.35, 2.5);
    if (e.type === 'brute') {
      for (let i = 0; i < 3; i++) dropGem(e.x, e.y, 2);
      G.shake = Math.max(G.shake, 0.3);
    } else if (e.type === 'boss') {
      for (let i = 0; i < 26; i++) dropGem(e.x + rand(-40, 40), e.y + rand(-40, 40), 3);
      pickups.push({ x: e.x, y: e.y, kind: 'heart', t: 0 });
      spark(e.x, e.y, 90, '#ffd15c', 480, 5, 1.1);
      ring(e.x, e.y, 420, d.color, 0.8, 6);
      G.shake = 1;
      G.slow = 0.6;
      G.score += 500 * (wave.n / 5);
      cb.onPopup?.('BOS TUMBANG', 'hot');
      audio?.noise({ dur: 1, vol: 0.34, from: 800, to: 50, type: 'lowpass', q: 0.4 });
      audio?.tone({ freq: 220, to: 880, dur: 0.6, type: 'triangle', vol: 0.12, delay: 0.1 });
    } else {
      dropGem(e.x, e.y, d.xp);
    }
    if (e.type === 'splitter') {
      for (let i = 0; i < 3; i++) {
        const m = addEnemy('mini', e.x + rand(-14, 14), e.y + rand(-14, 14));
        m.safe = 0.2; // pecahan tidak ikut mati oleh ledakan yang sama
        const a = Math.random() * TAU;
        m.kx = Math.cos(a) * 260;
        m.ky = Math.sin(a) * 260;
      }
    }
    if (G.phase === 'play' && e.type !== 'mini') {
      const roll = Math.random();
      if (roll < 0.02 && P.hp < S.maxHp) pickups.push({ x: e.x, y: e.y, kind: 'heart', t: 0 });
      else if (roll < 0.028) pickups.push({ x: e.x, y: e.y, kind: 'magnet', t: 0 });
      else if (roll < 0.034) pickups.push({ x: e.x, y: e.y, kind: 'bomb', t: 0 });
    }
    sfx('kill', 45, () => audio.tone({ freq: rand(300, 380), to: 90, dur: 0.12, type: 'triangle', vol: 0.07 }));
  };

  const damageEnemy = (e, dmg, crit, kx = 0, ky = 0) => {
    if (e.dead || e.safe > 0) return;
    e.hp -= dmg;
    e.flash = 0.09;
    const resist = e.type === 'boss' ? 0.05 : e.type === 'brute' ? 0.35 : 1;
    e.kx += kx * resist;
    e.ky += ky * resist;
    if (crit || dmg >= 20) floatText(e.x, e.y - e.r, String(Math.round(dmg)), crit ? C.crit : '#ffffff', crit ? 19 : 14);
    if (e.hp <= 0) killEnemy(e);
    else sfx('hit', 60, () => audio.noise({ dur: 0.04, vol: 0.05, from: 2400, q: 1.5 }));
  };

  const hurtPlayer = (dmg, fx, fy) => {
    if (P.inv > 0 || G.phase !== 'play') return;
    const scaled = dmg * (1 + (wave.n - 1) * 0.05);
    P.hp -= scaled;
    P.inv = 0.7;
    G.hurt = 1;
    G.shake = Math.max(G.shake, 0.6);
    const l = Math.hypot(fx, fy) || 1;
    P.vx += (fx / l) * 300;
    P.vy += (fy / l) * 300;
    spark(P.x, P.y, 16, C.hostile, 240, 3.5, 0.5);
    audio?.tone({ freq: 150, to: 50, dur: 0.24, type: 'sawtooth', vol: 0.16 });
    audio?.noise({ dur: 0.2, vol: 0.14, from: 600, to: 120, type: 'lowpass' });
    if (P.hp <= 0) {
      P.hp = 0;
      G.phase = 'dead';
      G.deadT = 0;
      G.shake = 1.2;
      spark(P.x, P.y, 90, C.player, 460, 5, 1.2);
      spark(P.x, P.y, 50, '#ffffff', 300, 3, 0.9);
      ring(P.x, P.y, 320, C.player, 0.8, 5);
      audio?.stopMusic();
      audio?.noise({ dur: 1.1, vol: 0.36, from: 900, to: 40, type: 'lowpass', q: 0.4 });
      audio?.tone({ freq: 300, to: 40, dur: 0.9, type: 'sawtooth', vol: 0.16 });
      cb.onState?.('dead');
    }
  };

  /* ---- senjata pemain ---- */
  const nearestEnemy = (x, y, maxD, skip) => {
    let best = null;
    let bd = maxD * maxD;
    for (const e of enemies) {
      if (e.dead || (skip && skip.has(e.id))) continue;
      const d = (e.x - x) ** 2 + (e.y - y) ** 2;
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  };

  const fire = () => {
    const n = S.multi;
    for (let i = 0; i < n; i++) {
      const a = P.aim + (i - (n - 1) / 2) * 0.12;
      const crit = Math.random() < S.crit;
      bullets.push({
        x: P.x + Math.cos(a) * 16,
        y: P.y + Math.sin(a) * 16,
        px: P.x,
        py: P.y,
        vx: Math.cos(a) * 760,
        vy: Math.sin(a) * 760,
        dmg: 10 * S.dmgMul * (crit ? 2.2 : 1),
        crit,
        pierce: S.pierce,
        life: 0.95,
        hit: null,
      });
    }
    sfx('shoot', 70, () => audio.tone({ freq: rand(820, 900), to: 320, dur: 0.06, type: 'square', vol: 0.022 }));
  };

  const explode = (x, y, radius, dmg, color) => {
    ring(x, y, radius, color, 0.4, 4);
    spark(x, y, 18, color, 300, 3.5, 0.5);
    for (const e of enemies) {
      if (e.dead) continue;
      const dx = e.x - x;
      const dy = e.y - y;
      const d = Math.hypot(dx, dy);
      if (d < radius + e.r) damageEnemy(e, dmg, false, (dx / (d || 1)) * 180, (dy / (d || 1)) * 180);
    }
    G.shake = Math.max(G.shake, 0.22);
  };

  const updateWeapons = (dt, hasTarget) => {
    P.fireT -= dt;
    if (hasTarget && P.fireT <= 0) {
      P.fireT = 1 / S.rate;
      fire();
    }

    // Bilah orbit
    if (L.orbit > 0) {
      P.orbA += dt * 3.3;
      const R = 80;
      const dmg = (8 + 4 * L.orbit) * S.dmgMul;
      for (let i = 0; i < L.orbit; i++) {
        const a = P.orbA + (i / L.orbit) * TAU;
        const ox = P.x + Math.cos(a) * R;
        const oy = P.y + Math.sin(a) * R;
        forNear(ox, oy, 14, (e) => {
          if (e.dead || e.orbT > 0) return;
          if ((e.x - ox) ** 2 + (e.y - oy) ** 2 < (e.r + 12) ** 2) {
            e.orbT = 0.35;
            damageEnemy(e, dmg, false, Math.cos(a) * 120, Math.sin(a) * 120);
            spark(ox, oy, 4, C.orbit, 140, 2.5, 0.3);
          }
        });
      }
    }

    // Gelombang nova
    if (L.nova > 0) {
      P.novaT -= dt;
      if (P.novaT <= 0 && hasTarget) {
        P.novaT = 5.2 - 0.5 * L.nova;
        const R = 150 + 28 * L.nova;
        const dmg = (22 + 12 * L.nova) * S.dmgMul;
        ring(P.x, P.y, R, C.nova, 0.5, 7);
        ring(P.x, P.y, R * 0.7, '#ffffff', 0.35, 2);
        for (const e of enemies) {
          if (e.dead) continue;
          const dx = e.x - P.x;
          const dy = e.y - P.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < R + e.r) damageEnemy(e, dmg, false, (dx / d) * 340, (dy / d) * 340);
        }
        G.shake = Math.max(G.shake, 0.25);
        audio?.tone({ freq: 190, to: 55, dur: 0.4, type: 'sine', vol: 0.2 });
        audio?.noise({ dur: 0.3, vol: 0.1, from: 500, to: 2400 });
      }
    }

    // Rudal pelacak
    if (L.missile > 0) {
      P.missT -= dt;
      if (P.missT <= 0 && hasTarget) {
        P.missT = 3.4 - 0.3 * L.missile;
        const count = 1 + Math.floor(L.missile / 2);
        for (let i = 0; i < count; i++) {
          const a = P.aim + Math.PI + rand(-1, 1);
          missiles.push({ x: P.x, y: P.y, vx: Math.cos(a) * 240, vy: Math.sin(a) * 240, life: 3.2, dmg: (34 + 10 * L.missile) * S.dmgMul, target: null, trail: 0 });
        }
        audio?.noise({ dur: 0.25, vol: 0.09, from: 700, to: 2600, q: 1 });
      }
    }

    // Petir berantai
    if (L.chain > 0) {
      P.chainT -= dt;
      if (P.chainT <= 0) {
        const first = nearestEnemy(P.x, P.y, 400);
        if (first) {
          P.chainT = 2.6 - 0.25 * L.chain;
          const dmg = (16 + 7 * L.chain) * S.dmgMul;
          const seen = new Set();
          const pts = [[P.x, P.y]];
          let cur = first;
          let jumps = 2 + L.chain;
          while (cur && jumps > 0) {
            seen.add(cur.id);
            pts.push([cur.x, cur.y]);
            damageEnemy(cur, dmg, false);
            spark(cur.x, cur.y, 5, C.chain, 180, 2.5, 0.3);
            jumps -= 1;
            cur = nearestEnemy(cur.x, cur.y, 200, seen);
          }
          bolts.push({ pts, life: 0.22, max: 0.22 });
          audio?.tone({ freq: 1400, to: 300, dur: 0.14, type: 'square', vol: 0.05 });
          audio?.noise({ dur: 0.12, vol: 0.06, from: 4200, type: 'highpass' });
        } else {
          P.chainT = 0.3;
        }
      }
    }
  };

  /* ---- gelombang ---- */
  const spawnPoint = (minD, maxD) => {
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * TAU;
      const d = rand(minD, maxD);
      const x = clamp(P.x + Math.cos(a) * d, 30, ARENA.w - 30);
      const y = clamp(P.y + Math.sin(a) * d, 30, ARENA.h - 30);
      if (Math.hypot(x - P.x, y - P.y) > minD * 0.7) return [x, y];
    }
    return [P.x < ARENA.w / 2 ? ARENA.w - 60 : 60, P.y < ARENA.h / 2 ? ARENA.h - 60 : 60];
  };

  const startWave = (n) => {
    wave.n = n;
    wave.boss = n % 5 === 0;
    wave.budget = wave.boss ? 10 + n * 2 : 12 + n * 8;
    wave.spawnT = wave.boss ? 2.5 : 0.4;
    wave.timer = 0;
    wave.live = true;
    cb.onWave?.(n, wave.boss);
    if (wave.boss) {
      const [x, y] = spawnPoint(420, 520);
      telegraph('boss', x, y, 1.6);
      audio?.tone({ freq: 70, to: 45, dur: 1.2, type: 'sawtooth', vol: 0.16 });
      audio?.tone({ freq: 104, to: 66, dur: 1.2, type: 'sawtooth', vol: 0.1 });
    } else {
      audio?.tone({ freq: 392, to: 587, dur: 0.3, type: 'triangle', vol: 0.09 });
    }
  };

  const updateWave = (dt) => {
    if (!wave.live) {
      wave.rest -= dt;
      if (wave.rest <= 0) startWave(wave.n + 1);
      return;
    }
    wave.timer += dt;
    if (wave.budget > 0 && enemies.length + spawns.length < 210) {
      wave.spawnT -= dt;
      if (wave.spawnT <= 0) {
        wave.spawnT = Math.max(0.55, 1.7 - wave.n * 0.09);
        const types = Object.keys(ENEMY).filter((k) => ENEMY[k].from <= wave.n);
        const bag = [];
        types.forEach((k) => {
          for (let i = 0; i < ENEMY[k].weight; i++) bag.push(k);
        });
        const [cx, cy] = spawnPoint(460, 620);
        let count = 3 + Math.floor(wave.n * 0.7);
        while (count > 0 && wave.budget > 0) {
          let type = pick(bag);
          if (ENEMY[type].cost > wave.budget) type = 'drone';
          wave.budget -= ENEMY[type].cost;
          telegraph(type, cx + rand(-90, 90), cy + rand(-90, 90));
          count -= 1;
        }
      }
    }
    const cleared = wave.budget <= 0 && spawns.length === 0 && enemies.length === 0;
    const timeUp = !wave.boss && wave.timer > 28 + wave.n * 2;
    if (cleared || timeUp) {
      wave.live = false;
      wave.rest = cleared ? 2.4 : 0.2;
      if (cleared) {
        const bonus = wave.n * 100;
        G.score += bonus;
        cb.onPopup?.(`GELOMBANG ${wave.n} BERSIH  +${bonus}`, 'good');
        audio?.tone({ freq: 523, dur: 0.12, type: 'triangle', vol: 0.09 });
        audio?.tone({ freq: 784, dur: 0.2, type: 'triangle', vol: 0.09, delay: 0.1 });
      }
    }
  };

  /* ---- pembaruan musuh ---- */
  const enemyBullet = (x, y, a, speed, dmg, color) => {
    if (ebullets.length > 240) return;
    ebullets.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: 6, dmg, life: 6, color });
  };

  const updateBoss = (e, dt, dx, dy, dist) => {
    e.modeT -= dt;
    let sx = 0;
    let sy = 0;
    const spd = e.d.spd;
    if (e.mode === 0) {
      sx = (dx / dist) * spd;
      sy = (dy / dist) * spd;
      if (e.modeT <= 0) {
        e.seq += 1;
        e.mode = 1 + (e.seq % 3);
        if (e.mode === 1) {
          e.shots = 3 + Math.min(3, Math.floor(wave.n / 5));
          e.cd = 0.35;
          e.modeT = 99;
        } else if (e.mode === 2) {
          e.modeT = 0.9;
        } else {
          e.modeT = 0.5;
        }
      }
    } else if (e.mode === 1) {
      sx = (dx / dist) * spd * 0.3;
      sy = (dy / dist) * spd * 0.3;
      e.cd -= dt;
      if (e.cd <= 0) {
        e.cd = 0.6;
        const n = 14;
        const off = e.shots * 0.22;
        for (let i = 0; i < n; i++) enemyBullet(e.x, e.y, off + (i / n) * TAU, 190, 12, C.hostile);
        ring(e.x, e.y, 90, C.hostile, 0.3, 3);
        audio?.tone({ freq: 240, to: 120, dur: 0.16, type: 'square', vol: 0.07 });
        e.shots -= 1;
        if (e.shots <= 0) {
          e.mode = 0;
          e.modeT = 2.4;
        }
      }
    } else if (e.mode === 2) {
      // ancang-ancang: kunci arah beberapa saat sebelum menerjang
      if (e.modeT > 0.25) {
        e.lx = dx / dist;
        e.ly = dy / dist;
      }
      if (e.modeT <= 0) {
        e.mode = 4;
        e.modeT = 0.6;
        audio?.noise({ dur: 0.4, vol: 0.14, from: 300, to: 1800 });
      }
    } else if (e.mode === 3) {
      if (e.modeT <= 0) {
        const n = 4 + Math.min(4, Math.floor(wave.n / 5));
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU;
          telegraph(wave.n >= 10 && i % 2 ? 'dart' : 'drone', e.x + Math.cos(a) * 120, e.y + Math.sin(a) * 120, 0.6);
        }
        e.mode = 0;
        e.modeT = 2.6;
      }
    } else if (e.mode === 4) {
      sx = e.lx * 680;
      sy = e.ly * 680;
      if (Math.random() < 0.8) spark(e.x, e.y, 2, e.d.color, 80, 5, 0.4);
      if (e.modeT <= 0) {
        e.mode = 0;
        e.modeT = 2;
      }
    }
    return [sx, sy];
  };

  const updateEnemies = (dt) => {
    const spdMul = 1 + Math.min(0.35, (wave.n - 1) * 0.02);
    for (const e of enemies) {
      if (e.dead) continue;
      e.t += dt;
      e.flash = Math.max(0, e.flash - dt);
      e.orbT = Math.max(0, e.orbT - dt);
      e.safe = Math.max(0, e.safe - dt);
      const dx = P.x - e.x;
      const dy = P.y - e.y;
      const dist = Math.hypot(dx, dy) || 1;
      let sx;
      let sy;
      if (e.type === 'boss') {
        [sx, sy] = updateBoss(e, dt, dx, dy, dist);
      } else {
        const spd = e.d.spd * spdMul;
        sx = (dx / dist) * spd;
        sy = (dy / dist) * spd;
        if (e.type === 'dart') {
          const w = Math.sin(e.t * 5) * 0.75;
          sx += (-dy / dist) * spd * w;
          sy += (dx / dist) * spd * w;
        } else if (e.type === 'spitter') {
          if (dist < 250) {
            sx = -sx;
            sy = -sy;
          } else if (dist < 340) {
            const side = e.id % 2 ? 1 : -1;
            sx = (-dy / dist) * spd * side;
            sy = (dx / dist) * spd * side;
          }
          e.cd -= dt;
          if (e.cd <= 0 && dist < 560 && G.phase === 'play') {
            e.cd = rand(2, 2.8);
            enemyBullet(e.x, e.y, Math.atan2(dy, dx), 215, 9, e.d.color);
            e.flash = 0.12;
            sfx('spit', 120, () => audio.tone({ freq: 520, to: 260, dur: 0.1, type: 'triangle', vol: 0.04 }));
          }
        }
      }
      // saling menjauh agar tidak menumpuk
      if (e.type !== 'boss') {
        let px = 0;
        let py = 0;
        forNear(e.x, e.y, e.r + 2, (o) => {
          if (o === e || o.dead) return;
          const ox = e.x - o.x;
          const oy = e.y - o.y;
          const d2 = ox * ox + oy * oy;
          const min = e.r + o.r;
          if (d2 < min * min && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (min - d) / min;
            px += (ox / d) * push;
            py += (oy / d) * push;
          }
        });
        sx += px * 150;
        sy += py * 150;
      }
      const k = damp(dt, e.type === 'boss' && e.mode === 4 ? 14 : 6);
      e.vx += (sx - e.vx) * k;
      e.vy += (sy - e.vy) * k;
      const kd = Math.exp(-dt * 7);
      e.kx *= kd;
      e.ky *= kd;
      e.x = clamp(e.x + (e.vx + e.kx) * dt, e.r, ARENA.w - e.r);
      e.y = clamp(e.y + (e.vy + e.ky) * dt, e.r, ARENA.h - e.r);
      e.rot += dt * (e.type === 'boss' ? 0.7 : 1.6);
      if (dist < e.r + P.r - 2) hurtPlayer(e.d.dmg, dx, dy);
    }
  };

  /* ---- langkah simulasi ---- */
  const levelChoices = () => {
    const pool = UPGRADES.filter((u) => L[u.id] < u.max);
    const out = [];
    while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return out.map((u) => ({ id: u.id, name: u.name, desc: u.desc, level: L[u.id], max: u.max }));
  };

  const offerLevelUp = () => {
    const choices = levelChoices();
    if (!choices.length) {
      G.pending = 0;
      P.hp = Math.min(S.maxHp, P.hp + 20);
      G.score += 200;
      return;
    }
    G.phase = 'levelup';
    audio?.tone({ freq: 523, dur: 0.1, type: 'triangle', vol: 0.1 });
    audio?.tone({ freq: 659, dur: 0.1, type: 'triangle', vol: 0.1, delay: 0.08 });
    audio?.tone({ freq: 784, dur: 0.1, type: 'triangle', vol: 0.1, delay: 0.16 });
    audio?.tone({ freq: 1047, dur: 0.24, type: 'triangle', vol: 0.1, delay: 0.24 });
    cb.onLevelUp?.(choices, P.level);
  };

  const addXp = (v) => {
    P.xp += v;
    while (P.xp >= P.xpNext) {
      P.xp -= P.xpNext;
      P.level += 1;
      P.xpNext = xpFor(P.level);
      G.pending += 1;
      ring(P.x, P.y, 180, C.crit, 0.6, 4);
    }
  };

  const update = (dt, realDt) => {
    G.t += dt;
    const playing = G.phase === 'play';
    const attract = G.phase === 'menu';
    if (playing) G.time += dt;

    /* pemain */
    let mx = 0;
    let my = 0;
    if (playing) {
      const k = input.keys;
      mx = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) + input.jx;
      my = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) + input.jy;
    } else if (attract) {
      // mode pamer: kapal berkeliling sendiri di belakang menu
      const tx = ARENA.w / 2 + Math.cos(G.t * 0.35) * 260;
      const ty = ARENA.h / 2 + Math.sin(G.t * 0.5) * 170;
      mx = (tx - P.x) / 120;
      my = (ty - P.y) / 120;
    }
    const ml = Math.hypot(mx, my);
    if (ml > 1) {
      mx /= ml;
      my /= ml;
    }
    if (ml > 0.05) {
      P.dx = mx / (ml > 1 ? 1 : ml);
      P.dy = my / (ml > 1 ? 1 : ml);
    }
    if (G.phase === 'dead' || G.phase === 'over') {
      P.vx *= Math.exp(-dt * 4);
      P.vy *= Math.exp(-dt * 4);
    } else if (P.dashT > 0) {
      P.dashT -= dt;
      if (Math.random() < 0.9) parts.push({ x: P.x, y: P.y, vx: 0, vy: 0, life: 0.22, max: 0.22, size: 15, color: C.player, ghost: P.aim });
    } else {
      const k = damp(dt, 11);
      P.vx += (mx * S.speed - P.vx) * k;
      P.vy += (my * S.speed - P.vy) * k;
    }
    P.x = clamp(P.x + P.vx * dt, P.r, ARENA.w - P.r);
    P.y = clamp(P.y + P.vy * dt, P.r, ARENA.h - P.r);
    P.inv = Math.max(0, P.inv - dt);
    P.dashCd = Math.max(0, P.dashCd - dt);
    if (playing && S.regen > 0) P.hp = Math.min(S.maxHp, P.hp + S.regen * dt);
    if ((playing || attract) && ml > 0.2 && Math.random() < 0.5) {
      parts.push({ x: P.x - Math.cos(P.aim) * 10, y: P.y - Math.sin(P.aim) * 10, vx: -P.vx * 0.3 + rand(-20, 20), vy: -P.vy * 0.3 + rand(-20, 20), life: 0.3, max: 0.3, size: 3, color: C.player });
    }

    /* bidikan */
    buildGrid();
    if (playing || attract) {
      let target;
      if (input.mouse && playing) {
        const wx = cam.x + (input.mx - W / 2) / zoom;
        const wy = cam.y + (input.my - H / 2) / zoom;
        P.aim = Math.atan2(wy - P.y, wx - P.x);
        target = enemies.length ? enemies[0] : null;
      } else {
        target = nearestEnemy(P.x, P.y, 640);
        if (target) {
          const goal = Math.atan2(target.y - P.y, target.x - P.x);
          let da = goal - P.aim;
          da = Math.atan2(Math.sin(da), Math.cos(da));
          P.aim += da * damp(dt, 16);
        } else if (ml > 0.2) {
          const goal = Math.atan2(P.dy, P.dx);
          let da = goal - P.aim;
          da = Math.atan2(Math.sin(da), Math.cos(da));
          P.aim += da * damp(dt, 8);
        }
      }
      updateWeapons(dt, !!target);
    }

    /* gelombang */
    if (playing) updateWave(dt);
    else if (attract) {
      wave.spawnT -= dt;
      if (wave.spawnT <= 0 && enemies.length < 26) {
        wave.spawnT = 0.9;
        const [x, y] = spawnPoint(380, 520);
        telegraph(Math.random() < 0.2 ? 'splitter' : 'drone', x, y);
      }
    }

    for (const s of spawns) {
      s.t -= dt;
      if (s.t <= 0) {
        addEnemy(s.type, s.x, s.y);
        ring(s.x, s.y, s.r * 2.4, s.color, 0.3, 2);
      }
    }
    compact(spawns, (s) => s.t <= 0);

    updateEnemies(dt);

    /* peluru pemain */
    for (const b of bullets) {
      b.px = b.x;
      b.py = b.y;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.x < 0 || b.y < 0 || b.x > ARENA.w || b.y > ARENA.h) b.life = 0;
      if (b.life <= 0) continue;
      forNear(b.x, b.y, 8, (e) => {
        if (b.life <= 0 || e.dead || (b.hit && b.hit.includes(e.id))) return;
        if ((e.x - b.x) ** 2 + (e.y - b.y) ** 2 < (e.r + 5) ** 2) {
          damageEnemy(e, b.dmg, b.crit, b.vx * 0.12, b.vy * 0.12);
          spark(b.x, b.y, 3, b.crit ? C.crit : C.bullet, 120, 2, 0.25);
          if (b.pierce > 0) {
            b.pierce -= 1;
            (b.hit || (b.hit = [])).push(e.id);
          } else {
            b.life = 0;
          }
        }
      });
    }
    compact(bullets, (b) => b.life <= 0);

    /* rudal */
    for (const m of missiles) {
      m.life -= dt;
      if (!m.target || m.target.dead) m.target = nearestEnemy(m.x, m.y, 900);
      if (m.target) {
        const a = Math.atan2(m.target.y - m.y, m.target.x - m.x);
        m.vx += Math.cos(a) * 1500 * dt;
        m.vy += Math.sin(a) * 1500 * dt;
      }
      const sp = Math.hypot(m.vx, m.vy) || 1;
      const max = 520;
      if (sp > max) {
        m.vx = (m.vx / sp) * max;
        m.vy = (m.vy / sp) * max;
      }
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.trail -= dt;
      if (m.trail <= 0) {
        m.trail = 0.02;
        parts.push({ x: m.x, y: m.y, vx: rand(-15, 15), vy: rand(-15, 15), life: 0.32, max: 0.32, size: 3.4, color: C.missile });
      }
      let boom = m.life <= 0;
      if (!boom && m.target && !m.target.dead && (m.target.x - m.x) ** 2 + (m.target.y - m.y) ** 2 < (m.target.r + 8) ** 2) boom = true;
      if (boom) {
        m.life = 0;
        explode(m.x, m.y, 74, m.dmg, C.missile);
        sfx('boom', 60, () => audio.noise({ dur: 0.3, vol: 0.16, from: 500, to: 80, type: 'lowpass' }));
      }
    }
    compact(missiles, (m) => m.life <= 0);

    /* peluru musuh */
    for (const b of ebullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.x < -20 || b.y < -20 || b.x > ARENA.w + 20 || b.y > ARENA.h + 20) b.life = 0;
      if (b.life > 0 && (b.x - P.x) ** 2 + (b.y - P.y) ** 2 < (b.r + P.r - 3) ** 2 && P.inv <= 0 && playing) {
        hurtPlayer(b.dmg, P.x - b.x, P.y - b.y);
        b.life = 0;
      }
    }
    compact(ebullets, (b) => b.life <= 0);
    compact(enemies, (e) => e.dead);

    /* permata XP */
    G.gemT -= dt;
    if (G.gemT <= 0) G.gemStreak = 0;
    for (const g of gems) {
      g.t += dt;
      const dx = P.x - g.x;
      const dy = P.y - g.y;
      const d = Math.hypot(dx, dy) || 1;
      if ((g.pull || d < S.magnet) && (playing || attract)) {
        g.pull = true;
        const sp = 620 + (S.magnet - d) * 1.5;
        g.vx += ((dx / d) * sp - g.vx) * damp(dt, 9);
        g.vy += ((dy / d) * sp - g.vy) * damp(dt, 9);
      } else {
        g.vx *= Math.exp(-dt * 5);
        g.vy *= Math.exp(-dt * 5);
      }
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      if (d < P.r + 10 && (playing || attract)) {
        g.v = -g.v; // tandai terambil
        if (playing) {
          addXp(-g.v);
          G.gemStreak = Math.min(14, G.gemStreak + 1);
          G.gemT = 0.6;
          const st = G.gemStreak;
          sfx('gem', 35, () => audio.tone({ freq: 660 * 2 ** (st / 12), dur: 0.07, type: 'sine', vol: 0.06 }));
        }
      }
    }
    compact(gems, (g) => g.v <= 0);

    /* pickup */
    for (const p of pickups) {
      p.t += dt;
      if (p.t > 22) p.kind = null;
      if (!p.kind || !playing) continue;
      if ((p.x - P.x) ** 2 + (p.y - P.y) ** 2 < (P.r + 16) ** 2) {
        if (p.kind === 'heart') {
          P.hp = Math.min(S.maxHp, P.hp + 25);
          floatText(P.x, P.y - 24, '+25', C.heart, 18);
          ring(P.x, P.y, 90, C.heart, 0.5, 3);
          audio?.tone({ freq: 523, to: 784, dur: 0.22, type: 'sine', vol: 0.12 });
        } else if (p.kind === 'magnet') {
          gems.forEach((g) => {
            g.pull = true;
          });
          ring(P.x, P.y, 520, C.player, 0.6, 3);
          cb.onPopup?.('MAGNET', 'info');
          audio?.tone({ freq: 300, to: 1200, dur: 0.35, type: 'sine', vol: 0.1 });
        } else {
          ring(P.x, P.y, 760, '#ffffff', 0.6, 8);
          G.shake = 1;
          for (const e of enemies) {
            if (e.dead) continue;
            if (Math.hypot(e.x - P.x, e.y - P.y) < 760) damageEnemy(e, e.type === 'boss' ? 160 : 9999, false);
          }
          ebullets.length = 0;
          cb.onPopup?.('BOM', 'hot');
          audio?.noise({ dur: 0.8, vol: 0.34, from: 1200, to: 50, type: 'lowpass', q: 0.4 });
        }
        p.kind = null;
      }
    }
    compact(pickups, (p) => !p.kind);

    /* efek */
    for (const p of parts) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * 3);
      p.vy *= Math.exp(-dt * 3);
    }
    compact(parts, (p) => p.life <= 0);
    for (const r of rings) {
      r.life -= dt;
      r.r += (r.maxR - r.r) * damp(dt, 9);
    }
    compact(rings, (r) => r.life <= 0);
    for (const t of texts) {
      t.life -= dt;
      t.y += t.vy * dt;
      t.vy *= Math.exp(-dt * 3);
    }
    compact(texts, (t) => t.life <= 0);
    for (const b of bolts) b.life -= dt;
    compact(bolts, (b) => b.life <= 0);

    /* kamera */
    const look = input.mouse && playing ? 46 : 0;
    // di menu, kapal digeser ke kanan supaya tidak tertutup panel
    const menuShift = attract && W > 960 && W > H * 1.25 ? (W * 0.17) / zoom : 0;
    cam.x += (P.x - menuShift + Math.cos(P.aim) * look - cam.x) * damp(realDt, 6);
    cam.y += (P.y + Math.sin(P.aim) * look - cam.y) * damp(realDt, 6);
    G.shake = Math.max(0, G.shake - realDt * 2.2);
    G.hurt = Math.max(0, G.hurt - realDt * 2.4);
    G.slow = Math.max(0, G.slow - realDt);

    /* fase */
    if (G.phase === 'dead') {
      G.deadT += realDt;
      if (G.deadT > 1.5) {
        G.phase = 'over';
        cb.onState?.('over', { score: Math.floor(G.score), wave: wave.n, kills: G.kills, time: G.time, level: P.level });
      }
    }
    if (playing && G.pending > 0) offerLevelUp();
  };

  /* ---- render ---- */
  const poly = (x, y, r, sides, rot) => {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = rot + (i / sides) * TAU;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.closePath();
  };
  const shape = (x, y, a, pts) => {
    const c = Math.cos(a);
    const s = Math.sin(a);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      const px = x + pts[i] * c - pts[i + 1] * s;
      const py = y + pts[i] * s + pts[i + 1] * c;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.closePath();
  };
  const glow = (color, x, y, size, alpha = 1) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(glowSprite(color), x - size / 2, y - size / 2, size, size);
  };
  const SHIP = [17, 0, -11, 10.5, -5.5, 0, -11, -10.5];
  const DART = [13, 0, -9, 7, -4, 0, -9, -7];

  const render = () => {
    const tr = G.shake * G.shake * 15;
    const ox = (Math.random() - 0.5) * tr;
    const oy = (Math.random() - 0.5) * tr;
    const cx = cam.x + ox;
    const cy = cam.y + oy;
    const vw = W / zoom;
    const vh = H / zoom;
    const L0 = cx - vw / 2;
    const T0 = cy - vh / 2;
    const R0 = L0 + vw;
    const B0 = T0 + vh;
    const seen = (x, y, m) => x > L0 - m && x < R0 + m && y > T0 - m && y < B0 + m;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#03030a';
    ctx.fillRect(0, 0, W, H);
    ctx.setTransform(zoom * dpr, 0, 0, zoom * dpr, (W / 2 - cx * zoom) * dpr, (H / 2 - cy * zoom) * dpr);

    // lantai arena
    const ax0 = Math.max(0, L0);
    const ay0 = Math.max(0, T0);
    const ax1 = Math.min(ARENA.w, R0);
    const ay1 = Math.min(ARENA.h, B0);
    if (ax1 > ax0 && ay1 > ay0) {
      ctx.fillStyle = '#080914';
      ctx.fillRect(ax0, ay0, ax1 - ax0, ay1 - ay0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 1;
      ctx.drawImage(nebulaLayer(), 0, 0, ARENA.w, ARENA.h);
      ctx.fillStyle = '#b9c4ff';
      for (const d of DUST) {
        // paralaks: debu bergerak lebih lambat dari lantai
        const dx = d.x + (cx - ARENA.w / 2) * (1 - d.p);
        const dy = d.y + (cy - ARENA.h / 2) * (1 - d.p);
        if (dx < ax0 || dx > ax1 || dy < ay0 || dy > ay1) continue;
        ctx.globalAlpha = 0.16 + 0.2 * Math.abs(Math.sin(G.t * 0.8 + d.ph));
        ctx.fillRect(dx, dy, d.s, d.s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      const step = 80;
      ctx.lineWidth = 1 / zoom;
      ctx.strokeStyle = 'rgba(140, 125, 255, 0.13)';
      ctx.beginPath();
      for (let x = Math.ceil(ax0 / step) * step; x <= ax1; x += step) {
        ctx.moveTo(x, ay0);
        ctx.lineTo(x, ay1);
      }
      for (let y = Math.ceil(ay0 / step) * step; y <= ay1; y += step) {
        ctx.moveTo(ax0, y);
        ctx.lineTo(ax1, y);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(150, 135, 255, 0.26)';
      ctx.beginPath();
      for (let x = Math.ceil(ax0 / 400) * 400; x <= ax1; x += 400) {
        ctx.moveTo(x, ay0);
        ctx.lineTo(x, ay1);
      }
      for (let y = Math.ceil(ay0 / 400) * 400; y <= ay1; y += 400) {
        ctx.moveTo(ax0, y);
        ctx.lineTo(ax1, y);
      }
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'lighter';
    // cahaya ambient di bawah pemain
    glow('#3a2a8c', P.x, P.y, 900, 0.55);
    glow(C.player, P.x, P.y, 320, 0.16);

    // batas arena
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = C.orbit;
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, ARENA.w, ARENA.h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#d9c8ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, ARENA.w, ARENA.h);

    // cincin
    for (const r of rings) {
      if (!seen(r.x, r.y, r.r + 10)) continue;
      const k = r.life / r.max;
      ctx.globalAlpha = k * 0.9;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.w * (0.4 + k);
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, TAU);
      ctx.stroke();
    }

    // permata
    for (const g of gems) {
      if (!seen(g.x, g.y, 20)) continue;
      const col = g.v >= 5 ? '#ffd15c' : g.v >= 2 ? '#7fa8ff' : '#6dffcf';
      const s = 4.5 + Math.min(4, g.v * 0.6);
      glow(col, g.x, g.y, s * 5.5, 0.55);
      ctx.globalAlpha = 1;
      ctx.fillStyle = col;
      poly(g.x, g.y + Math.sin(g.t * 4) * 1.5, s, 4, 0);
      ctx.fill();
    }

    // pickup
    for (const p of pickups) {
      if (!seen(p.x, p.y, 40)) continue;
      const col = p.kind === 'heart' ? C.heart : p.kind === 'magnet' ? C.player : '#ffffff';
      const pulse = 1 + Math.sin(p.t * 5) * 0.12;
      const fade = p.t > 18 ? 0.4 + 0.6 * Math.abs(Math.sin(p.t * 8)) : 1;
      glow(col, p.x, p.y, 74 * pulse, 0.7 * fade);
      ctx.globalAlpha = fade;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13 * pulse, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.font = '700 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.kind === 'heart' ? '+' : p.kind === 'magnet' ? 'U' : '!', p.x, p.y + 1);
    }

    // penanda kemunculan
    for (const s of spawns) {
      if (!seen(s.x, s.y, 80)) continue;
      const k = s.t / s.max;
      ctx.globalAlpha = 0.25 + (1 - k) * 0.6;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r + k * 46, 0, TAU);
      ctx.stroke();
      glow(s.color, s.x, s.y, s.r * 3 * (1 - k) + 10, 0.5);
    }

    // musuh
    for (const e of enemies) {
      if (!seen(e.x, e.y, e.r + 30)) continue;
      const col = e.d.color;
      glow(col, e.x, e.y, e.r * 4.6, 0.42);
      ctx.globalAlpha = 1;
      if (e.type === 'boss' && e.mode === 2) {
        // garis ancang-ancang terjangan
        ctx.globalAlpha = 0.25 + 0.5 * (1 - e.modeT / 0.9);
        ctx.strokeStyle = C.hostile;
        ctx.lineWidth = 3;
        ctx.setLineDash([14, 10]);
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(e.x + e.lx * 460, e.y + e.ly * 460);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      if (e.type === 'dart') shape(e.x, e.y, Math.atan2(e.vy, e.vx), DART);
      else if (e.type === 'drone') poly(e.x, e.y, e.r * 1.15, 3, Math.atan2(P.y - e.y, P.x - e.x));
      else poly(e.x, e.y, e.r, e.d.sides, e.rot);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = e.flash > 0 ? '#ffffff' : '#0b0a16';
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = col;
      ctx.lineWidth = e.type === 'boss' ? 4 : 2.2;
      ctx.stroke();
      if (e.type === 'boss' || e.type === 'brute' || e.type === 'splitter') {
        ctx.globalAlpha = 0.7;
        poly(e.x, e.y, e.r * 0.5, e.d.sides, -e.rot * 1.4);
        ctx.lineWidth = 1.6;
        ctx.stroke();
        if (e.type === 'boss') {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(e.x, e.y, 9 + Math.sin(e.t * 6) * 3, 0, TAU);
          ctx.fill();
        }
      }
      if (e.type !== 'boss' && e.maxHp > 40 && e.hp < e.maxHp) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2, 3);
        ctx.fillStyle = col;
        ctx.fillRect(e.x - e.r, e.y - e.r - 9, e.r * 2 * clamp(e.hp / e.maxHp, 0, 1), 3);
      }
    }

    // peluru musuh
    for (const b of ebullets) {
      if (!seen(b.x, b.y, 20)) continue;
      glow(b.color, b.x, b.y, 34, 0.9);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.2, 0, TAU);
      ctx.fill();
    }

    // peluru pemain
    ctx.lineCap = 'round';
    for (const b of bullets) {
      if (!seen(b.x, b.y, 30)) continue;
      const col = b.crit ? C.crit : C.bullet;
      glow(col, b.x, b.y, b.crit ? 44 : 32, 0.85);
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = col;
      ctx.lineWidth = b.crit ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(b.x - b.vx * 0.034, b.y - b.vy * 0.034);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // rudal
    for (const m of missiles) {
      glow(C.missile, m.x, m.y, 40, 0.9);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff2dd';
      shape(m.x, m.y, Math.atan2(m.vy, m.vx), [9, 0, -6, 4.5, -6, -4.5]);
      ctx.fill();
    }

    // partikel
    for (const p of parts) {
      if (!seen(p.x, p.y, 30)) continue;
      const k = p.life / p.max;
      if (p.ghost !== undefined) {
        ctx.globalAlpha = k * 0.5;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        shape(p.x, p.y, p.ghost, SHIP);
        ctx.stroke();
        continue;
      }
      ctx.globalAlpha = k;
      ctx.fillStyle = p.color;
      const s = p.size * (0.4 + k * 0.6);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }

    // pemain
    const alive = G.phase !== 'dead' && G.phase !== 'over';
    if (alive) {
      if (L.orbit > 0) {
        ctx.globalAlpha = 0.14;
        ctx.strokeStyle = C.orbit;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(P.x, P.y, 80, 0, TAU);
        ctx.stroke();
        for (let i = 0; i < L.orbit; i++) {
          const a = P.orbA + (i / L.orbit) * TAU;
          const bx = P.x + Math.cos(a) * 80;
          const by = P.y + Math.sin(a) * 80;
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = C.orbit;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(P.x, P.y, 80, a - 0.5, a);
          ctx.stroke();
          glow(C.orbit, bx, by, 46, 0.95);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#f1e6ff';
          poly(bx, by, 7.5, 4, a);
          ctx.fill();
        }
      }
      const blink = P.inv > 0 && P.dashT <= 0 ? 0.45 + 0.55 * Math.abs(Math.sin(G.t * 30)) : 1;
      glow(C.player, P.x, P.y, 92, 0.7 * blink);
      shape(P.x, P.y, P.aim, SHIP);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = blink;
      ctx.fillStyle = '#eaffff';
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = C.player;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (P.inv > 0) {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(P.x, P.y, 22, 0, TAU);
        ctx.stroke();
      }
    }

    // petir
    for (const b of bolts) {
      const k = b.life / b.max;
      ctx.globalAlpha = k;
      ctx.strokeStyle = C.chain;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < b.pts.length - 1; i++) {
        const [x0, y0] = b.pts[i];
        const [x1, y1] = b.pts[i + 1];
        ctx.moveTo(x0, y0);
        const segs = 5;
        for (let s = 1; s < segs; s++) {
          const t = s / segs;
          ctx.lineTo(x0 + (x1 - x0) * t + rand(-11, 11), y0 + (y1 - y0) * t + rand(-11, 11));
        }
        ctx.lineTo(x1, y1);
        glow(C.nova, x1, y1, 60, k * 0.8);
        ctx.globalAlpha = k;
      }
      ctx.stroke();
    }

    // angka melayang
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const t of texts) {
      if (!seen(t.x, t.y, 40)) continue;
      ctx.globalAlpha = Math.min(1, (t.life / t.max) * 1.6);
      ctx.font = `700 ${t.size}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }

    // joystick sentuh
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (input.joy) {
      const j = input.joy;
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(j.ox, j.oy, 52, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = C.player;
      ctx.beginPath();
      ctx.arc(j.ox + input.jx * 52, j.oy + input.jy * 52, 22, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const pushHud = () => {
    hud.score = Math.floor(G.score);
    hud.hp = P.hp;
    hud.maxHp = S.maxHp;
    hud.xp = P.xp / P.xpNext;
    hud.level = P.level;
    hud.wave = wave.n;
    hud.time = G.time;
    hud.kills = G.kills;
    hud.dash = 1 - P.dashCd / S.dashCd;
    hud.hurt = G.hurt;
    let boss = -1;
    for (const e of enemies) {
      if (e.type === 'boss') {
        boss = clamp(e.hp / e.maxHp, 0, 1);
        break;
      }
    }
    hud.boss = boss;
    cb.onHud?.(hud);
  };

  /* ---- loop ---- */
  let raf = 0;
  let last = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    if (G.paused) return;
    const realDt = Math.min(0.05, raw);
    if (G.phase !== 'levelup') {
      const scale = G.phase === 'dead' ? 0.3 : G.slow > 0 ? 0.35 : 1;
      update(realDt * scale, realDt);
    }
    render();
    pushHud();
  };

  const resize = () => {
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    zoom = clamp(Math.min(W, H) / (coarse ? 470 : 640), 0.5, 1.6);
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* ---- input pointer (bidik mouse, joystick sentuh) ---- */
  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const dash = () => {
    if (G.phase !== 'play' || G.paused || P.dashCd > 0) return;
    P.dashCd = S.dashCd;
    P.dashT = 0.16;
    P.inv = Math.max(P.inv, 0.3);
    const moving = Math.hypot(P.vx, P.vy) > 40;
    const dx = moving ? P.dx : Math.cos(P.aim);
    const dy = moving ? P.dy : Math.sin(P.aim);
    const l = Math.hypot(dx, dy) || 1;
    P.vx = (dx / l) * 980;
    P.vy = (dy / l) * 980;
    ring(P.x, P.y, 60, C.player, 0.3, 3);
    audio?.noise({ dur: 0.2, vol: 0.12, from: 500, to: 3200, q: 1 });
  };
  const onDown = (e) => {
    const [x, y] = local(e);
    if (e.pointerType === 'mouse') {
      input.mouse = true;
      input.mx = x;
      input.my = y;
      if (e.button === 2) dash();
      return;
    }
    if (!input.joy) {
      input.joy = { id: e.pointerId, ox: x, oy: y };
      input.jx = 0;
      input.jy = 0;
      canvas.setPointerCapture?.(e.pointerId);
    }
  };
  const onMove = (e) => {
    const [x, y] = local(e);
    if (e.pointerType === 'mouse') {
      input.mouse = true;
      input.mx = x;
      input.my = y;
      return;
    }
    const j = input.joy;
    if (j && j.id === e.pointerId) {
      const dx = (x - j.ox) / 52;
      const dy = (y - j.oy) / 52;
      const l = Math.hypot(dx, dy);
      input.jx = l > 1 ? dx / l : dx;
      input.jy = l > 1 ? dy / l : dy;
    }
  };
  const onUp = (e) => {
    if (input.joy && input.joy.id === e.pointerId) {
      input.joy = null;
      input.jx = 0;
      input.jy = 0;
    }
  };
  const noMenu = (e) => e.preventDefault();
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('contextmenu', noMenu);

  reset(true);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    start: () => {
      reset(false);
      G.phase = 'play';
      G.paused = false;
      input.keys.clear();
      audio?.startMusic('arena');
      cb.onState?.('play');
    },
    toMenu: () => {
      reset(true);
      G.phase = 'menu';
      G.paused = false;
      audio?.stopMusic();
      cb.onState?.('menu');
    },
    choose: (id) => {
      if (G.phase !== 'levelup') return;
      const u = UPGRADES.find((x) => x.id === id);
      if (u && L[id] < u.max) {
        L[id] += 1;
        recalc();
        if (id === 'hp') P.hp = Math.min(S.maxHp, P.hp + 30);
      }
      G.pending = Math.max(0, G.pending - 1);
      P.inv = Math.max(P.inv, 0.8);
      last = 0;
      if (G.pending > 0) offerLevelUp();
      else {
        G.phase = 'play';
        cb.onState?.('play');
      }
    },
    setKey: (code, down) => {
      if (down) input.keys.add(code);
      else input.keys.delete(code);
    },
    dash,
    setPaused: (p) => {
      G.paused = p;
      last = 0;
      if (p) input.keys.clear();
    },
    get phase() {
      return G.phase;
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('contextmenu', noMenu);
    },
  };
}
