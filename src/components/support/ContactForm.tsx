import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { Button } from '../ui/Button'
import { supportService } from '../../features/support/support.service'
import { useAuth } from '../../features/auth/AuthProvider'

function FieldLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--text-primary)]">{children}</label>
}

export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ subject: '', message: '', category: 'General support' })
  const mutation = useMutation({ mutationFn: () => supportService.createRequest({ type: 'contact', category: form.category, subject: form.subject, message: form.message }) })
  const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900'

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await mutation.mutateAsync()
      setForm({ subject: '', message: '', category: 'General support' })
      onSuccess?.()
    } catch {
      // The mutation error is rendered below so the dialog stays open.
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel htmlFor="contact-name">Name</FieldLabel><input id="contact-name" readOnly value={String(user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? '')} className={`${inputClass} opacity-75`} /></div>
        <div><FieldLabel htmlFor="contact-email">Email</FieldLabel><input id="contact-email" readOnly value={user?.email ?? ''} className={`${inputClass} opacity-75`} /></div>
      </div>
      <div><FieldLabel htmlFor="contact-category">Type</FieldLabel><select id="contact-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass}><option>General support</option><option>Feedback</option><option>Technical issue</option><option>Account issue</option><option>Suggestion</option></select></div>
      <div><FieldLabel htmlFor="contact-subject">Subject</FieldLabel><input id="contact-subject" required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className={inputClass} /></div>
      <div><FieldLabel htmlFor="contact-message">Message</FieldLabel><textarea id="contact-message" required rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className={inputClass} /></div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Sending...' : 'Send message'}</Button>
      {mutation.isError ? <p className="text-sm text-rose-600" role="alert">{mutation.error instanceof Error ? mutation.error.message : 'Unable to send your message.'}</p> : null}
    </form>
  )
}