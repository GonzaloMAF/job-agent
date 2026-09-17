import { useCallback, useEffect, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { PerfilApi } from '@/types/api'

export function usePerfil() {
  const { token } = useAuth()
  const [perfil, setPerfil] = useState<PerfilApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<PerfilApi>('/api/perfil', token)
      setPerfil(data)
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudo cargar tu perfil.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { perfil, loading, error, refetch: cargar }
}
