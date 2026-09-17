import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Sembrando datos de prueba…')

  const usuario = await prisma.usuario.upsert({
    where: { email: 'laura.mendez@ejemplo.com' },
    update: {},
    create: {
      nombre: 'Laura Méndez',
      email: 'laura.mendez@ejemplo.com',
      passwordHash: await bcrypt.hash('Password123!', 10),
      ubicacion: 'Madrid, España',
      puestoDeseado: 'Frontend Developer / Fullstack',
      experiencia: '3 años',
      tecnologias: [
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Node.js',
        'Next.js',
        'Git',
        'Figma',
      ],
      formacion: {
        create: [
          {
            titulo: 'Grado en Ingeniería Informática',
            centro: 'Universidad Complutense de Madrid',
            periodo: '2018 — 2022',
          },
          {
            titulo: 'Bootcamp de Desarrollo Web Full Stack',
            centro: 'Ironhack',
            periodo: '2022',
          },
        ],
      },
      preferencias: {
        create: {
          modalidad: 'Remoto o híbrido',
          salarioMinimo: 32000,
          disponibilidad: 'Incorporación inmediata',
          tiposContrato: ['Indefinido', 'Freelance'],
        },
      },
      configuracion: { create: {} },
    },
  })

  const ofertasData = [
    {
      puesto: 'Frontend Developer React',
      empresa: 'Nordic Labs',
      logoIniciales: 'NL',
      ubicacion: 'Madrid, España',
      modalidad: 'HIBRIDO' as const,
      salarioMin: 32000,
      salarioMax: 40000,
      match: 92,
      tecnologias: ['React', 'TypeScript', 'Tailwind'],
      experiencia: '2-4 años',
      descripcionCorta:
        'Buscamos una persona para reforzar el equipo de producto, trabajando en la reconstrucción de nuestro panel de cliente.',
    },
    {
      puesto: 'Fullstack Engineer',
      empresa: 'Cintra Health',
      logoIniciales: 'CH',
      ubicacion: 'Barcelona, España',
      modalidad: 'REMOTO' as const,
      salarioMin: 38000,
      salarioMax: 48000,
      match: 87,
      tecnologias: ['Node.js', 'React', 'PostgreSQL'],
      experiencia: '3-5 años',
      descripcionCorta:
        'Equipo pequeño construyendo herramientas clínicas. Buscamos alguien cómodo moviéndose entre frontend y backend.',
    },
    {
      puesto: 'Senior Frontend Engineer',
      empresa: 'Bluepeak',
      logoIniciales: 'BP',
      ubicacion: 'Remoto (España)',
      modalidad: 'REMOTO' as const,
      salarioMin: 45000,
      salarioMax: 58000,
      match: 95,
      tecnologias: ['React', 'TypeScript', 'GraphQL'],
      experiencia: '5+ años',
      descripcionCorta:
        'Liderarás la evolución del design system y mentorizarás a dos desarrolladores junior del equipo.',
    },
    {
      puesto: 'Software Engineer, Web Platform',
      empresa: 'Orbital Data',
      logoIniciales: 'OD',
      ubicacion: 'Bilbao, España',
      modalidad: 'REMOTO' as const,
      salarioMin: 40000,
      salarioMax: 52000,
      match: 89,
      tecnologias: ['TypeScript', 'Next.js', 'AWS'],
      experiencia: '3-6 años',
      descripcionCorta:
        'Plataforma de analítica en tiempo real para clientes industriales. Equipo distribuido por toda Europa.',
    },
  ]

  const ofertas = []
  for (const data of ofertasData) {
    const oferta = await prisma.oferta.create({ data })
    ofertas.push(oferta)
  }

  await prisma.candidatura.createMany({
    data: [
      {
        ofertaId: ofertas[0].id,
        usuarioId: usuario.id,
        estado: 'ENTREVISTA',
        notas: 'Entrevista técnica programada para el jueves a las 11:00.',
      },
      {
        ofertaId: ofertas[1].id,
        usuarioId: usuario.id,
        estado: 'APLICADA',
        notas: 'Enviado CV + carta de presentación personalizada.',
      },
      {
        ofertaId: ofertas[2].id,
        usuarioId: usuario.id,
        estado: 'ENTREVISTA',
        notas: 'Segunda entrevista superada. Pendiente de prueba técnica.',
      },
      {
        ofertaId: ofertas[3].id,
        usuarioId: usuario.id,
        estado: 'APLICADA',
      },
    ],
  })

  await prisma.actividad.createMany({
    data: [
      {
        usuarioId: usuario.id,
        tipo: 'ENTREVISTA',
        titulo: 'Entrevista confirmada con Bluepeak',
        descripcion: 'Prueba técnica programada para el viernes a las 10:00.',
      },
      {
        usuarioId: usuario.id,
        tipo: 'CANDIDATURA',
        titulo: 'Candidatura enviada a Orbital Data',
        descripcion: 'Software Engineer, Web Platform · Bilbao (Remoto)',
      },
      {
        usuarioId: usuario.id,
        tipo: 'SISTEMA',
        titulo: 'CV actualizado',
        descripcion: 'Se subió una nueva versión: CV_Laura_Mendez_2026.pdf',
      },
    ],
  })

  await prisma.cv.create({
    data: {
      usuarioId: usuario.id,
      nombreArchivo: 'CV_Laura_Mendez_2026.pdf',
      urlArchivo: '/uploads/cv-laura-2026.pdf',
      tamanoBytes: 319488,
      esActual: true,
    },
  })

  console.log(`Listo. Usuario de prueba: ${usuario.email} / contraseña: Password123! (id: ${usuario.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
