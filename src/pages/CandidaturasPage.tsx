import { KanbanColumn } from '@/components/candidaturas/KanbanColumn'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { useCandidaturas } from '@/hooks/useCandidaturas'
import type { EstadoCandidatura } from '@/types'

const columnas: EstadoCandidatura[] = [
  'Guardada',
  'Aplicada',
  'Entrevista',
  'Oferta',
  'Rechazada',
]

export function CandidaturasPage() {
  const { candidaturas, loading, error, refetch, moverEstado } = useCandidaturas()

  if (loading) return <LoadingState label="Cargando tus candidaturas…" />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <p className="mb-5 text-sm text-ink-soft">
        Usa el selector de cada tarjeta para mover una candidatura a otra etapa.
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnas.map((estado) => (
          <KanbanColumn
            key={estado}
            estado={estado}
            candidaturas={candidaturas.filter((c) => c.estado === estado)}
            onCambiarEstado={moverEstado}
          />
        ))}
      </div>
    </div>
  )
}
