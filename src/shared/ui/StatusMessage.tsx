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
    success: 'border-lime-300/20 bg-lime-300/12 text-lime-100',
    error: 'border-rose-300/20 bg-rose-400/12 text-rose-100',
    info: 'border-sky-300/20 bg-sky-400/12 text-sky-100',
  }[tone]

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClasses}`}>
      {message}
    </div>
  )
}
