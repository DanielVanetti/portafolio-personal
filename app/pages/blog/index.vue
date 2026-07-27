<script setup lang="ts">
import { POSTS, formatDateCompact } from '~/data/posts'

useHead({
  title: 'Blog — Daniel González Picado',
  meta: [
    {
      name: 'description',
      content:
        'Notas sobre migrar sistemas heredados, dar soporte a aplicaciones en producción y decidir cuándo WordPress necesita código propio.'
    }
  ]
})

useReveal()
</script>

<template>
  <div>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel index="01" text="Blog" />
        </div>
        <h1 class="col-1-8 page-head__title" data-reveal="lines">
          Notas de lo que me fue costando aprender.
        </h1>
      </div>
    </section>

    <section class="section">
      <div class="wrap posts">
        <article v-for="post in POSTS" :key="post.slug" class="post-row" data-reveal="up">
          <NuxtLink :to="`/blog/${post.slug}`" class="post-row__link">
            <div class="post-row__meta">
              <span class="mono-meta label__index">{{ post.index }}</span>
              <span class="mono-meta muted">{{ formatDateCompact(post.date) }}</span>
              <span class="mono-meta muted">{{ post.tag }}</span>
            </div>

            <h2 class="post-row__title link-underline">{{ post.title }}</h2>

            <p class="post-row__excerpt muted">{{ post.excerpt }}</p>

            <span class="mono-meta muted">{{ post.readingTime }} de lectura</span>
          </NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head {
  padding-bottom: 0;
}

.page-head__title {
  margin-top: var(--sp-4);
  font-size: var(--fs-h1);
  letter-spacing: -0.03em;
}

.posts {
  border-bottom: var(--hairline);
}

.post-row {
  border-top: var(--hairline);
}

.post-row__link {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding-block: var(--sp-6);
}

.post-row__meta {
  display: flex;
  gap: var(--sp-3);
}

.post-row__title {
  /* Solo el título lleva el subrayado, pero el área clicable es la fila
     entera — por eso el hover se dispara desde el enlace. */
  align-self: flex-start;
  font-size: var(--fs-h2);
  font-weight: 300;
}

.post-row__link:hover .post-row__title::after,
.post-row__link:focus-visible .post-row__title::after {
  transform: scaleX(1);
}

.post-row__excerpt {
  max-width: 52ch;
}
</style>
