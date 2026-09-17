import { useCallback, useEffect, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { mapActividad } from '@/lib/adapters'
import { useAuth } from '@/context/AuthContext'
import type { ActividadApi, DashboardStatsApi } from '@/types/api'
import type { ActividadReciente } from '@/types'

export function useDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState<DashboardStatsApi | null>(null)
  const [actividad, setActividad] = useState<ActividadReciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, actividadData] = await Promise.all([
        api.get<DashboardStatsApi>('/api/dashboard/stats', token),
        api.get<ActividadApi[]>('/api/dashboard/actividad?limit=6', token),
      ])
      setStats(statsData)
      setActividad(actividadData.map(mapActividad))
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudo cargar el resumen del dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { stats, actividad, loading, error, refetch: cargar }
}
