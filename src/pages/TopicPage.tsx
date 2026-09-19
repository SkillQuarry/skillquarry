import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { bookmarksService } from '../features/bookmarks/bookmarks.service'
import { courseService } from '../features/courses/course.service'
import type { CourseDetail } from '../features/courses/course.types'
import { notesService } from '../features/notes/notes.service'
import { learningActivityService } from '../features/progress/learning-activity.service'
import { progressService } from '../features/progress/progress.service'
import { topicService } from '../features/topics/topic.service'
import type { TopicDetail } from '../features/topics/topic.types'

type TopicNavigation = {
  previousTopic: { id: string; title: string } | null
  nextTopic: { id: string; title: string } | null
}

type CompletionMeta = {
  title: string
  nextTopic: { id: string; title: string } | null
  courseCompleted: boolean
}

export function TopicPage() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const navigate = useNavigate()
  const [topicData, setTopicData] = useState<TopicDetail | null>(null)
  const [topicNavigation, setTopicNavigation] = useState<TopicNavigation>({ previousTopic: null, nextTopic: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const [progressCompleted, setProgressCompleted] = useState(false)
  const [progressToggling, setProgressToggling] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkToggling, setBookmarkToggling] = useState(false)
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({})
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({})
  const [copyCodeStatus, setCopyCodeStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [showTopicDrawer, setShowTopicDrawer] = useState(false)
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [completionModalOpen, setCompletionModalOpen] = useState(false)
  const [completionMeta, setCompletionMeta] = useState<CompletionMeta | null>(null)
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null)
  const [courseTopics, setCourseTopics] = useState<Array<{ id: string; title: string; moduleTitle: string; moduleId: string; completed: boolean }>>([])

  useEffect(() => {
    if (!topicId) {
      return undefined
    }

    let lastActive = Date.now()
    let accumulatedSeconds = 0
    let intervalId: number | undefined

    const handleFlush = async () => {
      if (accumulatedSeconds <= 0) {
        return
      }

      const secondsToCommit = accumulatedSeconds
      accumulatedSeconds = 0
      await learningActivityService.registerTopicActivity(topicId, secondsToCommit)
    }

    const tick = () => {
      const now = Date.now()
      const elapsedSeconds = Math.max(0, Math.floor((now - lastActive) / 1000))

      if (elapsedSeconds > 0) {
        accumulatedSeconds += elapsedSeconds
        lastActive = now
      }

      if (accumulatedSeconds >= 15) {
        void handleFlush()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void handleFlush()
        return
      }

      lastActive = Date.now()
    }

    const handleBeforeUnload = () => {
      void handleFlush()
    }

    intervalId = window.setInterval(tick, 15000)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      void handleFlush()
    }
  }, [topicId])

  const closeCompletionModal = () => {
    setCompletionModalOpen(false)
    setCompletionMeta(null)
  }

  useEffect(() => {
    if (!completionModalOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCompletionModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [completionModalOpen])

  useEffect(() => {
    if (!topicId) {
      setLoading(false)
      setError('Topic could not be found.')
      return
    }

    let isMounted = true

    const loadTopic = async () => {
      try {
        const [topic, progress, note, bookmark, adjacentTopics] = await Promise.all([
          topicService.getTopic(topicId),
          progressService.getProgress(topicId),
          notesService.getNote(topicId),
          bookmarksService.isBookmarked(topicId),
          topicService.getAdjacentTopics(topicId),
        ])

        if (!isMounted) return

        setTopicData(topic)
        setTopicNavigation({
          previousTopic: adjacentTopics.previousTopic
            ? { id: adjacentTopics.previousTopic.id, title: adjacentTopics.previousTopic.title }
            : null,
          nextTopic: adjacentTopics.nextTopic ? { id: adjacentTopics.nextTopic.id, title: adjacentTopics.nextTopic.title } : null,
        })
        setProgressCompleted(Boolean(progress?.completed))
        setNoteText(note?.content ?? '')
        setNoteSaved(false)
        setBookmarked(bookmark)
        setError(null)

        if (courseId) {
          const courseToLoad = await courseService.getCourse(courseId)
          setCourseDetail(courseToLoad)

          if (courseToLoad) {
            const courseProgress = await progressService.listProgress()
            const topicList = courseToLoad.modules.flatMap((module) =>
              module.topics.map((item) => ({
                id: item.id,
                title: item.title,
                moduleTitle: module.title,
                moduleId: module.id,
                completed: courseProgress.some((row) => row.topic_id === item.id && row.completed),
              })),
            )
            setCourseTopics(topicList)
          }
        }
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load topic.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadTopic()

    return () => {
      isMounted = false
    }
  }, [courseId, topicId])

  const currentModuleId = useMemo(
    () => courseDetail?.modules.find((module) => module.topics.some((item) => item.id === topicId))?.id ?? null,
    [courseDetail, topicId],
  )

  useEffect(() => {
    if (currentModuleId) {
      setExpandedModuleId(currentModuleId)
    }
  }, [currentModuleId])

  const practiceProblems = useMemo(() => topicData?.practiceProblems ?? [], [topicData])

  const topicSidebar = useMemo(
    () =>
      courseDetail?.modules.map((courseModule) => ({
        moduleId: courseModule.id,
        moduleTitle: courseModule.title,
        topics: courseModule.topics.map((item) => ({
          id: item.id,
          title: item.title,
          completed: courseTopics.some((entry) => entry.id === item.id && entry.completed),
        })),
      })) ?? [],
    [courseDetail, courseTopics],
  )

  if (loading) {
    return <LoadingState message="Loading topic..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Topic unavailable"
        description={error}
        action={
          <Link to={courseId ? `/app/courses/${courseId}` : '/app/courses'}>
            <Button variant="secondary">Back to course</Button>
          </Link>
        }
      />
    )
  }

  if (!topicData || !topicData.topic) {
    return (
      <EmptyState
        title="No topic found"
        description="This topic is not available in the current published catalog."
      />
    )
  }

  const { topic, topicContent, course, module } = topicData
  const lessonPageLink = courseId ? `/app/courses/${courseId}` : '/app/courses'

  const handleSaveNote = async () => {
    if (!topicId) return

    setNoteSaving(true)
    setNoteSaved(false)

    try {
      await notesService.saveNote(topicId, noteText)
      setNoteSaved(true)
    } finally {
      setNoteSaving(false)
    }
  }

  const handleToggleBookmark = async () => {
    if (!topicId) return

    setBookmarkToggling(true)
    try {
      if (bookmarked) {
        await bookmarksService.removeBookmark(topicId)
        setBookmarked(false)
      } else {
        await bookmarksService.addBookmark(topicId)
        setBookmarked(true)
      }
    } finally {
      setBookmarkToggling(false)
    }
  }

  const handleCopyCode = async () => {
    if (!topicContent?.example_code) {
      return
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(topicContent.example_code)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = topicContent.example_code
        textarea.setAttribute('readonly', 'true')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopyCodeStatus('copied')
      window.setTimeout(() => setCopyCodeStatus('idle'), 1500)
    } catch {
      setCopyCodeStatus('error')
      window.setTimeout(() => setCopyCodeStatus('idle'), 2000)
    }
  }

  const revealHint = (problemId: string) => {
    setRevealedHints((current) => ({ ...current, [problemId]: true }))
  }

  const revealSolution = (problemId: string) => {
    setRevealedSolutions((current) => ({ ...current, [problemId]: true }))
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId((current) => (current === moduleId ? null : moduleId))
  }

  const handleMarkCompleted = async () => {
    if (!topicId || progressCompleted) {
      return
    }

    setProgressToggling(true)

    try {
      const updated = await progressService.updateProgress(topicId, true)
      const resultCompleted = Boolean(updated?.completed)
      setProgressCompleted(resultCompleted)

      if (resultCompleted) {
        setCompletionMeta({
          title: topic.title,
          nextTopic: topicNavigation.nextTopic,
          courseCompleted: !topicNavigation.nextTopic,
        })
        setCompletionModalOpen(true)
      }
    } finally {
      setProgressToggling(false)
    }
  }

  const handleContinueToNextTopic = () => {
    if (!courseId) {
      closeCompletionModal()
      navigate('/app/progress')
      return
    }

    if (completionMeta?.nextTopic) {
      closeCompletionModal()
      navigate(`/app/courses/${courseId}/topics/${completionMeta.nextTopic.id}`)
      return
    }

    closeCompletionModal()
    navigate('/app/progress')
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--text-soft)]">
        <Link to="/app/courses" className="hover:text-sky-600">
          Courses
        </Link>
        <span>/</span>
        {course ? (
          <Link to={`/app/courses/${course.id}`} className="hover:text-sky-600">
            {course.title}
          </Link>
        ) : null}
        <span>/</span>
        <span className="text-[var(--text-primary)]">{topic.title}</span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          aria-label="Open topic navigation"
          onClick={() => setShowTopicDrawer((current) => !current)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--text-primary)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          Topics
        </button>
        <Link to={lessonPageLink}>
          <Button variant="secondary" type="button">
            Back to course
          </Button>
        </Link>
      </div>

      <PageHeader
        title={topic.title}
        description={topic.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {module ? <Badge>{module.title}</Badge> : null}
            <Button variant="ghost" onClick={handleToggleBookmark} disabled={bookmarkToggling}>
              {bookmarkToggling ? 'Saving...' : bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        }
      />

      <div className={`hidden gap-6 transition-all duration-200 lg:grid ${sidebarCollapsed ? 'lg:grid-cols-[64px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
        <aside className="sticky top-6 h-fit overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm transition-all duration-200">
          <div className="flex items-center justify-end border-b border-[var(--border)] p-2">
            <button
              type="button"
              aria-label={sidebarCollapsed ? 'Expand topic sidebar' : 'Collapse topic sidebar'}
              title={sidebarCollapsed ? 'Expand topic sidebar' : 'Collapse topic sidebar'}
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2 p-2">
              <button
                type="button"
                aria-label="Open topic navigation"
                title="Open topic navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm"
                onClick={() => setSidebarCollapsed(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{course?.title ?? 'Course'}</div>
              <div className="mb-4 text-sm text-[var(--text-muted)]">Course content</div>

              <div className="space-y-4">
                {topicSidebar.map((moduleEntry) => {
                  const isExpanded = expandedModuleId === moduleEntry.moduleId

                  return (
                    <div key={moduleEntry.moduleId} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-2">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`module-panel-${moduleEntry.moduleId}`}
                        onClick={() => toggleModule(moduleEntry.moduleId)}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
                      >
                        <span className="truncate">{moduleEntry.moduleTitle}</span>
                        <span className="text-base text-[var(--text-soft)]">{isExpanded ? '▾' : '▸'}</span>
                      </button>

                      {isExpanded ? (
                        <div id={`module-panel-${moduleEntry.moduleId}`} className="mt-2 space-y-2 px-1 pb-1">
                          {moduleEntry.topics.map((item) => (
                            <Link
                              key={item.id}
                              to={`/app/courses/${courseId}/topics/${item.id}`}
                              className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-sm transition ${
                                item.id === topic.id
                                  ? 'border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200'
                                  : 'border-[var(--border)] bg-[var(--panel)] text-[var(--text-primary)] hover:border-sky-200 hover:bg-[var(--surface-hover)]'
                              }`}
                            >
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] text-[10px]">
                                {item.completed ? '✓' : '○'}
                              </span>
                              <span className="truncate">{item.title}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        <div className="space-y-6">{renderContent()}</div>
      </div>

      <div className="lg:hidden">{renderContent()}</div>

      {showTopicDrawer ? (
        <div className="fixed inset-0 z-40 bg-slate-900/40 p-4 lg:hidden" onClick={() => setShowTopicDrawer(false)}>
          <div className="h-full rounded-3xl bg-[var(--panel)] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-base font-semibold text-[var(--text-primary)]">Course topics</div>
              <button
                type="button"
                aria-label="Close topic navigation drawer"
                onClick={() => setShowTopicDrawer(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pb-4">
              {topicSidebar.map((moduleEntry) => {
                const isExpanded = expandedModuleId === moduleEntry.moduleId

                return (
                  <div key={moduleEntry.moduleId} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/40">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-module-${moduleEntry.moduleId}`}
                      onClick={() => toggleModule(moduleEntry.moduleId)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
                    >
                      <span className="truncate">{moduleEntry.moduleTitle}</span>
                      <span className="text-base text-[var(--text-soft)]">{isExpanded ? '▾' : '▸'}</span>
                    </button>

                    {isExpanded ? (
                      <div id={`mobile-module-${moduleEntry.moduleId}`} className="space-y-2 border-t border-[var(--border)] bg-[var(--panel)] p-3">
                        {moduleEntry.topics.map((item) => (
                          <Link
                            key={item.id}
                            to={`/app/courses/${courseId}/topics/${item.id}`}
                            onClick={() => setShowTopicDrawer(false)}
                            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-sm ${
                              item.id === topic.id
                                ? 'border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200'
                                : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-primary)]'
                            }`}
                          >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] text-[10px]">
                              {item.completed ? '✓' : '○'}
                            </span>
                            <span className="truncate">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      {completionModalOpen && completionMeta ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeCompletionModal}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl transition-all duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-modal-title"
            aria-describedby="completion-modal-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-3xl" aria-hidden="true">🎉</div>
              <button
                type="button"
                aria-label="Close completion dialog"
                onClick={closeCompletionModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] text-lg text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
              >
                ×
              </button>
            </div>

            <div id="completion-modal-title" className="text-center text-2xl font-semibold text-[var(--text-primary)]">
              {completionMeta.courseCompleted ? '🎉 Course completed!' : 'Topic completed!'}
            </div>

            <div className="mt-4 text-center text-base font-medium text-[var(--text-primary)]">
              {completionMeta.title}
            </div>

            <p id="completion-modal-description" className="mt-4 text-center text-sm leading-6 text-[var(--text-muted)]">
              {completionMeta.courseCompleted ? 'Great work! You’ve completed the course.' : 'Great work! You’ve completed this lesson.'}
            </p>

            <div className="mt-6 space-y-3">
              {completionMeta.nextTopic ? (
                <Button type="button" onClick={handleContinueToNextTopic} className="w-full justify-center text-base">
                  Continue to Next Topic →
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button type="button" onClick={handleContinueToNextTopic} className="w-full justify-center text-base">
                    View Progress
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(`/app/courses/${courseId ?? ''}`)}
                    className="w-full justify-center text-base"
                  >
                    Back to Course
                  </Button>
                </div>
              )}

              <button
                type="button"
                onClick={closeCompletionModal}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {courseId && topicNavigation.previousTopic ? (
            <Link
              to={`/app/courses/${courseId}/topics/${topicNavigation.previousTopic.id}`}
              className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-sky-300 hover:text-sky-700"
            >
              ← Previous Topic
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text-soft)]">
              Previous Topic
            </span>
          )}
        </div>

        <div className="text-center">
          <Link to={lessonPageLink}>
            <Button variant="secondary" type="button">
              Back to course
            </Button>
          </Link>
        </div>

        <div className="min-w-0 flex-1 text-left sm:text-right">
          {courseId && topicNavigation.nextTopic ? (
            <Link
              to={`/app/courses/${courseId}/topics/${topicNavigation.nextTopic.id}`}
              className="inline-flex items-center rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Next Topic →
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text-soft)]">
              Next Topic
            </span>
          )}
        </div>
      </div>
    </div>
  )

  function renderContent() {
    return (
      <div className="space-y-6">
        <Card title="What is it?">
          <p className="text-base leading-7 text-[var(--text-muted)]">
            {topicContent?.definition ?? 'Definition is not available for this topic yet.'}
          </p>
        </Card>

        <Card title="Simple Explanation">
          <p className="text-base leading-7 text-[var(--text-muted)]">
            {topicContent?.explanation ?? 'No explanation is published for this topic yet.'}
          </p>
        </Card>

        <Card title="Key Points">
          {topicContent?.key_points && topicContent.key_points.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-[var(--text-muted)]">
              {topicContent.key_points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-soft)]">No key points published for this topic yet.</p>
          )}
        </Card>

        <Card title="Why It Matters">
          <p className="text-base leading-7 text-[var(--text-muted)]">
            {topicContent?.why_it_matters ?? 'No rationale has been added for this topic yet.'}
          </p>
        </Card>

        {topicContent?.example_code ? (
          <Card title="Example">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text-muted)]">Example code</p>
              <Button variant="secondary" onClick={handleCopyCode} type="button">
                {copyCodeStatus === 'copied' ? 'Copied!' : copyCodeStatus === 'error' ? 'Copy failed' : 'Copy code'}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">
              <code>{topicContent.example_code}</code>
            </pre>
          </Card>
        ) : null}

        {topicContent?.compiler_url ? (
          <Card title="Try It Yourself" subtitle="Experiment with the example in an external Java playground.">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-muted)]">Open the example in a separate environment to test and explore it hands-on.</p>
              <a
                href={topicContent.compiler_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
              >
                Open compiler
              </a>
            </div>
          </Card>
        ) : null}

        <Card title="Common Mistakes">
          {topicContent?.common_mistakes && topicContent.common_mistakes.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-[var(--text-muted)]">
              {topicContent.common_mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-soft)]">No common mistakes have been listed yet.</p>
          )}
        </Card>

        <Card title="Practice">
          {practiceProblems.length === 0 ? (
            <p className="text-[var(--text-soft)]">No practice problems are available for this topic yet.</p>
          ) : (
            <div className="space-y-4">
              {practiceProblems.map((problem) => (
                <div key={problem.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <p className="font-medium text-[var(--text-primary)]">{problem.question}</p>
                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">{problem.difficulty}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => revealHint(problem.id)} type="button">
                      {revealedHints[problem.id] ? 'Hint revealed' : 'Hint'}
                    </Button>
                    <Button variant="secondary" onClick={() => revealSolution(problem.id)} type="button">
                      {revealedSolutions[problem.id] ? 'Solution visible' : 'Show solution'}
                    </Button>
                  </div>

                  {revealedHints[problem.id] && problem.hint ? (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      <span className="font-medium">Hint:</span> {problem.hint}
                    </div>
                  ) : null}

                  {revealedSolutions[problem.id] && problem.solution ? (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                      <span className="font-medium">Solution:</span> {problem.solution}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Status">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            {progressCompleted ? (
              <div className="space-y-2">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">Topic completed</p>
                <p className="text-sm text-[var(--text-muted)]">
                  You’ve finished this lesson. You can still review it or mark it incomplete if you want to revisit it.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-[var(--text-primary)]">In progress</p>
                <p className="text-sm text-[var(--text-muted)]">Keep going through the examples and practice problems to finish this lesson.</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Personal Notes">
          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(event) => {
                setNoteText(event.target.value)
                setNoteSaved(false)
              }}
              rows={6}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-[var(--text-primary)] outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900"
              placeholder="Write your quick notes, reminders, or questions for this topic..."
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleSaveNote} disabled={noteSaving} type="button">
                {noteSaving ? 'Saving...' : 'Save note'}
              </Button>
              {noteSaved ? <span className="text-sm text-emerald-600 dark:text-emerald-300">Saved.</span> : null}
            </div>
          </div>
        </Card>

        <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white dark:border-sky-800 dark:from-sky-950/30 dark:to-slate-950">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Ready to finish this lesson?</div>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Complete your progress</h3>
            </div>

            <Button
              type="button"
              onClick={handleMarkCompleted}
              disabled={progressCompleted || progressToggling}
              className="min-w-[220px] justify-center px-5 py-3 text-base"
            >
              {progressToggling ? 'Saving...' : progressCompleted ? 'Completed' : '✓ Mark as Completed'}
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}
