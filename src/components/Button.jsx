const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium select-none ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45'

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  children,
  ...rest
}) {
  /* Primary and swatch both follow the selected bottle, so the main call to
     action is literally the colour of the thing being bought. */
  const variants = {
    primary: {
      className: 'text-sand-50 hover:-translate-y-0.5',
      style: {
        backgroundColor: 'var(--accent)',
        boxShadow: '0 12px 30px -12px var(--glow)',
      },
    },
    swatch: {
      className: 'text-ink-900 hover:-translate-y-0.5',
      style: {
        backgroundColor: 'var(--swatch)',
        boxShadow: '0 12px 30px -14px var(--glow)',
      },
    },
    solid: {
      className: 'bg-ink-900 text-sand-50 hover:bg-ink-800 hover:-translate-y-0.5',
      style: undefined,
    },
    outline: {
      className:
        'border border-ink-900/15 text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/[0.035] hover:-translate-y-0.5',
      style: undefined,
    },
    ghost: { className: 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/[0.05]', style: undefined },
  }

  const v = variants[variant] ?? variants.primary

  return (
    <Tag
      className={`${base} ${sizes[size]} ${v.className} ${className}`}
      style={{ ...v.style, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
