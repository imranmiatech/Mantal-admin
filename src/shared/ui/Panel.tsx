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
    <section className={`glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 ${className}`.trim()}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          {description ? <p className="text-sm sm:text-base text-slate-500">{description}</p> : null}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </section>
  )
}
