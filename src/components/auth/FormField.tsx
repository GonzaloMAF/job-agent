import type { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FormField({ label, id, className = '', ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
