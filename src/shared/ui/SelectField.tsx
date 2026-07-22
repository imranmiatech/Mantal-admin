import type { SelectHTMLAttributes } from 'react'

type Option = {
  label: string
  value: string
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: Option[]
  className?: string
}

export function SelectField({ label, options, className = '', ...props }: SelectFieldProps) {
  return (
    <label className={`block space-y-2 ${className}`.trim()}>
      <span className="block text-sm font-medium text-slate-700 tracking-wide">{label}</span>
      <select
        className="glass-input h-12 w-full rounded-xl px-4 outline-none transition-all duration-200 cursor-pointer appearance-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
