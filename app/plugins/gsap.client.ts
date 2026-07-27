import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Registro único de GSAP. Solo cliente: el sitio es estático y el motion
 * no existe durante el prerender.
 */
export default defineNuxtPlugin(nuxtApp => {
  gsap.registerPlugin(ScrollTrigger)

  // Tras cambiar de ruta el documento mide distinto: sin este refresh los
  // triggers quedan anclados a posiciones de la página anterior.
  nuxtApp.hook('page:transition:finish', () => {
    ScrollTrigger.refresh()
  })
})
