import { useEffect, useState, type ReactNode } from 'react'
import { useAllNotesQuery, useCourseQuery, useCoursesQuery, useCreateDoubtMutation, useDoubtsQuery } from '../features/queries'
import { Button } from '../components/ui/Button'
import { EmptyState, LoadingState } from '../components/ui/State'
import { PageHeader } from '../components/ui/PageHeader'
import { formatLocalDateTime } from '../utils/date'
import type { DoubtDetail } from '../features/doubts/doubts.service'
import type { NoteDetail } from '../features/notes/notes.service'

const categories = ['Course Question', 'Topic Question', 'Practice Question', 'Other']

type DialogProps = { title: string; description?: string; onClose: () => void; children: ReactNode }

function Dialog({ title, description, onClose, children }: DialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onClick={onClose}>
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="notes-dialog-title" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="notes-dialog-title" className="text-xl font-semibold">{title}</h2>{description ? <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p> : null}</div><button type="button" aria-label="Close dialog" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg hover:bg-[var(--surface-hover)]">×</button></div>
        {children}
      </div>
    </div>
  )
}

function NoteDialog({ note, onClose }: { note: NoteDetail; onClose: () => void }) {
  return <Dialog title={note.topic?.title ?? 'Saved note'} description="Your private learning note" onClose={onClose}><div className="space-y-4"><div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"><p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-primary)]">{note.content || 'This note is empty.'}</p></div><div className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2"><div><b>Course</b><div>{note.courseTitle ?? 'Unavailable'}</div></div><div><b>Topic</b><div>{note.topic?.title ?? 'Unavailable'}</div></div><div><b>Created</b><div>{formatLocalDateTime(note.created_at)}</div></div><div><b>Updated</b><div>{formatLocalDateTime(note.updated_at)}</div></div></div></div></Dialog>
}

