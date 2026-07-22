import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, description, action, children, className = '' }: PanelProps) {
  return (
    <section className={`glass-panel flex w-full min-w-0 flex-col gap-4 rounded-2xl p-2 sm:gap-6 sm:rounded-3xl sm:p-8 ${className}`.trim()}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          {description ? <p className="text-sm sm:text-base text-slate-500">{description}</p> : null}
        </div>
        {action && <div className="w-full flex-shrink-0 sm:w-auto">{action}</div>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </section>
  )
}
