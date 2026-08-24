import Reveal from './Reveal'
import { Eyebrow, Section } from './Section'

/* Placeholder copy — swap for real reviews before launch. */
const REVIEWS = [
  {
    quote:
      'I bought the Mini for the office and ended up ordering two more for home. It genuinely gets used every single day.',
    name: 'Priya N.',
    meta: 'Press Mini · Verified buyer',
  },
  {
    quote:
      'Took the Max camping and charged it off a power bank. Fresh mango juice at a campsite is a ridiculous thing to be able to do.',
    name: 'Tom H.',
    meta: 'Press Max · Verified buyer',
  },
  {
    quote:
      'The no-cleanup thing sold me and it delivered. Blend, drink, rinse. That is the whole routine.',
    name: 'Alex W.',
    meta: 'Press Go · Verified buyer',
  },
]

function Stars({ className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-4 w-4 text-ember-500" fill="currentColor">
          <path d="M8 1.8 9.9 5.7l4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.8Z" />
        </svg>
      ))}
    </span>
  )
}

export default function SocialProof() {
  return (
    <Section id="reviews" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-ink-900/[0.07] bg-cream-50 px-6 py-14 sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,111,125,0.16),transparent_65%)] blur-2xl"
        />

        <Reveal className="relative text-center">
          <Eyebrow>Loved by 2,400+ Australians</Eyebrow>
          <div className="mt-5 flex flex-col items-center gap-3">
            <Stars />
            <p className="font-display text-2xl font-bold tracking-tight text-ink-900">
              4.8 out of 5
            </p>
            <p className="text-sm text-ink-600">Based on 2,431 verified reviews</p>
          </div>
        </Reveal>

        <ul className="relative mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              as="li"
              key={r.name}
              delay={i * 100}
              className="flex flex-col rounded-2xl border border-ink-900/[0.07] bg-cream-100/70 p-6"
            >
              <Stars className="mb-4" />
              <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink-800">
                “{r.quote}”
              </blockquote>
              <footer className="mt-5 border-t border-ink-900/[0.08] pt-4">
                <p className="font-display text-sm font-bold tracking-tight text-ink-900">
                  {r.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{r.meta}</p>
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
