/** Consistent vertical rhythm and gutters for every band on the page. */
export function Section({ id, className = '', children, ...rest }) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 sm:py-28 lg:py-36 ${className}`} {...rest}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

/** Small uppercase kicker above a section heading. */
export function Eyebrow({ children, className = '' }) {
  return (
    <p
      className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ember-600 ${className}`}
    >
      {children}
    </p>
  )
}
