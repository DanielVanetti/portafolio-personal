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
      gsap.utils.toArray<HTMLElement>('[data-reveal="hero"]').forEach(hero => {
        gsap.fromTo(
          hero.querySelectorAll('[data-reveal-line]'),
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.08 }
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
