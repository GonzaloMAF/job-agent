import { SlidersHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const ubicaciones = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Remoto']
const modalidades = ['Todas', 'Remoto', 'Híbrido', 'Presencial']
const experiencias = ['Todas', 'Junior', '1-3 años', '3-5 años', '5+ años']
const tecnologias = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Figma']

function FiltroSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <select className="w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

export function FiltrosOfertas() {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2 text-ink">
        <SlidersHorizontal size={16} />
        <h2 className="font-display text-sm font-bold">Filtros</h2>
      </div>

      <div className="space-y-4">
        <FiltroSelect label="Ubicación" options={ubicaciones} />
        <FiltroSelect label="Modalidad" options={modalidades} />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-soft">
            Salario mínimo
          </label>
          <input
            type="range"
            min={20000}
            max={70000}
            step={1000}
            defaultValue={30000}
            className="w-full accent-signal"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-faint">
            <span>20k€</span>
            <span>70k€</span>
          </div>
        </div>

        <FiltroSelect label="Experiencia" options={experiencias} />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-soft">
            Tecnologías
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tecnologias.map((tech) => (
              <button
                key={tech}
                type="button"
                className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-signal hover:text-signal"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
