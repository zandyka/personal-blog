import { useEffect, useRef } from 'react';

/**
 * SwarmCursor — kawanan partikel yang mengikuti kursor (gaya "boids").
 *
 * - Bebas: tiap partikel mengorbit kursor dengan jari-jari & kecepatan sendiri,
 *   saling menjaga jarak, dan meninggalkan jejak pendek.
 * - Saat kursor berada di atas elemen yang bisa dibidik (selector sama dengan TargetCursor),
 *   kawanan berbaris mengelilingi tepi elemen itu.
 * - Klik: kawanan meledak menyebar lalu berkumpul lagi.
 * - Kursor diam: kawanan melambat jadi cincin tenang. Kursor keluar jendela: kawanan berkelana.
 *
 * Hanya aktif di perangkat ber-mouse dan bila "kurangi gerakan" tidak dipilih.
 */

const TARGETS = '.cursor-target, button, a, [data-cursor-label]';
const TAU = Math.PI * 2;

const rand = (a, b) => a + Math.random() * (b - a);

// Titik pada keliling persegi panjang bersudut bulat, t ∈ [0, 1).
function pointOnRoundedRect(x, y, w, h, r, t) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const straightW = w - 2 * r;
  const straightH = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const total = 2 * straightW + 2 * straightH + 4 * arc;
  let d = (((t % 1) + 1) % 1) * total;

  const seg = (len) => {
    if (d <= len) return true;
    d -= len;
    return false;
  };
  const corner = (cx, cy, start) => {
    const a = start + (d / arc) * (Math.PI / 2);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };

  if (seg(straightW)) return [x + r + d, y];
  if (seg(arc)) return corner(x + w - r, y + r, -Math.PI / 2);
  if (seg(straightH)) return [x + w, y + r + d];
  if (seg(arc)) return corner(x + w - r, y + h - r, 0);
  if (seg(straightW)) return [x + w - r - d, y + h];
  if (seg(arc)) return corner(x + r, y + h - r, Math.PI / 2);
  if (seg(straightH)) return [x, y + h - r - d];
  return corner(x + r, y + r, Math.PI);
}

const readAccent = () => {
  const css = getComputedStyle(document.documentElement);
  return (css.getPropertyValue('--accent') || '#d65a6e').trim();
};
const isLight = () =>
  document.documentElement.classList.contains('light') ||
  document.documentElement.getAttribute('data-theme') === 'light';

