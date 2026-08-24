import { useState } from 'react'
import { money } from '../data/products'
import { useCart } from '../context/CartContext'
import Button from './Button'
import Reveal from './Reveal'
import ProductModal from './ProductModal'
import { Eyebrow, Section } from './Section'

function ProductCard({ product, delay, onOpen }) {
  const { addLines, busy } = useCart()
  /*
   * Hold only the explicit choice. The static catalogue renders first and is
   * replaced by live Shopify data moments later, so seeding state from
   * `variants[0]` would pin the card to whatever the *initial* list happened to
   * start with. Resolving lazily means we always fall back to the current
   * first variant, and a stale id from the old list simply drops away.
   */
  const [variantId, setVariantId] = useState(null)

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
  /* The picked colour drives the card image; fall back to the hero shot. */
  const shownImage = variant.image || product.image
  const shownAlt = variant.image ? `${product.name} in ${variant.title}` : product.alt

  return (
    <Reveal
      as="article"
      delay={delay}
      className="group flex w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-ink-900/[0.08] bg-cream-50 shadow-lift transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-lift-lg sm:w-auto sm:shrink"
    >
      <button
        type="button"
        onClick={() => onOpen(product, variant.id)}
        aria-label={`View all ${product.name} images`}
        className="relative block overflow-hidden bg-cream-200 text-left"
      >
        <img
          key={shownImage}
          src={shownImage}
          alt={shownAlt}
          width="800"
          height="800"
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full animate-[fadeIn_400ms_ease-out] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream-50/90 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-600 backdrop-blur">
          {product.tagline}
        </span>

        {/* Affordance for the gallery — only worth showing if there's more to see */}
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1.5 text-[0.7rem] font-medium text-cream-50 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 max-sm:opacity-100">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M20 8v9a3 3 0 0 1-3 3H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          View photos
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink-900">
            <button
              type="button"
              onClick={() => onOpen(product, variant.id)}
              className="text-left transition-colors hover:text-ember-600"
            >
              {product.name}
            </button>
          </h3>
          <p className="shrink-0 text-right font-medium text-ink-800">
            {product.priceFrom && (
              <span className="mr-1 text-xs font-normal text-ink-400">from</span>
            )}
            {money(variant.price)}
          </p>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-600">{product.short}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {product.specs.map((s) => (
            <li
              key={s}
              className="rounded-full bg-ink-900/[0.05] px-2.5 py-1 text-[0.72rem] font-medium text-ink-600"
            >
              {s}
            </li>
          ))}
        </ul>

        {/* Colour swatches — clearer than a <select> now that each one has art */}
        <div className="mt-auto pt-5">
          <div
            role="radiogroup"
            aria-label={`${product.name} options`}
            className="flex flex-wrap gap-1.5"
          >
            {product.variants.map((v) => {
              const active = v.id === variant.id
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={v.available === false}
                  title={v.title}
                  onClick={() => setVariantId(v.id)}
                  className={`relative h-9 w-9 overflow-hidden rounded-full border-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-30 ${
                    active
                      ? 'border-ember-500 shadow-[0_0_0_3px_rgba(249,115,22,0.14)]'
                      : 'border-ink-900/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {v.image ? (
                    <img
                      src={v.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-cream-200 text-[0.58rem] font-semibold uppercase text-ink-600">
                      {v.title.replace(/[^A-Za-z0-9]/g, '').slice(0, 3)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 truncate text-xs text-ink-400">{variant.title}</p>
        </div>

        <Button
          variant="solid"
          size="md"
          disabled={busy || variant.available === false}
          onClick={() => addLines([{ merchandiseId: variant.id, quantity: 1 }])}
          className="mt-3 w-full"
        >
          {variant.available === false ? 'Sold out' : 'Add to cart'}
        </Button>
      </div>
    </Reveal>
  )
}

export default function ProductShowcase({ products }) {
  const [open, setOpen] = useState(null)

  return (
    <Section id="shop" className="scroll-mt-24">
      <Reveal className="max-w-2xl">
        <Eyebrow>The range</Eyebrow>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.15rem)] font-bold leading-[1.04] text-ink-900">
          Three presses.
          <br />
          One very good habit.
        </h2>
      </Reveal>

      {/* Scroll-snap carousel on mobile, grid from sm up. */}
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            delay={i * 100}
            onOpen={(product, variantId) => setOpen({ product, variantId })}
          />
        ))}
      </div>

      {open && (
        <ProductModal
          product={open.product}
          initialVariantId={open.variantId}
          onClose={() => setOpen(null)}
        />
      )}
    </Section>
  )
}
