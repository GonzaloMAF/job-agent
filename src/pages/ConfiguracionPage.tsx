import { Sun, Moon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { SettingRow } from '@/components/configuracion/SettingRow'
import { useConfiguracion } from '@/hooks/useConfiguracion'

export function ConfiguracionPage() {
  const { config, loading, error, refetch, actualizar } = useConfiguracion()

  if (loading) return <LoadingState label="Cargando tu configuración…" />
  if (error || !config) return <ErrorState message={error ?? 'No se pudo cargar la configuración.'} onRetry={refetch} />

  return (
    <div className="max-w-3xl space-y-6">
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">
          Preferencias generales
        </h2>
        <div className="mt-2">
          <SettingRow
            title="Idioma"
            description="Idioma en el que se muestra la aplicación."
            control={
              <select
                value={config.idioma}
                onChange={(e) => actualizar({ idioma: e.target.value })}
                className="rounded-lg border border-line bg-paper-raised px-3 py-1.5 text-sm text-ink focus:border-signal focus:outline-none"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            }
          />
          <SettingRow
            title="Zona horaria"
            description="Se usa para mostrar fechas de entrevistas y candidaturas."
            control={
              <select
                value={config.zonaHoraria}
                onChange={(e) => actualizar({ zonaHoraria: e.target.value })}
                className="rounded-lg border border-line bg-paper-raised px-3 py-1.5 text-sm text-ink focus:border-signal focus:outline-none"
              >
                <option value="Europe/Madrid">Europe/Madrid</option>
                <option value="UTC">UTC</option>
              </select>
            }
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">
          Notificaciones
        </h2>
        <div className="mt-2">
          <SettingRow
            title="Nuevas ofertas compatibles"
            description="Recibe un aviso cuando aparezca una oferta con alto match."
            control={
              <Toggle
                checked={config.notifNuevasOfertas}
                onChange={(v) => actualizar({ notifNuevasOfertas: v })}
              />
            }
          />
          <SettingRow
            title="Recordatorios de entrevista"
            description="Avisos antes de una entrevista programada."
            control={
              <Toggle
                checked={config.notifRecordatorioEntrevista}
                onChange={(v) => actualizar({ notifRecordatorioEntrevista: v })}
              />
            }
          />
          <SettingRow
            title="Resumen semanal por email"
            description="Un correo con el resumen de tu actividad cada semana."
            control={
              <Toggle
                checked={config.notifResumenSemanal}
                onChange={(v) => actualizar({ notifResumenSemanal: v })}
              />
            }
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">
          Preferencias de búsqueda
        </h2>
        <div className="mt-2">
          <SettingRow
            title="Búsqueda automática"
            description="Job-Agent buscará ofertas nuevas de forma periódica."
            control={
              <Toggle
                checked={config.busquedaAutomatica}
                onChange={(v) => actualizar({ busquedaAutomatica: v })}
              />
            }
          />
          <SettingRow
            title="Solo ofertas con salario visible"
            description="Oculta ofertas que no publican un rango salarial."
            control={
              <Toggle
                checked={config.soloConSalario}
                onChange={(v) => actualizar({ soloConSalario: v })}
              />
            }
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-base font-bold text-ink">Tema</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Elige cómo quieres ver la interfaz.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => actualizar({ tema: 'claro' })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              config.tema === 'claro'
                ? 'border-signal bg-signal-soft text-signal-strong'
                : 'border-line text-ink-soft hover:bg-line-soft'
            }`}
          >
            <Sun size={16} /> Claro
          </button>
          <button
            onClick={() => actualizar({ tema: 'oscuro' })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              config.tema === 'oscuro'
                ? 'border-signal bg-signal-soft text-signal-strong'
                : 'border-line text-ink-soft hover:bg-line-soft'
            }`}
          >
            <Moon size={16} /> Oscuro
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          El tema oscuro se aplicará visualmente en una fase posterior.
        </p>
      </Card>
    </div>
  )
}
