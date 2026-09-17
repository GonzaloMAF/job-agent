import Anthropic from '@anthropic-ai/sdk'
import { env } from '@/config/env'
import { ApiError } from '@/middleware/error'

let client: Anthropic | null = null

export const ANTHROPIC_MODEL = env.ANTHROPIC_MODEL

/** Crea el cliente de Anthropic de forma perezosa: si falta la API key, el
 * error solo ocurre cuando alguien intenta usar una función de IA, no al
 * arrancar el servidor. */
export function getAnthropicClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new ApiError(
      503,
      'Las funciones de IA no están configuradas en el servidor (falta ANTHROPIC_API_KEY en .env)'
    )
  }

  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  }

  return client
}

/**
 * Extrae el primer bloque de JSON de la respuesta de texto de Claude,
 * tolerando que venga envuelto en ```json ... ``` u otro texto alrededor.
 */
export function parseJsonDeRespuesta<T>(texto: string): T {
  const limpio = texto
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')

  try {
    return JSON.parse(limpio) as T
  } catch {
    throw new ApiError(502, 'La IA devolvió una respuesta que no se pudo interpretar. Inténtalo de nuevo.')
  }
}
