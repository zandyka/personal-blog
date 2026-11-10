import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { WORK } from './homeData';

const pad = (n) => String(n).padStart(2, '0');

function Card({ project, index, total, progress }) {
  const reduce = useReducedMotion();
  const { playHover, playClick } = useSoundContext();
  // Saat kartu berikutnya naik, kartu ini mengecil & meredup di belakangnya.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, reduce ? 1 : 1 - (total - 1 - index) * 0.045]);
  const dim = useTransform(progress, [Math.min(1, start + 0.6 / total), Math.min(1, start + 1.1 / total)], [0, index === total - 1 ? 0 : 0.5]);

  return (
    <div className="h-stack__slot" style={{ top: `calc(92px + ${index * 26}px)` }}>
      <motion.div style={{ scale }} className="h-stack__scale">
        <Link to={project.to} className="h-card" onMouseEnter={playHover} onClick={playClick}>
          <div className="h-card__img">
            <img src={project.image} alt={`${project.title} — ${project.subtitle}`} loading="lazy" decoding="async" />
          </div>
          <div className="h-card__info">
            <div className="h-card__top">
              <span className="h-mono">
                {pad(index + 1)} / {pad(total)}
              </span>
              <span className="h-mono">{project.kind}</span>
            </div>
            <h3 className="h-card__title">
              {project.title} <em>{project.subtitle}</em>
            </h3>
            <p className="h-card__sum">{project.summary}</p>
            <div className="h-card__fig">
              <strong>{project.figure}</strong>
              <span className="h-mono">{project.figureLabel}</span>
            </div>
            <div className="h-card__foot">
              <span className="h-mono">{project.tech.join(' / ')}</span>
              <span className="h-card__go">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
          <motion.span className="h-card__dim" style={{ opacity: dim }} aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
}

// Proyek sebagai tumpukan kartu: tiap kartu menempel lalu ditimpa kartu berikutnya.
export default function StackCards() {
  const { playHover, playClick } = useSoundContext();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section className="h-sec" id="work">
      <div className="h-wrap">
        <SectionHead index="03" label="Karya pilihan" aside={`${WORK.length} proyek — web, mobile, AI`}>
          Yang sudah <em>dikirim</em>.
        </SectionHead>

        <div ref={ref} className="h-stack">
          {WORK.map((p, i) => (
            <Card key={p.id} project={p} index={i} total={WORK.length} progress={scrollYProgress} />
          ))}
        </div>

        <div className="h-stack__more">
          <Link to="/projects" className="h-link h-link--accent" onMouseEnter={playHover} onClick={playClick}>
            Buka semua proyek & desain <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
