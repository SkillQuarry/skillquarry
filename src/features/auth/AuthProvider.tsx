import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import {
  type LoginInput,
  type SignUpInput,
  login,
  logout as signOut,
  signUp,
} from './auth.service'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (input: LoginInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<{ session: Session | null } | void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const currentSession = await supabase.auth.getSession()
    setSession(currentSession.data.session)
    setLoading(false)
  }, [])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      await refreshSession()
      if (!mounted) return
    }

    void initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshSession])

  const handleSignIn = useCallback(async (input: LoginInput) => {
    const data = await login(input)
    queryClient.clear()
    setSession(data.session)
  }, [queryClient])

  const handleSignUp = useCallback(async (input: SignUpInput) => {
    const data = await signUp(input)
    queryClient.clear()
    setSession(data.session ?? null)
    return data
  }, [queryClient])

  const handleLogout = useCallback(async () => {
    await signOut()
    queryClient.clear()
    setSession(null)
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}