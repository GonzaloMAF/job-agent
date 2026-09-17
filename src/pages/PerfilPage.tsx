import { Mail, MapPin, Briefcase, GraduationCap, Pencil } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { usePerfil } from '@/hooks/usePerfil'

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function PerfilPage() {
  const { perfil, loading, error, refetch } = usePerfil()

  if (loading) return <LoadingState label="Cargando tu perfil…" />
  if (error || !perfil) return <ErrorState message={error ?? 'No se pudo cargar el perfil.'} onRetry={refetch} />

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-signal-soft font-display text-xl font-bold text-signal-strong">
              {iniciales(perfil.nombre)}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {perfil.nombre}
              </h2>
              <p className="text-sm text-ink-soft">
                {perfil.puestoDeseado ?? 'Puesto deseado sin definir'}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
                <span className="inline-flex items-center gap-1">
                  <Mail size={13} /> {perfil.email}
                </span>
                {perfil.ubicacion && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} /> {perfil.ubicacion}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <Pencil size={15} /> Editar perfil
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-ink">
            <Briefcase size={16} />
            <h3 className="font-display text-sm font-bold">
              Experiencia y tecnologías
            </h3>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-line-soft pb-3">
              <dt className="text-ink-soft">Experiencia</dt>
              <dd className="font-medium text-ink">
                {perfil.experiencia ?? 'Sin especificar'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Puesto deseado</dt>
              <dd className="font-medium text-ink">
                {perfil.puestoDeseado ?? 'Sin especificar'}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {perfil.tecnologias.length > 0 ? (
              perfil.tecnologias.map((tech) => (
                <Badge key={tech} tone="signal">
                  {tech}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-ink-faint">Todavía no has añadido tecnologías.</p>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-ink">
            <GraduationCap size={16} />
            <h3 className="font-display text-sm font-bold">Formación</h3>
          </div>
          {perfil.formacion.length > 0 ? (
            <ul className="space-y-4">
              {perfil.formacion.map((f) => (
                <li key={f.id}>
                  <p className="text-sm font-medium text-ink">{f.titulo}</p>
                  <p className="text-sm text-ink-soft">{f.centro}</p>
                  <p className="text-xs text-ink-faint">{f.periodo}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">Todavía no has añadido formación.</p>
          )}
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h3 className="mb-4 font-display text-sm font-bold text-ink">
          Preferencias de empleo
        </h3>
        {perfil.preferencias ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-ink-faint">Modalidad</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {perfil.preferencias.modalidad}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Salario mínimo</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {perfil.preferencias.salarioMinimo.toLocaleString('es-ES')}€
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Disponibilidad</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {perfil.preferencias.disponibilidad}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Tipo de contrato</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {perfil.preferencias.tiposContrato.join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-faint">
            Todavía no has definido tus preferencias de empleo.
          </p>
        )}
      </Card>
    </div>
  )
}
