import { Loader2, AlertTriangle, RotateCw } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink-faint">
      <Loader2 size={22} className="animate-spin text-signal" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 border-danger/30 bg-danger-soft/40 px-6 py-10 text-center">
      <AlertTriangle size={22} className="text-danger" />
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw size={14} /> Reintentar
        </Button>
      )}
    </Card>
  )
}
