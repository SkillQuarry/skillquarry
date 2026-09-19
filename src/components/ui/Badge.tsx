import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700 transition-colors dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300 ${className}`.trim()}
    >
      {children}
    </span>
  )
}
