// Polyblok Matrix — puzzle susun balok bergaya retro.
// Baloknya campuran 1 sampai 5 petak (bukan set tetromino baku), dan baris yang penuh
// mengisi meter "Surge" yang bisa dipakai menghapus tiga baris terbawah sekaligus.

const W = 10;
const H = 18;
const C = 16;
export const VIEW = { w: W * C, h: H * C };
export const SURGE_MAX = 10;

const PIECES = [
  { id: 'dot', cells: [[0, 0]], color: ['#f6f4ee', '#ffffff', '#a9a7b8'], weight: 5 },
  { id: 'duo', cells: [[0, 0], [1, 0]], color: ['#ff8fc0', '#ffd0e4', '#c2507f'], weight: 8 },
  { id: 'tri', cells: [[0, 0], [1, 0], [2, 0]], color: ['#5ff0c0', '#c8ffee', '#249c78'], weight: 10 },
  { id: 'elbow', cells: [[0, 0], [0, 1], [1, 1]], color: ['#ffd15c', '#fff0b8', '#c08a14'], weight: 10 },
  { id: 'quad', cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: ['#7fa8ff', '#cfe0ff', '#3a5fd0'], weight: 8 },
  { id: 'plus', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], color: ['#ff5d6c', '#ffb8c0', '#b0222e'], weight: 3 },
  { id: 'cup', cells: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]], color: ['#b47bff', '#e0ccff', '#6a34c8'], weight: 4 },
  { id: 'hook', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], color: ['#f29a3a', '#ffd6a0', '#a85e12'], weight: 4 },
  { id: 'stair', cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], color: ['#56d07a', '#b8f5c8', '#22883f'], weight: 3 },
  { id: 'tee', cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]], color: ['#4de1ff', '#c4f6ff', '#1890b0'], weight: 4 },
];

// empat rotasi tiap balok, dinormalkan ke pojok kiri atas
const ROTS = PIECES.map((p) => {
  const out = [];
  let cells = p.cells;
  for (let r = 0; r < 4; r++) {
    const minX = Math.min(...cells.map((c) => c[0]));
    const minY = Math.min(...cells.map((c) => c[1]));
    const norm = cells.map(([x, y]) => [x - minX, y - minY]);
    out.push({ cells: norm, w: Math.max(...norm.map((c) => c[0])) + 1, h: Math.max(...norm.map((c) => c[1])) + 1 });
    cells = norm.map(([x, y]) => [-y, x]);
  }
  return out;
});
const BAG = PIECES.flatMap((p, i) => Array(p.weight).fill(i));
const rand = (a, b) => a + Math.random() * (b - a);

