import type { Locale } from '~/utils/locale'

export interface Project {
  index: string
  title: string
  /** Qué tipo de proyecto es, en dos o tres palabras. */
  kind: string
  context: string
  stack: readonly string[]
  /** Qué estaba roto o faltaba. */
  problem: string
  /** Qué hicimos concretamente. */
  work: string
  /** Qué quedó funcionando. */
  result: string
  /** Captura en /public/projects (solo si el proyecto se puede mostrar). */
  image?: string
  /** Sitio publicado. */
  url?: string
}

/*
 * Capturas: solo de lo que es público. Dale1Mano es un sistema interno con
 * datos de la ONG y Boskoa no tiene sitio publicado: van con la plate
 * tipográfica. ExporPack se muestra por su pantalla de acceso.
 */

const es: readonly Project[] = [
  {
    index: '01',
    title: 'Luck Dreams CR',
    kind: 'Plataforma de rifas',
    context: 'KnotFix · 2026',
    stack: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Redis', 'Cloudflare R2'],
    problem:
      'Vender rifas de hasta 100 000 números con asignación aleatoria y por paquetes, con pagos por SINPE Móvil que alguien tiene que verificar, sin que dos personas se queden nunca con el mismo número.',
    work:
      'Construimos el sistema completo: compra con apartado y una cuenta regresiva que controla el servidor, carga del comprobante, «Validá tus números» y un panel para revisar pagos y administrar las rifas. Colas con Celery y comprobantes en almacenamiento privado con enlaces que caducan.',
    result:
      'Una plataforma en producción pensada para el celular, donde la gente compra y valida sus números y el equipo revisa los pagos desde un solo panel.',
    image: '/projects/luckdreams.webp',
    url: 'https://luckdreamscr.com/'
  },
  {
    index: '02',
    title: 'Dale1ManoCR',
    kind: 'Sistema administrativo · ONG',
    context: 'KnotFix · 2026',
    stack: ['React', 'Django REST', 'PostgreSQL', 'MUI'],
    problem:
      'Una ONG que llevaba contabilidad, presupuesto, donantes, colaboradores y proyectos en hojas de cálculo separadas.',
    work:
      'Construimos un sistema a medida con módulos de contabilidad (catálogo de cuentas, movimientos y presupuesto), donantes y donaciones, colaboradores, proyectos y alertas, con permisos por rol y reportes en PDF y Excel.',
    result:
      'Toda la operación de la ONG en un solo lugar, con el presupuesto contra lo ejecutado siempre a la vista.'
  },
  {
    index: '03',
    title: 'ExporPack',
    kind: 'Sistema de producción agrícola',
    context: 'ExporPack S.A. · 2024—2025',
    stack: ['React', '.NET 8', 'SQL Server', 'Tailwind'],
    problem:
      'Una operación de melón y caña que necesitaba planificar y registrar cada temporada: lotes y camas, híbridos y variedades, siembra y trasplante, labores culturales, riego y aplicaciones.',
    work:
      'Desarrollamos en equipo una aplicación web con API en .NET 8 y SQL Server: configuración de temporadas, lotes, variedades e híbridos; programa de labores; pedidos de productos para riego con aprobación y boleta en PDF; fitoprotección, bodega y meteorología.',
    result:
      'Un sistema que acompaña el cultivo durante toda la temporada, lote por lote.',
    image: '/projects/exporpack.webp'
  },
  {
    index: '04',
    title: 'Magic Place',
    kind: 'Sitio web · alojamiento',
    context: 'KnotFix · 2026',
    stack: ['Astro', 'JavaScript', 'Bilingüe'],
    problem:
      'Siete estudios en Santa Teresa con un sitio cuya versión en español no tenía dirección propia: el idioma se cambiaba con JavaScript y Google no la indexaba.',
    work:
      'Rehicimos el sitio en Astro como HTML estático, con inglés y español como páginas reales, galerías de cada estudio y contacto directo para reservar.',
    result:
      'Un sitio rápido, bilingüe y visible en los buscadores en los dos idiomas.',
    image: '/projects/magicplace.webp',
    url: 'https://www.magicplacesantateresa.com/'
  },
  {
    index: '05',
    title: 'Studio 27 by Vicente',
    kind: 'Sitio web · barbería',
    context: 'KnotFix · 2026',
    stack: ['HTML', 'CSS', 'JavaScript', 'three.js'],
    problem:
      'Una barbería de Liberia que agenda por WhatsApp y quería atraer al cliente que valora un corte bien hecho.',
    work:
      'Una página única sin frameworks: servicios con precio que abren WhatsApp con el mensaje ya escrito, galería del trabajo y una tijera dorada en 3D hecha con three.js.',
    result:
      'Reservar es un toque, y el sitio se siente como el local: blanco, negro y oro.',
    image: '/projects/studio27.webp',
    url: 'https://studio27byvicente.com/'
  },
  {
    index: '06',
    title: 'Boskoa',
    kind: 'Plataforma de turismo',
    context: 'KnotFix · 2025',
    stack: ['WordPress', 'PHP', 'MySQL', 'ACF'],
    problem:
      'Una agencia de viajes que necesitaba mostrar y vender paquetes, actividades y traslados, y poder editarlos sin depender de un desarrollador.',
    work:
      'Desarrollamos un tema de WordPress a medida con tipos de contenido propios (paquetes, actividades, transporte, reseñas), campos personalizados con ACF, sitio bilingüe con Polylang y correos de reserva.',
    result:
      'La agencia actualiza su catálogo de experiencias desde el administrador, en dos idiomas.'
  },
  {
    index: '07',
    title: 'Soporte de aplicaciones en producción',
    kind: 'Mantenimiento',
    context: '4GEEKS · 2025',
    stack: ['Frontend', 'Backend', 'SCRUM'],
    problem:
      'Aplicaciones empresariales en producción, con usuarios reales que reportaban errores en el peor momento posible: mientras trabajaban.',
    work:
      'Mantenimiento correctivo y preventivo en ambientes productivos: análisis de errores en frontend y backend, reproducción del fallo a partir de reportes casi siempre incompletos y corrección sin tumbar lo que ya funcionaba, todo dentro de ciclos SCRUM.',
    result:
      'Aprendí a leer un sistema que no escribí y a medir el riesgo de cada cambio. Es el trabajo que más me enseñó.'
  }
]

