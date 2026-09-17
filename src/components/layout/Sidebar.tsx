import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Briefcase,
  KanbanSquare,
  FileText,
  UserCircle,
  Settings,
  Bot,
  X,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/ofertas', label: 'Ofertas', icon: Briefcase },
  { to: '/candidaturas', label: 'Mis candidaturas', icon: KanbanSquare },
  { to: '/cv', label: 'CV', icon: FileText },
  { to: '/perfil', label: 'Perfil', icon: UserCircle },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { usuario, logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-hull transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal text-white">
              <Bot size={18} strokeWidth={2.25} />
            </div>
            <span className="font-display text-[17px] font-bold text-white">
              Job-Agent
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-hull-text-dim hover:bg-hull-raised hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-signal text-white'
                    : 'text-hull-text hover:bg-hull-raised hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={isActive ? 'text-white' : 'text-hull-text-dim group-hover:text-white'}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-hull-line px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hull-raised text-sm font-semibold text-white">
              {usuario ? iniciales(usuario.nombre) : '··'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {usuario?.nombre ?? 'Cargando…'}
              </p>
              <p className="truncate text-xs text-hull-text-dim">
                {usuario?.puestoDeseado ?? usuario?.email ?? ''}
              </p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 rounded-md p-1.5 text-hull-text-dim hover:bg-hull-raised hover:text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
