import useSound from 'use-sound'

/**
 * Custom hook that wraps use-sound with localStorage sound preference.
 * Returns a playSound(type) function. Silently fails if sound files are missing.
 *
 * @returns {{ playSound: (type: 'click' | 'hover' | 'whoosh' | 'success') => void }}
 */
export function useSoundEffect() {
  const soundEnabled = (() => {
    try {
      const stored = localStorage.getItem('soundEnabled')
      return stored === null ? true : stored === 'true'
    } catch {
      return false
    }
  })()

  const soundOptions = { volume: 0.4, soundEnabled }

  // Each hook call is unconditional (hooks rules) — sounds are simply muted when disabled
  const [playClick] = useSound('/sounds/click.mp3', { ...soundOptions, volume: 0.5 })
  const [playHover] = useSound('/sounds/hover.mp3', { ...soundOptions, volume: 0.2 })
  const [playWhoosh] = useSound('/sounds/whoosh.mp3', { ...soundOptions, volume: 0.4 })

  const playSound = (type) => {
    if (!soundEnabled) return
    try {
      switch (type) {
        case 'click':
          playClick()
          break
        case 'hover':
          playHover()
          break
        case 'whoosh':
          playWhoosh()
          break
        case 'success':
          // reuse whoosh for success if no dedicated file
          playWhoosh()
          break
        default:
          break
      }
    } catch {
      // silently fail if audio file is missing or AudioContext is blocked
    }
  }

  return { playSound }
}
