import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute'
import { DashboardPage } from '@/pages/DashboardPage'
import { OfertasPage } from '@/pages/OfertasPage'
import { CandidaturasPage } from '@/pages/CandidaturasPage'
import { CvPage } from '@/pages/CvPage'
import { PerfilPage } from '@/pages/PerfilPage'
import { ConfiguracionPage } from '@/pages/ConfiguracionPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'ofertas', element: <OfertasPage /> },
          { path: 'candidaturas', element: <CandidaturasPage /> },
          { path: 'cv', element: <CvPage /> },
          { path: 'perfil', element: <PerfilPage /> },
          { path: 'configuracion', element: <ConfiguracionPage /> },
        ],
      },
    ],
  },
])
