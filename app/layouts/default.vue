<script setup lang="ts">
import { SITE } from '~/data/site'

const { t, locale } = useLocale()
const route = useRoute()

// Idioma del documento y su página gemela: los buscadores sirven a cada
// persona la versión en su idioma.
useHead(() => ({
  htmlAttrs: { lang: locale.value },
  link: LOCALES.map(code => ({
    rel: 'alternate',
    hreflang: code,
    href: SITE.url + translatePath(route.path, code)
  }))
}))
</script>

<template>
  <div class="site">
    <ThePreloader />
    <ScrollProgress />

    <a href="#contenido" class="skip-link">{{ t.a11y.skip }}</a>

    <AppHeader />

    <main id="contenido" class="site__main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.site__main {
  flex: 1;
}
</style>
