import { supabase } from '../../lib/supabase'
import type { Course, Module, Topic } from '../../types/database.types'
import type { CourseDetail } from './course.types'

export const courseService = {
  async listCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true)
      .order('order_index', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as Course[]
  },

  async getCourse(courseId: string): Promise<CourseDetail | null> {
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('published', true)
      .single()

    if (courseError) {
      if (courseError.code === 'PGRST116') {
        return null
      }
      throw courseError
    }

    const { data: modulesData, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .eq('published', true)
      .order('order_index', { ascending: true })

    if (modulesError) {
      throw modulesError
    }

    const moduleRows = (modulesData ?? []) as Module[]
    const moduleIds = moduleRows.map((module) => module.id)

    let topicRows: Topic[] = []

    if (moduleIds.length > 0) {
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .in('module_id', moduleIds)
        .eq('published', true)
        .order('order_index', { ascending: true })

      if (topicsError) {
        throw topicsError
      }

      topicRows = (topicsData ?? []) as Topic[]
    }

    const modules = moduleRows.map((module) => ({
      ...module,
      topics: topicRows.filter((topic) => topic.module_id === module.id),
    }))

    return {
      ...courseData,
      modules,
    } as CourseDetail
  },
}
