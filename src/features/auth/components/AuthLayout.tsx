import type { ReactNode } from 'react'

type AuthLayoutProps = {
  title?: string
  subtitle?: string
  asideTitle?: string
  asideText?: string
  variant?: 'split' | 'plain'
  children: ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  asideTitle,
  asideText,
  variant = 'split',
  children,
}: AuthLayoutProps) {
  if (variant === 'plain') {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 text-slate-900 sm:px-6">
        <section className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {title || subtitle ? (
              <div className="mb-8 space-y-2 text-center">
                {title ? (
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="text-sm leading-6 text-slate-500">{subtitle}</p>
                ) : null}
              </div>
            ) : null}
            {children}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-[#08110c] text-white lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <aside className="flex w-full flex-col justify-center gap-5 px-6 py-10 sm:px-10 lg:px-16">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-300">
          Mantal Admin
        </p>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {asideTitle}
          </h1>
          <p className="text-base leading-7 text-white/65 sm:text-lg">{asideText}</p>
        </div>
      </aside>

      <section className="flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
        <div className="w-full rounded-3xl border border-white/10 bg-[#0f1b14] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] sm:p-8">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
            <p className="text-sm leading-6 text-white/65 sm:text-base">{subtitle}</p>
          </div>
          <div className="mt-8 space-y-5">{children}</div>
        </div>
      </section>
    </main>
  )
}
