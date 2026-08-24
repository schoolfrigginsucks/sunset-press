/**
 * Static product catalogue.
 *
 * This is the *fallback* — the site renders perfectly from this alone, so you
 * can design and demo without credentials. Once VITE_SHOPIFY_STOREFRONT_TOKEN
 * is set, `lib/shopify.js` fetches the same three products live by `handle`
 * and overlays real prices, variants and availability on top of this copy.
 *
 * Handles and variant IDs below were read from lunarest-store.myshopify.com.
 */

/**
 * Supplier images that still carry listing text burned into them — red
 * annotation boxes, "1pcs", voltage callouts. They came with the dropship
 * photos and look wrong on a premium storefront, so they are filtered out of
 * galleries and variant swatches alike.
 *
 * These are matched on filename. Replace the photos in Shopify admin, then
 * empty this array — nothing else needs changing.
 */
export const BLOCKED_IMAGES = [
  '4d45d2d8-db4b-435b-a562-35445c4fe361', // Press Mini — "Sky Blue 1pcs" + dashed box
  '0805352e-da0e-4e83-a0c2-7b1cc9741359', // Press Max — red "7.4V" callout
  '90ff37f3-94c1-43a3-8599-2cee99d1bd50', // Press Max — red "7.4V" callout
  '9e02546d-8723-49c8-a2e9-cb6a46307efb', // Press Max — red "7.4V" callout
]

export const isBlockedImage = (url) =>
  !url || BLOCKED_IMAGES.some((fragment) => String(url).includes(fragment))

export const PRODUCTS = [
  {
    id: 'press-mini',
    handle: 'portable-electric-fruit-juicer-with-heating-function',
    name: 'Press Mini',
    tagline: 'Hot or cold, in seconds.',
    priceFrom: false,
    price: 59.95,
    blurb:
      'Hot juice, cold juice, your call. 18,000 RPM motor blasts through fruit in seconds, and a built-in hot and cold function lets you warm it up on a chilly morning or keep it icy cold when you want a refreshing glass. Small, fast, and ready whenever you are.',
    short: '18,000 RPM. Hot and cold at the touch of a button.',
    alt: 'Sunset Press Press Mini portable juicer in cream white, shown upright with its lid on',
    image:
      'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/2802488f-a3cc-4d40-a867-d7e3e44dec2a.png?v=1787543914',
    specs: ['18,000 RPM motor', 'Hot + cold function', 'One-touch lid'],
    variants: [
      { id: 'gid://shopify/ProductVariant/44770451488819', title: 'Cream White', price: 59.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/171dbfbc-f1b0-4375-b7b3-72f634df3b58.jpg?v=1787543913'
      },
      { id: 'gid://shopify/ProductVariant/44770451521587', title: 'Light Pink', price: 59.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/85033a0d-9be7-4faa-8c03-ade86e90ee28.jpg?v=1787543914'
      },
      { id: 'gid://shopify/ProductVariant/44770451554355', title: 'Sky Blue', price: 59.95, available: true
      },
      { id: 'gid://shopify/ProductVariant/44770451587123', title: 'Lilac Purple', price: 59.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/77bf3e01-31c3-45c7-9659-f7f7cd4752e6.jpg?v=1787543913'
      },
    ],
  },
  {
    id: 'press-max',
    handle: 'portable-usb-rechargeable-electric-juicer',
    name: 'Press Max',
    tagline: 'Cordless. Goes the distance.',
    priceFrom: true,
    price: 75.95,
    blurb:
      'Power that keeps up with you. USB rechargeable and totally cordless, so you can charge it once and juice wherever the day takes you. No outlets needed. Pick your battery life and never miss your fresh juice fix.',
    short: 'USB rechargeable, fully cordless. Charge once, juice anywhere.',
    alt: 'Three Sunset Press Press Max juicers in white, olive and purple, each filled with fresh fruit',
    image:
      'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/3937532a-607d-4f40-a27e-f367f3994d27.jpg?v=1787544047',
    specs: ['USB-C rechargeable', 'Fully cordless', 'Two battery sizes'],
    variants: [
      { id: 'gid://shopify/ProductVariant/44770461122611', title: 'White · 3.7V 1300mAh', price: 75.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/66e69a04-8289-4bfb-a655-6076567cb4f9.jpg?v=1787544046'
      },
      { id: 'gid://shopify/ProductVariant/44770461155379', title: 'Olive Green · 3.7V 1300mAh', price: 75.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/1de5217c-7b94-49d1-b19c-1b59ad4e2282.jpg?v=1787544046'
      },
      { id: 'gid://shopify/ProductVariant/44770461188147', title: 'Purple · 3.7V 1300mAh', price: 75.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/7edbb4e5-50d3-4f59-aac5-b56249c31dc5.jpg?v=1787544046'
      },
      { id: 'gid://shopify/ProductVariant/44770461220915', title: 'White · 7.4V 1500mAh ×2', price: 79.95, available: true
      },
      { id: 'gid://shopify/ProductVariant/44770461253683', title: 'Olive Green · 7.4V 1500mAh ×2', price: 79.95, available: true
      },
      { id: 'gid://shopify/ProductVariant/44770461286451', title: 'Purple · 7.4V 1500mAh ×2', price: 79.95, available: true
      },
    ],
  },
  {
    id: 'press-go',
    handle: 'portable-rechargeable-blender-juicer-cup',
    name: 'Press Go',
    tagline: 'Blend it. Sip it. Done.',
    priceFrom: true,
    price: 55.95,
    blurb:
      'Blend it, sip it, done. No pouring, no extra cups, no cleanup, just fruit in, blend, and drink straight from the same cup. Perfect for the gym, the car, or your desk. Single cup for solo, double for sharing.',
    short: 'Blend and drink from the same cup. Zero cleanup.',
    alt: 'Sunset Press Press Go rechargeable blender cup in blue and pink',
    image:
      'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/b7e836e6-567f-4090-add1-bbec7229a798.jpg?v=1787552153',
    specs: ['Blend-and-drink cup', 'Single or double', 'Rinse-clean in seconds'],
    variants: [
      { id: 'gid://shopify/ProductVariant/44770586165299', title: 'Blue · single cup', price: 55.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/54f247e0-c82b-44c2-8373-65b1cd0127d8.jpg?v=1787552153'
      },
      { id: 'gid://shopify/ProductVariant/44770586132531', title: 'Blue · double cup', price: 55.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/fb15005d-c0a0-4c00-95f8-57a8a1eb9c3d.jpg?v=1787552153'
      },
      { id: 'gid://shopify/ProductVariant/44770586230835', title: 'Pink · single cup', price: 55.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/5e1aef13-16d1-43c7-90dc-8972292bf5cc.jpg?v=1787552153'
      },
      { id: 'gid://shopify/ProductVariant/44770586198067', title: 'Pink · double cup', price: 55.95, available: true, image:
        'https://cdn.shopify.com/s/files/1/0701/0176/2099/files/3724ffc1-6c2c-45d9-8b5d-ed8b8c6d167b.jpg?v=1787552153'
      },
    ],
  },
]

