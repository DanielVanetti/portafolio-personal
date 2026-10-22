import type { Locale } from '~/utils/locale'

/**
 * Contenido de Detalles: principios de motion y prácticas de usabilidad, en
 * español e inglés. Cada principio tiene una demo viva en MotionTile.vue,
 * elegida por `kind`; el slug es el mismo en los dos idiomas.
 */

export type LessonKind =
  | 'easing'
  | 'offset'
  | 'parenting'
  | 'transformation'
  | 'value'
  | 'masking'
  | 'overlay'
  | 'cloning'
  | 'obscuration'
  | 'parallax'
  | 'dimensionality'
  | 'dolly'

/** Texto largo de la página de cada principio. */
export interface LessonDetail {
  why: string
  when: readonly string[]
  avoid: string
  tip: string
}

export interface Lesson {
  kind: LessonKind
  slug: string
  name: string
  /** Lo que se lee en la tarjeta. */
  text: string
  detail: LessonDetail
}

type Copy = Pick<Lesson, 'text' | 'detail'>

interface Source {
  kind: LessonKind
  slug: string
  name: string
  es: Copy
  en: Copy
}

const SOURCES: readonly Source[] = [
  {
    kind: 'easing',
    slug: 'easing',
    name: 'Easing',
    es: {
      text: 'Nada en la vida real se mueve a velocidad constante. Por eso casi nunca uso movimiento lineal: una salida suave hace que todo se sienta natural.',
      detail: {
        why: 'Nada en el mundo físico arranca ni se detiene de golpe. Una curva de aceleración imita esa inercia y hace que el movimiento se sienta creíble. Lo lineal solo tiene sentido en cosas que giran sin parar, como un indicador de carga.',
        when: [
          'Elementos que entran a la pantalla: salida suave (ease-out).',
          'Elementos que se van: entrada suave (ease-in), y más cortos.',
          'Movimientos entre dos puntos visibles: ease-in-out.'
        ],
        avoid: 'Curvas con rebotes exagerados en herramientas de trabajo: cansan a la décima vez que se ven.',
        tip: 'Como referencia, una interfaz responde bien entre 150 y 400 ms; más lento empieza a sentirse pesado.'
      }
    },
    en: {
      text: 'Nothing in real life moves at a constant speed. That’s why I almost never use linear motion: a soft ease-out makes everything feel natural.',
      detail: {
        why: 'Nothing in the physical world starts or stops instantly. An easing curve imitates that inertia and makes motion believable. Linear only makes sense for things that spin forever, like a loading indicator.',
        when: [
          'Elements entering the screen: ease-out.',
          'Elements leaving: ease-in, and shorter.',
          'Moving between two visible points: ease-in-out.'
        ],
        avoid: 'Exaggerated bouncy curves in work tools: they get tiring by the tenth time.',
        tip: 'As a reference, interfaces feel responsive between 150 and 400 ms; slower starts to feel heavy.'
      }
    }
  },
  {
    kind: 'offset',
    slug: 'offset-delay',
    name: 'Offset & Delay',
    es: {
      text: 'Si todo aparece a la vez, el ojo no sabe por dónde empezar. Un pequeño desfase entre elementos marca el orden de lectura.',
      detail: {
        why: 'Cuando varios elementos entran juntos, el ojo no tiene un punto de partida. Desfasarlos unas décimas de segundo le da un orden de lectura sin una sola palabra.',
        when: [
          'Listas y cuadrículas que aparecen al cargar.',
          'Titulares partidos por líneas.',
          'Menús cuyos ítems se despliegan uno tras otro.'
        ],
        avoid: 'Retardos largos: si el último elemento tarda más de un segundo en llegar, la persona espera en vez de leer.',
        tip: 'Entre 50 y 100 ms entre elementos hermanos, y un total cercano a medio segundo.'
      }
    },
    en: {
      text: 'If everything appears at once, the eye doesn’t know where to start. A small offset between elements sets the reading order.',
      detail: {
        why: 'When several elements enter together, the eye has no starting point. Offsetting them by a fraction of a second gives a reading order without a single word.',
        when: [
          'Lists and grids appearing on load.',
          'Headlines split into lines.',
          'Menus whose items unfold one after another.'
        ],
        avoid: 'Long delays: if the last element takes more than a second to arrive, people wait instead of reading.',
        tip: '50 to 100 ms between siblings, and around half a second in total.'
      }
    }
  },
  {
    kind: 'parenting',
    slug: 'parenting',
    name: 'Parenting',
    es: {
      text: 'Cuando varias piezas forman un grupo, muevo el grupo entero y dejo que cada pieza lo siga. Así nada se desfasa.',
      detail: {
        why: 'Si animo el contenedor y dejo que los hijos hereden su movimiento, el grupo se mueve como una unidad. Animar cada pieza por separado casi siempre termina desfasado.',
        when: [
          'Tarjetas con imagen, título y botón.',
          'Menús desplegables con varios ítems.',
          'Íconos formados por varias piezas.'
        ],
        avoid: 'Anidar tanto que cada hijo tenga su propia animación además de la del padre: se vuelve difícil de leer y de mantener.',
        tip: 'Primero se mueve el padre; el hijo solo agrega movimiento propio si cuenta algo.'
      }
    },
    en: {
      text: 'When several pieces form a group, I move the whole group and let each piece follow. Nothing drifts out of sync.',
      detail: {
        why: 'If I animate the container and let the children inherit its motion, the group moves as one. Animating each piece separately almost always ends up out of sync.',
        when: [
          'Cards with an image, a title and a button.',
          'Dropdown menus with several items.',
          'Icons made of several parts.'
        ],
        avoid: 'Nesting so deep that every child has its own animation on top of the parent’s: it becomes hard to read and to maintain.',
        tip: 'Move the parent first; a child only adds motion of its own if it tells something.'
      }
    }
  },
  {
    kind: 'transformation',
    slug: 'transformation',
    name: 'Transformation',
    es: {
      text: 'Prefiero que una forma se convierta en otra a que desaparezca y aparezca algo nuevo: así se entiende que es el mismo objeto.',
      detail: {
        why: 'Si una forma se convierte en otra, la persona entiende que sigue siendo lo mismo y no pierde el hilo. Un corte seco la obliga a volver a orientarse.',
        when: [
          'Un botón que se vuelve campo de búsqueda.',
          'El ícono de menú que pasa a cruz.',
          'Una miniatura que se expande hasta su detalle.'
        ],
        avoid: 'Transformar formas que no tienen nada que ver: una transformación sin sentido distrae más que un corte limpio.',
        tip: 'Que cambie la forma, no el significado: el elemento tiene que seguir siendo reconocible.'
      }
    },
    en: {
      text: 'I’d rather have one shape turn into another than swap it out: that way it’s clear it’s still the same thing.',
      detail: {
        why: 'When a shape turns into another, people understand it’s still the same object and keep their bearings. A hard cut forces them to reorient.',
        when: [
          'A button that becomes a search field.',
          'A menu icon that turns into a close icon.',
          'A thumbnail that expands into its detail view.'
        ],
        avoid: 'Morphing shapes that have nothing in common: a meaningless transformation distracts more than a clean cut.',
        tip: 'Change the shape, not the meaning: the element should stay recognizable throughout.'
      }
    }
  },
  {
    kind: 'value',
    slug: 'value-change',
    name: 'Value Change',
    es: {
      text: 'Ver un número cambiar explica mejor el efecto de una acción que mostrar solo el resultado final.',
      detail: {
        why: 'Un número que salta de golpe puede pasar desapercibido o leerse como un error. Verlo cambiar ayuda a entender de dónde vino la diferencia, y eso da confianza en el resultado.',
        when: [
          'Totales que cambian al agregar productos.',
          'Métricas y contadores de progreso.',
          'Saldos y precios que se recalculan.'
        ],
        avoid: 'Contadores lentos para datos que la persona necesita ya, como un saldo crítico: ahí la claridad pesa más que el efecto.',
        tip: 'Usá dígitos tabulares (font-variant-numeric: tabular-nums) para que el número no cambie de ancho mientras cuenta.'
      }
    },
    en: {
      text: 'Watching a number change explains the effect of an action better than just showing the final result.',
      detail: {
        why: 'A number that jumps can go unnoticed or look like a bug. Watching it change shows where the difference came from, and that builds trust in the result.',
        when: [
          'Totals that change as products are added.',
          'Metrics and progress counters.',
          'Balances and prices being recalculated.'
        ],
        avoid: 'Slow counters for data people need right away, like a critical balance: clarity matters more than the effect.',
        tip: 'Use tabular figures (font-variant-numeric: tabular-nums) so the number doesn’t change width while it counts.'
      }
    }
  },
  {
    kind: 'masking',
    slug: 'masking',
    name: 'Masking',
    es: {
      text: 'Revelar algo con una máscara, sin moverlo de su lugar, se siente preciso y cuidado.',
      detail: {
        why: 'Una máscara descubre el contenido sin desplazarlo: ya está en su sitio y solo se revela. Como nada cambia de lugar, se siente más preciso que mover cajas por la pantalla.',
        when: [
          'Titulares que suben desde una línea.',
          'Imágenes que se descubren al hacer scroll.',
          'Transiciones de página con cortinas.'
        ],
        avoid: 'Enmascarar texto largo: obliga a esperar para poder leer.',
        tip: 'Dejá aire extra en la máscara para que no recorte los descendentes de las letras (g, p, y).'
      }
    },
    en: {
      text: 'Revealing something with a mask, without moving it, feels precise and crafted.',
      detail: {
        why: 'A mask uncovers content without displacing it: it’s already in place and simply revealed. Since nothing moves, it feels more precise than sliding boxes around.',
        when: [
          'Headlines rising from a line.',
          'Images revealed on scroll.',
          'Page transitions with curtains.'
        ],
        avoid: 'Masking long text: people have to wait before they can read.',
        tip: 'Leave extra room in the mask so it doesn’t clip descenders (g, p, y).'
      }
    }
  },
  {
    kind: 'overlay',
    slug: 'overlay',
    name: 'Overlay',
    es: {
      text: 'Una capa encima del contenido enfoca la atención sin hacerte perder dónde estabas.',
      detail: {
        why: 'Una capa sobre el contenido mantiene el contexto a la vista. La persona sabe que no cambió de pantalla y que puede volver exactamente adonde estaba.',
        when: [
          'Modales y diálogos.',
          'Hojas inferiores en móvil.',
          'Paneles laterales con filtros o detalles.'
        ],
        avoid: 'Tapar todo sin una salida clara: una capa siempre tiene que poder cerrarse con un gesto evidente y con la tecla Esc.',
        tip: 'Atenuá el fondo, mantené el foco dentro de la capa mientras esté abierta y devolvelo al elemento que la abrió al cerrarla.'
      }
    },
    en: {
      text: 'A layer over the content focuses attention without making you lose your place.',
      detail: {
        why: 'A layer on top of the content keeps the context in view. People know they haven’t left the screen and can return exactly where they were.',
        when: [
          'Modals and dialogs.',
          'Bottom sheets on mobile.',
          'Side panels with filters or details.'
        ],
        avoid: 'Covering everything with no clear way out: a layer must always close with an obvious gesture and with the Esc key.',
        tip: 'Dim the background, keep focus inside the layer while it’s open, and return it to the element that opened it.'
      }
    }
  },
  {
    kind: 'cloning',
    slug: 'cloning',
    name: 'Cloning',
    es: {
      text: 'Una copia que se mueve muestra de dónde viene algo y a dónde va, sin necesidad de explicarlo.',
      detail: {
        why: 'Duplicar un elemento durante el movimiento deja claro qué se copió y a dónde fue. Es una explicación visual que ahorra una línea de texto.',
        when: [
          'Agregar al carrito: el producto «vuela» hasta el ícono.',
          'Arrastrar y soltar.',
          'Duplicar un registro o una fila.'
        ],
        avoid: 'Dejar clones sin limpiar: cuando termina el gesto, solo debe quedar el resultado final.',
        tip: 'Eliminá los clones al terminar y anunciá el resultado con texto para lectores de pantalla, no solo con la animación.'
      }
    },
    en: {
      text: 'A moving copy shows where something comes from and where it goes, no explanation needed.',
      detail: {
        why: 'Duplicating an element during motion makes it clear what was copied and where it went. It’s a visual explanation that saves a line of text.',
        when: [
          'Add to cart: the product “flies” to the icon.',
          'Drag and drop.',
          'Duplicating a record or a row.'
        ],
        avoid: 'Leaving clones behind: once the gesture ends, only the final result should remain.',
        tip: 'Remove clones when done and announce the result in text for screen readers, not only through the animation.'
      }
    }
  },
  {
    kind: 'obscuration',
    slug: 'obscuration',
    name: 'Obscuration',
    es: {
      text: 'Una cortina decide qué se ve y cuándo. Mejor eso que ver la pantalla cargar a pedazos.',
      detail: {
        why: 'Una cortina decide qué se ve y cuándo. Sirve para esconder lo que todavía no está listo y mostrarlo de una vez, en lugar de dejar que aparezca a pedazos.',
        when: [
          'Pantallas de carga.',
          'Onboarding paso a paso.',
          'Contenido que se desbloquea al avanzar.'
        ],
        avoid: 'Cortinas que se repiten en cada navegación: a la segunda vez dejan de sorprender y empiezan a estorbar.',
        tip: 'Mostrala una sola vez por sesión y nunca bloquees el contenido si el JavaScript no carga.'
      }
    },
    en: {
      text: 'A curtain decides what you see and when. Better that than watching a screen load in pieces.',
      detail: {
        why: 'A curtain decides what is seen and when. It hides what isn’t ready yet and shows it all at once, instead of letting it appear in pieces.',
        when: [
          'Loading screens.',
          'Step-by-step onboarding.',
          'Content unlocked as you progress.'
        ],
        avoid: 'Curtains that repeat on every navigation: the second time they stop surprising and start getting in the way.',
        tip: 'Show it once per session and never block content if JavaScript fails to load.'
      }
    }
  },
  {
    kind: 'parallax',
    slug: 'parallax',
    name: 'Parallax',
    es: {
      text: 'Capas que se mueven a distinta velocidad dan profundidad. Lo uso poco y siempre suave.',
      detail: {
        why: 'Capas que se mueven a distinta velocidad crean profundidad con muy poco. La clave es la sutileza: si el efecto se nota, es demasiado.',
        when: [
          'Fondos de portada.',
          'Capas decorativas dentro de una sección.',
          'Movimiento guiado por el cursor.'
        ],
        avoid: 'Parallax sobre el texto principal o a gran escala: marea y compite con la lectura.',
        tip: 'Un desplazamiento de entre 8 y 10 % alcanza. Y siempre respetando prefers-reduced-motion.'
      }
    },
    en: {
      text: 'Layers moving at different speeds add depth. I use it sparingly and always subtly.',
      detail: {
        why: 'Layers moving at different speeds create depth with very little. The key is subtlety: if you notice the effect, it’s too much.',
        when: [
          'Hero backgrounds.',
          'Decorative layers within a section.',
          'Cursor-driven motion.'
        ],
        avoid: 'Parallax on body text or at large scale: it causes motion sickness and competes with reading.',
        tip: 'An 8 to 10 % offset is enough. And always respect prefers-reduced-motion.'
      }
    }
  },
  {
    kind: 'dimensionality',
    slug: 'dimensionality',
    name: 'Dimensionality',
    es: {
      text: 'Separar capas sugiere volumen y jerarquía: lo que está arriba se siente más importante.',
      detail: {
        why: 'Apilar capas con separación entre ellas sugiere volumen y jerarquía: lo que está arriba importa más y se siente como algo que se puede tocar.',
        when: [
          'Tarjetas que se elevan al pasar el cursor.',
          'Pilas de elementos, como notificaciones.',
          'Estados seleccionados.'
        ],
        avoid: 'Sombras difusas para todo: la profundidad también se logra con desplazamiento, contorno y escala, sin ensuciar el diseño.',
        tip: 'La jerarquía se comunica con la separación entre capas, no con el brillo.'
      }
    },
    en: {
      text: 'Separating layers suggests volume and hierarchy: what’s on top feels more important.',
      detail: {
        why: 'Stacking layers with space between them suggests volume and hierarchy: what’s on top matters more and feels like something you can touch.',
        when: [
          'Cards that lift on hover.',
          'Stacks of items, like notifications.',
          'Selected states.'
        ],
        avoid: 'Blurry shadows everywhere: depth can also come from offset, outline and scale, without cluttering the design.',
        tip: 'Communicate hierarchy through the space between layers, not through brightness.'
      }
    }
  },
  {
    kind: 'dolly',
    slug: 'dolly-zoom',
    name: 'Dolly & Zoom',
    es: {
      text: 'Si el fondo cambia de escala y el sujeto se queda quieto, la mirada va directo a lo que importa.',
      detail: {
        why: 'Cambiar la escala del fondo mientras el sujeto se mantiene fijo —el efecto «dolly zoom» del cine— dirige la mirada y da una sensación de enfoque o de tensión.',
        when: [
          'Pasar de una lista a la ficha de un elemento.',
          'Pasar de un mapa a un punto concreto.',
          'Destacar un dato clave sobre un fondo.'
        ],
        avoid: 'Usarlo en cada transición: es un efecto dramático y pierde fuerza si se repite.',
        tip: 'Guardalo para el momento que querés que la persona recuerde.'
      }
    },
    en: {
      text: 'When the background scales while the subject stays put, the eye goes straight to what matters.',
      detail: {
        why: 'Scaling the background while the subject stays fixed — the film “dolly zoom” — directs the eye and adds a sense of focus or tension.',
        when: [
          'Going from a list to an item’s detail.',
          'Going from a map to a specific point.',
          'Highlighting a key figure over a background.'
        ],
        avoid: 'Using it on every transition: it’s a dramatic effect and loses power when repeated.',
        tip: 'Save it for the moment you want people to remember.'
      }
    }
  }
]

