type ToastProps = {
  tone?: 'success' | 'error' | 'info'
  message?: string | null
  onClose?: () => void
}

export function Toast({ tone = 'info', message, onClose }: ToastProps) {
  if (!message) return null

  const toneClasses = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  }[tone]

  const iconClasses = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500',
  }[tone]

  return (
    <>
      <div
        className={`pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl animate-[toastIn_0.22s_ease-out] ${toneClasses}`}
        role="status"
        aria-live="polite"
      >
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${iconClasses}`} />
        <p className="min-w-0 flex-1 text-sm font-semibold leading-6">{message}</p>
        {onClose ? (
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-current/60 transition hover:bg-white/70 hover:text-current"
            onClick={onClose}
            aria-label="Close toast"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
