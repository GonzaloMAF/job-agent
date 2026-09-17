import type { ReactNode } from 'react'

type BadgeTone = 'signal' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  signal: 'bg-signal-soft text-signal-strong',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-line-soft text-ink-soft',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
