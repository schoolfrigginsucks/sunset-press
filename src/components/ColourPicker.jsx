import { useColour } from '../context/ColourContext'

const SIZES = {
  lg: 'h-11 w-11',
  md: 'h-9 w-9',
  sm: 'h-7 w-7',
}

/**
 * The four silicone colours as physical swatches. Selection drives the whole
 * page tint, so this doubles as the site's theme control.
 */
export default function ColourPicker({ size = 'lg', showLabel = true, className = '' }) {
  const { colour, colourId, setColourId, colours } = useColour()

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label="Bottle colour"
        className="flex items-center gap-2.5"
      >
        {colours.map((c) => {
          const active = c.id === colourId
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${c.name} — ${c.fruit}`}
              title={c.name}
              onClick={() => setColourId(c.id)}
              className={`${SIZES[size]} relative rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 ${
                active ? 'scale-110' : 'scale-100'
              }`}
            >
              <span
                className="absolute inset-0 rounded-full border border-ink-900/10"
                style={{ backgroundColor: c.swatch }}
              />
              <span
                className={`absolute -inset-1.5 rounded-full border transition-opacity duration-500 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ borderColor: 'var(--accent)' }}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      {showLabel && (
        <p className="mt-3.5 text-sm text-ink-600">
          <span className="font-medium text-ink-900">{colour.name}</span>
          <span className="mx-2 text-ink-400" aria-hidden="true">·</span>
          {colour.fruit}
        </p>
      )}
    </div>
  )
}
