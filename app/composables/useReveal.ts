import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

/** Un único punto de verdad para la preferencia de movimiento. */
export const prefersReducedMotion = () =>
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let openGate: (() => void) | undefined
let gate: Promise<void> | undefined

/**
 * Compuerta de arranque. El preloader la abre al terminar; hasta entonces
 * los reveals esperan, para no gastarse detrás de la cortina.
 * El timeout es un seguro: si algo falla, el contenido igual se anima.
 */
export function motionGate() {
  if (!gate) {
    gate = new Promise<void>(resolve => {
      openGate = resolve
    })
  }
  return Promise.race([
    gate,
    new Promise<void>(resolve => setTimeout(resolve, 2500))
  ])
}

export function openMotionGate() {
  motionGate()
  openGate?.()
}

/**
 * Anima los elementos marcados con data-reveal dentro de la página actual.
 *
 *   data-reveal="lines"  → titular partido en líneas que suben desde su máscara
 *   data-reveal="up"     → bloque que entra con un fade y 24px de desplazamiento
 *
 * Se llama una vez por página, desde el setup del componente de ruta.
 * Todo queda dentro de un gsap.context para poder revertirlo entero al salir.
 */
export function useReveal() {
  let ctx: gsap.Context | undefined
  let splits: SplitType[] = []
  let disposed = false

  onMounted(async () => {
    // Espera a que el DOM de la página esté pintado antes de medirlo.
    await nextTick()

    if (prefersReducedMotion()) return

    await motionGate()

    // La página pudo cambiar mientras esperábamos la compuerta.
    if (disposed) return

    ctx = gsap.context(() => {
      // --- Hero: las líneas ya vienen partidas en el marcado ---
      //
      // El `y: 0` no sobra. El estado inicial vive en CSS como
      // `translateY(110%)`, y getComputedStyle devuelve esa matriz ya
      // resuelta a píxeles. GSAP no puede saber que era un porcentaje, así
      // que la guarda como `y: 149.98px` y anima `yPercent` *encima*: al
      // terminar, la línea queda un alto por debajo de su caja y la máscara
      // se la come entera. Fijar `y` explícitamente descarta ese residuo.
      gsap.utils.toArray<HTMLElement>('[data-reveal="hero"]').forEach(hero => {
        gsap.fromTo(
          hero.querySelectorAll('[data-reveal-line]'),
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 1, ease: 'power4.out', stagger: 0.08 }
        )
      })

      // --- Campo del hero: tintes a la deriva ---
      // Ciclos largos y primos entre sí para que los tres nunca vuelvan a
      // coincidir: el fondo no debe tener un "loop" perceptible.
      const field = document.querySelector<HTMLElement>('[data-field]')

      if (field) {
        const drifts = [
          { x: 9, y: 7, scale: 1.12, duration: 29 },
          { x: -11, y: -6, scale: 1.08, duration: 37 },
          { x: 7, y: -9, scale: 0.9, duration: 43 }
        ]

        const tints = gsap.utils.toArray<HTMLElement>('[data-field-tint]', field)

        const drift = tints.map((tint, i) => {
          const step = drifts[i % drifts.length]!
          return gsap.to(tint, {
            xPercent: step.x,
            yPercent: step.y,
            scale: step.scale,
            duration: step.duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          })
        })

        // Fuera de pantalla el campo no se ve: dejarlo animando solo gastaría
        // batería en el resto de la página.
        ScrollTrigger.create({
          trigger: field,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: ({ isActive }) => {
            drift.forEach(tween => (isActive ? tween.play() : tween.pause()))
          }
        })
      }

      // --- Reglas que se dibujan al entrar en cuadro ---
      gsap.utils.toArray<HTMLElement>('[data-draw]').forEach(line => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: line,
              start: 'top 92%',
              once: true
            }
          }
        )
      })

      // --- Parallax: nunca más del 10% que fija el presupuesto ---
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
        gsap.to(el, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // --- Titulares: SplitType por líneas, cada una en su máscara ---
      const headings = gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]')

      headings.forEach(heading => {
        const split = new SplitType(heading, {
          types: 'lines',
          lineClass: 'reveal-line'
        })
        splits.push(split)

        // SplitType no crea el interior que necesita la máscara; lo envolvemos.
        const inners = (split.lines ?? []).map(line => {
          const inner = document.createElement('span')
          inner.className = 'reveal-line__inner'
          while (line.firstChild) inner.appendChild(line.firstChild)
          line.appendChild(inner)
          return inner
        })

        // El titular estaba oculto para no enseñar el texto sin partir.
        heading.classList.add('is-split')

        gsap.from(inners, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            once: true
          }
        })
      })

      // --- Bloques: fade-up, una sola vez ---
      const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal="up"]')

      blocks.forEach(block => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              once: true
            }
          }
        )
      })
    })
  })

  onUnmounted(() => {
    disposed = true
    // revert() mata triggers y restaura estilos; los splits devuelven el
    // texto a su marcado original.
    ctx?.revert()
    splits.forEach(split => split.revert())
    splits = []
    ScrollTrigger.refresh()
  })
}
