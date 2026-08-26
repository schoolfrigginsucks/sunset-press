import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  addCartLines,
  buildCartPermalink,
  createCart,
  fetchCart,
  isShopifyConfigured,
  removeCartLine,
  updateCartLine,
} from '../lib/shopify'
import { COLOURS, PRODUCT } from '../data/products'
import { trackAddToCart, trackInitiateCheckout } from '../lib/pixel'

const CartContext = createContext(null)
const STORAGE_KEY = 'sunset-press:cart-id'

/** Flatten the static catalogue so demo mode can resolve a variant id -> details. */
const VARIANT_INDEX = Object.fromEntries(
  COLOURS.map((c) => [
    c.variantId,
    {
      variantId: c.variantId,
      variantTitle: c.name,
      productTitle: PRODUCT.name,
      image: c.image,
      imageAlt: c.alt,
      listUnitPrice: c.price,
      unitPrice: c.price,
    },
  ])
)

/** Demo-mode cart maths, so the drawer behaves identically without credentials. */
function demoTotals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
  return { subtotal, total: subtotal, discount: 0 }
}

function buildDemoCart(lines) {
  const { subtotal, total, discount } = demoTotals(lines)
  return {
    id: 'demo-cart',
    checkoutUrl: null,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    listSubtotal: subtotal,
    subtotal,
    total,
    discount,
    currency: 'AUD',
    lines: lines.map((l) => ({
      ...l,
      linePrice: l.unitPrice * l.quantity,
      listLinePrice: l.listUnitPrice * l.quantity,
    })),
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  /** Bumped on every successful add — drives the "added" pulse on the nav badge. */
  const [addedAt, setAddedAt] = useState(0)

  const demoLines = useRef([])

  /* Restore an existing Shopify cart on load, if one is still valid. */
  useEffect(() => {
    if (!isShopifyConfigured) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    let cancelled = false
    fetchCart(saved)
      .then((c) => {
        // A completed or expired cart comes back null — drop the stale id.
        if (cancelled) return
        if (c) setCart(c)
        else localStorage.removeItem(STORAGE_KEY)
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY))
    return () => {
      cancelled = true
    }
  }, [])

  const run = useCallback(async (fn) => {
    setBusy(true)
    setError(null)
    try {
      return await fn()
    } catch (e) {
      setError(e.message ?? 'Something went wrong. Please try again.')
      return null
    } finally {
      setBusy(false)
    }
  }, [])

  /**
   * @param {Array<{merchandiseId: string, quantity: number}>} lines
   */
  const addLines = useCallback(
    async (lines) => {
      const clean = lines.filter((l) => l.merchandiseId && l.quantity > 0)
      if (!clean.length) return

      // Report the intent to Meta before any network work, so an API hiccup
      // does not lose the signal the ad account is optimising on.
      trackAddToCart(
        clean,
        clean.reduce((sum, l) => {
          const c = COLOURS.find((x) => x.variantId === l.merchandiseId)
          return sum + (c ? c.price * l.quantity : 0)
        }, 0)
      )

      if (!isShopifyConfigured) {
        // Demo mode — merge into the local line list.
        clean.forEach(({ merchandiseId, quantity }) => {
          const meta = VARIANT_INDEX[merchandiseId]
          if (!meta) return
          const existing = demoLines.current.find((l) => l.variantId === merchandiseId)
          if (existing) existing.quantity += quantity
          else
            demoLines.current.push({
              id: `demo-${merchandiseId}`,
              quantity,
              ...meta,
            })
        })
        setCart(buildDemoCart(demoLines.current))
        setAddedAt(Date.now())
        setIsOpen(true)
        return
      }

      await run(async () => {
        let next
        if (cart?.id) {
          next = await addCartLines(cart.id, clean)
        } else {
          next = await createCart(clean)
          if (next?.id) localStorage.setItem(STORAGE_KEY, next.id)
        }
        setCart(next)
        setAddedAt(Date.now())
        setIsOpen(true)
      })
    },
    [cart, run]
  )

  const removeLine = useCallback(
    async (lineId) => {
      if (!isShopifyConfigured) {
        demoLines.current = demoLines.current.filter((l) => l.id !== lineId)
        setCart(buildDemoCart(demoLines.current))
        return
      }
      await run(async () => setCart(await removeCartLine(cart.id, lineId)))
    },
    [cart, run]
  )

  const setQuantity = useCallback(
    async (lineId, quantity) => {
      if (quantity < 1) return removeLine(lineId)

      if (!isShopifyConfigured) {
        const line = demoLines.current.find((l) => l.id === lineId)
        if (line) line.quantity = quantity
        setCart(buildDemoCart(demoLines.current))
        return
      }
      await run(async () => setCart(await updateCartLine(cart.id, lineId, quantity)))
    },
    [cart, run, removeLine]
  )

  const checkout = useCallback(() => {
    /*
     * Prefer a cart permalink over cart.checkoutUrl. The Cart API hands back a
     * /cart/c/<token> URL that 404s on this store and bounces the shopper to the
     * homepage; the permalink route rebuilds the same cart, keeps the automatic
     * bundle discounts, and lands on the real checkout.
     */
    trackInitiateCheckout(cart)

    const permalink = buildCartPermalink(cart?.lines)
    if (permalink) {
      window.location.href = permalink
    } else if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    } else {
      /*
       * A shopper must never be shown setup instructions. Tell them something
       * true and human, and put the actionable detail in the console where the
       * person who can fix it will actually see it.
       */
      console.error(
        '[Sunset Press] Checkout unavailable: VITE_SHOPIFY_STORE_DOMAIN and ' +
          'VITE_SHOPIFY_STOREFRONT_TOKEN are missing from this build. Vite inlines ' +
          'them at build time, so set them on the host and redeploy.'
      )
      setError('Checkout is temporarily unavailable. Please try again in a few minutes.')
    }
  }, [cart])

  const value = useMemo(
    () => ({
      cart,
      count: cart?.totalQuantity ?? 0,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLines,
      setQuantity,
      removeLine,
      checkout,
      busy,
      error,
      dismissError: () => setError(null),
      addedAt,
      isDemo: !isShopifyConfigured,
    }),
    [cart, isOpen, addLines, setQuantity, removeLine, checkout, busy, error, addedAt]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