function DoubtDialog({ doubt, onClose }: { doubt: DoubtDetail; onClose: () => void }) {
  return <Dialog title={doubt.subject} description="Your submitted learning question" onClose={onClose}><div className="space-y-5"><div className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2"><div><b>Category</b><div>{doubt.category}</div></div><div><b>Status</b><div className="capitalize">{doubt.status.replace('_', ' ')}</div></div><div><b>Course</b><div>{doubt.courseTitle ?? 'Not specified'}</div></div><div><b>Topic</b><div>{doubt.topicTitle ?? 'Not specified'}</div></div><div><b>Submitted</b><div>{formatLocalDateTime(doubt.created_at)}</div></div></div><section><h3 className="font-semibold">Question</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">{doubt.message}</p></section><section className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950/30"><h3 className="font-semibold">Tutor/Admin Answer</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">{doubt.answer?.answer ?? 'Waiting for a tutor response.'}</p></section><section><h3 className="font-semibold">Comments</h3>{doubt.comments.length ? <div className="mt-2 space-y-2">{doubt.comments.map((comment) => <div key={comment.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-sm"><p>{comment.comment}</p><p className="mt-1 text-xs text-[var(--text-soft)]">{formatLocalDateTime(comment.created_at)}</p></div>)}</div> : <p className="mt-2 text-sm text-[var(--text-muted)]">No comments yet.</p>}</section></div></Dialog>
}

function NewDoubtDialog({ onClose }: { onClose: () => void }) {
  const { data: courses = [] } = useCoursesQuery()
  const [courseId, setCourseId] = useState('')
  const { data: selectedCourse } = useCourseQuery(courseId || null)
  const mutation = useCreateDoubtMutation()
  const [form, setForm] = useState({ subject: '', category: categories[0], topicId: '', message: '' })
  const [success, setSuccess] = useState(false)
  const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900'
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await mutation.mutateAsync({ ...form, courseId: courseId || null }); setSuccess(true) } catch { /* mutation error is rendered below */ } }

  if (success) return <Dialog title="Question submitted successfully" description="Your doubt has been saved. You can track responses from My Doubts." onClose={onClose}><div className="flex justify-end"><Button onClick={onClose}>Back to My Doubts</Button></div></Dialog>
  return <Dialog title="Ask a Question" description="A tutor or admin can respond to your submitted doubt." onClose={onClose}><form className="space-y-4" onSubmit={submit}><div><label htmlFor="doubt-subject">Subject</label><input id="doubt-subject" required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className={inputClass} /></div><div><label htmlFor="doubt-category">Category</label><select id="doubt-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="doubt-course">Course</label><select id="doubt-course" value={courseId} onChange={(event) => { setCourseId(event.target.value); setForm({ ...form, topicId: '' }) }} className={inputClass}><option value="">Optional</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></div><div><label htmlFor="doubt-topic">Topic</label><select id="doubt-topic" value={form.topicId} onChange={(event) => setForm({ ...form, topicId: event.target.value })} disabled={!selectedCourse} className={inputClass}><option value="">Optional</option>{selectedCourse?.modules.flatMap((module) => module.topics.map((topic) => <option key={topic.id} value={topic.id}>{module.title} / {topic.title}</option>))}</select></div></div><div><label htmlFor="doubt-message">Question</label><textarea id="doubt-message" required rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className={inputClass} /></div><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Submit question'}</Button>{mutation.isError ? <p className="text-sm text-rose-600" role="alert">{mutation.error instanceof Error ? mutation.error.message : 'Unable to submit your question.'}</p> : null}</form></Dialog>
}

export function NotesPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'doubts'>('notes')
  const [selectedNote, setSelectedNote] = useState<NoteDetail | null>(null)
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtDetail | null>(null)
  const [newDoubtOpen, setNewDoubtOpen] = useState(false)
  const notesQuery = useAllNotesQuery()
  const doubtsQuery = useDoubtsQuery()
  return <div className="space-y-6"><PageHeader title="Notes / Doubts" description="Keep private notes separate from questions you want help answering." /><div className="flex gap-2 border-b border-[var(--border)]" role="tablist" aria-label="Notes and doubts"><button type="button" role="tab" aria-selected={activeTab === 'notes'} onClick={() => setActiveTab('notes')} className={`border-b-2 px-3 py-2.5 text-sm font-medium ${activeTab === 'notes' ? 'border-sky-600 text-sky-600' : 'border-transparent text-[var(--text-muted)]'}`}>My Saved Notes</button><button type="button" role="tab" aria-selected={activeTab === 'doubts'} onClick={() => setActiveTab('doubts')} className={`border-b-2 px-3 py-2.5 text-sm font-medium ${activeTab === 'doubts' ? 'border-sky-600 text-sky-600' : 'border-transparent text-[var(--text-muted)]'}`}>My Doubts</button></div>{activeTab === 'notes' ? <section aria-label="My Saved Notes">{notesQuery.isLoading ? <LoadingState message="Loading your notes..." /> : notesQuery.error ? <EmptyState title="Could not load your notes" description={notesQuery.error.message} /> : notesQuery.data?.length ? <div className="grid gap-3 lg:grid-cols-2">{notesQuery.data.map((note) => <button type="button" key={note.id} onClick={() => setSelectedNote(note)} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-left shadow-sm transition hover:border-sky-300 hover:bg-[var(--surface-hover)]"><div className="font-semibold">{note.topic?.title ?? 'Saved note'}</div><p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">{note.content || 'This note is empty.'}</p><div className="mt-3 text-xs text-[var(--text-soft)]">{note.topic?.title ?? 'Unavailable topic'} · Updated {formatLocalDateTime(note.updated_at)}</div></button>)}</div> : <EmptyState title="No notes yet" description="Open a topic and save a note to build your personal learning trail." />}</section> : <section aria-label="My Doubts" className="space-y-4"><div className="flex justify-end"><Button onClick={() => setNewDoubtOpen(true)}>Ask a Question</Button></div>{doubtsQuery.isLoading ? <LoadingState message="Loading your doubts..." /> : doubtsQuery.error ? <EmptyState title="Could not load your doubts" description={doubtsQuery.error.message} /> : doubtsQuery.data?.length ? <div className="grid gap-3 lg:grid-cols-2">{doubtsQuery.data.map((doubt) => <button type="button" key={doubt.id} onClick={() => setSelectedDoubt(doubt)} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-left shadow-sm transition hover:border-sky-300 hover:bg-[var(--surface-hover)]"><div className="flex items-start justify-between gap-3"><span className="font-semibold">{doubt.subject}</span><span className="rounded-full bg-sky-100 px-2 py-1 text-xs capitalize text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">{doubt.status.replace('_', ' ')}</span></div><p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">{doubt.message}</p><div className="mt-3 text-xs text-[var(--text-soft)]">{doubt.category} · {formatLocalDateTime(doubt.created_at)}</div></button>)}</div> : <EmptyState title="No doubts yet" description="Submit a question when a concept needs another explanation." />}</section>}{selectedNote ? <NoteDialog note={selectedNote} onClose={() => setSelectedNote(null)} /> : null}{selectedDoubt ? <DoubtDialog doubt={selectedDoubt} onClose={() => setSelectedDoubt(null)} /> : null}{newDoubtOpen ? <NewDoubtDialog onClose={() => setNewDoubtOpen(false)} /> : null}</div>
}
