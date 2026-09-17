import { Menu, Search, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { usuario } = useAuth()
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-paper/90 px-5 py-4 backdrop-blur sm:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-ink-soft hover:bg-line-soft lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-display text-lg font-bold text-ink sm:text-xl">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="text"
            placeholder="Buscar ofertas, empresas…"
            className="w-64 rounded-lg border border-line bg-paper-raised py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none"
          />
        </div>

        <button
          className="relative rounded-full p-2 text-ink-soft hover:bg-line-soft"
          aria-label="Notificaciones"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-paper" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-signal-soft text-sm font-semibold text-signal-strong">
          {usuario ? iniciales(usuario.nombre) : '··'}
        </div>
      </div>
    </header>
  )
}
