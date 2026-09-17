-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "EstadoCandidatura" AS ENUM ('GUARDADA', 'APLICADA', 'ENTREVISTA', 'OFERTA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('CANDIDATURA', 'ENTREVISTA', 'OFERTA', 'SISTEMA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "ubicacion" TEXT,
    "puestoDeseado" TEXT,
    "experiencia" TEXT,
    "tecnologias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "centro" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Formacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferenciasEmpleo" (
    "id" TEXT NOT NULL,
    "modalidad" TEXT NOT NULL,
    "salarioMinimo" INTEGER NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "tiposContrato" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "PreferenciasEmpleo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "logoIniciales" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "salarioMin" INTEGER NOT NULL,
    "salarioMax" INTEGER NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "match" INTEGER NOT NULL DEFAULT 0,
    "tecnologias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experiencia" TEXT NOT NULL,
    "descripcionCorta" TEXT NOT NULL,
    "fuente" TEXT NOT NULL DEFAULT 'manual',
    "urlOriginal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" TEXT NOT NULL,
    "estado" "EstadoCandidatura" NOT NULL DEFAULT 'GUARDADA',
    "notas" TEXT,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cv" (
    "id" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "urlArchivo" TEXT NOT NULL,
    "tamanoBytes" INTEGER NOT NULL,
    "esActual" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL,
    "tipo" "TipoActividad" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "zonaHoraria" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    "notifNuevasOfertas" BOOLEAN NOT NULL DEFAULT true,
    "notifRecordatorioEntrevista" BOOLEAN NOT NULL DEFAULT true,
    "notifResumenSemanal" BOOLEAN NOT NULL DEFAULT false,
    "busquedaAutomatica" BOOLEAN NOT NULL DEFAULT true,
    "soloConSalario" BOOLEAN NOT NULL DEFAULT false,
    "tema" TEXT NOT NULL DEFAULT 'claro',
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PreferenciasEmpleo_usuarioId_key" ON "PreferenciasEmpleo"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_ofertaId_usuarioId_key" ON "Candidatura"("ofertaId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_usuarioId_key" ON "Configuracion"("usuarioId");

-- AddForeignKey
ALTER TABLE "Formacion" ADD CONSTRAINT "Formacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciasEmpleo" ADD CONSTRAINT "PreferenciasEmpleo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracion" ADD CONSTRAINT "Configuracion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
