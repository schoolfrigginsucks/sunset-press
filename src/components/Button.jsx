const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 select-none'

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
}

const variants = {
  /* The one loud element on the page. Gradient stays the hero's privilege. */
  primary:
    'sunset-gradient text-white shadow-[0_10px_30px_-10px_rgba(233,92,20,0.65)] ' +
    'hover:shadow-[0_18px_44px_-12px_rgba(233,92,20,0.75)] hover:-translate-y-0.5 ' +
    'bg-[length:180%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%] ' +
    '[transition:background-position_600ms_cubic-bezier(0.22,1,0.36,1),transform_300ms,box-shadow_300ms]',
  solid:
    'bg-ink-900 text-cream-50 hover:bg-ink-800 hover:-translate-y-0.5 ' +
    'shadow-[0_8px_24px_-12px_rgba(36,26,38,0.6)]',
  outline:
    'border border-ink-900/15 text-ink-900 bg-transparent ' +
    'hover:border-ink-900/40 hover:bg-ink-900/[0.035] hover:-translate-y-0.5',
  ghost: 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/[0.05]',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
