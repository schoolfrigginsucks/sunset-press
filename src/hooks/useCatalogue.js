import { useEffect, useState } from 'react'
import { COLOURS, PRODUCT } from '../data/products'
import { fetchProductsByHandle, isShopifyConfigured } from '../lib/shopify'

/**
 * Overlays live Shopify prices and availability onto the local colourways,
 * matched by variant id. Photography and copy stay ours — Shopify is the source
 * of truth for money and stock, nothing else.
 */
export function useCatalogue() {
  const [colours, setColours] = useState(COLOURS)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!isShopifyConfigured) return
    let cancelled = false

    fetchProductsByHandle([PRODUCT.handle])
      .then((byHandle) => {
        if (cancelled) return
        const remote = byHandle[PRODUCT.handle]
        if (!remote) return

        setColours(
          COLOURS.map((c) => {
            const v = remote.variants.find((rv) => rv.id === c.variantId)
            return v ? { ...c, price: v.price, available: v.available } : c
          })
        )
        setLive(true)
      })
      .catch((err) => {
        // Never break the page over this — the local catalogue is a valid site.
        console.warn('[Sunset Press] Live catalogue unavailable, using local data.', err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { colours, live }
}
