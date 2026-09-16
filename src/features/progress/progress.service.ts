import { supabase } from '../../lib/supabase'
import { courseService } from '../courses/course.service'
import type { CourseDetail } from '../courses/course.types'
import type { Module, Topic, UserProgress } from '../../types/database.types'

export type CourseProgressSummary = {
  courseId: string
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  completionPercentage: number
}

export type ModuleProgressSummary = {
  module: Module
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  completionPercentage: number
}

export type CompletedTopicSummary = {
  topicId: string
  topicTitle: string
  topicSlug: string
  moduleTitle: string | null
  courseTitle: string | null
  completedAt: string | null
}

export type ContinueLearningSummary = {
  courseId: string
  courseTitle: string
  moduleId: string
  moduleTitle: string | null
  topicId: string
  topicTitle: string
  topicSlug: string
}

export type CourseProgressOverview = {
  course: CourseDetail
  summary: CourseProgressSummary
  modules: ModuleProgressSummary[]
  completedTopics: CompletedTopicSummary[]
  continueLearning: ContinueLearningSummary | null
}

function calculatePercentage(completed: number, total: number): number {
  if (total === 0) {
    return 0
  }

  return Math.round((completed / total) * 100)
}

export const progressService = {
  async getProgress(topicId: string): Promise<UserProgress | null> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return (data ?? null) as UserProgress | null
  },

  async listProgress(): Promise<UserProgress[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []) as UserProgress[]
  },

  async updateProgress(topicId: string, completed: boolean): Promise<UserProgress | null> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      return null
    }

    const timestamp = new Date().toISOString()

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          completed,
          completed_at: completed ? timestamp : null,
          updated_at: timestamp,
        },
        { onConflict: 'user_id,topic_id' },
      )
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data as UserProgress
  },

  async getCourseProgressOverview(courseId: string): Promise<CourseProgressOverview | null> {
    const course = await courseService.getCourse(courseId)

    if (!course) {
      return null
    }

    const progressRows = await this.listProgress()
    const progressMap = new Map(progressRows.map((progress) => [progress.topic_id, progress]))
    const allTopics: Topic[] = course.modules.flatMap((module) => module.topics)

    const totalTopics = allTopics.length
    const completedTopicsCount = allTopics.filter((topic) => Boolean(progressMap.get(topic.id)?.completed)).length
    const remainingTopics = totalTopics - completedTopicsCount
    const completionPercentage = calculatePercentage(completedTopicsCount, totalTopics)

    const moduleSummaries: ModuleProgressSummary[] = course.modules.map((module) => {
      const totalModuleTopics = module.topics.length
      const completedModuleTopics = module.topics.filter((topic) => Boolean(progressMap.get(topic.id)?.completed)).length

      return {
        module,
        totalTopics: totalModuleTopics,
        completedTopics: completedModuleTopics,
        remainingTopics: totalModuleTopics - completedModuleTopics,
        completionPercentage: calculatePercentage(completedModuleTopics, totalModuleTopics),
      }
    })

    const completedTopicSummaries: CompletedTopicSummary[] = allTopics
      .filter((topic) => Boolean(progressMap.get(topic.id)?.completed))
      .map((topic) => {
        const module = course.modules.find((candidate) => candidate.id === topic.module_id) ?? null

        return {
          topicId: topic.id,
          topicTitle: topic.title,
          topicSlug: topic.slug,
          moduleTitle: module?.title ?? null,
          courseTitle: course.title,
          completedAt: progressMap.get(topic.id)?.completed_at ?? null,
        }
      })
      .sort((a, b) => {
        const left = a.completedAt ? new Date(a.completedAt).getTime() : 0
        const right = b.completedAt ? new Date(b.completedAt).getTime() : 0
        return right - left
      })

    let continueLearning: ContinueLearningSummary | null = null

    for (const module of course.modules) {
      for (const topic of module.topics) {
        if (!progressMap.get(topic.id)?.completed) {
          continueLearning = {
            courseId: course.id,
            courseTitle: course.title,
            moduleId: module.id,
            moduleTitle: module.title,
            topicId: topic.id,
            topicTitle: topic.title,
            topicSlug: topic.slug,
          }
          break
        }
      }

      if (continueLearning) {
        break
      }
    }

    return {
      course,
      summary: {
        courseId: course.id,
        totalTopics,
        completedTopics: completedTopicsCount,
        remainingTopics,
        completionPercentage,
      },
      modules: moduleSummaries,
      completedTopics: completedTopicSummaries,
      continueLearning,
    }
  },

  async getCourseProgress(courseId: string): Promise<CourseProgressSummary | null> {
    const overview = await this.getCourseProgressOverview(courseId)
    return overview ? overview.summary : null
  },

  async getModuleProgress(courseId: string): Promise<ModuleProgressSummary[]> {
    const overview = await this.getCourseProgressOverview(courseId)
    return overview ? overview.modules : []
  },

  async listCompletedTopics(courseId: string): Promise<CompletedTopicSummary[]> {
    const overview = await this.getCourseProgressOverview(courseId)
    return overview ? overview.completedTopics : []
  },

  async getContinueLearning(courseId: string): Promise<ContinueLearningSummary | null> {
    const overview = await this.getCourseProgressOverview(courseId)
    return overview ? overview.continueLearning : null
  },
}
