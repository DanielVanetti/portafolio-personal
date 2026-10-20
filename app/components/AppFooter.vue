<script setup lang="ts">
import { SITE, SOCIALS } from '~/data/site'

const year = new Date().getFullYear()

const nav = [
  { to: '/sobre-mi', label: 'Sobre Mí' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/detalles', label: 'Detalles' },
  { to: '/contacto', label: 'Contacto' }
]
</script>

<template>
  <footer class="site-footer invert">
    <div class="wrap">
      <div class="grid site-footer__top">
        <div class="col-1-6">
          <SectionLabel text="Escribime" />
          <a :href="`mailto:${SITE.email}`" class="site-footer__email link-underline">
            {{ SITE.email }}
          </a>
        </div>

        <nav class="col-8-12 site-footer__nav" aria-label="Navegación del pie">
          <ul role="list">
            <li v-for="item in nav" :key="item.to">
              <NuxtLink :to="item.to" class="link-underline">{{ item.label }}</NuxtLink>
            </li>
          </ul>
          <ul role="list">
            <li v-for="social in SOCIALS" :key="social.href">
              <a
                :href="social.href"
                class="link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >{{ social.label }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Wordmark decorativo: el nombre a escala de fachada. -->
      <p class="site-footer__mark" aria-hidden="true">Daniel González</p>

      <hr class="rule">

      <div class="site-footer__bottom">
        <p class="mono-meta muted">
          Diseñado y desarrollado por {{ SITE.author }}
        </p>
        <p class="mono-meta muted">
          © {{ year }} {{ SITE.author }} · Todos los derechos reservados
        </p>
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
  color: var(--rule);
  user-select: none;
}

.site-footer__email {
  display: inline-block;
  margin-top: var(--sp-2);
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  letter-spacing: -0.02em;
  /* El correo es largo: que parta antes de desbordar en móvil. */
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

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--sp-1);
  padding-top: var(--sp-3);
}

/* En móvil el correo, a 1.75rem, no cabe y se partía a mitad de palabra. */
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
