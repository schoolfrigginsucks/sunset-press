# Sunset Press

A one-page storefront for Sunset Press — React 19, Vite, Tailwind CSS v4, and a real
Shopify cart via the Storefront API.

---

## ✅ Bundle discounts — already set up

The page advertises two bundle deals, but **the page only does the arithmetic for
display** — Shopify decides what the customer actually pays. Without matching automatic
discounts, the cart would show the full undiscounted total and you'd lose the sale at the
last step.

These have now been created in your store and are **ACTIVE**:

| Discount | Config | Shopify ID |
|---|---|---|
| Buy 2, Get 1 at 50% Off | Buy 2 from *All Presses* → get 1 at 50% | `1464357814323` |
| Buy 3, Get 1 Free | Buy 3 from *All Presses* → get 1 at 100% | `1464357847091` |

Both are scoped to a new manual collection, **All Presses**
(`gid://shopify/Collection/303948922931`), containing Press Mini, Press Max and Press Go.

Settings applied to both:

- **Automatic**, not a discount code — applies without the customer typing anything
- **Uses per order: 1** — so a 6-pack doesn't stack the offer unexpectedly
- **Combines with:** shipping discounts only. Not with other product or order discounts,
  so the two bundles can't compound on one cart. Shopify applies whichever is better for
  the customer.

Shopify applies Buy X Get Y to the **lowest-priced** eligible item, which is exactly what
`priceBundle()` in `src/data/products.js` assumes. If you change one, change the other.

### Still test this before launch

Add a 4-press bundle on the site, hit checkout, and confirm the Shopify total matches the
"Total" the page showed. Add any new product to the **All Presses** collection or the
bundles won't apply to it.

---

## What I need from you

Copy `.env.example` to `.env` (already done) and fill in these two values:

### 1. `VITE_SHOPIFY_STORE_DOMAIN`

Already filled in as `lunarest-store.myshopify.com`. This is your permanent
`.myshopify.com` domain, **not** a custom domain. Find it at
**Shopify admin → Settings → Domains**.

### 2. `VITE_SHOPIFY_STOREFRONT_TOKEN`

This is the one thing still blank. To create it:

1. Shopify admin → **Settings → Apps and sales channels**
2. Click **Develop apps** (you may need to click *Allow custom app development* once)
3. **Create an app** → name it something like `Sunset Press Website` → **Create app**
4. Open the **Configuration** tab → next to **Storefront API integration**, click
   **Configure**
5. Tick these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_pickup_locations`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
6. **Save** → go to the **API credentials** tab → **Install app**
7. Copy the **Storefront API access token** (a long hex string) into `.env`

**Is it safe in the browser?** Yes. The Storefront token is a *public* token — it's
designed to be shipped in client-side JavaScript and can only read published products and
manage carts. Never put an **Admin API** token in this file; that one is secret.

### 3. Publish the products to the Storefront channel

Storefront API only returns products published to it. For each of the three products:
**Products → [product] → Publishing → Manage → tick your custom app / Headless**. If the
site shows static prices and the browser console logs *"Live catalogue unavailable"*, this
is usually why.

---

## Running it locally

You need **Node 20 or newer**.

```bash
cd ~/sunset-press
npm install
npm run dev
```

Then open the URL it prints — normally <http://localhost:5173>.

To check the production build before deploying:

```bash
npm run build && npm run preview
```

### It works without credentials

With no token set, the site runs in **demo mode**: it renders from the static catalogue in
`src/data/products.js` (real prices, real variants, real images) and the cart works
entirely in-page. Only the checkout button is inert — it explains what's missing instead.
Add the token and everything becomes live with no code changes.

---

## Deploying

`.env` is gitignored, so on both hosts you set the same two variables in the dashboard.
They must keep the `VITE_` prefix — Vite only exposes variables with that prefix to the
browser bundle.

### Vercel

```bash
npm i -g vercel
vercel
```

Accept the defaults (Vercel detects Vite: build `npm run build`, output `dist`). Then
**Project → Settings → Environment Variables**, add `VITE_SHOPIFY_STORE_DOMAIN` and
`VITE_SHOPIFY_STOREFRONT_TOKEN` for *Production, Preview and Development*, and redeploy:

```bash
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --build
```

Build command `npm run build`, publish directory `dist`. Add the same two variables under
**Site configuration → Environment variables**, then:

```bash
netlify deploy --build --prod
```

### After deploying

Add your live domain to **Shopify → Settings → Customer privacy / Checkout** if you use
cookie banners, and confirm checkout redirects cleanly from the deployed URL.

---

## Project layout

```
src/
  data/products.js       Catalogue copy, variant IDs, tiers, bundle pricing maths
  lib/shopify.js         Storefront GraphQL client — products + cart mutations
  context/CartContext.jsx  Cart state; talks to Shopify, or runs a local demo cart
  hooks/useCatalogue.js  Overlays live Shopify data on the static catalogue
  hooks/useReveal.js     IntersectionObserver scroll reveals
  components/            Nav, Hero, BundleSelector, ProductShowcase, Features,
                         SocialProof, Footer, CartDrawer + primitives
  index.css              Tailwind v4 theme tokens (colours, fonts, shadows)
```

### Why the Storefront API instead of the Buy Button SDK

The Buy Button SDK renders Shopify's own markup inside iframes. It can't be styled to
match this design, and it can't drive a bundle builder where the customer picks which SKU
fills each slot. The Storefront API gives real carts, real inventory and a real checkout
hand-off while every pixel stays ours.

---

## Things to change before launch

- **Reviews are placeholder text.** `src/components/SocialProof.jsx` — swap in real
  quotes, and the "4.8 / 2,431 reviews" figures with them.
- **Footer links** point at `#`. Wire up shipping, returns, warranty, privacy, terms.
- **Socials** point at `#`.
- **Hero stats** ("2,400+ reviews") should match your real numbers.
- **Free shipping Australia-wide** appears in the hero and under the bundle button — make
  sure that matches your actual shipping settings in Shopify.
