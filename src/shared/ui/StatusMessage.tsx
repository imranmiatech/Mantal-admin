type StatusMessageProps = {
  tone?: 'success' | 'error' | 'info'
  message?: string | null
}

export function StatusMessage({
  tone = 'info',
  message,
}: StatusMessageProps) {
  if (!message) {
    return null
  }

  const toneClasses = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm',
    error: 'border-rose-200 bg-rose-50 text-rose-800 shadow-sm',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-800 shadow-sm',
  }[tone]

  return (
    <div className={`rounded-xl border backdrop-blur-md px-5 py-3.5 text-sm font-medium leading-relaxed tracking-wide transition-all ${toneClasses}`}>
      {message}
    </div>
  )
}
