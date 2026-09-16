import { useState } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMobileMenuOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const handleNavigate = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm md:block">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">SkillQuarry</div>
            <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Learning Hub</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
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
            className="mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
          >
            Log out
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border)] bg-[var(--panel)]/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] md:hidden">SkillQuarry</div>
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">Course Workspace</h1>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
                >
                  {mobileMenuOpen ? 'Close' : 'Menu'}
                </button>
              </div>
            </div>
          </header>

          {mobileMenuOpen ? (
            <div className="border-b border-[var(--border)] bg-[var(--panel)] p-4 md:hidden">
              <nav className="space-y-2">
                {navItems.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={handleNavigate}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                          : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-left text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
                >
                  Log out
                </button>
              </nav>
            </div>
          ) : null}

          <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
            <div className="page-shell">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
