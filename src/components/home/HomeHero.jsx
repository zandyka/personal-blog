import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useSplashActive } from '../../lib/splashStore';
import { useSoundContext } from '../ui/SoundProvider';
import DitherPortrait from './DitherPortrait';
import { HERO_PORTRAIT } from './homeData';

const EASE = [0.16, 1, 0.3, 1];

function Line({ text, className, delay, ready }) {
  return (
    <span className={`h-mast__line ${className || ''}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="h-mast__char"
          initial={{ y: '112%' }}
          animate={ready ? { y: '0%' } : { y: '112%' }}
          transition={{ duration: 1.15, ease: EASE, delay: delay + i * 0.045 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function useJakartaTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function HomeHero() {
  const splashActive = useSplashActive();
  const ready = !splashActive;
  const reduce = useReducedMotion();
  const { playClick, playHover } = useSoundContext();
  const time = useJakartaTime();

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mastY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const figY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);

  const fade = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section ref={ref} className="h-hero" id="top">
      <div className="h-wrap">
        <motion.div className="h-hero__meta" {...fade(0.05)}>
          <span className="h-mono">Portfolio — Edisi 2026</span>
          <span className="h-mono">Web · AI · Design</span>
          <span className="h-mono">Jakarta, ID — {time} WIB</span>
        </motion.div>

        <div className="h-hero__grid">
          <motion.div className="h-hero__copy" style={{ y: mastY }}>
            <h1 className="h-mast">
              <span className="sr-only">Zacky Andyka</span>
              <Line text="Zacky" ready={ready} delay={0.15} />
              <Line text="Andyka" className="h-mast__line--2" ready={ready} delay={0.3} />
            </h1>

            <motion.p className="h-hero__lede" {...fade(0.75)}>
              <strong>Web developer, AI engineer &amp; graphic designer.</strong> Lulusan Teknik Informatika USU,{' '}
              <em>cum laude</em> — terbiasa membangun produk sekaligus menjalankan operasional nyata di BUMN dan perbankan.
            </motion.p>

            <motion.div className="h-hero__actions" {...fade(0.9)}>
              <a href="#work" className="h-link h-link--down" onMouseEnter={playHover} onClick={playClick}>
                Lihat karya <ArrowDown size={16} />
              </a>
              <Link to="/contact" className="h-link h-link--accent" onMouseEnter={playHover} onClick={playClick}>
                Ajak kerja sama <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.figure className="h-fig" style={{ y: figY }}>
            <motion.div
              className="h-fig__frame"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
              transition={{ duration: 1.25, ease: EASE, delay: 0.2 }}
            >
              <DitherPortrait
                src={HERO_PORTRAIT}
                imageSize={[675, 1200]}
                crop={[160 / 675, 345 / 1200, 1, 945 / 1200]}
                alt="Zacky Andyka berdiri di samping papan ucapan selamat setelah sidang tugas akhir di USU"
                play={ready}
              />
            </motion.div>
            <span className="h-crop h-crop--tl" />
            <span className="h-crop h-crop--tr" />
            <span className="h-crop h-crop--bl" />
            <span className="h-crop h-crop--br" />
            <motion.figcaption className="h-fig__cap" {...fade(1.1)}>
              <span className="h-mono">Fig. 01 — Sidang TA, USU</span>
              <span className="h-mono h-fig__hint">Arahkan kursor</span>
            </motion.figcaption>
          </motion.figure>
        </div>

        <motion.div className="h-hero__foot" {...fade(1.05)}>
          <span className="h-mono">
            Sekarang — <strong>Officer Data Support Intern, PTPN III Holding</strong>
          </span>
          <span className="h-scrollcue h-mono" aria-hidden="true">
            Scroll
            <span className="h-scrollcue__line" />
          </span>
          <span className="h-mono">Terbuka untuk kolaborasi</span>
        </motion.div>
      </div>
    </section>
  );
}
