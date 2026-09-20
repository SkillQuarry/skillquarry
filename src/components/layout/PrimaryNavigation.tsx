import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: 'dashboard' },
  { to: '/app/courses', label: 'Courses', shortLabel: 'Courses', icon: 'courses' },
  { to: '/app/bookmarks', label: 'Bookmarks', shortLabel: 'Saved', icon: 'bookmarks' },
  { to: '/app/progress', label: 'Progress', shortLabel: 'Progress', icon: 'progress' },
  { to: '/app/notes', label: 'Notes / Doubts', shortLabel: 'Notes', icon: 'notes' },
] as const

type NavIconName = (typeof navItems)[number]['icon']

type PrimaryNavigationProps = {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}

function NavIcon({ name }: { name: NavIconName }) {
  const className = 'h-5 w-5 shrink-0'

  switch (name) {
    case 'dashboard':
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>
    case 'courses':
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10.5h6" /></svg>
    case 'bookmarks':
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M7 4h10a1.5 1.5 0 0 1 1.5 1.5V21L12 17.5 5.5 21V5.5A1.5 1.5 0 0 1 7 4Z" /></svg>
    case 'progress':
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 19V11M10 19V5M16 19v-8M22 19V3" /><path d="m3 7 5-3 5 2 7-4" /></svg>
    case 'notes':
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M5 3.5h14v17H5zM8 7h8M8 11h8M8 15h5" /></svg>
  }
}

export function PrimaryNavigation({ collapsed, onToggle, onNavigate }: PrimaryNavigationProps) {
  return (
    <>
      <aside className={`sq-desktop-nav relative h-screen shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-[var(--border)] bg-[var(--panel)] p-3 shadow-sm transition-[width] duration-200 ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className={`mb-7 flex items-center gap-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <NavLink to="/app/dashboard" aria-label="SkillQuarry Learning Hub" className="flex min-w-0 items-center gap-3 rounded-xl p-1 hover:bg-[var(--surface-hover)]">
            <img src="/brand/logo_mark.png" alt="" className="h-10 w-10 shrink-0 object-contain" />
            {collapsed ? null : <img src="/brand/primary_full_logo.png" alt="SkillQuarry" className="max-w-[10rem] object-contain object-left" />}
          </NavLink>
          <button type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggle} className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--surface-hover)] ${collapsed ? 'absolute right-1 top-1' : ''}`}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>
        <nav className="space-y-1.5" aria-label="Learning navigation">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined} className={({ isActive }) => `flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${isActive ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}><NavIcon name={item.icon} />{collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}</NavLink>)}
        </nav>
      </aside>

      <nav className="sq-mobile-nav" aria-label="Primary navigation">
        {navItems.map((item) => <NavLink key={item.to} to={item.to} aria-label={item.label} onClick={onNavigate} className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-500 ${isActive ? 'text-sky-600' : 'text-[var(--text-soft)]'}`}><NavIcon name={item.icon} /><span className="truncate">{item.shortLabel}</span></NavLink>)}
      </nav>
    </>
  )
}
