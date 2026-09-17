import { Router } from 'express'
import { prisma } from '@/lib/prisma'
import { asyncHandler } from '@/middleware/error'

export const dashboardRouter = Router()

/** GET /api/dashboard/stats — métricas del usuario autenticado */
dashboardRouter.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const usuarioId = req.userId!

    const [ofertasGuardadas, candidaturasEnviadas, entrevistas, pendientes] =
      await Promise.all([
        prisma.candidatura.count({
          where: { usuarioId, estado: 'GUARDADA' },
        }),
        prisma.candidatura.count({
          where: { usuarioId, estado: { not: 'GUARDADA' } },
        }),
        prisma.candidatura.count({
          where: { usuarioId, estado: 'ENTREVISTA' },
        }),
        prisma.candidatura.count({
          where: { usuarioId, estado: { in: ['APLICADA', 'ENTREVISTA'] } },
        }),
      ])

    res.json({ ofertasGuardadas, candidaturasEnviadas, entrevistas, pendientes })
  })
)

/** GET /api/dashboard/actividad?limit=10 — actividad del usuario autenticado */
dashboardRouter.get(
  '/actividad',
  asyncHandler(async (req, res) => {
    const { limit } = req.query

    const actividad = await prisma.actividad.findMany({
      where: { usuarioId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: limit ? Number(limit) : 10,
    })

    res.json(actividad)
  })
)
