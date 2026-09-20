export type Course = {
  id: string
  title: string
  slug: string
  description: string
  level: string
  published: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type Module = {
  id: string
  course_id: string
  title: string
  slug: string
  description: string
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
}

export type Topic = {
  id: string
  module_id: string
  title: string
  slug: string
  description: string
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
}

export type TopicContent = {
  id: string
  topic_id: string
  definition: string
  explanation: string
  key_points: string[]
  why_it_matters: string
  common_mistakes: string[]
  example_code: string | null
  compiler_url: string | null
  created_at: string
  updated_at: string
}

export type PracticeProblem = {
  id: string
  topic_id: string
  question: string
  hint: string | null
  solution: string | null
  difficulty: string
  order_index: number
  created_at: string
  updated_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  topic_id: string
  completed: boolean
  completed_at: string | null
  started_at: string | null
  last_activity_at: string | null
  learning_time_seconds: number | null
  updated_at: string
}

export type UserNote = {
  id: string
  user_id: string
  topic_id: string
  content: string
  created_at: string
  updated_at: string
}

export type Bookmark = {
  id: string
  user_id: string
  topic_id: string
  created_at: string
}

export type SupportRequest = {
  id: string
  user_id: string
  type: 'question' | 'contact'
  category: string | null
  subject: string
  message: string
  requester_email: string | null
  requester_name: string | null
  course_id: string | null
  topic_id: string | null
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  updated_at: string
}

export type Doubt = {
  id: string
  user_id: string
  course_id: string | null
  topic_id: string | null
  category: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  updated_at: string
}

export type DoubtAnswer = {
  id: string
  doubt_id: string
  author_id: string | null
  author_name: string | null
  answer: string
  created_at: string
  updated_at: string
}

export type DoubtComment = {
  id: string
  doubt_id: string
  user_id: string
  comment: string
  created_at: string
  updated_at: string
}
