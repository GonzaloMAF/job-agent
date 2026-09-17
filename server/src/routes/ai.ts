import { Router } from 'express'
import fs from 'fs/promises'
import { prisma } from '@/lib/prisma'
import { getAnthropicClient, ANTHROPIC_MODEL, parseJsonDeRespuesta } from '@/lib/anthropic'
import { rutaAbsolutaDesdeRelativa } from '@/lib/uploads'
import { asyncHandler, ApiError } from '@/middleware/error'

export const aiRouter = Router()

interface AnalisisCv {
  resumenGeneral: string
  puntuacionGeneral: number
  puntosFuertes: string[]
  areasDeMejora: string[]
  compatibilidadAts: { puntuacion: number; comentario: string }
  palabrasClaveSugeridas: string[]
}

/** POST /api/ai/analizar-cv — analiza el CV actual del usuario con IA */
aiRouter.post(
  '/analizar-cv',
  asyncHandler(async (req, res) => {
    const usuarioId = req.userId!

    const [cv, perfil] = await Promise.all([
      prisma.cv.findFirst({ where: { usuarioId, esActual: true } }),
      prisma.usuario.findUnique({ where: { id: usuarioId } }),
    ])

    if (!cv) {
      throw new ApiError(404, 'No tienes ningún CV subido todavía.')
    }

    if (!cv.urlArchivo.endsWith('.pdf')) {
      throw new ApiError(
        400,
        'El análisis con IA solo admite CVs en formato PDF por ahora. Sube tu CV como PDF para poder analizarlo.'
      )
    }

    const rutaAbsoluta = rutaAbsolutaDesdeRelativa(cv.urlArchivo)
    const bytes = await fs.readFile(rutaAbsoluta).catch(() => {
      throw new ApiError(404, 'El archivo del CV ya no está disponible en el servidor.')
    })

    const anthropic = getAnthropicClient()

    const puestoDeseado = perfil?.puestoDeseado ?? 'un puesto en tecnología'

    const mensaje = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: bytes.toString('base64'),
              },
            },
            {
              type: 'text',
              text: `Eres un experto en revisión de currículums para el mercado laboral tecnológico. La persona busca trabajo como: "${puestoDeseado}".

Analiza el CV adjunto y responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional, sin bloques de markdown), con esta forma exacta:

{
  "resumenGeneral": string (2-3 frases),
  "puntuacionGeneral": number (0-100),
  "puntosFuertes": string[] (3-5 puntos concretos),
  "areasDeMejora": string[] (3-5 puntos concretos y accionables),
  "compatibilidadAts": { "puntuacion": number (0-100), "comentario": string },
  "palabrasClaveSugeridas": string[] (5-8 palabras clave relevantes para el puesto que faltan o deberían reforzarse)
}`,
            },
          ],
        },
      ],
    })

    const bloqueTexto = mensaje.content.find((b) => b.type === 'text')
    if (!bloqueTexto || bloqueTexto.type !== 'text') {
      throw new ApiError(502, 'La IA no devolvió una respuesta de texto.')
    }

    const analisis = parseJsonDeRespuesta<AnalisisCv>(bloqueTexto.text)
    res.json(analisis)
  })
)

interface MatchOferta {
  ofertaId: string
  match: number
  motivo: string
}

/** POST /api/ai/matching — recalcula el match de cada oferta con IA según el perfil del usuario */
aiRouter.post(
  '/matching',
  asyncHandler(async (req, res) => {
    const usuarioId = req.userId!

    const [perfil, ofertas] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: { preferencias: true },
      }),
      prisma.oferta.findMany({ orderBy: { fechaPublicacion: 'desc' } }),
    ])

    if (!perfil) throw new ApiError(404, 'Usuario no encontrado')
    if (ofertas.length === 0) {
      res.json([])
      return
    }

    const anthropic = getAnthropicClient()

    const perfilResumen = {
      puestoDeseado: perfil.puestoDeseado,
      experiencia: perfil.experiencia,
      tecnologias: perfil.tecnologias,
      preferenciaModalidad: perfil.preferencias?.modalidad ?? null,
      salarioMinimo: perfil.preferencias?.salarioMinimo ?? null,
    }

    const ofertasResumen = ofertas.map((o: (typeof ofertas)[number]) => ({
      ofertaId: o.id,
      puesto: o.puesto,
      empresa: o.empresa,
      modalidad: o.modalidad,
      experiencia: o.experiencia,
      tecnologias: o.tecnologias,
      salarioMin: o.salarioMin,
      salarioMax: o.salarioMax,
      descripcionCorta: o.descripcionCorta,
    }))

    const mensaje = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Eres un asistente de búsqueda de empleo. Evalúa qué tan bien encaja cada oferta con el perfil de la persona, teniendo en cuenta tecnologías en común, nivel de experiencia y preferencia de modalidad/salario.

Perfil de la persona (JSON):
${JSON.stringify(perfilResumen)}

Ofertas a evaluar (JSON):
${JSON.stringify(ofertasResumen)}

Responde ÚNICAMENTE con un array JSON válido (sin texto adicional, sin bloques de markdown) con un objeto por cada oferta, en este formato exacto:
[{ "ofertaId": string, "match": number (0-100), "motivo": string (máximo 20 palabras, en español) }]`,
        },
      ],
    })

    const bloqueTexto = mensaje.content.find((b) => b.type === 'text')
    if (!bloqueTexto || bloqueTexto.type !== 'text') {
      throw new ApiError(502, 'La IA no devolvió una respuesta de texto.')
    }

    const resultados = parseJsonDeRespuesta<MatchOferta[]>(bloqueTexto.text)
    res.json(resultados)
  })
)
