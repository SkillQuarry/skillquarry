export type CourseSummary = {
  id: string
  title: string
  slug: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export type CourseDetail = CourseSummary & {
  modules: Array<{
    id: string
    title: string
    topicIds: string[]
  }>
}
