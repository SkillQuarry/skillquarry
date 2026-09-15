import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Adjust your app preferences and learning environment." />
      <Card title="Preferences">
        <div className="space-y-3 text-sm text-slate-600">
          <p>• Theme: Light mode ready</p>
          <p>• Notifications: Enabled</p>
          <p>• Progress reminders: Weekly</p>
        </div>
      </Card>
    </div>
  )
}
