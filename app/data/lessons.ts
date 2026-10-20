/**
 * Contenido de /detalles: principios de motion y buenas prácticas de
 * usabilidad. Cada principio tiene una demo viva en MotionTile.vue, elegida
 * por `kind`; el texto es lo que se lee aunque la demo no se reproduzca.
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

/** Texto largo de la página de cada principio (/detalles/<slug>). */
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
  text: string
  use: string
  detail: LessonDetail
}

type RawLesson = Pick<Lesson, 'kind' | 'name' | 'text' | 'use'>

const SLUGS: Record<LessonKind, string> = {
  easing: 'easing',
  offset: 'offset-delay',
  parenting: 'parenting',
  transformation: 'transformation',
  value: 'value-change',
  masking: 'masking',
  overlay: 'overlay',
  cloning: 'cloning',
  obscuration: 'obscuration',
  parallax: 'parallax',
  dimensionality: 'dimensionality',
  dolly: 'dolly-zoom'
}

const DETAILS: Record<LessonKind, LessonDetail> = {
  easing: {
    why: 'Nada en el mundo físico arranca ni se detiene de golpe. Una curva de aceleración imita esa inercia y hace que el movimiento se sienta creíble. Lo lineal solo se justifica en cosas que giran sin parar, como un indicador de carga.',
    when: [
      'Elementos que entran a la pantalla: salida suave (ease-out).',
      'Elementos que se van: entrada suave (ease-in), y más cortos.',
      'Movimientos entre dos puntos visibles: ease-in-out.'
    ],
    avoid: 'Curvas con rebotes exagerados en interfaces de trabajo: cansan a la décima vez que se ven.',
    tip: 'Como regla práctica, una interfaz responde bien entre 150 y 400 ms; más lento empieza a sentirse pesado.'
  },
  offset: {
    why: 'Cuando varios elementos entran a la vez, el ojo no sabe por dónde empezar. Desfasarlos unas décimas de segundo le da un orden de lectura sin una sola palabra.',
    when: [
      'Listas y cuadrículas que aparecen al cargar.',
      'Titulares partidos por líneas.',
      'Menús cuyos ítems se despliegan uno tras otro.'
    ],
    avoid: 'Retardos largos: si el último elemento tarda más de un segundo en llegar, la persona espera en vez de leer.',
    tip: 'Entre 50 y 100 ms de diferencia entre elementos hermanos, y un tope total cercano a medio segundo.'
  },
  parenting: {
    why: 'En un grupo de elementos relacionados, animar el contenedor y dejar que los hijos lo hereden asegura que se muevan como una unidad. Animar cada pieza por separado casi siempre se desfasa y se rompe.',
    when: [
      'Tarjetas con imagen, título y botón.',
      'Menús desplegables con varios ítems.',
      'Íconos formados por varias piezas.'
    ],
    avoid: 'Anidar tanto que cada hijo tenga su propia animación además de la del padre: el resultado es difícil de depurar y de leer.',
    tip: 'Primero mové el padre; añadí movimiento propio al hijo solo si cuenta algo.'
  },
  transformation: {
    why: 'Si una forma se convierte en otra, la persona entiende que sigue siendo el mismo objeto y no pierde el hilo. Cortar de una a otra la obliga a volver a orientarse.',
    when: [
      'Un botón que se vuelve campo de búsqueda.',
      'El ícono de menú que pasa a cruz.',
      'Una miniatura que se expande hasta su detalle.'
    ],
    avoid: 'Transformar formas que no tienen relación entre sí: una transformación sin sentido distrae más que un corte limpio.',
    tip: 'Que cambie la forma, no el significado: el elemento debe seguir siendo reconocible durante todo el trayecto.'
  },
  value: {
    why: 'Un número que salta de golpe se lee como un error. Verlo cambiar permite entender de dónde vino la diferencia, y eso genera confianza en el resultado.',
    when: [
      'Totales que cambian al añadir productos.',
      'Métricas y contadores de progreso.',
      'Saldos y precios que se recalculan.'
    ],
    avoid: 'Contadores lentos para datos que la persona necesita ya, como un saldo crítico: ahí la claridad pesa más que el efecto.',
    tip: 'Usá dígitos tabulares (font-variant-numeric: tabular-nums) para que el ancho del número no se mueva mientras cuenta.'
  },
  masking: {
    why: 'Una máscara descubre el contenido sin desplazarlo: el elemento ya está en su lugar y solo se revela. Se siente más preciso, y es más barato de animar que mover cajas por la pantalla.',
    when: [
      'Titulares que suben desde una línea.',
      'Imágenes que se descubren al hacer scroll.',
      'Transiciones de página con cortinas.'
    ],
    avoid: 'Enmascarar texto largo: obliga a esperar para poder leer.',
    tip: 'Dejá aire extra en la máscara para que no recorte los descendentes de las letras (g, p, y).'
  },
  overlay: {
    why: 'Una capa sobre el contenido mantiene el contexto a la vista. La persona sabe que no se fue a otra pantalla y que puede volver exactamente donde estaba.',
    when: [
      'Modales y diálogos.',
      'Hojas inferiores en móvil.',
      'Paneles laterales con filtros o detalles.'
    ],
    avoid: 'Tapar todo sin una salida clara: una capa siempre necesita cerrarse con un gesto evidente y con la tecla Esc.',
    tip: 'Atenuá el fondo, mantené el foco dentro de la capa mientras esté abierta y devolvelo al elemento que la abrió al cerrarla.'
  },
  cloning: {
    why: 'Duplicar un elemento durante el movimiento deja claro qué se copió y a dónde fue. Es una explicación visual que ahorra una línea de texto.',
    when: [
      'Añadir al carrito: el producto «vuela» hasta el ícono.',
      'Arrastrar y soltar.',
      'Duplicar un registro o una fila.'
    ],
    avoid: 'Dejar clones sin limpiar: cuando termina el gesto, solo debe quedar el resultado final en la página.',
    tip: 'Eliminá los clones al terminar y anunciá el resultado con texto para lectores de pantalla, no solo con la animación.'
  },
  obscuration: {
    why: 'Una cortina decide qué se ve y cuándo. Sirve para esconder lo que aún no está listo y mostrarlo de una vez, en lugar de dejar que aparezca a pedazos.',
    when: [
      'Pantallas de carga y preloaders.',
      'Onboarding paso a paso.',
      'Contenido que se desbloquea al avanzar.'
    ],
    avoid: 'Cortinas que se repiten en cada navegación: a la segunda vez dejan de sorprender y empiezan a estorbar.',
    tip: 'Mostrala una sola vez por sesión y nunca bloquees el contenido si el JavaScript no llega a cargar.'
  },
  parallax: {
    why: 'Capas que se mueven a distinta velocidad crean profundidad con muy poco esfuerzo. La clave es la sutileza: si se nota el efecto, es demasiado.',
    when: [
      'Fondos de héroe.',
      'Capas decorativas dentro de una sección.',
      'Movimiento guiado por el cursor.'
    ],
    avoid: 'Parallax sobre el texto principal o a gran escala: marea y compite con la lectura.',
    tip: 'Un desplazamiento de entre 8 y 10 % basta. Y respetá siempre prefers-reduced-motion.'
  },
  dimensionality: {
    why: 'Apilar capas con separación entre ellas sugiere volumen y jerarquía: lo que está arriba importa más y se siente como algo que se puede tocar.',
    when: [
      'Tarjetas que se elevan al pasar el cursor.',
      'Pilas de elementos, como mazos o notificaciones.',
      'Estados seleccionados.'
    ],
    avoid: 'Sombras difusas para todo: la profundidad también se sugiere con desplazamiento, contorno y escala, sin ensuciar el diseño.',
    tip: 'Comunicá la jerarquía con la separación entre capas, no con el brillo.'
  },
  dolly: {
    why: 'Cambiar la escala del fondo mientras el sujeto se mantiene fijo —el efecto «dolly zoom»— dirige la mirada y da una sensación de enfoque o de tensión.',
    when: [
      'Pasar de una lista a la ficha de un elemento.',
      'Pasar de un mapa a un punto concreto.',
      'Enfatizar un dato clave sobre un fondo.'
    ],
    avoid: 'Usarlo en cada transición: es un efecto dramático y pierde fuerza si se repite.',
    tip: 'Reservalo para el momento que querés que la persona recuerde.'
  }
}

