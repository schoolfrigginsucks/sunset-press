import Reveal from './Reveal'
import { Section } from './Section'

/* Placeholder copy — swap for real reviews before launch. */
const REVIEWS = [
  {
    quote:
      'Bought the pink one for my desk and ended up ordering three more. It is the only kitchen thing I own that gets used every single day.',
    name: 'Priya N.',
    meta: 'Blush Pink · Verified buyer',
  },
  {
    quote:
      'The no-cleanup thing sold me and it actually delivered. Blend, drink, rinse. That is the whole routine.',
    name: 'Alex W.',
    meta: 'Cream White · Verified buyer',
  },
  {
    quote:
      'Took it camping and charged it off a power bank. Fresh mango juice at a campsite is a ridiculous thing to be able to do.',
    name: 'Tom H.',
    meta: 'Sky Blue · Verified buyer',
  },
]

function Stars({ className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-4 w-4" fill="var(--accent)">
          <path d="M8 1.8 9.9 5.7l4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.8Z" />
        </svg>
      ))}
    </span>
  )
}

export default function SocialProof() {
  return (
    <Section id="reviews" className="scroll-mt-24">
      <Reveal className="text-center">
        <p className="label-type text-[0.62rem] text-ink-400">Loved by 2,400+ Australians</p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <Stars />
          <p className="font-display text-2xl font-bold tracking-tight text-ink-900">4.8 out of 5</p>
          <p className="text-sm text-ink-600">Based on 2,431 verified reviews</p>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Reveal
            as="li"
            key={r.name}
            delay={i * 100}
            className="flex flex-col rounded-2xl border border-ink-900/[0.07] bg-sand-50 p-6"
          >
            <Stars className="mb-4" />
            <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink-800">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <footer className="mt-5 border-t border-ink-900/[0.07] pt-4">
              <p className="font-display text-sm font-bold tracking-tight text-ink-900">{r.name}</p>
              <p className="mt-0.5 text-xs text-ink-400">{r.meta}</p>
            </footer>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
