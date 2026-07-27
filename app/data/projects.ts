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
  featured?: boolean
}

export const PROJECTS: readonly Project[] = [
  {
    index: '01',
    title: 'Migración de escritorio a web',
    context: 'ExporPack S.A. · 2024—2025',
    stack: ['SQL Server', 'Aplicación web', 'Documentación técnica'],
    problem:
      'Un sistema de escritorio sostenía la operación diaria de la empresa, pero cada instalación nueva era un trámite y cada corrección obligaba a tocar máquina por máquina.',
    work:
      'Participé en la migración del sistema a la web: mapeé los procesos que el escritorio daba por sentados, documenté las reglas de negocio que solo existían en la cabeza de quienes lo usaban, y validé que los datos migrados coincidieran con los del sistema anterior antes de cortar.',
    result:
      'La operación pasó a un sistema accesible desde el navegador, con la documentación de procesos que antes no existía en ninguna parte.',
    featured: true
  },
  {
    index: '02',
    title: 'Aplicación móvil con mapas',
    context: 'Universidad Nacional · 2024—2025',
    stack: ['Google Maps API', 'Desarrollo móvil'],
    problem:
      'El proyecto pedía ubicar puntos en un mapa y trabajar con ellos desde el teléfono, no solo mostrarlos.',
    work:
      'Integré la API de Google Maps en la aplicación y resolví la parte que rara vez aparece en los tutoriales: permisos de ubicación, qué hacer cuando el usuario los niega, y cómo mantener la interfaz utilizable mientras el mapa carga.',
    result:
      'Una app funcional en dispositivo real, con el manejo de permisos y estados de carga resuelto en lugar de asumido.',
    featured: true
  },
  {
    index: '03',
    title: 'Plataforma web para barbería',
    context: 'Universidad Nacional',
    stack: ['Full stack', 'Firebase', 'SQL'],
    problem:
      'Una barbería que gestionaba citas y ventas por WhatsApp y papel: sin registro consultable ni forma de saber qué se vendió.',
    work:
      'Construí la aplicación de punta a punta — catálogo de servicios, flujo de compra y venta, y la capa de datos por detrás. Me tocó decidir qué guardar y qué no, que resultó ser la parte difícil.',
    result:
      'Una plataforma donde el negocio queda registrado y consultable, en lugar de disperso en conversaciones.'
  },
  {
    index: '04',
    title: 'Soporte de aplicaciones en producción',
    context: '4GEEKS · 2025',
    stack: ['Frontend', 'Backend', 'SCRUM'],
    problem:
      'Aplicaciones empresariales ya en producción, con usuarios reales que reportaban errores en el peor momento posible: cuando estaban trabajando.',
    work:
      'Mantenimiento correctivo y preventivo sobre ambientes productivos. Análisis de errores en frontend y backend, reproducción del fallo a partir de un reporte casi siempre incompleto, y corrección sin tumbar lo que ya funcionaba. Todo dentro de ciclos SCRUM.',
    result:
      'Aprendí a leer un sistema que no escribí y a medir el riesgo de cada cambio. Es el trabajo que más me enseñó.',
    featured: true
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
] as const

export const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured)
