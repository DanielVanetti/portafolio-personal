export interface Block {
  type: 'p' | 'h2' | 'quote'
  text: string
}

export interface Post {
  slug: string
  index: string
  title: string
  /** ISO — se formatea en la vista. */
  date: string
  tag: string
  /** Se usa como meta descripción y como entradilla del listado. */
  excerpt: string
  readingTime: string
  body: readonly Block[]
}

export const POSTS: readonly Post[] = [
  {
    slug: 'migrar-una-app-de-escritorio-a-la-web',
    index: '01',
    title: 'Lo que aprendí migrando una app de escritorio a la web',
    date: '2025-11-18',
    tag: 'Migración',
    excerpt:
      'Migrar un sistema que ya funciona no es reescribirlo: es descubrir todo lo que hacía y nadie había escrito nunca.',
    readingTime: '4 min',
    body: [
      {
        type: 'p',
        text: 'Cuando entré al proyecto pensaba que migrar era traducir. Tomar lo que hacía la aplicación de escritorio, escribirlo otra vez con tecnología web, y listo. La primera semana me dejó claro que ese no era el trabajo.'
      },
      { type: 'h2', text: 'El sistema sabía cosas que nadie había escrito' },
      {
        type: 'p',
        text: 'La aplicación llevaba años en uso. En ese tiempo había acumulado reglas que no estaban documentadas en ningún lado: validaciones que alguien agregó por un caso puntual, campos que en teoría eran opcionales pero que en la práctica nunca iban vacíos, comportamientos que los usuarios daban por sentados sin poder explicarlos.'
      },
      {
        type: 'p',
        text: 'Esa información no estaba en el código de forma legible ni en un manual. Estaba repartida entre la gente que usaba el sistema todos los días. Buena parte de mi trabajo consistió en preguntar, anotar y confirmar.'
      },
      {
        type: 'quote',
        text: 'La documentación que produjimos durante la migración terminó siendo tan valiosa como el sistema nuevo.'
      },
      { type: 'h2', text: 'Los datos son la parte que no perdona' },
      {
        type: 'p',
        text: 'Una interfaz mal hecha se corrige el lunes. Un dato mal migrado se descubre tres meses después, cuando alguien nota que un reporte no cuadra y ya no hay forma de saber cuál era el valor original.'
      },
      {
        type: 'p',
        text: 'Por eso la validación de datos no fue un paso al final, sino algo que hicimos en paralelo: comparar el sistema viejo contra el nuevo, registro por registro, antes de que nadie dependiera del resultado. Es lento y no se ve en ninguna demo, pero es lo que hace que la migración sea reversible mientras todavía se puede.'
      },
      { type: 'h2', text: 'Lo que me llevo' },
      {
        type: 'p',
        text: 'Que un sistema en producción es un acuerdo entre mucha gente, no solo un programa. Y que antes de reemplazarlo hay que entender qué parte de ese acuerdo estaba sosteniendo, porque el código no te lo va a decir.'
      }
    ]
  },
  {
    slug: 'soporte-en-produccion-escuela-para-un-dev-junior',
    index: '02',
    title: 'Soporte en producción: la mejor escuela para un dev junior',
    date: '2026-02-09',
    tag: 'Carrera',
    excerpt:
      'Nadie sueña con entrar a soporte. Pero es donde se aprende a leer código ajeno, a medir riesgo y a hablar con usuarios reales.',
    readingTime: '4 min',
    body: [
      {
        type: 'p',
        text: 'Cuando empecé a hacer mantenimiento sobre aplicaciones que ya estaban en producción, lo viví como una escala antes de "programar de verdad". Hoy pienso que fue al revés: ahí aprendí lo que un proyecto desde cero no te enseña.'
      },
      { type: 'h2', text: 'Leer código que no escribiste' },
      {
        type: 'p',
        text: 'En soporte no elegís el código. Te llega, con años encima, decisiones que no entendés y comentarios que mienten. La única salida es aprender a leerlo de verdad: seguir el flujo, verificar suposiciones, resistir la tentación de reescribir lo que todavía no entendés.'
      },
      {
        type: 'p',
        text: 'Esa habilidad se transfiere a todo lo demás. Cualquier trabajo real empieza con código de otra persona.'
      },
      { type: 'h2', text: 'El reporte nunca describe el error' },
      {
        type: 'p',
        text: '"No sirve." "Me da error." "Se cerró." Los reportes llegan así, y no es culpa de quien los escribe: el usuario está intentando trabajar, no documentar un bug. El trabajo empieza reconstruyendo qué pasó realmente — qué hizo, con qué datos, en qué momento.'
      },
      {
        type: 'quote',
        text: 'Reproducir el error es el 80% de arreglarlo. El resto suele ser una línea.'
      },
      { type: 'h2', text: 'Cada cambio tiene un costo' },
      {
        type: 'p',
        text: 'En un proyecto propio, romper algo significa volver atrás. En producción, romper algo significa que alguien no puede facturar. Eso cambia por completo cómo evaluás un cambio: dejás de preguntarte si funciona y empezás a preguntarte qué más toca.'
      },
      {
        type: 'p',
        text: 'Es una forma de pensar que no se aprende leyendo. Se aprende cuando el sistema es real y los usuarios también.'
      },
      { type: 'h2', text: 'Si estás empezando' },
      {
        type: 'p',
        text: 'No descartes una posición de soporte por no ser "desarrollo puro". Vas a tocar más código, más rápido y con más consecuencias que en cualquier proyecto de práctica. Es incómodo, y por eso funciona.'
      }
    ]
  },
  {
    slug: 'wordpress-a-medida-cuando-un-tema-no-basta',
    index: '03',
    title: 'WordPress a medida: cuándo un tema no basta',
    date: '2026-05-14',
    tag: 'WordPress',
    excerpt:
      'La decisión no es "tema o código propio". Es saber en qué punto seguir forzando el tema sale más caro que escribirlo.',
    readingTime: '3 min',
    body: [
      {
        type: 'p',
        text: 'Casi todo proyecto de WordPress empieza igual: se elige un tema que se parece a lo que el cliente quiere y se ajusta. Funciona bien hasta que deja de funcionar, y el punto de quiebre casi siempre llega por el mismo camino.'
      },
      { type: 'h2', text: 'La señal de alarma es el plugin número cinco' },
      {
        type: 'p',
        text: 'Cuando para lograr un requerimiento hay que instalar un plugin, y ese plugin necesita otro para integrarse con el tema, y aparece un tercero para arreglar lo que rompieron los dos anteriores, la decisión ya se tomó sola. Solo falta admitirlo.'
      },
      {
        type: 'quote',
        text: 'Cada plugin es una dependencia que alguien más va a actualizar sin avisarte.'
      },
      { type: 'h2', text: 'Qué sí justifica escribir código' },
      {
        type: 'p',
        text: 'Un tipo de contenido propio con sus campos y sus relaciones. Una plantilla cuya estructura no existe en el tema. Una integración con un sistema del cliente. En estos casos el código propio es más corto, más fácil de leer y más barato de mantener que la configuración equivalente.'
      },
      { type: 'h2', text: 'Qué no' },
      {
        type: 'p',
        text: 'Cambios de color, tipografía o espaciado. Un formulario de contacto. Un carrusel. Reescribir eso es orgullo, no criterio: el tema ya lo resuelve y lo va a seguir resolviendo después de que el proyecto termine.'
      },
      {
        type: 'p',
        text: 'La pregunta útil no es cuál opción es más elegante, sino quién va a mantener esto dentro de un año y con qué herramientas cuenta.'
      }
    ]
  }
] as const

export const getPost = (slug: string) => POSTS.find(post => post.slug === slug)

/** 18 de noviembre, 2025 */
export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })

/** 2025.11 — para los metadatos compactos del listado */
export const formatDateCompact = (iso: string) => iso.slice(0, 7).replace('-', '.')
