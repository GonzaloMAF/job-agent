import { Router } from 'express'
import fs from 'fs'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { asyncHandler, ApiError } from '@/middleware/error'
import { uploadCv, rutaAbsolutaDesdeRelativa } from '@/lib/uploads'

export const cvRouter = Router()

/** GET /api/cv — CVs del usuario autenticado */
cvRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const cvs = await prisma.cv.findMany({
      where: { usuarioId: req.userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json(cvs)
  })
)

/** POST /api/cv — sube un CV real (multipart/form-data, campo "cv") */
cvRouter.post(
  '/',
  uploadCv.single('cv'),
  asyncHandler(async (req, res) => {
    const usuarioId = req.userId!
    const archivo = req.file

    if (!archivo) {
      throw new ApiError(400, 'No se ha recibido ningún archivo (campo "cv")')
    }

    const rutaRelativa = `cv/${usuarioId}/${archivo.filename}`

    const cv = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.cv.updateMany({
        where: { usuarioId, esActual: true },
        data: { esActual: false },
      })

      return tx.cv.create({
        data: {
          nombreArchivo: archivo.originalname,
          urlArchivo: rutaRelativa,
          tamanoBytes: archivo.size,
          usuarioId,
          esActual: true,
        },
      })
    })

    res.status(201).json(cv)
  })
)

/** GET /api/cv/:id/download — descarga el archivo si pertenece al usuario autenticado */
cvRouter.get(
  '/:id/download',
  asyncHandler(async (req, res) => {
    const cv = await prisma.cv.findUnique({ where: { id: req.params.id } })

    if (!cv || cv.usuarioId !== req.userId) {
      throw new ApiError(404, 'CV no encontrado')
    }

    const rutaAbsoluta = rutaAbsolutaDesdeRelativa(cv.urlArchivo)

    if (!fs.existsSync(rutaAbsoluta)) {
      throw new ApiError(404, 'El archivo ya no está disponible en el servidor')
    }

    res.download(rutaAbsoluta, cv.nombreArchivo)
  })
)

/** DELETE /api/cv/:id */
cvRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const cv = await prisma.cv.findUnique({ where: { id: req.params.id } })
    if (!cv || cv.usuarioId !== req.userId) {
      throw new ApiError(404, 'CV no encontrado')
    }

    await prisma.cv.delete({ where: { id: req.params.id } })

    const rutaAbsoluta = rutaAbsolutaDesdeRelativa(cv.urlArchivo)
    fs.promises.unlink(rutaAbsoluta).catch(() => {
      // El archivo ya no existía en disco; no es un error fatal para el usuario.
    })

    // Si el CV borrado era el actual, promocionamos el más reciente restante.
    if (cv.esActual) {
      const siguiente = await prisma.cv.findFirst({
        where: { usuarioId: req.userId },
        orderBy: { createdAt: 'desc' },
      })
      if (siguiente) {
        await prisma.cv.update({
          where: { id: siguiente.id },
          data: { esActual: true },
        })
      }
    }

    res.status(204).send()
  })
)
