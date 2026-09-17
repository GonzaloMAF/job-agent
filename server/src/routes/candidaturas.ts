import { Router } from 'express'
import { prisma } from '@/lib/prisma'
import { asyncHandler, ApiError } from '@/middleware/error'

export const candidaturasRouter = Router()

const ESTADOS_VALIDOS = [
  'GUARDADA',
  'APLICADA',
  'ENTREVISTA',
  'OFERTA',
  'RECHAZADA',
] as const

/** GET /api/candidaturas — candidaturas del usuario autenticado */
candidaturasRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const candidaturas = await prisma.candidatura.findMany({
      where: { usuarioId: req.userId },
      include: { oferta: true },
      orderBy: { fechaActualizacion: 'desc' },
    })

    res.json(candidaturas)
  })
)

/** POST /api/candidaturas — crear candidatura (guardar una oferta) */
candidaturasRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { ofertaId, estado } = req.body

    if (!ofertaId) {
      throw new ApiError(400, 'ofertaId es obligatorio')
    }

    const candidatura = await prisma.candidatura.create({
      data: { ofertaId, usuarioId: req.userId!, estado: estado ?? 'GUARDADA' },
      include: { oferta: true },
    })

    res.status(201).json(candidatura)
  })
)

/** PATCH /api/candidaturas/:id/estado — mover de columna en el Kanban */
candidaturasRouter.patch(
  '/:id/estado',
  asyncHandler(async (req, res) => {
    const { estado } = req.body

    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new ApiError(
        400,
        `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
      )
    }

    const existente = await prisma.candidatura.findUnique({
      where: { id: req.params.id },
    })
    if (!existente || existente.usuarioId !== req.userId) {
      throw new ApiError(404, 'Candidatura no encontrada')
    }

    const candidatura = await prisma.candidatura.update({
      where: { id: req.params.id },
      data: { estado },
      include: { oferta: true },
    })

    res.json(candidatura)
  })
)

/** PATCH /api/candidaturas/:id — actualizar notas */
candidaturasRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { notas } = req.body

    const existente = await prisma.candidatura.findUnique({
      where: { id: req.params.id },
    })
    if (!existente || existente.usuarioId !== req.userId) {
      throw new ApiError(404, 'Candidatura no encontrada')
    }

    const candidatura = await prisma.candidatura.update({
      where: { id: req.params.id },
      data: { notas },
    })

    res.json(candidatura)
  })
)

/** DELETE /api/candidaturas/:id */
candidaturasRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existente = await prisma.candidatura.findUnique({
      where: { id: req.params.id },
    })
    if (!existente || existente.usuarioId !== req.userId) {
      throw new ApiError(404, 'Candidatura no encontrada')
    }

    await prisma.candidatura.delete({ where: { id: req.params.id } })
    res.status(204).send()
  })
)
