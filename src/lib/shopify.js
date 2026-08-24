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
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-10'

/** True once both credentials are present. Everything degrades gracefully if not. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN)

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
export async function fetchProductsByHandle(handles) {
  const aliases = handles
    .map((h, i) => `p${i}: product(handle: ${JSON.stringify(h)}) { ${PRODUCT_FIELDS} }`)
    .join('\n')

  const data = await storefront(`query Catalogue { ${aliases} }`)

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
  const data = await storefront(
    `mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
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
