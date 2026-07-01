import type { ReactNode } from 'react'

type AuthLayoutProps = {
  title: string
  subtitle: string
  asideTitle: string
  asideText: string
  children: ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  asideTitle,
  asideText,
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08110c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,196,61,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%),linear-gradient(135deg,#08110c_0%,#0b1710_45%,#14251b_100%)]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-lime-300/12 blur-3xl" />
      <div className="absolute bottom-0 right-[-6rem] h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-lime-200">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Mantal Health Access
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {asideTitle}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                {asideText}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Auth</p>
              <p className="mt-3 text-lg font-semibold">Secure bearer sessions</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Role</p>
              <p className="mt-3 text-lg font-semibold">Admin and researcher flows</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Review</p>
              <p className="mt-3 text-lg font-semibold">Approval-aware onboarding</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0f1b14]/88 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-lime-200/85">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
              <p className="max-w-lg text-sm leading-6 text-white/62 sm:text-base">
                {subtitle}
              </p>
            </div>
            <div className="mt-8 space-y-5">
              {children}
            </div>
          </div>
        </section>
      </section>
      </div>
    </main>
  )
}
