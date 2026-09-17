import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { token, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <Loader2 className="animate-spin text-signal" size={28} />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
