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

    <h3 class="row__title">{{ title }}</h3>

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
  line-height: var(--lh-snug);
  transition: transform var(--dur-fast) var(--ease-out);
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
  }

  .row__context {
    text-align: right;
    white-space: nowrap;
  }
}
</style>
