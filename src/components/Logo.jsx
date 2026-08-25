/**
 * Wordmark set in the bottle label's own voice — wide-tracked uppercase,
 * stacked on two lines exactly as it is printed on the silicone band.
 */
export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex flex-col leading-[1.08] ${className}`}>
      <span className="label-type text-[0.68em] text-ink-900">Sunset</span>
      <span className="label-type text-[0.68em] text-ink-900">Press</span>
    </span>
  )
}
