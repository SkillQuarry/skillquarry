export type Course = {
  id: string
  title: string
  slug: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  moduleIds: string[]
  createdAt: string
}

export type Module = {
  id: string
  courseId: string
  title: string
  order: number
  topicIds: string[]
}

export type Topic = {
  id: string
  moduleId: string
  title: string
  slug: string
  description: string
  order: number
  content: TopicContent
}

export type TopicContent = {
  explanation: string
  example: string
  practice: string
  hint?: string
  solution?: string
}

export type PracticeProblem = {
  id: string
  topicId: string
  prompt: string
  starterCode?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type UserProgress = {
  id: string
  userId: string
  courseId: string
  topicId: string
  completed: boolean
  progressPercent: number
  updatedAt: string
}

export type UserNote = {
  id: string
  userId: string
  topicId: string
  content: string
  createdAt: string
  updatedAt: string
}

export type Bookmark = {
  id: string
  userId: string
  topicId: string
  createdAt: string
}
