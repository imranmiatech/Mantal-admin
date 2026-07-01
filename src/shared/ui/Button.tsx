import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  busy?: boolean
}

export function Button({
  children,
  variant = 'primary',
  busy = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      'bg-lime-300 text-slate-950 shadow-[0_16px_40px_rgba(190,242,100,0.25)] hover:bg-lime-200',
    secondary:
      'border border-white/15 bg-white/8 text-white hover:bg-white/12',
    ghost: 'bg-transparent text-white hover:bg-white/8',
    danger:
      'bg-rose-400 text-rose-950 shadow-[0_16px_40px_rgba(251,113,133,0.2)] hover:bg-rose-300',
  }[variant]

  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={`inline-flex min-h-12 w-fit items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`.trim()}
    >
      {busy ? 'Please wait...' : children}
    </button>
  )
}
