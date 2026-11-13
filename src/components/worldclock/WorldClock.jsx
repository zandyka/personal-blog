import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Sun, Moon, Globe2 } from 'lucide-react';
import WORLD_DOTS from '../../data/worldDots';
import { useSoundContext } from '../ui/SoundProvider';
import './worldclock.css';

// ---------- proyeksi (sama dengan data titik: Mercator, batas lintang -56..71, bujur -168..168) ----------
const { width: MW, height: MH, region, points } = WORLD_DOTS;
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y_TOP = merc(region.lat.max);
const Y_RANGE = Y_TOP - merc(region.lat.min);
const LNG_RANGE = region.lng.max - region.lng.min;
const project = (lat, lng) => [((lng - region.lng.min) / LNG_RANGE) * MW, ((Y_TOP - merc(lat)) / Y_RANGE) * MH];
const unproject = (x, y) => {
  const m = Y_TOP - (y / MH) * Y_RANGE;
  return [(Math.atan(Math.sinh(m)) * 180) / Math.PI, region.lng.min + (x / MW) * LNG_RANGE];
};

const HOME = { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', lat: -6.21, lng: 106.85, tz: 'Asia/Jakarta' };
const CITIES = [
  { id: 'singapore', name: 'Singapura', country: 'Singapura', lat: 1.35, lng: 103.82, tz: 'Asia/Singapore' },
  { id: 'tokyo', name: 'Tokyo', country: 'Jepang', lat: 35.68, lng: 139.69, tz: 'Asia/Tokyo' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.87, lng: 151.21, tz: 'Australia/Sydney' },
  { id: 'dubai', name: 'Dubai', country: 'Uni Emirat Arab', lat: 25.2, lng: 55.27, tz: 'Asia/Dubai' },
  { id: 'london', name: 'London', country: 'Inggris', lat: 51.51, lng: -0.13, tz: 'Europe/London' },
  { id: 'newyork', name: 'New York', country: 'Amerika Serikat', lat: 40.71, lng: -74.0, tz: 'America/New_York' },
  { id: 'losangeles', name: 'Los Angeles', country: 'Amerika Serikat', lat: 34.05, lng: -118.24, tz: 'America/Los_Angeles' },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brasil', lat: -23.55, lng: -46.63, tz: 'America/Sao_Paulo' },
];

// ---------- waktu ----------
const timeIn = (tz, date, seconds = false) =>
  date.toLocaleTimeString('id-ID', { timeZone: tz, hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}) });
const dayIn = (tz, date) => date.toLocaleDateString('id-ID', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'short' });
// selisih zona waktu terhadap UTC, dalam menit (ikut aturan musim panas)
const offsetMin = (tz, date) => {
  const local = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  return Math.round((local - utc) / 60000);
};
const hourIn = (tz, date) => Number(date.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false })) % 24;
const describeDiff = (min) => {
  if (min === 0) return 'sama dengan Jakarta';
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  const span = `${h ? `${h} jam` : ''}${h && m ? ' ' : ''}${m ? `${m} menit` : ''}`;
  return `${span} ${min > 0 ? 'lebih cepat' : 'lebih lambat'} dari Jakarta`;
};

// posisi matahari → seberapa "siang" sebuah titik (dipakai untuk meredupkan sisi malam bumi)
const sunAt = (date) => {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = (date - start) / 86400000;
  const decl = ((23.44 * Math.PI) / 180) * Math.sin(((2 * Math.PI) / 365) * (day - 81));
  const utcH = date.getUTCHours() + date.getUTCMinutes() / 60;
  const subLng = -(utcH - 12) * 15;
  return { decl, subLng };
};
const daylight = (lat, lng, sun) => {
  const la = (lat * Math.PI) / 180;
  const h = ((lng - sun.subLng) * Math.PI) / 180;
  return Math.sin(la) * Math.sin(sun.decl) + Math.cos(la) * Math.cos(sun.decl) * Math.cos(h);
};

// lengkung dari Jakarta ke kota tujuan, melengkung ke atas sebanding jaraknya
const arcPath = ([x1, y1], [x2, y2]) => {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - dist * 0.32;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
};

const DOT_LATLNG = (() => {
  const out = new Float32Array(points.length);
  for (let i = 0; i < points.length; i += 2) {
    const [lat, lng] = unproject(points[i], points[i + 1]);
    out[i] = lat;
    out[i + 1] = lng;
  }
  return out;
})();

