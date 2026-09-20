import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="About SkillQuarry" description="A student guide for learning programming concepts with clarity and momentum." />

      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <img src="/brand/logo_mark.png" alt="" className="h-12 w-12 object-contain" />
        <img src="/brand/primary_full_logo.png" alt="SkillQuarry" className="h-8 max-w-[13rem] object-contain object-left" />
      </div>

      <Card title="What is SkillQuarry?">
        <div className="space-y-4 text-[var(--text-muted)]">
          <p>SkillQuarry is designed for students who find traditional tutorials and documentation difficult to turn into understanding.</p>
          <p>The goal is not simply to provide information. Each topic helps you move from an explanation to seeing an example, trying an idea, solving a problem, and completing the lesson.</p>
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {['Learn', 'Understand', 'See', 'Try', 'Solve', 'Practice', 'Complete'].map((step, index) => <div key={step} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-center text-sm font-medium text-[var(--text-primary)]"><span className="block text-xs text-sky-600">{index + 1}</span>{step}</div>)}
          </div>
        </div>
      </Card>

      <Card title="How SkillQuarry works">
        <div className="grid gap-4 text-sm text-[var(--text-muted)] md:grid-cols-2">
          {[
            ['Dashboard', 'See your current course, progress, bookmarks, and the next place to continue.'],
            ['Courses', 'Browse the published learning path, then move through modules and topics in order.'],
            ['Topics', 'Read the concept explanation, key points, examples, common mistakes, practice problems, notes, bookmarks, and completion status.'],
            ['Bookmarks', 'Save topics that deserve another look so they remain easy to find later.'],
            ['Progress', 'Review completed lessons, module progress, course progress, completion timestamps, and learning activity.'],
            ['Notes / Doubts', 'Keep personal questions and explanations attached to the topics where they matter.'],
            ['Profile and Settings', 'Review your account information and adjust application preferences such as theme.'],
          ].map(([title, description]) => <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"><div className="font-semibold text-[var(--text-primary)]">{title}</div><p className="mt-2">{description}</p></div>)}
        </div>
      </Card>

      <Card title="Learning philosophy">
        <div className="grid gap-4 sm:grid-cols-3">
          {['What is happening?', 'Why is it happening?', 'Can I do it myself?'].map((question, index) => <div key={question} className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Question {index + 1}</div><div className="mt-2 font-semibold text-[var(--text-primary)]">{question}</div></div>)}
        </div>
      </Card>
    </div>
  )
}
