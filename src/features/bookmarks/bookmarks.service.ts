import { supabase } from '../../lib/supabase'
import type { Bookmark } from '../../types/database.types'

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
