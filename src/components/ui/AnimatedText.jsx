import { motion } from 'framer-motion'

export default function AnimatedText({ text = '', className = '', delay = 0, as: Tag = 'span' }) {
  const words = text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: delay },
    },
  }

  const wordVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <motion.span
      as={Tag}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariant} style={{ display: 'inline-block' }}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
