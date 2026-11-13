import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Gamepad2, Sparkles, Blocks, Cat, Joystick, RotateCcw, Play, CarFront, Crosshair, Keyboard, Smartphone } from 'lucide-react';
import HandSpeakDemo from '../components/handspeak/HandSpeakDemo';
import { useSoundContext } from '../components/ui/SoundProvider';
import TargetCursor from '../components/ui/TargetCursor';
import SwarmCursor from '../components/ui/SwarmCursor';
import { useSwarmEnabled } from '../lib/swarmStore';
import { ScrollReveal } from '../components/ui/ScrollMotion';
import ArcadePreview from '../components/playground/ArcadePreview';
import GameModal, { isGameId } from '../components/games/GameModal';
import '../components/playground/playground.css';

// Game yang sudah bisa dimainkan; dibuka di modal layar penuh (lihat GameModal).
const PLAYABLE_GAMES = [
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    category: 'Endless Racing · 3D',
    icon: CarFront,
    accent: '#22e6ff',
    accent2: '#ff3fa4',
    preview: 'drift',
    description:
      'Balapan tanpa akhir di jalan raya malam. Pilih supercar atau hypercar dan warna catnya, selip di antara lalu lintas, dan kumpulkan near miss untuk mengisi nitro.',
    tags: ['Three.js', '4 mobil · 8 warna', '4 suasana kota'],
  },
  {
    id: 'swarm-survivor',
    title: 'Swarm Survivor',
    category: 'Pixel Arena · Roguelite',
    icon: Crosshair,
    accent: '#5ef2ff',
    accent2: '#b47bff',
    preview: 'survivor',
    description:
      'Pilih salah satu dari tiga kucing situs ini, lalu berburu serangga di taman malam. Kumpulkan XP, rakit build dari 14 upgrade, dan hadapi bos setiap lima gelombang.',
    tags: ['Pixel art', '3 kucing', '14 upgrade'],
  },
];

// Arcade bergaya retro: tampilan pixel, layar tabung, dan suara chiptune.
const RETRO_GAMES = [
  {
    id: 'meong-maze',
    title: 'Meong Maze',
    category: 'Retro Maze Chase',
    icon: Cat,
    accent: '#ffd15c',
    accent2: '#ff8fc0',
    preview: 'maze',
    description:
      'Kejar-kejaran labirin: kucing situs ini memunguti remah ikan sambil dikejar robot penyedot debu. Catnip membuat robot korslet dan bisa diterkam.',
    tags: ['Pixel art', '4 robot', 'Terkaman kilat'],
  },
  {
    id: 'polyblok',
    title: 'Polyblok Matrix',
    category: 'Retro Block Puzzle',
    icon: Blocks,
    accent: '#7dffb2',
    accent2: '#4de1ff',
    preview: 'tetris',
    description:
      'Susun balok berisi satu sampai lima petak hingga barisnya penuh. Tiap baris mengisi meter Surge untuk menghapus tiga baris terbawah sekaligus.',
    tags: ['10 bentuk balok', 'Meter Surge', 'Makin cepat'],
  },
  {
    id: 'bisindo-quiz',
    title: 'BISINDO Speed Quiz',
    category: 'AI Interactive Game',
    icon: Sparkles,
    accent: '#c69bff',
    accent2: '#ffd15c',
    preview: 'quiz',
    description:
      'Kumpulkan XP dalam 60 detik: tebak huruf dari gambar isyaratnya, atau peragakan hurufnya di depan webcam dan biarkan AI HandSpeak yang menilai.',
    tags: ['2 mode', 'Webcam + AI', 'Pengali beruntun'],
    inputs: 'camera',
  },
];

