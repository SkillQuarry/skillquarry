import { supabase } from '../../lib/supabase'
import type { Course, Module, PracticeProblem, Topic, TopicContent } from '../../types/database.types'
import type { TopicDetail } from './topic.types'

export const topicService = {
  async getAdjacentTopics(topicId: string): Promise<{ previousTopic: Topic | null; nextTopic: Topic | null }> {
    const { data: currentTopicData, error: currentTopicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .eq('published', true)
      .maybeSingle()

    if (currentTopicError) {
      throw currentTopicError
    }

    if (!currentTopicData) {
      return { previousTopic: null, nextTopic: null }
    }

    const currentTopic = currentTopicData as Topic

    const { data: currentModuleData, error: currentModuleError } = await supabase
      .from('modules')
      .select('*')
      .eq('id', currentTopic.module_id)
      .eq('published', true)
      .maybeSingle()

    if (currentModuleError) {
      throw currentModuleError
    }

    if (!currentModuleData) {
      return { previousTopic: null, nextTopic: null }
    }

    const { data: moduleRowsData, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', currentModuleData.course_id)
      .eq('published', true)
      .order('order_index', { ascending: true })

    if (modulesError) {
      throw modulesError
    }

    const moduleRows = (moduleRowsData ?? []) as Module[]
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

    const orderedTopics = moduleRows.flatMap((module) =>
      topicRows
        .filter((topic) => topic.module_id === module.id)
        .sort((left, right) => left.order_index - right.order_index),
    )

    const currentIndex = orderedTopics.findIndex((topic) => topic.id === currentTopic.id)

    return {
      previousTopic: currentIndex > 0 ? orderedTopics[currentIndex - 1] : null,
      nextTopic: currentIndex >= 0 && currentIndex < orderedTopics.length - 1 ? orderedTopics[currentIndex + 1] : null,
    }
  },

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
