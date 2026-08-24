/**
 * Sunset Press identity.
 *
 * The mark is one shape doing two jobs: a sun sitting on the horizon, and a
 * citrus half cut side-on — the segment lines read as both sun rays and fruit
 * pith. Two bars beneath are the horizon, and the press plate.
 *
 * `variant`:
 *   'lockup'  — mark + wordmark, horizontal (default)
 *   'mark'    — glyph only, for avatars and favicons
 *   'stacked' — mark above wordmark, for square spaces
 *
 * Colour comes from the gradient; `mono` renders it in currentColor instead,
 * for single-colour contexts like embroidery, invoices or a dark footer.
 */

let gradientSeed = 0

function Mark({ className = '', mono = false }) {
  /* Unique gradient id per instance — two logos on one page must not collide. */
  const id = `sp-mark-${(gradientSeed += 1)}`
  const paint = mono ? 'currentColor' : `url(#${id})`

  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="52%" stopColor="#fb6f7d" />
          <stop offset="100%" stopColor="#7a2f5e" />
        </linearGradient>
      </defs>

      {/* Sun on the horizon / citrus half */}
      <path d="M5.5 19.5a10.5 10.5 0 0 1 21 0Z" fill={paint} />

      {/* Segments — sun rays and fruit pith at once */}
      <g stroke="#fff" strokeWidth="1.05" strokeLinecap="round" opacity="0.5">
        <path d="M16 19.5V10.2" />
        <path d="M16 19.5l6.6-6.6" />
        <path d="M16 19.5l-6.6-6.6" />
        <path d="M16 19.5l9.1-3.8" />
        <path d="M16 19.5l-9.1-3.8" />
      </g>

      {/* Horizon / press plate */}
      <g fill={paint}>
        <rect x="3" y="22.4" width="26" height="2.1" rx="1.05" />
        <rect x="7.5" y="26.6" width="17" height="2.1" rx="1.05" opacity="0.55" />
      </g>
    </svg>
  )
}

export default function Logo({
  variant = 'lockup',
  mono = false,
  className = '',
  markClassName = '',
}) {
  if (variant === 'mark') {
    return <Mark className={`${markClassName || 'h-8 w-8'} ${className}`} mono={mono} />
  }

  if (variant === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <Mark className={markClassName || 'h-10 w-10'} mono={mono} />
        <span className="font-display text-[0.95em] font-bold leading-none tracking-tight">
          Sunset Press
        </span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className={markClassName || 'h-[1.5em] w-[1.5em] shrink-0'} mono={mono} />
      <span className="font-display text-[1.05em] font-bold leading-none tracking-tight">
        Sunset Press
      </span>
    </span>
  )
}
