import { useColour } from '../context/ColourContext'
import { PRODUCT } from '../data/products'
import Reveal from './Reveal'
import { Section } from './Section'

/**
 * The four-up shot, full bleed. Clicking a colour name below it retints the
 * page, so this section doubles as a second colour control.
 */
export default function Lineup() {
  const { colourId, setColourId, colours } = useColour()

  return (
    <Section id="colours" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="label-type text-[0.62rem] text-ink-400">Four ways</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.3rem)] font-bold leading-[1.03] text-ink-900">
          Pick your colour,
          <br />
          pick your fruit.
        </h2>
      </Reveal>

      <Reveal delay={100} className="mt-12">
        <figure className="overflow-hidden rounded-[1.75rem] bg-sand-100 shadow-drop">
          <img
            src={PRODUCT.lineup.src}
            alt={PRODUCT.lineup.alt}
            width="1400"
            height="933"
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </figure>
      </Reveal>

      <Reveal delay={160}>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colours.map((c) => {
            const active = c.id === colourId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setColourId(c.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? 'border-transparent bg-sand-50 shadow-drop'
                      : 'border-ink-900/[0.08] hover:-translate-y-0.5 hover:bg-sand-50/70'
                  }`}
                  style={active ? { boxShadow: '0 14px 34px -18px var(--glow)' } : undefined}
                >
                  <span
                    className="h-7 w-7 shrink-0 rounded-full border border-ink-900/10"
                    style={{ backgroundColor: c.swatch }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 truncate font-display text-sm font-bold tracking-tight text-ink-900">
                    {c.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </Section>
  )
}
