import type { Locale } from '~/utils/locale'

/**
 * Textos de la interfaz en español e inglés. El contenido largo (proyectos,
 * principios de motion, prácticas) vive en app/data, también por idioma.
 *
 * `en` se tipa contra `es`: si falta una clave en inglés, no compila.
 */

const es = {
  meta: {
    homeTitle: 'Daniel González Picado — Desarrollador full stack',
    homeDescription:
      'Daniel González Picado, desarrollador full stack en Costa Rica. Sistemas a medida, integraciones de IA, aplicaciones web y móviles, y soporte de aplicaciones en producción.',
    detailsTitle: 'Detalles — Daniel González Picado',
    detailsDescription:
      'Doce principios de movimiento y seis prácticas de usabilidad que me gusta implementar, cada uno con una demo que se puede tocar.',
    lessonTitle: (name: string) => `${name} — Detalles — Daniel González Picado`
  },

  a11y: {
    skip: 'Saltar al contenido',
    mainNav: 'Navegación principal',
    footerNav: 'Navegación del pie',
    menu: 'Menú',
    close: 'Cerrar',
    switchLang: 'Read this page in English',
    home: 'Inicio'
  },

  nav: {
    about: 'Sobre mí',
    work: 'Proyectos',
    details: 'Detalles',
    contact: 'Contacto'
  },

  hero: {
    h1: 'Daniel González Picado — desarrollador full stack',
    // Lo que sigue a la D: Daniel, Desarrollo, Diseño.
    words: ['aniel', 'esarrollo', 'iseño'],
    // Ancho de la palabra más larga ("Desarrollo") tal como se pinta, en em:
    // la D rota más las letras sueltas que animan (4,36), con un 2 % de aire.
    // Fija el tamaño máximo con el que cabe. Si cambian las palabras, medirlo
    // de nuevo en el navegador: el ancho del texto en canvas no sirve.
    wordsEm: 4.45,
    statement:
      'Construyo sistemas a medida e integraciones de IA para los procesos que una empresa usa todos los días.',
    ctaPrimary: 'Ver proyectos',
    ctaSecondary: 'Hablemos',
    role: 'Full stack · IA',
    place: 'Liberia, Costa Rica'
  },

  about: {
    label: 'Sobre mí',
    reveal:
      'Aprendí construyendo: proyectos académicos, sistemas para empresas y sitios para clientes reales. Hoy sumo IA y tecnologías emergentes a cada sistema, para que le devuelva tiempo a quien lo usa.',
    // Lo que hago ahora, en tres verbos.
    now: [
      { verb: 'Estudio', text: 'La Licenciatura en Desarrollo Web en la Universidad Nacional, después de Ingeniería en Sistemas.' },
      { verb: 'Construyo', text: 'Software a medida, plataformas y sitios web con KnotFix, de la idea a producción.' },
      { verb: 'Exploro', text: 'Agentes de IA, automatización e integraciones que le quitan horas a las tareas repetitivas.' }
    ],
    principlesTitle: 'Cómo trabajo',
    principles: [
      {
        title: 'Entender antes de tocar',
        text: 'Un sistema en producción hace cosas que nadie documentó. Averiguar cuáles es parte del trabajo, no un paso previo.'
      },
      {
        title: 'Los datos primero',
        text: 'Una interfaz mal resuelta se corrige el lunes. Un dato mal migrado aparece tres meses después, cuando ya no hay vuelta atrás.'
      },
      {
        title: 'Escribir lo que aprendo',
        text: 'La documentación que sale de un proyecto suele sobrevivirle. Más de una vez fue lo más valioso que quedó.'
      }
    ],
    educationTitle: 'Formación',
    education: [
      { period: 'En curso', title: 'Licenciatura en Desarrollo Web', place: 'Universidad Nacional' },
      { period: '2025', title: 'Ingeniería en Sistemas de Información', place: 'Universidad Nacional' },
      { period: '2024', title: 'Diplomado en Programación de Aplicaciones Informáticas', place: 'Universidad Nacional' }
    ]
  },

  stack: {
    label: 'Stack',
    title: 'Con qué construyo.',
    groups: [
      { name: 'Frontend', text: 'Interfaces rápidas, accesibles y cuidadas.', items: ['JavaScript', 'React', 'Angular', 'WordPress'] },
      { name: 'Backend', text: 'APIs y la lógica de negocio que las sostiene.', items: ['C#', 'Python', 'PHP', 'Django'] },
      { name: 'Datos', text: 'Modelos, migraciones y reportes que cuadran.', items: ['SQL Server', 'Firebase', 'Power BI'] },
      { name: 'Flujo', text: 'Entregas ordenadas, versionadas y en equipo.', items: ['Docker', 'Git', 'SCRUM'] }
    ]
  },

  work: {
    label: 'Proyectos',
    title: 'Siete proyectos, contados por el problema que resolvían.',
    problem: 'El problema',
    did: 'Qué hicimos',
    result: 'Qué quedó',
    visit: 'Ver el sitio',
    shot: (name: string) => `Captura de ${name}`
  },

  teaser: {
    title: 'Lo que cuido en cada interfaz.',
    text: 'Doce principios de movimiento y seis prácticas de usabilidad, con demos que podés tocar.',
    cta: 'Ver los detalles'
  },

  contact: {
    label: 'Contacto',
    title: 'Hablemos.',
    text: '¿Tenés un proceso que hoy vive en hojas de cálculo, chats o un sistema que nadie se atreve a tocar? Contame.',
    copy: 'Copiar correo',
    copied: 'Copiado',
    online: 'En línea',
    whereTitle: 'Dónde estoy',
    where: 'Liberia, Guanacaste, Costa Rica',
    availability: 'Trabajo de forma remota o híbrida y respondo entre semana, normalmente el mismo día.'
  },

  footer: {
    lead: 'Hecho a mano en Liberia, Costa Rica.',
    localTime: 'Hora local',
    navTitle: 'Navegación',
    socialTitle: 'En línea',
    made: 'Diseñado y desarrollado por',
    rights: 'Todos los derechos reservados',
    top: 'Volver arriba'
  },

  details: {
    label: 'Detalles',
    title: 'Cosas que me gusta implementar.',
    intro:
      'El movimiento y los pequeños detalles son lo que hace que un producto se sienta confiable. Acá junto los que más uso, cada uno con una demo para probar.',
    tabs: { motion: 'Movimiento', usability: 'Usabilidad' },
    motionIntro: 'Doce principios de animación. Pasá el cursor o tocá cada tarjeta.',
    usabilityIntro: 'Seis detalles que no se notan cuando están bien hechos, y que todos notan cuando faltan.',
    more: 'Ver más',
    demo: (name: string) => `Probar la demo de ${name}`,
    closing: '¿Querés algo así en tu producto?',
    closingLink: 'Hablemos.',
    lesson: {
      of: (i: string, total: string) => `${i} de ${total}`,
      why: 'Por qué funciona',
      when: 'Cuándo lo uso',
      avoid: 'Cuándo lo evito',
      tip: 'Regla práctica',
      prev: 'Anterior',
      next: 'Siguiente',
      back: 'Todos los detalles',
      nav: 'Más principios de motion',
      notFound: 'Principio no encontrado'
    },
    ui: {
      showHit: 'Mostrar la zona pulsable',
      small: '24 px — el mínimo',
      large: '44 px — cómodo',
      taps: 'Pulsaciones',
      smallTarget: 'Objetivo pequeño',
      largeTarget: 'Objetivo cómodo',
      noFeedback: 'Sin respuesta',
      withFeedback: 'Con respuesta',
      buttonKind: 'Tipo de botón',
      save: 'Guardar cambios',
      saving: 'Guardando…',
      saved: 'Guardado',
      feedbackOn: 'Cada paso se ve: pulsado, guardando, listo.',
      feedbackOff: 'Pulsá y esperá: durante un segundo no pasa nada visible.',
      textColor: 'Color del texto',
      contrastHint: 'Mové el control hacia la izquierda y mirá cuándo deja de leerse.',
      sample: 'Entregamos el viernes. Si algo no se entiende en esta frase, el problema es el contraste y no tu vista.',
      passes: 'Cumple AA',
      fails: 'No cumple AA (mínimo 4,5 : 1)',
      ratio: (r: number) => `${r.toFixed(1).replace('.', ',')} : 1`,
      removeFocus: 'Quitar el contorno de foco (mal ejemplo)',
      previous: 'Anterior',
      next: 'Siguiente',
      send: 'Enviar',
      focusOn: 'Usá la tecla Tab para recorrerlos. El contorno te dice dónde estás.',
      focusOff: 'Usá la tecla Tab para recorrerlos. Ahora no hay forma de saber dónde estás.',
      messageKind: 'Tipo de mensaje',
      generic: 'Mensaje genérico',
      helpful: 'Mensaje útil',
      emailLabel: 'Correo electrónico',
      ok: 'Se ve bien.',
      errGeneric: 'Error 400: entrada inválida.',
      errAt: 'Falta el @. Un correo se ve así: nombre@correo.com',
      errDomain: 'Falta el dominio después del @, por ejemplo: .com',
      docs: ['Factura de marzo', 'Factura de abril', 'Factura de mayo'],
      remove: 'Eliminar',
      removed: (name: string) => `Eliminaste «${name}».`,
      undo: 'Deshacer',
      empty: 'No queda nada.',
      restore: 'Restaurar lista',
      idle: 'Eliminá algo: no te va a preguntar si estás seguro.'
    }
  }
}

