import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function PublicOnlyRoute() {
  const { token, cargando } = useAuth()

  if (cargando) return null

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
