import { useCallback, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { AnalisisCvApi, MatchOfertaApi } from '@/types/ai'

export function useAnalizarCv() {
  const { token } = useAuth()
  const [analisis, setAnalisis] = useState<AnalisisCvApi | null>(null)
  const [analizando, setAnalizando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analizar = useCallback(async () => {
    setAnalizando(true)
    setError(null)
    setAnalisis(null)
    try {
      const data = await api.post<AnalisisCvApi>('/api/ai/analizar-cv', {}, token)
      setAnalisis(data)
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'No se pudo analizar el CV.'
      )
    } finally {
      setAnalizando(false)
    }
  }, [token])

  return { analisis, analizando, error, analizar, cerrar: () => setAnalisis(null) }
}

export function useMatchingIA() {
  const { token } = useAuth()
  const [calculando, setCalculando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calcular = useCallback(async (): Promise<MatchOfertaApi[]> => {
    setCalculando(true)
    setError(null)
    try {
      return await api.post<MatchOfertaApi[]>('/api/ai/matching', {}, token)
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'No se pudo calcular el matching.'
      )
      return []
    } finally {
      setCalculando(false)
    }
  }, [token])

  return { calculando, error, calcular }
}
