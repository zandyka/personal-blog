import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import SectionHead from './SectionHead';
import { FACTS, STATEMENT } from './homeData';

// "*kata*" -> penekanan. Hasil: daftar kata { text, em }.
const toWords = (source) =>
  source.split('*').flatMap((chunk, i) =>
    chunk
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, em: i % 2 === 1 }))
  );

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const Tag = word.em ? motion.em : motion.span;
  return (
    <>
      <Tag className="h-word" style={{ opacity }}>
        {word.text}
      </Tag>{' '}
    </>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { playHover, playClick } = useSoundContext();
  const words = useMemo(() => toWords(STATEMENT), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.42'] });

  return (
    <section className="h-sec" id="about">
      <div className="h-wrap">
        <SectionHead index="01" label="Tentang">
          Dua sisi <em>meja</em>.
        </SectionHead>

        <div className="h-grid">
          <span />
          <div>
            <p ref={ref} className="h-statement__text">
              {reduce
                ? words.map((w, i) => (w.em ? <em key={i}>{w.text} </em> : <span key={i}>{w.text} </span>))
                : words.map((w, i) => (
                    <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
                  ))}
            </p>

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
