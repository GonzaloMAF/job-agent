import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, AlertCircle } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/Button'
import { useAuth, ApiRequestError } from '@/context/AuthContext'

export function RegisterPage() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setEnviando(true)
    try {
      await registrar(nombre, email, password)
      navigate('/', { replace: true })
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
      title="Crea tu cuenta"
      subtitle="Empieza a organizar tu búsqueda de empleo"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="nombre"
          label="Nombre completo"
          type="text"
          autoComplete="name"
          placeholder="Laura Méndez"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
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
          <UserPlus size={16} />
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-signal hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
