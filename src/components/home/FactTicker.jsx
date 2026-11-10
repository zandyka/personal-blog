import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { TICKER_FACTS } from './homeData';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Ticker fakta yang kecepatan & arahnya mengikuti scroll.
export default function FactTicker({ baseVelocity = -1.6 }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const items = (copy) =>
    TICKER_FACTS.map((fact, i) => (
      <span className="h-ticker__item" key={`${copy}-${i}`} aria-hidden={copy > 0 || undefined}>
        <span>
          {fact.text} <em>{fact.em}</em>
        </span>
        <span className="h-ticker__sep" />
      </span>
    ));

  return (
    <div className="h-ticker" role="region" aria-label="Bidang yang dikerjakan">
      <motion.div className="h-ticker__track" style={{ x }}>
        {items(0)}
        {items(1)}
      </motion.div>
    </div>
  );
}
