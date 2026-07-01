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
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="eyebrow">
            {isAdmin ? 'Protected Admin Console' : 'Protected Researcher Console'}
          </p>
          <h1>District risk operations dashboard</h1>
          <p className="muted">
            Signed in as {user?.fullName} ({user?.email})
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => dispatch(signOut())}>
          Sign out
        </Button>
      </header>
      {children}
    </main>
  )
}
