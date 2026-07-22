import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { signOut } from '../model/authSlice'

export function UnauthorizedPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-8">
      <section className="glass-panel flex w-full flex-col gap-5 rounded-3xl p-6 sm:max-w-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-500">
          Access restricted
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          ADMIN role required
        </h1>
        <p className="leading-7 text-slate-600">
          Signed in as <strong>{user?.email ?? 'unknown user'}</strong>. The backend
          protects all admin routes with bearer auth plus the `ADMIN` role, so this
          account cannot open the dashboard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => dispatch(signOut())}>
            Sign out
          </Button>
          <Link
            className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold tracking-wide text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
            to="/sign-in"
          >
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
