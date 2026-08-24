import Button from './Button'
import Reveal from './Reveal'
import { PRODUCTS, money } from '../data/products'

const hero = PRODUCTS[0]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32"
    >
      {/* Warm ground: a low sunset wash, kept soft so type stays the loudest thing. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200" />
        <div className="absolute -left-[18%] top-[8%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.20),transparent_62%)] blur-3xl" />
        <div className="absolute -right-[14%] top-[26%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(251,111,125,0.20),transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-14%] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(122,47,94,0.13),transparent_65%)] blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="max-w-lg lg:max-w-xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-50/70 px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-600 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full sunset-gradient" aria-hidden="true" />
              Free shipping Australia-wide
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,3.95rem)] font-bold leading-[1.02] text-ink-900">
              Fresh juice,
              <br />
              <span className="sunset-text">wherever the day</span>
              <br />
              takes you.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-600">
              Cordless presses built for golden-hour living — blitz fruit in seconds, sip straight
              from the cup, and get on with it.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#bundles" size="lg" variant="primary">
                Choose your deal
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button as="a" href="#shop" size="lg" variant="outline">
                Shop all presses
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink-900/10 pt-7">
              {[
                ['18,000', 'RPM motor'],
                ['30 sec', 'from fruit to glass'],
                ['4.8/5', 'from 2,400+ reviews'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold tracking-tight text-ink-900">
                    {stat}
                  </dt>
                  <dd className="mt-0.5 text-sm text-ink-600">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Product portrait */}
        <Reveal delay={200} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-4 top-10 rounded-[2.5rem] sunset-gradient opacity-[0.16] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-cream-300/70 bg-cream-50 shadow-lift-lg">
              <img
                src={hero.image}
                alt={hero.alt}
                width="900"
                height="900"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-cream-300/70 bg-cream-50/95 px-4 py-3 shadow-lift backdrop-blur">
              <span className="font-display text-sm font-bold tracking-tight text-ink-900">
                {hero.name}
              </span>
              <span className="h-4 w-px bg-ink-900/15" aria-hidden="true" />
              <span className="text-sm font-medium text-ink-600">{money(hero.price)}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
