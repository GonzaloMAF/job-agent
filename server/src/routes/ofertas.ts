import { Router } from 'express'
import { prisma } from '@/lib/prisma'
import { asyncHandler, ApiError } from '@/middleware/error'
import { requireAuth } from '@/middleware/auth'
import { importarOfertasArbeitnow } from '@/lib/scraping/arbeitnow'

export const ofertasRouter = Router()

/**
 * GET /api/ofertas
 * Filtros opcionales por query string: ubicacion, modalidad, salarioMin, tecnologia
 */
ofertasRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { ubicacion, modalidad, salarioMin, tecnologia } = req.query

    const ofertas = await prisma.oferta.findMany({
      where: {
        ...(ubicacion && {
          ubicacion: { contains: String(ubicacion), mode: 'insensitive' },
        }),
        ...(modalidad && { modalidad: String(modalidad) as never }),
        ...(salarioMin && { salarioMax: { gte: Number(salarioMin) } }),
        ...(tecnologia && {
          tecnologias: { has: String(tecnologia) },
        }),
      },
      orderBy: { fechaPublicacion: 'desc' },
    })

    res.json(ofertas)
  })
)

/** GET /api/ofertas/:id */
ofertasRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const oferta = await prisma.oferta.findUnique({
      where: { id: req.params.id },
    })

    if (!oferta) throw new ApiError(404, 'Oferta no encontrada')

    res.json(oferta)
  })
)

/**
 * POST /api/ofertas/importar — trae ofertas reales de tecnología desde la
 * API pública de Arbeitnow y las guarda (evitando duplicados por urlOriginal).
 * Requiere estar autenticado para evitar abuso del endpoint externo.
 */
ofertasRouter.post(
  '/importar',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limite = req.body?.limite ? Number(req.body.limite) : 20
    const importadas = await importarOfertasArbeitnow(limite)

    let creadas = 0
    let omitidas = 0

    for (const oferta of importadas) {
      const existente = await prisma.oferta.findFirst({
        where: { urlOriginal: oferta.urlOriginal },
      })

      if (existente) {
        omitidas += 1
        continue
      }

      await prisma.oferta.create({ data: oferta })
      creadas += 1
    }

    res.json({ creadas, omitidas, total: importadas.length })
  })
)

/** POST /api/ofertas — crear una oferta nueva */
ofertasRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const oferta = await prisma.oferta.create({ data: req.body })
    res.status(201).json(oferta)
  })
)
