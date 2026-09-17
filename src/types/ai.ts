export interface AnalisisCvApi {
  resumenGeneral: string
  puntuacionGeneral: number
  puntosFuertes: string[]
  areasDeMejora: string[]
  compatibilidadAts: { puntuacion: number; comentario: string }
  palabrasClaveSugeridas: string[]
}

export interface MatchOfertaApi {
  ofertaId: string
  match: number
  motivo: string
}
