import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { signOut } from '../model/authSlice'

export function UnauthorizedPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <main className="shell shell--center">
      <section className="panel panel--narrow">
        <p className="eyebrow">Access restricted</p>
        <h1>ADMIN role required</h1>
        <p>
          Signed in as <strong>{user?.email ?? 'unknown user'}</strong>. The backend
          protects all admin routes with bearer auth plus the `ADMIN` role, so this
          account cannot open the dashboard.
        </p>
        <div className="row">
          <Button type="button" onClick={() => dispatch(signOut())}>
            Sign out
          </Button>
          <Link className="button button--secondary" to="/sign-in">
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
