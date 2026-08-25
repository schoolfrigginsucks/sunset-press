import { useColour } from '../context/ColourContext'
import { useCart } from '../context/CartContext'
import { PRODUCT, money } from '../data/products'
import Button from './Button'
import ColourPicker from './ColourPicker'
import Reveal from './Reveal'

export default function Hero() {
  const { colour, colours } = useColour()
  const { addLines, busy } = useCart()

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-32"
    >
      {/* The glow is the only thing that moves when the colour changes —
          the ground stays the photographic backdrop. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="tinted absolute left-1/2 top-[14%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--glow), transparent 66%)' }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <p className="label-type text-[0.66rem] text-ink-400 sm:text-[0.72rem]">
            Mini · Fast · Portable
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.7rem,8vw,5.6rem)] font-bold leading-[0.95] text-ink-900">
            Blend it. Sip it.
            <br />
            <span className="accent-text tinted">Done.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-ink-600">
            {PRODUCT.blurb}
          </p>
        </Reveal>

        {/* All four bottles are stacked and cross-faded, so switching colour
            swaps the product in place instead of reloading an image. */}
        <Reveal delay={120} className="relative mx-auto mt-14 w-full max-w-[30rem]">
          <div className="relative aspect-[1122/1402]">
            {colours.map((c) => (
              <img
                key={c.id}
                src={c.image}
                alt={c.alt}
                width="1122"
                height="1402"
                loading={c.id === colours[0].id ? 'eager' : 'lazy'}
                decoding="async"
                aria-hidden={c.id !== colour.id}
                /* Feathered edges dissolve the studio backdrop into the page,
                   so the bottle reads as standing on the site, not in a box. */
                style={{
                  maskImage:
                    'radial-gradient(ellipse 76% 82% at 50% 48%, #000 62%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 76% 82% at 50% 48%, #000 62%, transparent 100%)',
                }}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  c.id === colour.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={200} className="mx-auto mt-10 flex max-w-md flex-col items-center gap-7">
          <ColourPicker size="lg" />

          <div className="flex w-full flex-col items-center gap-3">
            <p className="font-display text-3xl font-bold tracking-tight text-ink-900">
              {money(colour.price)}
              <span className="ml-2 align-middle text-sm font-medium text-ink-400">
                {PRODUCT.volume}
              </span>
            </p>

            <Button
              size="lg"
              variant="primary"
              className="tinted w-full"
              disabled={busy || !colour.available}
              onClick={() => addLines([{ merchandiseId: colour.variantId, quantity: 1 }])}
            >
              {busy ? 'Adding…' : `Add ${colour.short} to cart`}
            </Button>

            <a
              href="#bundle"
              className="text-sm font-medium text-ink-600 underline decoration-ink-400/50 underline-offset-4 transition-colors hover:text-ink-900"
            >
              Or buy 3, get 1 free
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
