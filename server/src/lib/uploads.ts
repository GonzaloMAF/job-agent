import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import multer from 'multer'
import { ApiError } from '@/middleware/error'

export const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads')
export const CV_UPLOADS_DIR = path.join(UPLOADS_ROOT, 'cv')

const TIPOS_PERMITIDOS: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB, igual que el límite indicado en la UI

function carpetaUsuario(usuarioId: string) {
  const dir = path.join(CV_UPLOADS_DIR, usuarioId)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    try {
      cb(null, carpetaUsuario(req.userId!))
    } catch (err) {
      cb(err as Error, '')
    }
  },
  filename: (_req, file, cb) => {
    const extension = TIPOS_PERMITIDOS[file.mimetype] ?? path.extname(file.originalname)
    cb(null, `${crypto.randomUUID()}${extension}`)
  },
})

export const uploadCv = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!TIPOS_PERMITIDOS[file.mimetype]) {
      cb(new ApiError(400, 'Formato no admitido. Sube un PDF o un Word (.doc/.docx).'))
      return
    }
    cb(null, true)
  },
})

export function rutaAbsolutaDesdeRelativa(rutaRelativa: string) {
  return path.join(UPLOADS_ROOT, rutaRelativa)
}
