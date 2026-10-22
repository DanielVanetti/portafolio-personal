import type { Locale } from '~/utils/locale'

export interface Project {
  index: string
  title: string
  context: string
  stack: readonly string[]
  /** Qué estaba roto o faltaba. */
  problem: string
  /** Qué hice concretamente. */
  work: string
  /** Qué quedó funcionando. */
  result: string
}

const es: readonly Project[] = [
  {
    index: '01',
    title: 'Migración de escritorio a web',
    context: 'ExporPack S.A. · 2024—2025',
    stack: ['SQL Server', 'Aplicación web', 'Documentación técnica'],
    problem:
      'Un sistema de escritorio sostenía la operación diaria de la empresa, pero cada instalación nueva era un trámite y cada corrección obligaba a tocar máquina por máquina.',
    work:
      'Participé en la migración del sistema a la web: mapeé los procesos que el escritorio daba por sentados, documenté las reglas de negocio que solo existían en la cabeza de quienes lo usaban y validé que los datos migrados coincidieran con los del sistema anterior antes de cortar.',
    result:
      'La operación pasó a un sistema accesible desde el navegador, con la documentación de procesos que antes no existía en ninguna parte.'
  },
  {
    index: '02',
    title: 'Aplicación móvil con mapas',
    context: 'Universidad Nacional · 2024—2025',
    stack: ['Google Maps API', 'Desarrollo móvil'],
    problem:
      'El proyecto pedía ubicar puntos en un mapa y trabajar con ellos desde el teléfono, no solo mostrarlos.',
    work:
      'Integré la API de Google Maps y resolví la parte que rara vez aparece en los tutoriales: permisos de ubicación, qué hacer cuando el usuario los niega y cómo mantener la interfaz usable mientras el mapa carga.',
    result:
      'Una app funcional en dispositivo real, con los permisos y los estados de carga resueltos en lugar de asumidos.'
  },
  {
    index: '03',
    title: 'Plataforma web para barbería',
    context: 'Universidad Nacional',
    stack: ['Full stack', 'Firebase', 'SQL'],
    problem:
      'Una barbería que gestionaba citas y ventas por WhatsApp y papel: sin registro consultable ni forma de saber qué se vendió.',
    work:
      'Construí la aplicación de punta a punta: catálogo de servicios, flujo de compra y venta y la capa de datos por detrás. Me tocó decidir qué guardar y qué no, que resultó ser la parte difícil.',
    result:
      'Una plataforma donde el negocio queda registrado y consultable, en lugar de disperso en conversaciones.'
  },
  {
    index: '04',
    title: 'Soporte de aplicaciones en producción',
    context: '4GEEKS · 2025',
    stack: ['Frontend', 'Backend', 'SCRUM'],
    problem:
      'Aplicaciones empresariales en producción, con usuarios reales que reportaban errores en el peor momento posible: mientras trabajaban.',
    work:
      'Mantenimiento correctivo y preventivo en ambientes productivos: análisis de errores en frontend y backend, reproducción del fallo a partir de reportes casi siempre incompletos y corrección sin tumbar lo que ya funcionaba, todo dentro de ciclos SCRUM.',
    result:
      'Aprendí a leer un sistema que no escribí y a medir el riesgo de cada cambio. Es el trabajo que más me enseñó.'
  },
  {
    index: '05',
    title: 'Sitios WordPress a medida',
    context: '2026',
    stack: ['WordPress', 'PHP', 'Temas y plugins'],
    problem:
      'Clientes con necesidades que ningún tema comercial cubría sin pelearse con él.',
    work:
      'Desarrollo de temas y plugins propios, y personalización de los existentes hasta donde tenía sentido. La decisión recurrente: cuándo extender el tema y cuándo aceptar que hay que escribirlo.',
    result:
      'Sitios que hacen exactamente lo que el cliente pidió, sin arrastrar tres plugins de más para lograrlo.'
  }
]

const en: readonly Project[] = [
  {
    index: '01',
    title: 'Desktop-to-web migration',
    context: 'ExporPack S.A. · 2024—2025',
    stack: ['SQL Server', 'Web app', 'Technical documentation'],
    problem:
      'A desktop system ran the company’s daily operations, but every new install was a chore and every fix meant touching each machine one by one.',
    work:
      'I took part in moving the system to the web: I mapped the processes the desktop app took for granted, documented business rules that only lived in its users’ heads, and checked that the migrated data matched the old system before the switch.',
    result:
      'Operations moved to a system anyone can reach from a browser, with process documentation that had never existed before.'
  },
  {
    index: '02',
    title: 'Mobile app with maps',
    context: 'Universidad Nacional · 2024—2025',
    stack: ['Google Maps API', 'Mobile development'],
    problem:
      'The project needed to place points on a map and work with them from a phone, not just display them.',
    work:
      'I integrated the Google Maps API and solved the part tutorials rarely cover: location permissions, what to do when the user denies them, and how to keep the interface usable while the map loads.',
    result:
      'A working app on a real device, with permissions and loading states handled instead of assumed.'
  },
  {
    index: '03',
    title: 'Web platform for a barbershop',
    context: 'Universidad Nacional',
    stack: ['Full stack', 'Firebase', 'SQL'],
    problem:
      'A barbershop running bookings and sales over WhatsApp and paper: no searchable record and no way to know what had been sold.',
    work:
      'I built the app end to end: service catalog, purchase and sales flow, and the data layer behind it. I had to decide what to store and what not to, which turned out to be the hard part.',
    result:
      'A platform where the business is recorded and searchable, instead of scattered across conversations.'
  },
  {
    index: '04',
    title: 'Supporting apps in production',
    context: '4GEEKS · 2025',
    stack: ['Frontend', 'Backend', 'SCRUM'],
    problem:
      'Business applications already in production, with real users reporting bugs at the worst possible time: while they were working.',
    work:
      'Corrective and preventive maintenance on live environments: analysing frontend and backend errors, reproducing bugs from reports that were almost always incomplete, and fixing them without breaking what already worked, all within SCRUM cycles.',
    result:
      'I learned to read a system I didn’t write and to weigh the risk of every change. It’s the job that taught me the most.'
  },
  {
    index: '05',
    title: 'Custom WordPress sites',
    context: '2026',
    stack: ['WordPress', 'PHP', 'Themes & plugins'],
    problem:
      'Clients whose needs no commercial theme could cover without fighting it.',
    work:
      'Building custom themes and plugins, and adapting existing ones as far as it made sense. The recurring call: when to extend a theme and when to accept it has to be written from scratch.',
    result:
      'Sites that do exactly what the client asked for, without dragging along three extra plugins to get there.'
  }
]

export const PROJECTS: Record<Locale, readonly Project[]> = { es, en }
