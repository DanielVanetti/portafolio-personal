<script setup lang="ts">
/**
 * Franja de texto en loop horizontal.
 * El segundo grupo es una copia visual para que el loop no tenga costura;
 * va oculto a lectores de pantalla para no repetir el contenido.
 * El loop es CSS puro sobre transform: sigue funcionando sin JavaScript
 * y se detiene por completo con reduced-motion.
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
  /* -50% = exactamente un grupo. Como los dos son idénticos, el salto
     al reiniciar es invisible. */
  animation: marquee-scroll 45s linear infinite;
  will-change: transform;
}

.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* La regla global acorta las duraciones, lo que dejaría la franja
   saltada a mitad de recorrido. Aquí se apaga del todo. */
@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none !important;
  }
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
