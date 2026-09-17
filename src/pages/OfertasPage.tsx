import { useState } from 'react'
import { Sparkles, Loader2, Download } from 'lucide-react'
import { OfertaCard } from '@/components/ofertas/OfertaCard'
import { FiltrosOfertas } from '@/components/ofertas/FiltrosOfertas'
import { Button } from '@/components/ui/Button'
import { LoadingState, ErrorState } from '@/components/ui/AsyncState'
import { useOfertas } from '@/hooks/useOfertas'
import { useMatchingIA } from '@/hooks/useAi'
import { ApiRequestError } from '@/lib/api'

export function OfertasPage() {
  const { ofertas, loading, error, refetch, toggleGuardar, importarOfertas } = useOfertas()
  const { calculando, error: errorMatching, calcular } = useMatchingIA()
  const [matches, setMatches] = useState<Record<string, { match: number; motivo: string }>>({})
  const [importando, setImportando] = useState(false)
  const [mensajeImportacion, setMensajeImportacion] = useState<string | null>(null)
  const [errorImportacion, setErrorImportacion] = useState<string | null>(null)

  async function handleCalcularMatching() {
    const resultados = await calcular()
    const mapa: Record<string, { match: number; motivo: string }> = {}
    for (const r of resultados) mapa[r.ofertaId] = { match: r.match, motivo: r.motivo }
    setMatches(mapa)
  }

  async function handleImportar() {
    setImportando(true)
    setErrorImportacion(null)
    setMensajeImportacion(null)
    try {
      const { creadas, omitidas } = await importarOfertas()
      setMensajeImportacion(
        creadas > 0
          ? `Se importaron ${creadas} ofertas nuevas${omitidas > 0 ? ` (${omitidas} ya existían)` : ''}.`
          : 'No hay ofertas nuevas por ahora, ya tienes todas las disponibles.'
      )
    } catch (err) {
      setErrorImportacion(
        err instanceof ApiRequestError ? err.message : 'No se pudieron importar ofertas.'
      )
    } finally {
      setImportando(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div className="lg:sticky lg:top-[88px] lg:self-start">
        <FiltrosOfertas />
      </div>

      <div>
        {loading ? (
          <LoadingState label="Cargando ofertas…" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-ink-soft">
                {ofertas.length} ofertas encontradas
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleImportar} disabled={importando}>
                  {importando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  {importando ? 'Importando…' : 'Importar ofertas reales'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCalcularMatching} disabled={calculando}>
                  {calculando ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {calculando ? 'Calculando match con IA…' : 'Recalcular match con IA'}
                </Button>
              </div>
            </div>

            {mensajeImportacion && (
              <p className="mb-4 text-sm text-success">{mensajeImportacion}</p>
            )}
            {errorImportacion && (
              <p className="mb-4 text-sm text-danger">{errorImportacion}</p>
            )}
            {errorMatching && (
              <p className="mb-4 text-sm text-danger">{errorMatching}</p>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ofertas.map((oferta) => (
                <OfertaCard
                  key={oferta.id}
                  oferta={
                    matches[oferta.id]
                      ? { ...oferta, match: matches[oferta.id].match }
                      : oferta
                  }
                  motivoMatch={matches[oferta.id]?.motivo}
                  onToggleGuardar={toggleGuardar}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
