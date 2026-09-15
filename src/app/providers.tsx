import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth/AuthProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export const Providers = AppProviders
export default AppProviders