<script setup lang="ts">
// Layout compartido — header y footer definitivos llegan en la Fase 2.
const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-mi', label: 'Sobre Mí' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/blog', label: 'Blog' },
  { to: '/contacto', label: 'Contacto' }
]
</script>

<template>
  <div>
    <header>
      <nav>
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>Daniel González Picado — {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>
