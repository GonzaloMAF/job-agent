import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/Button'
import { useAuth, ApiRequestError } from '@/context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede a tu panel de búsqueda de empleo"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={enviando}>
          <LogIn size={16} />
          {enviando ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-signal hover:underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  )
}
