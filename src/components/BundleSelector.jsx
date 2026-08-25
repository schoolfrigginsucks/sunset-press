import { useEffect, useMemo, useState } from 'react'
import { COLOURS, TIERS, money, priceBundle } from '../data/products'
import { useCart } from '../context/CartContext'
import Button from './Button'
import Reveal from './Reveal'
import { Section } from './Section'

/** Default fill: one of each colour, cycling if the tier wants more than four. */
function defaultSlots(n, previous = []) {
  return Array.from({ length: n }, (_, i) => previous[i] ?? COLOURS[i % COLOURS.length].id)
}

export default function BundleSelector() {
  const { addLines, busy, isDemo } = useCart()
  const [tierId, setTierId] = useState('trio')
  const [slots, setSlots] = useState(() => defaultSlots(4))

  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[0]

  useEffect(() => {
    setSlots((prev) => defaultSlots(tier.slots, prev))
  }, [tier.slots])

  const chosen = useMemo(
    () => slots.map((id) => COLOURS.find((c) => c.id === id) ?? COLOURS[0]),
    [slots]
  )

  const { subtotal, total, saving } = useMemo(
    () => priceBundle(chosen.map((c) => c.price), tier),
    [chosen, tier]
  )

  const setSlot = (index, colourId) =>
    setSlots((prev) => prev.map((s, i) => (i === index ? colourId : s)))

  const handleAdd = () => {
    /* Shopify wants one line per variant, so collapse duplicates into quantity. */
    const merged = new Map()
    for (const c of chosen) merged.set(c.variantId, (merged.get(c.variantId) ?? 0) + 1)
    addLines([...merged].map(([merchandiseId, quantity]) => ({ merchandiseId, quantity })))
  }

  return (
    <Section id="bundle" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="label-type text-[0.62rem] text-ink-400">Stock up</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.3rem)] font-bold leading-[1.03] text-ink-900">
          One each is the
          <br />
          usual answer.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-600">
          Mix the colours however you like. The discount lands automatically at checkout.
        </p>
      </Reveal>

      <div role="radiogroup" aria-label="Bundle size" className="mt-12 grid gap-3.5 sm:grid-cols-3">
        {TIERS.map((t, i) => {
          const active = t.id === tierId
          const isBest = t.id === 'trio'
          return (
            <Reveal key={t.id} delay={i * 80}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTierId(t.id)}
                className={`relative flex h-full w-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? 'border-transparent bg-sand-50 shadow-drop-lg'
                    : 'border-ink-900/[0.09] hover:-translate-y-1 hover:bg-sand-50/70 hover:shadow-drop'
                }`}
                style={active ? { boxShadow: '0 0 0 2px var(--accent), 0 24px 50px -24px var(--glow)' } : undefined}
              >
                {t.badge ? (
                  <span
                    className={`tinted mb-4 inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] ${
                      isBest ? 'text-ink-900' : 'bg-ink-900/[0.06] text-ink-600'
                    }`}
                    style={isBest ? { backgroundColor: 'var(--swatch)' } : undefined}
                  >
                    {t.badge}
                  </span>
                ) : (
                  <span className="mb-4 block h-[25px]" aria-hidden="true" />
                )}

                <span className="font-display text-lg font-bold leading-tight tracking-tight text-ink-900">
                  {t.label}
                </span>
                <span className="mt-1.5 text-sm text-ink-600">{t.sub}</span>

                <span
                  className={`tinted mt-5 inline-flex items-center gap-2 text-sm font-medium ${
                    active ? 'accent-text' : 'text-ink-400'
                  }`}
                >
                  <span
                    className="tinted grid h-4 w-4 place-items-center rounded-full border"
                    style={{
                      borderColor: active ? 'var(--accent)' : 'currentColor',
                      backgroundColor: active ? 'var(--accent)' : 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    {active && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-sand-50" fill="none">
                        <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {active ? 'Selected' : 'Select'}
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={140}>
        <div className="mt-4 grid gap-8 rounded-[1.75rem] border border-ink-900/[0.07] bg-sand-50 p-6 shadow-drop sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-ink-900">
              {tier.slots === 1 ? 'Choose your colour' : `Fill your ${tier.slots}`}
            </h3>

            <ul className="mt-6 flex flex-col gap-3">
              {chosen.map((c, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 rounded-2xl border border-ink-900/[0.07] bg-sand-100/70 p-3"
                >
                  <img
                    src={c.image}
                    alt=""
                    width="112"
                    height="140"
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-14 shrink-0 rounded-xl bg-sand-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold tracking-tight text-ink-900">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-ink-600">{c.fruit}</p>

                    <div
                      role="radiogroup"
                      aria-label={`Bottle ${index + 1} colour`}
                      className="mt-2.5 flex gap-2"
                    >
                      {COLOURS.map((opt) => {
                        const on = opt.id === c.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            aria-label={opt.name}
                            title={opt.name}
                            onClick={() => setSlot(index, opt.id)}
                            className={`h-6 w-6 rounded-full border transition-transform duration-300 hover:scale-110 ${
                              on ? 'scale-110 border-ink-900/45' : 'border-ink-900/10 opacity-60 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: opt.swatch }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <p className="shrink-0 self-start text-sm font-medium text-ink-800">
                    {money(c.price)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-ink-900/[0.07] lg:pl-12">
            <div className="sticky top-28">
              <h3 className="font-display text-lg font-bold tracking-tight text-ink-900">
                Your total
              </h3>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-600">
                    {tier.slots} {tier.slots === 1 ? 'bottle' : 'bottles'}
                  </dt>
                  <dd className={saving > 0 ? 'text-ink-400 line-through' : 'text-ink-800'}>
                    {money(subtotal)}
                  </dd>
                </div>

                {saving > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="accent-text tinted font-medium">Bundle discount</dt>
                    <dd className="accent-text tinted font-medium">−{money(saving)}</dd>
                  </div>
                )}

                <div className="flex items-baseline justify-between gap-4 border-t border-ink-900/10 pt-4">
                  <dt className="font-display font-bold tracking-tight text-ink-900">Total</dt>
                  <dd className="font-display text-2xl font-bold tracking-tight text-ink-900">
                    {money(total)}
                  </dd>
                </div>
              </dl>

              {saving > 0 && (
                <p
                  className="tinted mt-4 inline-block rounded-full px-3.5 py-2 text-sm font-semibold text-ink-900"
                  style={{ backgroundColor: 'var(--swatch)' }}
                >
                  You save {money(saving)}
                </p>
              )}

              <Button
                size="lg"
                variant="primary"
                onClick={handleAdd}
                disabled={busy}
                className="tinted mt-6 w-full"
              >
                {busy ? 'Adding…' : `Add ${tier.slots === 1 ? 'bottle' : 'bundle'} — ${money(total)}`}
              </Button>

              <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
                {isDemo
                  ? 'Demo cart — add Shopify credentials to check out for real.'
                  : 'Discount applied at checkout. Free shipping Australia-wide.'}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
