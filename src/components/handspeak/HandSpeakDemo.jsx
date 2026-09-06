import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Sparkles,
  Zap,
  RotateCcw,
  Delete,
  Copy,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useHandSpeakAI } from './useHandSpeakAI';
import { BISINDO_WORD_LABELS_38 } from './labels';
import { useSoundContext } from '../ui/SoundProvider';
import KamusFloatingModal from './KamusFloatingModal';

const BISINDO_QUICK_TIPS = [
  { letter: 'A', desc: 'Kepalkan tangan, ibu jari tegak di samping jari telunjuk.' },
  { letter: 'B', desc: 'Buka 4 jari tegak rapat ke atas, tekuk ibu jari di depan telapak.' },
  { letter: 'C', desc: 'Lengkungkan seluruh jari menyerupai huruf C.' },
  { letter: 'D', desc: 'Jari telunjuk tegak ke atas, 3 jari lain menyentuh ujung ibu jari.' },
  { letter: 'I', desc: 'Kepalkan tangan, hanya jari kelingking tegak ke atas.' },
  { letter: 'L', desc: 'Bentuk huruf L menggunakan ibu jari dan jari telunjuk tegak.' },
  { letter: 'V', desc: 'Tegakkan jari telunjuk dan jari tengah membentuk huruf V (peace).' },
  { letter: 'W', desc: 'Tegakkan jari telunjuk, tengah, dan manis membentuk huruf W.' },
  { letter: 'Y', desc: 'Tegakkan ibu jari dan kelingking, 3 jari tengah ditekuk (hang loose).' },
];

