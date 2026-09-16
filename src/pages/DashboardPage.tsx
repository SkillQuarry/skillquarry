import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { useAuth } from '../features/auth/AuthProvider'
import { bookmarksService } from '../features/bookmarks/bookmarks.service'
import { courseService } from '../features/courses/course.service'
import { progressService, type CourseProgressOverview } from '../features/progress/progress.service'

export function DashboardPage() {
  const { user } = useAuth()
  const [courseOverview, setCourseOverview] = useState<CourseProgressOverview | null>(null)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        const [courses, bookmarkRows] = await Promise.all([
          courseService.listCourses(),
          bookmarksService.listBookmarks(),
        ])

        if (!isMounted) return

        const firstCourse = courses[0] ?? null

        if (!firstCourse) {
          setCourseOverview(null)
          setBookmarkCount(bookmarkRows.length)
          setError(null)
          return
        }

        const [overview] = await Promise.all([
          progressService.getCourseProgressOverview(firstCourse.id),
        ])

        if (!isMounted) return

        setCourseOverview(overview)
        setBookmarkCount(bookmarkRows.length)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load your dashboard data.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const greetingName = useMemo(() => {
    const displayName = user?.user_metadata?.display_name

    if (typeof displayName === 'string' && displayName.trim()) {
      return displayName
    }

    return 'Welcome back'
  }, [user])

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load your dashboard"
        description={error}
      />
    )
  }

  if (!courseOverview) {
    return (
      <EmptyState
        title="No published course available yet"
        description="A published course will appear here once it is added to Supabase."
      />
    )
  }

  const { course, summary, continueLearning, completedTopics } = courseOverview

  return (
    <div className="space-y-6">
      <PageHeader
        title={greetingName}
        description="Continue building momentum with your current learning path."
        action={
          <Link to="/app/progress">
            <Button variant="secondary">View progress</Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={course.title} subtitle={course.description || 'Your current learning track'}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>{course.level}</Badge>
              <span className="text-sm text-slate-500">
                {summary.completedTopics} / {summary.totalTopics} topics complete
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${summary.completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{summary.completionPercentage}% complete</span>
              <span>{summary.remainingTopics} remaining</span>
            </div>
          </div>
        </Card>

        <Card title="Continue Learning" subtitle="Pick up where you left off">
          {continueLearning ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-slate-900">{continueLearning.topicTitle}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {continueLearning.moduleTitle ? `${continueLearning.moduleTitle} • ` : ''}
                  {course.title}
                </div>
              </div>
              <Link to={`/app/courses/${continueLearning.courseId}/topics/${continueLearning.topicId}`}>
                <Button>Continue Learning</Button>
              </Link>
            </div>
          ) : (
            <div className="text-sm text-slate-600">You&apos;ve completed this course.</div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recently completed" subtitle="Your newest milestones">
          {completedTopics.length === 0 ? (
            <p className="text-sm text-slate-500">No completed topics yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600">
              {completedTopics.slice(0, 5).map((topic) => (
                <li key={topic.topicId} className="rounded-xl border border-slate-200 p-3">
                  <div className="font-medium text-slate-800">{topic.topicTitle}</div>
                  {topic.moduleTitle ? <div className="mt-1 text-xs text-slate-500">{topic.moduleTitle}</div> : null}
                  {topic.completedAt ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Completed {new Date(topic.completedAt).toLocaleDateString()}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Bookmarks" subtitle="Saved for later">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-3xl font-bold text-slate-900">{bookmarkCount}</div>
              <div className="text-sm text-slate-500">bookmarked topics</div>
            </div>
            <Link to="/app/bookmarks">
              <Button variant="secondary">Open bookmarks</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
