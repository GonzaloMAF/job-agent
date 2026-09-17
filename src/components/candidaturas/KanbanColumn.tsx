import { CandidaturaCard } from './CandidaturaCard'
import type { Candidatura, EstadoCandidatura } from '@/types'

const dotColor: Record<EstadoCandidatura, string> = {
  Guardada: 'bg-ink-faint',
  Aplicada: 'bg-signal',
  Entrevista: 'bg-info',
  Oferta: 'bg-success',
  Rechazada: 'bg-danger',
}

interface KanbanColumnProps {
  estado: EstadoCandidatura
  candidaturas: Candidatura[]
  onCambiarEstado: (id: string, estado: EstadoCandidatura) => void
}

export function KanbanColumn({ estado, candidaturas, onCambiarEstado }: KanbanColumnProps) {
  return (
    <div className="flex w-[280px] shrink-0 flex-col rounded-2xl bg-line-soft/60 p-3">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${dotColor[estado]}`} />
        <h3 className="text-sm font-semibold text-ink">{estado}</h3>
        <span className="ml-auto rounded-full bg-paper-raised px-2 py-0.5 text-xs font-medium text-ink-soft">
          {candidaturas.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {candidaturas.map((c) => (
          <CandidaturaCard key={c.id} candidatura={c} onCambiarEstado={onCambiarEstado} />
        ))}
        {candidaturas.length === 0 && (
          <div className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-ink-faint">
            Sin candidaturas aquí
          </div>
        )}
      </div>
    </div>
  )
}
