import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useSoundContext } from '../../ui/SoundProvider';
import { createGameAudio } from './audio';

// Mesin audio per game; mengikuti tombol suara global dan dibuang saat game ditutup.
// Yang dikembalikan adalah pembungkus stabil: mesin aslinya dibuat di dalam effect
// supaya aman terhadap pemasangan ganda StrictMode.
const AUDIO_METHODS = ['unlock', 'tone', 'noise', 'startEngine', 'setEngine', 'stopEngine', 'startMusic', 'stopMusic', 'setPaused'];

export function useGameAudio() {
  const { soundEnabled } = useSoundContext();
  const ref = useRef(null);
  const enabledRef = useRef(soundEnabled);
  const api = useMemo(() => {
    const out = {};
    AUDIO_METHODS.forEach((name) => {
      out[name] = (...args) => ref.current?.[name](...args);
    });
    return out;
  }, []);
  useEffect(() => {
    const audio = createGameAudio();
    audio.setEnabled(enabledRef.current);
    ref.current = audio;
    return () => {
      ref.current = null;
      audio.dispose();
    };
  }, []);
  useEffect(() => {
    enabledRef.current = soundEnabled;
    ref.current?.setEnabled(soundEnabled);
  }, [soundEnabled]);
  return api;
}

export function TopBar({ title, tag, paused, canPause, onPause, onExit }) {
  const { soundEnabled, toggleSound } = useSoundContext();
  return (
    <header className="gm-top">
      <div className="gm-top__brand">
        <span className="gm-top__dot" aria-hidden="true" />
        <div>
          <strong>{title}</strong>
          <span>{tag}</span>
        </div>
      </div>
      <div className="gm-top__actions">
        {canPause && (
          <button type="button" className="gm-icon" onClick={onPause} aria-label={paused ? 'Lanjutkan' : 'Jeda'} data-cursor-label={paused ? 'Lanjut' : 'Jeda'}>
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
        )}
        <button type="button" className="gm-icon" onClick={toggleSound} aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'} aria-pressed={soundEnabled} data-cursor-label="Suara">
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
        <button type="button" className="gm-icon gm-icon--close" onClick={onExit} aria-label="Tutup game" data-cursor-label="Tutup">
          <X size={18} />
        </button>
      </div>
    </header>
  );
}

// Teks melayang singkat (mis. "NEAR MISS +300"), ditulis langsung ke DOM supaya
// tidak memicu render ulang React di tengah permainan.
export function usePopups(max = 4) {
  const ref = useRef(null);
  const push = useCallback((text, kind = 'good') => {
    const host = ref.current;
    if (!host) return;
    const el = document.createElement('div');
    el.className = `gm-pop gm-pop--${kind}`;
    el.textContent = text;
    el.addEventListener('animationend', () => el.remove());
    if (kind === 'count') host.querySelectorAll('.gm-pop--count').forEach((n) => n.remove());
    host.appendChild(el);
    while (host.children.length > max) host.firstChild.remove();
  }, [max]);
  return [ref, push];
}

// Tombol sentuh yang ditahan (kemudi, nitro, dash)
export function HoldButton({ onHold, className = '', label, children }) {
  const set = (down) => (e) => {
    e.preventDefault();
    onHold(down);
  };
  return (
    <button
      type="button"
      className={`gm-touch ${className}`}
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        set(true)(e);
      }}
      onPointerUp={set(false)}
      onPointerCancel={set(false)}
      onLostPointerCapture={() => onHold(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export const formatInt = (n) => Math.floor(n).toLocaleString('id-ID');
