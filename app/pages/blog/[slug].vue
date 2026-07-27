<script setup lang="ts">
import { POSTS, getPost, formatDate } from '~/data/posts'

const route = useRoute()
const post = getPost(route.params.slug as string)

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ese post no existe',
    fatal: true
  })
}

useHead({
  title: `${post.title} — Daniel González Picado`,
  meta: [{ name: 'description', content: post.excerpt }]
})

/** Circular: el último post enlaza de vuelta al primero. */
const nextPost = POSTS[(POSTS.findIndex(p => p.slug === post.slug) + 1) % POSTS.length]
</script>

<template>
  <article>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel :index="post.index" :text="post.tag" />
        </div>

        <h1 class="col-1-8 page-head__title">{{ post.title }}</h1>

        <p class="col-1-6 page-head__meta mono-meta muted">
          {{ formatDate(post.date) }} · {{ post.readingTime }} de lectura
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid">
        <div class="col-2-8 prose">
          <template v-for="(block, i) in post.body" :key="i">
            <h2 v-if="block.type === 'h2'" class="prose__heading">{{ block.text }}</h2>
            <blockquote v-else-if="block.type === 'quote'" class="prose__quote">
              {{ block.text }}
            </blockquote>
            <p v-else>{{ block.text }}</p>
          </template>
        </div>
      </div>
    </section>

    <section class="section next">
      <div class="wrap">
        <hr class="rule">
        <NuxtLink :to="`/blog/${nextPost.slug}`" class="next__link">
          <span class="label">Siguiente</span>
          <span class="next__title link-underline">{{ nextPost.title }}</span>
        </NuxtLink>
        <NuxtLink to="/blog" class="cta-link link-underline">Volver al blog</NuxtLink>
      </div>
    </section>
  </article>
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

.page-head__meta {
  margin-top: var(--sp-4);
}

.prose {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.prose__heading {
  margin-top: var(--sp-4);
  font-size: var(--fs-h3);
  font-weight: 300;
}

.prose__quote {
  margin: var(--sp-4) 0;
  padding-left: var(--sp-3);
  border-left: 2px solid var(--accent);
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.01em;
}

.next__link {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding-block: var(--sp-6) var(--sp-3);
}

.next__title {
  align-self: flex-start;
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.02em;
}

.next__link:hover .next__title::after,
.next__link:focus-visible .next__title::after {
  transform: scaleX(1);
}

.cta-link {
  display: inline-block;
  padding-block: 0.6rem;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
}
</style>
