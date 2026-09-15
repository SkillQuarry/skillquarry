import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Track your learning progress and continue where you left off." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Current streak" subtitle="7 days">
          <div className="text-3xl font-bold text-slate-900">7 days</div>
        </Card>
        <Card title="Courses started" subtitle="3 active">
          <div className="text-3xl font-bold text-slate-900">03</div>
        </Card>
        <Card title="Avg. completion" subtitle="This month">
          <div className="text-3xl font-bold text-slate-900">68%</div>
        </Card>
      </div>
    </div>
  )
}
