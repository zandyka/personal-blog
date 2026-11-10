import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparklesCore } from './sparkles';

/*
 * Efek "cover" untuk teks, tanpa bingkai: garis cahaya menyapu teks terus-menerus,
 * dan saat di-hover muncul partikel berkilau, teks bergetar halus dan menyala.
 * Tidak menambah padding/latar, jadi ukuran teks sama dengan teks di sekitarnya.
 */

function Beam({ hovered, top, delay, duration, color }) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  return (
    <svg
      className="text-cover__beam"
      style={{ top }}
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 0.5H100" stroke={`url(#beam-${id})`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <defs>
        <motion.linearGradient
          id={`beam-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: '0%', x2: hovered ? '-10%' : '-5%', y1: 0, y2: 0 }}
          animate={{ x1: '110%', x2: hovered ? '100%' : '105%', y1: 0, y2: 0 }}
          transition={{
            duration: hovered ? 0.75 : duration,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: hovered ? 0.4 + Math.random() * 0.5 : delay,
          }}
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}

const BEAMS = [
  { top: '22%', delay: 2.2, duration: 4.8 },
  { top: '48%', delay: 3.4, duration: 5.6 },
  { top: '74%', delay: 2.8, duration: 5.2 },
];

export default function TextCover({ children }) {
  const [hovered, setHovered] = useState(false);
  const [colors, setColors] = useState({ beam: '#D65A6E', spark: '#FFFFFF' });
  const ref = useRef(null);

  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      const accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#D65A6E';
      const light = root.classList.contains('light');
      setColors({ beam: accent, spark: light ? accent : '#FFFFFF' });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="text-cover"
      data-hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="text-cover__sparkles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.span
              className="text-cover__sparkles-inner"
              animate={{ translateX: ['-50%', '0%'] }}
              transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
            >
              <SparklesCore minSize={0.4} maxSize={1} particleDensity={500} particleColor={colors.spark} className="w-full h-full" />
              <SparklesCore minSize={0.4} maxSize={1} particleDensity={500} particleColor={colors.spark} className="w-full h-full" />
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      {BEAMS.map((b) => (
        <Beam key={b.top} hovered={hovered} color={colors.beam} {...b} />
      ))}

      <motion.span
        className="text-cover__text"
        animate={hovered ? { scale: 0.98, x: [-3, 3, -3], y: [2, -2, 2] } : { scale: 1, x: 0, y: 0 }}
        transition={
          hovered
            ? {
                x: { duration: 0.65, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                y: { duration: 0.65, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                scale: { duration: 0.25, ease: 'easeOut' },
              }
            : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}
