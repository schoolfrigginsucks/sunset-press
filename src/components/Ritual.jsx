import { PRODUCT } from '../data/products'
import Reveal from './Reveal'

const STEPS = [
  ['Fill it', 'Fruit straight in. Frozen is fine.'],
  ['Press it', 'Lid on, one button, thirty seconds.'],
  ['Drink it', 'Straight from the bottle you blended in.'],
]

/**
 * Full-bleed lifestyle shot with the three-step sequence beside it. Numbered
 * because it genuinely is a sequence — the whole pitch is that there are only
 * three steps and no fourth one for washing up.
 */
export default function Ritual() {
  return (
    <section id="how" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <figure className="overflow-hidden rounded-[1.75rem] bg-sand-100 shadow-drop">
            <img
              src={PRODUCT.lifestyle.src}
              alt={PRODUCT.lifestyle.alt}
              width="1024"
              height="1536"
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
          </figure>
        </Reveal>

        <Reveal delay={120}>
          <p className="label-type text-[0.62rem] text-ink-400">Three steps</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.3rem)] font-bold leading-[1.03] text-ink-900">
            There is no
            <br />
            fourth step.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
            No jug to rinse, no cups to find, no blades to pick clean. The bottle you
            blend in is the bottle you drink from.
          </p>

          <ol className="mt-10 flex flex-col gap-6">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex gap-5">
                <span
                  className="tinted mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-ink-900"
                  style={{ backgroundColor: 'var(--swatch)' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-lg font-bold tracking-tight text-ink-900">
                    {title}
                  </span>
                  <span className="mt-1 block text-[0.95rem] leading-relaxed text-ink-600">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
