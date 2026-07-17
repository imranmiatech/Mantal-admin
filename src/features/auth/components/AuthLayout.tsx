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
    <main className="flex min-h-screen items-center justify-center bg-[#08110c] px-4 py-8 text-white sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1b14] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="text-sm leading-6 text-white/65 sm:text-base">{subtitle}</p>
        </div>
        <div className="mt-8 space-y-5">{children}</div>
      </section>
    </main>
  )
}
