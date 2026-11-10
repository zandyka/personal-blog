import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// Efek gerak yang terikat posisi scroll (bukan sekali jalan saat terlihat).
// Semuanya mati otomatis bila pengguna memilih "kurangi gerakan" di sistemnya.

const SPRING = { stiffness: 120, damping: 24, mass: 0.4 };

/**
 * Parallax: elemen bergerak lebih lambat/cepat dari halaman.
 * speed > 0 = tertinggal (terasa jauh), speed < 0 = mendahului (terasa dekat).
 */
export function Parallax({ speed = 0.15, children, style, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * -220, speed * 220]);
  const y = useSpring(raw, SPRING);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}

/**
 * ScrollReveal: muncul seiring scroll — naik, membesar, dan miring sedikit ke depan
 * saat masuk layar. Progresnya mengikuti scroll, jadi ikut mundur bila di-scroll balik.
 */
export function ScrollReveal({ children, style, className, from = 70, scale = 0.94, tilt = 0 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 100%', 'start 62%'] });
  const p = useSpring(scrollYProgress, SPRING);
  const y = useTransform(p, [0, 1], [from, 0]);
  const s = useTransform(p, [0, 1], [scale, 1]);
  const o = useTransform(p, [0, 0.6, 1], [0, 0.85, 1]);
  const rx = useTransform(p, [0, 1], [tilt, 0]);

  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y, scale: s, opacity: o, rotateX: rx, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollExit: makin pudar & naik saat elemen keluar dari atas layar (untuk judul pembuka).
 */
export function ScrollExit({ children, style, className, distance = -90 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const o = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const s = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <motion.div ref={ref} className={className} style={reduce ? style : { ...style, y, opacity: o, scale: s }}>
      {children}
    </motion.div>
  );
}
