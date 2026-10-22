<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Número que cuenta hasta su valor cuando entra en pantalla, una sola vez.
 *
 * El servidor pinta el valor final: es lo que ve quien llega sin JS, con
 * reduced-motion o con la cifra ya a la vista. El lector de pantalla siempre
 * oye el valor final, nunca la cuenta.
 */
const props = withDefaults(
  defineProps<{ value: number, from?: number, duration?: number, pad?: number }>(),
  { from: 0, duration: 1.6, pad: 2 }
)

const display = ref(props.value)
const rootRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let tween: gsap.core.Tween | undefined

const format = (n: number) => String(Math.round(n)).padStart(props.pad, '0')

onMounted(() => {
  const el = rootRef.value
  if (!el || prefersReducedMotion()) return
  const rect = el.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return

  display.value = props.from
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    observer?.disconnect()
    const state = { v: props.from }
    tween = gsap.to(state, {
      v: props.value,
      duration: props.duration,
      ease: 'power3.out',
      onUpdate: () => {
        display.value = state.v
      }
    })
  }, { threshold: 0.6 })
  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
  tween?.kill()
})
</script>

<template>
  <span ref="rootRef" class="ticker">
    <span class="sr-only">{{ format(value) }}</span>
    <span aria-hidden="true">{{ format(display) }}</span>
  </span>
</template>

<style scoped>
.ticker {
  font-variant-numeric: tabular-nums;
}
</style>
