import { useEffect, useRef } from 'react';
import SectionHead from './SectionHead';
import { TECH } from './homeData';

/*
 * "Neuro link": tiap teknologi adalah neuron di jaringan 3D yang berputar.
 * Neuron terhubung ke tetangga terdekatnya, sinyal cahaya merambat dari
 * neuron ke neuron, dan neuron dekat kursor menyala beserta koneksinya.
 * Digambar di <canvas> 2D supaya ringan (tanpa three.js).
 */

const K_NEAREST = 3;
const PULSES = 16;

const readColors = () => {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    text: get('--text', '#F6F0F1'),
    muted: get('--text-muted', '#B7A9AD'),
    line: get('--border-light', '#3B2D32'),
    accent: get('--accent', '#D65A6E'),
    bg: get('--bg', '#0B0809'),
  };
};

export default function TechSphere() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Titik merata di permukaan bola (spiral Fibonacci), sedikit diacak ke dalam
    // supaya terasa seperti jaringan, bukan bola sempurna.
    const n = TECH.length;
    const nodes = TECH.map((name, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      const depth = 0.78 + ((i * 37) % 23) / 100;
      return { name, p: [Math.cos(a) * r * depth, y * depth, Math.sin(a) * r * depth], sx: 0, sy: 0, z: 0, s: 1 };
    });

    // Sambungan: tiap neuron ke K tetangga terdekat (tanpa duplikat).
    const edgeSet = new Set();
    const edges = [];
    const neighbours = nodes.map(() => []);
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => ({ j, d: (a.p[0] - b.p[0]) ** 2 + (a.p[1] - b.p[1]) ** 2 + (a.p[2] - b.p[2]) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, K_NEAREST)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (edgeSet.has(key)) return;
          edgeSet.add(key);
          edges.push([i, j]);
          neighbours[i].push(j);
          neighbours[j].push(i);
        });
    });

    const newPulse = (from = Math.floor(Math.random() * n)) => {
      const list = neighbours[from];
      return { from, to: list[Math.floor(Math.random() * list.length)], t: Math.random() * 0.4, speed: 0.6 + Math.random() * 0.7 };
    };
    let pulses = Array.from({ length: PULSES }, () => newPulse());

    const s = {
      vx: 0.0016,
      vy: 0.0032,
      w: 1,
      h: 1,
      dpr: 1,
      radius: 200,
      raf: 0,
      last: 0,
      visible: false,
      drag: false,
      lx: 0,
      ly: 0,
      mouse: null,
      hover: -1,
      colors: readColors(),
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = Math.round(s.w * s.dpr);
      canvas.height = Math.round(s.h * s.dpr);
      s.radius = Math.min(s.w, s.h) * 0.38;
    };

    const rotate = (ax, ay) => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      for (const node of nodes) {
        const [x, y, z] = node.p;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        node.p[0] = x1;
        node.p[1] = y * cx - z1 * sx;
        node.p[2] = y * sx + z1 * cx;
      }
    };

    const project = () => {
      const f = 2.6;
      for (const node of nodes) {
        const [x, y, z] = node.p;
        const k = f / (f - z);
        node.sx = s.w / 2 + x * s.radius * k;
        node.sy = s.h / 2 + y * s.radius * k;
        node.z = (z + 1) / 2; // 0 belakang .. 1 depan
        node.s = k;
      }
      if (s.mouse) {
        let best = -1;
        let bestD = 34 * 34;
        nodes.forEach((node, i) => {
          const d = (node.sx - s.mouse.x) ** 2 + (node.sy - s.mouse.y) ** 2;
          if (d < bestD && node.z > 0.35) {
            bestD = d;
            best = i;
          }
        });
        if (best !== s.hover && best >= 0) {
          // neuron yang disentuh memancarkan sinyal baru
          pulses = pulses.slice(3).concat([newPulse(best), newPulse(best), newPulse(best)]);
        }
        s.hover = best;
      } else {
        s.hover = -1;
      }
    };

    const draw = () => {
      const c = s.colors;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);
      const lit = s.hover >= 0 ? new Set([s.hover, ...neighbours[s.hover]]) : null;

      // koneksi
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const depth = (a.z + b.z) / 2;
        const hot = lit && (i === s.hover || j === s.hover);
        ctx.globalAlpha = hot ? 0.95 : 0.06 + depth * 0.38;
        ctx.strokeStyle = hot ? c.accent : c.muted;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // sinyal
      ctx.fillStyle = c.accent;
      for (const p of pulses) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        const x = a.sx + (b.sx - a.sx) * p.t;
        const y = a.sy + (b.sy - a.sy) * p.t;
        const depth = a.z + (b.z - a.z) * p.t;
        ctx.globalAlpha = 0.25 + depth * 0.75;
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + depth * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // neuron + label, dari belakang ke depan
      const order = nodes.map((_, i) => i).sort((x, y) => nodes[x].z - nodes[y].z);
      const base = Math.max(11, Math.min(15, s.w / 38));
      for (const i of order) {
        const node = nodes[i];
        const hot = i === s.hover;
        const near = lit && lit.has(i);
        const r = (hot ? 6 : 2.4 + node.z * 2.6) * Math.min(1.3, node.s);
        ctx.globalAlpha = hot || near ? 1 : 0.25 + node.z * 0.75;
        ctx.fillStyle = hot || near ? c.accent : c.text;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, r, 0, Math.PI * 2);
        ctx.fill();
        if (hot) {
          ctx.strokeStyle = c.accent;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (node.z > 0.42 || hot || near) {
          const size = base * (0.78 + node.z * 0.4) * (hot ? 1.25 : 1);
          ctx.font = `${hot ? 800 : 600} ${size.toFixed(1)}px 'Plus Jakarta Sans', sans-serif`;
          ctx.globalAlpha = hot || near ? 1 : Math.min(1, (node.z - 0.42) * 2.2);
          ctx.fillStyle = hot ? c.accent : c.text;
          ctx.fillText(node.name, node.sx + r + 6, node.sy + size * 0.35);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      s.raf = 0;
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 60;
      s.last = now;
      if (!s.drag && !reduce) rotate(s.vx, s.vy);
      if (!reduce) {
        for (const p of pulses) {
          p.t += dt * p.speed;
          if (p.t >= 1) {
            // sinyal diteruskan ke neuron berikutnya
            const next = newPulse(p.to);
            p.from = next.from;
            p.to = next.to;
            p.t = 0;
            p.speed = next.speed;
          }
        }
      }
      project();
      draw();
      if (s.visible && !reduce) s.raf = requestAnimationFrame(tick);
      else s.last = 0;
    };
    const start = () => {
      if (!s.raf && s.visible) s.raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const rect = box.getBoundingClientRect();
      if (s.drag) {
        rotate((e.clientY - s.ly) * -0.006, (e.clientX - s.lx) * 0.006);
        s.vy = (e.clientX - s.lx) * 0.0012;
        s.vx = (e.clientY - s.ly) * -0.0012;
        s.lx = e.clientX;
        s.ly = e.clientY;
        if (reduce) start();
        return;
      }
      if (e.pointerType !== 'mouse') return;
      s.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const nx = s.mouse.x / rect.width - 0.5;
      const ny = s.mouse.y / rect.height - 0.5;
      // makin jauh dari tengah, makin cepat berputar ke arah kursor
      s.vy = nx * 0.016;
      s.vx = -ny * 0.016;
      if (reduce) start();
    };
    const onLeave = () => {
      s.mouse = null;
      s.vx = 0.0016;
      s.vy = 0.0032;
    };
    const onDown = (e) => {
      s.drag = true;
      s.lx = e.clientX;
      s.ly = e.clientY;
    };
    const onUp = () => {
      s.drag = false;
    };

    resize();
    project();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      project();
      draw();
    });
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      start();
    });
    io.observe(box);
    const mo = new MutationObserver(() => {
      s.colors = readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    box.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
      box.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <section className="h-sec" id="stack">
      <div className="h-wrap">
        <SectionHead index="02" label="Perkakas">
          Yang saya <em>pakai</em>.
        </SectionHead>
        <div className="h-tech">
          <div className="h-tech__copy">
            <p>
              Dari antarmuka sampai model AI di perangkat: saya memilih alat sesuai masalahnya, bukan sebaliknya.
            </p>
            <ul className="h-tech__groups">
              <li><span className="h-mono">Frontend</span>React, Tailwind, Vite</li>
              <li><span className="h-mono">Backend</span>Laravel, Node.js, MySQL</li>
              <li><span className="h-mono">Mobile & AI</span>Flutter, TensorFlow Lite, MediaPipe</li>
              <li><span className="h-mono">Desain</span>Figma, Photoshop</li>
            </ul>
          </div>
          <div ref={boxRef} className="h-tech__sphere">
            <canvas ref={canvasRef} role="img" aria-label={`Jaringan teknologi: ${TECH.join(', ')}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
