import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { signOut } from '../../auth/model/authSlice'
import { Sidebar } from './Sidebar'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-3xl bg-white/70 border-b border-slate-200/80 px-3 py-2.5 sm:px-8 sm:py-4 lg:px-12">
        <div className="flex w-full flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-1">
              {isAdmin ? 'Protected Admin Console' : 'Protected Researcher Console'}
            </p>
            <h1 className="text-lg font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight sm:text-2xl">
              District Risk Operations
            </h1>
            <p className="truncate text-slate-500 text-xs mt-0.5 sm:text-sm">
              Signed in as <span className="text-slate-700 font-semibold">{user?.fullName}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-4">
            <button
              className="min-h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm md:hidden"
              onClick={() => {
                const ev = new CustomEvent('mantal:open-sidebar')
                window.dispatchEvent(ev)
              }}
              type="button"
            >
              Menu
            </button>
            <Button type="button" variant="secondary" onClick={() => dispatch(signOut())} className="min-h-10 w-full px-4 py-2 text-xs sm:w-fit sm:text-sm">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full px-1.5 py-4 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex w-full gap-4 lg:gap-8">
          <Sidebar />
          <main className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
