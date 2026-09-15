import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function TopicPage() {
  return (
    <div>
      <PageHeader title="Topic: Variables and Data Types" description="Understand how JavaScript stores and manipulates information." />
      <div className="space-y-4">
        <Card title="Explanation">
          <p>Variables hold values that can be reused throughout your program. Data types define the kind of value being stored, such as strings, numbers, booleans, arrays, and objects.</p>
        </Card>
        <Card title="Example">
          <pre className="overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm text-slate-800">const name = 'SkillQuarry';
const lessons = 8;
const isActive = true;</pre>
        </Card>
        <Card title="Practice">
          <p>Try creating a variable for a user name and calculate a total using numbers.</p>
        </Card>
      </div>
    </div>
  )
}
