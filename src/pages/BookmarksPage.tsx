import { EmptyState } from '../components/ui/State'
import { PageHeader } from '../components/ui/PageHeader'

export function BookmarksPage() {
  return (
    <div>
      <PageHeader title="Bookmarks" description="Saved topics, explanations, and ideas for later review." />
      <EmptyState
        title="No bookmarks yet"
        description="Keep important lessons, examples, or topics here to revisit them anytime."
      />
    </div>
  )
}
