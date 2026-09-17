import { useCallback, useEffect, useState } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { CvApi } from '@/types/api'

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_BYTES = 5 * 1024 * 1024

export function useCv() {
  const { token } = useAuth()
  const [cvs, setCvs] = useState<CvApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subiendo, setSubiendo] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<CvApi[]>('/api/cv', token)
      setCvs(data)
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'No se pudieron cargar tus CVs.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    cargar()
  }, [cargar])

  const subirCv = useCallback(
    async (file: File) => {
      if (!TIPOS_PERMITIDOS.includes(file.type)) {
        throw new ApiRequestError(400, 'Formato no admitido. Sube un PDF o un Word (.doc/.docx).')
      }
      if (file.size > MAX_BYTES) {
        throw new ApiRequestError(400, 'El archivo supera el tamaño máximo permitido (5 MB).')
      }

      setSubiendo(true)
      try {
        const nuevo = await api.upload<CvApi>('/api/cv', 'cv', file, token)
        setCvs((prev) => [nuevo, ...prev.map((c) => ({ ...c, esActual: false }))])
      } finally {
        setSubiendo(false)
      }
    },
    [token]
  )

  const descargarCv = useCallback(
    async (cv: CvApi) => {
      await api.download(`/api/cv/${cv.id}/download`, cv.nombreArchivo, token)
    },
    [token]
  )

  const eliminarCv = useCallback(
    async (id: string) => {
      const previos = cvs
      setCvs((prev) => prev.filter((c) => c.id !== id))
      try {
        await api.delete(`/api/cv/${id}`, token)
        // Si el borrado promocionó otro CV a "actual" en el servidor, refrescamos.
        cargar()
      } catch (err) {
        setCvs(previos)
        throw err
      }
    },
    [cvs, token, cargar]
  )

  const actual = cvs.find((cv) => cv.esActual) ?? null
  const anteriores = cvs.filter((cv) => !cv.esActual)

  return {
    cvs,
    actual,
    anteriores,
    loading,
    error,
    subiendo,
    refetch: cargar,
    subirCv,
    descargarCv,
    eliminarCv,
  }
}
