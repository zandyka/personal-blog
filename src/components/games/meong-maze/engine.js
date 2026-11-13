// Meong Maze — kejar-kejaran labirin bergaya retro.
// Kucing memunguti remah ikan di rumah pada malam hari sambil dikejar robot penyedot debu.
// Catnip membuat robot korslet sehingga bisa diterkam; Spasi untuk terkaman kilat.
import { getSprites, drawNumber } from '../shared/pixelSprites';

const T = 16;
const COLS = 19;
const ROWS = 21;
export const VIEW = { w: COLS * T, h: ROWS * T };

// '#' dinding, '.' remah ikan, 'o' catnip, 'D' dok robot, '=' pintu dok, 'P' posisi awal
const MAP = [
  '###################',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#o##.###.#.###.##o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###.#.###.####',
  '#....#.......#....#',
  '#.##.#.##=##.#.##.#',
  '#.#....#DDD#....#.#',
  '#.#.##.#####.##.#.#',
  '#......  P  ......#',
  '#.##.#.#####.#.##.#',
  '#..#.#...#...#.#..#',
  '##.#.###.#.###.#.##',
  '#....#.......#....#',
  '#.####.##.##.####.#',
  '#o...............o#',
  '########...########',
  '###################',
];
const START = [9, 12];
const GATE_OUT = [9, 8];
const DOCK = [9, 10];

const THEMES = [
  { floorA: '#2b2536', floorB: '#322b3f', top: '#b9795a', face: '#8a5340', dark: '#4f2c24', mortar: '#6c3f31' },
  { floorA: '#1f2e2c', floorB: '#253633', top: '#6fae8a', face: '#44806a', dark: '#234a3e', mortar: '#346454' },
  { floorA: '#24223a', floorB: '#2a2843', top: '#9a8fe0', face: '#6a5fb8', dark: '#37306e', mortar: '#514896' },
];

const ROBOTS = [
  { id: 'rumbi', sprite: 'robotRed', corner: [17, 1], release: 0 },
  { id: 'sapu', sprite: 'robotBlue', corner: [1, 1], release: 3 },
  { id: 'debu', sprite: 'robotGreen', corner: [17, 18], release: 7 },
  { id: 'vak', sprite: 'robotOrange', corner: [1, 18], release: 12 },
];

const DIR4 = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
const rand = (a, b) => a + Math.random() * (b - a);

