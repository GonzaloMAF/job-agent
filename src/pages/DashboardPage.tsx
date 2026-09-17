import { Briefcase, Send, CalendarCheck, Clock, Gift, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card } from '@/components/ui/Card'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'
import type { ActividadReciente } from '@/types'

const iconByTipo: Record<ActividadReciente['tipo'], { icon: typeof Send; classes: string }> = {
  candidatura: { icon: Send, classes: 'bg-signal-soft text-signal-strong' },
  entrevista: { icon: CalendarCheck, classes: 'bg-info-soft text-info' },
  oferta: { icon: Gift, classes: 'bg-success-soft text-success' },
  sistema: { icon: RefreshCw, classes: 'bg-line-soft text-ink-soft' },
}

export function DashboardPage() {
  const { usuario } = useAuth()
  const { stats, actividad, loading, error, refetch } = useDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">
          Hola{usuario ? `, ${usuario.nombre.split(' ')[0]}` : ''}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Aquí tienes un resumen de tu búsqueda de empleo.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Cargando tu resumen…" />
      ) : error || !stats ? (
        <ErrorState message={error ?? 'No se pudo cargar el resumen.'} onRetry={refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Ofertas guardadas"
              value={stats.ofertasGuardadas}
              icon={Briefcase}
              accent="signal"
            />
            <StatCard
              label="Candidaturas enviadas"
              value={stats.candidaturasEnviadas}
              icon={Send}
              accent="info"
            />
            <StatCard
              label="Entrevistas"
              value={stats.entrevistas}
              icon={CalendarCheck}
              accent="success"
            />
            <StatCard
              label="Pendientes"
              value={stats.pendientes}
              icon={Clock}
              accent="warning"
            />
          </div>

          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-ink">
              Actividad reciente
            </h2>
            {actividad.length === 0 ? (
              <p className="mt-4 text-sm text-ink-faint">
                Todavía no hay actividad. Guarda una oferta o envía una candidatura para empezar.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {actividad.map((item) => {
                  const { icon: Icon, classes } = iconByTipo[item.tipo]
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${classes}`}>
                        <Icon size={16} strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1 border-b border-line-soft pb-4 last:border-none last:pb-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-sm font-medium text-ink">{item.titulo}</p>
                          <span className="shrink-0 text-xs text-ink-faint">{item.fecha}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-ink-soft">{item.descripcion}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