const en: readonly Project[] = [
  {
    index: '01',
    title: 'Luck Dreams CR',
    kind: 'Raffle platform',
    context: 'KnotFix · 2026',
    stack: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Redis', 'Cloudflare R2'],
    problem:
      'Selling raffles of up to 100,000 numbers, randomly assigned and in bundles, with SINPE Móvil payments that someone has to verify, without two people ever ending up with the same number.',
    work:
      'We built the whole system: checkout with a hold and a server-controlled countdown, payment receipt upload, “Check your numbers” and a panel to review payments and manage raffles. Celery queues and receipts in private storage behind expiring links.',
    result:
      'A mobile-first platform in production, where people buy and check their numbers and the team reviews payments from a single panel.',
    image: '/projects/luckdreams.webp',
    url: 'https://luckdreamscr.com/'
  },
  {
    index: '02',
    title: 'Dale1ManoCR',
    kind: 'Admin system · NGO',
    context: 'KnotFix · 2026',
    stack: ['React', 'Django REST', 'PostgreSQL', 'MUI'],
    problem:
      'An NGO keeping its accounting, budget, donors, collaborators and projects in separate spreadsheets.',
    work:
      'We built a custom system with modules for accounting (chart of accounts, transactions and budget), donors and donations, collaborators, projects and alerts, with role-based permissions and PDF and Excel reports.',
    result:
      'The whole operation of the NGO in one place, with budget versus actual spending always in view.'
  },
  {
    index: '03',
    title: 'ExporPack',
    kind: 'Agricultural production system',
    context: 'ExporPack S.A. · 2024—2025',
    stack: ['React', '.NET 8', 'SQL Server', 'Tailwind'],
    problem:
      'A melon and sugarcane operation that needed to plan and record every season: plots and beds, hybrids and varieties, sowing and transplanting, field work, irrigation and crop protection.',
    work:
      'As a team we built a web app with a .NET 8 API and SQL Server: setup for seasons, plots, varieties and hybrids; a field-work schedule; irrigation product orders with approval and a PDF slip; crop protection, warehouse and weather.',
    result:
      'A system that follows the crop through the whole season, plot by plot.',
    image: '/projects/exporpack.webp'
  },
  {
    index: '04',
    title: 'Magic Place',
    kind: 'Website · lodging',
    context: 'KnotFix · 2026',
    stack: ['Astro', 'JavaScript', 'Bilingual'],
    problem:
      'Seven studios in Santa Teresa with a site whose Spanish version had no address of its own: the language was swapped with JavaScript, so Google never indexed it.',
    work:
      'We rebuilt the site in Astro as static HTML, with English and Spanish as real pages, a gallery for each studio and direct contact to book.',
    result:
      'A fast, bilingual site that search engines find in both languages.',
    image: '/projects/magicplace.webp',
    url: 'https://www.magicplacesantateresa.com/'
  },
  {
    index: '05',
    title: 'Studio 27 by Vicente',
    kind: 'Website · barbershop',
    context: 'KnotFix · 2026',
    stack: ['HTML', 'CSS', 'JavaScript', 'three.js'],
    problem:
      'A barbershop in Liberia that books through WhatsApp and wanted to attract clients who value a well-made cut.',
    work:
      'A single page with no frameworks: priced services that open WhatsApp with the message already written, a gallery of the work and a golden 3D pair of scissors built with three.js.',
    result:
      'Booking takes one tap, and the site feels like the shop: black, white and gold.',
    image: '/projects/studio27.webp',
    url: 'https://studio27byvicente.com/'
  },
  {
    index: '06',
    title: 'Boskoa',
    kind: 'Tourism platform',
    context: 'KnotFix · 2025',
    stack: ['WordPress', 'PHP', 'MySQL', 'ACF'],
    problem:
      'A travel agency that needed to show and sell packages, activities and transfers, and edit them without relying on a developer.',
    work:
      'We built a custom WordPress theme with its own content types (packages, activities, transport, reviews), custom fields with ACF, a bilingual site with Polylang and booking emails.',
    result:
      'The agency updates its catalog of experiences from the admin, in two languages.'
  },
  {
    index: '07',
    title: 'Supporting apps in production',
    kind: 'Maintenance',
    context: '4GEEKS · 2025',
    stack: ['Frontend', 'Backend', 'SCRUM'],
    problem:
      'Business applications already in production, with real users reporting bugs at the worst possible time: while they were working.',
    work:
      'Corrective and preventive maintenance on live environments: analysing frontend and backend errors, reproducing bugs from reports that were almost always incomplete, and fixing them without breaking what already worked, all within SCRUM cycles.',
    result:
      'I learned to read a system I didn’t write and to weigh the risk of every change. It’s the job that taught me the most.'
  }
]

export const PROJECTS: Record<Locale, readonly Project[]> = { es, en }
