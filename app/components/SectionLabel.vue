<script setup lang="ts">
/**
 * Etiqueta editorial de sección: ( 01 — SOBRE MÍ )
 * El índice va en café; el resto en gris templado.
 */
defineProps<{
  index?: string
  text: string
}>()
</script>

<template>
  <p class="label section-label">
    <span aria-hidden="true">(</span>
    <span v-if="index" class="label__index">{{ index }}</span>
    <span v-if="index" aria-hidden="true">—</span>
    <span>{{ text }}</span>
    <span aria-hidden="true">)</span>
  </p>
</template>

<style scoped>
.section-label {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
</style>
