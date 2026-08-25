/** Consistent vertical rhythm and gutters for every band on the page. */
export function Section({ id, className = '', children, ...rest }) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 sm:py-28 lg:py-32 ${className}`} {...rest}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}
