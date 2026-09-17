import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api, ApiRequestError } from '@/lib/api'

export interface UsuarioAutenticado {
  id: string
  nombre: string
  email: string
  ubicacion: string | null
  puestoDeseado: string | null
  experiencia: string | null
  tecnologias: string[]
}

interface AuthResponse {
  token: string
  usuario: UsuarioAutenticado
}

interface AuthContextValue {
  usuario: UsuarioAutenticado | null
  token: string | null
  cargando: boolean
  login: (email: string, password: string) => Promise<void>
  registrar: (nombre: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'job-agent:token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  )
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function cargarUsuario() {
      if (!token) {
        setCargando(false)
        return
      }

      try {
        const data = await api.get<{ usuario: UsuarioAutenticado }>(
          '/api/auth/me',
          token
        )
        if (!cancelado) setUsuario(data.usuario)
      } catch {
        if (!cancelado) {
          // Token inválido o caducado: cerramos sesión localmente
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUsuario(null)
        }
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargarUsuario()
    return () => {
      cancelado = true
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    })
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUsuario(data.usuario)
  }, [])

  const registrar = useCallback(
    async (nombre: string, email: string, password: string) => {
      const data = await api.post<AuthResponse>('/api/auth/register', {
        nombre,
        email,
        password,
      })
      localStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setUsuario(data.usuario)
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUsuario(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, login, registrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

export { ApiRequestError }
