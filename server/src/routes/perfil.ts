import { Router } from 'express'
import { prisma } from '@/lib/prisma'
import { asyncHandler, ApiError } from '@/middleware/error'

export const perfilRouter = Router()

/** GET /api/perfil — perfil del usuario autenticado */
perfilRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.userId },
      include: { formacion: true, preferencias: true },
    })

    if (!usuario) throw new ApiError(404, 'Usuario no encontrado')

    const { passwordHash: _passwordHash, ...usuarioSinPassword } = usuario
    res.json(usuarioSinPassword)
  })
)

/** PATCH /api/perfil — actualizar datos básicos del perfil */
perfilRouter.patch(
  '/',
  asyncHandler(async (req, res) => {
    const { nombre, ubicacion, puestoDeseado, experiencia, tecnologias } =
      req.body

    const usuario = await prisma.usuario.update({
      where: { id: req.userId },
      data: { nombre, ubicacion, puestoDeseado, experiencia, tecnologias },
    })

    const { passwordHash: _passwordHash, ...usuarioSinPassword } = usuario
    res.json(usuarioSinPassword)
  })
)

/** PATCH /api/perfil/preferencias */
perfilRouter.patch(
  '/preferencias',
  asyncHandler(async (req, res) => {
    const { modalidad, salarioMinimo, disponibilidad, tiposContrato } =
      req.body

    const preferencias = await prisma.preferenciasEmpleo.upsert({
      where: { usuarioId: req.userId },
      update: { modalidad, salarioMinimo, disponibilidad, tiposContrato },
      create: {
        usuarioId: req.userId!,
        modalidad,
        salarioMinimo,
        disponibilidad,
        tiposContrato,
      },
    })

    res.json(preferencias)
  })
)
