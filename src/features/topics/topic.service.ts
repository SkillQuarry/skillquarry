import { supabase } from '../../lib/supabase'
import type { Course, Module, PracticeProblem, Topic, TopicContent } from '../../types/database.types'
import type { TopicDetail } from './topic.types'

export const topicService = {
  async getTopic(topicId: string): Promise<TopicDetail | null> {
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .eq('published', true)
      .single()

    if (topicError) {
      if (topicError.code === 'PGRST116') {
        return null
      }
      throw topicError
    }

    const topic = topicData as Topic

    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', topic.module_id)
      .eq('published', true)
      .maybeSingle()

    if (moduleError) {
      throw moduleError
    }

    let courseData: Course | null = null

    if (moduleData) {
      const { data: fetchedCourse, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', moduleData.course_id)
        .eq('published', true)
        .maybeSingle()

      if (courseError) {
        throw courseError
      }

      courseData = fetchedCourse as Course | null
    }

    const { data: topicContentData, error: contentError } = await supabase
      .from('topic_content')
      .select('*')
      .eq('topic_id', topicId)
      .maybeSingle()

    if (contentError) {
      throw contentError
    }

    const { data: problemsData, error: problemsError } = await supabase
      .from('practice_problems')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true })

    if (problemsError) {
      throw problemsError
    }

    return {
      topic,
      module: (moduleData ?? null) as Module | null,
      course: courseData,
      topicContent: (topicContentData ?? null) as TopicContent | null,
      practiceProblems: (problemsData ?? []) as PracticeProblem[],
    }
  },

  async listTopics(moduleId: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('module_id', moduleId)
      .eq('published', true)
      .order('order_index', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as Topic[]
  },
}
