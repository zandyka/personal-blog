import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { WORK } from './homeData';

const DESKTOP = '(min-width: 900px)';

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

const pad = (n) => String(n).padStart(2, '0');

// Proyek pilihan: di desktop, scroll vertikal menggeser deretan proyek ke samping.
export default function WorkReel() {
  const desktop = useMedia(DESKTOP);
  const { playHover, playClick } = useSoundContext();
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const distanceMv = useMotionValue(0);
  const [active, setActive] = useState(1);

  useLayoutEffect(() => {
    if (!desktop) {
      distanceMv.set(0);
      return undefined;
    }
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      setDistance(d);
      distanceMv.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [desktop, distanceMv]);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  const x = useTransform([scrollYProgress, distanceMv], ([v, d]) => -v * d);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(WORK.length, Math.floor(v * WORK.length * 0.999) + 1);
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="h-sec" id="work" style={{ paddingBottom: 0 }}>
      <div className="h-wrap">
        <SectionHead index="02" label="Karya pilihan" aside={`${WORK.length} proyek — web, mobile, AI`}>
          Yang sudah <em>dikirim</em>.
        </SectionHead>
      </div>

      <div
        ref={outerRef}
        className="h-reel"
        style={{ height: desktop ? `calc(100svh + ${distance}px)` : 'auto' }}
      >
        <div className="h-reel__sticky">
          <div className="h-reel__bar">
            <span className="h-mono">
              {pad(active)} / {pad(WORK.length)}
            </span>
            <div className="h-reel__progress">
              <motion.div style={{ scaleX: scrollYProgress }} />
            </div>
            <span className="h-mono">Scroll untuk menggeser</span>
          </div>

          <motion.div ref={trackRef} className="h-reel__track" style={{ x }}>
            {WORK.map((p, i) => (
              <Link
                key={p.id}
                to={p.to}
                className="h-proj"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                <div className="h-proj__img">
                  <img src={p.image} alt={`${p.title} — ${p.subtitle}`} loading="lazy" decoding="async" />
                </div>
                <div className="h-proj__meta">
                  <span className="h-mono">
                    {pad(i + 1)}
                    <br />
                    {p.kind}
                  </span>
                  <div>
                    <h3 className="h-proj__title">
                      {p.title} <em>{p.subtitle}</em>
                    </h3>
                    <p className="h-proj__sum">{p.summary}</p>
                    <p className="h-mono h-proj__tech">{p.tech.join(' / ')}</p>
                  </div>
                  <div className="h-proj__fig">
                    <strong>{p.figure}</strong>
                    <span className="h-mono">{p.figureLabel}</span>
                  </div>
                </div>
              </Link>
            ))}

            <div className="h-proj h-proj--end">
              <span className="h-mono">Masih ada lagi</span>
              <p className="h-head__title">
                Semua <em>proyek</em>
              </p>
              <Link to="/projects" className="h-link h-link--accent" onMouseEnter={playHover} onClick={playClick}>
                Buka arsip proyek <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
