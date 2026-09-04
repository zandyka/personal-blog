import { useState, useEffect, useCallback } from 'react'

// Shared in-memory theme value initialized from DOM/localStorage
let currentTheme = typeof window !== 'undefined'
  ? (localStorage.getItem('theme') || (document.documentElement.classList.contains('light') ? 'light' : 'dark'))
  : 'dark'

const themeListeners = new Set()

export function useTheme() {
  const [theme, setThemeState] = useState(currentTheme)

  useEffect(() => {
    const handler = (newTheme) => {
      setThemeState(newTheme)
    }
    themeListeners.add(handler)
    return () => {
      themeListeners.delete(handler)
    }
  }, [])

  const toggleTheme = useCallback((event, transitionMode = 'crossfade') => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
    currentTheme = nextTheme
    localStorage.setItem('theme', nextTheme)
    themeListeners.forEach((listener) => listener(nextTheme))

    // Calculate coordinate origin (x, y) from event or trigger element
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    if (event) {
      if (typeof event.clientX === 'number' && typeof event.clientY === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
        x = event.clientX
        y = event.clientY
      } else if (event.currentTarget && event.currentTarget.getBoundingClientRect) {
        const rect = event.currentTarget.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
    }

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canUseViewTransition = !prefersReducedMotion && typeof document !== 'undefined' && typeof document.startViewTransition === 'function'

    // Fallback if View Transitions API is unsupported
    if (!canUseViewTransition || transitionMode === 'none') {
      document.documentElement.classList.toggle('light', nextTheme === 'light')
      return
    }

    // Option 2: Ultra-Smooth Crossfade & Ambient Dissolve (Active)
    if (transitionMode === 'crossfade') {
      document.documentElement.setAttribute('data-theme-transition', 'crossfade')
      document.documentElement.classList.add('no-transitions')

      try {
        const transition = document.startViewTransition(() => {
          document.documentElement.classList.toggle('light', nextTheme === 'light')
        })

        transition.finished.finally(() => {
          document.documentElement.classList.remove('no-transitions')
        })
      } catch (err) {
        document.documentElement.classList.toggle('light', nextTheme === 'light')
        document.documentElement.classList.remove('no-transitions')
      }
      return
    }

    // Option 1: Circular Expanding Ripple
    if (transitionMode === 'circular') {
      document.documentElement.setAttribute('data-theme-transition', 'circular')
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // Disable standard CSS transitions during snapshot to capture exact target theme
      document.documentElement.classList.add('no-transitions')

      try {
        const transition = document.startViewTransition(() => {
          document.documentElement.classList.toggle('light', nextTheme === 'light')
        })

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 650,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        }).catch(() => {
          document.documentElement.classList.toggle('light', nextTheme === 'light')
        })

        transition.finished.finally(() => {
          document.documentElement.classList.remove('no-transitions')
        })
      } catch (err) {
        document.documentElement.classList.toggle('light', nextTheme === 'light')
        document.documentElement.classList.remove('no-transitions')
      }
    }
  }, [])

  return { theme, toggleTheme }
}
