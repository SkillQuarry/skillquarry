import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { bookmarksService } from '../features/bookmarks/bookmarks.service'
import { notesService } from '../features/notes/notes.service'
import { progressService } from '../features/progress/progress.service'
import { topicService } from '../features/topics/topic.service'
import type { TopicDetail } from '../features/topics/topic.types'

export function TopicPage() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const [topicData, setTopicData] = useState<TopicDetail | null>(null)
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

  useEffect(() => {
    if (!topicId) {
      setLoading(false)
      setError('Topic could not be found.')
      return
    }

    let isMounted = true

    const loadTopic = async () => {
      try {
        const [topic, progress, note, bookmark] = await Promise.all([
          topicService.getTopic(topicId),
          progressService.getProgress(topicId),
          notesService.getNote(topicId),
          bookmarksService.isBookmarked(topicId),
        ])

        if (!isMounted) return

        setTopicData(topic)
        setProgressCompleted(Boolean(progress?.completed))
        setNoteText(note?.content ?? '')
        setBookmarked(bookmark)
        setError(null)
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
  }, [topicId])

  const practiceProblems = useMemo(() => topicData?.practiceProblems ?? [], [topicData])

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

  const handleToggleProgress = async () => {
    if (!topicId) return

    setProgressToggling(true)
    try {
      const nextValue = !progressCompleted
      const updated = await progressService.updateProgress(topicId, nextValue)
      setProgressCompleted(Boolean(updated?.completed))
    } finally {
      setProgressToggling(false)
    }
  }

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

  const revealHint = (problemId: string) => {
    setRevealedHints((current) => ({ ...current, [problemId]: true }))
  }

  const revealSolution = (problemId: string) => {
    setRevealedSolutions((current) => ({ ...current, [problemId]: true }))
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/app/courses" className="hover:text-sky-600">Courses</Link>
        <span>/</span>
        {course ? (
          <Link to={`/app/courses/${course.id}`} className="hover:text-sky-600">
            {course.title}
          </Link>
        ) : null}
        <span>/</span>
        <span className="text-slate-700">{topic.title}</span>
      </div>

      <PageHeader
        title={topic.title}
        description={topic.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {module ? <Badge>{module.title}</Badge> : null}
            <Button variant={progressCompleted ? 'primary' : 'secondary'} onClick={handleToggleProgress} disabled={progressToggling}>
              {progressToggling ? 'Saving...' : progressCompleted ? 'Completed' : 'Mark completed'}
            </Button>
            <Button variant="ghost" onClick={handleToggleBookmark} disabled={bookmarkToggling}>
              {bookmarkToggling ? 'Saving...' : bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Card title="What is it?">
          <p className="text-base leading-7 text-slate-700">
            {topicContent?.definition ?? 'Definition is not available for this topic yet.'}
          </p>
        </Card>

        <Card title="Simple Explanation">
          <p className="text-base leading-7 text-slate-700">
            {topicContent?.explanation ?? 'No explanation is published for this topic yet.'}
          </p>
        </Card>

        <Card title="Key Points">
          {topicContent?.key_points && topicContent.key_points.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {topicContent.key_points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No key points published for this topic yet.</p>
          )}
        </Card>

        <Card title="Why It Matters">
          <p className="text-base leading-7 text-slate-700">
            {topicContent?.why_it_matters ?? 'No rationale has been added for this topic yet.'}
          </p>
        </Card>

        {topicContent?.example_code ? (
          <Card title="Example">
            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">
              {topicContent.example_code}
            </pre>
          </Card>
        ) : null}

        {topicContent?.compiler_url ? (
          <div className="flex justify-start">
            <a
              href={topicContent.compiler_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              Open Online Compiler
            </a>
          </div>
        ) : null}

        <Card title="Common Mistakes">
          {topicContent?.common_mistakes && topicContent.common_mistakes.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {topicContent.common_mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No common mistakes have been listed yet.</p>
          )}
        </Card>

        <Card title="Practice">
          {practiceProblems.length === 0 ? (
            <p className="text-slate-500">No practice problems are available for this topic yet.</p>
          ) : (
            <div className="space-y-4">
              {practiceProblems.map((problem) => (
                <div key={problem.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-800">{problem.question}</p>
                    <Badge>{problem.difficulty}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => revealHint(problem.id)}>
                      Hint
                    </Button>
                    <Button variant="secondary" onClick={() => revealSolution(problem.id)}>
                      Show Solution
                    </Button>
                  </div>

                  {revealedHints[problem.id] && problem.hint ? (
                    <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Hint: {problem.hint}</div>
                  ) : null}

                  {revealedSolutions[problem.id] && problem.solution ? (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Solution: {problem.solution}</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Personal Notes">
          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-400"
              placeholder="Write your notes for this topic..."
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSaveNote} disabled={noteSaving}>
                {noteSaving ? 'Saving...' : 'Save note'}
              </Button>
              {noteSaved ? <span className="text-sm text-emerald-600">Saved.</span> : null}
            </div>
          </div>
        </Card>

        <div className="flex justify-between gap-3">
          <Link to={lessonPageLink}>
            <Button variant="secondary">Back to course</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
