import type { ReactNode } from 'react'
import { Bot } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal text-white">
            <Bot size={22} strokeWidth={2.25} />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            {title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-line bg-paper-raised p-6 shadow-[0_4px_24px_-8px_rgba(18,20,28,0.10)]">
          {children}
        </div>
      </div>
    </div>
  )
}
