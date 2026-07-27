<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Cortina de primera carga: contador 00→100 y salida hacia arriba.
 * Se muestra una sola vez por sesión y nunca con reduced-motion.
 *
 * El marcado se renderiza siempre, pero el CSS solo lo hace visible cuando
 * el script en línea del <head> añadió .js-preloader — así no hay parpadeo
 * del hero antes de que la cortina aparezca, y sin JS nunca tapa nada.
 */
const root = ref<HTMLElement | null>(null)
const counter = ref(0)
const done = ref(false)

const shouldRun = () =>
  document.documentElement.classList.contains('js-preloader')

onMounted(() => {
  if (!shouldRun()) {
    done.value = true
    openMotionGate()
    return
  }

  sessionStorage.setItem('dg-preloader', '1')

  const progress = { value: 0 }

  const tl = gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove('js-preloader')
      done.value = true
      openMotionGate()
    }
  })

  tl.to(progress, {
    value: 100,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.value = Math.round(progress.value)
    }
  })
    .to('.preloader__count', {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out'
    })
    .to(root.value, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut'
    })
})
</script>

<template>
  <div v-show="!done" ref="root" class="preloader invert" aria-hidden="true">
    <span class="preloader__mark">Daniel González</span>
    <span class="preloader__count">{{ String(counter).padStart(2, '0') }}</span>
  </div>
</template>

<style scoped>
/*
 * Siempre fuera del flujo. Si la cortina entrara y saliera del flujo —o si
 * bloqueáramos el scroll de la página— el contenido daría un salto de una
 * pantalla entera: un CLS de 1.0 medido con Lighthouse.
 */
.preloader {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: var(--gutter);
  will-change: transform;
  /* Invisible por defecto: sin JS o con reduced-motion nunca tapa nada. */
  visibility: hidden;
  pointer-events: none;
}

:global(.js-preloader) .preloader {
  visibility: visible;
  pointer-events: auto;
}

.preloader__mark {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--text-muted);
}

.preloader__count {
  font-family: var(--font-display);
  font-size: clamp(4rem, 14vw, 10rem);
  font-weight: 300;
  line-height: 0.8;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
</style>
