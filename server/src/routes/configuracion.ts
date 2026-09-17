import { Router } from 'express'
import { prisma } from '@/lib/prisma'
import { asyncHandler, ApiError } from '@/middleware/error'

export const configuracionRouter = Router()

/** GET /api/configuracion — configuración del usuario autenticado */
configuracionRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const config = await prisma.configuracion.findUnique({
      where: { usuarioId: req.userId },
    })

    if (!config) throw new ApiError(404, 'Configuración no encontrada')

    res.json(config)
  })
)

/** PATCH /api/configuracion — actualiza (o crea) la configuración */
configuracionRouter.patch(
  '/',
  asyncHandler(async (req, res) => {
    const {
      idioma,
      zonaHoraria,
      notifNuevasOfertas,
      notifRecordatorioEntrevista,
      notifResumenSemanal,
      busquedaAutomatica,
      soloConSalario,
      tema,
    } = req.body

    const data = {
      idioma,
      zonaHoraria,
      notifNuevasOfertas,
      notifRecordatorioEntrevista,
      notifResumenSemanal,
      busquedaAutomatica,
      soloConSalario,
      tema,
    }

    const config = await prisma.configuracion.upsert({
      where: { usuarioId: req.userId },
      update: data,
      create: { usuarioId: req.userId!, ...data },
    })

    res.json(config)
  })
)
