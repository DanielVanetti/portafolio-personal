<script setup lang="ts">
/**
 * Etiqueta de sección: índice en café, una línea corta y el nombre.
 *   01 ── SOBRE MÍ
 */
defineProps<{
  index?: string
  text: string
}>()
</script>

<template>
  <p class="label section-label">
    <span v-if="index" class="label__index">{{ index }}</span>
    <span v-if="index" class="section-label__line" aria-hidden="true"></span>
    <span>{{ text }}</span>
  </p>
</template>

<style scoped>
.section-label {
  display: flex;
  align-items: center;
  gap: 0.75em;
}

.section-label__line {
  width: 1.75rem;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}
</style>
