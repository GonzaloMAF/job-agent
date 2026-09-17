import { useCallback, useEffect, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { mapCandidatura, estadoHaciaApi } from '@/lib/adapters'
import { useAuth } from '@/context/AuthContext'
import type { CandidaturaApi } from '@/types/api'
import type { Candidatura, EstadoCandidatura } from '@/types'

export function useCandidaturas() {
  const { token } = useAuth()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<CandidaturaApi[]>('/api/candidaturas', token)
      setCandidaturas(data.map(mapCandidatura))
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudieron cargar tus candidaturas.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    cargar()
  }, [cargar])

  const moverEstado = useCallback(
    async (id: string, estado: EstadoCandidatura) => {
      const previas = candidaturas
      setCandidaturas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado } : c))
      )
      try {
        await api.patch(
          `/api/candidaturas/${id}/estado`,
          { estado: estadoHaciaApi(estado) },
          token
        )
      } catch (err) {
        setCandidaturas(previas)
        throw err
      }
    },
    [candidaturas, token]
  )

  const guardarOferta = useCallback(
    async (ofertaId: string) => {
      const nueva = await api.post<CandidaturaApi>(
        '/api/candidaturas',
        { ofertaId },
        token
      )
      setCandidaturas((prev) => [mapCandidatura(nueva), ...prev])
    },
    [token]
  )

  const quitarCandidatura = useCallback(
    async (id: string) => {
      const previas = candidaturas
      setCandidaturas((prev) => prev.filter((c) => c.id !== id))
      try {
        await api.delete(`/api/candidaturas/${id}`, token)
      } catch (err) {
        setCandidaturas(previas)
        throw err
      }
    },
    [candidaturas, token]
  )

  return {
    candidaturas,
    loading,
    error,
    refetch: cargar,
    moverEstado,
    guardarOferta,
    quitarCandidatura,
  }
}
