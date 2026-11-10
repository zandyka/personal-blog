import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { FACTS, SIDES, SIDES_OUTRO } from './homeData';

const EASE = [0.16, 1, 0.3, 1];

// "*kata*" -> <em>kata</em>
const withEmphasis = (text) =>
  text.split('*').map((chunk, i) => (i % 2 === 1 ? <em key={i}>{chunk}</em> : chunk));

function Side({ side, index, active, onEnter }) {
  const state = active === null ? 'rest' : active === side.id ? 'on' : 'off';
  return (
    <motion.article
      className={`h-side h-side--${side.id}`}
      data-state={state}
      onMouseEnter={() => onEnter(side.id)}
      initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE, delay: index * 0.12 }}
    >
      <div className="h-side__media">
        <img className="h-side__bg" src={side.image} alt={side.imageAlt} loading="lazy" decoding="async" />
      </div>
      {index === 1 && (
        <span className="h-side__seam" aria-hidden="true">
          &amp;
        </span>
      )}
      <div className="h-side__body">
        <span className="h-mono h-side__tag">{side.tag}</span>
        <h3 className="h-side__title">
          Saya <em>{side.verb}</em>.
        </h3>
        <p className="h-side__lede">{side.lede}</p>
        <ul className="h-side__list">
          {side.items.map(([label, value]) => (
            <li key={label}>
              <span className="h-mono">{label}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default function Statement() {
  const { playHover, playClick } = useSoundContext();
  const [active, setActive] = useState(null);

  return (
    <section className="h-sec" id="about">
      <div className="h-wrap">
        <SectionHead index="01" label="Tentang" aside="Arahkan ke salah satu sisi">
          Dua sisi <em>meja</em>.
        </SectionHead>

        <div className="h-sides" onMouseLeave={() => setActive(null)}>
          {SIDES.map((side, i) => (
            <Side
              key={side.id}
              side={side}
              index={i}
              active={active}
              onEnter={(id) => {
                if (id !== active) playHover();
                setActive(id);
              }}
            />
          ))}
        </div>

        <div className="h-grid h-sides__after">
          <span className="h-mono">Hasilnya</span>
          <div>
            <motion.p
              className="h-sides__outro"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: EASE }}
            >
              {withEmphasis(SIDES_OUTRO)}
            </motion.p>

            <dl className="h-facts">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="h-mono">{f.label}</dt>
                  <dd>
                    {f.value}
                    <br />
                    <span>{f.note}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="h-statement__more">
              <Link to="/about" className="h-link" onMouseEnter={playHover} onClick={playClick}>
                Selengkapnya tentang saya <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
