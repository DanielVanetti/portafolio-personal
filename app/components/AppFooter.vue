<script setup lang="ts">
import { SITE, SOCIALS } from '~/data/site'

const { t, path, section } = useLocale()
const year = new Date().getFullYear()

const nav = computed(() => [
  { label: t.value.nav.about, to: section('about') },
  { label: t.value.nav.work, to: section('work') },
  { label: t.value.nav.details, to: path('details') },
  { label: t.value.nav.contact, to: section('contact') }
])

const toTop = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true })
}
</script>

<template>
  <footer class="site-footer invert">
    <div class="wrap">
      <div class="grid site-footer__top">
        <div class="col-1-6 site-footer__lead">
          <a :href="`mailto:${SITE.email}`" class="site-footer__email link-underline">
            {{ SITE.email }}
          </a>
        </div>

        <nav class="col-8-12 site-footer__nav" :aria-label="t.a11y.footerNav">
          <ul role="list">
            <li v-for="item in nav" :key="item.label">
              <NuxtLink :to="item.to" class="link-underline">{{ item.label }}</NuxtLink>
            </li>
          </ul>
          <ul role="list">
            <li v-for="social in SOCIALS" :key="social.href">
              <a :href="social.href" class="link-underline" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Wordmark decorativo: el nombre a escala de fachada. -->
      <p class="site-footer__mark" aria-hidden="true">Daniel González</p>

      <hr class="rule">

      <div class="site-footer__bottom">
        <p class="mono-meta muted">{{ t.footer.made }} {{ SITE.author }}</p>
        <p class="mono-meta muted">© {{ year }} {{ SITE.name }} · {{ t.footer.rights }}</p>
        <button type="button" class="site-footer__top-btn mono-meta" @click="toTop">
          {{ t.footer.top }}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-block: var(--sp-12) var(--sp-4);
}

.site-footer__top {
  margin-bottom: var(--sp-12);
}

.site-footer__email {
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.site-footer__nav {
  display: flex;
  gap: var(--sp-8);
  margin-top: var(--sp-6);
}

.site-footer__nav ul {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  margin: 0;
  padding: 0;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
}

.site-footer__nav a {
  display: inline-block;
  padding-block: 0.4rem;
}

.site-footer__mark {
  max-width: none;
  margin-bottom: var(--sp-4);
  font-family: var(--font-display);
  /* Calibrado para que "Daniel González" quepa en una sola línea. */
  font-size: clamp(2.75rem, 13.2vw, 12.4rem);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.05em;
  white-space: nowrap;
  /* Tenue pero legible: 3:1 sobre --bg-dark, el mínimo para texto grande. */
  color: #67615A;
  user-select: none;
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding-top: var(--sp-3);
}

.site-footer__top-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text);
  font: inherit;
  font-size: var(--fs-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  cursor: pointer;
}

.site-footer__top-btn svg {
  width: 1rem;
  height: 1rem;
  transition: transform var(--dur-fast) var(--ease-out);
}

.site-footer__top-btn:hover svg {
  transform: translateY(-3px);
}

@media (max-width: 599px) {
  .site-footer__email {
    font-size: var(--fs-body);
  }
}

@media (min-width: 900px) {
  .site-footer__nav {
    margin-top: 0;
    justify-content: flex-end;
  }
}
</style>
