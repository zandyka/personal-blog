import { useInView } from 'react-intersection-observer'

export function useScrollReveal(options = {}) {
  const { threshold = 0.1, triggerOnce = true } = options
  const { ref, inView } = useInView({ threshold, triggerOnce })
  return { ref, isVisible: inView }
}
