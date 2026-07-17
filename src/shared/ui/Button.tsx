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
      'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(16,185,129,0.23)] hover:from-emerald-400 hover:to-emerald-500 border border-emerald-600/50',
    secondary:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    danger:
      'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(225,29,72,0.23)] hover:from-rose-400 hover:to-rose-500 border border-rose-600/50',
  }[variant]

  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={`inline-flex min-h-11 w-fit items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variantClasses} ${className}`.trim()}
    >
      {busy ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Wait...
        </span>
      ) : children}
    </button>
  )
}
