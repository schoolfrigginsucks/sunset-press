import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useScrolled } from '../hooks/useReveal'
import Logo from './Logo'
import Button from './Button'

const LINKS = [
  { href: '#colours', label: 'Colours' },
  { href: '#how', label: 'How it works' },
  { href: '#bundle', label: 'Bundles' },
  { href: '#reviews', label: 'Reviews' },
]

export default function Nav() {
  const { count, openCart, addedAt } = useCart()
  const scrolled = useScrolled(24)
  const [pulse, setPulse] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!addedAt) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 500)
    return () => clearTimeout(t)
  }, [addedAt])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'border-b border-ink-900/[0.07] bg-sand-200/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
      >
        <a href="#top" className="text-base" aria-label="Sunset Press — home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors duration-200 hover:bg-ink-900/[0.05] hover:text-ink-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            className="relative"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M6 7h12l-1 12H7L6 7Zm3 0a3 3 0 0 1 6 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span
                className={`tinted absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.68rem] font-semibold text-sand-50 transition-transform duration-300 ${
                  pulse ? 'scale-125' : 'scale-100'
                }`}
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {count}
              </span>
            )}
          </Button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/[0.05] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d={menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-ink-900/[0.07] bg-sand-200/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 sm:px-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[0.95rem] font-medium text-ink-800"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