export default function SwarmCursor({ count = 64, enabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!fine || reduce || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let accent = readAccent();
    let light = isLight();
    const themeObserver = new MutationObserver(() => {
      accent = readAccent();
      light = isLight();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });

    const pointer = { x: W / 2, y: H / 2, px: W / 2, py: H / 2, inside: false, lastMove: 0, vx: 0, vy: 0 };
    const boids = Array.from({ length: count }, (_, i) => ({
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-1, 1),
      vy: rand(-1, 1),
      orbit: rand(16, 64), // jari-jari orbit pribadi
      spin: rand(0.6, 1.6) * (i % 2 ? 1 : -1),
      phase: rand(0, TAU),
      lane: i / count, // posisi di keliling target
      size: rand(1.2, 2.6),
      maxSpeed: rand(6, 10),
      hist: [],
    }));

    let target = null;
    let targetRadius = 0;
    let burst = 0;
    let raf = 0;
    let last = performance.now();

    const findTarget = (el) => {
      const t = el?.closest?.(TARGETS) || null;
      if (t !== target) {
        target = t;
        targetRadius = t ? parseFloat(getComputedStyle(t).borderTopLeftRadius) || 0 : 0;
      }
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.lastMove = performance.now();
      findTarget(e.target);
    };
    const onDown = (e) => {
      burst = 1;
      for (const b of boids) {
        const dx = b.x - e.clientX;
        const dy = b.y - e.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const kick = rand(9, 18);
        b.vx += (dx / d) * kick;
        b.vy += (dy / d) * kick;
      }
    };
    const onLeave = () => {
      pointer.inside = false;
      target = null;
    };
    const onScroll = () => {
      // elemen di bawah kursor berubah saat menggulir
      if (pointer.inside) findTarget(document.elementFromPoint(pointer.x, pointer.y));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const frame = (now) => {
      const dt = Math.min((now - last) / 16.67, 3); // 1 = satu frame 60fps
      last = now;
      const t = now / 1000;

      // kecepatan kursor (dihaluskan) — dipakai untuk "ekor" kawanan
      pointer.vx += (pointer.x - pointer.px - pointer.vx) * 0.2;
      pointer.vy += (pointer.y - pointer.py - pointer.vy) * 0.2;
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      const idle = now - pointer.lastMove > 1600;
      burst = Math.max(0, burst - 0.02 * dt);

      let rect = null;
      if (target && pointer.inside) {
        if (!target.isConnected) target = null;
        else rect = target.getBoundingClientRect();
        // target sangat besar (mis. panel demo) → tetap ikuti kursor saja
        if (rect && (rect.width > W * 0.7 || rect.height > H * 0.7)) rect = null;
      }

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let tx;
        let ty;
        let pull;

        if (!pointer.inside) {
          // berkelana pelan mengikuti pola gelombang
          tx = W / 2 + Math.cos(t * 0.3 * b.spin + b.phase) * W * 0.35;
          ty = H / 2 + Math.sin(t * 0.4 * b.spin + b.phase) * H * 0.3;
          pull = 0.004;
        } else if (rect) {
          // berbaris mengelilingi tepi target, mengalir searah jarum jam
          const pad = 7;
          [tx, ty] = pointOnRoundedRect(
            rect.left - pad,
            rect.top - pad,
            rect.width + pad * 2,
            rect.height + pad * 2,
            targetRadius + pad,
            b.lane + t * 0.08
          );
          pull = 0.09;
        } else {
          const r = idle ? 26 + (i % 3) * 10 : b.orbit;
          const a = b.phase + t * (idle ? 0.8 : 2.1) * b.spin;
          // sisi belakang kawanan sedikit tertinggal searah gerak kursor
          tx = pointer.x + Math.cos(a) * r - pointer.vx * 2.2;
          ty = pointer.y + Math.sin(a) * r - pointer.vy * 2.2;
          pull = idle ? 0.03 : 0.055;
        }

        // tarik ke titik tujuan
        b.vx += (tx - b.x) * pull * dt;
        b.vy += (ty - b.y) * pull * dt;

        // pisahkan dari tetangga yang terlalu dekat
        for (let j = i + 1; j < boids.length; j++) {
          const o = boids[j];
          const dx = b.x - o.x;
          const dy = b.y - o.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < 140) {
            const f = (140 - d2) / 140 * 0.35;
            b.vx += dx * f * 0.1;
            b.vy += dy * f * 0.1;
            o.vx -= dx * f * 0.1;
            o.vy -= dy * f * 0.1;
          }
        }

        // gesekan + batas kecepatan
        const drag = rect ? 0.8 : 0.88;
        b.vx *= Math.pow(drag, dt);
        b.vy *= Math.pow(drag, dt);
        const sp = Math.hypot(b.vx, b.vy);
        const max = b.maxSpeed * (1 + burst * 2);
        if (sp > max) {
          b.vx = (b.vx / sp) * max;
          b.vy = (b.vy / sp) * max;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        b.hist.push(b.x, b.y);
        if (b.hist.length > 10) b.hist.splice(0, 2);
      }

      // gambar
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
      ctx.lineCap = 'round';
      for (const b of boids) {
        const sp = Math.hypot(b.vx, b.vy);
        const alpha = Math.min(1, 0.35 + sp / 10);

        // jejak
        if (b.hist.length >= 4) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = alpha * (light ? 0.35 : 0.28);
          ctx.lineWidth = b.size * 0.9;
          ctx.beginPath();
          ctx.moveTo(b.hist[0], b.hist[1]);
          for (let k = 2; k < b.hist.length; k += 2) ctx.lineTo(b.hist[k], b.hist[k + 1]);
          ctx.stroke();
        }

        // kepala partikel
        ctx.globalAlpha = alpha * (light ? 0.85 : 0.95);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size + (rect ? 0.4 : 0), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, W, H);
    };
  }, [count, enabled]);

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
