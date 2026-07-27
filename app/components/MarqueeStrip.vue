<script setup lang="ts">
/**
 * Franja de texto en loop horizontal.
 * El segundo grupo es una copia visual para que el loop no tenga costura;
 * va oculto a lectores de pantalla para no repetir el contenido.
 * La animación se activa en la Fase 4 (clase .is-animated).
 */
withDefaults(
  defineProps<{
    items: readonly string[]
    separator?: string
  }>(),
  { separator: '·' }
)
</script>

<template>
  <div class="marquee">
    <div class="marquee__track">
      <ul v-for="group in 2" :key="group" class="marquee__group" role="list" :aria-hidden="group === 2 ? 'true' : undefined">
        <li v-for="item in items" :key="item" class="marquee__item">
          {{ item }}
          <span class="marquee__sep" aria-hidden="true">{{ separator }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  /* El ancho del viewport, no el del contenedor: la franja sangra
     hasta los bordes aunque esté dentro de un .wrap. */
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  padding-block: var(--sp-4);
  border-block: var(--hairline);
}

.marquee__track {
  display: flex;
  width: max-content;
}

.marquee__group {
  display: flex;
  gap: var(--sp-4);
  margin: 0;
  padding: 0 var(--sp-2) 0 0;
  list-style: none;
}

.marquee__item {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  letter-spacing: -0.01em;
  color: var(--text);
}

.marquee__sep {
  color: var(--accent);
}
</style>
