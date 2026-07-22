import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { clearAuthFeedback, signIn } from '../model/authSlice'
import { AuthLayout } from '../components/AuthLayout'

export function SignInPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error, user } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    return () => {
      dispatch(clearAuthFeedback())
    }
  }, [dispatch])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const nextPath = (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(nextPath, { replace: true })
    }
  }, [location.state, navigate, user])

  return (
    <AuthLayout title="Sign in" variant="plain">
      <div className="space-y-5">
        <StatusMessage tone="error" message={error} />
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            dispatch(signIn(form))
          }}
        >
          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="admin@example.com"
            required
          />
          <InputField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Minimum 6 characters"
            required
          />
          <Button type="submit" busy={status === 'loading'} className="h-13 w-full">
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-emerald-600 hover:text-emerald-700" to="/sign-up">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
