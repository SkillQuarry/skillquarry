import { supabase } from '../../lib/supabase'
import type { UserNote } from '../../types/database.types'

export const notesService = {
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
