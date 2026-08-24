import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { money } from '../data/products'
import { useCart } from '../context/CartContext'
import Button from './Button'

/**
 * Full-screen product view: every image, arrow/keyboard/swipe navigation, a
 * thumbnail rail, and the variant picker. Choosing a colour jumps the gallery
 * to that variant's shot, so the picker and the picture never disagree.
 */
export default function ProductModal({ product, initialVariantId, onClose }) {
  const { addLines, busy } = useCart()
  const [variantId, setVariantId] = useState(initialVariantId ?? null)
  const [index, setIndex] = useState(0)

  const closeRef = useRef(null)
  const touchStartX = useRef(null)

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]

  /* Gallery: the product's own images, with every variant shot folded in. */
  const images = useMemo(() => {
    const key = (u) => String(u).split('?')[0]
    const base = product.gallery?.length
      ? product.gallery
      : [{ url: product.image, alt: product.alt }]
    const seen = new Set(base.map((i) => key(i.url)))
    const extra = []
    for (const v of product.variants) {
      if (v.image && !seen.has(key(v.image))) {
        seen.add(key(v.image))
        extra.push({ url: v.image, alt: `${product.name} — ${v.title}` })
      }
    }
    return [...base, ...extra]
  }, [product])

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length]
  )

  /* Selecting a variant moves the gallery to that variant's image. */
  useEffect(() => {
    if (!variant?.image) return
    const key = (u) => String(u).split('?')[0]
    const found = images.findIndex((img) => key(img.url) === key(variant.image))
    if (found >= 0) setIndex(found)
  }, [variant, images])

  /* Escape to close, arrows to navigate, and lock the page behind the modal. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, go])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const current = images[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} — product images`}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink-900/45 backdrop-blur-[3px]"
      />

      <div className="relative flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-cream-100 shadow-lift-lg sm:max-h-[88svh] sm:rounded-3xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-cream-50/90 text-ink-600 shadow-lift backdrop-blur transition-colors hover:text-ink-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_auto] overflow-y-auto md:grid-cols-[1.15fr_1fr] md:grid-rows-1 md:overflow-hidden">
          {/* Gallery */}
          <div className="flex min-w-0 flex-col bg-cream-200/60 md:min-h-0">
            <div
              className="relative min-w-0 md:flex-1"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img
                key={current.url}
                src={current.url}
                alt={current.alt || `${product.name}, image ${index + 1} of ${images.length}`}
                className="aspect-square w-full animate-[fadeIn_400ms_ease-out] object-cover md:h-full"
                decoding="async"
              />

              {images.length > 1 && (
                <>
                  <GalleryArrow side="left" onClick={() => go(-1)} />
                  <GalleryArrow side="right" onClick={() => go(1)} />
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/65 px-2.5 py-1 text-[0.7rem] font-medium text-cream-50 backdrop-blur">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <ul className="no-scrollbar flex min-w-0 shrink-0 gap-2 overflow-x-auto p-3">
                {images.map((img, i) => (
                  <li key={img.url}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === index}
                      className={`h-14 w-14 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        i === index
                          ? 'border-ember-500 opacity-100'
                          : 'border-transparent opacity-55 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details */}
          <div className="flex min-w-0 flex-col gap-5 overflow-y-auto p-6 sm:p-8">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ember-600">
                {product.tagline}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-900">
                {product.name}
              </h2>
              <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-ink-900">
                {money(variant.price)}
              </p>
            </div>

            <p className="text-[0.95rem] leading-relaxed text-ink-600">{product.blurb}</p>

            <ul className="flex flex-wrap gap-1.5">
              {product.specs.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-ink-900/[0.05] px-2.5 py-1 text-[0.72rem] font-medium text-ink-600"
                >
                  {s}
                </li>
              ))}
            </ul>

            {/* Variant picker — swatch buttons so the image swap is obvious */}
            <fieldset className="mt-auto">
              <legend className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                Choose yours
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = v.id === variant.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      disabled={v.available === false}
                      aria-pressed={active}
                      className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-all duration-300 disabled:opacity-40 ${
                        active
                          ? 'border-ember-500 bg-ember-500/[0.08] text-ink-900'
                          : 'border-ink-900/12 text-ink-600 hover:border-ink-900/30 hover:text-ink-900'
                      }`}
                    >
                      {v.image && (
                        <img
                          src={v.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      )}
                      {v.title}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <Button
              size="lg"
              variant="primary"
              disabled={busy || variant.available === false}
              onClick={() => {
                addLines([{ merchandiseId: variant.id, quantity: 1 }])
                onClose()
              }}
              className="w-full"
            >
              {variant.available === false ? 'Sold out' : `Add to cart — ${money(variant.price)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GalleryArrow({ side, onClick }) {
  const isLeft = side === 'left'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream-50/85 text-ink-800 shadow-lift backdrop-blur transition-all duration-300 hover:bg-cream-50 hover:scale-105 ${
        isLeft ? 'left-3' : 'right-3'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d={isLeft ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
