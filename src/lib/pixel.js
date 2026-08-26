/**
 * Meta Pixel helpers.
 *
 * The base snippet in index.html fires PageView. Everything past that has to be
 * fired by hand, because this is a single-page app: no further page loads happen,
 * so without these calls Meta would only ever see the landing and could never
 * optimise for buyers.
 *
 * Every call is guarded — an ad blocker, a privacy browser, or a failed script
 * load must never take the storefront down with it.
 */
const CURRENCY = 'AUD'

function fire(event, data) {
  try {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    window.fbq('track', event, data)
  } catch {
    /* tracking is never worth breaking a purchase over */
  }
}

/** Someone is looking at the product. */
export function trackViewContent({ id, name, price }) {
  fire('ViewContent', {
    content_type: 'product',
    content_ids: [id],
    content_name: name,
    value: price,
    currency: CURRENCY,
  })
}

/** Items were added to the cart. `lines` is [{ merchandiseId, quantity }]. */
export function trackAddToCart(lines, value) {
  fire('AddToCart', {
    content_type: 'product',
    content_ids: lines.map((l) => l.merchandiseId),
    contents: lines.map((l) => ({ id: l.merchandiseId, quantity: l.quantity })),
    num_items: lines.reduce((n, l) => n + l.quantity, 0),
    value,
    currency: CURRENCY,
  })
}

/** The shopper clicked through to Shopify's checkout. */
export function trackInitiateCheckout(cart) {
  fire('InitiateCheckout', {
    content_type: 'product',
    content_ids: (cart?.lines ?? []).map((l) => l.variantId),
    num_items: cart?.totalQuantity ?? 0,
    value: cart?.total ?? 0,
    currency: CURRENCY,
  })
}
