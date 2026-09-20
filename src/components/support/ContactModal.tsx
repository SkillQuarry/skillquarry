import { useEffect, useState } from 'react'

import { ContactForm } from './ContactForm'

export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSubmitted(false); onClose() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  const close = () => { setSubmitted(false); onClose() }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onClick={close}><div className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-start justify-between gap-4"><div><h2 id="contact-modal-title" className="text-xl font-semibold">{submitted ? 'Message sent successfully' : 'Contact & Help'}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{submitted ? 'Thanks for reaching out to SkillQuarry.' : 'Send general feedback, support, or account questions.'}</p></div><button type="button" aria-label="Close contact dialog" onClick={close} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg hover:bg-[var(--surface-hover)]">×</button></div>{submitted ? <div className="flex justify-end"><button type="button" onClick={close} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white">Close</button></div> : <ContactForm onSuccess={() => setSubmitted(true)} />}</div></div>
}