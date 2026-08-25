import Reveal from './Reveal'
import { Section } from './Section'

/* The four claims printed on the packaging, in the packaging's own order. */
const FEATURES = [
  {
    title: 'Carry loop',
    line: 'Clips to anything',
    body: 'A silicone loop on the collar — hook a finger through it, or clip it to a bag strap. 350 mL, lighter than a full water bottle.',
    icon: (
      <>
        <rect x="7.5" y="5.5" width="9" height="15" rx="3.2" />
        <path d="M10.5 8.6h3" />
        {/* the collar loop itself */}
        <ellipse cx="5.1" cy="7.6" rx="2.4" ry="3" />
        <path d="M7.4 7.6h1.4" />
      </>
    ),
  },
  {
    title: 'Powerful',
    line: 'Quick blend',
    body: 'An 18,000 RPM motor and six blades. Through frozen berries in seconds.',
    icon: (
      <>
        <path d="M13 2.4 5.8 13.6H11L10.2 21.6 18.2 10.4H13L13 2.4Z" />
      </>
    ),
  },
  {
    title: 'Rechargeable',
    line: 'USB-C',
    body: 'Charge it once, use it all week. No outlet, no cable across the bench.',
    icon: (
      <>
        <rect x="4.5" y="8" width="13" height="8" rx="2.4" />
        <path d="M19.6 11v2" />
        <path d="M7.5 11.2v1.6M10.6 11.2v1.6" />
      </>
    ),
  },
  {
    title: 'Easy to clean',
    line: 'Rinse to clean',
    body: 'Drink from the bottle you blended in. Half fill, pulse once, tip out. Done.',
    icon: (
      <>
        <path d="M8 3.2h8l-1 4.2H9L8 3.2Z" />
        <path d="M9 7.4h6v10.4a2.6 2.6 0 0 1-2.6 2.6h-0.8A2.6 2.6 0 0 1 9 17.8V7.4Z" />
        <path d="M9.6 12.6h4.8" />
      </>
    ),
  },
]

export default function Features() {
  return (
    <Section id="why" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="label-type text-[0.62rem] text-ink-400">Why it earns the bench space</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.3rem)] font-bold leading-[1.03] text-ink-900">
          Everything it needs.
          <br />
          Nothing it doesn&rsquo;t.
        </h2>
      </Reveal>

      <ul className="mt-14 grid gap-x-8 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal as="li" key={f.title} delay={i * 90} className="text-center sm:text-left">
            <span
              className="tinted mx-auto grid h-14 w-14 place-items-center rounded-full sm:mx-0"
              style={{ backgroundColor: 'var(--swatch)' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-ink-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {f.icon}
              </svg>
            </span>
            <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink-900">
              {f.title}
            </h3>
            <p className="label-type mt-1.5 text-[0.58rem] text-ink-400">{f.line}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-600">{f.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
