import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { loadCurrentUser } from '../model/authSlice'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
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
    return <div className="shell shell--center">Checking your dashboard session...</div>
  }

  if (!user) {
    return <div className="shell shell--center">Checking your dashboard session...</div>
  }

  return <>{children}</>
}
