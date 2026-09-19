import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState, LoadingState } from '../components/ui/State'
import { bookmarksService, type BookmarkDetail } from '../features/bookmarks/bookmarks.service'

export function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadBookmarks = async () => {
      try {
        const items = await bookmarksService.listBookmarkDetails()
        if (!isMounted) return
        setBookmarks(items)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load bookmarks.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadBookmarks()

    return () => {
      isMounted = false
    }
  }, [])

  const handleRemove = async (topicId: string) => {
    try {
      await bookmarksService.removeBookmark(topicId)
      setBookmarks((current) => current.filter((bookmark) => bookmark.topic_id !== topicId))
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove this bookmark.')
    }
  }

  if (loading) {
    return <LoadingState message="Loading bookmarks..." />
  }

  if (error) {
    return (
      <EmptyState
        title="Bookmarks unavailable"
        description={error}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Bookmarks" description="Saved topics, explanations, and ideas for later review." />

      {bookmarks.length === 0 ? (
        <EmptyState
          title="Bookmark important lessons and revisit them later."
          description="Save the topics you want to keep coming back to for review and practice."
          action={
            <Link to="/app/courses">
              <Button variant="primary">Explore Courses</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => {
            const topic = bookmark.topic
            const module = bookmark.module
            const course = bookmark.course

            if (!topic || !course) {
              return null
            }

            return (
              <Card key={bookmark.id} className="h-full">
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{module?.title ?? 'Topic'}</div>
                      <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{topic.title}</h3>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Saved
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                    <p>{course.title}</p>
                    {module ? <p>{module.title}</p> : null}
                    <p>Saved {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to={`/app/courses/${course.id}/topics/${topic.id}`}>
                      <Button variant="primary" type="button">Open topic</Button>
                    </Link>
                    <Button variant="secondary" type="button" onClick={() => handleRemove(topic.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
