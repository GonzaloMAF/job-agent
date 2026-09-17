import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { MulterError } from 'multer'
import { Prisma } from '@prisma/client'
import { env } from '@/config/env'

/** Envuelve controladores async para propagar errores al middleware de errores de Express. */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Convierte errores de "body-parser" (JSON malformado en el request) en un 400 limpio,
 * en vez de dejar que Express devuelva su página de error HTML por defecto. */
export function handleJsonParseErrors(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' })
  }
  next(err)
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message })
  }

  if (err instanceof MulterError) {
    const mensaje =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido (5 MB)'
        : `Error al subir el archivo: ${err.message}`
    return res.status(400).json({ error: mensaje })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'No se encontró el recurso solicitado' })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un registro con ese valor único' })
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'La operación hace referencia a un recurso que no existe' })
    }
  }

  // No filtramos el mensaje real de errores inesperados al cliente en
  // producción: solo se registra en el log del servidor.
  console.error(err)
  const mensaje =
    env.isDevelopment && err instanceof Error ? err.message : 'Error interno del servidor'
  return res.status(500).json({ error: mensaje })
}
