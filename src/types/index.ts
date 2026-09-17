export type Modalidad = 'Remoto' | 'Híbrido' | 'Presencial'

export type EstadoCandidatura =
  | 'Guardada'
  | 'Aplicada'
  | 'Entrevista'
  | 'Oferta'
  | 'Rechazada'

export interface Oferta {
  id: string
  puesto: string
  empresa: string
  logoIniciales: string
  ubicacion: string
  modalidad: Modalidad
  salarioMin: number
  salarioMax: number
  fechaPublicacion: string
  match: number
  tecnologias: string[]
  experiencia: string
  guardada: boolean
  descripcionCorta: string
  urlOriginal: string | null
}

export interface Candidatura {
  id: string
  ofertaId: string
  puesto: string
  empresa: string
  logoIniciales: string
  estado: EstadoCandidatura
  fechaActualizacion: string
  ubicacion: string
  modalidad: Modalidad
  notas?: string
}

export interface ActividadReciente {
  id: string
  tipo: 'candidatura' | 'entrevista' | 'oferta' | 'sistema'
  titulo: string
  descripcion: string
  fecha: string
}
