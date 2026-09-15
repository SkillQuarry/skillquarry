import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { handleAuthCallback } from '../features/auth/auth.service'
import { LoadingState } from '../components/ui/State'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await handleAuthCallback(window.location.search)
        navigate('/app/dashboard', { replace: true })
      } catch (callbackError) {
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : 'Authentication failed. Please try again.',
        )
      }
    }

    void completeSignIn()
  }, [navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="panel max-w-md p-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Authentication error</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return <LoadingState message="Completing sign in..." />
}
