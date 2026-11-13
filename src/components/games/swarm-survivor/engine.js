// Swarm Survivor — arena shooter top-down bergaya pixel (Canvas 2D beresolusi rendah).
// Tiga kucing situs ini berburu serangga di taman malam: bertahan dari gelombang musuh,
// kumpulkan XP, pilih upgrade tiap naik level.
import { getSprites, drawNumber } from './sprites';

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
  { id: 'damage', name: 'Cakar Tajam', desc: 'Damage semua serangan +25%', max: 6 },
  { id: 'rate', name: 'Refleks Kucing', desc: 'Kecepatan serang +18%', max: 6 },
  { id: 'multi', name: 'Cakar Ganda', desc: '+1 cakaran di setiap serangan', max: 4 },
  { id: 'pierce', name: 'Cakar Tembus', desc: 'Cakaran menembus +1 musuh', max: 4 },
  { id: 'orbit', name: 'Ikan Pengawal', desc: '+1 ikan yang berputar melindungimu', max: 5 },
  { id: 'nova', name: 'Raungan Meong', desc: 'Raungan berkala yang mementalkan musuh', max: 5 },
  { id: 'missile', name: 'Roket Tuna', desc: 'Roket pelacak yang meledak di kerumunan', max: 5 },
  { id: 'chain', name: 'Listrik Statis', desc: 'Setrum bulu yang melompat antar musuh', max: 5 },
  { id: 'speed', name: 'Zoomies', desc: 'Kecepatan lari +12%', max: 4 },
  { id: 'hp', name: 'Sembilan Nyawa', desc: 'HP maksimum +25 dan pulih 30 HP', max: 5 },
  { id: 'regen', name: 'Tidur Siang', desc: 'Pulih 0,8 HP setiap detik', max: 4 },
  { id: 'magnet', name: 'Hidung Tajam', desc: 'Jangkauan ambil XP +45%', max: 4 },
  { id: 'crit', name: 'Insting Pemburu', desc: 'Peluang serangan kritikal +12%', max: 5 },
  { id: 'dash', name: 'Lompatan Kilat', desc: 'Cooldown dash 18% lebih singkat', max: 4 },
];

// Tiga kucing peliharaan situs; masing-masing punya kelebihan sendiri.
export const HEROES = [
  { id: 'maxwell', name: 'Maxwell', tag: 'Loaf Cat', perk: 'HP +40, tapi larinya sedikit lebih lambat', photo: '/pet/maxwell.png', mods: { hp: 40, speed: 0.94, dash: 1, xp: 1, magnet: 1 } },
  { id: 'akmal', name: 'Akmal', tag: 'Munchkin', perk: 'Lari +12% dan dash lebih cepat pulih', photo: '/pet/akmal.png', mods: { hp: 0, speed: 1.12, dash: 0.8, xp: 1, magnet: 1 } },
  { id: 'usu', name: 'Kucing USU', tag: 'Anak USU', perk: 'XP +25% dan jangkauan ambil lebih jauh', photo: '/pet/kucing-usu.png', mods: { hp: 0, speed: 1, dash: 1, xp: 1.25, magnet: 1.3 } },
];

function compact(arr, dead) {
  let n = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!dead(arr[i])) arr[n++] = arr[i];
  }
  arr.length = n;
}

// Pengacak deterministik: lantai dan dekorasi selalu sama di setiap sesi.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}

// Ubin rumput malam 64×64 piksel yang diulang sebagai pola lantai.
function makeFloorTile() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d');
  const rnd = seeded(7);
  for (let ty = 0; ty < 4; ty++) {
    for (let tx = 0; tx < 4; tx++) {
      g.fillStyle = (tx + ty) % 2 ? '#1d3427' : '#1a3024';
      g.fillRect(tx * 16, ty * 16, 16, 16);
    }
  }
  for (let i = 0; i < 150; i++) {
    g.fillStyle = ['#24402f', '#162a20', '#213a2c', '#2a4735'][Math.floor(rnd() * 4)];
    g.fillRect(Math.floor(rnd() * 64), Math.floor(rnd() * 64), rnd() < 0.3 ? 2 : 1, 1);
  }
  return c;
}

