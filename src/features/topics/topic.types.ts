import type { Course, Module, PracticeProblem, Topic, TopicContent } from '../../types/database.types'

export type TopicDetail = {
  topic: Topic
  module: Module | null
  course: Course | null
  topicContent: TopicContent | null
  practiceProblems: PracticeProblem[]
}