export default function WorldClock({ open, onClose }) {
  const { playClick, playHover } = useSoundContext();
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState('london');
  const closeRef = useRef(null);

  // jam berdetak tiap detik selama terbuka
  useEffect(() => {
    if (!open) return undefined;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [open]);

  // Esc menutup, scroll halaman dikunci, fokus ke tombol tutup
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // siang/malam cukup dihitung ulang tiap menit
  const minuteKey = Math.floor(now.getTime() / 60000);
  const dotOpacity = useMemo(() => {
    const sun = sunAt(new Date(minuteKey * 60000));
    const out = new Array(points.length / 2);
    for (let i = 0; i < out.length; i++) {
      const d = daylight(DOT_LATLNG[i * 2], DOT_LATLNG[i * 2 + 1], sun);
      const t = Math.max(0, Math.min(1, (d + 0.08) / 0.24)); // senja lembut di garis batas
      out[i] = 0.16 + t * 0.5;
    }
    return out;
  }, [minuteKey]);

  const home = project(HOME.lat, HOME.lng);
  const homeOffset = offsetMin(HOME.tz, now);
  const active = CITIES.find((c) => c.id === (hovered || selected)) || CITIES[0];
  const activeXY = project(active.lat, active.lng);
  const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const visitorDiff = offsetMin(visitorTz, now) - homeOffset;

  const pick = (id) => {
    playClick();
    setSelected(id);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="wc-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Peta waktu dunia"
        >
          <motion.div
            className="wc-panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -30, scale: 0.96, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="wc-head">
              <div>
                <span className="wc-label">
                  <Globe2 size={14} /> World clock
                </span>
                <div className="wc-home">
                  <strong>{timeIn(HOME.tz, now, true)}</strong>
                  <span>WIB · Jakarta — {dayIn(HOME.tz, now)}</span>
                </div>
                {visitorTz !== HOME.tz && (
                  <p className="wc-visitor">
                    Waktu Anda ({visitorTz.replace(/_/g, ' ')}): {timeIn(visitorTz, now)} — {describeDiff(visitorDiff)}
                  </p>
                )}
              </div>
              <button ref={closeRef} type="button" className="wc-close" onClick={onClose} aria-label="Tutup peta waktu">
                <X size={18} />
              </button>
            </header>

            <div className="wc-map">
              <svg viewBox={`0 -6 ${MW} ${MH + 6}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                {/* titik daratan; sisi malam lebih redup */}
                <g className="wc-dots">
                  {dotOpacity.map((op, i) => (
                    <circle key={i} cx={points[i * 2]} cy={points[i * 2 + 1]} r={0.3} opacity={op} />
                  ))}
                </g>

                {/* lengkung dari Jakarta */}
                {CITIES.map((c, i) => {
                  const xy = project(c.lat, c.lng);
                  const isActive = c.id === active.id;
                  return (
                    <g key={c.id}>
                      <motion.path
                        d={arcPath(home, xy)}
                        className={`wc-arc${isActive ? ' is-active' : ''}`}
                        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.25 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {isActive && <path d={arcPath(home, xy)} className="wc-arc-flow" />}
                    </g>
                  );
                })}

                {/* titik kota */}
                {[HOME, ...CITIES].map((c, i) => {
                  const [x, y] = project(c.lat, c.lng);
                  const isHome = c.id === HOME.id;
                  const isActive = c.id === active.id;
                  return (
                    <motion.g
                      key={c.id}
                      className={`wc-pin${isHome ? ' is-home' : ''}${isActive ? ' is-active' : ''}`}
                      initial={reduce ? false : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.5 + i * 0.07 }}
                      style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
                      onMouseEnter={() => {
                        if (isHome) return;
                        playHover();
                        setHovered(c.id);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => !isHome && pick(c.id)}
                    >
                      <circle cx={x} cy={y} r={3.2} className="wc-pin__hit" />
                      <circle cx={x} cy={y} r={isHome ? 2 : 1.5} className="wc-pin__ring" />
                      <circle cx={x} cy={y} r={isHome ? 1.05 : 0.85} className="wc-pin__dot" />
                    </motion.g>
                  );
                })}
              </svg>

              {/* kartu perbandingan, menempel di atas kota yang aktif */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="wc-card"
                  style={{
                    left: `${(activeXY[0] / MW) * 100}%`,
                    top: `${((activeXY[1] + 6) / (MH + 6)) * 100}%`,
                  }}
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="wc-card__place">
                    {hourIn(active.tz, now) >= 6 && hourIn(active.tz, now) < 18 ? <Sun size={13} /> : <Moon size={13} />}
                    {active.name}, {active.country}
                  </span>
                  <strong>{timeIn(active.tz, now)}</strong>
                  <span className="wc-card__day">{dayIn(active.tz, now)}</span>
                  <span className="wc-card__diff">{describeDiff(offsetMin(active.tz, now) - homeOffset)}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* daftar kota (juga untuk layar sentuh & pembaca layar) */}
            <ul className="wc-list">
              {CITIES.map((c) => {
                const isActive = c.id === active.id;
                const h = hourIn(c.tz, now);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`wc-chip${isActive ? ' is-active' : ''}`}
                      aria-pressed={c.id === selected}
                      onMouseEnter={() => {
                        playHover();
                        setHovered(c.id);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(c.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => pick(c.id)}
                    >
                      <span className="wc-chip__name">
                        {h >= 6 && h < 18 ? <Sun size={12} /> : <Moon size={12} />}
                        {c.name}
                      </span>
                      <strong>{timeIn(c.tz, now)}</strong>
                      <span className="wc-chip__diff">
                        {(() => {
                          const d = offsetMin(c.tz, now) - homeOffset;
                          if (!d) return '±0 j';
                          const hrs = d / 60;
                          return `${hrs > 0 ? '+' : '−'}${Math.abs(hrs) % 1 ? Math.abs(hrs).toFixed(1) : Math.abs(hrs)} j`;
                        })()}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
