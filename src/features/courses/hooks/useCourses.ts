import { useEffect, useState } from 'react'
import { courseService } from '../course.service'
import type { Course } from '../../../types/database.types'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadCourses = async () => {
      try {
        const courseData = await courseService.listCourses()
        if (!isMounted) return
        setCourses(courseData)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load courses.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCourses()

    return () => {
      isMounted = false
    }
  }, [])

  return { courses, isLoading, error }
}
