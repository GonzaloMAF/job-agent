import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { env } from '@/config/env'
import { authRouter } from '@/routes/auth'
import { ofertasRouter } from '@/routes/ofertas'
import { candidaturasRouter } from '@/routes/candidaturas'
import { dashboardRouter } from '@/routes/dashboard'
import { perfilRouter } from '@/routes/perfil'
import { cvRouter } from '@/routes/cv'
import { configuracionRouter } from '@/routes/configuracion'
import { aiRouter } from '@/routes/ai'
import { requireAuth } from '@/middleware/auth'
import { authRateLimit } from '@/middleware/rateLimit'
import { errorHandler, handleJsonParseErrors } from '@/middleware/error'
import { checkDbHealth } from '@/lib/prisma'

export function createApp() {
  const app = express()

  // Necesario para que express-rate-limit y los logs de IP funcionen bien
  // detrás de un proxy inverso (Nginx, Render, Railway, Fly.io...).
  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(compression())
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
    })
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(handleJsonParseErrors)

  app.get('/api/health', async (_req, res) => {
    const dbOk = await checkDbHealth()
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? 'ok' : 'degraded',
      database: dbOk ? 'up' : 'down',
    })
  })

  // Rutas públicas
  app.use('/api/auth', authRateLimit, authRouter)
  app.use('/api/ofertas', ofertasRouter)

  // Rutas que requieren estar autenticado
  app.use('/api/candidaturas', requireAuth, candidaturasRouter)
  app.use('/api/dashboard', requireAuth, dashboardRouter)
  app.use('/api/perfil', requireAuth, perfilRouter)
  app.use('/api/cv', requireAuth, cvRouter)
  app.use('/api/configuracion', requireAuth, configuracionRouter)
  app.use('/api/ai', requireAuth, aiRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
  })

  app.use(errorHandler)

  return app
}
