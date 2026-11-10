import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from 'framer-motion';
import {
  Linkedin,
  Instagram,
  Github,
  Mail,
  Music,
  Gamepad2,
  ArrowUpRight,
  Copy,
  Check,
} from 'lucide-react';
import { useSoundContext } from './SoundProvider';
import { useTilt } from '../../hooks/useTilt';

/**
 * Watermark SVG silhouettes rendered subtly behind each card (matching reference image)
 */
const Watermarks = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <rect x="2" y="2" width="20" height="20" rx="6" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28m-1.4 9.74h2.79v-8.37H5.06v8.37Z" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Spotify: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14.5c2.5-1 5.5-.8 8 .5" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11.8c3.2-1.3 6.8-1 10 .6" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 9c4-1.5 8.2-1.2 12 .8" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-watermark" style={{ width: '100%', height: '100%' }}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

// ROW 1: LinkedIn, Instagram, GitHub
const ROW_1_CHANNELS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: '@zacky-andyka',
    subtitle: 'Zacky Andyka',
    href: 'https://www.linkedin.com/in/zacky-andyka/',
    icon: Linkedin,
    iconBg: '#ffffff',
    iconColor: '#0A66C2',
    Watermark: Watermarks.LinkedIn,
    color: '#0A66C2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@zandyka._',
    subtitle: 'Creative & Personal',
    href: 'https://www.instagram.com/zandyka._/',
    icon: Instagram,
    iconBg: 'var(--surface-2)', // ikut tema: ikon putih di latar putih tak terlihat di tema terang
    iconColor: 'var(--text)',
    Watermark: Watermarks.Instagram,
    color: '#E1306C',
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: '@zandyka',
    subtitle: 'Code Repositories',
    href: 'https://github.com/zandyka',
    icon: Github,
    iconBg: 'var(--surface-2)',
    iconColor: 'var(--text)',
    Watermark: Watermarks.GitHub,
    color: 'var(--accent)',
  },
];

// ROW 2: Email, Spotify, Discord
const ROW_2_CHANNELS = [
  {
    id: 'email',
    name: 'Email',
    handle: 'zackyandyka1@gmail.com',
    subtitle: 'Official Inquiries',
    href: 'mailto:zackyandyka1@gmail.com',
    icon: Mail,
    iconBg: 'var(--accent-dim)',
    iconColor: 'var(--accent)',
    Watermark: Watermarks.Mail,
    color: 'var(--accent)',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    handle: 'zndyka',
    subtitle: 'Focus & Coding Playlist',
    href: 'https://open.spotify.com/',
    icon: Music,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#1DB954',
    Watermark: Watermarks.Spotify,
    color: '#1DB954',
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'tenpenci',
    subtitle: 'Dev Community & Voice',
    copy: 'tenpenci', // tidak ada tautan profil publik → kartu menyalin username
    icon: Gamepad2,
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: '#5865F2',
    Watermark: Watermarks.Discord,
    color: '#5865F2',
  },
];

const COPIES = 4; // jumlah salinan isi baris agar loop terasa tak berujung
const MAX_TURN = 26; // derajat putar kartu di tepi (efek sabuk melengkung)

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
};

