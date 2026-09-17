import { MapPin, Bookmark, Calendar, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Oferta, Modalidad } from '@/types'

const modalidadTone: Record<Modalidad, 'success' | 'info' | 'neutral'> = {
  Remoto: 'success',
  Híbrido: 'info',
  Presencial: 'neutral',
}

function formatSalario(min: number, max: number) {
  if (min === 0 && max === 0) return 'Salario no publicado'
  const fmt = (n: number) => `${Math.round(n / 1000)}k`
  return `${fmt(min)}€ – ${fmt(max)}€`
}

function matchTone(match: number): 'success' | 'signal' | 'warning' {
  if (match >= 85) return 'success'
  if (match >= 70) return 'signal'
  return 'warning'
}

interface OfertaCardProps {
  oferta: Oferta
  motivoMatch?: string
  onToggleGuardar: (id: string) => void
}

export function OfertaCard({ oferta, motivoMatch, onToggleGuardar }: OfertaCardProps) {
  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-[0_4px_20px_-6px_rgba(18,20,28,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal-soft font-display text-sm font-bold text-signal-strong">
            {oferta.logoIniciales}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug text-ink">
              {oferta.puesto}
            </h3>
            <p className="text-sm text-ink-soft">
              {oferta.empresa}
              {oferta.urlOriginal && (
                <span className="ml-1.5 text-xs text-ink-faint">· oferta real importada</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleGuardar(oferta.id)}
          className={`shrink-0 rounded-lg p-2 transition-colors ${
            oferta.guardada
              ? 'text-signal'
              : 'text-ink-faint hover:bg-line-soft hover:text-ink-soft'
          }`}
          aria-label={oferta.guardada ? 'Quitar de guardadas' : 'Guardar oferta'}
        >
          <Bookmark size={18} fill={oferta.guardada ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {oferta.descripcionCorta}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge tone={modalidadTone[oferta.modalidad]}>{oferta.modalidad}</Badge>
        <Badge tone={matchTone(oferta.match)}>
          <span title={motivoMatch}>{oferta.match}% match{motivoMatch ? ' · IA' : ''}</span>
        </Badge>
        {oferta.tecnologias.slice(0, 3).map((tech) => (
          <Badge key={tech} tone="neutral">
            {tech}
          </Badge>
        ))}
      </div>

      {motivoMatch && (
        <p className="mt-2 flex items-start gap-1 text-xs italic text-ink-faint">
          <Sparkles size={12} className="mt-0.5 shrink-0 text-signal" /> {motivoMatch}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} /> {oferta.ubicacion}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar size={13} /> {oferta.fechaPublicacion}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
        <span className="text-sm font-semibold text-ink">
          {formatSalario(oferta.salarioMin, oferta.salarioMax)}
        </span>
        {oferta.urlOriginal ? (
          <a href={oferta.urlOriginal} target="_blank" rel="noopener noreferrer">
            <Button size="sm">Ver oferta</Button>
          </a>
        ) : (
          <Button size="sm">Ver oferta</Button>
        )}
      </div>
    </Card>
  )
}
