import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { courseService } from '../features/courses/course.service'
import type { CourseDetail } from '../features/courses/course.types'

export function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) {
      setLoading(false)
      setError('Course not found.')
      return
    }

    let isMounted = true

    const loadCourse = async () => {
      try {
        const data = await courseService.getCourse(courseId)
        if (!isMounted) return
        setCourse(data)
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
    <div>
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
        <span className="text-sm text-slate-500">{course.modules.length} modules</span>
      </div>

      {course.modules.length === 0 ? (
        <EmptyState
          title="No modules published yet"
          description="This course has not published any learning modules yet."
        />
      ) : (
        <div className="space-y-4">
          {course.modules.map((module) => (
            <Card key={module.id} title={module.title} subtitle={`Module ${module.order_index}`}>
              <div className="space-y-3">
                {module.topics.length === 0 ? (
                  <p className="text-sm text-slate-500">No published topics in this module yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {module.topics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          to={`/app/courses/${course.id}/topics/${topic.id}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                        >
                          <span>{topic.title}</span>
                          <span className="text-sky-600">Open →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
