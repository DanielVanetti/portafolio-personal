<script setup lang="ts">
/**
 * Tarjeta con un foco de luz que sigue al cursor: un halo café muy tenue
 * dentro de la tarjeta y el borde que se aviva al pasar por encima.
 * Solo se mueven dos variables CSS; el resto es CSS puro.
 */
withDefaults(defineProps<{ tag?: string }>(), { tag: 'div' })

const rootRef = ref<HTMLElement | null>(null)

const onMove = (event: PointerEvent) => {
  const el = rootRef.value
  if (!el || event.pointerType !== 'mouse') return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <component :is="tag" ref="rootRef" class="spot" @pointermove="onMove">
    <slot />
  </component>
</template>

<style scoped>
.spot {
  --spot: rgba(111, 78, 55, 0.1);

  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--card);
  transition: border-color 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}

.invert .spot {
  --spot: rgba(167, 139, 114, 0.16);
}

.spot::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(28rem circle at var(--mx, 50%) var(--my, 0%), var(--spot), transparent 60%);
  opacity: 0;
  transition: opacity 0.45s var(--ease-out);
  pointer-events: none;
}

@media (hover: hover) {
  .spot:hover {
    border-color: var(--accent);
  }

  .spot:hover::before {
    opacity: 1;
  }
}
</style>
