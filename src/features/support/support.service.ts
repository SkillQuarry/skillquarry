import { supabase } from '../../lib/supabase'
import type { SupportRequest } from '../../types/database.types'

export type CreateSupportRequestInput = {
  type: SupportRequest['type']
  category?: string | null
  subject: string
  message: string
  courseId?: string | null
  topicId?: string | null
}

export const supportService = {
  async createRequest(input: CreateSupportRequestInput): Promise<SupportRequest> {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!userData.user) throw new Error('You must be signed in to contact SkillQuarry.')

    const { data, error } = await supabase
      .from('support_requests')
      .insert({
        user_id: userData.user.id,
        type: input.type,
        category: input.category ?? null,
        subject: input.subject.trim(),
        message: input.message.trim(),
        requester_email: userData.user.email ?? null,
        requester_name: typeof userData.user.user_metadata?.display_name === 'string' ? userData.user.user_metadata.display_name : null,
        course_id: input.courseId ?? null,
        topic_id: input.topicId ?? null,
      })
      .select('*')
      .single()

    if (error) throw error
    return data as SupportRequest
  },
}