import 'dotenv/config'
import { env } from '@/config/env'
import { createApp } from '@/app'
import { prisma } from '@/lib/prisma'

const app = createApp()

const server = app.listen(env.PORT, () => {
  console.log(`Job-Agent API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`)
})

/** Apagado ordenado: deja de aceptar conexiones nuevas, cierra la conexión
 * a la base de datos y termina el proceso. Importante en despliegues con
 * contenedores, donde el orquestador manda SIGTERM al reiniciar/escalar. */
function apagar(señal: string) {
  console.log(`\n${señal} recibido. Cerrando servidor…`)
  server.close(async () => {
    await prisma.$disconnect()
    console.log('Servidor cerrado correctamente.')
    process.exit(0)
  })

  // Si algo se queda colgado, forzamos la salida a los 10s.
  setTimeout(() => {
    console.error('No se pudo cerrar limpiamente a tiempo, forzando salida.')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => apagar('SIGTERM'))
process.on('SIGINT', () => apagar('SIGINT'))

process.on('unhandledRejection', (reason) => {
  console.error('Promesa rechazada sin manejar:', reason)
})
