import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { money } from '../data/products'
import Button from './Button'

/** True when Shopify has allocated a discount to this line. */
function isDiscounted(line) {
  return typeof line.listLinePrice === 'number' && line.linePrice < line.listLinePrice - 0.005
}

function QtyStepper({ line, onChange, disabled }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink-900/12">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(line.quantity - 1)}
        aria-label={`Decrease quantity of ${line.productTitle}`}
        className="grid h-8 w-8 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900 disabled:opacity-40"
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
          <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span className="min-w-6 text-center text-sm font-medium tabular-nums text-ink-900">
        {line.quantity}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(line.quantity + 1)}
        aria-label={`Increase quantity of ${line.productTitle}`}
        className="grid h-8 w-8 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900 disabled:opacity-40"
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
          <path
            d="M6 2.5v7M2.5 6h7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    setQuantity,
    removeLine,
    checkout,
    busy,
    error,
    dismissError,
    isDemo,
  } = useCart()

  const panelRef = useRef(null)
  const closeRef = useRef(null)

  /* Escape to close, and lock the page behind the drawer. */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeCart])

  const lines = cart?.lines ?? []
  const isEmpty = lines.length === 0

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink-900/35 backdrop-blur-[2px] transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream-100 shadow-lift-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink-900/[0.08] px-6 py-5">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink-900">
            Your cart
            {cart?.totalQuantity ? (
              <span className="ml-2 text-sm font-medium text-ink-400">
                ({cart.totalQuantity})
              </span>
            ) : null}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-coral-600/25 bg-coral-500/10 p-3.5 text-sm text-plum-900">
            <p className="leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={dismissError}
              className="mt-2 text-xs font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-900/[0.05] text-ink-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path
                    d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="text-sm text-ink-600">Your cart is empty.</p>
              <Button variant="outline" size="sm" onClick={closeCart}>
                Keep shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-ink-900/[0.08]">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  {line.image && (
                    <img
                      src={line.image}
                      alt={line.imageAlt || line.productTitle}
                      width="88"
                      height="88"
                      loading="lazy"
                      decoding="async"
                      className="h-20 w-20 shrink-0 rounded-xl border border-ink-900/[0.08] bg-cream-200 object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold tracking-tight text-ink-900">
                          {line.productTitle}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-400">
                          {line.variantTitle}
                        </p>
                        {isDiscounted(line) && (
                          <span className="mt-1.5 inline-block rounded-full bg-ember-500/12 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ember-600">
                            {line.linePrice === 0 ? 'Free — bundle' : 'Bundle price'}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {isDiscounted(line) && (
                          <p className="text-xs text-ink-400 line-through">
                            {money(line.listLinePrice)}
                          </p>
                        )}
                        <p className="text-sm font-medium text-ink-900">
                          {money(line.linePrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QtyStepper
                        line={line}
                        disabled={busy}
                        onChange={(q) => setQuantity(line.id, q)}
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeLine(line.id)}
                        className="text-xs font-medium text-ink-400 underline underline-offset-2 transition-colors hover:text-coral-600 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <footer className="border-t border-ink-900/[0.08] bg-cream-50 px-6 py-6">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className={cart.discount > 0 ? 'text-ink-400 line-through' : 'text-ink-800'}>
                  {money(cart.listSubtotal ?? cart.subtotal)}
                </dd>
              </div>

              {cart.discount > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-medium text-ember-600">Bundle discount</dt>
                  <dd className="font-medium text-ember-600">−{money(cart.discount)}</dd>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-4 border-t border-ink-900/10 pt-3">
                <dt className="font-display font-bold tracking-tight text-ink-900">Total</dt>
                <dd className="font-display text-xl font-bold tracking-tight text-ink-900">
                  {money(cart.total)}
                </dd>
              </div>
            </dl>

            <Button
              size="lg"
              variant="primary"
              onClick={checkout}
              disabled={busy}
              className="mt-5 w-full"
            >
              {busy ? 'Updating…' : 'Checkout'}
            </Button>

            <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
              {isDemo
                ? 'Demo cart — bundle discounts are applied by Shopify at checkout, so they are not shown here yet.'
                : 'Shipping and any bundle discounts are calculated at checkout.'}
            </p>
          </footer>
        )}
      </aside>
    </>
  )
}
