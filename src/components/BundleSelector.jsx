import { useEffect, useMemo, useState } from 'react'
import { TIERS, money, priceBundle } from '../data/products'
import { useCart } from '../context/CartContext'
import Button from './Button'
import Reveal from './Reveal'
import { Eyebrow, Section } from './Section'

/** Build the default fill for a bundle of `n` slots — everything starts as Press Mini. */
function defaultSlots(products, n, previous = []) {
  const fallback = { productId: products[0].id, variantId: products[0].variants[0].id }
  return Array.from({ length: n }, (_, i) => previous[i] ?? fallback)
}

export default function BundleSelector({ products }) {
  const { addLines, busy, isDemo } = useCart()
  const [tierId, setTierId] = useState('trio')
  const [slots, setSlots] = useState(() => defaultSlots(products, 4))

  const tier = TIERS.find((t) => t.id === tierId)

  /* Resize the slot list when the tier changes, keeping whatever was chosen. */
  useEffect(() => {
    setSlots((prev) => defaultSlots(products, tier.slots, prev))
  }, [tier.slots, products])

  /* Re-point slots at real variants once the live catalogue replaces the static one. */
  useEffect(() => {
    setSlots((prev) =>
      prev.map((slot) => {
        const product = products.find((p) => p.id === slot.productId) ?? products[0]
        const stillValid = product.variants.some((v) => v.id === slot.variantId)
        return stillValid
          ? slot
          : { productId: product.id, variantId: product.variants[0].id }
      })
    )
  }, [products])

  const resolved = useMemo(
    () =>
      slots.map((slot) => {
        const product = products.find((p) => p.id === slot.productId) ?? products[0]
        const variant =
          product.variants.find((v) => v.id === slot.variantId) ?? product.variants[0]
        return { product, variant }
      }),
    [slots, products]
  )

  const { subtotal, total, saving } = useMemo(
    () => priceBundle(resolved.map((r) => r.variant.price), tier),
    [resolved, tier]
  )

  const updateSlot = (index, patch) =>
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))

  const handleAdd = () => {
    /* Collapse the slots into merged line items — Shopify wants one line per variant. */
    const merged = new Map()
    for (const { variant } of resolved) {
      merged.set(variant.id, (merged.get(variant.id) ?? 0) + 1)
    }
    addLines([...merged].map(([merchandiseId, quantity]) => ({ merchandiseId, quantity })))
  }

  return (
    <Section id="bundles" className="scroll-mt-24">
      <Reveal className="max-w-2xl">
        <Eyebrow>Build your box</Eyebrow>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.15rem)] font-bold leading-[1.04] text-ink-900">
          Choose your deal.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          Mix and match any presses you like — the discount lands automatically at checkout.
        </p>
      </Reveal>

      {/* Tier cards */}
      <div
        role="radiogroup"
        aria-label="Bundle size"
        className="mt-12 grid gap-4 sm:grid-cols-3"
      >
        {TIERS.map((t, i) => {
          const active = t.id === tierId
          const isBest = t.id === 'trio'
          return (
            <Reveal key={t.id} delay={i * 90}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTierId(t.id)}
                className={`group relative flex h-full w-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? 'border-transparent bg-cream-50 shadow-lift-lg ring-2 ring-ember-500'
                    : 'border-ink-900/10 bg-cream-50/55 hover:-translate-y-1 hover:border-ink-900/20 hover:bg-cream-50 hover:shadow-lift'
                } ${isBest ? 'sm:p-7' : ''}`}
              >
                {t.badge && (
                  <span
                    className={`mb-4 inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${
                      isBest
                        ? 'sunset-gradient text-white'
                        : 'bg-ink-900/[0.07] text-ink-600'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
                {!t.badge && <span className="mb-4 block h-[26px]" aria-hidden="true" />}

                <span
                  className={`font-display font-bold leading-tight tracking-tight text-ink-900 ${
                    isBest ? 'text-xl sm:text-[1.4rem]' : 'text-lg'
                  }`}
                >
                  {t.label}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-ink-600">{t.sub}</span>

                <span
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    active ? 'text-ember-600' : 'text-ink-400 group-hover:text-ink-600'
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border transition-colors ${
                      active ? 'border-ember-600 bg-ember-600' : 'border-ink-400'
                    }`}
                    aria-hidden="true"
                  >
                    {active && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
                        <path
                          d="M2.5 6.2 4.8 8.5 9.5 3.8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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

      {/* Slot builder + running total */}
      <Reveal delay={120}>
        <div className="mt-6 grid gap-6 rounded-3xl border border-ink-900/[0.08] bg-cream-50 p-6 shadow-lift sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-ink-900">
              Fill your bundle
            </h3>
            <p className="mt-1.5 text-sm text-ink-600">
              {tier.slots} {tier.slots === 1 ? 'press' : 'presses'} — pick any combination.
            </p>

            <ul className="mt-6 space-y-3">
              {resolved.map(({ product, variant }, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-ink-900/[0.08] bg-cream-100/60 p-3.5 transition-colors duration-300 hover:border-ink-900/15"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-900/[0.06] text-[0.7rem] font-semibold text-ink-600">
                      {index + 1}
                    </span>

                    {/* Thumbnail product picker */}
                    <div
                      role="radiogroup"
                      aria-label={`Press ${index + 1} — choose a product`}
                      className="flex gap-1.5"
                    >
                      {products.map((p) => {
                        const chosen = p.id === product.id
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={chosen}
                            title={p.name}
                            onClick={() =>
                              updateSlot(index, {
                                productId: p.id,
                                variantId: p.variants[0].id,
                              })
                            }
                            className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              chosen
                                ? 'border-ember-500 shadow-[0_0_0_3px_rgba(249,115,22,0.14)]'
                                : 'border-transparent opacity-55 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={(chosen && variant.image) || p.image}
                              alt={`Select ${p.name}`}
                              width="88"
                              height="88"
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        )
                      })}
                    </div>

                    <div className="ml-auto min-w-0 text-right">
                      <p className="truncate font-display text-sm font-bold tracking-tight text-ink-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-ink-600">{money(variant.price)}</p>
                    </div>
                  </div>

                  {/* Variant picker */}
                  <label className="mt-3 block">
                    <span className="sr-only">{product.name} option</span>
                    <select
                      value={variant.id}
                      onChange={(e) => updateSlot(index, { variantId: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-ink-900/10 bg-cream-50 px-3.5 py-2.5 text-sm text-ink-800 transition-colors duration-200 hover:border-ink-900/25 focus:border-ember-500"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='%236b5a6e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.85rem center',
                        backgroundSize: '0.8rem',
                      }}
                    >
                      {product.variants.map((v) => (
                        <option key={v.id} value={v.id} disabled={v.available === false}>
                          {v.title}
                          {v.price !== product.variants[0].price ? ` — ${money(v.price)}` : ''}
                          {v.available === false ? ' (sold out)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Running total */}
          <div className="lg:border-l lg:border-ink-900/[0.08] lg:pl-10">
            <div className="sticky top-28">
              <h3 className="font-display text-lg font-bold tracking-tight text-ink-900">
                Your total
              </h3>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ink-600">
                    {tier.slots} {tier.slots === 1 ? 'press' : 'presses'}
                  </dt>
                  <dd
                    className={saving > 0 ? 'text-ink-400 line-through' : 'text-ink-800'}
                  >
                    {money(subtotal)}
                  </dd>
                </div>

                {saving > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-medium text-ember-600">Bundle discount</dt>
                    <dd className="font-medium text-ember-600">−{money(saving)}</dd>
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
                  key={saving}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ember-500/10 px-3.5 py-2 text-sm font-semibold text-ember-600"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                    <path
                      d="M8 1.8 9.9 5.7l4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.8Z"
                      fill="currentColor"
                    />
                  </svg>
                  You save {money(saving)}
                </p>
              )}

              <Button
                size="lg"
                variant="primary"
                onClick={handleAdd}
                disabled={busy}
                className="mt-6 w-full"
              >
                {busy ? 'Adding…' : `Add bundle — ${money(total)}`}
              </Button>

              <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
                {isDemo
                  ? 'Demo cart — add Shopify credentials to check out for real.'
                  : 'Discount applied automatically at checkout. Free AU shipping.'}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