export type Messages = typeof es

const en: Messages = {
  meta: {
    homeTitle: 'Daniel González Picado — Full stack developer',
    homeDescription:
      'Daniel González Picado, full stack developer in Costa Rica. Custom systems, AI integrations, web and mobile apps, and support for applications in production.',
    detailsTitle: 'Details — Daniel González Picado',
    detailsDescription:
      'Twelve motion principles and six usability practices I like to build, each with a demo you can play with.',
    lessonTitle: (name: string) => `${name} — Details — Daniel González Picado`
  },

  a11y: {
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    menu: 'Menu',
    close: 'Close',
    switchLang: 'Leer esta página en español',
    home: 'Home'
  },

  nav: {
    about: 'About',
    work: 'Work',
    details: 'Details',
    contact: 'Contact'
  },

  hero: {
    h1: 'Daniel González Picado — full stack developer',
    words: ['aniel', 'ev', 'esign'],
    // "Design": 2,87 em pintado.
    wordsEm: 2.95,
    statement:
      'I build custom systems and AI integrations for the processes a business relies on every day.',
    ctaPrimary: 'See my work',
    ctaSecondary: "Let's talk",
    role: 'Full stack · AI',
    place: 'Liberia, Costa Rica'
  },

  about: {
    label: 'About',
    reveal:
      'I learned by building: academic projects, systems for companies and websites for real clients. Today I bring AI and emerging technology into every system, so it gives people back their time.',
    now: [
      { verb: 'Studying', text: 'A Licentiate in Web Development at Universidad Nacional, after a degree in Systems Engineering.' },
      { verb: 'Building', text: 'Custom software, platforms and websites with KnotFix, from idea to production.' },
      { verb: 'Exploring', text: 'AI agents, automation and integrations that take hours off repetitive work.' }
    ],
    principlesTitle: 'How I work',
    principles: [
      {
        title: 'Understand before touching',
        text: 'A system in production does things nobody documented. Finding out which ones is part of the job, not a step before it.'
      },
      {
        title: 'Data first',
        text: "A clumsy interface gets fixed on Monday. A badly migrated record shows up three months later, when there's no going back."
      },
      {
        title: 'Write down what I learn',
        text: 'The documentation a project leaves behind tends to outlive it. More than once it was the most valuable thing left.'
      }
    ],
    educationTitle: 'Education',
    education: [
      { period: 'In progress', title: 'Licentiate in Web Development', place: 'Universidad Nacional' },
      { period: '2025', title: 'B.Sc. in Information Systems Engineering', place: 'Universidad Nacional' },
      { period: '2024', title: 'Diploma in Software Application Programming', place: 'Universidad Nacional' }
    ]
  },

  stack: {
    label: 'Stack',
    title: 'What I build with.',
    groups: [
      { name: 'Frontend', text: 'Fast, accessible, carefully made interfaces.', items: ['JavaScript', 'React', 'Angular', 'WordPress'] },
      { name: 'Backend', text: 'APIs and the business logic behind them.', items: ['C#', 'Python', 'PHP', 'Django'] },
      { name: 'Data', text: 'Models, migrations and reports that add up.', items: ['SQL Server', 'Firebase', 'Power BI'] },
      { name: 'Workflow', text: 'Orderly, versioned delivery as a team.', items: ['Docker', 'Git', 'SCRUM'] }
    ]
  },

  work: {
    label: 'Work',
    title: 'Seven projects, told by the problem they solved.',
    problem: 'The problem',
    did: 'What we did',
    result: 'What was left',
    visit: 'Visit the site',
    shot: (name: string) => `Screenshot of ${name}`
  },

  teaser: {
    title: 'What I care about in every interface.',
    text: 'Twelve motion principles and six usability practices, with demos you can play with.',
    cta: 'Explore the details'
  },

  contact: {
    label: 'Contact',
    title: "Let's talk.",
    text: 'Got a process that lives in spreadsheets, chats or a system nobody dares to touch? Tell me about it.',
    copy: 'Copy email',
    copied: 'Copied',
    online: 'Online',
    whereTitle: 'Where I am',
    where: 'Liberia, Guanacaste, Costa Rica',
    availability: 'I work remotely or hybrid and reply on weekdays, usually the same day.'
  },

  footer: {
    lead: 'Handmade in Liberia, Costa Rica.',
    localTime: 'Local time',
    navTitle: 'Navigation',
    socialTitle: 'Online',
    made: 'Designed and built by',
    rights: 'All rights reserved',
    top: 'Back to top'
  },

  details: {
    label: 'Details',
    title: 'Things I like to build.',
    intro:
      "Motion and small details are what make a product feel trustworthy. Here are the ones I use most, each with a demo you can try.",
    tabs: { motion: 'Motion', usability: 'Usability' },
    motionIntro: 'Twelve animation principles. Hover or tap each card.',
    usabilityIntro: "Six details nobody notices when they're done right, and everyone notices when they're missing.",
    more: 'Read more',
    demo: (name: string) => `Play the ${name} demo`,
    closing: 'Want something like this in your product?',
    closingLink: "Let's talk.",
    lesson: {
      of: (i: string, total: string) => `${i} of ${total}`,
      why: 'Why it works',
      when: 'When I use it',
      avoid: 'When I avoid it',
      tip: 'Rule of thumb',
      prev: 'Previous',
      next: 'Next',
      back: 'All details',
      nav: 'More motion principles',
      notFound: 'Principle not found'
    },
    ui: {
      showHit: 'Show the tap area',
      small: '24 px — the minimum',
      large: '44 px — comfortable',
      taps: 'Taps',
      smallTarget: 'Small target',
      largeTarget: 'Comfortable target',
      noFeedback: 'No feedback',
      withFeedback: 'With feedback',
      buttonKind: 'Button type',
      save: 'Save changes',
      saving: 'Saving…',
      saved: 'Saved',
      feedbackOn: 'Every step is visible: pressed, saving, done.',
      feedbackOff: 'Press and wait: for a whole second nothing visible happens.',
      textColor: 'Text color',
      contrastHint: 'Drag the slider left and watch where it stops being readable.',
      sample: "We ship on Friday. If anything in this sentence is hard to read, it's the contrast, not your eyes.",
      passes: 'Passes AA',
      fails: 'Fails AA (minimum 4.5:1)',
      ratio: (r: number) => `${r.toFixed(1)}:1`,
      removeFocus: 'Remove the focus ring (bad example)',
      previous: 'Previous',
      next: 'Next',
      send: 'Send',
      focusOn: 'Use the Tab key to move through them. The ring tells you where you are.',
      focusOff: "Use the Tab key to move through them. Now there's no way to tell where you are.",
      messageKind: 'Message type',
      generic: 'Generic message',
      helpful: 'Helpful message',
      emailLabel: 'Email',
      ok: 'Looks good.',
      errGeneric: 'Error 400: invalid input.',
      errAt: 'The @ is missing. An email looks like this: name@mail.com',
      errDomain: 'The domain after the @ is missing, for example: .com',
      docs: ['March invoice', 'April invoice', 'May invoice'],
      remove: 'Delete',
      removed: (name: string) => `You deleted “${name}”.`,
      undo: 'Undo',
      empty: 'Nothing left.',
      restore: 'Restore list',
      idle: "Delete something: it won't ask if you're sure."
    }
  }
}

export const MESSAGES: Record<Locale, Messages> = { es, en }
