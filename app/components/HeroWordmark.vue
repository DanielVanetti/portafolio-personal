<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Wordmark del hero: una D fija que se rompe bajo el cursor (ShatterLetter)
 * y, a su lado, el resto de la palabra rotando: Daniel → Desarrollo → Diseño
 * (o Daniel → Dev → Design en inglés).
 *
 * Cada cambio saca las letras hacia arriba con desenfoque y trae las nuevas
 * desde abajo, en cascada. El primer valor es el nombre: es lo que ve quien
 * llega sin JavaScript o con reduced-motion, y el ciclo vuelve a él.
 */
const props = defineProps<{
  words: readonly string[]
  /** Ancho en em de la palabra completa más larga: con él, nunca desborda. */
  em: number
}>()

const index = ref(0)
const letters = computed(() => Array.from(props.words[index.value] ?? ''))

const rootRef = ref<HTMLElement | null>(null)
const suffixRef = ref<HTMLElement | null>(null)

// El nombre se queda más tiempo: es la palabra que importa.
const holdFor = (i: number) => (i === 0 ? 3400 : 2200)

let timer: ReturnType<typeof setTimeout> | undefined
let visible = true
let busy = false
let observer: IntersectionObserver | undefined

const schedule = () => {
  clearTimeout(timer)
  if (!visible || document.hidden) return
  timer = setTimeout(swap, holdFor(index.value))
}

const swap = async () => {
  const el = suffixRef.value
  if (!el || busy) return
  busy = true

  await gsap.to(el.querySelectorAll('.wm__ch'), {
    yPercent: -70,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.38,
    ease: 'power2.in',
    stagger: 0.025
  })

  index.value = (index.value + 1) % props.words.length
  await nextTick()

  await gsap.fromTo(
    el.querySelectorAll('.wm__ch'),
    { yPercent: 70, opacity: 0, filter: 'blur(10px)' },
    { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.04 }
  )

  busy = false
  schedule()
}

const onVisibility = () => (document.hidden ? clearTimeout(timer) : schedule())

onMounted(() => {
  if (prefersReducedMotion() || props.words.length < 2) return

  // Fuera de pantalla no tiene sentido seguir rotando.
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    visible ? schedule() : clearTimeout(timer)
  })
  if (rootRef.value) observer.observe(rootRef.value)
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  clearTimeout(timer)
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  if (suffixRef.value) gsap.killTweensOf(suffixRef.value.querySelectorAll('.wm__ch'))
})
</script>

<template>
  <div ref="rootRef" class="wm" :style="{ '--wm-em': em }" aria-hidden="true">
    <ShatterLetter letter="D" class="wm__d" />
    <span ref="suffixRef" class="wm__suffix">
      <span v-for="(ch, i) in letters" :key="`${index}-${i}`" class="wm__ch">{{ ch }}</span>
    </span>
  </div>
</template>

<style scoped>
/* El padre fija el tamaño máximo en --wm-max y es contenedor de consulta:
   100cqi es su ancho. La palabra más larga ocupa como mucho ese ancho, así
   que en un idioma con palabras largas el wordmark se reduce solo lo justo. */
.wm {
  font-size: min(var(--wm-max, 1em), calc(100cqi / var(--wm-em)));
  display: flex;
  align-items: baseline;
  font-family: var(--font-display);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.045em;
  white-space: nowrap;
}

.wm__suffix {
  display: inline-flex;
  /* El desenfoque y el desplazamiento salen de la caja: que no se recorten. */
  padding-block: 0.1em;
  margin-block: -0.1em;
}

.wm__ch {
  display: inline-block;
  will-change: transform, filter, opacity;
}
</style>
