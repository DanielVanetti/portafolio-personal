<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Hairline de café que mide cuánto queda de página.
 *
 * Puramente decorativa: sin JS o con reduced-motion no se renderiza, y no
 * se pierde ninguna información al no verla. De ahí que no lleve rol de
 * progressbar — anunciar el scroll en cada frame sería ruido para un lector
 * de pantalla, no ayuda.
 */
const bar = ref<HTMLElement | null>(null)
const enabled = ref(false)

let trigger: ScrollTrigger | undefined

onMounted(() => {
  if (prefersReducedMotion()) return

  enabled.value = true

  // El v-if acaba de cambiar: el nodo aún no existe en este tick.
  nextTick(() => {
    if (!bar.value) return

    trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: ({ progress }) => {
        gsap.set(bar.value, { scaleX: progress })
      }
    })
  })
})

onUnmounted(() => {
  trigger?.kill()
  gsap.killTweensOf(bar.value)
})
</script>

<template>
  <div v-if="enabled" ref="bar" class="scroll-progress" aria-hidden="true" />
</template>
