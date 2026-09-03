import { useState, useEffect, useRef, useCallback } from 'react'

export function useTypewriter(words = [], speed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const [currentText, setCurrentText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!words.length) return

    const currentWord = words[wordIndex % words.length]

    const tick = () => {
      if (isDeleting) {
        setCurrentText(prev => prev.slice(0, -1))
        if (currentText.length <= 1) {
          setIsDeleting(false)
          setWordIndex(prev => (prev + 1) % words.length)
          timeoutRef.current = setTimeout(tick, 400)
          return
        }
        timeoutRef.current = setTimeout(tick, deleteSpeed)
      } else {
        setCurrentText(currentWord.slice(0, currentText.length + 1))
        if (currentText.length === currentWord.length - 1) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime)
          return
        }
        timeoutRef.current = setTimeout(tick, speed)
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeoutRef.current)
  }, [currentText, isDeleting, wordIndex, words, speed, deleteSpeed, pauseTime])

  return currentText
}
