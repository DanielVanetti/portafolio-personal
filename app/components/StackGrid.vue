<script setup lang="ts">
/**
 * Tecnologías agrupadas por área, en cuatro tarjetas con foco de luz.
 * Sustituye a la cinta en movimiento: aquí se pueden leer con calma y cada
 * grupo explica para qué sirve. Al entrar en una tarjeta sus etiquetas se
 * descifran a la vez; cada etiqueta también lo hace sola al pasar por ella.
 */
defineProps<{
  groups: readonly { name: string, text: string, items: readonly string[] }[]
}>()

const pulses = ref<number[]>([])
const pulse = (i: number) => {
  pulses.value[i] = (pulses.value[i] ?? 0) + 1
}
</script>

<template>
  <div class="stack-grid">
    <SpotlightCard
      v-for="(group, i) in groups"
      :key="group.name"
      tag="article"
      class="stack-card"
      data-reveal="up"
      @pointerenter="pulse(i)"
    >
      <span class="stack-card__index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
      <h3 class="stack-card__name">{{ group.name }}</h3>
      <p class="stack-card__text muted">{{ group.text }}</p>
      <ul class="stack-card__items" role="list">
        <li v-for="item in group.items" :key="item">
          <ScrambleText :text="item" :trigger="pulses[i] ?? 0" class="chip" />
        </li>
      </ul>
    </SpotlightCard>
  </div>
</template>

<style scoped>
.stack-grid {
  display: grid;
  gap: var(--sp-2);
}

.stack-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  min-height: 19rem;
  padding: var(--sp-4);
}

.stack-card__index {
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.stack-card__name {
  margin-top: var(--sp-6);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

.stack-card__text {
  font-size: var(--fs-sm);
}

/* Las etiquetas se apoyan en el borde inferior: así quedan alineadas entre
   tarjetas aunque cada grupo tenga un texto de distinto largo. */
.stack-card__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: auto 0 0;
  padding: var(--sp-3) 0 0;
}

.chip {
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (min-width: 700px) {
  .stack-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .stack-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
