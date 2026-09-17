import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/config/env'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

// Evita crear múltiples instancias de PrismaClient en desarrollo (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    adapter,
    log: env.isDevelopment ? ['warn', 'error'] : ['error'],
  })

if (env.isDevelopment) {
  global.__prisma = prisma
}

/** Comprueba que la conexión a la base de datos responde, para /api/health. */
export async function checkDbHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
