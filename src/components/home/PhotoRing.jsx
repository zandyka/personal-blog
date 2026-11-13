import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import FlexCarousel from '../ui/FlexCarousel';
import '../ui/FlexCarousel.css';
import SectionHead from './SectionHead';
import { ARCHIVE } from './homeData';

// Arsip visual: baris foto & desain yang melengkung lewat "lensa kaca" tak terlihat
// (FlexCarousel, React Bits — WebGL/ogl). Bisa diseret, klik kartu tengah untuk memperbesar.
export default function PhotoRing() {
  const { playHover, playClick } = useSoundContext();
  const items = useMemo(
    () => ARCHIVE.map((a) => ({ src: a.src, alt: a.caption, title: a.caption, subtitle: a.kind })),
    []
  );

  return (
    <section className="h-sec" id="archive" style={{ paddingBottom: 'clamp(40px, 6vh, 72px)' }}>
      <div className="h-wrap">
        <SectionHead index="05" label="Arsip visual">
          Desain &amp; <em>foto</em>.
        </SectionHead>
      </div>

      <div className="h-archive">
        <FlexCarousel
          items={items}
          preset="liquid"
          intro="rise"
          cardHeight={0.56}
          gap={14}
          radius={14}
          squeeze={0.2}
          focusOnClick
          captions
          captureWheel={false}
        />
      </div>

      <div className="h-wrap">
        <div className="h-ring__cap">
          <span className="h-mono">
            {ARCHIVE.length} karya — desain &amp; foto
          </span>
          <span style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <Link to="/album" className="h-link" onMouseEnter={playHover} onClick={playClick}>
              Album foto <ArrowUpRight size={16} />
            </Link>
            <Link to="/projects" className="h-link" onMouseEnter={playHover} onClick={playClick}>
              Semua desain <ArrowUpRight size={16} />
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
