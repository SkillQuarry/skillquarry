import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { courseService } from '../features/courses/course.service'
import { progressService } from '../features/progress/progress.service'
import type { CourseDetail } from '../features/courses/course.types'

export function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openModuleId, setOpenModuleId] = useState<string | null>(null)
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!courseId) {
      setLoading(false)
      setError('Course not found.')
      return
    }

    let isMounted = true

    const loadCourse = async () => {
      try {
        const [data, progressRows] = await Promise.all([courseService.getCourse(courseId), progressService.listProgress()])

        if (!isMounted) return

        const completedIds = new Set(
          progressRows.filter((row) => row.completed).map((row) => row.topic_id),
        )

        setCourse(data)
        setCompletedTopicIds(completedIds)
        setOpenModuleId(data?.modules[0]?.id ?? null)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this course.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadCourse()

    return () => {
      isMounted = false
    }
  }, [courseId])

  const moduleSummary = useMemo(
    () =>
      course?.modules.map((module) => ({
        ...module,
        completedCount: module.topics.filter((topic) => completedTopicIds.has(topic.id)).length,
      })) ?? [],
    [course, completedTopicIds],
  )

  if (loading) {
    return <LoadingState message="Loading course details..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Course not found"
        description={error}
        action={
          <Link to="/app/courses">
            <Button variant="secondary">Back to courses</Button>
          </Link>
        }
      />
    )
  }

  if (!course) {
    return (
      <EmptyState
        title="No published course found"
        description="This course is not available in the current Supabase dataset."
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={course.title}
        description={course.description}
        action={
          <Link to="/app/courses">
            <Button variant="secondary">Back to courses</Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge>{course.level}</Badge>
        <span className="text-sm text-[var(--text-soft)]">{course.modules.length} modules</span>
      </div>

      {course.modules.length === 0 ? (
        <EmptyState
          title="No modules published yet"
          description="This course has not published any learning modules yet."
        />
      ) : (
        <div className="space-y-4">
          {moduleSummary.map((module) => {
            const isOpen = openModuleId === module.id
            const isComplete = module.topics.length > 0 && module.topics.every((topic) => completedTopicIds.has(topic.id))

            return (
              <Card key={module.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`module-panel-${module.id}`}
                  onClick={() => setOpenModuleId((current) => (current === module.id ? null : module.id))}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-[var(--surface-muted)] sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                        Module {module.order_index}
                      </span>
                      {isComplete ? <Badge>Complete</Badge> : null}
                    </div>
                    <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">{module.title}</div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
                    <span>{module.topics.length} topics</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-lg">
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div id={`module-panel-${module.id}`} className="border-t border-[var(--border)] bg-[var(--surface-muted)]/40 px-4 py-4 sm:px-5">
                    {module.topics.length === 0 ? (
                      <p className="text-sm text-[var(--text-soft)]">No published topics in this module yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {module.topics.map((topic) => {
                          const isCompleted = completedTopicIds.has(topic.id)

                          return (
                            <li key={topic.id}>
                              <Link
                                to={`/app/courses/${course.id}/topics/${topic.id}`}
                                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] text-[10px]">
                                    {isCompleted ? '✓' : '○'}
                                  </span>
                                  <span className="truncate">{topic.title}</span>
                                </div>
                                <span className="shrink-0 text-xs font-medium text-sky-600">Open →</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ) : null}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
