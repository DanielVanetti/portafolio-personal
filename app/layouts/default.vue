<template>
  <div class="site">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>

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
