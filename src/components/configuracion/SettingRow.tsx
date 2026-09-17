import type { ReactNode } from 'react'

interface SettingRowProps {
  title: string
  description: string
  control: ReactNode
}

export function SettingRow({ title, description, control }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line-soft py-4 last:border-none">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}
