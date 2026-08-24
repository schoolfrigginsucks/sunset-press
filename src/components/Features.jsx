import Reveal from './Reveal'
import { Eyebrow, Section } from './Section'

const ICON = 'h-6 w-6'

const FEATURES = [
  {
    title: 'Genuinely portable',
    body: 'Fits a bag, a cupholder, a desk drawer. Weighs less than a full water bottle.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="none" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 7h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Cordless, USB-C',
    body: 'Charge it once, use it all week. No outlet, no cable trailing across the bench.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="none" aria-hidden="true">
        <path
          d="M13 2 5.5 13.5H11L10 22l8-11.5h-5.5L13 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Fruit to glass in 30s',
    body: 'An 18,000 RPM motor and six blades. Frozen berries included.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Hot and cold',
    body: 'Warm soup on a cold morning, iced smoothie in February. One button.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="none" aria-hidden="true">
        <path
          d="M12 3v18M12 7.5 8.8 5.4M12 7.5l3.2-2.1M12 16.5l-3.2 2.1M12 16.5l3.2 2.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M5 8.2 19 15.8M19 8.2 5 15.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <Section id="why" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Why Sunset Press</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.15rem)] font-bold leading-[1.04] text-ink-900">
            Built to be used,
            <br />
            not admired.
          </h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-ink-600">
            Every part earns its place. Nothing to assemble, nothing to lose, nothing you'll
            resent washing up.
          </p>
        </Reveal>

        <ul className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 90}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ember-500/12 to-coral-500/12 text-ember-600">
                {f.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-600">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
