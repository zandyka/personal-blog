import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Copy, Check, ArrowUpRight, Download, Linkedin, Github, Instagram, Clock } from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';
import { useTilt } from '../../hooks/useTilt';
import { profile } from '../../data/profile';

// Discord tidak punya tautan profil publik yang stabil → tombolnya menyalin username.
const DiscordIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18.2 18.2 0 0 0-5.6 0L8.6 3a19.5 19.5 0 0 0-4.9 1.4C.6 9 0 13.5.3 18a19.8 19.8 0 0 0 6 3l1.3-2a12.8 12.8 0 0 1-2-1l.5-.4a14 14 0 0 0 11.8 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.7 19.7 0 0 0 6-3c.4-5.2-.7-9.7-3.4-13.6ZM8.5 15.3c-1.2 0-2.1-1-2.1-2.3 0-1.2.9-2.3 2.1-2.3s2.2 1 2.1 2.3c0 1.2-.9 2.3-2.1 2.3Zm7 0c-1.2 0-2.1-1-2.1-2.3 0-1.2.9-2.3 2.1-2.3s2.2 1 2.1 2.3c0 1.2-.9 2.3-2.1 2.3Z" />
  </svg>
);

const CHANNELS = [
  { id: 'linkedin', name: 'LinkedIn', handle: '/in/zacky-andyka', icon: Linkedin, color: '#0A66C2', href: profile.linkedin },
  { id: 'github', name: 'GitHub', handle: '@zandyka', icon: Github, color: '#a1a1aa', href: 'https://github.com/zandyka' },
  { id: 'instagram', name: 'Instagram', handle: profile.instagramHandle, icon: Instagram, color: '#E1306C', href: profile.instagram },
  { id: 'discord', name: 'Discord', handle: 'tenpenci', icon: DiscordIcon, color: '#5865F2', copy: 'tenpenci' },
];

const jakartaNow = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
  const hour = Number(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Jakarta' })) % 24;
  let note = 'jam kerja, balasan biasanya cepat';
  if (hour >= 22 || hour < 6) note = 'sedang malam, balasan kemungkinan besok pagi';
  else if (hour >= 18) note = 'sudah sore, tetap dibaca hari ini';
  return { time, note };
};

const useCopy = () => {
  const [copied, setCopied] = useState(null);
  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // cadangan untuk browser tanpa Clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };
  return [copied, copy];
};

function ChannelTile({ channel, index, copied, onCopy }) {
  const { playHover, playClick } = useSoundContext();
  const tilt = useTilt({ max: 8, glare: 0.2 });
  const Icon = channel.icon;
  const isCopy = Boolean(channel.copy);
  const done = copied === channel.id;

  const inner = (
    <>
      <motion.span style={tilt.glareStyle} aria-hidden="true" />
      <span className="cc-tile__icon" style={{ color: channel.color, background: `${channel.color}1f` }}>
        <Icon width={18} height={18} size={18} />
      </span>
      <span className="cc-tile__text">
        <strong>{channel.name}</strong>
        <span>{done ? 'Username tersalin' : channel.handle}</span>
      </span>
      <span className="cc-tile__go" aria-hidden="true">
        {isCopy ? done ? <Check size={15} /> : <Copy size={14} /> : <ArrowUpRight size={15} />}
      </span>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.06 }}
      style={{ transformPerspective: 800 }}
    >
      {isCopy ? (
        <motion.button
          type="button"
          {...tilt.handlers}
          style={tilt.style}
          className="cc-tile"
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            onCopy(channel.id, channel.copy);
          }}
          aria-label={`Salin username ${channel.name} ${channel.handle}`}
        >
          {inner}
        </motion.button>
      ) : (
        <motion.a
          {...tilt.handlers}
          style={tilt.style}
          className="cc-tile"
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          {inner}
        </motion.a>
      )}
    </motion.div>
  );
}

export default function ContactChannels() {
  const { playHover, playClick } = useSoundContext();
  const [clock, setClock] = useState(jakartaNow);
  const [copied, copy] = useCopy();

  useEffect(() => {
    const id = setInterval(() => setClock(jakartaNow()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glassmorphic-card cc-panel">
      <span className="cc-label">Direct channels</span>
      <h2 className="cc-title">Hubungi langsung</h2>

      {/* Status ketersediaan */}
      <div className="cc-status">
        <span className="cc-status__dot" aria-hidden="true" />
        <div>
          <strong>Terbuka untuk peluang kerja &amp; kolaborasi</strong>
          <span>Biasanya membalas dalam &lt; 24 jam</span>
        </div>
      </div>
      <div className="cc-clock">
        <Clock size={13} />
        <span>
          Jakarta, <b>{clock.time} WIB</b> — {clock.note}
        </span>
      </div>

      {/* Email: saluran utama */}
      <div className="cc-email">
        <span className="cc-email__icon">
          <Mail size={18} />
        </span>
        <div className="cc-email__text">
          <span>Email</span>
          <strong>{profile.email}</strong>
        </div>
        <button
          type="button"
          className="cc-email__btn"
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            copy('email', profile.email);
          }}
          aria-label="Salin alamat email"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied === 'email' ? (
              <motion.span key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                <Check size={15} /> Tersalin
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                <Copy size={14} /> Salin
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <a
          className="cc-email__btn cc-email__btn--solid"
          href={`mailto:${profile.email}`}
          onMouseEnter={playHover}
          onClick={playClick}
        >
          Tulis email <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Saluran lain */}
      <div className="cc-grid">
        {CHANNELS.map((c, i) => (
          <ChannelTile key={c.id} channel={c} index={i} copied={copied} onCopy={copy} />
        ))}
      </div>

      <a className="cc-cv" href={profile.cvUrl} download onMouseEnter={playHover} onClick={playClick}>
        <Download size={16} /> Unduh CV (PDF)
      </a>

      {/* pengumuman untuk pembaca layar saat sesuatu tersalin */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Tersalin ke clipboard' : ''}
      </span>
    </div>
  );
}
