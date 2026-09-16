import type { Course, Module, Topic } from '../../types/database.types'

export type CourseSummary = Course

export type CourseModuleWithTopics = Module & {
  topics: Topic[]
}

export type CourseDetail = Course & {
  modules: CourseModuleWithTopics[]
}