function PlayableCard({ game, index, onPlay }) {
  const { playHover, playClick } = useSoundContext();
  const Icon = game.icon;
  const play = () => {
    playClick();
    onPlay(game.id);
  };

  return (
    <motion.article
      className="pg-play"
      data-swarm-build="box"
      style={{ '--pa': game.accent, '--pb': game.accent2 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseEnter={playHover}
    >
      <button type="button" className="pg-play__stage cursor-target" data-cursor-label="Mainkan" onClick={play} aria-label={`Mainkan ${game.title}`}>
        <ArcadePreview kind={game.preview} />
        <span className="pg-play__go" aria-hidden="true">
          <Play size={22} />
        </span>
        <span className="pg-play__live">
          <i /> Siap dimainkan
        </span>
      </button>
      <div className="pg-play__body">
        <div className="pg-play__head">
          <span className="pg-play__icon">
            <Icon size={20} />
          </span>
          <div>
            <span className="pg-play__cat">{game.category}</span>
            <h3 data-swarm-build="type">{game.title}</h3>
          </div>
        </div>
        <p>{game.description}</p>
        <ul className="pg-play__tags">
          {game.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="pg-play__foot">
          <span className="pg-play__input">
            <Keyboard size={14} /> Keyboard
            <Smartphone size={14} /> {game.inputs === 'camera' ? 'Sentuh · Kamera' : 'Sentuh'}
          </span>
          <button type="button" className="pg-play__cta cursor-target" data-cursor-label="Mainkan" onClick={play}>
            <Play size={15} /> Mainkan
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function PlaygroundPage() {
  const { playClick, playHover } = useSoundContext();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  // nyala/mati diatur dari tombol di navbar (pojok kanan atas)
  const swarmOn = useSwarmEnabled();
  const [replayKey, setReplayKey] = useState(0);

  // Game aktif disimpan di URL (?game=...) supaya bisa dibagikan dan tombol Back menutupnya.
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const openedHere = useRef(false);
  const requested = params.get('game');
  const gameId = isGameId(requested) ? requested : null;
  const openGame = useCallback(
    (id) => {
      openedHere.current = true;
      setParams({ game: id });
    },
    [setParams],
  );
  const closeGame = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      navigate(-1);
    } else {
      setParams({}, { replace: true });
    }
  }, [navigate, setParams]);

  useEffect(() => {
    if (window.location.hash === '#handspeak') {
      const el = document.getElementById('handspeak');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  // Sorotan kisi di hero mengikuti kursor (lewat variabel CSS, tanpa render ulang React).
  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div className="page-container pg-page">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />
      <SwarmCursor enabled={swarmOn && !gameId} replayKey={replayKey} root=".pg-page" />
      <GameModal gameId={gameId} onClose={closeGame} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* Section 1: Hero Header */}
        <section ref={heroRef} className="pg-hero" onPointerMove={onHeroMove}>
          <span className="pg-grid" aria-hidden="true" />
          <span className="pg-grid--lit" aria-hidden="true" />
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="cursor-target"
              data-cursor-label="Interactive Lab"
              data-swarm-build="box"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '16px',
              }}
            >
              <Gamepad2 size={16} />
              <span>Interactive Lab &amp; Experiments</span>
            </motion.div>

            <h1
              aria-label="The Playground."
              data-swarm-build="type"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                fontWeight: 900,
                color: 'var(--text)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: '0 auto 16px',
                width: 'fit-content', // caret mengetik sepanjang teks saja
              }}
            >
              {/* Judul muncul per huruf */}
              {'The Playground'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={reduce ? false : { opacity: 0, y: 40, rotateX: -80 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.035 }}
                  style={{ display: 'inline-block', whiteSpace: 'pre', transformPerspective: 600 }}
                >
                  {ch}
                </motion.span>
              ))}
              <motion.span
                aria-hidden="true"
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 0.7 }}
                style={{ display: 'inline-block', color: 'var(--accent)' }}
              >
                .
              </motion.span>
            </h1>

            <motion.p
              data-swarm-build="box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.12rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                margin: '0 auto',
              }}
            >
              Laboratorium eksperimen teknologi interaktif, pengujian model kecerdasan buatan berbasis komputer visi secara
              on-device, dan ruang bermain mini-games.
            </motion.p>

            <motion.div
              className="pg-hint"
              data-swarm-build="box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <span>
                Kawanan kursor membangun halaman ini saat Anda menggulir, lalu mengikuti <kbd>mouse</kbd>. Klik untuk
                menyebarkan; matikan lewat ikon kursor di pojok kanan atas.
              </span>
              {swarmOn && (
                <button
                  type="button"
                  className="pg-toggle cursor-target"
                  data-cursor-label="Putar ulang"
                  onClick={() => {
                    playClick();
                    // membangun ulang seluruh halaman dari atas
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setReplayKey((k) => k + 1);
                  }}
                  onMouseEnter={playHover}
                >
                  <RotateCcw size={14} /> Bangun ulang
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Section 2: Featured Interactive Experience — HandSpeak AI */}
        <section id="handspeak" style={{ padding: '0 20px 64px' }}>
          <HandSpeakDemo />
        </section>

        {/* Section 3: Game yang sudah bisa dimainkan */}
        <section id="games" style={{ padding: '64px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            <ScrollReveal from={60} scale={0.92} style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                data-swarm-build="box"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                }}
              >
                <Gamepad2 size={14} />
                <span>Playable Now</span>
              </div>
              <h2
                data-swarm-build="type"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  margin: '0 auto 8px',
                  width: 'fit-content',
                }}
              >
                Game Siap Main
              </h2>
              <p data-swarm-build="box" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Dibuat dari nol untuk Playground ini. Langsung main di browser, tanpa unduhan.
              </p>
            </ScrollReveal>

            <div className="pg-play-grid">
              {PLAYABLE_GAMES.map((game, i) => (
                <PlayableCard key={game.id} game={game} index={i} onPlay={openGame} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Arcade retro */}
        <section style={{ padding: '64px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            <ScrollReveal from={60} scale={0.92} style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                data-swarm-build="box"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                }}
              >
                <Joystick size={14} />
                <span>Retro Arcade</span>
              </div>
              <h2
                data-swarm-build="type"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  margin: '0 auto 8px',
                  width: 'fit-content',
                }}
              >
                Arcade &amp; Mini-Games
              </h2>
              <p data-swarm-build="box" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Tiga game bergaya retro: pixel art, layar tabung, dan suara chiptune.
              </p>
            </ScrollReveal>

            <div className="pg-play-grid pg-play-grid--three">
              {RETRO_GAMES.map((game, i) => (
                <PlayableCard key={game.id} game={game} index={i} onPlay={openGame} />
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
