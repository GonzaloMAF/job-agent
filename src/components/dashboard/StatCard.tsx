import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  accent: 'signal' | 'success' | 'warning' | 'info'
  trend?: string
}

const accentClasses = {
  signal: { bar: 'bg-signal', icon: 'bg-signal-soft text-signal-strong' },
  success: { bar: 'bg-success', icon: 'bg-success-soft text-success' },
  warning: { bar: 'bg-warning', icon: 'bg-warning-soft text-warning' },
  info: { bar: 'bg-info', icon: 'bg-info-soft text-info' },
}

export function StatCard({ label, value, icon: Icon, accent, trend }: StatCardProps) {
  const styles = accentClasses[accent]

  return (
    <Card className="relative overflow-hidden p-5">
      <div className={`absolute inset-y-0 left-0 w-1 ${styles.bar}`} />
      <div className="flex items-start justify-between pl-2">
        <div>
          <p className="text-sm text-ink-soft">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">
            {value}
          </p>
          {trend && (
            <p className="mt-1.5 text-xs font-medium text-ink-faint">{trend}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>
    </Card>
  )
}
