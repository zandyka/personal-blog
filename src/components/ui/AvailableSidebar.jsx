import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  let playHover = null
  let playClick = null
  try {
    const sound = useSoundContext()
    playHover = sound?.playHover
    playClick = sound?.playClick
  } catch {
    playHover = null
    playClick = null
  }

  const handleClick = (e) => {
    if (playClick) {
      try { playClick() } catch {}
    }
    if (onClick) {
      onClick(e)
    } else {
      navigate('/contact')
    }
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
        @media (min-width: 860px) {
          .available-sidebar-root {
            display: flex !important;
            padding: 38px 13px !important;
            border-radius: 0 16px 16px 0 !important;
            top: 50% !important;
          }
          .available-text-desktop {
            display: block !important;
          }
          .available-text-mobile {
            display: none !important;
          }
          .available-dot-box {
            margin-bottom: 14px !important;
            width: 8px !important;
            height: 8px !important;
          }
          .available-dot-core {
            width: 8px !important;
            height: 8px !important;
          }
        }
        @media (max-width: 859px) {
          .available-sidebar-root {
            display: flex !important;
            padding: 12px 6px !important;
            border-radius: 0 10px 10px 0 !important;
            top: 38% !important;
            z-index: 950 !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
          }
          .available-text-desktop {
            display: none !important;
          }
          .available-text-mobile {
            display: block !important;
            writing-mode: vertical-rl !important;
            font-size: 7.5px !important;
            font-weight: 800 !important;
            letter-spacing: 2px !important;
            text-transform: uppercase !important;
            color: #0a0a0f !important;
            line-height: 1 !important;
          }
          .available-dot-box {
            margin-bottom: 8px !important;
            width: 6px !important;
            height: 6px !important;
          }
          .available-dot-core {
            width: 5px !important;
            height: 5px !important;
          }
        }
      `}</style>
      <aside
        className={`available-sidebar-root ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: isHovered ? 'translate(3px, -50%)' : 'translate(0, -50%)',
          zIndex: 50,
          backgroundColor: '#ffffff',
          color: '#0a0a0f',
          padding: '38px 13px',
          borderRadius: '0 16px 16px 0',
          boxShadow: isHovered
            ? '0 12px 36px rgba(0, 0, 0, 0.28)'
            : '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          ...style,
        }}
        aria-label="Available Status"
      >
        {/* Pulsing green status indicator dot at the top */}
        <div
          className="available-dot-box"
          style={{
            position: 'relative',
            width: 8,
            height: 8,
            marginBottom: 14,
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
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              pointerEvents: 'none',
            }}
          />

          {/* Inner solid green dot */}
          <motion.span
            className="available-dot-core"
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

        {/* Desktop Vertical text */}
        <span
          className="available-text-desktop"
          style={{
            writingMode: 'vertical-rl',
            fontSize: '9.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '3.5px',
            color: '#0a0a0f',
            lineHeight: 1,
          }}
        >
          {text}
        </span>

        {/* Mobile Vertical text */}
        <span className="available-text-mobile">
          I'M ACTIVE
        </span>
      </aside>
    </>
  )
}
