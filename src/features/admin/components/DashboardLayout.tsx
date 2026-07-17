import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { signOut } from '../../auth/model/authSlice'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-3xl bg-white/70 border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-1">
              {isAdmin ? 'Protected Admin Console' : 'Protected Researcher Console'}
            </p>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              District Risk Operations
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Signed in as <span className="text-slate-700 font-semibold">{user?.fullName}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button type="button" variant="secondary" onClick={() => dispatch(signOut())} className="min-h-10 px-4 py-2 text-xs sm:text-sm">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-8">
        {children}
      </main>
    </div>
  )
}
