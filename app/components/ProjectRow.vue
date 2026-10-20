<script setup lang="ts">
/**
 * Fila editorial de proyecto: índice, título, contexto y stack,
 * separados por una línea hairline superior.
 */
defineProps<{
  index: string
  title: string
  context: string
  stack: readonly string[]
}>()
</script>

<template>
  <article class="row">
    <span class="row__index label__index mono-meta">{{ index }}</span>

    <!-- h2: en Inicio estas filas son el primer nivel bajo el h1, así que
         un h3 rompería el orden de encabezados. -->
    <h2 class="row__title">{{ title }}</h2>

    <p class="row__context mono-meta muted">{{ context }}</p>

    <p class="row__stack mono-meta muted">{{ stack.join(' · ') }}</p>
  </article>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'index   title'
    '.       context'
    '.       stack';
  align-items: baseline;
  column-gap: var(--sp-3);
  row-gap: var(--sp-1);
  padding-block: var(--sp-4);
  border-top: var(--hairline);
}

.row__index { grid-area: index; }
.row__title { grid-area: title; }
.row__context { grid-area: context; }
.row__stack { grid-area: stack; }

.row__title {
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.035em;
  transition: transform var(--dur-fast) var(--ease-out);
}

/* El índice es parte del gesto tipográfico: serif, grande, en café. */
.row__index {
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  letter-spacing: -0.02em;
  text-transform: none;
}

.row {
  transition: border-color var(--dur-fast) var(--ease-out);
}

.row:hover {
  border-top-color: var(--ink);
}

.row:hover .row__title {
  transform: translateX(var(--sp-2));
}

@media (min-width: 900px) {
  .row {
    grid-template-columns: 4rem 1fr auto;
    grid-template-areas:
      'index title   context'
      '.     stack   stack';
    column-gap: var(--sp-6);
    row-gap: var(--sp-2);
    padding-block: var(--sp-6);
  }

  .row__title {
    font-size: clamp(3.5rem, 6.5vw, 6rem);
  }

  .row__context {
    text-align: right;
    white-space: nowrap;
  }
}
</style>
