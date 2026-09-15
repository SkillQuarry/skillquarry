import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/courses', label: 'Courses' },
  { to: '/app/bookmarks', label: 'Bookmarks' },
  { to: '/app/progress', label: 'Progress' },
  { to: '/app/profile', label: 'Profile' },
  { to: '/app/settings', label: 'Settings' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-6 md:block">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">SkillQuarry</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Learning Hub</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Log out
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400 md:hidden">SkillQuarry</div>
                <h1 className="text-lg font-semibold text-slate-900">Course Workspace</h1>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <button className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                  Menu
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="page-shell">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
