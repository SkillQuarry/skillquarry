import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/AuthProvider'

export function ProfilePage() {
  const { user } = useAuth()

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Learner'
  const email = user?.email ?? 'Not available'
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Not available'

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your learner account details and platform information." />

      <Card title="My info" subtitle="Account overview">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Display name</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{displayName}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Email</p>
            <p className="mt-2 break-all text-lg font-semibold text-[var(--text-primary)]">{email}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Learner level</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              {user?.user_metadata?.level ?? 'Beginner'}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Account created</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{createdAt}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
