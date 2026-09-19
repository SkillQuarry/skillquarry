import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { bookmarksService } from './bookmarks/bookmarks.service'
import { courseService } from './courses/course.service'
import { notesService } from './notes/notes.service'
import { progressService } from './progress/progress.service'
import { queryKeys } from './queryKeys'

export function useCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses,
    queryFn: () => courseService.listCourses(),
  })
}

export function useCourseQuery(courseId: string | null) {
  return useQuery({
    queryKey: queryKeys.course(courseId ?? 'unknown'),
    queryFn: () => {
      if (!courseId) {
        return null
      }

      return courseService.getCourse(courseId)
    },
    enabled: Boolean(courseId),
  })
}

export function useTopicQuery(topicId: string | null) {
  return useQuery({
    queryKey: queryKeys.topic(topicId ?? 'unknown'),
    queryFn: async () => {
      if (!topicId) {
        return null
      }

      const { topicService } = await import('./topics/topic.service')
      return topicService.getTopic(topicId)
    },
    enabled: Boolean(topicId),
  })
}

export function useProgressQuery() {
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: () => progressService.listProgress(),
  })
}

export function useBookmarksQuery() {
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: () => bookmarksService.listBookmarks(),
  })
}

export function useNotesQuery(topicId: string | null) {
  return useQuery({
    queryKey: queryKeys.notes(topicId ?? 'unknown'),
    queryFn: async () => {
      if (!topicId) {
        return null
      }

      return notesService.getNote(topicId)
    },
    enabled: Boolean(topicId),
  })
}

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const { data } = await import('../lib/supabase').then((module) => module.supabase.auth.getUser())
      return data.user
    },
  })
}

export function useProgressMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, completed }: { topicId: string; completed: boolean }) =>
      progressService.updateProgress(topicId, completed),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.progress }),
        queryClient.refetchQueries({ queryKey: queryKeys.progressOverview(variables.topicId) }),
      ])
    },
  })
}