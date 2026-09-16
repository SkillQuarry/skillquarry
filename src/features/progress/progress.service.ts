import { supabase } from '../../lib/supabase'
import type { UserProgress } from '../../types/database.types'

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
}