/** Slugs de todos los principios, iguales en los dos idiomas. */
export const LESSON_SLUGS = SOURCES.map(source => source.slug)

export const getLessons = (locale: Locale): readonly Lesson[] =>
  SOURCES.map(({ kind, slug, name, ...copy }) => ({ kind, slug, name, ...copy[locale] }))

export const getLesson = (locale: Locale, slug: string) =>
  getLessons(locale).find(lesson => lesson.slug === slug)

export interface Practice {
  title: string
  text: string
  rule: string
}

export const PRACTICES: Record<Locale, readonly Practice[]> = {
  es: [
    {
      title: 'Botones fáciles de tocar',
      text: 'Un ícono puede ser pequeño, pero la zona que responde al dedo no debería serlo. Pocas cosas frustran más que fallar un botón tres veces.',
      rule: 'WCAG pide al menos 24 × 24 px; 44 × 44 px es lo cómodo.'
    },
    {
      title: 'Respuesta inmediata',
      text: 'Cuando pulsás algo, necesitás saber al instante que funcionó. Si no, volvés a pulsar o pensás que se rompió.',
      rule: 'Cada acción responde: pulsado, cargando, listo.'
    },
    {
      title: 'Texto que se lee',
      text: 'Un gris muy claro se ve elegante en un buen monitor y desaparece en un teléfono bajo el sol.',
      rule: 'Contraste mínimo de 4,5 : 1 para texto normal (WCAG AA).'
    },
    {
      title: 'Foco visible',
      text: 'Mucha gente navega con teclado. Si quitás el contorno de foco, se queda sin saber dónde está.',
      rule: 'Si quitás el contorno, poné otro igual de claro.'
    },
    {
      title: 'Errores que ayudan',
      text: 'Un buen mensaje de error dice qué pasó y cómo arreglarlo. «Error 400» solo le sirve a quien programó el formulario.',
      rule: 'Qué falló y qué hacer, junto al campo.'
    },
    {
      title: 'Deshacer en vez de preguntar',
      text: 'Los «¿Estás seguro?» se aceptan por inercia. Poder deshacer es más rápido y perdona el error de verdad.',
      rule: 'Lo reversible se deshace; solo se confirma lo irreversible.'
    }
  ],
  en: [
    {
      title: 'Easy-to-tap buttons',
      text: 'An icon can be small, but the area that responds to your finger shouldn’t be. Few things are more frustrating than missing a button three times.',
      rule: 'WCAG asks for at least 24 × 24 px; 44 × 44 px is comfortable.'
    },
    {
      title: 'Instant feedback',
      text: 'When you press something, you need to know right away that it worked. Otherwise you press again, or assume it’s broken.',
      rule: 'Every action responds: pressed, loading, done.'
    },
    {
      title: 'Readable text',
      text: 'Very light gray looks elegant on a good monitor and disappears on a phone in the sun.',
      rule: 'At least 4.5:1 contrast for body text (WCAG AA).'
    },
    {
      title: 'Visible focus',
      text: 'Plenty of people navigate with a keyboard. Remove the focus ring and they no longer know where they are.',
      rule: 'If you remove the outline, replace it with one just as clear.'
    },
    {
      title: 'Helpful errors',
      text: 'A good error message says what happened and how to fix it. “Error 400” only helps whoever built the form.',
      rule: 'What went wrong and what to do, right next to the field.'
    },
    {
      title: 'Undo instead of asking',
      text: 'People click through “Are you sure?” on autopilot. Undo is faster and actually forgives the mistake.',
      rule: 'Reversible actions get undo; only irreversible ones get a confirmation.'
    }
  ]
}
