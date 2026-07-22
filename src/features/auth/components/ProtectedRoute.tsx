import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { loadCurrentUser } from '../model/authSlice'
import type { Role } from '../types/auth'

type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { token, user, initialized, status } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user && status !== 'loading') {
      dispatch(loadCurrentUser())
    }
  }, [dispatch, status, token, user])

  if (!token) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  if (!initialized || (token && !user)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 text-sm font-semibold text-slate-500">
        Checking your dashboard session...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 text-sm font-semibold text-slate-500">
        Checking your dashboard session...
      </div>
    )
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
