import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { loadCurrentUser } from '../model/authSlice'

type PublicOnlyRouteProps = {
  children: ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const dispatch = useAppDispatch()
  const { token, user, initialized, status } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user && status !== 'loading') {
      dispatch(loadCurrentUser())
    }
  }, [dispatch, status, token, user])

  if (token && !initialized) {
    return <div className="shell shell--center">Restoring your session...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
