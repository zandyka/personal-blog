import { useEffect, useRef, useState } from 'react';
import {
  Android,
  Bootstrap5,
  Canva,
  CPlusPlus,
  CSS3,
  Dart,
  Figma,
  Firebase,
  Flutter,
  Git,
  GitHubDark,
  GitHubLight,
  HTML5,
  Java,
  JavaScript,
  Laravel,
  MariaDB,
  MySQL,
  NodeJs,
  Photoshop,
  PHP,
  Postman,
  Python,
  React,
  TailwindCSS,
  Tensorflow,
  TypeScript,
  VercelDark,
  VercelLight,
  ViteJS,
} from 'developer-icons';
import { useTheme } from '../../hooks/useTheme';
import SectionHead from './SectionHead';

/*
 * "Neuro link": tiap teknologi adalah neuron (logo dari developer-icons) di
 * jaringan 3D yang berputar. Garis koneksi & sinyal digambar di <canvas>,
 * logo dirender sebagai elemen DOM supaya SVG-nya tetap tajam.
 * Neuron dekat kursor menyala beserta koneksinya dan memancarkan sinyal baru.
 */

// [nama, ikon tema gelap, ikon tema terang]
const LOGOS = [
  ['React', React],
  ['JavaScript', JavaScript],
  ['TypeScript', TypeScript],
  ['Flutter', Flutter],
  ['Dart', Dart],
  ['Laravel', Laravel],
  ['PHP', PHP],
  ['Python', Python],
  ['TensorFlow', Tensorflow],
  ['MySQL', MySQL],
  ['MariaDB', MariaDB],
  ['Firebase', Firebase],
  ['Node.js', NodeJs],
  ['Tailwind CSS', TailwindCSS],
  ['Vite', ViteJS],
  ['HTML5', HTML5],
  ['CSS3', CSS3],
  ['Bootstrap', Bootstrap5],
  ['Java', Java],
  ['C++', CPlusPlus],
  ['Android', Android],
  ['Git', Git],
  ['GitHub', GitHubLight, GitHubDark],
  ['Vercel', VercelLight, VercelDark],
  ['Postman', Postman],
  ['Figma', Figma],
  ['Photoshop', Photoshop],
  ['Canva', Canva],
];

const K_NEAREST = 3;
const PULSES = 18;

const readColors = () => {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return { muted: get('--text-muted', '#B7A9AD'), accent: get('--accent', '#D65A6E') };
};

export default function TechSphere() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const chipRefs = useRef([]);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Titik di permukaan bola (spiral Fibonacci), kedalamannya sedikit diacak
    // supaya terasa seperti jaringan, bukan bola sempurna.
    const n = LOGOS.length;
    const nodes = LOGOS.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      const depth = 0.8 + ((i * 37) % 21) / 100;
      return { p: [Math.cos(a) * r * depth, y * depth, Math.sin(a) * r * depth], sx: 0, sy: 0, z: 0, k: 1 };
    });

    // Sambungan: tiap neuron ke K tetangga terdekat (tanpa duplikat).
    const seen = new Set();
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
          if (seen.has(key)) return;
          seen.add(key);
          edges.push([i, j]);
          neighbours[i].push(j);
          neighbours[j].push(i);
        });
    });

    const newPulse = (from = Math.floor(Math.random() * n)) => {
      const list = neighbours[from];
      return { from, to: list[Math.floor(Math.random() * list.length)], t: Math.random() * 0.4, speed: 0.55 + Math.random() * 0.7 };
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
        node.k = f / (f - z);
        node.sx = s.w / 2 + x * s.radius * node.k;
        node.sy = s.h / 2 + y * s.radius * node.k;
        node.z = (z + 1) / 2; // 0 belakang .. 1 depan
      }
      let next = -1;
      if (s.mouse) {
        let bestD = 30 * 30;
        nodes.forEach((node, i) => {
          const d = (node.sx - s.mouse.x) ** 2 + (node.sy - s.mouse.y) ** 2;
          if (d < bestD && node.z > 0.35) {
            bestD = d;
            next = i;
          }
        });
      }
      if (next !== s.hover) {
        // neuron yang disentuh memancarkan sinyal baru
        if (next >= 0) pulses = pulses.slice(3).concat([newPulse(next), newPulse(next), newPulse(next)]);
        s.hover = next;
        setHover(next);
      }
    };

    const draw = () => {
      const c = s.colors;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);

      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const hot = s.hover >= 0 && (i === s.hover || j === s.hover);
        ctx.globalAlpha = hot ? 0.95 : 0.05 + ((a.z + b.z) / 2) * 0.36;
        ctx.strokeStyle = hot ? c.accent : c.muted;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      ctx.fillStyle = c.accent;
      for (const p of pulses) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        const depth = a.z + (b.z - a.z) * p.t;
        ctx.globalAlpha = 0.25 + depth * 0.75;
        ctx.beginPath();
        ctx.arc(a.sx + (b.sx - a.sx) * p.t, a.sy + (b.sy - a.sy) * p.t, 1.4 + depth * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // posisikan logo
      const lit = s.hover >= 0 ? new Set([s.hover, ...neighbours[s.hover]]) : null;
      nodes.forEach((node, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const hot = i === s.hover;
        const scale = (0.5 + node.z * 0.62) * (hot ? 1.3 : 1);
        el.style.transform = `translate3d(${node.sx.toFixed(1)}px, ${node.sy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = (hot || (lit && lit.has(i)) ? 1 : 0.22 + node.z * 0.78).toFixed(3);
        el.style.zIndex = String(hot ? 200 : Math.round(node.z * 100));
      });
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
            Object.assign(p, newPulse(p.to), { t: 0 });
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
      s.vy = (s.mouse.x / rect.width - 0.5) * 0.016;
      s.vx = -(s.mouse.y / rect.height - 0.5) * 0.016;
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
              <li><span className="h-mono">Desain</span>Figma, Photoshop, Canva</li>
            </ul>
          </div>
          <div
            ref={boxRef}
            className="h-tech__sphere"
            role="img"
            aria-label={`Jaringan teknologi: ${LOGOS.map(([name]) => name).join(', ')}`}
          >
            <canvas ref={canvasRef} aria-hidden="true" />
            {LOGOS.map(([name, DarkIcon, LightIcon], i) => {
              const Icon = light && LightIcon ? LightIcon : DarkIcon;
              return (
                <span
                  key={name}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className="h-node"
                  data-hot={hover === i}
                  aria-hidden="true"
                >
                  <Icon size={26} />
                  <span className="h-node__label">{name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
