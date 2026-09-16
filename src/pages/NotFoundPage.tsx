import { Link } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl">
        <Card className="text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            SkillQuarry
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Page not found</h1>
          <p className="mt-4 text-base text-slate-600">
            The page you requested does not exist or may have moved. Head back to your learning dashboard to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/app/dashboard">
              <Button className="w-full sm:w-auto">Go to dashboard</Button>
            </Link>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
