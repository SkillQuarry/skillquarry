import { supabase } from '../../lib/supabase'
import type { Module, Topic, UserNote } from '../../types/database.types'

export type NoteDetail = UserNote & { topic: Topic | null; courseId: string | null; courseTitle: string | null }

export const notesService = {
  async listNotes(): Promise<NoteDetail[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!userData.user) return []

    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    const notes = (data ?? []) as UserNote[]
    if (notes.length === 0) return []

    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .in('id', notes.map((note) => note.topic_id))
      .eq('published', true)

    if (topicsError) throw topicsError

    const topicRows = (topics ?? []) as Topic[]
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, course_id')
      .in('id', topicRows.map((topic) => topic.module_id))

    if (modulesError) throw modulesError

    const moduleMap = new Map(((modules ?? []) as Pick<Module, 'id' | 'course_id'>[]).map((module) => [module.id, module.course_id]))
    const courseIds = Array.from(new Set(Array.from(moduleMap.values())))
    const { data: courses, error: coursesError } = courseIds.length > 0
      ? await supabase.from('courses').select('id, title').in('id', courseIds)
      : { data: [], error: null }

    if (coursesError) throw coursesError

    const courseMap = new Map(((courses ?? []) as Array<{ id: string; title: string }>).map((course) => [course.id, course.title]))
    const topicMap = new Map(topicRows.map((topic) => [topic.id, topic]))
    return notes.map((note) => ({
      ...note,
      topic: topicMap.get(note.topic_id) ?? null,
      courseId: note.topic_id ? moduleMap.get(topicMap.get(note.topic_id)?.module_id ?? '') ?? null : null,
      courseTitle: note.topic_id ? courseMap.get(moduleMap.get(topicMap.get(note.topic_id)?.module_id ?? '') ?? '') ?? null : null,
    }))
  },

  async getNote(topicId: string): Promise<UserNote | null> {
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
      .from('user_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return (data ?? null) as UserNote | null
  },

  async saveNote(topicId: string, content: string): Promise<UserNote> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('You must be signed in to save notes.')
    }

    const timestamp = new Date().toISOString()

    const { data, error } = await supabase
      .from('user_notes')
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          content,
          updated_at: timestamp,
        },
        { onConflict: 'user_id,topic_id' },
      )
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data as UserNote
  },
}
