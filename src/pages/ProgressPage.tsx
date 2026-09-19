import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { courseService } from '../features/courses/course.service'
import { progressService, type CourseProgressOverview } from '../features/progress/progress.service'

export function ProgressPage() {
  const [courseOverview, setCourseOverview] = useState<CourseProgressOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProgress = async () => {
      try {
        const courses = await courseService.listCourses()

        if (!isMounted) return

        const firstCourse = courses[0] ?? null

        if (!firstCourse) {
          setCourseOverview(null)
          setExpandedModuleId(null)
          setError(null)
          return
        }

        const overview = await progressService.getCourseProgressOverview(firstCourse.id)

        if (!isMounted) return

        setCourseOverview(overview)
        setExpandedModuleId(overview?.modules[0]?.module.id ?? null)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load your progress.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadProgress()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <LoadingState message="Loading progress..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load your progress"
        description={error}
      />
    )
  }

  if (!courseOverview) {
    return (
      <EmptyState
        title="No published course available yet"
        description="Progress data will appear once a course is published in Supabase."
      />
    )
  }

  const { course, summary, modules, completedTopics, continueLearning } = courseOverview
  const completedModules = modules.filter(
    ({ completedTopics: completed, totalTopics }) => completed === totalTopics && totalTopics > 0,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress"
        description="Track your learning momentum across the published course content."
      />

      <Card title={course.title} subtitle="Overall course progress">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{summary.completionPercentage}% complete</Badge>
            <span className="text-sm text-[var(--text-soft)]">
              {summary.completedTopics} of {summary.totalTopics} topics completed
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${summary.completionPercentage}%` }}
            />
          </div>

          <div className="grid gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-3">
            <div>Completed: {summary.completedTopics}</div>
            <div>Remaining: {summary.remainingTopics}</div>
            <div>Course: {course.title}</div>
          </div>

          {summary.completedTopics === summary.totalTopics && summary.totalTopics > 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Course complete — excellent work.
            </div>
          ) : continueLearning ? (
            <Link to={`/app/courses/${continueLearning.courseId}/topics/${continueLearning.topicId}`}>
              <Button className="mt-1">Continue learning</Button>
            </Link>
          ) : null}
        </div>
      </Card>

      <Card
        title="Progress by learning module"
        subtitle="See your progress through this learning module."
      >
        {modules.length === 0 ? (
          <p className="text-sm text-[var(--text-soft)]">No published modules available yet.</p>
        ) : (
          <div className="space-y-4">
            {modules.map(({ module, completedTopics: completed, totalTopics, completionPercentage }) => {
              const isOpen = expandedModuleId === module.id
              const moduleTopics = course.modules.find((candidate) => candidate.id === module.id)?.topics ?? []

              return (
                <div key={module.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`module-progress-${module.id}`}
                    onClick={() => setExpandedModuleId((current) => (current === module.id ? null : module.id))}
                    className="flex w-full items-center justify-between gap-3 px-3 py-4 text-left transition hover:bg-[var(--surface-hover)] sm:px-4"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                        Module {module.order_index}
                      </div>
                      <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">{module.title}</div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
                      <span>{completionPercentage}%</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-lg">
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  <div className="px-3 pb-3 sm:px-4">
                    <div className="mb-3 text-sm text-[var(--text-soft)]">
                      {completed} of {totalTopics} topics complete
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${completionPercentage}%` }} />
                    </div>
                  </div>

                  {isOpen ? (
                    <div id={`module-progress-${module.id}`} className="border-t border-[var(--border)] bg-[var(--panel)] px-3 py-3 sm:px-4">
                      {moduleTopics.length === 0 ? (
                        <p className="text-sm text-[var(--text-soft)]">No topics published in this module yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {moduleTopics.map((topic) => {
                            const isTopicCompleted = Boolean(courseOverview?.completedTopics.some((completedTopic) => completedTopic.topicId === topic.id))

                            return (
                              <li key={topic.id}>
                                <Link
                                  to={`/app/courses/${course.id}/topics/${topic.id}`}
                                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition hover:border-sky-200 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                                >
                                  <div className="flex min-w-0 items-center gap-2">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] text-[10px]">
                                      {isTopicCompleted ? '✓' : '○'}
                                    </span>
                                    <span className="truncate">{topic.title}</span>
                                  </div>
                                  <span className="text-xs text-[var(--text-soft)]">{isTopicCompleted ? 'Completed' : 'Open'}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {completedModules.length > 0 ? (
        <Card title="Completed modules" subtitle="Your fully-finished learning modules">
          <div className="grid gap-3 md:grid-cols-2">
            {completedModules.map(({ module, completedTopics: completed, totalTopics }) => (
              <Link
                key={module.id}
                to={`/app/courses/${course.id}`}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/35"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                    Module {module.order_index}
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Completed</Badge>
                </div>
                <div className="mt-2 text-base font-semibold text-[var(--text-primary)]">{module.title}</div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  {completed} / {totalTopics} topics complete
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <Card title="Completed topics" subtitle="Your latest finished lessons">
        {completedTopics.length === 0 ? (
          <EmptyState
            title="No completed topics yet"
            description="You haven't completed any topics yet. Start learning to build your progress."
          />
        ) : (
          <ul className="space-y-3 text-sm text-[var(--text-primary)]">
            {completedTopics.slice(0, 8).map((topic) => (
              <li key={topic.topicId} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-medium">{topic.topicTitle}</div>
                    {topic.moduleTitle ? <div className="mt-1 text-xs text-[var(--text-soft)]">{topic.moduleTitle}</div> : null}
                  </div>
                  {topic.moduleTitle ? <Badge>{topic.moduleTitle}</Badge> : null}
                </div>
                {topic.completedAt ? (
                  <div className="mt-2 text-xs text-[var(--text-soft)]">
                    Finished on {new Date(topic.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
