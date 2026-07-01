import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function Panel({ title, description, action, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
