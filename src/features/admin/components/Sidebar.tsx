import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import type { Role } from '../../auth/types/auth'

type NavItem = {
  to: string
  label: string
  roles?: Role[]
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/create', label: 'Create Submission' },
  { to: '/dashboard/pending-researchers', label: 'Pending Researchers', roles: ['ADMIN'] },
  { to: '/dashboard/pending-submissions', label: 'Pending Submissions', roles: ['ADMIN'] },
  { to: '/dashboard/published', label: 'Published Submissions' },
  { to: '/dashboard/researchers', label: 'All Researchers', roles: ['ADMIN'] },
] satisfies Array<{ to: string; label: string; roles?: Role[] }>

export function Sidebar() {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = useAppSelector((state) => state.auth.user?.role)
  const navigate = useNavigate()
  const loc = useLocation()
  const currentHash = loc.hash ? loc.hash.replace('#', '') : ''
  const visibleNavItems = navItems.filter((item) => !item.roles || (role && item.roles.includes(role)))

  useEffect(() => {
    function onOpen() {
      setMobileOpen(true)
    }

    window.addEventListener('mantal:open-sidebar', onOpen as EventListener)
    return () => window.removeEventListener('mantal:open-sidebar', onOpen as EventListener)
  }, [])

  function handleNav(to: string) {
    const [path, hash] = to.split('#')
    if (loc.pathname === path) {
      if (hash) {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      navigate(path + (hash ? '#' + hash : ''))
    }
  }

  return (
    <>
      <aside className={`hidden shrink-0 border-r border-slate-200/80 bg-white/60 p-4 transition-all duration-200 md:block ${open ? 'w-64' : 'w-16'}`} 
        style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${open ? 'opacity-100' : 'opacity-0 hidden'}`}>Admin</h2>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-sm text-slate-600"
          >
            {open ? '<' : '>'}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {visibleNavItems.map((it) => {
            const [, hash] = it.to.split('#')
            const active = loc.pathname === it.to.split('#')[0] && (hash ? currentHash === hash : loc.hash === '')
            return (
              <button
                key={it.to}
                onClick={() => handleNav(it.to)}
                className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${active ? 'bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-100' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                <span className={`${open ? '' : 'hidden'}`}>{it.label}</span>
                <span className={`${open ? 'hidden' : 'inline-block'}`}>{it.label.charAt(0)}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="md:hidden">
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-[min(18rem,88vw)] bg-white p-4 overflow-auto shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Admin</h2>
                <button onClick={() => setMobileOpen(false)} className="cursor-pointer text-slate-600">Close</button>
              </div>
              <nav className="flex flex-col gap-2">
                {visibleNavItems.map((it) => (
                  <button
                    key={it.to}
                    onClick={() => {
                      setMobileOpen(false)
                      handleNav(it.to)
                    }}
                    className="w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    {it.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
