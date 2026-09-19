import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About SkillQuarry"
        description="A focused learning platform for building fundamentals step by step."
      />

      <Card title="Learn. Understand. Practice. Build.">
        <div className="space-y-4 text-[var(--text-muted)]">
          <p>
            SkillQuarry is a beginner-friendly learning platform designed to help learners build programming skills
            with clear lessons, practical examples, and guided progress.
          </p>
          <p>
            The current focus is Java learning, with lessons structured to help learners understand concepts before
            applying them in practice.
          </p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm">
            <p className="font-medium text-[var(--text-primary)]">Current focus</p>
            <p className="mt-2">Java learning path</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
