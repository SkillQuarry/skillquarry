import type { PropsWithChildren, ReactNode } from 'react'

interface CardProps extends PropsWithChildren {
  title?: ReactNode
  subtitle?: ReactNode
  className?: string
}

export function Card({ title, subtitle, className = '', children }: CardProps) {
  return (
    <div className={`panel p-4 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 sm:p-5 ${className}`.trim()}>
      {title ? (
        <div className="mb-4">
          <div className="text-lg font-semibold text-[var(--text-primary)]">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
