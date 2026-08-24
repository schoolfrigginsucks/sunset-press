import { useReveal } from '../hooks/useReveal'

/**
 * Wraps children in a one-way scroll reveal. `delay` staggers siblings —
 * keep it small (60–120ms steps) so a grid feels alive, not slow.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
