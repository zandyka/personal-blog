import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ringRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef()

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  useEffect(() => {
    if (isTouchDevice) return

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const onEnter = (e) => {
      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.dataset.cursor
      ) {
        setIsHovering(true)
      }
    }

    const onLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    // Smooth ring follow with RAF
    const animate = () => {
      ringRef.current.x += (pos.x - ringRef.current.x) * 0.12
      ringRef.current.y += (pos.y - ringRef.current.y) * 0.12
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [pos.x, pos.y, isTouchDevice])

  if (isTouchDevice) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderRadius: '50%',
          border: `1.5px solid var(--accent)`,
          pointerEvents: 'none',
          zIndex: 9998,
          transform: `translate(${ringRef.current.x - (isHovering ? 24 : 16)}px, ${ringRef.current.y - (isHovering ? 24 : 16)}px)`,
          opacity: isVisible ? (isHovering ? 0.8 : 0.4) : 0,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s, border-color 0.2s',
        }}
      />
    </>
  )
}
