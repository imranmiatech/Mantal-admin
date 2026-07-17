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
  const { status, error, user, signUpMessage } = useAppSelector((state) => state.auth)
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
    <AuthLayout
      title="Sign in to continue"
      subtitle="Access the shared dashboard with your approved account. Role-based routing and bearer token checks stay aligned with the backend."
      asideTitle="One access point for district risk operations"
      asideText="Use the same clean entry point for admin approvals, researcher submissions, and protected dashboard workflows without bouncing between mismatched screens."
    >
      <div className="space-y-6">
        <StatusMessage tone="success" message={signUpMessage} />
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
        <div className="rounded-3xl border border-white/10 bg-white/4 p-4 text-sm text-white/65">
          <p className="font-medium text-white">Need a researcher account?</p>
          <p className="mt-1 leading-6">
            Create one here and wait for admin approval before the first login.{' '}
            <Link className="font-semibold text-lime-200 hover:text-lime-100" to="/sign-up">
              Go to sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
