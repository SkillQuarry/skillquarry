import type { PropsWithChildren, ReactNode } from 'react'

interface CardProps extends PropsWithChildren {
  title?: ReactNode
  subtitle?: ReactNode
  className?: string
}

export function Card({ title, subtitle, className = '', children }: CardProps) {
  return (
    <div className={`panel p-5 ${className}`.trim()}>
      {title ? (
        <div className="mb-4">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
