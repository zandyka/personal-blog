import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { ARCHIVE } from './homeData';

const N = ARCHIVE.length;
const STEP = 360 / N;

// Cincin 3D (CSS 3D, tanpa library) berisi foto & desain. Bisa diseret,
// berputar pelan sendiri, dan ikut terdorong oleh scroll.
export default function PhotoRing() {
  const { playHover, playClick } = useSoundContext();
  const navigate = useNavigate();
  const ringRef = useRef(null);
  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const [front, setFront] = useState(0);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const ring = ringRef.current;
    const stage = stageRef.current;
    if (!ring || !stage) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = {
      angle: 0,
      velocity: 0,
      dragging: false,
      moved: 0,
      lastX: 0,
      lastScroll: window.scrollY,
      radius: 400,
      visible: false,
      raf: 0,
      front: -1,
    };

    const layout = () => {
      const item = itemRefs.current[0];
      const width = item ? item.offsetWidth : 200;
      s.radius = Math.round((N * (width + Math.max(14, width * 0.12))) / (2 * Math.PI));
      itemRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotateY(${i * STEP}deg) translateZ(${s.radius}px)`;
      });
    };

    const paint = () => {
      stage.style.transform = `translateZ(${-s.radius}px) rotateX(-7deg) rotateY(${s.angle}deg)`;
      let best = 0;
      let bestCos = -2;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = ((i * STEP + s.angle) * Math.PI) / 180;
        const c = Math.cos(a); // 1 = menghadap kita
        el.style.setProperty('--shade', (0.62 * (1 - (c + 1) / 2)).toFixed(3));
        if (c > bestCos) {
          bestCos = c;
          best = i;
        }
      });
      if (best !== s.front) {
        s.front = best;
        setFront(best);
      }
    };

    const tick = () => {
      s.raf = 0;
      if (!s.dragging) {
        const auto = reduce ? 0 : -0.05;
        s.velocity += (auto - s.velocity) * 0.035;
        s.angle += s.velocity;
      }
      paint();
      if (s.visible) s.raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!s.raf && s.visible) s.raf = requestAnimationFrame(tick);
    };

    const onDown = (e) => {
      s.dragging = true;
      s.moved = 0;
      s.lastX = e.clientX;
      s.velocity = 0;
      ring.classList.add('is-dragging');
    };
    const onMove = (e) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      const d = dx * 0.22;
      s.angle += d;
      s.velocity = d;
    };
    const onUp = () => {
      if (!s.dragging) return;
      s.dragging = false;
      ring.classList.remove('is-dragging');
    };
    const onScroll = () => {
      const dy = window.scrollY - s.lastScroll;
      s.lastScroll = window.scrollY;
      if (!s.dragging && !reduce) s.velocity += Math.max(-1.2, Math.min(1.2, dy * 0.012));
    };

    // Klik hanya dianggap klik bila tidak sedang menyeret.
    const onClickCapture = (e) => {
      if (s.moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    layout();
    paint();

    const ro = new ResizeObserver(() => {
      layout();
      paint();
    });
    ro.observe(ring);
    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
        if (s.visible) {
          setNear(true);
          start();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(ring);

    ring.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    ring.addEventListener('click', onClickCapture, true);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      io.disconnect();
      ring.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('scroll', onScroll);
      ring.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  const current = ARCHIVE[front];

  return (
    <section className="h-sec" id="archive" style={{ paddingBottom: 'clamp(64px, 10vh, 120px)' }}>
      <div className="h-wrap">
        <SectionHead index="05" label="Arsip visual">
          Desain &amp; <em>foto</em>.
        </SectionHead>
      </div>

      <div ref={ringRef} className="h-ring" role="group" aria-label="Arsip foto dan desain, seret untuk memutar">
        <div ref={stageRef} className="h-ring__stage">
          {ARCHIVE.map((item, i) => (
            <button
              key={item.src}
              type="button"
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="h-ring__item"
              aria-label={`${item.kind}: ${item.caption}`}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                navigate(item.to);
              }}
            >
              {near && <img src={item.src} alt="" loading="lazy" decoding="async" draggable="false" />}
            </button>
          ))}
        </div>
      </div>

      <div className="h-wrap">
        <div className="h-ring__cap">
          <span className="h-mono" aria-live="polite">
            No. {String(front + 1).padStart(2, '0')} — {current.kind} — {current.caption}
          </span>
          <span style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <Link to="/album" className="h-link" onMouseEnter={playHover} onClick={playClick}>
              Album foto <ArrowUpRight size={16} />
            </Link>
            <Link to="/projects" className="h-link" onMouseEnter={playHover} onClick={playClick}>
              Semua desain <ArrowUpRight size={16} />
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
