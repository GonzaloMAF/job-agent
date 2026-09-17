/** Convierte una fecha ISO en un texto relativo en español: "Hace 3 días", "Hoy", etc. */
export function formatFechaRelativa(iso: string): string {
  const fecha = new Date(iso)
  const ahora = new Date()
  const diffMs = ahora.getTime() - fecha.getTime()
  const diffMin = Math.round(diffMs / 60000)
  const diffHoras = Math.round(diffMin / 60)
  const diffDias = Math.round(diffHoras / 24)

  if (diffMin < 1) return 'Ahora mismo'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`
  if (diffDias === 1) return 'Ayer'
  if (diffDias < 7) return `Hace ${diffDias} días`
  if (diffDias < 14) return 'Hace 1 semana'
  if (diffDias < 30) return `Hace ${Math.round(diffDias / 7)} semanas`

  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
