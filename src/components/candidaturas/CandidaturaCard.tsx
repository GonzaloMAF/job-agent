import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Candidatura, Modalidad, EstadoCandidatura } from '@/types'

const modalidadTone: Record<Modalidad, 'success' | 'info' | 'neutral'> = {
  Remoto: 'success',
  Híbrido: 'info',
  Presencial: 'neutral',
}

const ESTADOS: EstadoCandidatura[] = [
  'Guardada',
  'Aplicada',
  'Entrevista',
  'Oferta',
  'Rechazada',
]

interface CandidaturaCardProps {
  candidatura: Candidatura
  onCambiarEstado: (id: string, estado: EstadoCandidatura) => void
}

export function CandidaturaCard({ candidatura, onCambiarEstado }: CandidaturaCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal-soft text-xs font-bold text-signal-strong">
          {candidatura.logoIniciales}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold leading-snug text-ink">
            {candidatura.puesto}
          </h4>
          <p className="text-xs text-ink-soft">{candidatura.empresa}</p>
        </div>
      </div>

      {candidatura.notas && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {candidatura.notas}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone={modalidadTone[candidatura.modalidad]}>
          {candidatura.modalidad}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} /> {candidatura.ubicacion}
        </span>
        <span>{candidatura.fechaActualizacion}</span>
      </div>

      <select
        value={candidatura.estado}
        onChange={(e) =>
          onCambiarEstado(candidatura.id, e.target.value as EstadoCandidatura)
        }
        className="mt-3 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-medium text-ink-soft focus:border-signal focus:outline-none"
      >
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            Mover a: {estado}
          </option>
        ))}
      </select>
    </Card>
  )
}
