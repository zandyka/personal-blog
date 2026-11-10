import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { EXPERIENCE } from './homeData';

// Daftar pengalaman bergaya indeks. Saat baris di-hover, foto dari tempat itu
// mengikuti kursor (hanya di perangkat dengan mouse).
export default function ExperienceIndex() {
  const { playHover, playClick } = useSoundContext();
  const listRef = useRef(null);
  const [hovered, setHovered] = useState(-1);
  const [armed, setArmed] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const vx = useMotionValue(0);
  const x = useSpring(px, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(py, { stiffness: 260, damping: 30, mass: 0.6 });
  const rotate = useSpring(useTransform(vx, [-40, 40], [-7, 7], { clamp: true }), { stiffness: 200, damping: 20 });
  const last = useRef(0);

  const onMove = (e) => {
    const rect = listRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    vx.set(nx - last.current);
    last.current = nx;
    px.set(nx + 28);
    py.set(e.clientY - rect.top - 90);
  };

  return (
    <section className="h-sec" id="experience">
      <div className="h-wrap">
        <SectionHead index="04" label="Pengalaman" aside="BUMN, perbankan, organisasi">
          Tempat saya <em>belajar</em>.
        </SectionHead>

        <div className="h-xp" onPointerMove={onMove} onMouseLeave={() => setHovered(-1)}>
          <ul
            ref={listRef}
            className="h-xp__list"
            onMouseEnter={() => setArmed(true)}
          >
            {EXPERIENCE.map((xp, i) => (
              <li key={xp.company}>
                <Link
                  to="/experience"
                  className="h-xp__row"
                  onMouseEnter={() => {
                    setHovered(i);
                    playHover();
                  }}
                  onFocus={() => setHovered(i)}
                  onClick={playClick}
                >
                  <span className="h-mono h-xp__year">{xp.year}</span>
                  <span className="h-xp__co">{xp.company}</span>
                  <span className="h-xp__role">{xp.role}</span>
                  <span className="h-mono h-xp__when">{xp.when}</span>
                </Link>
              </li>
            ))}
          </ul>

          <motion.div
            className="h-xp__preview"
            aria-hidden="true"
            style={{ x, y, rotate }}
            initial={false}
            animate={{ opacity: hovered >= 0 ? 1 : 0, scale: hovered >= 0 ? 1 : 0.85 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {armed &&
              EXPERIENCE.map((xp, i) => (
                <img key={xp.image} src={xp.image} alt="" style={{ opacity: hovered === i ? 1 : 0 }} />
              ))}
          </motion.div>
        </div>

        <div className="h-grid" style={{ marginTop: 'clamp(28px, 5vh, 48px)' }}>
          <span />
          <div>
            <Link to="/experience" className="h-link" onMouseEnter={playHover} onClick={playClick}>
              Perjalanan lengkap & sertifikat <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
