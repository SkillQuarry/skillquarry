import { useEffect } from 'react'

import { AppProviders } from './providers'
import { AppRouter } from './router'
import { AppOpeningSplash } from '../components/branding/AppOpeningSplash'

type ThemePreference = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'skillquarry-theme'

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

export default function App() {
  useEffect(() => {
    const initialTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? 'system'
    applyTheme(initialTheme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? 'system'

      if (storedTheme === 'system') {
        applyTheme('system')
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemChange)
      return () => mediaQuery.removeEventListener('change', handleSystemChange)
    }

    mediaQuery.addListener(handleSystemChange)
    return () => mediaQuery.removeListener(handleSystemChange)
  }, [])

  return (
    <AppProviders>
      <AppRouter />
      <AppOpeningSplash />
    </AppProviders>
  )
}
