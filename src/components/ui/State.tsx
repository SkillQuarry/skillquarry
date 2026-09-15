import type { ReactNode } from 'react'

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="panel flex min-h-48 items-center justify-center text-sm text-slate-500">
      {message}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