const DECOR = [];
{
  const rnd = seeded(42);
  const kinds = ['tuft', 'tuft', 'tuft', 'tuft', 'tuft', 'pebble', 'pebble', 'flowerW', 'flowerP', 'flowerW', 'shroom'];
  for (let i = 0; i < 520; i++) DECOR.push({ x: 20 + rnd() * (ARENA.w - 40), y: 20 + rnd() * (ARENA.h - 40), kind: kinds[Math.floor(rnd() * kinds.length)] });
}

let lightCanvas = null;
function lightSprite() {
  if (lightCanvas) return lightCanvas;
  lightCanvas = document.createElement('canvas');
  lightCanvas.width = 64;
  lightCanvas.height = 64;
  const g = lightCanvas.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,244,214,1)');
  gr.addColorStop(0.5, 'rgba(255,244,214,0.35)');
  gr.addColorStop(1, 'rgba(255,244,214,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return lightCanvas;
}

export function createSwarmSurvivor(canvas, cb = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const audio = cb.audio;
  const SPR = getSprites();
  const floor = ctx.createPattern(makeFloorTile(), 'repeat');
  let W = 1;
  let H = 1;
  let PX = 3; // ukuran satu piksel game di layar
  let VW = 1; // resolusi kanvas internal
  let VH = 1;
  const K = 0.52; // satuan dunia → piksel game
  let hero = HEROES[0];

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
    S.speed = 238 * (1 + 0.12 * L.speed) * hero.mods.speed;
    S.maxHp = 100 + hero.mods.hp + 25 * L.hp;
    S.regen = 0.8 * L.regen;
    S.magnet = 95 * (1 + 0.45 * L.magnet) * hero.mods.magnet;
    S.crit = 0.05 + 0.12 * L.crit;
    S.dashCd = 2.2 * 0.82 ** L.dash * hero.mods.dash;
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
      face: 1,
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
    ebullets.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: 6, dmg, life: 6, color, boss: color === C.hostile });
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
          if (dist < 150) {
            sx = -sx;
            sy = -sy;
          } else if (dist < 215) {
            const side = e.id % 2 ? 1 : -1;
            sx = (-dy / dist) * spd * side;
            sy = (dx / dist) * spd * side;
          }
          e.cd -= dt;
          if (e.cd <= 0 && dist < 330 && G.phase === 'play') {
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
      if (Math.abs(dx) > 6) e.face = dx > 0 ? 1 : -1;
      // musuh mengerubungi, tapi tidak menimpa kucingnya sampai tak terlihat
      const ox = e.x - P.x;
      const oy = e.y - P.y;
      const od = Math.hypot(ox, oy) || 1;
      const keep = e.r + P.r - 1;
      if (od < keep && e.type !== 'boss' && G.phase !== 'dead' && G.phase !== 'over') {
        e.x = P.x + (ox / od) * keep;
        e.y = P.y + (oy / od) * keep;
      }
      if (od < e.r + P.r + 1.5) hurtPlayer(e.d.dmg, -ox, -oy);
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
      if (Math.random() < 0.9) parts.push({ x: P.x, y: P.y, vx: 0, vy: 0, life: 0.22, max: 0.22, size: 15, color: C.player, ghost: Math.cos(P.aim) < 0 });
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
    P.moving = ml > 0.2;
    if ((playing || attract) && ml > 0.2 && Math.random() < 0.3) {
      parts.push({ x: P.x + rand(-6, 6), y: P.y + 12, vx: -P.vx * 0.2 + rand(-14, 14), vy: rand(-16, -4), life: 0.32, max: 0.32, size: 3, color: '#3d5a48' });
    }

    /* bidikan */
    buildGrid();
    if (playing || attract) {
      let target;
      if (input.mouse && playing) {
        const wx = cam.x + (input.mx / PX - VW / 2) / K;
        const wy = cam.y + (input.my / PX - VH / 2) / K;
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
          addXp(-g.v * hero.mods.xp);
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
    const menuShift = attract && W > 960 && W > H * 1.25 ? (VW * 0.2) / K : 0;
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

  /* ---- render (semua koordinat dalam piksel game, dibulatkan agar tetap tajam) ---- */
  const pxRing = (cx, cy, r, color, alpha, thick = 1) => {
    if (r < 1) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const n = Math.max(10, Math.ceil(TAU * r * 0.85));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), thick, thick);
    }
  };
  const shadow = (sx, sy, w) => {
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#000000';
    ctx.fillRect(Math.round(sx - w / 2), sy, Math.round(w), 2);
    ctx.fillRect(Math.round(sx - w / 2) + 1, sy + 2, Math.max(1, Math.round(w) - 2), 1);
    ctx.globalAlpha = 1;
  };
  const gemSprite = (v) => (v >= 5 ? SPR.gem3 : v >= 2 ? SPR.gem2 : SPR.gem1);

  const render = () => {
    const tr = G.shake * G.shake * 6;
    const camX = Math.round(cam.x * K + (Math.random() - 0.5) * tr);
    const camY = Math.round(cam.y * K + (Math.random() - 0.5) * tr);
    const hw = VW >> 1;
    const hh = VH >> 1;
    const X = (x) => Math.round(x * K) - camX + hw;
    const Y = (y) => Math.round(y * K) - camY + hh;
    const vis = (sx, sy, m) => sx > -m && sx < VW + m && sy > -m && sy < VH + m;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#080f0c';
    ctx.fillRect(0, 0, VW, VH);

    // lantai taman
    const fx0 = X(0);
    const fy0 = Y(0);
    const fx1 = X(ARENA.w);
    const fy1 = Y(ARENA.h);
    const ax0 = Math.max(0, fx0);
    const ay0 = Math.max(0, fy0);
    const ax1 = Math.min(VW, fx1);
    const ay1 = Math.min(VH, fy1);
    if (ax1 > ax0 && ay1 > ay0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ax0, ay0, ax1 - ax0, ay1 - ay0);
      ctx.clip();
      const ox = ((((hw - camX) % 64) + 64) % 64) - 64;
      const oy = ((((hh - camY) % 64) + 64) % 64) - 64;
      ctx.translate(ox, oy);
      ctx.fillStyle = floor;
      ctx.fillRect(0, 0, VW + 64, VH + 64);
      ctx.restore();
      for (const d of DECOR) {
        const sx = X(d.x);
        const sy = Y(d.y);
        if (vis(sx, sy, 6)) ctx.drawImage(SPR[d.kind].frames[0], sx, sy);
      }
    }
    // pagar arena
    ctx.fillStyle = '#5c4a36';
    ctx.fillRect(fx0 - 3, fy0 - 3, fx1 - fx0 + 6, 3);
    ctx.fillRect(fx0 - 3, fy1, fx1 - fx0 + 6, 3);
    ctx.fillRect(fx0 - 3, fy0 - 3, 3, fy1 - fy0 + 6);
    ctx.fillRect(fx1, fy0 - 3, 3, fy1 - fy0 + 6);
    ctx.fillStyle = '#8f7758';
    ctx.fillRect(fx0 - 3, fy0 - 3, fx1 - fx0 + 6, 1);
    ctx.fillRect(fx0 - 3, fy1, fx1 - fx0 + 6, 1);

    // cahaya hangat di sekitar pemain
    const px = X(P.x);
    const py = Y(P.y);
    ctx.globalCompositeOperation = 'lighter';
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = 0.2;
    ctx.drawImage(lightSprite(), px - 120, py - 120, 240, 240);
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // cincin efek di lantai
    for (const r of rings) {
      const sx = X(r.x);
      const sy = Y(r.y);
      const rr = r.r * K;
      if (!vis(sx, sy, rr + 4)) continue;
      pxRing(sx, sy, rr, r.color, Math.min(1, (r.life / r.max) * 1.4), r.w > 4 ? 2 : 1);
    }
    ctx.globalAlpha = 1;

    // penanda kemunculan musuh
    for (const s of spawns) {
      const sx = X(s.x);
      const sy = Y(s.y);
      if (!vis(sx, sy, 40)) continue;
      const k = s.t / s.max;
      pxRing(sx, sy, (s.r + k * 40) * K, s.color, 0.35 + (1 - k) * 0.6);
      ctx.fillRect(sx - 1, sy - 1, 2, 2);
    }
    ctx.globalAlpha = 1;

    // permata XP & pickup
    for (const g of gems) {
      const sx = X(g.x);
      const sy = Y(g.y);
      if (!vis(sx, sy, 6)) continue;
      const s = gemSprite(g.v);
      ctx.drawImage(s.frames[0], sx - 2, sy - 2 + (Math.sin(g.t * 4) > 0.3 ? -1 : 0));
    }
    for (const p of pickups) {
      const sx = X(p.x);
      const sy = Y(p.y);
      if (!vis(sx, sy, 12)) continue;
      if (p.t > 18 && Math.floor(p.t * 8) % 2) continue;
      const s = SPR[p.kind];
      shadow(sx, sy + 5, 7);
      ctx.drawImage(s.frames[0], sx - (s.w >> 1), sy - (s.h >> 1) + (Math.sin(p.t * 4) > 0 ? -1 : 0));
      pxRing(sx, sy, 8 + Math.sin(p.t * 5), p.kind === 'heart' ? C.heart : '#ffffff', 0.35);
      ctx.globalAlpha = 1;
    }

    // musuh dan pemain, diurutkan dari atas ke bawah supaya yang di depan menutupi
    enemies.sort((a, b) => a.y - b.y);
    const alive = G.phase !== 'dead' && G.phase !== 'over';
    const heroSpr = SPR[hero.id];
    const heroFlip = Math.cos(P.aim) < 0;
    let heroDrawn = !alive;
    const drawHero = () => {
      heroDrawn = true;
      shadow(px, py + 6, 14);
      if (P.inv > 0 && P.dashT <= 0 && Math.floor(G.t * 18) % 2) return;
      const f = P.moving ? Math.floor(G.t * 9) % 2 : 0;
      const bob = P.moving ? f : Math.sin(G.t * 3) > 0.7 ? 1 : 0;
      ctx.drawImage((heroFlip ? heroSpr.flip : heroSpr.frames)[f], px - (heroSpr.w >> 1), py - (heroSpr.h >> 1) - 1 + bob);
    };
    for (const e of enemies) {
      if (!heroDrawn && e.y > P.y) drawHero();
      const sx = X(e.x);
      const sy = Y(e.y);
      const s = SPR[e.type];
      if (!vis(sx, sy, s.w)) continue;
      if (e.type === 'boss' && e.mode === 2) {
        // garis ancang-ancang terjangan
        ctx.globalAlpha = 0.35 + 0.6 * (1 - e.modeT / 0.9);
        ctx.fillStyle = C.hostile;
        for (let i = 2; i < 34; i += 2) ctx.fillRect(sx + Math.round(e.lx * i * 7), sy + Math.round(e.ly * i * 7), 2, 2);
        ctx.globalAlpha = 1;
      }
      const fly = e.type === 'dart' ? 4 : 0;
      const f = Math.floor(e.t * (e.type === 'dart' ? 16 : e.type === 'boss' ? 3 : 6)) % s.frames.length;
      const flip = e.face < 0;
      shadow(sx, sy + (s.h >> 1) - 1, s.w * 0.7);
      const img = e.flash > 0 ? (flip ? s.flipWhite : s.white)[f] : (flip ? s.flip : s.frames)[f];
      ctx.drawImage(img, sx - (s.w >> 1), sy - (s.h >> 1) - fly);
      if (e.type !== 'boss' && e.maxHp > 40 && e.hp < e.maxHp) {
        const bw = s.w - 2;
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(sx - (bw >> 1), sy - (s.h >> 1) - 4 - fly, bw, 2);
        ctx.fillStyle = e.d.color;
        ctx.fillRect(sx - (bw >> 1), sy - (s.h >> 1) - 4 - fly, Math.max(1, Math.round(bw * clamp(e.hp / e.maxHp, 0, 1))), 2);
      }
    }
    if (!heroDrawn) drawHero();

    // ikan pengawal
    if (alive && L.orbit > 0) {
      for (let i = 0; i < L.orbit; i++) {
        const a = P.orbA + (i / L.orbit) * TAU;
        const fx = X(P.x + Math.cos(a) * 80);
        const fy = Y(P.y + Math.sin(a) * 80);
        const s = SPR.fish;
        ctx.drawImage((Math.sin(a) > 0 ? s.flip : s.frames)[0], fx - (s.w >> 1), fy - (s.h >> 1));
      }
    }

    // ludah musuh
    for (const b of ebullets) {
      const sx = X(b.x);
      const sy = Y(b.y);
      if (vis(sx, sy, 6)) ctx.drawImage((b.boss ? SPR.spitBoss : SPR.spit).frames[0], sx - 2, sy - 2);
    }

    // cakaran pemain
    for (const b of bullets) {
      const sx = X(b.x);
      const sy = Y(b.y);
      if (!vis(sx, sy, 8)) continue;
      const sp = Math.hypot(b.vx, b.vy) || 1;
      const ux = b.vx / sp;
      const uy = b.vy / sp;
      ctx.fillStyle = b.crit ? '#c88a14' : '#3fb6d8';
      ctx.fillRect(Math.round(sx - ux * 5) - 1, Math.round(sy - uy * 5) - 1, 2, 2);
      ctx.fillStyle = b.crit ? '#ffd15c' : '#8fe9ff';
      ctx.fillRect(Math.round(sx - ux * 2.5) - 1, Math.round(sy - uy * 2.5) - 1, 2, 2);
      ctx.fillStyle = '#ffffff';
      const z = b.crit ? 4 : 3;
      ctx.fillRect(sx - (z >> 1), sy - (z >> 1), z, z);
    }

    // roket tuna
    for (const m of missiles) {
      const sx = X(m.x);
      const sy = Y(m.y);
      const s = SPR.rocket;
      const f = Math.floor(G.t * 14) % 2;
      ctx.drawImage((m.vx < 0 ? s.flip : s.frames)[f], sx - (s.w >> 1), sy - (s.h >> 1));
    }

    // partikel
    for (const p of parts) {
      const sx = X(p.x);
      const sy = Y(p.y);
      if (!vis(sx, sy, 12)) continue;
      const k = p.life / p.max;
      if (p.ghost !== undefined) {
        ctx.globalAlpha = k * 0.55;
        ctx.drawImage((p.ghost ? heroSpr.flipWhite : heroSpr.white)[0], sx - (heroSpr.w >> 1), sy - (heroSpr.h >> 1));
        ctx.globalAlpha = 1;
        continue;
      }
      const z = k > 0.5 && p.size > 3.2 ? 2 : 1;
      ctx.globalAlpha = Math.min(1, k * 1.6);
      ctx.fillStyle = p.color;
      ctx.fillRect(sx, sy, z, z);
    }
    ctx.globalAlpha = 1;

    // setrum
    for (const b of bolts) {
      ctx.globalAlpha = Math.min(1, (b.life / b.max) * 1.5);
      for (let i = 0; i < b.pts.length - 1; i++) {
        const x0 = X(b.pts[i][0]);
        const y0 = Y(b.pts[i][1]);
        const x1 = X(b.pts[i + 1][0]);
        const y1 = Y(b.pts[i + 1][1]);
        const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
        for (let k = 0; k <= steps; k++) {
          const t = k / steps;
          const jx = k % 3 === 0 ? 0 : Math.round(rand(-2, 2));
          const jy = k % 3 === 0 ? 0 : Math.round(rand(-2, 2));
          const bx = Math.round(x0 + (x1 - x0) * t) + jx;
          const by = Math.round(y0 + (y1 - y0) * t) + jy;
          ctx.fillStyle = '#7fb8ff';
          ctx.fillRect(bx - 1, by, 3, 1);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx, by, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1;

    // angka melayang
    for (const t of texts) {
      const sx = X(t.x);
      const sy = Y(t.y);
      if (!vis(sx, sy, 20)) continue;
      ctx.globalAlpha = Math.min(1, (t.life / t.max) * 1.8);
      drawNumber(ctx, t.text, sx, sy - 4, t.color);
    }
    ctx.globalAlpha = 1;

    // joystick sentuh
    if (input.joy) {
      const jx = input.joy.ox / PX;
      const jy = input.joy.oy / PX;
      const jr = 52 / PX;
      pxRing(jx, jy, jr, '#ffffff', 0.5);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = C.player;
      ctx.fillRect(Math.round(jx + input.jx * jr) - 2, Math.round(jy + input.jy * jr) - 2, 5, 5);
      ctx.globalAlpha = 1;
    }
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

  const stage = canvas.parentElement;
  const resize = () => {
    W = Math.max(1, stage.clientWidth);
    H = Math.max(1, stage.clientHeight);
    PX = Math.max(2, Math.round(Math.min(W, H) / 200));
    VW = Math.ceil(W / PX);
    VH = Math.ceil(H / PX);
    canvas.width = VW;
    canvas.height = VH;
    canvas.style.width = `${VW * PX}px`;
    canvas.style.height = `${VH * PX}px`;
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);

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
    setHero: (id) => {
      const next = HEROES.find((h) => h.id === id);
      if (!next || next === hero) return;
      hero = next;
      if (G.phase === 'menu') reset(true);
      else recalc();
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
      canvas.style.width = '';
      canvas.style.height = '';
    },
  };
}
