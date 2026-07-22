import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { clearAuthFeedback, signUp } from '../model/authSlice'
import { AuthLayout } from '../components/AuthLayout'

export function SignUpPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { signUpStatus, error, signUpMessage } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    return () => {
      dispatch(clearAuthFeedback())
    }
  }, [dispatch])

  useEffect(() => {
    if (signUpStatus === 'success') {
      const timer = window.setTimeout(() => {
        navigate('/sign-in')
      }, 1500)

      return () => window.clearTimeout(timer)
    }
  }, [navigate, signUpStatus])

  return (
    <AuthLayout title="Sign up" variant="plain">
      <div className="space-y-5">
        <StatusMessage tone="success" message={signUpMessage} />
        <StatusMessage tone="error" message={error} />
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            dispatch(signUp(form))
          }}
        >
          <InputField
            label="Full name"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            placeholder="Researcher name"
            required
          />
          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="researcher@example.com"
            required
          />
          <InputField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
          <Button
            type="submit"
            busy={signUpStatus === 'loading'}
            className="h-13 w-full"
          >
            Create account
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="font-semibold text-emerald-600 hover:text-emerald-700" to="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
