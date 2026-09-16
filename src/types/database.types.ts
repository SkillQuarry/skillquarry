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
