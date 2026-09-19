import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../../features/auth/AuthProvider'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/app/courses', label: 'Courses', icon: 'courses' },
  { to: '/app/bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  { to: '/app/progress', label: 'Progress', icon: 'progress' },
  { to: '/app/profile', label: 'Profile', icon: 'profile' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' },
  { to: '/app/about', label: 'About', icon: 'about' },
] as const

function NavIcon({ name, className = '' }: { name: (typeof navItems)[number]['icon']; className?: string }) {
  const common = `h-4 w-4 ${className}`

  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M3 13.5h7.5V21H3v-7.5Zm10.5-9h7.5V11h-7.5V4.5Zm-10.5 0h7.5V9H3V4.5Zm10.5 9h7.5V21h-7.5v-7.5Z" />
        </svg>
      )
    case 'courses':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.5 1.5h10.5M8 12h8M8 15.5h6" />
        </svg>
      )
    case 'bookmark':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v14l-6.5-4.5L5.5 20V6A1.5 1.5 0 0 1 7 4.5Z" />
        </svg>
      )
    case 'progress':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M5 19V9m7 10V5m7 14v-8" />
        </svg>
      )
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 7a7 7 0 1 1 14 0" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M9.5 3.5h5l.8 2.8a6.6 6.6 0 0 1 2.5 1.5l2.6-.9 2.3 2.3-1 2.6a6.6 6.6 0 0 1 1.5 2.5l2.8.8v5l-2.8.8a6.6 6.6 0 0 1-1.5 2.5l1 2.6-2.3 2.3-2.6-1a6.6 6.6 0 0 1-2.5 1.5l-.8 2.8h-5l-.8-2.8a6.6 6.6 0 0 1-2.5-1.5l-2.6 1-2.3-2.3 1-2.6A6.6 6.6 0 0 1 3.5 15l-2.8-.8v-5l2.8-.8a6.6 6.6 0 0 1 1.5-2.5l-1-2.6 2.3-2.3 2.6 1a6.6 6.6 0 0 1 2.5-1.5L9.5 3.5Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'about':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 10.5V16M12 7.5h.01" />
        </svg>
      )
    default:
      return null
  }
}

export function AppLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
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
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm backdrop-blur-sm md:block">
          <div className="mb-8 flex items-center gap-3">
            <NavLink to="/app/dashboard" className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-[var(--surface-hover)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-sm font-bold text-white shadow-sm">
                S
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">SkillQuarry</div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Learning Hub</h2>
              </div>
            </NavLink>
          </div>

          <nav className="space-y-1.5">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-100 text-sky-700 shadow-sm ring-1 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:ring-sky-800'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <NavIcon name={icon} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-sky-300 hover:bg-[var(--surface-hover)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M10 17v1.5A1.5 1.5 0 0 0 11.5 20h6A1.5 1.5 0 0 0 19 18.5v-13A1.5 1.5 0 0 0 17.5 4h-6A1.5 1.5 0 0 0 10 5.5V7m-2 5h9m0 0-2.5-2.5M17 12l-2.5 2.5" />
              </svg>
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border)] bg-[var(--panel)]/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] md:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>

                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-600 md:hidden">SkillQuarry</div>
                  <h1 className="truncate text-lg font-semibold text-[var(--text-primary)]">Course Workspace</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <NavLink
                  to="/app/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M9.5 3.5h5l.8 2.8a6.6 6.6 0 0 1 2.5 1.5l2.6-.9 2.3 2.3-1 2.6a6.6 6.6 0 0 1 1.5 2.5l2.8.8v5l-2.8.8a6.6 6.6 0 0 1-1.5 2.5l1 2.6-2.3 2.3-2.6-1a6.6 6.6 0 0 1-2.5 1.5l-.8 2.8h-5l-.8-2.8a6.6 6.6 0 0 1-2.5-1.5l-2.6 1-2.3-2.3 1-2.6A6.6 6.6 0 0 1 3.5 15l-2.8-.8v-5l2.8-.8a6.6 6.6 0 0 1 1.5-2.5l-1-2.6 2.3-2.3 2.6 1a6.6 6.6 0 0 1 2.5-1.5L9.5 3.5Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </NavLink>

                <NavLink
                  to="/app/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'L'}
                  </span>
                  <span>{user?.email?.split('@')[0] ?? 'Learner'}</span>
                </NavLink>
              </div>
            </div>
          </header>

          {mobileMenuOpen ? (
            <div className="border-b border-[var(--border)] bg-[var(--panel)] p-3 md:hidden">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-2">
                <nav className="space-y-1">
                  {navItems.map(({ to, label, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={handleNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                            : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      <NavIcon name={icon} className="shrink-0" />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] dark:bg-slate-900"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M10 17v1.5A1.5 1.5 0 0 0 11.5 20h6A1.5 1.5 0 0 0 19 18.5v-13A1.5 1.5 0 0 0 17.5 4h-6A1.5 1.5 0 0 0 10 5.5V7m-2 5h9m0 0-2.5-2.5M17 12l-2.5 2.5" />
                  </svg>
                  Log out
                </button>
              </div>
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
