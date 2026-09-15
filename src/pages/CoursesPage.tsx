import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function CoursesPage() {
  return (
    <div>
      <PageHeader title="Courses" description="Browse the learning tracks available in SkillQuarry." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="JavaScript Foundations" subtitle="Beginner">
          <p>Core syntax, data types, functions, and interactive problem solving.</p>
        </Card>
        <Card title="React Essentials" subtitle="Intermediate">
          <p>Components, state, props, hooks, and structured UI building patterns.</p>
        </Card>
        <Card title="TypeScript Basics" subtitle="Beginner">
          <p>Types, interfaces, generics, and safer frontend code decisions.</p>
        </Card>
      </div>
    </div>
  )
}
