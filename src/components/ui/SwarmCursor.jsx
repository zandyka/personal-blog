import { useLayoutEffect, useRef } from 'react';
import { useSplashActive } from '../../lib/splashStore';

/**
 * SwarmCursor — kawanan kursor "kolaborator" (ala kursor multiplayer di alat desain).
 *
 * Alur:
 *  1. Intro   — kursor masuk dari tepi layar lalu mengorbit di tengah layar.
 *  2. Bangun  — seluruh elemen bertanda [data-swarm-build] di halaman dibangun ulang:
 *               "box"  → kursor menarik kotak seleksi; isi elemen muncul tepat di dalam kotak.
 *               "type" → kursor "mengetik" dari kiri ke kanan; teks muncul di belakang caret.
 *               Tugas terbuka saat elemennya masuk layar (kawanan mengejar scroll), anak menunggu
 *               induknya, dan makin banyak yang menunggu makin banyak kursor bekerja bersamaan.
 *               Kursor yang menganggur menonton; garis panduan muncul saat menggambar.
 *  3. Kawanan — saat semua yang terlihat sudah jadi: flocking (pemisahan, keselarasan, kohesi)
 *               di sekitar mouse sambil menjaga jarak. Arahkan ke tombol/kartu → beberapa kursor
 *               menunjuk sudut-sudutnya. Klik → menyebar.
 *
 * Elemen disembunyikan lewat clip-path (bukan opacity) supaya tidak bentrok dengan animasi
 * framer-motion pada elemen yang sama. Semua dipulihkan saat efek dimatikan / halaman ditinggal.
 * Hanya aktif di perangkat ber-mouse dan bila "kurangi gerakan" tidak dipilih.
 */

const TARGETS = '.cursor-target, button, a, [data-cursor-label]';
const NAMES = ['React', 'Figma', 'Flutter', 'Laravel', 'Python', 'Supabase', 'Next.js', 'Tailwind', 'TFLite', 'MySQL', 'Vite', 'Git', 'Node.js', 'Dart'];
const COLORS = ['#38BDF8', '#A259FF', '#22C55E', '#F43F5E', '#FACC15', '#10B981', '#E5E7EB', '#06B6D4', '#FB923C', '#3B82F6', '#C084FC', '#F97316', '#84CC16', '#2DD4BF'];

const INTRO_MS = 1000;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Panah kursor klasik (ujung di 0,0).
const ARROW = [[0, 0], [0, 17], [4.4, 13], [7.3, 19.6], [10.2, 18.3], [7.3, 11.9], [12.6, 11.9]];

function drawCursor(ctx, a, light) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.shadowColor = light ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.beginPath();
  ARROW.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = a.color;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = '#fff';
  ctx.stroke();

  // label nama
  ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif';
  const w = ctx.measureText(a.name).width + 12;
  const lx = 11;
  const ly = 19;
  ctx.beginPath();
  ctx.roundRect(lx, ly, w, 18, 5);
  ctx.fillStyle = a.color;
  ctx.fill();
  ctx.fillStyle = a.color === '#E5E7EB' || a.color === '#FACC15' ? '#111' : '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(a.name, lx + 6, ly + 9.5);
  ctx.restore();
}

function drawHandles(ctx, r, color, alpha) {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(r.left, r.top, r.width, r.height);
  ctx.fillStyle = '#fff';
  for (const [x, y] of [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]]) {
    ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
    ctx.strokeRect(x - 3.5, y - 3.5, 7, 7);
  }
  ctx.globalAlpha = 1;
}

function sizePill(ctx, x, y, text, color) {
  ctx.font = '600 10.5px "Space Grotesk", system-ui, sans-serif';
  const w = ctx.measureText(text).width + 10;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y, w, 17, 4);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = color === '#E5E7EB' || color === '#FACC15' ? '#111' : '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x - w / 2 + 5, y + 9);
}

const isLight = () =>
  document.documentElement.classList.contains('light') ||
  document.documentElement.getAttribute('data-theme') === 'light';

