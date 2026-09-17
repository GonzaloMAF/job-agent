import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { requireAuth } from '@/middleware/auth'
import { asyncHandler, ApiError } from '@/middleware/error'

export const authRouter = Router()

const SALT_ROUNDS = 10

function usuarioPublico(usuario: {
  id: string
  nombre: string
  email: string
  ubicacion: string | null
  puestoDeseado: string | null
  experiencia: string | null
  tecnologias: string[]
}) {
  const { id, nombre, email, ubicacion, puestoDeseado, experiencia, tecnologias } =
    usuario
  return { id, nombre, email, ubicacion, puestoDeseado, experiencia, tecnologias }
}

/** POST /api/auth/register */
authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      throw new ApiError(400, 'nombre, email y password son obligatorios')
    }

    if (String(password).length < 8) {
      throw new ApiError(400, 'La contraseña debe tener al menos 8 caracteres')
    }

    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) {
      throw new ApiError(409, 'Ya existe una cuenta con ese email')
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        configuracion: { create: {} },
      },
    })

    const token = signToken({ userId: usuario.id })
    res.status(201).json({ token, usuario: usuarioPublico(usuario) })
  })
)

/** POST /api/auth/login */
authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'email y password son obligatorios')
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      throw new ApiError(401, 'Email o contraseña incorrectos')
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash)
    if (!passwordValida) {
      throw new ApiError(401, 'Email o contraseña incorrectos')
    }

    const token = signToken({ userId: usuario.id })
    res.json({ token, usuario: usuarioPublico(usuario) })
  })
)

/** GET /api/auth/me — requiere estar autenticado */
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.userId },
    })

    if (!usuario) throw new ApiError(404, 'Usuario no encontrado')

    res.json({ usuario: usuarioPublico(usuario) })
  })
)
