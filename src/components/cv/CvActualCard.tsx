import { FileText, Upload, Eye, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const cvActual = {
  nombreArchivo: 'CV_Laura_Mendez_2026.pdf',
  fechaActualizacion: '18 de agosto de 2026',
  tamano: '312 KB',
}

export function CvActualCard() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-signal-soft text-signal-strong">
            <FileText size={26} strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              {cvActual.nombreArchivo}
            </h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              Actualizado el {cvActual.fechaActualizacion} · {cvActual.tamano}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Eye size={16} /> Ver CV
          </Button>
          <Button variant="secondary" size="sm">
            <Sparkles size={16} /> Analizar CV
          </Button>
          <Button size="sm">
            <Upload size={16} /> Subir CV
          </Button>
        </div>
      </div>
    </Card>
  )
}
