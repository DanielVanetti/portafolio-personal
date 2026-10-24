<script setup lang="ts">
import { getLesson, getLessons } from '~/data/lessons'

/**
 * Página de un principio de motion: la demo en grande y el texto largo.
 * Se usa en /detalles/<slug> y en /en/details/<slug>.
 */
const { t, locale, path } = useLocale()
const route = useRoute()

const lessons = getLessons(locale.value)
const lesson = getLesson(locale.value, String(route.params.slug))

if (!lesson) {
  throw createError({ statusCode: 404, statusMessage: t.value.details.lesson.notFound, fatal: true })
}

const position = lessons.findIndex(item => item.slug === lesson.slug)
const index = String(position + 1).padStart(2, '0')
const total = String(lessons.length).padStart(2, '0')
// Recorrido circular: del último se vuelve al primero.
const prev = lessons[(position - 1 + lessons.length) % lessons.length]!
const next = lessons[(position + 1) % lessons.length]!

useHead(() => ({
  title: t.value.meta.lessonTitle(lesson.name),
  meta: [{ name: 'description', content: `${lesson.name}: ${lesson.text}` }]
}))

useReveal()
</script>

<template>
  <div v-if="lesson">
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel :text="t.details.lesson.of(index, total)" />
        </div>
        <h1 class="col-full page-head__title" data-reveal="lines">{{ lesson.name }}</h1>
        <p class="col-2-8 lead page-head__intro" data-reveal="up">{{ lesson.text }}</p>
      </div>
    </section>

    <!-- La demo, en grande. Es la misma de la tarjeta. -->
    <section class="section demo">
      <div class="wrap">
        <MotionTile :lesson="lesson" variant="stage" />
      </div>
    </section>

    <section class="section detail">
      <div class="wrap grid">
        <div class="col-1-6 detail__why" data-reveal="up">
          <SectionLabel :text="t.details.lesson.why" />
          <p class="detail__lead">{{ lesson.detail.why }}</p>
        </div>

        <div class="col-7-12 detail__lists" data-reveal="up">
          <div class="detail__block">
            <SectionLabel :text="t.details.lesson.when" />
            <ul class="detail__list" role="list">
              <li v-for="item in lesson.detail.when" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="detail__block">
            <SectionLabel :text="t.details.lesson.avoid" />
            <p>{{ lesson.detail.avoid }}</p>
          </div>

          <div class="detail__block">
            <SectionLabel :text="t.details.lesson.tip" />
            <p class="detail__tip">{{ lesson.detail.tip }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section pager-section">
      <div class="wrap">
        <hr class="rule" data-draw>
        <nav class="pager" :aria-label="t.details.lesson.nav">
          <NuxtLink :to="path('details', prev.slug)" class="pager__link">
            <span class="mono-meta muted">← {{ t.details.lesson.prev }}</span>
            <span class="pager__name">{{ prev.name }}</span>
          </NuxtLink>

          <NuxtLink :to="path('details', next.slug)" class="pager__link pager__link--next">
            <span class="mono-meta muted">{{ t.details.lesson.next }} →</span>
            <span class="pager__name">{{ next.name }}</span>
          </NuxtLink>
        </nav>

        <NuxtLink :to="path('details')" class="cta-link link-underline">{{ t.details.lesson.back }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head__intro {
  margin-top: var(--sp-6);
}

.demo {
  padding-block: var(--sp-8);
}

.detail__why {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.detail__lead {
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.detail__lists {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.detail__block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding-top: var(--sp-2);
  border-top: var(--hairline);
}

.detail__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  margin: 0;
  padding: 0;
}

.detail__list li {
  padding-left: var(--sp-3);
  position: relative;
}

.detail__list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.detail__tip {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.02em;
}

.pager-section {
  padding-bottom: var(--sp-16);
}

.pager {
  display: grid;
  gap: var(--sp-4);
  margin-block: var(--sp-6);
}

.pager__link {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding-block: var(--sp-2);
}

.pager__name {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.04em;
  transition: transform var(--dur-fast) var(--ease-out);
}

.pager__link:hover .pager__name {
  transform: translateX(var(--sp-2));
}

.cta-link {
  display: inline-block;
  padding-block: 0.6rem;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
}

@media (min-width: 900px) {
  .pager {
    grid-template-columns: repeat(2, 1fr);
  }

  .pager__link--next {
    text-align: right;
    align-items: flex-end;
  }

  .pager__link--next:hover .pager__name {
    transform: translateX(calc(var(--sp-2) * -1));
  }
}
</style>
