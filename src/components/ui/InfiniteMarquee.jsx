import React from 'react'

/**
 * InfiniteMarquee component
 * An infinite horizontal scrolling marquee ribbon.
 *
 * @param {string[]} items - Array of text items to display in the marquee
 * @param {number} speed - Duration in seconds for one full loop (default: 30)
 * @param {string} separator - Separator character between items (default: '•')
 * @param {boolean} reverse - Whether the animation runs in reverse (default: false)
 * @param {string} className - Optional additional CSS classes
 * @param {React.CSSProperties} style - Optional additional inline styles
 */
export default function InfiniteMarquee({
  items = [],
  speed = 30,
  separator = '•',
  reverse = false,
  className = '',
  style = {},
}) {
  if (!items || items.length === 0) return null

  // Ensure sufficient repetitions so that even short item arrays fill ultra-wide screens seamlessly
  const repeatCount = items.length < 5 ? 3 : 1
  const halfItems = Array(repeatCount).fill(items).flat()
  // Duplicate the list so the first half and second half are identical for translateX(-50%)
  const displayItems = [...halfItems, ...halfItems]

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 0',
        width: '100%',
        display: 'flex',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          width: 'max-content',
          willChange: 'transform',
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {displayItems.map((item, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                color: 'var(--text-muted)',
              }}
            >
              {item}
            </span>
            <span
              style={{
                margin: '0 24px',
                color: 'var(--accent)',
                opacity: 0.5,
                fontSize: '0.85rem',
              }}
            >
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
