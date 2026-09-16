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

  useEffect(() => {
    let isMounted = true

    const loadProgress = async () => {
      try {
        const courses = await courseService.listCourses()

        if (!isMounted) return

        const firstCourse = courses[0] ?? null

        if (!firstCourse) {
          setCourseOverview(null)
          setError(null)
          return
        }

        const overview = await progressService.getCourseProgressOverview(firstCourse.id)

        if (!isMounted) return

        setCourseOverview(overview)
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
            <span className="text-sm text-slate-500">
              {summary.completedTopics} of {summary.totalTopics} topics completed
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${summary.completionPercentage}%` }}
            />
          </div>

          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
            <div>Completed: {summary.completedTopics}</div>
            <div>Remaining: {summary.remainingTopics}</div>
            <div>Course: {course.title}</div>
          </div>

          {summary.completedTopics === summary.totalTopics && summary.totalTopics > 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              Course complete — excellent work.
            </div>
          ) : continueLearning ? (
            <Link to={`/app/courses/${continueLearning.courseId}/topics/${continueLearning.topicId}`}>
              <Button className="mt-1">Continue learning</Button>
            </Link>
          ) : null}
        </div>
      </Card>

      <Card title="Module progress" subtitle="Progress by learning module">
        {modules.length === 0 ? (
          <p className="text-sm text-slate-500">No published modules available yet.</p>
        ) : (
          <div className="space-y-4">
            {modules.map(({ module, completedTopics, totalTopics, completionPercentage }) => (
              <div key={module.id} className="rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-800">{module.title}</div>
                  <span className="text-xs text-slate-500">
                    {completedTopics} / {totalTopics}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                <div className="mt-2 text-xs text-slate-500">{completionPercentage}% complete</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Completed topics" subtitle="Your latest finished lessons">
        {completedTopics.length === 0 ? (
          <EmptyState
            title="No completed topics yet"
            description="You haven't completed any topics yet. Start learning to build your progress."
          />
        ) : (
          <ul className="space-y-3 text-sm text-slate-700">
            {completedTopics.map((topic) => (
              <li key={topic.topicId} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-800">{topic.topicTitle}</div>
                  {topic.moduleTitle ? <Badge>{topic.moduleTitle}</Badge> : null}
                </div>
                {topic.completedAt ? (
                  <div className="mt-2 text-xs text-slate-500">
                    Completed on {new Date(topic.completedAt).toLocaleDateString()}
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
