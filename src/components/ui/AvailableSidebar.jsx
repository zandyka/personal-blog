import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSoundContext } from './SoundProvider'

/**
 * AvailableSidebar component
 * A fixed sidebar tag on the left edge of the screen indicating work availability.
 *
 * @param {string} text - Optional custom text (default: 'AVAILABLE FOR WORK')
 * @param {string} className - Optional additional CSS classes
 * @param {React.CSSProperties} style - Optional additional inline styles
 * @param {() => void} onClick - Optional click handler
 */
export default function AvailableSidebar({
  text = 'AVAILABLE FOR WORK',
  className = '',
  style = {},
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false)

  let playHover = null
  try {
    const sound = useSoundContext()
    playHover = sound?.playHover
  } catch {
    playHover = null
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (playHover) {
      try {
        playHover()
      } catch {}
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .available-sidebar-root {
            display: none !important;
          }
        }
      `}</style>
      <aside
        className={`available-sidebar-root hide-mobile ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: isHovered ? 'translate(4px, -50%)' : 'translate(0, -50%)',
          zIndex: 50,
          backgroundColor: '#ffffff',
          color: '#0a0a0f',
          padding: '40px 14px',
          borderRadius: '0 16px 16px 0',
          boxShadow: isHovered
            ? '0 12px 36px rgba(0, 0, 0, 0.28)'
            : '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          ...style,
        }}
        aria-label={text}
      >
        {/* Pulsing green status indicator dot at the top */}
        <div
          style={{
            position: 'relative',
            width: 8,
            height: 8,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer radiating pulse wave */}
          <motion.span
            animate={{
              scale: [1, 2.4],
              opacity: [0.75, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              pointerEvents: 'none',
            }}
          />

          {/* Inner solid green dot with gentle pulse */}
          <motion.span
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'relative',
              display: 'block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
            }}
          />
        </div>

        {/* Vertical text */}
        <span
          style={{
            writingMode: 'vertical-rl',
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '4px',
            color: '#0a0a0f',
            lineHeight: 1,
          }}
        >
          {text}
        </span>
      </aside>
    </>
  )
}
