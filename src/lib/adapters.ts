import type { Oferta, Candidatura, ActividadReciente, Modalidad, EstadoCandidatura } from '@/types'
import type {
  OfertaApi,
  CandidaturaApi,
  ActividadApi,
  ModalidadApi,
  EstadoCandidaturaApi,
  TipoActividadApi,
} from '@/types/api'
import { formatFechaRelativa } from '@/utils/fecha'

const MODALIDAD_FROM_API: Record<ModalidadApi, Modalidad> = {
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido',
  PRESENCIAL: 'Presencial',
}

const MODALIDAD_TO_API: Record<Modalidad, ModalidadApi> = {
  Remoto: 'REMOTO',
  Híbrido: 'HIBRIDO',
  Presencial: 'PRESENCIAL',
}

const ESTADO_FROM_API: Record<EstadoCandidaturaApi, EstadoCandidatura> = {
  GUARDADA: 'Guardada',
  APLICADA: 'Aplicada',
  ENTREVISTA: 'Entrevista',
  OFERTA: 'Oferta',
  RECHAZADA: 'Rechazada',
}

const ESTADO_TO_API: Record<EstadoCandidatura, EstadoCandidaturaApi> = {
  Guardada: 'GUARDADA',
  Aplicada: 'APLICADA',
  Entrevista: 'ENTREVISTA',
  Oferta: 'OFERTA',
  Rechazada: 'RECHAZADA',
}

const TIPO_ACTIVIDAD_FROM_API: Record<TipoActividadApi, ActividadReciente['tipo']> = {
  CANDIDATURA: 'candidatura',
  ENTREVISTA: 'entrevista',
  OFERTA: 'oferta',
  SISTEMA: 'sistema',
}

export function modalidadDesdeApi(modalidad: ModalidadApi): Modalidad {
  return MODALIDAD_FROM_API[modalidad]
}

export function modalidadHaciaApi(modalidad: Modalidad): ModalidadApi {
  return MODALIDAD_TO_API[modalidad]
}

export function estadoHaciaApi(estado: EstadoCandidatura): EstadoCandidaturaApi {
  return ESTADO_TO_API[estado]
}

export function mapOferta(dto: OfertaApi, guardada: boolean): Oferta {
  return {
    id: dto.id,
    puesto: dto.puesto,
    empresa: dto.empresa,
    logoIniciales: dto.logoIniciales,
    ubicacion: dto.ubicacion,
    modalidad: modalidadDesdeApi(dto.modalidad),
    salarioMin: dto.salarioMin,
    salarioMax: dto.salarioMax,
    fechaPublicacion: formatFechaRelativa(dto.fechaPublicacion),
    match: dto.match,
    tecnologias: dto.tecnologias,
    experiencia: dto.experiencia,
    guardada,
    descripcionCorta: dto.descripcionCorta,
    urlOriginal: dto.urlOriginal,
  }
}

export function mapCandidatura(dto: CandidaturaApi): Candidatura {
  return {
    id: dto.id,
    ofertaId: dto.ofertaId,
    puesto: dto.oferta.puesto,
    empresa: dto.oferta.empresa,
    logoIniciales: dto.oferta.logoIniciales,
    estado: ESTADO_FROM_API[dto.estado],
    fechaActualizacion: formatFechaRelativa(dto.fechaActualizacion),
    ubicacion: dto.oferta.ubicacion,
    modalidad: modalidadDesdeApi(dto.oferta.modalidad),
    notas: dto.notas ?? undefined,
  }
}

export function mapActividad(dto: ActividadApi): ActividadReciente {
  return {
    id: dto.id,
    tipo: TIPO_ACTIVIDAD_FROM_API[dto.tipo],
    titulo: dto.titulo,
    descripcion: dto.descripcion,
    fecha: formatFechaRelativa(dto.createdAt),
  }
}
