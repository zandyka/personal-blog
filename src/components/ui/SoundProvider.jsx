import { createContext, useContext, useState, useCallback, useRef } from 'react'

const SoundContext = createContext(null)

function createAudioContext() {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || window.webkitAudioContext)()
  } catch {
    return null
  }
}

function playTone(ctx, frequency, duration, volume = 0.15, type = 'sine', sweep = false) {
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    if (sweep) {
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration)
    }
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('soundEnabled') ?? 'true')
    } catch {
      return true
    }
  })
  const audioCtxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!soundEnabled) return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext()
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [soundEnabled])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev
      localStorage.setItem('soundEnabled', JSON.stringify(next))
      return next
    })
  }, [])

  const playClick = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 880, 0.08, 0.18, 'sine')
  }, [getCtx])

  const playHover = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 440, 0.04, 0.09, 'sine')
  }, [getCtx])

  const playWhoosh = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 800, 0.18, 0.15, 'sine', true)
  }, [getCtx])

  const playSuccess = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 523, 0.1, 0.16, 'sine')
    setTimeout(() => playTone(ctx, 659, 0.1, 0.16, 'sine'), 100)
    setTimeout(() => playTone(ctx, 784, 0.15, 0.16, 'sine'), 200)
  }, [getCtx])

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick, playHover, playWhoosh, playSuccess }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundContext() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSoundContext must be inside SoundProvider')
  return ctx
}
