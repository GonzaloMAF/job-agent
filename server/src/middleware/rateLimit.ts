import rateLimit from 'express-rate-limit'
import { env } from '@/config/env'

/**
 * Límite de intentos para /api/auth (login/registro): 20 peticiones cada
 * 15 minutos por IP. Generoso para un usuario real, suficiente para frenar
 * fuerza bruta básica. Desactivado en desarrollo para no molestar mientras
 * pruebas la app.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isDevelopment,
  message: { error: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.' },
})