export function createMeongMaze(canvas, cb = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = VIEW.w;
  canvas.height = VIEW.h;
  const SPR = getSprites();
  const audio = cb.audio;
  const bg = document.createElement('canvas');
  bg.width = VIEW.w;
  bg.height = VIEW.h;

  const cell = (x, y) => (MAP[y] && MAP[y][x]) || '#';
  const isWall = (x, y) => cell(x, y) === '#';
  // robot boleh lewat dok dan pintunya; kucing tidak
  const open = (x, y, robot) => {
    const c = cell(x, y);
    if (c === '#') return false;
    return robot || (c !== 'D' && c !== '=');
  };

  const G = { phase: 'menu', paused: false, t: 0, level: 1, score: 0, lives: 3, left: 0, fright: 0, frightMax: 1, chain: 0, modeT: 0, scatter: true, stateT: 0, pounceCd: 0, pounceT: 0, bonus: null, bonusStage: 0, total: 0, wave: 0 };
  let hero = 'maxwell';
  let items = []; // 0 kosong, 1 remah, 2 catnip (per ubin)
  const player = { x: START[0], y: START[1], dx: 0, dy: 0, p: 0, wx: 0, wy: 0, face: 1, moving: false };
  let robots = [];
  let parts = [];
  let texts = [];
  const hud = {};

  /* ---- latar: lantai dan dinding digambar sekali per level ---- */
  const paintBackground = () => {
    const th = THEMES[(G.level - 1) % THEMES.length];
    const g = bg.getContext('2d');
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = x * T;
        const py = y * T;
        const c = cell(x, y);
        if (c === '#') {
          g.fillStyle = th.face;
          g.fillRect(px, py, T, T);
          // susunan bata
          g.fillStyle = th.mortar;
          g.fillRect(px, py + 5, T, 1);
          g.fillRect(px, py + 11, T, 1);
          g.fillRect(px + 7, py, 1, 5);
          g.fillRect(px + 3, py + 6, 1, 5);
          g.fillRect(px + 11, py + 6, 1, 5);
          g.fillRect(px + 7, py + 12, 1, 4);
          if (!isWall(x, y - 1)) {
            g.fillStyle = th.top;
            g.fillRect(px, py, T, 2);
          }
          if (!isWall(x, y + 1)) {
            g.fillStyle = th.dark;
            g.fillRect(px, py + T - 3, T, 3);
          }
          if (!isWall(x - 1, y)) {
            g.fillStyle = th.top;
            g.fillRect(px, py, 1, T);
          }
          if (!isWall(x + 1, y)) {
            g.fillStyle = th.dark;
            g.fillRect(px + T - 1, py, 1, T);
          }
        } else {
          g.fillStyle = (x + y) % 2 ? th.floorA : th.floorB;
          g.fillRect(px, py, T, T);
          g.fillStyle = 'rgba(255,255,255,0.03)';
          g.fillRect(px, py, T, 1);
          if (c === 'D') {
            // dok pengisian daya
            g.fillStyle = '#2a2d3a';
            g.fillRect(px + 1, py + 1, T - 2, T - 2);
            g.fillStyle = '#ffd15c';
            for (let i = 0; i < 4; i++) g.fillRect(px + 2 + i * 4, py + T - 4, 2, 2);
          } else if (c === '=') {
            g.fillStyle = '#ffd15c';
            g.fillRect(px, py + 7, T, 2);
          }
          // bayangan dinding di atas lantai
          if (isWall(x, y - 1)) {
            g.fillStyle = 'rgba(0,0,0,0.28)';
            g.fillRect(px, py, T, 3);
          }
        }
      }
    }
  };

  const loadItems = () => {
    items = [];
    G.left = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const c = cell(x, y);
        const v = c === '.' ? 1 : c === 'o' ? 2 : 0;
        items.push(v);
        if (v) G.left += 1;
      }
    }
    G.total = G.left;
    G.bonusStage = 0;
    G.bonus = null;
  };

  const placeActors = () => {
    Object.assign(player, { x: START[0], y: START[1], dx: 0, dy: 0, p: 0, wx: 0, wy: 0, moving: false });
    robots = ROBOTS.map((def, i) => ({
      def,
      x: i === 0 ? GATE_OUT[0] : DOCK[0] + (i - 2),
      y: i === 0 ? GATE_OUT[1] : DOCK[1],
      dx: i === 0 ? -1 : 0,
      dy: 0,
      p: 0,
      state: i === 0 ? 'roam' : 'dock',
      fright: false,
      releaseT: Math.max(0, def.release - (G.level - 1)),
      wander: [9, 4],
      wanderT: 0,
    }));
    G.fright = 0;
    G.chain = 0;
    G.modeT = 6;
    G.scatter = true;
    G.pounceT = 0;
  };

  const spark = (x, y, n, color) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(20, 70);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.25, 0.55), color });
    }
  };
  const addScore = (v, x, y) => {
    G.score += v;
    if (x !== undefined) texts.push({ x, y, text: String(v), life: 0.9 });
  };

  /* ---- gerak di kisi ---- */
  const pix = (e) => [(e.x + e.dx * e.p) * T + T / 2, (e.y + e.dy * e.p) * T + T / 2];
  const reverse = (e) => {
    if (!e.dx && !e.dy) return;
    e.x += e.dx;
    e.y += e.dy;
    e.dx = -e.dx;
    e.dy = -e.dy;
    e.p = 1 - e.p;
  };
  const advance = (e, speed, dt, onTile) => {
    if (!e.dx && !e.dy) {
      onTile(e);
      if (!e.dx && !e.dy) return;
    }
    e.p += speed * dt;
    while (e.p >= 1) {
      e.x += e.dx;
      e.y += e.dy;
      e.p -= 1;
      onTile(e);
      if (!e.dx && !e.dy) {
        e.p = 0;
        break;
      }
    }
  };

  const startFright = () => {
    G.frightMax = Math.max(3, 7.5 - G.level * 0.5);
    G.fright = G.frightMax;
    G.chain = 0;
    robots.forEach((r) => {
      if (r.state === 'roam') {
        r.fright = true;
        reverse(r);
      }
    });
    cb.onPopup?.('CATNIP!', 'good');
    audio?.tone({ freq: 330, to: 990, dur: 0.35, type: 'square', vol: 0.08 });
  };

  const playerTile = (e) => {
    const i = e.y * COLS + e.x;
    if (items[i] === 1) {
      items[i] = 0;
      G.left -= 1;
      addScore(10);
      G.wave += 1;
      audio?.tone({ freq: G.wave % 2 ? 520 : 620, dur: 0.05, type: 'square', vol: 0.04 });
    } else if (items[i] === 2) {
      items[i] = 0;
      G.left -= 1;
      addScore(50);
      startFright();
    }
    if (G.bonus && G.bonus.x === e.x && G.bonus.y === e.y) {
      const v = G.bonus.gold ? 500 : 300;
      addScore(v, e.x * T + 8, e.y * T);
      spark(e.x * T + 8, e.y * T + 8, 14, '#ffd15c');
      G.bonus = null;
      audio?.tone({ freq: 660, to: 1320, dur: 0.25, type: 'triangle', vol: 0.1 });
    }
    // belok sesuai keinginan pemain bila memungkinkan
    if ((e.wx || e.wy) && open(e.x + e.wx, e.y + e.wy, false)) {
      e.dx = e.wx;
      e.dy = e.wy;
    } else if (!open(e.x + e.dx, e.y + e.dy, false)) {
      e.dx = 0;
      e.dy = 0;
    }
  };

  const robotTarget = (r) => {
    if (r.state === 'leave') return GATE_OUT;
    if (r.state === 'eyes') return DOCK;
    if (G.scatter) return r.def.corner;
    const id = r.def.id;
    if (id === 'rumbi') return [player.x, player.y];
    if (id === 'sapu') return [player.x + player.dx * 3, player.y + player.dy * 3];
    if (id === 'debu') return Math.abs(player.x - r.x) + Math.abs(player.y - r.y) > 6 ? [player.x, player.y] : r.def.corner;
    return r.wander;
  };

  const robotTile = (r) => {
    if (r.state === 'dock') {
      r.dx = 0;
      r.dy = 0;
      return;
    }
    if (r.state === 'leave' && r.x === GATE_OUT[0] && r.y === GATE_OUT[1]) r.state = 'roam';
    if (r.state === 'eyes' && r.x === DOCK[0] && r.y === DOCK[1]) {
      r.state = 'dock';
      r.fright = false;
      r.releaseT = 1.2;
      r.dx = 0;
      r.dy = 0;
      return;
    }
    const access = r.state !== 'roam';
    const opts = [];
    for (const [dx, dy] of DIR4) {
      if (dx === -r.dx && dy === -r.dy && (r.dx || r.dy)) continue;
      if (open(r.x + dx, r.y + dy, access)) opts.push([dx, dy]);
    }
    if (!opts.length) {
      r.dx = -r.dx;
      r.dy = -r.dy;
      return;
    }
    let pick = opts[0];
    if (r.fright && r.state === 'roam') {
      pick = opts[Math.floor(Math.random() * opts.length)];
    } else {
      const [tx, ty] = robotTarget(r);
      let best = Infinity;
      for (const o of opts) {
        const d = (r.x + o[0] - tx) ** 2 + (r.y + o[1] - ty) ** 2;
        if (d < best) {
          best = d;
          pick = o;
        }
      }
    }
    r.dx = pick[0];
    r.dy = pick[1];
  };

  /* ---- autopilot (hanya untuk simulasi saat pengembangan) ---- */
  let auto = false;
  let god = false;
  const autopilot = () => {
    const danger = new Set();
    for (const r of robots) {
      if (r.state !== 'roam' || r.fright) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 2) danger.add((r.y + dy) * COLS + r.x + dx);
    }
    const sx = player.x + (player.p > 0.5 ? player.dx : 0);
    const sy = player.y + (player.p > 0.5 ? player.dy : 0);
    const prev = new Map([[sy * COLS + sx, null]]);
    const queue = [[sx, sy]];
    let goal = null;
    while (queue.length && !goal) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of DIR4) {
        const nx = x + dx;
        const ny = y + dy;
        const k = ny * COLS + nx;
        if (prev.has(k) || !open(nx, ny, false) || danger.has(k)) continue;
        prev.set(k, [x, y, dx, dy]);
        if (items[k]) {
          goal = k;
          break;
        }
        queue.push([nx, ny]);
      }
    }
    if (goal === null) {
      // tidak ada jalan aman: menjauh dari robot terdekat
      let best = null;
      let bd = -1;
      for (const [dx, dy] of DIR4) {
        if (!open(sx + dx, sy + dy, false)) continue;
        let d = Infinity;
        for (const r of robots) if (r.state === 'roam' && !r.fright) d = Math.min(d, Math.abs(r.x - sx - dx) + Math.abs(r.y - sy - dy));
        if (d > bd) {
          bd = d;
          best = [dx, dy];
        }
      }
      if (best) [player.wx, player.wy] = best;
      return;
    }
    let k = goal;
    let step = prev.get(k);
    while (step && prev.get(step[1] * COLS + step[0])) {
      k = step[1] * COLS + step[0];
      step = prev.get(k);
    }
    if (step) {
      player.wx = step[2];
      player.wy = step[3];
    }
  };

  /* ---- pembaruan ---- */
  const beginReady = (text) => {
    placeActors();
    G.phase = 'ready';
    G.stateT = 1.6;
    cb.onPopup?.(text, 'count');
  };

  const update = (dt) => {
    G.t += dt;
    for (const p of parts) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    parts = parts.filter((p) => p.life > 0);
    for (const t of texts) {
      t.life -= dt;
      t.y -= 14 * dt;
    }
    texts = texts.filter((t) => t.life > 0);

    if (G.phase === 'menu') {
      // demo: robot berpatroli di belakang menu
      for (const r of robots) {
        if (r.state === 'dock') {
          r.releaseT -= dt;
          if (r.releaseT <= 0) r.state = 'leave';
        }
        advance(r, 4, dt, robotTile);
      }
      G.modeT -= dt;
      if (G.modeT <= 0) {
        G.modeT = 8;
        G.scatter = !G.scatter;
      }
      return;
    }
    if (G.phase === 'ready' || G.phase === 'dying' || G.phase === 'clear') {
      G.stateT -= dt;
      if (G.stateT > 0) return;
      if (G.phase === 'ready') {
        G.phase = 'play';
        cb.onState?.('play');
      } else if (G.phase === 'dying') {
        G.lives -= 1;
        if (G.lives <= 0) {
          G.phase = 'over';
          audio?.stopMusic();
          cb.onState?.('over', { score: G.score, level: G.level });
        } else beginReady('SIAP!');
      } else {
        G.level += 1;
        paintBackground();
        loadItems();
        beginReady(`LEVEL ${G.level}`);
      }
      return;
    }
    if (G.phase !== 'play') return;

    if (auto) autopilot();

    /* kucing */
    if ((player.wx || player.wy) && player.wx === -player.dx && player.wy === -player.dy) reverse(player);
    G.pounceCd = Math.max(0, G.pounceCd - dt);
    G.pounceT = Math.max(0, G.pounceT - dt);
    const pSpeed = 6.4 * (G.pounceT > 0 ? 2.3 : 1);
    advance(player, pSpeed, dt, playerTile);
    player.moving = !!(player.dx || player.dy);
    if (player.dx) player.face = player.dx;
    if (G.pounceT > 0 && Math.random() < 0.6) {
      const [px, py] = pix(player);
      parts.push({ x: px, y: py, vx: 0, vy: 0, life: 0.2, ghost: player.face < 0 });
    }

    /* mode robot: berpencar ↔ memburu */
    G.modeT -= dt;
    if (G.modeT <= 0) {
      G.scatter = !G.scatter;
      G.modeT = G.scatter ? Math.max(3, 6 - G.level * 0.4) : 18;
      robots.forEach((r) => r.state === 'roam' && !r.fright && reverse(r));
    }
    if (G.fright > 0) {
      G.fright -= dt;
      if (G.fright <= 0) robots.forEach((r) => (r.fright = false));
    }

    const base = Math.min(6.5, 5.1 + G.level * 0.25);
    const [px, py] = pix(player);
    for (const r of robots) {
      if (r.state === 'dock') {
        r.releaseT -= dt;
        if (r.releaseT <= 0) r.state = 'leave';
        continue;
      }
      if (r.def.id === 'vak') {
        r.wanderT -= dt;
        if (r.wanderT <= 0) {
          r.wanderT = 5;
          r.wander = [1 + Math.floor(Math.random() * (COLS - 2)), 1 + Math.floor(Math.random() * (ROWS - 2))];
        }
      }
      const speed = r.state === 'eyes' ? 12 : r.state === 'leave' ? 4 : r.fright ? 3.4 : base;
      advance(r, speed, dt, robotTile);
      if (r.state !== 'roam') continue;
      const [rx, ry] = pix(r);
      if (Math.abs(rx - px) + Math.abs(ry - py) < 10) {
        if (r.fright) {
          G.chain += 1;
          addScore(100 * 2 ** G.chain, rx, ry - 8);
          r.state = 'eyes';
          r.fright = false;
          spark(rx, ry, 16, '#dfe6ff');
          audio?.tone({ freq: 880, to: 220, dur: 0.22, type: 'square', vol: 0.09 });
          audio?.noise({ dur: 0.12, vol: 0.08, from: 2400 });
        } else if (G.pounceT <= 0 && !god) {
          G.phase = 'dying';
          G.stateT = 1.4;
          spark(px, py, 20, '#f6f4ee');
          audio?.tone({ freq: 440, to: 60, dur: 0.8, type: 'sawtooth', vol: 0.12 });
          cb.onState?.('dying');
          return;
        }
      }
    }

    /* ikan bonus muncul dua kali per level */
    const eaten = G.total - G.left;
    if (G.bonusStage < 2 && eaten >= G.total * (G.bonusStage ? 0.7 : 0.3)) {
      G.bonusStage += 1;
      G.bonus = { x: START[0], y: START[1], t: 9, gold: G.bonusStage === 2 };
    }
    if (G.bonus) {
      G.bonus.t -= dt;
      if (G.bonus.t <= 0) G.bonus = null;
    }

    if (G.left <= 0) {
      G.phase = 'clear';
      G.stateT = 1.8;
      addScore(500 * G.level);
      cb.onPopup?.('BERSIH!', 'hot');
      audio?.tone({ freq: 523, dur: 0.1, type: 'square', vol: 0.09 });
      audio?.tone({ freq: 659, dur: 0.1, type: 'square', vol: 0.09, delay: 0.1 });
      audio?.tone({ freq: 784, dur: 0.1, type: 'square', vol: 0.09, delay: 0.2 });
      audio?.tone({ freq: 1047, dur: 0.3, type: 'square', vol: 0.09, delay: 0.3 });
    }
  };

  /* ---- render ---- */
  const render = () => {
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0);
    if (G.phase === 'clear' && Math.floor(G.t * 8) % 2) {
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, VIEW.w, VIEW.h);
      ctx.globalAlpha = 1;
    }

    // remah ikan dan catnip
    const blink = Math.floor(G.t * 5) % 2;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const v = items[y * COLS + x];
        if (v === 1) {
          ctx.fillStyle = '#ffd9a0';
          ctx.fillRect(x * T + 7, y * T + 7, 2, 2);
          ctx.fillStyle = '#c98a4a';
          ctx.fillRect(x * T + 8, y * T + 8, 1, 1);
        } else if (v === 2) {
          ctx.drawImage(SPR.catnip.frames[blink], x * T + 4, y * T + 4);
        }
      }
    }
    if (G.bonus && (G.bonus.t > 2.5 || Math.floor(G.t * 10) % 2)) {
      const s = G.bonus.gold ? SPR.goldfish : SPR.fish;
      ctx.drawImage(s.frames[0], G.bonus.x * T + 8 - (s.w >> 1), G.bonus.y * T + 8 - (s.h >> 1) + (blink ? -1 : 0));
    }

    // robot
    for (const r of robots) {
      const [rx, ry] = pix(r);
      let s = SPR[r.def.sprite];
      if (r.state === 'eyes') s = SPR.robotEyes;
      else if (r.fright) s = G.fright < 2 && Math.floor(G.t * 8) % 2 ? SPR.robotBlink : SPR.robotScared;
      const bob = r.state === 'dock' && Math.floor(G.t * 4 + r.x) % 2 ? 1 : 0;
      ctx.drawImage(s.frames[Math.floor(G.t * 8) % s.frames.length], Math.round(rx) - (s.w >> 1), Math.round(ry) - (s.h >> 1) - bob);
    }

    // jejak terkaman
    const hs = SPR[hero];
    for (const p of parts) {
      if (p.ghost === undefined) continue;
      ctx.globalAlpha = Math.max(0, p.life / 0.2) * 0.5;
      ctx.drawImage((p.ghost ? hs.flipWhite : hs.white)[0], Math.round(p.x) - (hs.w >> 1), Math.round(p.y) - (hs.h >> 1) - 1);
    }
    ctx.globalAlpha = 1;

    // kucing
    if (G.phase !== 'over' && G.phase !== 'menu') {
      const [px, py] = pix(player);
      const dying = G.phase === 'dying';
      if (!dying || Math.floor(G.t * 14) % 2) {
        const f = player.moving && !dying ? Math.floor(G.t * 10) % 2 : 0;
        ctx.drawImage((player.face < 0 ? hs.flip : hs.frames)[f], Math.round(px) - (hs.w >> 1), Math.round(py) - (hs.h >> 1) - 1);
      }
    }

    for (const p of parts) {
      if (p.ghost !== undefined) continue;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    }
    for (const t of texts) {
      ctx.globalAlpha = Math.min(1, t.life * 2);
      drawNumber(ctx, t.text, t.x, t.y, '#ffd15c');
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
    hud.lives = G.lives;
    hud.level = G.level;
    hud.pounce = 1 - G.pounceCd / 5;
    hud.fright = G.fright > 0 ? G.fright / G.frightMax : 0;
    cb.onHud?.(hud);
  };

  paintBackground();
  loadItems();
  placeActors();
  raf = requestAnimationFrame(frame);

  const api = {
    start: () => {
      Object.assign(G, { level: 1, score: 0, lives: 3, paused: false, pounceCd: 0, wave: 0 });
      parts = [];
      texts = [];
      paintBackground();
      loadItems();
      beginReady('SIAP!');
      audio?.startMusic('arena');
      cb.onState?.('ready');
    },
    toMenu: () => {
      Object.assign(G, { phase: 'menu', level: 1, paused: false });
      paintBackground();
      loadItems();
      placeActors();
      audio?.stopMusic();
      cb.onState?.('menu');
    },
    setDir: (dx, dy) => {
      player.wx = dx;
      player.wy = dy;
    },
    pounce: () => {
      if (G.phase !== 'play' || G.pounceCd > 0 || !player.moving) return;
      G.pounceCd = 5;
      G.pounceT = 0.42;
      audio?.noise({ dur: 0.18, vol: 0.1, from: 600, to: 3000, q: 1 });
    },
    setHero: (id) => {
      if (SPR[id]) hero = id;
    },
    setPaused: (p) => {
      G.paused = p;
      last = 0;
    },
    destroy: () => cancelAnimationFrame(raf),
  };
  if (import.meta.env.DEV) {
    api.debug = {
      auto: (v) => (auto = v),
      god: (v) => (god = v),
      state: () => ({ phase: G.phase, score: G.score, level: G.level, lives: G.lives, left: G.left }),
    };
  }
  return api;
}
