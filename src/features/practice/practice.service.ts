import { supabase } from '../../lib/supabase'
import type { PracticeProblem } from '../../types/database.types'

export const practiceService = {
  async listPracticeProblems(topicId: string): Promise<PracticeProblem[]> {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as PracticeProblem[]
  },
}
