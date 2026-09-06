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
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { useHandSpeakAI } from './useHandSpeakAI';
import { useSoundContext } from '../ui/SoundProvider';

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
  const [copied, setCopied] = useState(false);

  const {
    isModelLoading,
    isModelReady,
    isCameraActive,
    error,
    currentLetter,
    confidence,
    feedback,
    accumulatedText,
    detectedHandsCount,
    showSkeleton,
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
      {/* Top Header & Badges */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          paddingBottom: '22px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '999px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} />
              <span>Live In-Browser AI Demo</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                color: '#34d399',
                fontSize: '0.76rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={13} />
              <span>94.71% Akurasi Validasi</span>
            </div>
          </div>

          {/* Quick Guide Toggle */}
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
              padding: '6px 14px',
              borderRadius: '999px',
              background: showGuide ? 'var(--accent)' : 'var(--surface-2)',
              border: `1px solid ${showGuide ? 'var(--accent)' : 'var(--border)'}`,
              color: showGuide ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <HelpCircle size={14} />
            <span>{showGuide ? 'Tutup Panduan' : 'Panduan Gestur Huruf'}</span>
          </button>
        </div>

        <div>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: '0 0 6px',
            }}
          >
            HandSpeak — Real-Time BISINDO Translator
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '780px',
            }}
          >
            Ekstraksi 176 fitur koordinat 3D tangan dan inferensi model Dense Neural Network (TFLite) dieksekusi 100% lokal di browsermu melalui akselerasi WebAssembly &amp; WebGL tanpa mengirim rekaman video ke server.
          </p>
        </div>
      </div>

      {/* Collapsible Gesture Quick Tips Guide */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert Box */}
      {error && (
        <div
          style={{
            marginTop: '18px',
            padding: '14px 18px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
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
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              background: '#070709',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1.5px solid var(--border)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
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
                objectFit: 'cover',
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
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Match video mirror
                pointerEvents: 'none',
                display: isCameraActive ? 'block' : 'none',
              }}
            />

            {/* Inactive Camera Placeholder */}
            {!isCameraActive && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-dim)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    marginBottom: '4px',
                  }}
                >
                  <Camera size={30} />
                </div>
                <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1rem', fontWeight: 700 }}>
                  Kamera Belum Aktif
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
                  Tekan tombol <strong>Buka Kamera</strong> untuk mengizinkan web mendeteksi gestur tanganmu secara langsung.
                </p>
              </div>
            )}

            {/* Live Indicator Badges */}
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
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#34d399',
                      boxShadow: '0 0 10px #34d399',
                    }}
                  />
                  <span>LIVE AI</span>
                </div>

                {detectedHandsCount > 0 && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {detectedHandsCount} Tangan Terdeteksi
                  </div>
                )}
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
              <button
                onClick={() => {
                  playClick();
                  startCamera();
                }}
                disabled={isModelLoading || !isModelReady}
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
                  cursor: isModelLoading || !isModelReady ? 'not-allowed' : 'pointer',
                  opacity: isModelLoading || !isModelReady ? 0.6 : 1,
                  boxShadow: '0 4px 16px var(--accent-glow)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isModelLoading ? (
                  <>
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Memuat Model AI...</span>
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    <span>Buka Kamera</span>
                  </>
                )}
              </button>
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

            {/* Status Feedback Text */}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {feedback}
            </span>
          </div>
        </div>

        {/* Right Column: Prediction Box & Spelled Words */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Real-Time Predicted Letter */}
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Prediksi Huruf
              </span>
              <div
                style={{
                  fontSize: '4.2rem',
                  fontWeight: 900,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--accent)',
                  lineHeight: 1,
                  marginTop: '4px',
                }}
              >
                {currentLetter}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '130px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Confidence Score
              </span>
              <span
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px',
                }}
              >
                {(confidence * 100).toFixed(1)}%
              </span>

              {/* Progress meter bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '999px',
                  background: 'var(--border)',
                  overflow: 'hidden',
                  marginTop: '8px',
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
            </div>
          </div>

          {/* Card 2: Accumulated Spelled Words Output */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
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
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
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
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={13} style={{ verticalAlign: 'middle' }} />
                </button>
              </div>
            </div>

            {/* Word Display Box */}
            <div
              style={{
                minHeight: '76px',
                padding: '14px 16px',
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
                    Tahan gestur huruf selama ~0.6 detik untuk memasukkan huruf ke sini...
                  </span>
                )}
              </div>

              {accumulatedText && (
                <button
                  onClick={handleCopy}
                  title="Salin Teks"
                  style={{
                    padding: '7px',
                    borderRadius: '8px',
                    background: copied ? 'rgba(52, 211, 153, 0.15)' : 'var(--surface-2)',
                    border: `1px solid ${copied ? 'rgba(52, 211, 153, 0.3)' : 'var(--border)'}`,
                    color: copied ? '#34d399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              )}
            </div>
          </div>

          {/* Card 3: Technical Footnote Badge */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              fontSize: '0.78rem',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700 }}>
              <Cpu size={14} />
              <span>Pipeline Ekstraksi 176 Dimensi Scale-Invariant</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Deteksi 21 titik sendi 3D (MediaPipe) diproses menjadi vektor 176D (fitur spasial + 25 jarak geometris). Dieksekusi secara instan dengan frame-skipping selektif 100ms untuk performa stabil 60 FPS.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 860px) {
          .handspeak-main-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}