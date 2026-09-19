export const queryKeys = {
  courses: ['courses'],
  course: (courseId: string) => ['course', courseId],
  topic: (topicId: string) => ['topic', topicId],
  progress: ['progress'],
  progressOverview: (courseId: string) => ['progress', 'course', courseId],
  bookmarks: ['bookmarks'],
  notes: (topicId: string) => ['notes', topicId],
  profile: ['profile'],
} as const