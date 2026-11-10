import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import { useTilt } from '../../hooks/useTilt';
import { useMeasureOnMount } from '../../hooks/useMeasureOnMount';

const MAX_TAGS = 4;

export default function SoftwareCard({ project, index, onOpen }) {
  const { playHover, playClick } = useSoundContext();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const tilt = useTilt({ max: 6, glare: 0.18 });
  const TypeIcon = project.typeIcon;

  // Masuk mengikuti scroll: naik, sedikit miring ke belakang, kolom kanan sedikit terlambat.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 100%', 'start 65%'] });
  useMeasureOnMount();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const delay = (index % 2) * 0.12;
  const progress = useTransform(p, [delay, 1], [0, 1]);
  const y = useTransform(progress, [0, 1], [80, 0]);
  const opacity = useTransform(progress, [0, 0.6, 1], [0, 0.85, 1]);
  const entryRotateX = useTransform(progress, [0, 1], [18, 0]);
  const rotateX = useTransform([entryRotateX, tilt.rotateX], ([a, b]) => a + b);

  // Gambar bergeser berlawanan arah kemiringan → kesan kedalaman di dalam kartu.
  const imgX = useTransform(tilt.rotateY, [-6, 6], [10, -10]);
  const imgY = useTransform(tilt.rotateX, [-6, 6], [-8, 8]);

  const extra = project.techStack.length - MAX_TAGS;
  const open = () => {
    playClick();
    onOpen();
  };

  return (
    <motion.article
      ref={ref}
      {...tilt.handlers}
      onMouseEnter={playHover}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail ${project.title}`}
      className="pj-card"
      style={{
        '--pj-accent': project.accent,
        ...(reduce ? {} : { y, opacity, rotateX, rotateY: tilt.rotateY, transformPerspective: 1200 }),
      }}
    >
      <motion.span style={tilt.glareStyle} aria-hidden="true" />

      <div className="pj-card__media">
        <motion.img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { x: imgX, y: imgY, scale: 1.06 }}
        />
        <span className="pj-card__badge">
          <TypeIcon size={12} style={{ color: project.accent }} />
          {project.category}
        </span>
      </div>

      <div className="pj-card__body">
        {project.context && <span className="pj-card__ctx">{project.context}</span>}
        <h3 className="pj-card__title">{project.title}</h3>
        <p className="pj-card__desc">{project.description}</p>

        <div className="pj-tags">
          {project.techStack.slice(0, MAX_TAGS).map((t) => (
            <span key={t}>{t}</span>
          ))}
          {extra > 0 && <span className="pj-tags__more">+{extra}</span>}
        </div>

        <div className="pj-card__foot">
          {project.previewUrl ? (
            <Link
              to={project.previewUrl}
              className="pj-demo"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
              }}
              onMouseEnter={playHover}
            >
              <Sparkles size={13} /> Preview AI
            </Link>
          ) : (
            <span />
          )}
          <span className="pj-more">
            Lihat detail <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
