import { useEffect, useState } from 'react'
import { COLOURS, PRODUCT, setDisplayCurrency } from '../data/products'
import {
  fetchLocalization,
  fetchProductsByHandle,
  isShopifyConfigured,
} from '../lib/shopify'

/**
 * Overlays live Shopify prices and availability onto the local colourways,
 * matched by variant id. Photography and copy stay ours — Shopify is the
 * source of truth for money and stock, nothing else.
 *
 * Prices are fetched in the shopper's own market, so a US visitor sees USD
 * and checks out in USD. Shopify infers the country from the request IP, and
 * these calls come from the shopper's browser, so it sees the shopper.
 */
export function useCatalogue() {
  const [colours, setColours] = useState(COLOURS)
  const [currency, setCurrency] = useState('AUD')
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!isShopifyConfigured) return
    let cancelled = false

    async function load() {
      // Ask who the shopper is first — the answer changes every price below.
      let country = null
      try {
        const loc = await fetchLocalization()
        country = loc.country
        if (!cancelled && loc.currency) {
          setDisplayCurrency(loc.currency)
          setCurrency(loc.currency)
        }
      } catch {
        // Not knowing the market is survivable; store currency still applies.
      }

      const byHandle = await fetchProductsByHandle([PRODUCT.handle], country)
      if (cancelled) return

      const remote = byHandle[PRODUCT.handle]
      if (!remote) return

      if (remote.currency) {
        setDisplayCurrency(remote.currency)
        setCurrency(remote.currency)
      }

      setColours(
        COLOURS.map((c) => {
          const v = remote.variants.find((rv) => rv.id === c.variantId)
          return v ? { ...c, price: v.price, available: v.available } : c
        })
      )
      setLive(true)
    }

    load().catch((err) => {
      // Never break the page over this — the local catalogue is a valid site.
      console.warn('[Sunset Press] Live catalogue unavailable, using local data.', err)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { colours, currency, live }
}
