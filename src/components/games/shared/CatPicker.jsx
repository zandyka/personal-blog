import { useEffect, useMemo, useState } from 'react';
import { spriteUrl } from './pixelSprites';
import { CATS } from './retro';

function PixelCat({ id, walking }) {
  const urls = useMemo(() => [spriteUrl(id, 0, 4), spriteUrl(id, 1, 4)], [id]);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!walking) return undefined;
    const t = setInterval(() => setTick((n) => n + 1), 170);
    return () => clearInterval(t);
  }, [walking]);
  return <img src={urls[walking ? tick % 2 : 0]} alt="" className="gm-hero__sprite" draggable={false} />;
}

// Pilihan tiga kucing situs (versi pixel), dipakai di menu game retro.
export default function CatPicker({ value, onChange }) {
  return (
    <div className="gm-heroes" role="radiogroup" aria-label="Pilih kucing">
      {CATS.map((c) => (
        <button key={c.id} type="button" role="radio" aria-checked={c.id === value} className={`gm-hero ${c.id === value ? 'is-on' : ''}`} onClick={() => onChange(c.id)} data-cursor-label={c.name}>
          <img src={c.photo} alt="" className="gm-hero__photo" loading="lazy" draggable={false} />
          <PixelCat id={c.id} walking={c.id === value} />
          <strong>{c.name}</strong>
          <span>{c.tag}</span>
        </button>
      ))}
    </div>
  );
}
