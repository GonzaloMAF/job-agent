import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { mapOferta } from '@/lib/adapters'
import { useAuth } from '@/context/AuthContext'
import { useCandidaturas } from './useCandidaturas'
import type { OfertaApi } from '@/types/api'

export function useOfertas() {
  const { token } = useAuth()
  const [ofertasApi, setOfertasApi] = useState<OfertaApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    candidaturas,
    guardarOferta,
    quitarCandidatura,
    loading: cargandoCandidaturas,
  } = useCandidaturas()

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<OfertaApi[]>('/api/ofertas', token)
      setOfertasApi(data)
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudieron cargar las ofertas.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  const importarOfertas = useCallback(async () => {
    const resultado = await api.post<{ creadas: number; omitidas: number; total: number }>(
      '/api/ofertas/importar',
      {},
      token
    )
    await cargar()
    return resultado
  }, [token, cargar])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Mapa ofertaId -> candidatura, para saber qué ofertas están ya guardadas
  const candidaturaPorOferta = useMemo(() => {
    const mapa = new Map<string, string>()
    for (const c of candidaturas) mapa.set(c.ofertaId, c.id)
    return mapa
  }, [candidaturas])

  const ofertas = useMemo(
    () =>
      ofertasApi.map((dto) => mapOferta(dto, candidaturaPorOferta.has(dto.id))),
    [ofertasApi, candidaturaPorOferta]
  )

  const toggleGuardar = useCallback(
    async (ofertaId: string) => {
      const candidaturaId = candidaturaPorOferta.get(ofertaId)
      if (candidaturaId) {
        await quitarCandidatura(candidaturaId)
      } else {
        await guardarOferta(ofertaId)
      }
    },
    [candidaturaPorOferta, guardarOferta, quitarCandidatura]
  )

  return {
    ofertas,
    loading: loading || cargandoCandidaturas,
    error,
    refetch: cargar,
    toggleGuardar,
    importarOfertas,
  }
}
