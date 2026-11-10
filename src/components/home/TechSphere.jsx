import { useEffect, useRef } from 'react';
import SectionHead from './SectionHead';
import { TECH } from './homeData';

// Bola 3D berisi nama teknologi. Berputar pelan sendiri; gerakan mouse
// mengubah arah & kecepatannya, dan bisa diseret.
export default function TechSphere() {
  const boxRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = TECH.length;
    // titik merata di permukaan bola (spiral Fibonacci)
    const pts = TECH.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    });
    const s = { vx: 0.0016, vy: 0.003, radius: 200, raf: 0, visible: false, drag: false, lx: 0, ly: 0 };

    const size = () => {
      s.radius = Math.min(box.clientWidth, box.clientHeight) * 0.42;
    };
    const rotate = (ax, ay) => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      for (const p of pts) {
        const [x, y, z] = p;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        p[0] = x1;
        p[1] = y * cx - z1 * sx;
        p[2] = y * sx + z1 * cx;
      }
    };
    const paint = () => {
      pts.forEach(([x, y, z], i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const depth = (z + 1) / 2; // 0 belakang .. 1 depan
        const scale = 0.55 + depth * 0.75;
        el.style.transform = `translate3d(${(x * s.radius).toFixed(1)}px, ${(y * s.radius).toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.18 + depth * 0.82).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    };
    const tick = () => {
      s.raf = 0;
      if (!s.drag) rotate(s.vx, s.vy);
      paint();
      if (s.visible && !reduce) s.raf = requestAnimationFrame(tick);
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
        return;
      }
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      s.vy = nx * 0.022;
      s.vx = -ny * 0.022;
    };
    const onDown = (e) => {
      s.drag = true;
      s.lx = e.clientX;
      s.ly = e.clientY;
    };
    const onUp = () => {
      s.drag = false;
    };

    size();
    paint();
    const ro = new ResizeObserver(() => {
      size();
      paint();
    });
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      start();
    });
    io.observe(box);
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      io.disconnect();
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <section className="h-sec" id="stack">
      <div className="h-wrap">
        <SectionHead index="02" label="Perkakas" aside="Gerakkan mouse / seret bolanya">
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
          <div ref={boxRef} className="h-tech__sphere" aria-label="Bola teknologi 3D">
            {TECH.map((name, i) => (
              <span
                key={name}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="h-tech__item"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
