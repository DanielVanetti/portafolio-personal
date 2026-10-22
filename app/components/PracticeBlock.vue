<script setup lang="ts">
/**
 * Una práctica de usabilidad: la explicación a un lado y, al otro, una
 * tarjeta donde se prueba el ejemplo.
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
      <p class="practice__rule">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ rule }}
      </p>
    </div>

    <div class="practice__demo">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.practice {
  align-items: center;
  padding-block: var(--sp-6);
  border-top: var(--hairline);
}

.practice__copy {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.practice__index {
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.practice__title {
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

.practice__rule {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: var(--sp-1);
  font-size: var(--fs-sm);
}

.practice__rule svg {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.15rem;
  padding: 0.2rem;
  border-radius: 50%;
  background: var(--coffee);
  color: var(--bg);
}

.practice__demo {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--radius);
  background: var(--bg-soft);
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
