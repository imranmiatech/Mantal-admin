import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  error?: string
  hint?: string
  className?: string
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input'
  }

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea'
  }

type FieldProps = InputProps | TextareaProps

export function InputField({
  label,
  error,
  hint,
  className = '',
  as = 'input',
  ...props
}: FieldProps) {
  if (as === 'textarea') {
    const textareaProps = props as TextareaProps

    return (
      <label className={`block space-y-2 ${className}`.trim()}>
        <span className="block text-sm font-medium text-white/78">{label}</span>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-white outline-none transition placeholder:text-white/28 focus:border-lime-300/50 focus:bg-white/8 focus:ring-4 focus:ring-lime-300/10"
          {...textareaProps}
        />
        {hint ? <span className="block text-xs text-white/45">{hint}</span> : null}
        {error ? <span className="block text-xs text-rose-300">{error}</span> : null}
      </label>
    )
  }

  const inputProps = props as InputProps

  return (
    <label className={`block space-y-2 ${className}`.trim()}>
      <span className="block text-sm font-medium text-white/78">{label}</span>
      <input
        className="h-13 w-full rounded-2xl border border-white/12 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-lime-300/50 focus:bg-white/8 focus:ring-4 focus:ring-lime-300/10"
        {...inputProps}
      />
      {hint ? <span className="block text-xs text-white/45">{hint}</span> : null}
      {error ? <span className="block text-xs text-rose-300">{error}</span> : null}
    </label>
  )
}
