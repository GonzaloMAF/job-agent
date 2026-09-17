# Job-Agent

Aplicación web para gestionar y automatizar la búsqueda de empleo: sigue ofertas, organiza tus candidaturas en un Kanban, analiza tu CV con IA y descubre ofertas reales, todo desde un único panel.

Construido en fases incrementales como proyecto de portfolio full-stack.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Puesta en marcha (desarrollo)](#puesta-en-marcha-desarrollo)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue con Docker](#despliegue-con-docker)
- [Referencia de la API](#referencia-de-la-api)
- [Seguridad y producción](#seguridad-y-producción)
- [Historial de fases](#historial-de-fases)
- [Licencia](#licencia)

## Funcionalidades

- **Dashboard** con métricas reales (ofertas guardadas, candidaturas, entrevistas) y actividad reciente.
- **Ofertas**: listado con filtros, guardado con un clic, e **importación de ofertas reales de tecnología** desde una API pública de empleo.
- **Kanban de candidaturas**: Guardada → Aplicada → Entrevista → Oferta → Rechazada.
- **CV**: subida real de archivos (PDF/DOC/DOCX), descarga, historial de versiones, y **análisis con IA** (resumen, puntos fuertes, compatibilidad ATS).
- **Matching con IA**: recalcula el porcentaje de encaje de cada oferta con tu perfil usando Claude.
- **Autenticación** propia con JWT y contraseñas hasheadas con bcrypt.
- **Configuración** de preferencias, notificaciones y tema, persistida de verdad.

## Stack

**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Lucide React
**Backend:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT · bcrypt
**IA:** Anthropic API (`@anthropic-ai/sdk`)
**Infraestructura:** Docker, Docker Compose, Nginx

## Estructura del repositorio

```
job-agent/
├── src/                    Frontend (React + TypeScript + Vite)
│   ├── components/         Componentes por sección (dashboard, ofertas, candidaturas, cv, auth, ui...)
│   ├── pages/               Páginas de cada ruta
│   ├── hooks/                Hooks que hablan con la API (useOfertas, useCandidaturas, useAi...)
│   ├── context/              AuthContext (sesión, token)
│   ├── lib/                  Cliente HTTP (api.ts) y adaptadores backend↔UI (adapters.ts)
│   └── types/                 Tipos compartidos
├── server/                 Backend (Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── routes/            Endpoints REST por dominio
│   │   ├── middleware/        Auth, rate limiting, manejo de errores
│   │   ├── lib/                 Prisma, JWT, Anthropic, subida de archivos, scraping
│   │   └── config/env.ts        Validación centralizada de variables de entorno
│   ├── prisma/schema.prisma   Modelo de datos
│   └── Dockerfile
├── Dockerfile              Build del frontend (Vite + Nginx)
├── docker-compose.yml      Orquesta Postgres + backend + frontend
└── nginx.conf
```

## Puesta en marcha (desarrollo)

Requisitos: Node.js 20+ y PostgreSQL corriendo localmente (o accesible por red).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # ajusta DATABASE_URL y genera un JWT_SECRET propio
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed             # opcional: datos de ejemplo
npm run dev
```

La API queda en `http://localhost:4000` (comprueba `http://localhost:4000/api/health`).

Usuario de prueba tras el seed: `laura.mendez@ejemplo.com` / `Password123!`

### 2. Frontend

```bash
# en otra terminal, desde la raíz del repo
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`.

## Variables de entorno

### `server/.env`

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión de PostgreSQL |
| `JWT_SECRET` | Sí | Secreto para firmar los tokens. En producción, mínimo 32 caracteres y no puede parecer un valor de ejemplo (el servidor rechaza arrancar si lo detecta) |
| `JWT_EXPIRES_IN` | No (`7d`) | Duración del token de sesión |
| `PORT` | No (`4000`) | Puerto del servidor |
| `CORS_ORIGIN` | No (`http://localhost:5173`) | Origen permitido para peticiones del frontend |
| `ANTHROPIC_API_KEY` | No | Habilita análisis de CV y matching con IA. Sin ella, esas rutas devuelven 503 sin afectar al resto de la app |
| `ANTHROPIC_MODEL` | No (`claude-sonnet-5`) | Modelo de Claude a usar |
| `NODE_ENV` | No (`development`) | `production` activa las validaciones estrictas de seguridad |

### `.env` (raíz, frontend)

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_API_URL` | No (`http://localhost:4000`) | URL base de la API. En Docker/producción se fija en tiempo de build |

## Despliegue con Docker

```bash
# Desde la raíz del repo, crea un .env con al menos JWT_SECRET
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" > .env

docker compose up --build
```

Esto levanta tres servicios:

| Servicio | Puerto | Descripción |
|---|---|---|
| `db` | 5432 | PostgreSQL 16, con volumen persistente y healthcheck |
| `server` | 4000 | API, aplica migraciones automáticamente al arrancar (`prisma migrate deploy`) |
| `web` | 5173 → 80 | Frontend construido y servido con Nginx (soporta las rutas de React Router) |

Variables opcionales que puedes definir en el `.env` de la raíz antes de levantar Docker: `POSTGRES_PASSWORD`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `VITE_API_URL`.

> **Nota de este entorno de desarrollo:** los `Dockerfile` y el `docker-compose.yml` se validaron con `dockerfilelint` y revisando manualmente la configuración (el daemon de Docker sí funciona aquí, pero el sandbox donde se generó este proyecto bloquea la descarga de imágenes desde Docker Hub, así que el build completo no se pudo ejecutar de extremo a extremo en este entorno concreto). Pruébalo con `docker compose up --build` y abre un issue si algo no cuadra.

## Referencia de la API

Todas las rutas devuelven JSON. Las marcadas como "🔒" requieren el header `Authorization: Bearer <token>`.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | `{ nombre, email, password }` → `{ token, usuario }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, usuario }` |
| GET 🔒 | `/api/auth/me` | Usuario autenticado |

### Ofertas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ofertas` | Lista de ofertas (admite filtros por query string) |
| GET | `/api/ofertas/:id` | Detalle de una oferta |
| POST | `/api/ofertas` | Crear una oferta manualmente |
| POST 🔒 | `/api/ofertas/importar` | Importa ofertas reales de tecnología desde una API pública de empleo, evitando duplicados |

### Candidaturas, dashboard, perfil, CV y configuración

Todas requieren 🔒 y operan siempre sobre el usuario autenticado (no se pasa `usuarioId` a mano).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/candidaturas` | Candidaturas del usuario, con la oferta incluida |
| POST | `/api/candidaturas` | Guardar una oferta (crea una candidatura) |
| PATCH | `/api/candidaturas/:id/estado` | Mover de columna en el Kanban |
| PATCH | `/api/candidaturas/:id` | Actualizar notas |
| DELETE | `/api/candidaturas/:id` | Eliminar |
| GET | `/api/dashboard/stats` | Métricas del dashboard |
| GET | `/api/dashboard/actividad` | Actividad reciente |
| GET / PATCH | `/api/perfil` | Perfil del usuario (con formación y preferencias) |
| PATCH | `/api/perfil/preferencias` | Preferencias de empleo |
| GET | `/api/cv` | CVs del usuario |
| POST | `/api/cv` | Subir un CV real (`multipart/form-data`, campo `cv`; PDF/DOC/DOCX, máx. 5 MB) |
| GET | `/api/cv/:id/download` | Descargar un CV propio |
| DELETE | `/api/cv/:id` | Eliminar (promociona el más reciente si era el actual) |
| GET / PATCH | `/api/configuracion` | Preferencias de la app |
| POST | `/api/ai/analizar-cv` | Análisis del CV actual (debe ser PDF) con Claude |
| POST | `/api/ai/matching` | Recalcula el match de todas las ofertas con Claude según tu perfil |

### Modelo de datos

Definido en `server/prisma/schema.prisma`: `Usuario`, `Oferta`, `Candidatura`, `Cv`, `Actividad`, `Configuracion`, `Formacion`, `PreferenciasEmpleo`. El diseño relacional (claves foráneas, restricciones `UNIQUE`, borrado en cascada) se validó directamente contra PostgreSQL durante el desarrollo.

## Seguridad y producción

- Contraseñas hasheadas con bcrypt; sesiones con JWT.
- Cada candidatura/CV verifica pertenencia al usuario autenticado antes de leer, modificar o borrar.
- `helmet`, `compression` y rate limiting (20 intentos/15 min) en `/api/auth`.
- Validación de variables de entorno al arrancar: en producción, rechaza un `JWT_SECRET` corto o de ejemplo en vez de arrancar de forma insegura.
- `/api/health` comprueba también la conexión a la base de datos.
- Apagado ordenado (`SIGTERM`/`SIGINT`): cierra la conexión a la base de datos antes de salir.
- Los mensajes de error 500 no filtran detalles internos al cliente en producción.
- **Advisory conocido:** `npm audit` reporta una vulnerabilidad de severidad alta (agotamiento de pila) en `deepmerge-ts`, dependencia transitiva de la CLI de `prisma` (usada solo en build/migraciones, no en el servidor en producción). La única corrección automática de `npm` implica bajar a una versión antigua de Prisma incompatible con el adaptador de conexión (`@prisma/adapter-pg`) que usa este proyecto; se documenta aquí en vez de aplicar un downgrade que rompería la app. Revisa [el advisory](https://github.com/advisories/GHSA-ggr8-5vv4-36mx) antes de desplegar si te preocupa.

## Historial de fases

| Fase | Contenido |
|---|---|
| 1 | Frontend y estructura base (datos mock) |
| 2 | Backend y base de datos (Express + PostgreSQL + Prisma) |
| 3 | Autenticación (JWT + bcrypt) |
| 4 | Frontend conectado a la API real |
| 5 | Subida real de CV con almacenamiento de archivos |
| 6 | Integración con IA: análisis de CV y matching de ofertas |
| 7 | Importación de ofertas reales desde una API pública de empleo |
| 8 | Preparación para producción: seguridad, Docker, documentación |

Pendiente para futuras fases: edición de perfil desde la UI, notificaciones por email.

## Licencia

MIT — ver [LICENSE](./LICENSE).
