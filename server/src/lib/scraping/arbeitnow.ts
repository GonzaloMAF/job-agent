import { ApiError } from '@/middleware/error'

const ARBEITNOW_API_URL = 'https://arbeitnow.com/api/job-board-api'

interface ArbeitnowJob {
  slug: string
  company_name: string
  title: string
  description: string
  remote: boolean
  url: string
  tags: string[]
  job_types: string[]
  location: string
  created_at: number
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[]
}

export interface OfertaImportada {
  puesto: string
  empresa: string
  logoIniciales: string
  ubicacion: string
  modalidad: 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL'
  salarioMin: number
  salarioMax: number
  fechaPublicacion: Date
  tecnologias: string[]
  experiencia: string
  descripcionCorta: string
  fuente: string
  urlOriginal: string
}

// Solo nos interesan ofertas relacionadas con tecnología/producto para esta app.
// Se comprueba el TÍTULO contra palabras clave de alta precisión (evitamos
// "engineer" a secas, que también cuela ingenieros civiles, solares, etc.)
// y, en paralelo, las ETIQUETAS/tipos de puesto contra categorías tech.
const PALABRAS_CLAVE_TITULO = [
  'developer', 'entwickler', 'software', 'frontend', 'front-end', 'backend',
  'back-end', 'fullstack', 'full stack', 'devops', 'programmer',
  'data engineer', 'data scientist', 'machine learning', 'ios engineer',
  'android engineer', 'qa engineer', 'site reliability', ' sre ',
  'product designer', 'ux designer', 'ui designer', 'ux/ui', 'cloud engineer',
  'security engineer', 'platform engineer', 'systems engineer',
  'web developer', 'it-', 'programador', 'desarrollador',
]

const CATEGORIAS_TECH = [
  'it', 'software', 'engineering', 'technology', 'tech', 'programming',
  'development', 'data',
]

function pareceOfertaTech(job: ArbeitnowJob): boolean {
  const titulo = job.title.toLowerCase()
  const coincideTitulo = PALABRAS_CLAVE_TITULO.some((kw) => titulo.includes(kw))

  const etiquetas = [...job.tags, ...job.job_types].join(' ').toLowerCase()
  const coincideEtiqueta = CATEGORIAS_TECH.some((cat) => etiquetas.includes(cat))

  return coincideTitulo || coincideEtiqueta
}

function quitarHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '??'
}

function mapJob(job: ArbeitnowJob): OfertaImportada {
  const descripcionLimpia = quitarHtml(job.description)

  return {
    puesto: job.title,
    empresa: job.company_name,
    logoIniciales: iniciales(job.company_name),
    ubicacion: job.location || (job.remote ? 'Remoto' : 'No especificada'),
    // Arbeitnow solo distingue remoto/no-remoto; no hay dato de híbrido.
    modalidad: job.remote ? 'REMOTO' : 'PRESENCIAL',
    salarioMin: 0,
    salarioMax: 0,
    fechaPublicacion: new Date(job.created_at * 1000),
    tecnologias: job.tags.slice(0, 8),
    experiencia: job.job_types.join(', ') || 'No especificado',
    descripcionCorta: descripcionLimpia.slice(0, 280),
    fuente: 'arbeitnow',
    urlOriginal: job.url,
  }
}

/**
 * Trae ofertas reales desde la API pública de Arbeitnow
 * (https://arbeitnow.com/api/job-board-api), sin necesidad de API key.
 * Filtra solo ofertas relacionadas con tecnología y devuelve como máximo
 * `limite` resultados.
 */
export async function importarOfertasArbeitnow(limite = 20): Promise<OfertaImportada[]> {
  let respuesta: Response
  try {
    respuesta = await fetch(ARBEITNOW_API_URL)
  } catch {
    throw new ApiError(502, 'No se pudo conectar con la fuente de ofertas externa (Arbeitnow).')
  }

  if (!respuesta.ok) {
    throw new ApiError(502, `La fuente de ofertas externa respondió con un error (${respuesta.status}).`)
  }

  const json = (await respuesta.json()) as ArbeitnowResponse

  return json.data
    .filter(pareceOfertaTech)
    .slice(0, limite)
    .map(mapJob)
}
