import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="page-shell">
        <header className="mb-12 flex items-center justify-between">
          <div className="text-xl font-bold text-slate-900">SkillQuarry</div>
          <nav className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get started</Button>
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.25fr_0.75fr] lg:p-12">
          <div>
            <Badge>Learning paths for beginners</Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Learn programming with guided practice.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              SkillQuarry helps students move from concepts to confidence through structured learning, examples, and progress tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button>Start learning</Button>
              </Link>
              <Link to="/app/dashboard">
                <Button variant="secondary">Preview dashboard</Button>
              </Link>
            </div>
          </div>

          <Card title="V1 Foundation" subtitle="Frontend structure only">
            <ul className="space-y-3 text-sm text-slate-600">
              <li>• Course → Module → Topic flow</li>
              <li>• Practice and explanation placeholders</li>
              <li>• Progress and notes foundation</li>
              <li>• Responsive app shell ready for growth</li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  )
}
