import { useEffect, useState } from 'react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/AuthProvider'

const THEME_STORAGE_KEY = 'skillquarry-theme'
type ThemePreference = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: ThemePreference) {
  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement

  root.classList.toggle('dark', actualTheme === 'dark')
  root.dataset.theme = actualTheme
  root.style.colorScheme = actualTheme
}

export function SettingsPage() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? 'system'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const handleThemeChange = (nextTheme: ThemePreference) => {
    setTheme(nextTheme)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Adjust your app preferences and keep your learning workspace feeling right." />

      <Card title="Appearance" subtitle="Choose how the app should look on your device.">
        <div className="space-y-3">
          {(['light', 'dark', 'system'] as ThemePreference[]).map((option) => (
            <label key={option} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-primary)]">
              <span className="font-medium capitalize">{option}</span>
              <input
                type="radio"
                name="theme"
                checked={theme === option}
                onChange={() => handleThemeChange(option)}
                aria-label={`Set theme to ${option}`}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card title="Account" subtitle="Your signed-in profile details.">
        <div className="space-y-3 text-sm text-[var(--text-muted)]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Email</p>
            <p className="mt-1 text-base text-[var(--text-primary)]">{user?.email ?? 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Display name</p>
            <p className="mt-1 text-base text-[var(--text-primary)]">
              {user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Learner'}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Sign out" subtitle="Keep your workspace secure when you’re done.">
        <div className="flex justify-start">
          <Button variant="secondary" onClick={handleLogout} type="button">
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  )
}
