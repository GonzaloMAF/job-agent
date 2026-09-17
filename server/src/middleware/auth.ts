import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '@/lib/jwt'
import { ApiError } from '@/middleware/error'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No autenticado. Falta el token de acceso.'))
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.userId = payload.userId
    next()
  } catch {
    next(new ApiError(401, 'Token inválido o caducado.'))
  }
}
