import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Manage your learner profile and learning preferences." />
      <Card title="Student profile" subtitle="Beginner learner">
        <div className="space-y-2 text-sm text-slate-600">
          <p>Name: Jane Learner</p>
          <p>Email: jane@example.com</p>
          <p>Level: Beginner</p>
        </div>
      </Card>
    </div>
  )
}
