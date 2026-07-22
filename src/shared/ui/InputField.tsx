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
  const labelClass = "block text-sm font-medium text-slate-700 tracking-wide"
  const hintClass = "block text-xs text-slate-500 mt-1.5"
  const errorClass = "block text-xs text-rose-500 mt-1.5 font-medium"

  if (as === 'textarea') {
    const textareaProps = props as TextareaProps

    return (
      <label className={`block space-y-2 ${className}`.trim()}>
        <span className={labelClass}>{label}</span>
        <textarea
          className="glass-input min-h-[140px] w-full rounded-xl px-4 py-3 outline-none transition-all duration-200 resize-y"
          {...textareaProps}
        />
        {hint ? <span className={hintClass}>{hint}</span> : null}
        {error ? <span className={errorClass}>{error}</span> : null}
      </label>
    )
  }

  const inputProps = props as InputProps

  return (
    <label className={`block space-y-2 ${className}`.trim()}>
      <span className={labelClass}>{label}</span>
      <input
        className="glass-input h-12 w-full rounded-xl px-4 outline-none transition-all duration-200"
        {...inputProps}
      />
      {hint ? <span className={hintClass}>{hint}</span> : null}
      {error ? <span className={errorClass}>{error}</span> : null}
    </label>
  )
}
