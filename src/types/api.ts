export type ModalidadApi = 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL'
export type EstadoCandidaturaApi =
  | 'GUARDADA'
  | 'APLICADA'
  | 'ENTREVISTA'
  | 'OFERTA'
  | 'RECHAZADA'
export type TipoActividadApi = 'CANDIDATURA' | 'ENTREVISTA' | 'OFERTA' | 'SISTEMA'

export interface OfertaApi {
  id: string
  puesto: string
  empresa: string
  logoIniciales: string
  ubicacion: string
  modalidad: ModalidadApi
  salarioMin: number
  salarioMax: number
  fechaPublicacion: string
  match: number
  tecnologias: string[]
  experiencia: string
  descripcionCorta: string
  fuente: string
  urlOriginal: string | null
  createdAt: string
}

export interface CandidaturaApi {
  id: string
  estado: EstadoCandidaturaApi
  notas: string | null
  fechaActualizacion: string
  ofertaId: string
  usuarioId: string
  createdAt: string
  oferta: OfertaApi
}

export interface DashboardStatsApi {
  ofertasGuardadas: number
  candidaturasEnviadas: number
  entrevistas: number
  pendientes: number
}

export interface ActividadApi {
  id: string
  tipo: TipoActividadApi
  titulo: string
  descripcion: string
  usuarioId: string
  createdAt: string
}

export interface FormacionApi {
  id: string
  titulo: string
  centro: string
  periodo: string
}

export interface PreferenciasEmpleoApi {
  modalidad: string
  salarioMinimo: number
  disponibilidad: string
  tiposContrato: string[]
}

export interface PerfilApi {
  id: string
  nombre: string
  email: string
  ubicacion: string | null
  puestoDeseado: string | null
  experiencia: string | null
  tecnologias: string[]
  formacion: FormacionApi[]
  preferencias: PreferenciasEmpleoApi | null
}

export interface CvApi {
  id: string
  nombreArchivo: string
  urlArchivo: string
  tamanoBytes: number
  esActual: boolean
  createdAt: string
}

export interface ConfiguracionApi {
  idioma: string
  zonaHoraria: string
  notifNuevasOfertas: boolean
  notifRecordatorioEntrevista: boolean
  notifResumenSemanal: boolean
  busquedaAutomatica: boolean
  soloConSalario: boolean
  tema: string
}