const SocialCard = ({ item, wasDrag }) => {
  const { playHover, playClick } = useSoundContext();
  const tilt = useTilt({ max: 9, glare: 0.2 });
  const [copied, setCopied] = useState(false);
  const Icon = item.icon;
  const Watermark = item.Watermark;
  const isCopy = Boolean(item.copy);

  const onClick = (e) => {
    // seretan pada baris tidak boleh dianggap klik
    if (wasDrag()) {
      e.preventDefault();
      return;
    }
    playClick();
    if (isCopy) {
      e.preventDefault();
      copyText(item.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const Tag = isCopy ? motion.button : motion.a;
  const linkProps = isCopy
    ? { type: 'button', 'aria-label': `Salin username ${item.name} ${item.handle}` }
    : { href: item.href, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <Tag
      {...linkProps}
      {...tilt.handlers}
      onClick={onClick}
      onMouseEnter={playHover}
      draggable={false}
      className="social-channel-card"
      style={{ '--sm-color': item.color, ...tilt.style }}
    >
      <motion.span style={tilt.glareStyle} aria-hidden="true" />

      {/* Watermark logo besar di belakang */}
      <div className="watermark-wrapper" aria-hidden="true">
        <Watermark />
      </div>

      {/* Ikon + nama + handle */}
      <div className="sm-top">
        <div
          className="sm-icon"
          style={{
            background: item.iconBg,
            border: item.iconBg === '#ffffff' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            color: item.iconColor,
          }}
        >
          <Icon size={24} />
        </div>
        <div className="sm-text">
          <span className="sm-name">{item.name}</span>
          <span className="sm-handle">{item.handle}</span>
        </div>
      </div>

      <div className="sm-divider" />

      <div className="sm-bottom">
        <span className="connect-label">{isCopy ? (copied ? 'Tersalin!' : 'Salin username') : 'Connect'}</span>
        <div className="connect-icon">{isCopy ? copied ? <Check size={16} /> : <Copy size={15} /> : <ArrowUpRight size={16} />}</div>
      </div>
    </Tag>
  );
};

/**
 * Satu baris kartu yang berjalan. Digerakkan per frame (bukan animasi CSS) supaya bisa:
 *  - ikut kecepatan & arah scroll halaman (makin cepat menggulir, makin cepat berjalan + sedikit miring),
 *  - melambat halus sampai berhenti saat di-hover, lalu jalan lagi,
 *  - diseret (mouse / jari) lalu meluncur dengan inersia,
 *  - melengkung seperti sabuk 3D: kartu di tepi berputar menjauh dan mengecil.
 */
function MarqueeRow({ items, direction, speed, scrollVelocity, rowIndex }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const slotRefs = useRef([]);
  const m = useRef({
    offset: rowIndex * 140,
    hover: 1, // 1 = jalan penuh, 0 = berhenti
    hovered: false,
    dragging: false,
    dragMoved: 0,
    lastX: 0,
    lastT: 0,
    inertia: 0,
    skew: 0,
    step: 0, // lebar satu kartu + jarak
    setWidth: 0, // lebar satu salinan isi
    viewW: 0,
    justDragged: false,
  });
  const repeated = Array.from({ length: COPIES }, () => items).flat();

  // ukur sekali (dan saat ukuran berubah) — tidak membaca layout tiap frame
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = slotRefs.current[0];
      const second = slotRefs.current[1];
      if (!track || !first || !second) return;
      m.current.step = second.offsetLeft - first.offsetLeft;
      m.current.setWidth = m.current.step * items.length;
      m.current.viewW = viewportRef.current.clientWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [items.length]);

  useAnimationFrame((_, delta) => {
    const s = m.current;
    if (!s.setWidth || !trackRef.current) return;
    const dt = Math.min(delta, 64) / 1000;

    // berhenti halus saat di-hover
    s.hover += ((s.hovered ? 0 : 1) - s.hover) * Math.min(1, dt * 5);

    // kecepatan scroll halaman → dorongan & arah
    const v = scrollVelocity.get();
    const boost = Math.min(Math.abs(v) / 900, 5);
    const flow = v < -40 ? -1 : 1; // menggulir ke atas membalik arah
    if (!s.dragging) {
      s.offset += -direction * flow * speed * (1 + boost) * s.hover * dt;
      s.offset += s.inertia * dt;
      s.inertia *= Math.pow(0.04, dt); // meluruh cepat
    }
    s.skew += (Math.max(-7, Math.min(7, -v / 260)) - s.skew) * Math.min(1, dt * 8);

    const wrapped = ((s.offset % s.setWidth) + s.setWidth) % s.setWidth;
    trackRef.current.style.transform = `translate3d(${-wrapped}px,0,0) skewX(${s.skew}deg)`;

    // sabuk melengkung 3D, dihitung dari posisi (tanpa getBoundingClientRect)
    const half = s.viewW / 2;
    const cardW = s.step;
    slotRefs.current.forEach((slot, i) => {
      if (!slot) return;
      const center = i * s.step + cardW / 2 - wrapped;
      const n = Math.max(-1.6, Math.min(1.6, (center - half) / half));
      const a = Math.abs(n);
      slot.style.transform = `rotateY(${-n * MAX_TURN}deg) translateZ(${-a * 40}px) scale(${1 - Math.min(a, 1) * 0.07})`;
      slot.style.opacity = String(Math.max(0, 1 - Math.max(0, a - 0.85) * 1.8));
    });
  });

  // ---- seret ----
  const onPointerDown = (e) => {
    const s = m.current;
    s.dragging = true;
    s.dragMoved = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.inertia = 0;
  };
  const onPointerMove = (e) => {
    const s = m.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const now = performance.now();
    s.offset -= dx;
    s.dragMoved += Math.abs(dx);
    s.inertia = (-dx / Math.max(1, now - s.lastT)) * 1000;
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const endDrag = () => {
    const s = m.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.justDragged = s.dragMoved > 6;
    s.inertia = Math.max(-2500, Math.min(2500, s.inertia));
    setTimeout(() => (s.justDragged = false), 0);
  };
  const wasDrag = () => m.current.justDragged || m.current.dragMoved > 6;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction * -120 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: rowIndex * 0.12 }}
    >
      <div
        ref={viewportRef}
        className="sm-viewport"
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') m.current.hovered = true;
        }}
        onPointerLeave={() => {
          m.current.hovered = false;
          endDrag();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="sm-track">
          {repeated.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              ref={(el) => (slotRefs.current[idx] = el)}
              className="sm-slot"
              aria-hidden={idx >= items.length || undefined}
            >
              <SocialCard item={item} wasDrag={wasDrag} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Tanpa gerak (pengguna memilih "kurangi gerakan"): baris biasa yang bisa digeser.
function StaticRow({ items }) {
  return (
    <div className="sm-static">
      {items.map((item) => (
        <div key={item.id} className="sm-slot">
          <SocialCard item={item} wasDrag={() => false} />
        </div>
      ))}
    </div>
  );
}

export default function SocialMarquee() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(useVelocity(scrollY), { stiffness: 260, damping: 50 });

  return (
    <div className="social-marquee-section">
      {reduce ? (
        <>
          <StaticRow items={ROW_1_CHANNELS} />
          <StaticRow items={ROW_2_CHANNELS} />
        </>
      ) : (
        <>
          <MarqueeRow items={ROW_1_CHANNELS} direction={-1} speed={34} scrollVelocity={scrollVelocity} rowIndex={0} />
          <MarqueeRow items={ROW_2_CHANNELS} direction={1} speed={28} scrollVelocity={scrollVelocity} rowIndex={1} />
        </>
      )}

      <style>{`
        .social-marquee-section { display: flex; flex-direction: column; gap: 16px; width: 100%; }

        .sm-viewport {
          overflow: hidden;
          perspective: 1100px;
          padding: 14px 0;
          cursor: grab;
          touch-action: pan-y;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
        }
        .sm-viewport:active { cursor: grabbing; }
        /* track tembus klik: kartu yang terdorong ke belakang (translateZ negatif) tetap bisa diklik */
        .sm-track { display: flex; gap: 16px; width: max-content; transform-style: preserve-3d; will-change: transform; pointer-events: none; }
        .sm-slot { flex-shrink: 0; transform-style: preserve-3d; will-change: transform, opacity; pointer-events: auto; }
        .sm-static { display: flex; gap: 14px; overflow-x: auto; padding: 8px 16px; scrollbar-width: none; }

        .social-channel-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 270px;
          height: 140px;
          padding: 15px 17px;
          border-radius: 20px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          box-shadow: 0 8px 28px var(--shadow-color);
          color: inherit;
          font: inherit;
          text-align: left;
          text-decoration: none;
          overflow: hidden;
          user-select: none;
          -webkit-user-drag: none;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .social-channel-card:hover {
          border-color: var(--accent-border);
          background: var(--surface-2);
          box-shadow: 0 18px 44px var(--shadow-color), 0 0 26px var(--accent-glow);
        }
        .watermark-wrapper {
          position: absolute;
          right: -14px;
          bottom: -18px;
          width: 135px;
          height: 135px;
          opacity: 0.075;
          color: var(--text);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease;
        }
        .social-channel-card:hover .watermark-wrapper { opacity: 0.2; color: var(--sm-color); transform: scale(1.12) rotate(-8deg); }

        .sm-top { position: relative; z-index: 1; display: flex; align-items: center; gap: 14px; }
        .sm-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .social-channel-card:hover .sm-icon { transform: scale(1.12) rotate(-6deg); }
        .sm-text { display: flex; flex-direction: column; min-width: 0; }
        .sm-name { font-size: 1.1rem; font-weight: 700; color: var(--text); letter-spacing: -0.01em; line-height: 1.25; }
        .sm-handle {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sm-divider { position: relative; z-index: 1; height: 1px; background: var(--border); margin: 10px 0 6px; }
        .sm-bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
        .connect-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }
        .connect-icon { color: var(--text-muted); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease; }
        .social-channel-card:hover .connect-label,
        .social-channel-card:hover .connect-icon { color: var(--accent); }
        .social-channel-card:hover .connect-icon { transform: translate(3px, -3px); }

        @media (max-width: 640px) {
          .social-channel-card { width: 236px; height: 128px; padding: 12px 14px; border-radius: 18px; }
          .sm-track { gap: 12px; }
        }
      `}</style>
    </div>
  );
}
