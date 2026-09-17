const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiRequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      data?.error ?? 'Ha ocurrido un error inesperado'
    )
  }

  return data as T
}

/** Sube un archivo como multipart/form-data (sin fijar Content-Type: lo hace el navegador con el boundary correcto). */
async function uploadFile<T>(
  path: string,
  fieldName: string,
  file: File,
  token?: string | null
): Promise<T> {
  const formData = new FormData()
  formData.append(fieldName, file)

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      data?.error ?? 'No se pudo subir el archivo'
    )
  }

  return data as T
}

/** Descarga un archivo protegido por token y dispara la descarga en el navegador. */
async function downloadFile(
  path: string,
  nombreSugerido: string,
  token?: string | null
): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiRequestError(
      response.status,
      data?.error ?? 'No se pudo descargar el archivo'
    )
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreSugerido
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET', token }),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), token }),
  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'DELETE', token }),
  upload: uploadFile,
  download: downloadFile,
}
