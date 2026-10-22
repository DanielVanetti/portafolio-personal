<script setup lang="ts">
/**
 * Bloque de buena práctica: explicación a un lado y, al otro, un panel claro
 * donde la persona prueba el ejemplo. Va dentro de una sección invertida;
 * el panel reasigna los alias de color para volver a ser legible en claro.
 */
defineProps<{
  index: string
  title: string
  text: string
  rule: string
}>()
</script>

<template>
  <article class="practice grid">
    <div class="practice__copy">
      <span class="practice__index" aria-hidden="true">{{ index }}</span>
      <h2 class="practice__title">{{ title }}</h2>
      <p class="practice__text muted">{{ text }}</p>
      <p class="practice__rule mono-meta">
        <span class="label__index">Regla —</span> {{ rule }}
      </p>
    </div>

    <div class="practice__demo">
      <p class="label practice__tag">( Probalo )</p>
      <slot />
    </div>
  </article>
</template>

<style scoped>
.practice {
  align-items: start;
  padding-block: var(--sp-8);
  border-top: var(--hairline);
}

.practice__copy {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.practice__index {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
}

.practice__title {
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

.practice__rule {
  margin-top: var(--sp-1);
}

/* Panel claro dentro de la sección oscura. */
.practice__demo {
  --surface: var(--bg);
  --text: var(--ink);
  --text-muted: var(--gray-600);
  --rule: var(--gray-300);
  --accent: var(--coffee);

  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  background: var(--surface);
  color: var(--text);
}

.practice__tag {
  color: var(--text-muted);
}

@media (min-width: 900px) {
  .practice__copy {
    grid-column: 1 / 6;
  }

  .practice__demo {
    grid-column: 7 / 13;
  }
}
</style>
