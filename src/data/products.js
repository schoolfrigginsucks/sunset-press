/**
 * Sunset Press is a one-product store: the Press Mini, in four colourways.
 *
 * Every colourway carries its own palette, sampled from the product photography
 * itself — `swatch` is the actual silicone colour, `accent` is the darkened
 * version that stays legible as UI, and `glow` is the wash used behind the
 * bottle. Selecting a colour retints the whole page from these values.
 *
 * Images are local (public/products) so the page never waits on a third-party
 * CDN. The same files are uploaded to Shopify, which is what the cart shows.
 */

export const PRODUCT = {
  id: 'press-mini',
  handle: 'portable-electric-fruit-juicer-with-heating-function',
  name: 'Press Mini',
  tagline: 'Blend it. Sip it. Done.',
  price: 49.95,
  volume: '350 mL',
  blurb:
    'Fruit in, lid on, thirty seconds later you are drinking it. No jug to wash, no cups to find, no cable to hunt for. A silicone loop on the collar means it hangs off a finger or a bag strap on the way out the door.',
  lineup: {
    src: '/products/press-mini-lineup.jpg',
    alt: 'All four Press Mini colourways lined up together — blush pink with strawberry, white with golden kiwi, lilac with grapes, powder blue with mango',
  },
  lifestyle: {
    src: '/products/press-mini-lifestyle.jpg',
    alt: 'A hand dropping a strawberry into a white Press Mini on a kitchen bench, beside a glass of milk and a board of cut fruit',
  },
}

export const COLOURS = [
  {
    id: 'pink',
    variantId: 'gid://shopify/ProductVariant/44770451521587',
    name: 'Blush Pink',
    short: 'Blush',
    fruit: 'Strawberry + watermelon',
    price: 49.95,
    available: true,
    swatch: '#f7bcae',
    accent: '#c25b47',
    glow: 'rgba(247, 188, 174, 0.55)',
    image: '/products/press-mini-pink.jpg',
    alt: 'Press Mini in blush pink, filled with halved strawberries and cubes of watermelon, chrome lid resting beside it',
  },
  {
    id: 'white',
    variantId: 'gid://shopify/ProductVariant/44770451488819',
    name: 'Cream White',
    short: 'Cream',
    fruit: 'Golden kiwifruit',
    price: 49.95,
    available: true,
    swatch: '#f4ece5',
    accent: '#8a7361',
    glow: 'rgba(226, 209, 193, 0.55)',
    image: '/products/press-mini-white.jpg',
    alt: 'Press Mini in cream white, filled with thick slices of golden kiwifruit, chrome lid resting beside it',
  },
  {
    id: 'purple',
    variantId: 'gid://shopify/ProductVariant/44770451587123',
    name: 'Lilac Purple',
    short: 'Lilac',
    fruit: 'Grape + blueberry',
    price: 49.95,
    available: true,
    swatch: '#bea0df',
    accent: '#7048a8',
    glow: 'rgba(190, 160, 223, 0.55)',
    image: '/products/press-mini-purple.jpg',
    alt: 'Press Mini in lilac purple, filled with red grapes, blueberries and green grapes, chrome lid resting beside it',
  },
  {
    id: 'blue',
    variantId: 'gid://shopify/ProductVariant/44770451554355',
    name: 'Sky Blue',
    short: 'Sky',
    fruit: 'Mango + cantaloupe',
    price: 49.95,
    available: true,
    swatch: '#93c6ed',
    accent: '#2f74a8',
    glow: 'rgba(147, 198, 237, 0.55)',
    image: '/products/press-mini-blue.jpg',
    alt: 'Press Mini in powder blue, filled with cubes of ripe mango and cantaloupe, chrome lid resting beside it',
  },
]

/**
 * Bundle tiers. `slots` is how many bottles the customer configures.
 *
 * IMPORTANT: display maths only. Shopify's "Buy X Get Y" automatic discounts do
 * the real arithmetic at checkout — see README. Keep the two in step.
 */
export const TIERS = [
  { id: 'single', slots: 1, label: 'One bottle', sub: 'Just the one', badge: null, halfPriceUnits: 0, freeUnits: 0 },
  { id: 'duo', slots: 3, label: 'Buy 2, get 1 half price', sub: 'Three bottles', badge: 'Most Popular', halfPriceUnits: 1, freeUnits: 0 },
  { id: 'trio', slots: 4, label: 'Buy 3, get 1 free', sub: 'One of each colour', badge: 'Best Value', halfPriceUnits: 0, freeUnits: 1 },
]

/**
 * Discounts land on the cheapest bottle(s), mirroring how Shopify's Buy X Get Y
 * picks its free item. Returns dollars.
 */
export function priceBundle(unitPrices, tier) {
  const subtotal = unitPrices.reduce((sum, p) => sum + p, 0)
  const ascending = [...unitPrices].sort((a, b) => a - b)

  let saving = 0
  let i = 0
  for (let n = 0; n < tier.freeUnits && i < ascending.length; n++, i++) saving += ascending[i]
  for (let n = 0; n < tier.halfPriceUnits && i < ascending.length; n++, i++) saving += ascending[i] * 0.5

  // Round to cents the way Shopify does, or a half-price line drifts a cent
  // away from the checkout total and the page looks like it is lying.
  const cents = (n) => Math.round(n * 100) / 100
  const roundedSaving = cents(saving)
  return { subtotal: cents(subtotal), saving: roundedSaving, total: cents(subtotal) - roundedSaving }
}

/**
 * Price display follows whichever currency Shopify quoted for this shopper.
 *
 * Defaults to AUD because that is the store currency, but once the buyer's
 * market is known every price re-renders in theirs — an American reading a
 * bare "$49.95" as USD would otherwise get a surprise at checkout.
 */
let DISPLAY_CURRENCY = 'AUD'

export function setDisplayCurrency(currency) {
  if (currency) DISPLAY_CURRENCY = currency
}

export const getDisplayCurrency = () => DISPLAY_CURRENCY

/**
 * The Shopify delivery profile ships free to Australia (Standard) and free to
 * every international zone (Standard international, $0.00). Say so — an
 * unqualified "Australia-wide" reads to an American as "not you".
 */
export function shippingLine(country) {
  return country && country !== 'AU'
    ? 'Free worldwide shipping.'
    : 'Free shipping Australia-wide.'
}

export const money = (n) =>
  /*
   * The neutral 'en' locale is deliberate: it renders AUD as "A$49.95" and USD
   * as "$49.95". Formatting AUD in en-AU gives a bare "$", which an American
   * reads as their own dollars and then gets a surprise at checkout.
   */
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: DISPLAY_CURRENCY,
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }).format(n)
