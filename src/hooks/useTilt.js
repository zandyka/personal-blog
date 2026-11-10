import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Kartu miring 3D mengikuti posisi kursor, plus kilau cahaya yang ikut bergerak.
 * Mati di perangkat sentuh dan bila pengguna memilih "kurangi gerakan".
 *
 * Pakai: const tilt = useTilt(); <motion.div {...tilt.handlers} style={{ ...tilt.style }}>
 *        lalu render <motion.div style={tilt.glareStyle} /> di dalamnya (position absolute).
 */
export function useTilt({ max = 7, glare = 0.16 } = {}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const active = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const glareOpacity = useSpring(useTransform(active, [0, 1], [0, glare]), SPRING);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.9), transparent 55%)`;

  const enabled = !reduce;

  const onPointerMove = (e) => {
    if (!enabled || e.pointerType !== 'mouse' || !canHover()) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    active.set(1);
  };
  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    active.set(0);
  };

  return {
    rotateX,
    rotateY,
    handlers: { onPointerMove, onPointerLeave },
    style: enabled ? { rotateX, rotateY, transformPerspective: 1000 } : {},
    glareStyle: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      pointerEvents: 'none',
      mixBlendMode: 'soft-light',
      opacity: enabled ? glareOpacity : 0,
      background,
      zIndex: 2,
    },
  };
}