/**
 * Bundle tiers.
 *
 * `slots` = how many units the customer configures.
 * `freeUnits` / `halfPriceUnits` = how many of those are discounted.
 *
 * IMPORTANT: these are *display* maths only. The real money is worked out by a
 * Shopify "Buy X Get Y" automatic discount at checkout — see README.
 * Keep the two in sync or the checkout total will not match the page.
 */
export const TIERS = [
  {
    id: 'single',
    slots: 1,
    label: 'Buy 1',
    sub: 'Just the one, thanks',
    badge: null,
    halfPriceUnits: 0,
    freeUnits: 0,
  },
  {
    id: 'duo',
    slots: 3,
    label: 'Buy 2, Get 1 at 50% Off',
    sub: 'Three presses, one at half price',
    badge: 'Most Popular',
    halfPriceUnits: 1,
    freeUnits: 0,
  },
  {
    id: 'trio',
    slots: 4,
    label: 'Buy 3, Get 1 Free',
    sub: 'Four presses, pay for three',
    badge: 'Best Value',
    halfPriceUnits: 0,
    freeUnits: 1,
  },
]

/**
 * Bundle discounts apply to the *cheapest* item(s) in the bundle — this
 * mirrors how Shopify's Buy X Get Y automatic discount picks its free item.
 * Returns { subtotal, total, saving } in dollars.
 */
export function priceBundle(unitPrices, tier) {
  const subtotal = unitPrices.reduce((sum, p) => sum + p, 0)
  const ascending = [...unitPrices].sort((a, b) => a - b)

  let saving = 0
  let i = 0
  for (let n = 0; n < tier.freeUnits && i < ascending.length; n++, i++) {
    saving += ascending[i]
  }
  for (let n = 0; n < tier.halfPriceUnits && i < ascending.length; n++, i++) {
    saving += ascending[i] * 0.5
  }

  return { subtotal, saving, total: subtotal - saving }
}

export const money = (n) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(n)