export default function SwarmCursor({ enabled = true, replayKey = 0, root = null }) {
  const canvasRef = useRef(null);
  // Saat splash pembuka tampil, jam intro ditahan supaya pertunjukan tidak terlewat.
  const splash = useSplashActive();
  const splashRef = useRef(splash);
  splashRef.current = splash;

  // Layout effect: elemen disembunyikan sebelum browser menggambar frame pertama (tanpa kedip).
  useLayoutEffect(() => {
    if (!enabled) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!fine || reduce || !canvas) return undefined;

    const scope = (typeof root === 'string' ? document.querySelector(root) : root) || document;
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    let light = isLight();
    const themeObserver = new MutationObserver(() => (light = isLight()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    // ---------- elemen yang dibangun ----------
    const builds = [...scope.querySelectorAll('[data-swarm-build]')];
    const hide = (el) => {
      el.style.clipPath = el.dataset.swarmBuild === 'type' ? 'inset(-30% 100% -30% 0)' : 'inset(0 100% 100% 0)';
    };
    builds.forEach(hide);
    const tasks = builds.map((el) => ({ el, kind: el.dataset.swarmBuild, phase: 'wait', agent: null, t0: 0, dur: 0, p: 0, parent: null }));
    // anak menunggu induknya selesai digambar (mis. isi kartu menunggu kartunya)
    const byEl = new Map(tasks.map((task) => [task.el, task]));
    for (const task of tasks) {
      const up = task.el.parentElement?.closest('[data-swarm-build]');
      task.parent = up ? byEl.get(up) || null : null;
    }

    // ---------- agen ----------
    const agents = NAMES.map((name, i) => {
      const side = i % 4;
      return {
        name,
        color: COLORS[i % COLORS.length],
        x: side === 0 ? -30 : side === 1 ? W + 30 : rand(0, W),
        y: side === 2 ? -30 : side === 3 ? H + 30 : rand(0, H),
        vx: 0,
        vy: 0,
        busy: false,
        drawing: false,
        orbitR: rand(60, 150),
        orbitA: (i / NAMES.length) * Math.PI * 2,
      };
    });

    const pointer = { x: W / 2, y: H / 2, inside: false };
    let hoverTarget = null;
    let phase = 'intro';
    let start = performance.now();
    let burstUntil = 0;
    const afterglows = []; // kotak seleksi yang memudar setelah selesai
    const guides = []; // garis panduan

    const viewCenter = () => ({ x: W / 2, y: H * 0.42 });

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      hoverTarget = e.target?.closest?.(TARGETS) || null;
    };
    const onLeave = () => {
      pointer.inside = false;
      hoverTarget = null;
    };
    const onDown = (e) => {
      if (phase === 'intro') return;
      burstUntil = performance.now() + 650;
      for (const a of agents) {
        if (a.busy) continue; // yang sedang membangun tidak ikut terlempar
        const dx = a.x - e.clientX;
        const dy = a.y - e.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const k = rand(14, 24);
        a.vx += (dx / d) * k;
        a.vy += (dy / d) * k;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    // gerak menuju titik dengan perlambatan saat dekat
    const seek = (a, tx, ty, max = 9, force = 0.9) => {
      const dx = tx - a.x;
      const dy = ty - a.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.5) return d;
      const speed = d < 90 ? (max * d) / 90 : max;
      a.vx += clamp((dx / d) * speed - a.vx, -force, force);
      a.vy += clamp((dy / d) * speed - a.vy, -force, force);
      return d;
    };

    const freeAgentNear = (x, y) => {
      let best = null;
      let bd = Infinity;
      for (const a of agents) {
        if (a.busy) continue;
        const d = Math.hypot(a.x - x, a.y - y);
        if (d < bd) {
          bd = d;
          best = a;
        }
      }
      return best;
    };

    const startPoint = (t, r) => (t.kind === 'type' ? [r.left - 4, r.top + r.height * 0.55] : [r.left, r.top]);
    const endPoint = (t, r) => (t.kind === 'type' ? [r.right + 4, r.top + r.height * 0.55] : [r.right, r.bottom]);
    const onScreen = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H * 0.92;

    // kawanan (flocking) untuk kursor yang sedang menganggur
    const flock = (list, goal) => {
      let corners = [];
      let pointers = [];
      if (hoverTarget && pointer.inside && hoverTarget.isConnected) {
        const r = hoverTarget.getBoundingClientRect();
        if (r.width < W * 0.7 && r.height < H * 0.7) {
          corners = [[r.left - 2, r.top - 2], [r.right + 2, r.top - 2], [r.right + 2, r.bottom + 2], [r.left - 2, r.bottom + 2]];
          pointers = [...list]
            .sort((p, q) => Math.hypot(p.x - goal.x, p.y - goal.y) - Math.hypot(q.x - goal.x, q.y - goal.y))
            .slice(0, 4);
        }
      }
      for (const a of list) {
        const ci = pointers.indexOf(a);
        if (ci >= 0) {
          seek(a, corners[ci][0], corners[ci][1], 12, 1.3);
          continue;
        }
        let sepX = 0;
        let sepY = 0;
        let aliX = 0;
        let aliY = 0;
        let cohX = 0;
        let cohY = 0;
        let n = 0;
        for (const o of list) {
          if (o === a) continue;
          const dx = a.x - o.x;
          const dy = a.y - o.y;
          const d = Math.hypot(dx, dy);
          if (d < 90) {
            n++;
            aliX += o.vx;
            aliY += o.vy;
            cohX += o.x;
            cohY += o.y;
            if (d < 38 && d > 0) {
              sepX += (dx / d) * (38 - d);
              sepY += (dy / d) * (38 - d);
            }
          }
        }
        if (n) {
          a.vx += (aliX / n - a.vx) * 0.04 + (cohX / n - a.x) * 0.0015;
          a.vy += (aliY / n - a.vy) * 0.04 + (cohY / n - a.y) * 0.0015;
        }
        a.vx += sepX * 0.05;
        a.vy += sepY * 0.05;

        // tetap dekat mouse, tapi tidak menempel (menghindar bila terlalu dekat)
        const dx = goal.x - a.x;
        const dy = goal.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const ring = a.orbitR * 0.75 + 30;
        if (d > ring) {
          a.vx += (dx / d) * 0.35;
          a.vy += (dy / d) * 0.35;
        } else if (d < ring * 0.6) {
          a.vx -= (dx / d) * 0.6;
          a.vy -= (dy / d) * 0.6;
        }
        // sedikit berputar mengelilingi mouse supaya tetap hidup saat mouse diam
        a.vx += (-dy / d) * 0.06;
        a.vy += (dx / d) * 0.06;
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now) => {
      const dt = clamp((now - last) / 16.67, 0.2, 3);
      last = now;
      if (splashRef.current) {
        start = now;
        ctx.clearRect(0, 0, W, H);
        raf = requestAnimationFrame(frame);
        return;
      }
      const t = (now - start) / 1000;
      if (phase === 'intro' && now - start > INTRO_MS) phase = 'live';

      // ---------- membangun ----------
      let watch = null;
      if (phase === 'live') {
        const rects = new Map();
        const rectOf = (task) => {
          let r = rects.get(task);
          if (!r) {
            r = task.el.getBoundingClientRect();
            rects.set(task, r);
          }
          return r;
        };
        // tugas siap = induk sudah jadi + elemennya sedang terlihat di layar (ikut arah scroll)
        const ready = tasks.filter(
          (task) => task.phase === 'wait' && (!task.parent || task.parent.phase === 'done') && onScreen(rectOf(task))
        );
        const active = tasks.filter((task) => task.phase === 'travel' || task.phase === 'draw').length;
        // makin banyak yang menunggu (mis. scroll cepat), makin banyak kursor turun tangan
        let slots = clamp(2 + Math.floor(ready.length / 2), 2, agents.length - 3) - active;
        for (const task of ready) {
          if (slots <= 0) break;
          const [sx, sy] = startPoint(task, rectOf(task));
          const a = freeAgentNear(sx, sy);
          if (!a) break;
          a.busy = true;
          task.agent = a;
          task.phase = 'travel';
          slots--;
        }

        for (const task of tasks) {
          if (task.phase !== 'travel' && task.phase !== 'draw') continue;
          const r = rectOf(task);
          const [sx, sy] = startPoint(task, r);
          const [ex, ey] = endPoint(task, r);
          const a = task.agent;
          if (task.phase === 'travel') {
            const d = seek(a, sx, sy, 17, 1.8);
            if (d < 6) {
              task.phase = 'draw';
              task.t0 = now;
              a.drawing = true;
              const chars = (task.el.textContent || '').length;
              task.dur =
                task.kind === 'type' ? clamp(chars * 38, 420, 900) : clamp(260 + (r.width * r.height) / 2600, 340, 800);
              guides.push({ born: now, color: a.color, el: task.el });
            }
          } else {
            task.p = clamp((now - task.t0) / task.dur, 0, 1);
            const e = task.kind === 'type' ? task.p : easeInOut(task.p);
            a.x = sx + (ex - sx) * e;
            a.y = sy + (ey - sy) * e;
            a.vx = 0;
            a.vy = 0;
            const right = (1 - e) * 100;
            task.el.style.clipPath =
              task.kind === 'type' ? `inset(-30% ${right}% -30% 0)` : `inset(0 ${right}% ${(1 - e) * 100}% 0)`;
            if (task.p >= 1) {
              task.phase = 'done';
              task.el.style.clipPath = '';
              a.busy = false;
              a.drawing = false;
              if (task.kind === 'box') afterglows.push({ el: task.el, color: a.color, born: now });
            }
          }
          watch = { x: a.x, y: a.y };
        }
      }

      // ---------- kursor yang menganggur ----------
      const idle = agents.filter((a) => !a.busy);
      if (phase === 'intro') {
        const c = viewCenter();
        idle.forEach((a, i) => {
          const ang = a.orbitA + t * 1.9;
          seek(a, c.x + Math.cos(ang) * (90 + (i % 3) * 30), c.y + Math.sin(ang) * (45 + (i % 3) * 14), 14, 1.3);
        });
      } else if (watch) {
        // menonton pekerjaan yang sedang berlangsung
        idle.forEach((a, i) => {
          const ang = a.orbitA + t * 1.1 * (i % 2 ? 1 : -1);
          seek(a, watch.x + Math.cos(ang) * (a.orbitR * 0.9), watch.y + Math.sin(ang) * (a.orbitR * 0.55) + 40, 9, 0.6);
        });
      } else {
        // semua yang terlihat sudah jadi → berkawan di sekitar mouse
        flock(idle, pointer.inside ? pointer : viewCenter());
      }

      // ---------- integrasi ----------
      const bursting = now < burstUntil;
      const calm = phase === 'live' && !watch;
      for (const a of agents) {
        if (a.drawing) continue; // posisinya diatur langsung oleh tugas
        const sp = Math.hypot(a.vx, a.vy);
        const max = bursting && !a.busy ? 24 : a.busy ? 17 : calm ? 7.5 : 13;
        if (sp > max) {
          a.vx = (a.vx / sp) * max;
          a.vy = (a.vy / sp) * max;
        }
        const drag = bursting ? 0.96 : calm ? 0.94 : 0.9;
        a.vx *= Math.pow(drag, dt);
        a.vy *= Math.pow(drag, dt);
        a.x += a.vx * dt;
        a.y += a.vy * dt;
      }

      // ---------- gambar ----------
      ctx.clearRect(0, 0, W, H);

      // garis panduan
      for (let i = guides.length - 1; i >= 0; i--) {
        const g = guides[i];
        const age = (now - g.born) / 1100;
        if (age > 1) {
          guides.splice(i, 1);
          continue;
        }
        const r = g.el.getBoundingClientRect();
        ctx.globalAlpha = Math.sin(age * Math.PI) * 0.55;
        ctx.strokeStyle = g.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, r.top);
        ctx.lineTo(W, r.top);
        ctx.moveTo(r.left, 0);
        ctx.lineTo(r.left, H);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // pekerjaan yang sedang digambar
      for (const task of tasks) {
        if (task.phase !== 'draw') continue;
        const r = task.el.getBoundingClientRect();
        const a = task.agent;
        if (task.kind === 'box') {
          const x = r.left;
          const y = r.top;
          const w = a.x - x;
          const h = a.y - y;
          ctx.fillStyle = a.color;
          ctx.globalAlpha = 0.07;
          ctx.fillRect(x, y, w, h);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = a.color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, w, h);
          sizePill(ctx, x + w / 2, y + h + 8, `${Math.round(w)} × ${Math.round(h)}`, a.color);
        } else {
          const blink = Math.floor(now / 380) % 2 === 0;
          if (blink) {
            ctx.fillStyle = a.color;
            ctx.fillRect(a.x - 3, r.top + r.height * 0.12, 2.5, r.height * 0.76);
          }
        }
      }

      // kotak seleksi yang memudar
      for (let i = afterglows.length - 1; i >= 0; i--) {
        const g = afterglows[i];
        const age = (now - g.born) / 800;
        if (age > 1) {
          afterglows.splice(i, 1);
          continue;
        }
        drawHandles(ctx, g.el.getBoundingClientRect(), g.color, 1 - age);
      }

      // kursor
      const intro = clamp((now - start) / 500, 0, 1);
      ctx.globalAlpha = intro;
      for (const a of agents) drawCursor(ctx, a, light);
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
      builds.forEach((el) => {
        el.style.clipPath = '';
      });
      ctx.clearRect(0, 0, W, H);
    };
  }, [enabled, replayKey, root]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  );
}
