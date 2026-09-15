import { Link } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function CourseDetailsPage() {
  return (
    <div>
      <PageHeader title="JavaScript Foundations" description="A structured beginner path through the essentials of JavaScript." action={<Link to="/app/courses"><Button variant="secondary">Back to courses</Button></Link>} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Course overview" subtitle="What you will learn">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Variables and data types</li>
            <li>• Functions and scope</li>
            <li>• Arrays and objects</li>
            <li>• Loops and conditionals</li>
          </ul>
        </Card>
        <Card title="Modules" subtitle="3 modules ready">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Module 1: Getting started</li>
            <li>• Module 2: Logic and flow</li>
            <li>• Module 3: Problem solving</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
