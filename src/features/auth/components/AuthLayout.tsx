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

  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08110c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,196,61,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_26%),linear-gradient(135deg,#08110c_0%,#0b1710_45%,#14251b_100%)]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-lime-300/12 blur-3xl" />
      <div className="absolute bottom-0 right-[-6rem] h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-[600px] grid-cols-1 gap-8  px-5 py-10">
        

        <section className="flex items-center justify-center">
          <div className="w-full max-w-[600px] rounded-[2rem] border border-white/10 bg-[#0f1b14]/88 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
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
      </div>
    </main>
  )
}