const RAW_LESSONS: readonly RawLesson[] = [
  {
    kind: 'easing',
    name: 'Easing',
    text: 'La aceleración le da peso a un movimiento. Lo lineal se siente mecánico; una salida suave se siente natural, como algo que se frena solo.',
    use: 'Botones, menús y paneles: entran rápido y se asientan despacio.'
  },
  {
    kind: 'offset',
    name: 'Offset & Delay',
    text: 'Desfasar el arranque de elementos hermanos guía el ojo en el orden en que se debe leer.',
    use: 'Listas, tarjetas y titulares que entran en cascada.'
  },
  {
    kind: 'parenting',
    name: 'Parenting',
    text: 'Un elemento hijo hereda el movimiento de su padre. Mover el grupo, y no cada pieza, mantiene todo coherente.',
    use: 'Menús desplegables, íconos compuestos, tarjetas con contenido.'
  },
  {
    kind: 'transformation',
    name: 'Transformation',
    text: 'Una forma se convierte en otra en vez de reemplazarse. La persona entiende que sigue siendo el mismo objeto.',
    use: 'Un botón que se vuelve campo de texto; el ícono de menú que se vuelve cruz.'
  },
  {
    kind: 'value',
    name: 'Value Change',
    text: 'Cuando un número cambia, verlo cambiar comunica el efecto de una acción mejor que mostrar solo el resultado.',
    use: 'Totales del carrito, métricas, contadores de progreso.'
  },
  {
    kind: 'masking',
    name: 'Masking',
    text: 'Revelar contenido con una máscara, sin moverlo, da una sensación de precisión y de oficio.',
    use: 'Titulares, imágenes que se descubren, transiciones entre páginas.'
  },
  {
    kind: 'overlay',
    name: 'Overlay',
    text: 'Una capa sobre el contenido enfoca la atención y mantiene el contexto visible por debajo.',
    use: 'Modales, hojas inferiores, paneles laterales.'
  },
  {
    kind: 'cloning',
    name: 'Cloning',
    text: 'Duplicar un elemento muestra de dónde viene y a dónde va, sin que haya que explicarlo con texto.',
    use: 'Arrastrar y soltar, añadir al carrito, duplicar un registro.'
  },
  {
    kind: 'obscuration',
    name: 'Obscuration',
    text: 'Ocultar y revelar con una cortina controla qué se ve y cuándo, y evita mostrar algo a medio cargar.',
    use: 'Estados de carga, onboarding, secciones que se descubren al avanzar.'
  },
  {
    kind: 'parallax',
    name: 'Parallax',
    text: 'Capas que se mueven a distinta velocidad crean profundidad con solo mover el cursor o hacer scroll. Siempre sutil.',
    use: 'Héroes y fondos de sección, con desplazamientos de un 8–10% como máximo.'
  },
  {
    kind: 'dimensionality',
    name: 'Dimensionality',
    text: 'Capas apiladas con separación entre sí sugieren volumen y jerarquía: lo que está arriba importa más.',
    use: 'Tarjetas, pilas de elementos, estados elevados al pasar el cursor.'
  },
  {
    kind: 'dolly',
    name: 'Dolly & Zoom',
    text: 'Cambiar la escala del fondo mientras el sujeto se mantiene fijo dirige la mirada hacia lo que importa.',
    use: 'Transiciones de lista a detalle, de mapa a ficha.'
  }
]

