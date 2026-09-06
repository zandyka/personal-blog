import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Blocks, Ghost, ArrowRight, Terminal } from 'lucide-react';
import HandSpeakDemo from '../components/handspeak/HandSpeakDemo';
import { useSoundContext } from '../components/ui/SoundProvider';

const ARCADE_EXPERIMENTS = [
  {
    id: 'pacman',
    title: 'Pacman Retro Classic',
    category: 'Arcade Game',
    icon: Ghost,
    accent: '#facc15',
    status: 'Sedang Dikembangkan',
    description:
      'Petualangan labirin klasik dengan navigasi keyboard dan virtual D-pad. Menggunakan physics engine ringan 60 FPS dan audio synthesizer chiptune retro.',
    badge: 'Coming Soon',
  },
  {
    id: 'tetris',
    title: 'Tetris Matrix Arcade',
    category: 'Puzzle Game',
    icon: Blocks,
    accent: '#38bdf8',
    status: 'Sedang Dikembangkan',
    description:
      'Tantangan susun balok tetromino geometris dengan peningkatan kecepatan bertahap, sistem scoring garis ganda, dan particle burst saat clear line.',
    badge: 'Coming Soon',
  },
  {
    id: 'gesture-game',
    title: 'BISINDO Speed Quiz',
    category: 'AI Interactive Game',
    icon: Sparkles,
    accent: '#a855f7',
    status: 'Konsep Prototipe',
    description:
      'Permainan interaktif menebak dan memperagakan postur gestur alfabet BISINDO langsung di depan kamera webcam dengan sistem timer dan XP leaderboard.',
    badge: 'Planned',
  },
];

export default function PlaygroundPage() {
  const { playHover } = useSoundContext();

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

  return (
    <div className="page-container" style={{ paddingBottom: '90px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Section 1: Hero Header */}
        <section
          style={{
            padding: '120px 20px 48px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
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

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                fontWeight: 900,
                color: 'var(--text)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: '0 0 16px',
              }}
            >
              The Playground<span style={{ color: 'var(--accent)' }}>.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.12rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                margin: '0 auto',
              }}
            >
              Laboratorium eksperimen teknologi interaktif, pengujian model kecerdasan buatan berbasis komputer visi secara on-device, dan ruang bermain mini-games.
            </motion.p>
          </div>
        </section>

        {/* Section 2: Featured Interactive Experience — HandSpeak AI */}
        <section id="handspeak" style={{ padding: '0 20px 64px' }}>
          <HandSpeakDemo />
        </section>

        {/* Section 3: Arcade Mini-Games Preview (Coming Soon) */}
        <section
          style={{
            padding: '64px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
          }}
        >
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'var(--text-dim)',
                  marginBottom: '8px',
                }}
              >
                <Terminal size={14} />
                <span>Next Releases</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  margin: '0 0 8px',
                }}
              >
                Arcade &amp; Mini-Games
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Eksperimen game klasik dan interaktif yang sedang dirancang untuk meramaikan Playground ini.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {ARCADE_EXPERIMENTS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    onMouseEnter={playHover}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '24px',
                      boxShadow: '0 4px 20px var(--shadow-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div>
                      {/* Top Header & Tag */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: `${item.accent}15`,
                            border: `1px solid ${item.accent}30`,
                            color: item.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={20} />
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: 'var(--surface-2)',
                            color: item.accent,
                            border: '1px solid var(--border)',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {item.category}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: '4px 0 10px' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: '20px',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: 'var(--text-dim)',
                        fontWeight: 600,
                      }}
                    >
                      <span>Status: {item.status}</span>
                      <ArrowRight size={14} style={{ color: item.accent }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}