/**
 * Valida y centraliza las variables de entorno al arrancar el servidor.
 * Si falta algo obligatorio, el proceso falla rápido con un mensaje claro
 * en vez de fallar más tarde de forma confusa en mitad de una petición.
 */

function requerida(nombre: string): string {
  const valor = process.env[nombre]
  if (!valor || valor.trim() === '') {
    throw new Error(
      `Falta la variable de entorno obligatoria "${nombre}". Revisa tu archivo .env (usa .env.example como referencia).`
    )
  }
  return valor
}

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const isProduction = NODE_ENV === 'production'

const JWT_SECRET = requerida('JWT_SECRET')

if (isProduction && JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET es demasiado corto para producción (mínimo 32 caracteres). Genera uno nuevo, por ejemplo con: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
  )
}

if (isProduction && /cambia|changeme|secret123|dev_secret/i.test(JWT_SECRET)) {
  throw new Error(
    'JWT_SECRET parece un valor de ejemplo/desarrollo. Genera un secreto único antes de desplegar a producción.'
  )
}

export const env = {
  NODE_ENV,
  isProduction,
  isDevelopment: NODE_ENV === 'development',
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: requerida('DATABASE_URL'),
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  // Las funciones de IA son opcionales: si no hay clave, esas rutas
  // devuelven 503 en vez de romper el arranque del servidor.
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || null,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5',
}
