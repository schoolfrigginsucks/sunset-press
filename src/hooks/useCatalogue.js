import { useEffect, useState } from 'react'
import { PRODUCTS, isBlockedImage } from '../data/products'
import { fetchProductsByHandle, isShopifyConfigured } from '../lib/shopify'

/**
 * The catalogue the UI renders.
 *
 * Starts as the hand-written static copy (so the page paints instantly and
 * works with no credentials), then overlays live Shopify prices, variants and
 * availability once they arrive. Copy, images and ordering always stay ours.
 */
/** Strip Shopify's ?v= cache-buster so the same asset compares equal. */
const imageKey = (url) => String(url).split('?')[0]

function mergeGallery(staticProduct, remoteGallery = []) {
  const hero = { url: staticProduct.image, alt: staticProduct.alt }
  const seen = new Set([imageKey(hero.url)])
  const rest = remoteGallery.filter((img) => {
    if (isBlockedImage(img.url)) return false
    const key = imageKey(img.url)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return [hero, ...rest]
}

/* Variants whose only photo is a blocked supplier image fall back to the hero. */
function cleanVariants(variants) {
  return variants.map((v) =>
    isBlockedImage(v.image) ? { ...v, image: null } : v
  )
}

export function useCatalogue() {
  const [products, setProducts] = useState(PRODUCTS)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!isShopifyConfigured) return
    let cancelled = false

    fetchProductsByHandle(PRODUCTS.map((p) => p.handle))
      .then((byHandle) => {
        if (cancelled) return
        setProducts(
          PRODUCTS.map((p) => {
            const remote = byHandle[p.handle]
            if (!remote) return p
            return {
              ...p,
              price: remote.price,
              available: remote.available,
              // Keep our art direction; only fall back to Shopify's image.
              image: p.image || remote.image,
              /*
               * Lead the gallery with our chosen hero shot, then every other
               * Shopify image behind it, de-duplicated by URL (ignoring the
               * ?v= cache-buster, which differs between the two sources).
               */
              gallery: mergeGallery(p, remote.gallery),
              variants: cleanVariants(remote.variants.length ? remote.variants : p.variants),
            }
          })
        )
        setLive(true)
      })
      .catch((err) => {
        // Never break the page over this — the static catalogue is a valid site.
        console.warn('[Sunset Press] Live catalogue unavailable, using static data.', err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { products, live }
}
