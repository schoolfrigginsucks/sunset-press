/**
 * Shopify Storefront API client.
 *
 * Uses the Storefront GraphQL API directly (fetch + a couple of queries) rather
 * than the Buy Button SDK: Buy Button renders its own iframed UI, which cannot
 * be styled to match this design and cannot drive a custom bundle builder.
 * The Storefront API gives us real carts, real inventory and a real checkout
 * hand-off while keeping every pixel ours.
 *
 * The Storefront access token is a PUBLIC token. It is designed to be shipped
 * in a browser bundle. Never put an Admin API token in here.
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const DEFAULT_API_VERSION = '2025-10'
const RAW_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION

/**
 * Shopify API versions are strictly YYYY-MM, and this value is interpolated
 * straight into the request URL. A malformed one (a stray word, a pasted label,
 * a trailing space) produces an invalid URL, so every call dies with an opaque
 * "Load failed" and the whole storefront looks broken for a reason nothing on
 * screen explains. Anything that is not the right shape is discarded.
 */
const API_VERSION = /^\d{4}-\d{2}$/.test(String(RAW_API_VERSION ?? '').trim())
  ? String(RAW_API_VERSION).trim()
  : DEFAULT_API_VERSION

if (RAW_API_VERSION && API_VERSION !== String(RAW_API_VERSION).trim()) {
  console.warn(
    `[Sunset Press] Ignoring malformed VITE_SHOPIFY_API_VERSION ` +
      `(${JSON.stringify(RAW_API_VERSION)}); expected YYYY-MM. ` +
      `Falling back to ${DEFAULT_API_VERSION}.`
  )
}

/** True once both credentials are present. Everything degrades gracefully if not. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN)

/*
 * Shipping without credentials degrades to a demo cart that cannot check out —
 * which looks fine in review and silently loses every sale. Say so immediately.
 */
if (!isShopifyConfigured && typeof window !== 'undefined') {
  console.error(
    '[Sunset Press] Running WITHOUT Shopify credentials — the cart is a local ' +
      'demo and checkout will not work. Set VITE_SHOPIFY_STORE_DOMAIN and ' +
      'VITE_SHOPIFY_STOREFRONT_TOKEN, then rebuild.'
  )
}

const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