export default function HandSpeakDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { playClick, playHover } = useSoundContext();
  const [showGuide, setShowGuide] = useState(false);
  const [showKamus, setShowKamus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cameraFit, setCameraFit] = useState('contain'); // 'contain' prevents cropping/zooming on mobile front cameras

  const {
    mode,
    isModelLoading,
    isModelReady,
    isCameraActive,
    error,
    currentLetter,
    currentPrediction,
    confidence,
    feedback,
    accumulatedText,
    detectedHandsCount,
    showSkeleton,
    switchMode,
    startCamera,
    stopCamera,
    toggleSkeleton,
    clearText,
    addSpace,
    backspace,
  } = useHandSpeakAI(videoRef, canvasRef);

  const handleCopy = () => {
    if (!accumulatedText) return;
    navigator.clipboard.writeText(accumulatedText);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="handspeak-card-container"
      style={{
        width: '100%',
        maxWidth: '1040px',
        margin: '0 auto',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '28px',
        padding: 'clamp(20px, 4vw, 36px)',
        boxShadow: '0 12px 40px var(--shadow-color)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header: Clean, modern agency-grade bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--border)',
        }}
        className="handspeak-header"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.35rem, 3.2vw, 1.85rem)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            HandSpeak — Real-Time BISINDO
          </h2>

          {/* Controls: Mode Switcher & Kamus / Kosakata Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
            className="handspeak-header-controls"
          >
            {/* Dual-Mode Selector Tabs (Huruf vs Kosakata) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px',
                background: 'var(--surface-2)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <button
                onClick={() => {
                  playClick();
                  switchMode('letters');
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === 'letters' ? 'var(--accent)' : 'transparent',
                  color: mode === 'letters' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: mode === 'letters' ? '0 2px 10px var(--accent-glow)' : 'none',
                }}
              >
                <span>🔤</span>
                <span>Huruf</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  switchMode('words');
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === 'words' ? 'var(--accent)' : 'transparent',
                  color: mode === 'words' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: mode === 'words' ? '0 2px 10px var(--accent-glow)' : 'none',
                }}
              >
                <span>💬</span>
                <span>Kosakata</span>
              </button>
            </div>

            {/* Kamus Floating Modal Toggle (Mode Huruf) & Quick Guide Toggle (Mode Kosakata) */}
            {mode === 'letters' ? (
              <button
                onClick={() => {
                  playClick();
                  setShowKamus(!showKamus);
                }}
                onMouseEnter={playHover}
                title="Buka Kamus Gestur Alfabet BISINDO A–Z"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  background: showKamus ? 'var(--accent)' : 'var(--surface-2)',
                  border: `1px solid ${showKamus ? 'var(--accent)' : 'var(--border)'}`,
                  color: showKamus ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: showKamus ? '0 2px 10px var(--accent-glow)' : 'none',
                }}
              >
                <BookOpen size={14} />
                <span>{showKamus ? 'Tutup Kamus' : 'Kamus BISINDO (A–Z)'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playClick();
                  setShowGuide(!showGuide);
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  background: showGuide ? 'var(--accent)' : 'var(--surface-2)',
                  border: `1px solid ${showGuide ? 'var(--accent)' : 'var(--border)'}`,
                  color: showGuide ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <HelpCircle size={14} />
                <span>{showGuide ? 'Tutup Daftar' : 'Daftar 38 Kosakata'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Catatan Khusus Penggunaan Smartphone (Patah-patah / Shuttering) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          marginTop: '16px',
        }}
        className="handspeak-shuttering-note"
      >
        <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.8rem', lineHeight: 1.55 }}>
          <strong style={{ color: '#fbbf24', display: 'inline' }}>
            Catatan Penggunaan di HP:{' '}
          </strong>
          <span style={{ color: 'var(--text-muted)' }}>
            Seluruh deteksi sendi tangan dan inferensi AI berjalan 100% lokal (*on-device*) di browser. Penggunaan pada perangkat HP dapat mengalami performa <strong style={{ color: '#fbbf24' }}>patah-patah / shuttering</strong> karena keterbatasan daya komputasi prosesor smartphone. Untuk pengalaman responsif dan mulus di 60 FPS, sangat disarankan menggunakan laptop atau PC.
          </span>
        </div>
      </div>

      {/* Collapsible Gesture Quick Tips Guide & Vocabulary Words */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '18px',
                padding: '18px',
                borderRadius: '16px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              {mode === 'letters' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tips Gestur Huruf BISINDO yang Paling Mudah Dicoba:
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {BISINDO_QUICK_TIPS.map((tip) => (
                      <div
                        key={tip.letter}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'var(--accent-dim)',
                            border: '1px solid var(--accent-border)',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            flexShrink: 0,
                          }}
                        >
                          {tip.letter}
                        </div>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {tip.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Daftar 38 Kosakata BISINDO yang Didukung Model:
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {BISINDO_WORD_LABELS_38.map((word) => {
                      const isMatch = (currentPrediction || currentLetter) === word;
                      return (
                        <span
                          key={word}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '10px',
                            background: isMatch ? 'var(--accent)' : 'var(--surface)',
                            border: `1px solid ${isMatch ? 'var(--accent)' : 'var(--border)'}`,
                            color: isMatch ? '#ffffff' : 'var(--text)',
                            fontWeight: isMatch ? 700 : 500,
                            fontSize: '0.78rem',
                            fontFamily: "'Space Grotesk', monospace",
                            transition: 'all 0.15s ease',
                            boxShadow: isMatch ? '0 2px 8px var(--accent-glow)' : 'none',
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert Box */}
      {error && (
        <div
          style={{
            marginTop: '18px',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span style={{ lineHeight: 1.5 }}>{error}</span>
          </div>

          <button
            onClick={() => {
              playClick();
              startCamera();
            }}
            onMouseEnter={playHover}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Coba Buka Kamera Lagi
          </button>
        </div>
      )}

      {/* Main Grid: Camera Viewport (Left) vs Controls & Predictions (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          marginTop: '24px',
          alignItems: 'start',
        }}
        className="handspeak-main-grid"
      >
        {/* Left Column: Camera Viewport */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            className="handspeak-camera-viewport"
            style={{
              position: 'relative',
              width: '100%',
              background: '#070709',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1.5px solid var(--border)',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Live Video Stream (Mirror) */}
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: cameraFit,
                transform: 'scaleX(-1)', // Front-camera mirror
                display: isCameraActive ? 'block' : 'none',
              }}
            />

            {/* Skeleton Overlay Canvas */}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: cameraFit,
                transform: 'scaleX(-1)', // Match video mirror
                pointerEvents: 'none',
                display: isCameraActive ? 'block' : 'none',
              }}
            />

            {/* Inactive Camera Placeholder */}
            {!isCameraActive && (
              <div
                onClick={() => {
                  playClick();
                  startCamera();
                }}
                onMouseEnter={playHover}
                style={{
                  textAlign: 'center',
                  padding: '28px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'var(--surface-2)',
                    border: '1.5px solid var(--accent-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    boxShadow: '0 4px 20px var(--accent-glow)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <Camera size={30} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--text)', fontSize: '1.05rem', fontWeight: 800 }}>
                    Kamera Belum Aktif
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
                    Tekan tombol untuk mengizinkan kamera browser dan deteksi gestur BISINDO secara real-time.
                  </p>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 22px',
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px var(--accent-glow)',
                    marginTop: '4px',
                  }}
                >
                  <Camera size={15} />
                  <span>Buka Kamera</span>
                </div>
              </div>
            )}

            {/* Live Indicator Badges (Top-Left) */}
            {isCameraActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    background: 'rgba(7, 7, 11, 0.72)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 8px #34d399',
                    }}
                  />
                  <span>LIVE</span>
                </div>

                {detectedHandsCount > 0 && (
                  <div
                    style={{
                      background: 'rgba(7, 7, 11, 0.72)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '5px 11px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    {detectedHandsCount} Tangan
                  </div>
                )}
              </div>
            )}

            {/* In-Camera Top-Right Transparent HUD Overlay for Real-Time Prediction & Confidence */}
            {isCameraActive && (
              <div
                className="handspeak-hud-overlay"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  background: 'rgba(7, 7, 11, 0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '16px',
                  padding: '8px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '2px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none',
                  minWidth: '84px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    {mode === 'letters' ? 'Huruf' : 'Kata'}
                  </span>
                  {confidence >= 0.7 && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#34d399',
                        boxShadow: '0 0 8px #34d399',
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    fontSize: (currentPrediction || currentLetter || '-').length > 8
                      ? '1.2rem'
                      : (currentPrediction || currentLetter || '-').length > 4
                      ? '1.65rem'
                      : '2.5rem',
                    fontWeight: 900,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: confidence >= 0.75 ? '#34d399' : 'var(--accent)',
                    lineHeight: 1.05,
                    textAlign: 'right',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {currentPrediction || currentLetter || '-'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', width: '100%' }}>
                  <div
                    style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      minWidth: '38px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(confidence * 100, 100)}%`,
                        background: confidence >= 0.75 ? '#34d399' : 'var(--accent)',
                        borderRadius: '999px',
                        transition: 'width 0.15s ease, background 0.2s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: confidence >= 0.75 ? '#34d399' : 'var(--text-muted)',
                      lineHeight: 1,
                    }}
                  >
                    {(confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls & Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Main Action Button */}
            {!isCameraActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    playClick();
                    startCamera();
                  }}
                  onMouseEnter={playHover}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 22px',
                    borderRadius: '14px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px var(--accent-glow)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Camera size={16} />
                  <span>Buka Kamera</span>
                </button>

                {isModelLoading && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.76rem',
                      color: 'var(--text-muted)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        border: '2px solid var(--accent)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Memuat Model AI...</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  playClick();
                  stopCamera();
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 20px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <CameraOff size={16} />
                <span>Tutup Kamera</span>
              </button>
            )}

            {/* Skeleton Overlay Toggle */}
            {isCameraActive && (
              <button
                onClick={() => {
                  playClick();
                  toggleSkeleton();
                }}
                onMouseEnter={playHover}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  background: showSkeleton ? 'var(--accent-dim)' : 'var(--surface-2)',
                  border: `1px solid ${showSkeleton ? 'var(--accent-border)' : 'var(--border)'}`,
                  color: showSkeleton ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showSkeleton ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{showSkeleton ? 'Skeleton Aktif' : 'Skeleton Mati'}</span>
              </button>
            )}

            {/* Camera Zoom FOV Toggle */}
            {isCameraActive && (
              <button
                onClick={() => {
                  playClick();
                  setCameraFit(cameraFit === 'contain' ? 'cover' : 'contain');
                }}
                onMouseEnter={playHover}
                title={cameraFit === 'contain' ? 'Ubah ke Mode Penuh (Zoom)' : 'Ubah ke Mode Normal (Tidak Zoom)'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 13px',
                  borderRadius: '12px',
                  background: cameraFit === 'contain' ? 'var(--accent-dim)' : 'var(--surface-2)',
                  border: `1px solid ${cameraFit === 'contain' ? 'var(--accent-border)' : 'var(--border)'}`,
                  color: cameraFit === 'contain' ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cameraFit === 'contain' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span>{cameraFit === 'contain' ? 'Zoom: Normal (Fit)' : 'Zoom: Penuh'}</span>
              </button>
            )}

            {/* Status Feedback Text */}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {feedback}
            </span>
          </div>
        </div>

        {/* Right Column: Spelled Words & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Accumulated Spelled Words Output */}
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Teks Tersusun
              </span>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => {
                    playClick();
                    addSpace();
                  }}
                  onMouseEnter={playHover}
                  title="Tambah Spasi"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  Spasi
                </button>
                <button
                  onClick={() => {
                    playClick();
                    backspace();
                  }}
                  onMouseEnter={playHover}
                  title="Hapus Satu Huruf"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <Delete size={13} style={{ verticalAlign: 'middle' }} />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    clearText();
                  }}
                  onMouseEnter={playHover}
                  title="Bersihkan Seluruh Teks"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <RotateCcw size={13} style={{ verticalAlign: 'middle' }} />
                </button>
              </div>
            </div>

            {/* Word Display Box */}
            <div
              style={{
                minHeight: '84px',
                padding: '16px 18px',
                borderRadius: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '1px',
                  fontFamily: "'JetBrains Mono', monospace",
                  wordBreak: 'break-word',
                  flex: 1,
                }}
              >
                {accumulatedText || (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 400, fontFamily: 'inherit' }}>
                    {mode === 'letters'
                      ? 'Tahan gestur huruf selama ~0.9 detik untuk menyusun kata...'
                      : 'Tahan gestur kata selama ~0.9 detik untuk menyusun kalimat...'}
                  </span>
                )}
              </div>

              {accumulatedText && (
                <button
                  onClick={handleCopy}
                  title="Salin Teks"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: copied ? 'rgba(52, 211, 153, 0.15)' : 'var(--surface-2)',
                    border: `1px solid ${copied ? 'rgba(52, 211, 153, 0.3)' : 'var(--border)'}`,
                    color: copied ? '#34d399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              )}
            </div>
          </div>

          {/* Helpful Mini Guide Note */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span>
              {mode === 'letters'
                ? 'Posisikan satu tangan di depan kamera. Prediksi real-time dan akurasi tampil langsung di pojok kanan atas kamera.'
                : 'Peragakan salah satu dari 38 kosakata BISINDO. Model AI membaca sendi tangan 100% lokal on-device.'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Kamus BISINDO Modal */}
      <KamusFloatingModal isOpen={showKamus} onClose={() => setShowKamus(false)} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .handspeak-camera-viewport {
          aspect-ratio: 4 / 3;
        }
        @media (max-width: 768px) {
          .handspeak-card-container {
            padding: 14px 12px !important;
            border-radius: 22px !important;
          }
          .handspeak-main-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .handspeak-camera-viewport {
            aspect-ratio: 3 / 4 !important;
            width: 100% !important;
            max-height: 68vh !important;
            border-radius: 20px !important;
          }
          .handspeak-header {
            gap: 12px !important;
            padding-bottom: 14px !important;
          }
          .handspeak-header-controls {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
}