<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Párrafo que se enciende palabra por palabra al hacer scroll: cada palabra
 * pasa de casi transparente a tinta plena según avanza la lectura.
 *
 * El estado atenuado solo se aplica tras el primer scroll y si el párrafo
 * aún está por debajo de la pantalla. Así nadie ve un texto "apagado" que no
 * puede encender: ni quien llega directo a la sección, ni sin JavaScript,
 * ni con reduced-motion.
 */
const props = defineProps<{ text: string }>()

const words = computed(() => props.text.split(/\s+/).filter(Boolean))
const rootRef = ref<HTMLElement | null>(null)
let tween: gsap.core.Tween | undefined

const arm = () => {
  const el = rootRef.value
  if (!el || tween) return
  tween = gsap.fromTo(
    el.querySelectorAll('.srt__w'),
    { opacity: 0.16 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: 0.5 }
    }
  )
}

onMounted(() => {
  const el = rootRef.value
  if (!el || prefersReducedMotion()) return
  if (el.getBoundingClientRect().top < window.innerHeight) return
  window.addEventListener('scroll', arm, { once: true, passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', arm)
  tween?.scrollTrigger?.kill()
  tween?.kill()
})
</script>

<template>
  <p ref="rootRef" class="srt">
    <span v-for="(word, i) in words" :key="i" class="srt__w">{{ i < words.length - 1 ? `${word} ` : word }}</span>
  </p>
</template>

<style scoped>
.srt__w {
  will-change: opacity;
}
</style>