async function storefront(query, variables = {}) {
  if (!isShopifyConfigured) {
    throw new Error(
      'Shopify is not configured. Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to your .env file.'
    )
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify responded ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  return json.data
}

/**
 * Shopify joins every option with " / ", so a product whose second option is a
 * placeholder comes back as "Cream White / Default". Strip those filler parts
 * rather than showing them to customers.
 */
function cleanVariantTitle(title) {
  const parts = String(title)
    .split(' / ')
    .filter((part) => part && part.toLowerCase() !== 'default' && part !== 'Default Title')
  return parts.join(' · ') || String(title)
}

/* ------------------------------------------------------------------ */
/* Buyer localisation                                                  */
/* ------------------------------------------------------------------ */

/**
 * Shopify infers the buyer's country from the IP of the request, and since
 * these calls come straight from the shopper's browser, it sees the shopper.
 * Everything downstream is asked for `@inContext(country:)` so an American
 * sees USD rather than a bare "$49.95" they will read as dollars they know.
 */
let BUYER_COUNTRY = null

export function getBuyerCountry() {
  return BUYER_COUNTRY
}

export async function fetchLocalization() {
  const data = await storefront(`
    query Localization {
      localization {
        country { isoCode name currency { isoCode symbol } }
      }
    }
  `)
  const c = data?.localization?.country
  if (c?.isoCode) BUYER_COUNTRY = c.isoCode
  return {
    country: c?.isoCode ?? null,
    countryName: c?.name ?? null,
    currency: c?.currency?.isoCode ?? null,
  }
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const PRODUCT_FIELDS = `
  id
  handle
  title
  availableForSale
  featuredImage { url altText }
  images(first: 25) {
    nodes { url altText }
  }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      image { url altText }
    }
  }
`

/**
 * Fetch the three catalogue products by handle, in one round trip.
 * Returns a map of handle -> normalised product, so callers can overlay live
 * data onto the static copy without losing the hand-written blurbs.
 */
export async function fetchProductsByHandle(handles, country = BUYER_COUNTRY) {
  const aliases = handles
    .map((h, i) => `p${i}: product(handle: ${JSON.stringify(h)}) { ${PRODUCT_FIELDS} }`)
    .join('\n')

  // @inContext makes Shopify return the market price for that country
  const ctx = country ? `@inContext(country: ${country})` : ''
  const data = await storefront(`query Catalogue ${ctx} { ${aliases} }`)

  const byHandle = {}
  handles.forEach((handle, i) => {
    const node = data[`p${i}`]
    if (!node) return
    byHandle[handle] = {
      handle: node.handle,
      title: node.title,
      available: node.availableForSale,
      image: node.featuredImage?.url ?? null,
      imageAlt: node.featuredImage?.altText ?? null,
      price: Number(node.priceRange.minVariantPrice.amount),
      currency: node.priceRange.minVariantPrice.currencyCode,
      gallery: node.images.nodes.map((img) => ({
        url: img.url,
        alt: img.altText || null,
      })),
      variants: node.variants.nodes.map((v) => ({
        id: v.id,
        title: cleanVariantTitle(v.title),
        price: Number(v.price.amount),
        available: v.availableForSale,
        image: v.image?.url ?? null,
      })),
    }
  })
  return byHandle
}

/* ------------------------------------------------------------------ */
/* Checkout hand-off                                                   */
/* ------------------------------------------------------------------ */

/** `gid://shopify/ProductVariant/123` -> `123` */
const numericVariantId = (gid) => String(gid).split('/').pop()

/**
 * Build a classic cart permalink: /cart/<variantId>:<qty>,<variantId>:<qty>
 *
 * We do NOT use the Cart API's own `checkoutUrl`. On this store the
 * /cart/c/<token> route it returns responds 404 and dumps the shopper back on
 * the homepage — silently losing the sale at the final step. The permalink is
 * the long-standing route: Shopify rebuilds the cart from it, applies the same
 * automatic Buy X Get Y discounts, and redirects to the real checkout.
 */
export function buildCartPermalink(lines) {
  if (!DOMAIN) return null
  const parts = (lines ?? [])
    .filter((l) => l.variantId && l.quantity > 0)
    .map((l) => `${numericVariantId(l.variantId)}:${l.quantity}`)
  return parts.length ? `https://${DOMAIN}/cart/${parts.join(',')}` : null
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  discountAllocations {
    discountedAmount { amount currencyCode }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost {
        totalAmount { amount currencyCode }
        amountPerQuantity { amount currencyCode }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          image { url altText }
          price { amount currencyCode }
          product { title handle }
        }
      }
    }
  }
`

function normaliseCart(cart) {
  if (!cart) return null

  const lines = cart.lines.nodes.map((l) => ({
    id: l.id,
    quantity: l.quantity,
    variantId: l.merchandise.id,
    variantTitle: cleanVariantTitle(l.merchandise.title),
    productTitle: l.merchandise.product.title,
    image: l.merchandise.image?.url ?? null,
    imageAlt: l.merchandise.image?.altText ?? null,
    // What the variant costs before any discount...
    listUnitPrice: Number(l.merchandise.price.amount),
    listLinePrice: Number(l.merchandise.price.amount) * l.quantity,
    /*
     * ...and what this line actually costs. Note `amountPerQuantity` reports the
     * UNDISCOUNTED unit price even on a discounted line, so only `totalAmount`
     * reveals a Buy X Get Y allocation. Compare line totals, never unit prices.
     */
    unitPrice: Number(l.cost.amountPerQuantity.amount),
    linePrice: Number(l.cost.totalAmount.amount),
  }))

  /**
   * Buy X Get Y is allocated per line, not to the cart, so `subtotalAmount`
   * already arrives discounted and `cart.discountAllocations` comes back empty.
   * Reconstruct the undiscounted total from list prices so the drawer can show
   * the saving — otherwise the customer never sees what the bundle earned them.
   */
  const listSubtotal = lines.reduce((sum, l) => sum + l.listUnitPrice * l.quantity, 0)
  const subtotal = Number(cart.cost.subtotalAmount.amount)

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    listSubtotal,
    subtotal,
    total: Number(cart.cost.totalAmount.amount),
    currency: cart.cost.totalAmount.currencyCode,
    discount: Math.max(0, listSubtotal - subtotal),
    lines,
  }
}

function assertNoUserErrors(payload) {
  const errs = payload?.userErrors ?? []
  if (errs.length) throw new Error(errs.map((e) => e.message).join('; '))
}

export async function createCart(lines = []) {
  // buyerIdentity keeps the cart in the same currency the prices were shown in
  const buyer = BUYER_COUNTRY ? `, buyerIdentity: { countryCode: ${BUYER_COUNTRY} }` : ''
  const data = await storefront(
    `mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines${buyer} }) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { lines }
  )
  assertNoUserErrors(data.cartCreate)
  return normaliseCart(data.cartCreate.cart)
}

export async function fetchCart(cartId) {
  const data = await storefront(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId }
  )
  return normaliseCart(data.cart)
}

export async function addCartLines(cartId, lines) {
  const data = await storefront(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lines }
  )
  assertNoUserErrors(data.cartLinesAdd)
  return normaliseCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await storefront(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  )
  assertNoUserErrors(data.cartLinesUpdate)
  return normaliseCart(data.cartLinesUpdate.cart)
}

export async function removeCartLine(cartId, lineId) {
  const data = await storefront(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] }
  )
  assertNoUserErrors(data.cartLinesRemove)
  return normaliseCart(data.cartLinesRemove.cart)
}
