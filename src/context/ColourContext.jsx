import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { COLOURS } from '../data/products'
import { useCatalogue } from '../hooks/useCatalogue'

const ColourContext = createContext(null)

/**
 * Holds the selected colourway and pushes its palette onto the document root,
 * so every `var(--accent)` on the page follows the bottle the customer is
 * looking at. Doing it at the root (rather than threading props) means the nav,
 * buttons, glows and focus rings all change together in one paint.
 *
 * It also owns the live catalogue, so Shopify prices — in the shopper's own
 * currency — reach every component through one context rather than each of
 * them importing the static list and quietly going stale.
 */
export function ColourProvider({ children }) {
  const { colours, currency, live } = useCatalogue()
  const [colourId, setColourId] = useState(COLOURS[0].id)

  const colour = useMemo(
    () => colours.find((c) => c.id === colourId) ?? colours[0],
    [colourId, colours]
  )

  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--accent', colour.accent)
    root.setProperty('--swatch', colour.swatch)
    root.setProperty('--glow', colour.glow)
  }, [colour])

  const value = useMemo(
    () => ({ colour, colourId, setColourId, colours, currency, live }),
    [colour, colourId, colours, currency, live]
  )

  return <ColourContext.Provider value={value}>{children}</ColourContext.Provider>
}

export function useColour() {
  const ctx = useContext(ColourContext)
  if (!ctx) throw new Error('useColour must be used inside <ColourProvider>')
  return ctx
}
