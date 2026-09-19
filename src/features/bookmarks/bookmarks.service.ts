import { supabase } from '../../lib/supabase'
import type { Bookmark, Course, Module, Topic } from '../../types/database.types'

export type BookmarkDetail = Bookmark & {
  topic: Topic | null
  module: Module | null
  course: Course | null
}

export const bookmarksService = {
  async listBookmarks(): Promise<Bookmark[]> {
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
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []) as Bookmark[]
  },

  async listBookmarkDetails(): Promise<BookmarkDetail[]> {
    const bookmarks = await this.listBookmarks()

    if (bookmarks.length === 0) {
      return []
    }

    const topicIds = bookmarks.map((bookmark) => bookmark.topic_id)
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .in('id', topicIds)
      .eq('published', true)

    if (topicError) {
      throw topicError
    }

    const topicMap = new Map(((topicData ?? []) as Topic[]).map((topic) => [topic.id, topic]))
    const moduleIds = Array.from(new Set(((topicData ?? []) as Topic[]).map((topic) => topic.module_id)))

    let moduleMap = new Map<string, Module>()
    if (moduleIds.length > 0) {
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .select('*')
        .in('id', moduleIds)
        .eq('published', true)

      if (moduleError) {
        throw moduleError
      }

      moduleMap = new Map(((moduleData ?? []) as Module[]).map((module) => [module.id, module]))
    }

    const courseIds = Array.from(new Set(Array.from(moduleMap.values()).map((module) => module.course_id)))

    let courseMap = new Map<string, Course>()
    if (courseIds.length > 0) {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds)
        .eq('published', true)

      if (courseError) {
        throw courseError
      }

      courseMap = new Map(((courseData ?? []) as Course[]).map((course) => [course.id, course]))
    }

    return bookmarks
      .map((bookmark) => {
        const topic = topicMap.get(bookmark.topic_id) ?? null
        const module = topic ? moduleMap.get(topic.module_id) ?? null : null
        const course = module ? courseMap.get(module.course_id) ?? null : null

        return {
          ...bookmark,
          topic,
          module,
          course,
        }
      })
      .filter((bookmark) => bookmark.topic)
  },

  async isBookmarked(topicId: string): Promise<boolean> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return Boolean(data)
  },

  async addBookmark(topicId: string): Promise<Bookmark> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('You must be signed in to bookmark a topic.')
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
        },
        { onConflict: 'user_id,topic_id' },
      )
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data as Bookmark
  },

  async removeBookmark(topicId: string): Promise<void> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      return
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('topic_id', topicId)

    if (error) {
      throw error
    }
  },
}
