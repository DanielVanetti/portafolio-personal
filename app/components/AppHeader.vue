<script setup lang="ts">
const route = useRoute()

const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-mi', label: 'Sobre Mí' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/detalles', label: 'Detalles' },
  { to: '/contacto', label: 'Contacto' }
]

/**
 * Inicio solo está activo en la raíz exacta; el resto de secciones
 * siguen activas dentro de sus rutas hijas.
 */
const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <header class="site-header">
    <div class="wrap site-header__inner">
      <NuxtLink to="/" class="site-header__mark link-underline">
        Daniel González
      </NuxtLink>

      <nav class="nav" aria-label="Navegación principal">
        <ul class="nav__list" role="list">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="nav__link link-underline"
              :class="{ 'is-active': isActive(item.to) }"
              :aria-current="isActive(item.to) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: var(--hairline);
}

.site-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding-block: var(--sp-2);
}

.site-header__mark {
  font-family: var(--font-body);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
}

/* "Detalles" es más largo que el "Blog" al que sustituyó: en móvil los cinco
   enlaces no caben con la separación de escritorio, así que se estrechan
   y, como último recurso, bajan de línea en vez de ensanchar la página. */
.nav__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0 var(--sp-1);
  margin: 0;
  padding: 0;
}

.nav__link {
  display: inline-block;
  /* Target táctil de 44px sin engordar la fila:
     el área extra se reparte con padding vertical. */
  padding-block: 0.85rem;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gray-600);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__link:hover,
.nav__link.is-active {
  color: var(--ink);
}

@media (min-width: 700px) {
  .site-header__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-6);
  }

  .nav__list {
    justify-content: flex-end;
    gap: 0 var(--sp-4);
  }

  .nav__link {
    letter-spacing: var(--ls-label);
  }
}
</style>
