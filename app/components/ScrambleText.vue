<script setup lang="ts">
/**
 * Texto que se "descifra": al pasar el cursor (o cuando cambia `trigger`)
 * las letras se vuelven símbolos al azar y se van resolviendo de izquierda a
 * derecha hasta el texto real.
 *
 * Una copia invisible fija el ancho para que nada salte alrededor, y el
 * lector de pantalla solo oye el texto real.
 */
const props = withDefaults(defineProps<{ text: string, trigger?: number }>(), { trigger: 0 })

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'
const shown = ref(props.text)
let timer: ReturnType<typeof setInterval> | undefined

const play = () => {
  if (prefersReducedMotion()) return
  clearInterval(timer)
  const chars = Array.from(props.text)
  let frame = 0
  timer = setInterval(() => {
    frame++
    const solved = Math.floor(frame / 2)
    shown.value = chars
      .map((ch, i) => (ch === ' ' || i < solved ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join('')
    if (solved >= chars.length) {
      clearInterval(timer)
      shown.value = props.text
    }
  }, 30)
}

watch(() => props.trigger, (now, before) => {
  if (now !== before) play()
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <span class="scr" @pointerenter="play">
    <span class="sr-only">{{ text }}</span>
    <span class="scr__ghost" aria-hidden="true">{{ text }}</span>
    <span class="scr__live" aria-hidden="true">{{ shown }}</span>
  </span>
</template>

<style scoped>
.scr {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.scr__ghost {
  visibility: hidden;
}

/* Hereda el padding del contenedor (una chip, por ejemplo) para quedar
   exactamente encima de la copia invisible. */
.scr__live {
  position: absolute;
  inset: 0;
  padding: inherit;
}
</style>
