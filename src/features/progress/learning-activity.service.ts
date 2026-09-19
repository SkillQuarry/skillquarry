import { supabase } from '../../lib/supabase'

export const learningActivityService = {
  async registerTopicActivity(topicId: string, secondsDelta: number): Promise<void> {
    if (secondsDelta <= 0) {
      return
    }

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

    const now = new Date().toISOString()

    const { data: currentProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()

    if (progressError) {
      throw progressError
    }

    const existingSeconds = Number(currentProgress?.learning_time_seconds ?? 0)
    const existingStartedAt = currentProgress?.started_at ?? now

    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          started_at: existingStartedAt,
          last_activity_at: now,
          learning_time_seconds: existingSeconds + secondsDelta,
          completed: Boolean(currentProgress?.completed ?? false),
          completed_at: currentProgress?.completed_at ?? null,
          updated_at: now,
        },
        { onConflict: 'user_id,topic_id' },
      )

    if (error) {
      throw error
    }
  },
}