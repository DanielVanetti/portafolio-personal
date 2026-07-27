<script setup lang="ts">
/**
 * Composición tipográfica que sustituye a las capturas de pantalla:
 * índice grande, título y stack sobre fondo oscuro.
 * Es contenido decorativo — el texto real vive en ProjectRow.
 */
defineProps<{
  index: string
  title: string
  stack: readonly string[]
}>()
</script>

<template>
  <div class="plate invert" aria-hidden="true">
    <span class="plate__index">{{ index }}</span>
    <span class="plate__title">{{ title }}</span>
    <span class="plate__stack">{{ stack.join(' · ') }}</span>
  </div>
</template>

<style scoped>
.plate {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 4 / 5;
  padding: var(--sp-3);
  overflow: hidden;
}

.plate__index {
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 300;
  line-height: var(--lh-tight);
  color: var(--accent);
}

.plate__title {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.plate__stack {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--text-muted);
}
</style>
