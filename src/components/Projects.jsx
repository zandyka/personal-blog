import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LayoutGrid, Code2, Instagram, Printer } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';
import { Parallax, ScrollReveal } from './ui/ScrollMotion';
import SoftwareCard from './projects/SoftwareCard';
import DesignTile from './projects/DesignTile';
import ProjectModal from './projects/ProjectModal';
import { SOFTWARE_PROJECTS, DIGITAL_DESIGNS, PHYSICAL_DESIGNS } from './projects/projectsData';
import './projects/projects.css';

// Bentuk seragam untuk modal detail.
const fromSoftware = (p) => ({
  key: p.id,
  title: p.title,
  category: p.category,
  image: p.image,
  accent: p.accent,
  description: p.description,
  tags: p.techStack,
  context: p.context,
  demo: p.previewUrl,
});
const fromDesign = (d) => ({
  key: d.id,
  title: d.title,
  category: d.category,
  image: d.image,
  accent: d.accent,
  description: d.description,
  tags: d.tools,
  platform: d.platform,
  url: d.url,
});

const LISTS = {
  software: SOFTWARE_PROJECTS.map(fromSoftware),
  digital: DIGITAL_DESIGNS.map(fromDesign),
  print: PHYSICAL_DESIGNS.map(fromDesign),
};

const FILTERS = [
  { id: 'all', label: 'Semua', icon: LayoutGrid },
  { id: 'software', label: 'Software', icon: Code2 },
  { id: 'digital', label: 'Desain digital', icon: Instagram },
  { id: 'print', label: 'Desain cetak', icon: Printer },
];
const COUNTS = {
  all: SOFTWARE_PROJECTS.length + DIGITAL_DESIGNS.length + PHYSICAL_DESIGNS.length,
  software: SOFTWARE_PROJECTS.length,
  digital: DIGITAL_DESIGNS.length,
  print: PHYSICAL_DESIGNS.length,
};

const NARROW = '(max-width: 860px)';
const useColumnCount = () => {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const update = () => setNarrow(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return narrow ? 2 : 3;
};

// Masonry seimbang: tiap desain masuk ke kolom yang saat ini paling pendek. Index asli disimpan untuk modal.
const toColumns = (items, count) => {
  const cols = Array.from({ length: count }, () => ({ height: 0, items: [] }));
  items.forEach((item, index) => {
    const shortest = cols.reduce((a, b) => (b.height < a.height ? b : a));
    shortest.items.push({ item, index });
    shortest.height += 1 / item.ratio;
  });
  return cols.map((c) => c.items);
};

function SectionHeader({ label, title, desc, color = 'var(--accent)' }) {
  return (
    <ScrollReveal from={60} scale={0.92} className="pj-head">
      <span className="pj-head__label" style={{ color }}>
        {label}
      </span>
      <h2 className="pj-head__title">{title}</h2>
      <div className="pj-head__bar" style={{ background: color }} />
      {desc && <p className="pj-head__desc">{desc}</p>}
    </ScrollReveal>
  );
}

function Masonry({ items, onOpen }) {
  const columnCount = useColumnCount();
  const columns = useMemo(() => toColumns(items, columnCount), [items, columnCount]);
  return (
    <div className="ds-masonry">
      {columns.map((col, ci) => (
        <Parallax
          key={ci}
          // kolom tengah bergerak berlawanan arah (hanya saat 3 kolom)
          speed={columnCount === 3 && items.length > 3 ? (ci === 1 ? -0.1 : 0.05) : 0}
          className="ds-masonry__col"
        >
          {col.map(({ item, index }) => (
            <DesignTile key={item.id} item={item} index={index} onOpen={() => onOpen(index)} />
          ))}
        </Parallax>
      ))}
    </div>
  );
}

const sectionMotion = {
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(8px)' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const Projects = () => {
  const { playClick, playHover } = useSoundContext();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); // { list, index, dir }

  const show = (id) => filter === 'all' || filter === id;
  const openIn = (list) => (index) => setModal({ list, index, dir: 0 });
  const close = useCallback(() => setModal(null), []);
  const navigate = useCallback(
    (step) =>
      setModal((m) => {
        if (!m) return m;
        const len = LISTS[m.list].length;
        return { ...m, index: (m.index + step + len) % len, dir: step };
      }),
    []
  );

  const motionProps = reduce ? {} : sectionMotion;

  return (
    <section id="projects" className="pj-page">
      <div className="pj-wrap">
        <SectionHeader
          label="Karya & Proyek"
          title="Featured Projects"
          desc="Aplikasi AI on-device, sistem web full-stack, dasbor korporat di BUMN dan perbankan, hingga desain visual untuk media sosial dan cetak."
        />

        {/* Filter: indikator pill bergeser ke pilihan aktif */}
        <div className="pj-filter-wrap">
          <div className="pj-filter" role="tablist" aria-label="Saring karya">
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  className={`pj-filter__btn${active ? ' is-active' : ''}`}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setFilter(id);
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="pj-filter-pill"
                      className="pj-filter__pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon size={14} />
                  <span className="pj-filter__label">{label}</span>
                  <em>{COUNTS[id]}</em>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {show('software') && (
            <motion.div key="software" className="pj-section" {...motionProps}>
              <div className="pj-grid">
                {SOFTWARE_PROJECTS.map((project, i) => (
                  <SoftwareCard key={project.id} project={project} index={i} onOpen={() => openIn('software')(i)} />
                ))}
              </div>
            </motion.div>
          )}

          {show('digital') && (
            <motion.div key="digital" className="pj-section" {...motionProps}>
              <SectionHeader
                label="Digital & Social Media Design"
                title="Desain Feed Instagram & Digital"
                desc="Identitas visual media sosial, publikasi informasi resmi, dan feed terpadu untuk organisasi dan kepanitiaan."
              />
              <div className="ds-digital">
                {DIGITAL_DESIGNS.map((item, i) => (
                  <DesignTile key={item.id} item={item} index={i} onOpen={() => openIn('digital')(i)} />
                ))}
              </div>
            </motion.div>
          )}

          {show('print') && (
            <motion.div key="print" className="pj-section" {...motionProps}>
              <SectionHeader
                label="Physical & Print Media"
                title="Hasil Desain Fisik"
                color="var(--accent-2)"
                desc="Lanyard resmi, kartu pengenal panitia & magang, spanduk acara, poster, dan x-banner — ditampilkan utuh sesuai ukuran aslinya."
              />
              <Masonry items={PHYSICAL_DESIGNS} onOpen={openIn('print')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProjectModal
        items={modal ? LISTS[modal.list] : []}
        index={modal ? modal.index : null}
        direction={modal ? modal.dir : 0}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  );
};

export default Projects;
