import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../features/auth/AuthProvider'
import { useCourseQuery, useCoursesQuery, useProgressQuery } from '../../features/queries'
import { ContactModal } from '../support/ContactModal'
import { PrimaryNavigation } from './PrimaryNavigation'

function formatActivity(value: string | null) {
  return value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Not started'
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { data: courses = [] } = useCoursesQuery()
  const { data: progressRows = [] } = useProgressQuery()
  const courseId = location.pathname.match(/\/app\/courses\/([^/]+)/)?.[1] ?? courses[0]?.id ?? null
  const { data: currentCourse } = useCourseQuery(courseId)
  const [mobileSecondaryMenuOpen, setMobileSecondaryMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const accountRef = useRef<HTMLDivElement>(null)
  const edgeStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const closeAccountMenu = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeAccountMenu)
    return () => document.removeEventListener('mousedown', closeAccountMenu)
  }, [])

  useEffect(() => {
    const closeDialogs = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
        setLogoutOpen(false)
      }
    }
    window.addEventListener('keydown', closeDialogs)
    return () => window.removeEventListener('keydown', closeDialogs)
  }, [])

  const lastActivity = useMemo(() => {
    const topicIds = new Set(currentCourse?.modules.flatMap((module) => module.topics.map((topic) => topic.id)) ?? [])
    return progressRows
      .filter((row) => topicIds.has(row.topic_id) && row.last_activity_at)
      .sort((left, right) => new Date(right.last_activity_at ?? 0).getTime() - new Date(left.last_activity_at ?? 0).getTime())[0]?.last_activity_at ?? null
  }, [currentCourse, progressRows])

  const displayName = typeof user?.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()
    ? user.user_metadata.display_name
    : user?.email?.split('@')[0] ?? 'Learner'

  const closeMenus = () => {
    setMobileSecondaryMenuOpen(false)
    setAccountMenuOpen(false)
  }

  const handleEdgePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) {
      edgeStart.current = { x: event.clientX, y: event.clientY }
    }
  }

  const handleEdgePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = edgeStart.current
    edgeStart.current = null
    if (!start || !sidebarCollapsed) return

    const deltaX = event.clientX - start.x
    const deltaY = Math.abs(event.clientY - start.y)
    if (deltaX > 48 && deltaX > deltaY * 1.5) {
      setSidebarCollapsed(false)
    }
  }

  const handleLogout = async () => {
    setLogoutOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="flex min-h-screen min-w-0">
        <PrimaryNavigation collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)} onNavigate={() => setMobileSecondaryMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border)] bg-[var(--panel)]/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" aria-label={mobileSecondaryMenuOpen ? 'Close navigation menu' : 'Open secondary navigation menu'} onClick={() => setMobileSecondaryMenuOpen((open) => !open)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] md:hidden">☰</button>
                <img src="/brand/primary_full_logo.png" alt="SkillQuarry" className="hidden h-8 max-w-[9rem] object-contain object-left sm:block" />
                <img src="/brand/logo_mark.png" alt="SkillQuarry" className="h-8 w-8 object-contain sm:hidden" />
                <h1 className="hidden truncate text-lg font-semibold md:block">{currentCourse?.title ?? 'Learning Hub'}</h1>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block"><div className="text-sm font-semibold">{now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</div><div className="text-xs text-[var(--text-soft)]">Last activity · {formatActivity(lastActivity)}</div></div>
                <div ref={accountRef} className="relative">
                  <button type="button" aria-label="Open account menu" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1.5"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">{displayName.charAt(0).toUpperCase()}</span><span className="hidden max-w-28 truncate sm:inline">{displayName}</span><span aria-hidden="true">⌄</span></button>
                  {accountMenuOpen ? <div className="absolute right-0 z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-2 shadow-xl" role="menu"><div className="border-b border-[var(--border)] px-3 py-2"><div className="font-medium">{displayName}</div><div className="truncate text-xs text-[var(--text-soft)]">{user?.email}</div></div><NavLink to="/app/profile" role="menuitem" onClick={closeMenus} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]">My Profile</NavLink><NavLink to="/app/settings" role="menuitem" onClick={closeMenus} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]">Settings</NavLink><NavLink to="/app/about" role="menuitem" onClick={closeMenus} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--surface-hover)]">About SkillQuarry</NavLink><button type="button" role="menuitem" onClick={() => { setAccountMenuOpen(false); setContactOpen(true) }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-hover)]">Contact & Help</button><button type="button" role="menuitem" onClick={() => { setAccountMenuOpen(false); setLogoutOpen(true) }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-hover)]">Log out</button></div> : null}
                </div>
              </div>
            </div>

            {mobileSecondaryMenuOpen ? <div className="mt-3 border-t border-[var(--border)] pt-3 md:hidden"><div className="mb-3 flex items-center gap-3"><img src="/brand/logo_mark.png" alt="" className="h-8 w-8 object-contain" /><span className="text-sm font-semibold">Learning Hub</span></div><nav className="space-y-1" aria-label="Secondary navigation"><NavLink to="/app/profile" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-[var(--surface-hover)]">Profile</NavLink><NavLink to="/app/settings" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-[var(--surface-hover)]">Settings</NavLink><NavLink to="/app/about" onClick={closeMenus} className="block rounded-xl px-3 py-3 text-sm hover:bg-[var(--surface-hover)]">About SkillQuarry</NavLink><button type="button" onClick={() => { setMobileSecondaryMenuOpen(false); setContactOpen(true) }} className="block w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-[var(--surface-hover)]">Contact & Help</button></nav></div> : null}
          </header>

          <main className="sq-mobile-content min-w-0 flex-1 overflow-x-hidden px-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6"><div className="page-shell"><Outlet /></div></main>
        </div>
      </div>

      <div className="fixed left-0 top-0 z-20 hidden h-full w-3 md:block" aria-hidden="true" onPointerDown={handleEdgePointerDown} onPointerUp={handleEdgePointerUp} />
      {logoutOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onClick={() => setLogoutOpen(false)}><div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="logout-title" onClick={(event) => event.stopPropagation()}><h2 id="logout-title" className="text-xl font-semibold">Log out?</h2><p className="mt-2 text-sm text-[var(--text-muted)]">Are you sure you want to log out?</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setLogoutOpen(false)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm">Cancel</button><button type="button" onClick={() => void handleLogout()} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm text-white">Log out</button></div></div></div> : null}
      {contactOpen ? <ContactModal open onClose={() => setContactOpen(false)} /> : null}
    </div>
  )
}
