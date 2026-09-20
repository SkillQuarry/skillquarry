import { supabase } from '../../lib/supabase'
import type { Doubt, DoubtAnswer, DoubtComment, Module, Topic } from '../../types/database.types'

export type DoubtDetail = Doubt & {
  courseTitle: string | null
  topicTitle: string | null
  answer: DoubtAnswer | null
  comments: DoubtComment[]
}

export type CreateDoubtInput = {
  subject: string
  category: string
  message: string
  courseId?: string | null
  topicId?: string | null
}

export const doubtsService = {
  async listDoubts(): Promise<DoubtDetail[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) return []

    const { data: doubts, error } = await supabase
      .from('doubts')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    const doubtRows = (doubts ?? []) as Doubt[]
    if (doubtRows.length === 0) return []

    const topicIds = doubtRows.flatMap((doubt) => doubt.topic_id ? [doubt.topic_id] : [])
    const { data: topics, error: topicsError } = topicIds.length > 0
      ? await supabase.from('topics').select('*').in('id', topicIds)
      : { data: [], error: null }
    if (topicsError) throw topicsError

    const topicRows = (topics ?? []) as Topic[]
    const moduleIds = topicRows.map((topic) => topic.module_id)
    const { data: modules, error: modulesError } = moduleIds.length > 0
      ? await supabase.from('modules').select('*').in('id', moduleIds)
      : { data: [], error: null }
    if (modulesError) throw modulesError

    const moduleRows = (modules ?? []) as Module[]
    const courseIds = Array.from(new Set(doubtRows.flatMap((doubt) => doubt.course_id ? [doubt.course_id] : moduleRows.map((module) => module.course_id))))
    const { data: courses, error: coursesError } = courseIds.length > 0
      ? await supabase.from('courses').select('id, title').in('id', courseIds)
      : { data: [], error: null }
    if (coursesError) throw coursesError

    const doubtIds = doubtRows.map((doubt) => doubt.id)
    const { data: answers, error: answersError } = await supabase.from('doubt_answers').select('*').in('doubt_id', doubtIds).order('created_at', { ascending: false })
    if (answersError) throw answersError
    const { data: comments, error: commentsError } = await supabase.from('doubt_comments').select('*').in('doubt_id', doubtIds).order('created_at', { ascending: true })
    if (commentsError) throw commentsError

    const topicMap = new Map(topicRows.map((topic) => [topic.id, topic]))
    const moduleMap = new Map(moduleRows.map((module) => [module.id, module]))
    const courseMap = new Map(((courses ?? []) as Array<{ id: string; title: string }>).map((course) => [course.id, course.title]))
    const answerMap = new Map(((answers ?? []) as DoubtAnswer[]).map((answer) => [answer.doubt_id, answer]))
    const commentsByDoubt = new Map<string, DoubtComment[]>()
    for (const comment of (comments ?? []) as DoubtComment[]) {
      commentsByDoubt.set(comment.doubt_id, [...(commentsByDoubt.get(comment.doubt_id) ?? []), comment])
    }

    return doubtRows.map((doubt) => {
      const topic = doubt.topic_id ? topicMap.get(doubt.topic_id) : undefined
      const module = topic ? moduleMap.get(topic.module_id) : undefined
      return {
        ...doubt,
        courseTitle: courseMap.get(doubt.course_id ?? module?.course_id ?? '') ?? null,
        topicTitle: topic?.title ?? null,
        answer: answerMap.get(doubt.id) ?? null,
        comments: commentsByDoubt.get(doubt.id) ?? [],
      }
    })
  },

  async createDoubt(input: CreateDoubtInput): Promise<Doubt> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error('You must be signed in to ask a question.')

    const { data, error } = await supabase.from('doubts').insert({
      user_id: userData.user.id,
      subject: input.subject.trim(),
      category: input.category,
      message: input.message.trim(),
      course_id: input.courseId ?? null,
      topic_id: input.topicId ?? null,
    }).select('*').single()

    if (error) throw error
    return data as Doubt
  },
}