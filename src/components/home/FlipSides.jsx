import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import SectionHead from './SectionHead';
import { SIDES } from './homeData';

// Kartu sederhana ala kartu galeri: foto penuh + label & judul di bawah.
function Face({ side, back, hidden = false }) {
  return (
    <div
      className={`h-flip__face h-flip__face--${side.id} ${back ? 'h-flip__face--back' : ''}`}
      data-hidden={hidden}
      aria-hidden={hidden || undefined}
    >
      <img className="h-flip__img" src={side.image} alt={side.imageAlt} loading="lazy" decoding="async" />
      <div className="h-flip__caption">
        <span className="h-mono">{side.tag}</span>
        <h3 className="h-flip__title">
          Saya <em>{side.verb}</em>.
        </h3>
      </div>
    </div>
  );
}

// "Dua sisi meja": satu kartu 3D yang membalik saat di-scroll.
// Depan = sisi pembuat, belakang = sisi pengguna.
export default function FlipSides() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.6 });
  const rotateY = useTransform(smooth, [0.12, 0.88], [0, 180]);
  const scale = useTransform(smooth, [0.12, 0.5, 0.88], [1, 0.84, 1]);
  const rotateX = useTransform(smooth, [0.12, 0.5, 0.88], [0, 8, 0]);

  useMotionValueEvent(smooth, 'change', (v) => {
    const next = v > 0.5;
    setFlipped((prev) => (prev === next ? prev : next));
  });

  if (reduce) {
    return (
      <section className="h-sec" id="about">
        <div className="h-wrap">
          <SectionHead index="01" label="Tentang">
            Dua sisi <em>meja</em>.
          </SectionHead>
          <div className="h-flip__static">
            {SIDES.map((s) => (
              <Face key={s.id} side={s} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-sec" id="about" style={{ paddingBottom: 0 }}>
      <div className="h-wrap">
        <SectionHead index="01" label="Tentang">
          Dua sisi <em>meja</em>.
        </SectionHead>
      </div>

      <div ref={ref} className="h-flip">
        <div className="h-flip__sticky">
          <div className="h-flip__stage">
            <motion.div className="h-flip__card" style={{ rotateY, rotateX, scale }}>
              {/* sisi yang membelakangi disembunyikan (lihat .h-flip__face[data-hidden]) */}
              <Face side={SIDES[0]} hidden={flipped} />
              <Face side={SIDES[1]} back hidden={!flipped} />
            </motion.div>
          </div>
          <div className="h-flip__hud h-mono">
            <span data-on={!flipped}>{SIDES[0].hud}</span>
            <span className="h-flip__bar">
              <motion.i style={{ scaleX: smooth }} />
            </span>
            <span data-on={flipped}>{SIDES[1].hud}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
