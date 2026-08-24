import Logo from './Logo'

const NAV = [
  {
    title: 'Shop',
    links: [
      ['Press Mini', '#shop'],
      ['Press Max', '#shop'],
      ['Press Go', '#shop'],
      ['Bundles', '#bundles'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Shipping', '#'],
      ['Returns', '#'],
      ['Warranty', '#'],
      ['Contact', '#'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['Our story', '#why'],
      ['Reviews', '#reviews'],
      ['Wholesale', '#'],
    ],
  },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <path fill="currentColor" stroke="none" d="M14.2 3.2h2.4a5.6 5.6 0 0 0 4.2 4.2v2.5a8.1 8.1 0 0 1-4.2-1.3v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.3 2.9V3.2Z" />
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <path fill="currentColor" stroke="none" d="M13.6 21v-7.4h2.5l.4-2.9h-2.9V8.8c0-.8.3-1.4 1.5-1.4h1.5V4.8a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.2H8.2v2.9h2.5V21h2.9Z" />
    ),
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/[0.08] bg-cream-200/50 px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#top" className="text-xl text-ink-900" aria-label="Sunset Press — home">
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              Portable presses for people who'd rather be outside. Designed in Perth, shipped
              Australia-wide.
            </p>

            <ul className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/10 text-ink-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900/25 hover:text-ink-900"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {NAV.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-sm font-bold tracking-tight text-ink-900">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-sm text-ink-600 transition-colors duration-200 hover:text-ink-900"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-900/[0.08] pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sunset Press. All prices in AUD, incl. GST.</p>
          <ul className="flex gap-5">
            <li>
              <a href="#" className="transition-colors hover:text-ink-600">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-ink-600">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
