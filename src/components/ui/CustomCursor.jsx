import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const DOT = 8
const RING = 32
const RING_HOVER = 48

const isInteractive = (el) =>
  !!el?.closest?.('a, button, [data-cursor]')

export default function CustomCursor() {
  const location = useLocation()
  // Playground memakai TargetCursor sendiri, jadi kursor ini dimatikan di sana.
  const isPlayground = location.pathname.startsWith('/playground')

  const [finePointer, setFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const enabled = finePointer && !isPlayground

  // Dipasang ulang setiap kali `enabled` berubah, termasuk saat kembali dari Playground.
  useEffect(() => {
    if (!enabled) return undefined
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    const target = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let visible = false
    let hovering = false
    let seen = false
    let raf = 0

    const applyVisibility = () => {
      dot.style.opacity = visible ? '1' : '0'
      ring.style.opacity = visible ? (hovering ? '0.8' : '0.4') : '0'
    }

    const applyHover = () => {
      const size = hovering ? RING_HOVER : RING
      ring.style.width = `${size}px`
      ring.style.height = `${size}px`
      applyVisibility()
    }

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18
      ringPos.y += (target.y - ringPos.y) * 0.18
      const half = (hovering ? RING_HOVER : RING) / 2
      dot.style.transform = `translate3d(${target.x - DOT / 2}px, ${target.y - DOT / 2}px, 0)`
      ring.style.transform = `translate3d(${ringPos.x - half}px, ${ringPos.y - half}px, 0)`
      const settled = Math.abs(target.x - ringPos.x) + Math.abs(target.y - ringPos.y) < 0.1
      raf = settled ? 0 : requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      target.x = e.clientX
      target.y = e.clientY
      if (!seen) {
        // Gerakan pertama: langsung lompat ke posisi mouse, jangan meluncur dari posisi lama.
        ringPos.x = target.x
        ringPos.y = target.y
        seen = true
      }
      if (!visible) {
        visible = true
        applyVisibility()
      }
      const nextHover = isInteractive(e.target)
      if (nextHover !== hovering) {
        hovering = nextHover
        applyHover()
      }
      wake()
    }

    const onLeave = () => {
      visible = false
      seen = false
      applyVisibility()
    }

    applyHover()
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: DOT,
          height: DOT,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.2s',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: RING,
          height: RING,
          borderRadius: '50%',
          border: '1.5px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s, border-color 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
