import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Move,
} from 'lucide-react';
import { useSoundContext } from '../ui/SoundProvider';

export default function KamusFloatingModal({ isOpen, onClose }) {
  const { playClick, playHover } = useSoundContext();
  const [zoom, setZoom] = useState(1);
  const [sizeMode, setSizeMode] = useState('normal'); // 'compact' | 'normal' | 'large'

  if (!isOpen) return null;

  const sizeStyles = {
    compact: { width: '320px', height: '360px' },
    normal: { width: 'min(460px, 92vw)', height: 'min(500px, 75vh)' },
    large: { width: 'min(720px, 95vw)', height: 'min(750px, 88vh)' },
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.min(z + 0.25, 2.5));
    playClick();
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.max(z - 0.25, 0.75));
    playClick();
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setZoom(1);
    playClick();
  };

  const toggleSize = (e) => {
    e.stopPropagation();
    playClick();
    setSizeMode((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'compact' : 'normal'));
  };

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          ...sizeStyles[sizeMode],
          zIndex: 9999,
          background: 'var(--surface, #12121a)',
          border: '1.5px solid var(--accent-border, rgba(129, 140, 248, 0.3))',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(16px)',
          resize: 'both',
          minWidth: '280px',
          minHeight: '320px',
          maxWidth: '96vw',
          maxHeight: '92vh',
        }}
      >
        {/* Header Bar - Draggable Handle */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--surface-2, #1a1a26)',
            borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Move size={14} style={{ color: 'var(--accent, #818cf8)' }} />
            <BookOpen size={16} style={{ color: 'var(--accent, #818cf8)' }} />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text, #ffffff)',
                letterSpacing: '0.3px',
              }}
            >
              Kamus Gestur BISINDO (A–Z)
            </span>
          </div>

          {/* Header Controls: Zoom, Resize, Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleZoomOut}
              title="Perkecil Zoom"
              onMouseEnter={playHover}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                borderRadius: '6px',
                color: 'var(--text, #ffffff)',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ZoomOut size={13} />
            </button>

            <button
              onClick={handleReset}
              title="Reset Zoom (100%)"
              onMouseEnter={playHover}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                borderRadius: '6px',
                color: 'var(--text, #ffffff)',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <RotateCcw size={12} />
            </button>

            <button
              onClick={handleZoomIn}
              title="Perbesar Zoom"
              onMouseEnter={playHover}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                borderRadius: '6px',
                color: 'var(--text, #ffffff)',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ZoomIn size={13} />
            </button>

            <button
              onClick={toggleSize}
              title={sizeMode === 'normal' ? 'Mode Lebar' : sizeMode === 'large' ? 'Mode Ringkas' : 'Mode Standar'}
              onMouseEnter={playHover}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                borderRadius: '6px',
                color: 'var(--text, #ffffff)',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {sizeMode === 'large' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              title="Tutup Kamus"
              onMouseEnter={playHover}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#ef4444',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable Image Canvas Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: '#070709',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/handspeak/kamus_bisindo.jpg"
              alt="Kamus Alfabet BISINDO A-Z"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Floating Footer Tip */}
        <div
          style={{
            padding: '6px 12px',
            background: 'var(--surface-2, #1a1a26)',
            borderTop: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted, #94a3b8)',
          }}
        >
          <span>💡 Geser window &amp; perbesar/perkecil pojok kanan bawah</span>
          <span style={{ fontWeight: 600, color: 'var(--accent, #818cf8)' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}