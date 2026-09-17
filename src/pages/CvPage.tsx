import { useRef, useState } from 'react'
import { FileText, Upload, Eye, Sparkles, UploadCloud, History, Trash2, Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { useCv } from '@/hooks/useCv'
import { useAnalizarCv } from '@/hooks/useAi'
import { ApiRequestError } from '@/lib/api'
import { formatFechaRelativa } from '@/utils/fecha'

function formatTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${Math.round(bytes / 1024)} KB`
}

export function CvPage() {
  const { actual, anteriores, loading, error, refetch, subiendo, subirCv, descargarCv, eliminarCv } = useCv()
  const { analisis, analizando, error: errorAnalisis, analizar, cerrar } = useAnalizarCv()
  const inputRef = useRef<HTMLInputElement>(null)
  const [subidaError, setSubidaError] = useState<string | null>(null)
  const [descargandoId, setDescargandoId] = useState<string | null>(null)

  async function handleArchivoSeleccionado(file: File | undefined) {
    if (!file) return
    setSubidaError(null)
    try {
      await subirCv(file)
    } catch (err) {
      setSubidaError(
        err instanceof ApiRequestError ? err.message : 'No se pudo subir el archivo.'
      )
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleVerCv(cv: NonNullable<typeof actual>) {
    setDescargandoId(cv.id)
    try {
      await descargarCv(cv)
    } catch (err) {
      setSubidaError(
        err instanceof ApiRequestError ? err.message : 'No se pudo descargar el CV.'
      )
    } finally {
      setDescargandoId(null)
    }
  }

  if (loading) return <LoadingState label="Cargando tu CV…" />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleArchivoSeleccionado(e.target.files?.[0])}
      />

      {subidaError && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{subidaError}</span>
        </div>
      )}

      {actual ? (
        <Card className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-signal-soft text-signal-strong">
                <FileText size={26} strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  {actual.nombreArchivo}
                </h2>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Actualizado {formatFechaRelativa(actual.createdAt)} · {formatTamano(actual.tamanoBytes)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleVerCv(actual)}
                disabled={descargandoId === actual.id}
              >
                {descargandoId === actual.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Eye size={16} />
                )}
                Ver CV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={analizar}
                disabled={analizando}
                title={!actual.nombreArchivo.toLowerCase().endsWith('.pdf') ? 'El análisis con IA solo admite PDF' : undefined}
              >
                {analizando ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {analizando ? 'Analizando…' : 'Analizar CV'}
              </Button>
              <Button size="sm" onClick={() => inputRef.current?.click()} disabled={subiendo}>
                {subiendo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Subir CV
              </Button>
            </div>
          </div>

          {errorAnalisis && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorAnalisis}</span>
            </div>
          )}
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <FileText size={24} className="text-ink-faint" />
          <p className="text-sm text-ink-soft">Todavía no has subido ningún CV.</p>
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={subiendo}>
            {subiendo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Subir CV
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 border-dashed p-10 text-center transition-colors hover:border-signal hover:bg-signal-soft/30 lg:col-span-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-soft text-signal-strong">
            <UploadCloud size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">
              Haz clic para subir tu CV
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Formatos admitidos: PDF, DOC, DOCX · Máx. 5 MB
            </p>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-ink">
            <History size={16} />
            <h2 className="font-display text-sm font-bold">
              Versiones anteriores
            </h2>
          </div>
          {anteriores.length > 0 ? (
            <ul className="space-y-3">
              {anteriores.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2 border-b border-line-soft pb-3 text-sm last:border-none last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-ink-soft">{v.nombreArchivo}</p>
                    <p className="text-xs text-ink-faint">{formatFechaRelativa(v.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleVerCv(v)}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-line-soft hover:text-ink-soft"
                      aria-label="Descargar"
                    >
                      {descargandoId === v.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => eliminarCv(v.id)}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-danger-soft hover:text-danger"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">No hay versiones anteriores todavía.</p>
          )}
        </Card>
      </div>

      {analisis && (
        <Modal title="Análisis de tu CV con IA" onClose={cerrar}>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-signal-soft font-display text-lg font-bold text-signal-strong">
                {analisis.puntuacionGeneral}
              </div>
              <p className="text-sm text-ink-soft">{analisis.resumenGeneral}</p>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
                <CheckCircle2 size={15} className="text-success" /> Puntos fuertes
              </h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {analisis.puntosFuertes.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
                <TrendingUp size={15} className="text-warning" /> Áreas de mejora
              </h3>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {analisis.areasDeMejora.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-line-soft/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">Compatibilidad ATS</h3>
                <span className="font-display text-lg font-bold text-ink">
                  {analisis.compatibilidadAts.puntuacion}/100
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{analisis.compatibilidadAts.comentario}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Palabras clave sugeridas</h3>
              <div className="flex flex-wrap gap-1.5">
                {analisis.palabrasClaveSugeridas.map((kw) => (
                  <Badge key={kw} tone="signal">{kw}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
