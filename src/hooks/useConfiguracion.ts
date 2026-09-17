import { useCallback, useEffect, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { ConfiguracionApi } from '@/types/api'

export function useConfiguracion() {
  const { token } = useAuth()
  const [config, setConfig] = useState<ConfiguracionApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<ConfiguracionApi>('/api/configuracion', token)
      setConfig(data)
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudo cargar tu configuración.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    cargar()
  }, [cargar])

  const actualizar = useCallback(
    async (cambios: Partial<ConfiguracionApi>) => {
      if (!config) return
      const previo = config
      setConfig({ ...config, ...cambios })
      setGuardando(true)
      try {
        const actualizado = await api.patch<ConfiguracionApi>(
          '/api/configuracion',
          cambios,
          token
        )
        setConfig(actualizado)
      } catch (err) {
        setConfig(previo)
        throw err
      } finally {
        setGuardando(false)
      }
    },
    [config, token]
  )

  return { config, loading, error, guardando, actualizar, refetch: cargar }
}