/** Principios completos: el texto corto de la tarjeta + el largo de su página. */
export const MOTION_LESSONS: readonly Lesson[] = RAW_LESSONS.map(lesson => ({
  ...lesson,
  slug: SLUGS[lesson.kind],
  detail: DETAILS[lesson.kind]
}))

export const getLesson = (slug: string) => MOTION_LESSONS.find(lesson => lesson.slug === slug)

export interface Practice {
  index: string
  title: string
  text: string
  rule: string
}

export const PRACTICES: readonly Practice[] = [
  {
    index: '01',
    title: 'Áreas táctiles de 44 píxeles',
    text: 'Un botón pequeño no es un problema de diseño: es un problema de dedos. El ícono puede ser chico, pero la zona que responde al toque no.',
    rule: 'Mínimo 44 × 44 px de zona pulsable, con espacio entre objetivos vecinos.'
  },
  {
    index: '02',
    title: 'Feedback inmediato',
    text: 'Después de pulsar, la persona necesita saber en menos de un instante que algo está pasando. Si no, vuelve a pulsar o piensa que se rompió.',
    rule: 'Cada acción responde: pulsado, cargando, terminado.'
  },
  {
    index: '03',
    title: 'Contraste que se puede leer',
    text: 'El texto gris claro se ve elegante en la pantalla del diseñador y desaparece bajo el sol. El contraste no es una preferencia estética.',
    rule: 'Al menos 4,5 : 1 para texto normal (WCAG AA).'
  },
  {
    index: '04',
    title: 'Foco visible',
    text: 'Quien navega con teclado necesita ver dónde está. Quitar el contorno de foco «porque se ve feo» deja a esa persona sin mapa.',
    rule: 'Nunca eliminar el outline sin darle un reemplazo igual de claro.'
  },
  {
    index: '05',
    title: 'Errores que ayudan',
    text: 'Un error debería decir qué pasó y cómo arreglarlo, en palabras de persona. «Error 400» solo le sirve a quien programó el formulario.',
    rule: 'Qué falló, por qué y qué hacer, al lado del campo.'
  },
  {
    index: '06',
    title: 'Deshacer antes que confirmar',
    text: 'Los diálogos de «¿Estás seguro?» interrumpen y se aprietan por inercia. Permitir deshacer respeta el ritmo y perdona el error de verdad.',
    rule: 'Acciones reversibles sin interrupciones; confirmar solo lo irreversible.'
  }
]
