import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function ProgressPage() {
  return (
    <div>
      <PageHeader title="Progress" description="See your learning momentum and completion history." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Course completion" subtitle="Overall progress">
          <div className="h-3 rounded-full bg-slate-200">
            <div className="h-3 w-2/3 rounded-full bg-sky-500" />
          </div>
          <div className="mt-3 text-sm text-slate-600">67% complete</div>
        </Card>
        <Card title="Topics mastered" subtitle="Recent milestones">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Variables and Data Types</li>
            <li>• Functions and Scope</li>
            <li>• Arrays and Objects</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