export function createPolyblok(canvas, nextCanvas, cb = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = VIEW.w;
  canvas.height = VIEW.h;
  const nctx = nextCanvas.getContext('2d');
  const audio = cb.audio;

  const G = { phase: 'menu', paused: false, t: 0, score: 0, lines: 0, level: 1, surge: 0, fallT: 0, lockT: 0, lockMoves: 0, clearT: 0, shake: 0, pieces: 0 };
  let grid = new Uint8Array(W * H);
  let cur = null;
  let queue = [];
  let clearing = null; // baris yang sedang berkedip sebelum dihapus
  let parts = [];
  const input = { left: false, right: false, down: false, dir: 0, das: 0 };
  const hud = {};
  // hujan kode di latar
  const rain = Array.from({ length: W }, (_, i) => ({ y: rand(-H, H), speed: rand(2.5, 6), seed: i * 7 + 3 }));

  const refill = () => {
    while (queue.length < 4) queue.push(BAG[Math.floor(Math.random() * BAG.length)]);
  };
  const shape = (p = cur) => ROTS[p.type][p.rot];
  const collide = (type, rot, x, y) => {
    for (const [cx, cy] of ROTS[type][rot].cells) {
      const gx = x + cx;
      const gy = y + cy;
      if (gx < 0 || gx >= W || gy >= H) return true;
      if (gy >= 0 && grid[gy * W + gx]) return true;
    }
    return false;
  };
  const ghostY = () => {
    let y = cur.y;
    while (!collide(cur.type, cur.rot, cur.x, y + 1)) y += 1;
    return y;
  };

  const drawNext = () => {
    nctx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const cs = 8;
    for (let i = 0; i < 3; i++) {
      const type = queue[i];
      if (type === undefined) continue;
      const s = ROTS[type][0];
      const ox = Math.floor((nextCanvas.width - s.w * cs) / 2);
      const oy = i * 34 + Math.floor((30 - s.h * cs) / 2) + 2;
      const [base, hi, lo] = PIECES[type].color;
      for (const [cx, cy] of s.cells) {
        nctx.fillStyle = base;
        nctx.fillRect(ox + cx * cs, oy + cy * cs, cs, cs);
        nctx.fillStyle = hi;
        nctx.fillRect(ox + cx * cs, oy + cy * cs, cs, 1);
        nctx.fillStyle = lo;
        nctx.fillRect(ox + cx * cs, oy + cy * cs + cs - 1, cs, 1);
      }
    }
  };

  const gameOver = () => {
    G.phase = 'over';
    cur = null;
    audio?.stopMusic();
    audio?.tone({ freq: 330, to: 55, dur: 0.9, type: 'sawtooth', vol: 0.12 });
    cb.onState?.('over', { score: G.score, lines: G.lines, level: G.level });
  };

  const spawn = () => {
    refill();
    const type = queue.shift();
    refill();
    drawNext();
    const s = ROTS[type][0];
    cur = { type, rot: 0, x: Math.floor((W - s.w) / 2), y: 0 };
    G.fallT = 0;
    G.lockT = 0;
    G.lockMoves = 0;
    G.pieces += 1;
    if (collide(cur.type, cur.rot, cur.x, cur.y)) gameOver();
  };

  const burst = (row, color) => {
    for (let x = 0; x < W; x++) {
      for (let i = 0; i < 2; i++) parts.push({ x: x * C + rand(2, C - 2), y: row * C + rand(2, C - 2), vx: rand(-40, 40), vy: rand(-70, -10), life: rand(0.3, 0.7), color });
    }
  };

  const startClear = (rows, bonus) => {
    clearing = { rows, t: 0.26, bonus };
    G.shake = rows.length >= 3 ? 0.5 : 0.25;
    rows.forEach((r) => burst(r, '#ffffff'));
  };

  const lock = () => {
    for (const [cx, cy] of shape().cells) {
      const gy = cur.y + cy;
      if (gy >= 0) grid[gy * W + cur.x + cx] = cur.type + 1;
    }
    cur = null;
    audio?.tone({ freq: 150, to: 90, dur: 0.07, type: 'square', vol: 0.06 });
    const rows = [];
    for (let y = 0; y < H; y++) {
      let full = true;
      for (let x = 0; x < W; x++) {
        if (!grid[y * W + x]) {
          full = false;
          break;
        }
      }
      if (full) rows.push(y);
    }
    if (rows.length) {
      startClear(rows, false);
      audio?.tone({ freq: 523, to: 1047, dur: 0.22, type: 'square', vol: 0.08 });
      if (rows.length >= 3) audio?.tone({ freq: 784, to: 1568, dur: 0.3, type: 'triangle', vol: 0.09, delay: 0.08 });
    } else spawn();
  };

  const finishClear = () => {
    const { rows, bonus } = clearing;
    clearing = null;
    const keep = [];
    for (let y = 0; y < H; y++) if (!rows.includes(y)) keep.push(y);
    const next = new Uint8Array(W * H);
    let dst = H - 1;
    for (let i = keep.length - 1; i >= 0; i--) {
      next.set(grid.subarray(keep[i] * W, keep[i] * W + W), dst * W);
      dst -= 1;
    }
    grid = next;
    const n = rows.length;
    if (bonus) {
      G.score += 300 * G.level;
    } else {
      G.score += [0, 100, 300, 600, 1000, 1500][Math.min(5, n)] * G.level;
      G.lines += n;
      G.surge = Math.min(SURGE_MAX, G.surge + n + (n >= 2 ? 1 : 0));
      const lvl = 1 + Math.floor(G.lines / 8);
      if (lvl > G.level) {
        G.level = lvl;
        cb.onPopup?.(`LEVEL ${lvl}`, 'hot');
        audio?.tone({ freq: 392, to: 784, dur: 0.4, type: 'triangle', vol: 0.09 });
      }
      if (n >= 3) cb.onPopup?.('TIGA BARIS!', 'good');
    }
    spawn();
  };

  const tryMove = (dx) => {
    if (!cur || collide(cur.type, cur.rot, cur.x + dx, cur.y)) return false;
    cur.x += dx;
    if (G.lockMoves < 10) {
      G.lockT = 0;
      G.lockMoves += 1;
    }
    return true;
  };

  /* ---- pemain otomatis (hanya untuk simulasi saat pengembangan) ---- */
  let auto = false;
  let autoT = 0;
  const autoplay = () => {
    let best = null;
    let bestScore = -Infinity;
    for (let rot = 0; rot < 4; rot++) {
      const s = ROTS[cur.type][rot];
      for (let x = 0; x <= W - s.w; x++) {
        if (collide(cur.type, rot, x, 0)) continue;
        let y = 0;
        while (!collide(cur.type, rot, x, y + 1)) y += 1;
        const g = grid.slice();
        for (const [cx, cy] of s.cells) g[(y + cy) * W + x + cx] = 1;
        let holes = 0;
        let height = 0;
        let lines = 0;
        let bump = 0;
        let prev = -1;
        for (let yy = 0; yy < H; yy++) {
          let full = true;
          for (let xx = 0; xx < W; xx++) if (!g[yy * W + xx]) full = false;
          if (full) lines += 1;
        }
        for (let xx = 0; xx < W; xx++) {
          let top = H;
          for (let yy = 0; yy < H; yy++) {
            if (g[yy * W + xx]) {
              if (top === H) top = yy;
            } else if (top !== H) holes += 1;
          }
          const hgt = H - top;
          height += hgt;
          if (prev >= 0) bump += Math.abs(hgt - prev);
          prev = hgt;
        }
        const sc = lines * 12 - holes * 9 - height * 0.5 - bump * 0.35;
        if (sc > bestScore) {
          bestScore = sc;
          best = { rot, x };
        }
      }
    }
    if (best) {
      cur.rot = best.rot;
      cur.x = best.x;
    }
    api.drop();
  };

  /* ---- pembaruan ---- */
  const update = (dt) => {
    G.t += dt;
    G.shake = Math.max(0, G.shake - dt * 2.5);
    for (const r of rain) {
      r.y += r.speed * dt;
      if (r.y > H + 8) {
        r.y = -rand(2, 10);
        r.speed = rand(2.5, 6);
      }
    }
    for (const p of parts) {
      p.life -= dt;
      p.vy += 260 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    parts = parts.filter((p) => p.life > 0);
    if (G.phase !== 'play') return;

    if (clearing) {
      clearing.t -= dt;
      if (clearing.t <= 0) finishClear();
      return;
    }
    if (!cur) return;

    if (auto) {
      autoT -= dt;
      if (autoT <= 0) {
        autoT = 0.09;
        autoplay();
      }
      return;
    }

    // geser berulang saat tombol ditahan
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== input.dir) {
      input.dir = dir;
      input.das = 0.17;
      if (dir) tryMove(dir);
    } else if (dir) {
      input.das -= dt;
      while (input.das <= 0) {
        input.das += 0.045;
        if (!tryMove(dir)) break;
      }
    }

    const interval = Math.max(0.06, 0.8 * 0.86 ** (G.level - 1));
    G.fallT += dt * (input.down ? 14 : 1);
    while (cur && G.fallT >= interval) {
      G.fallT -= interval;
      if (!collide(cur.type, cur.rot, cur.x, cur.y + 1)) {
        cur.y += 1;
        if (input.down) G.score += 1;
      } else {
        G.fallT = 0;
        break;
      }
    }
    if (cur && collide(cur.type, cur.rot, cur.x, cur.y + 1)) {
      G.lockT += dt;
      if (G.lockT >= 0.45) lock();
    } else {
      G.lockT = 0;
    }
  };

  /* ---- render ---- */
  const block = (px, py, type, alpha = 1) => {
    const [base, hi, lo] = PIECES[type].color;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = base;
    ctx.fillRect(px, py, C, C);
    ctx.fillStyle = hi;
    ctx.fillRect(px, py, C, 2);
    ctx.fillRect(px, py, 2, C);
    ctx.fillRect(px + 4, py + 4, 3, 3);
    ctx.fillStyle = lo;
    ctx.fillRect(px, py + C - 2, C, 2);
    ctx.fillRect(px + C - 2, py, 2, C);
    ctx.globalAlpha = 1;
  };

  const render = () => {
    const sx = G.shake > 0 ? Math.round((Math.random() - 0.5) * G.shake * 5) : 0;
    const sy = G.shake > 0 ? Math.round((Math.random() - 0.5) * G.shake * 5) : 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#070b0c';
    ctx.fillRect(0, 0, VIEW.w, VIEW.h);
    ctx.setTransform(1, 0, 0, 1, sx, sy);

    // hujan kode: deretan 0 dan 1 yang memudar ke atas
    for (let i = 0; i < W; i++) {
      const r = rain[i];
      const head = Math.floor(r.y);
      for (let k = 0; k < 7; k++) {
        const gy = head - k;
        if (gy < 0 || gy >= H) continue;
        ctx.fillStyle = k === 0 ? '#2fae6b' : k < 3 ? '#17603c' : '#0e3a26';
        const px = i * C + 6;
        const py = gy * C + 5;
        if ((gy * 31 + r.seed + Math.floor(G.t * 3)) % 3 === 0) {
          ctx.fillRect(px + 1, py, 1, 6);
        } else {
          ctx.fillRect(px, py, 3, 1);
          ctx.fillRect(px, py + 5, 3, 1);
          ctx.fillRect(px, py, 1, 6);
          ctx.fillRect(px + 2, py, 1, 6);
        }
      }
    }
    // titik kisi
    ctx.fillStyle = '#16221f';
    for (let y = 1; y < H; y++) for (let x = 1; x < W; x++) ctx.fillRect(x * C, y * C, 1, 1);

    // tumpukan
    const flash = clearing && Math.floor(clearing.t * 24) % 2 === 0;
    for (let y = 0; y < H; y++) {
      const hit = clearing && clearing.rows.includes(y);
      for (let x = 0; x < W; x++) {
        const v = grid[y * W + x];
        if (!v) continue;
        if (hit && flash) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x * C, y * C, C, C);
        } else block(x * C, y * C, v - 1);
      }
    }

    if (cur && G.phase === 'play') {
      const s = shape();
      const gy = ghostY();
      ctx.strokeStyle = PIECES[cur.type].color[0];
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      for (const [cx, cy] of s.cells) ctx.strokeRect((cur.x + cx) * C + 1.5, (gy + cy) * C + 1.5, C - 3, C - 3);
      ctx.globalAlpha = 1;
      for (const [cx, cy] of s.cells) block((cur.x + cx) * C, (cur.y + cy) * C, cur.type);
    }

    for (const p of parts) {
      ctx.globalAlpha = Math.min(1, p.life * 2.5);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
    }
    ctx.globalAlpha = 1;
  };

  /* ---- loop ---- */
  let raf = 0;
  let last = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const raw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    if (G.paused) return;
    update(Math.min(0.05, raw));
    render();
    hud.score = G.score;
    hud.lines = G.lines;
    hud.level = G.level;
    hud.surge = G.surge / SURGE_MAX;
    cb.onHud?.(hud);
  };

  const api = {
    start: () => {
      grid = new Uint8Array(W * H);
      queue = [];
      parts = [];
      clearing = null;
      Object.assign(G, { phase: 'play', paused: false, score: 0, lines: 0, level: 1, surge: 0, shake: 0, pieces: 0 });
      Object.assign(input, { left: false, right: false, down: false, dir: 0 });
      spawn();
      audio?.startMusic('drive');
      cb.onState?.('play');
    },
    toMenu: () => {
      grid = new Uint8Array(W * H);
      cur = null;
      clearing = null;
      queue = [];
      G.phase = 'menu';
      G.paused = false;
      drawNext();
      audio?.stopMusic();
      cb.onState?.('menu');
    },
    press: (key, down) => {
      if (key in input) input[key] = down;
    },
    rotate: () => {
      if (!cur || G.phase !== 'play' || clearing) return;
      const rot = (cur.rot + 1) % 4;
      for (const [kx, ky] of [[0, 0], [-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0]]) {
        if (!collide(cur.type, rot, cur.x + kx, cur.y + ky)) {
          cur.rot = rot;
          cur.x += kx;
          cur.y += ky;
          if (G.lockMoves < 10) {
            G.lockT = 0;
            G.lockMoves += 1;
          }
          audio?.tone({ freq: 660, dur: 0.04, type: 'square', vol: 0.04 });
          return;
        }
      }
    },
    drop: () => {
      if (!cur || G.phase !== 'play' || clearing) return;
      const y = ghostY();
      G.score += (y - cur.y) * 2;
      cur.y = y;
      G.shake = Math.max(G.shake, 0.18);
      lock();
    },
    surge: () => {
      if (G.phase !== 'play' || clearing || G.surge < SURGE_MAX) return;
      const rows = [];
      for (let y = H - 1; y >= 0 && rows.length < 3; y--) {
        let any = false;
        for (let x = 0; x < W; x++) if (grid[y * W + x]) any = true;
        if (any) rows.push(y);
      }
      if (!rows.length) return;
      G.surge = 0;
      startClear(rows, true);
      rows.forEach((r) => burst(r, '#7dffb2'));
      cb.onPopup?.('SURGE!', 'hot');
      audio?.noise({ dur: 0.5, vol: 0.2, from: 300, to: 4000, q: 0.8 });
      audio?.tone({ freq: 110, to: 880, dur: 0.45, type: 'sawtooth', vol: 0.1 });
    },
    setPaused: (p) => {
      G.paused = p;
      last = 0;
    },
    destroy: () => cancelAnimationFrame(raf),
  };
  if (import.meta.env.DEV || import.meta.env.VITE_PG_DEBUG) {
    api.debug = {
      auto: (v) => (auto = v),
      state: () => ({ phase: G.phase, score: G.score, lines: G.lines, level: G.level, pieces: G.pieces }),
    };
  }

  drawNext();
  raf = requestAnimationFrame(frame);
  return api;
}
