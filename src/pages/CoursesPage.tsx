import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { courseService } from '../features/courses/course.service'
import type { Course } from '../types/database.types'

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadCourses = async () => {
      try {
        const data = await courseService.listCourses()
        if (!isMounted) return
        setCourses(data)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load courses.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadCourses()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <LoadingState message="Loading courses..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load courses"
        description={error}
        action={
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    )
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses available yet"
        description="The first published course will appear here once it is added to Supabase."
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Browse the learning tracks available in SkillQuarry."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.id} to={`/app/courses/${course.id}`} className="block h-full">
            <Card
              title={course.title}
              subtitle={
                <div className="flex items-center gap-2">
                  <Badge>{course.level}</Badge>
                  <span className="text-xs uppercase tracking-wide text-slate-400">{course.slug}</span>
                </div>
              }
              className="h-full transition hover:border-sky-200 hover:shadow-md"
            >
              <p className="text-sm leading-6 text-slate-600">{course.description}</p>
              <div className="mt-4 text-sm font-medium text-sky-600">Open course →</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
