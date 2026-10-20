<script setup lang="ts">
import { SITE, SOCIALS } from '~/data/site'

useHead({
  title: 'Contacto — Daniel González Picado',
  meta: [
    {
      name: 'description',
      content:
        'Escribime a danielgonzalezpicado@gmail.com. Desarrollador full stack en Liberia, Guanacaste, Costa Rica. Disponible para proyectos y posiciones remotas o híbridas.'
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
          <SectionLabel index="01" text="Contacto" />
        </div>
        <h1 class="col-full page-head__title" data-reveal="lines">
          La forma corta: escribime un correo.
        </h1>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <hr class="rule">
        <a :href="`mailto:${SITE.email}`" class="email link-underline">
          {{ SITE.email }}
        </a>
        <hr class="rule">
      </div>
    </section>

    <section class="section details">
      <div class="wrap grid">
        <div class="col-1-6 detail" data-reveal="up">
          <SectionLabel text="En Línea" />
          <ul class="detail__list" role="list">
            <li v-for="social in SOCIALS" :key="social.href">
              <a
                :href="social.href"
                class="detail__link link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ social.label }}
                <span class="detail__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="col-7-12 detail" data-reveal="up">
          <SectionLabel text="Dónde Estoy" />
          <p class="detail__place">{{ SITE.location }}</p>
          <p class="detail__note muted">
            Trabajo de forma remota o híbrida. Respondo correos entre semana,
            normalmente el mismo día.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.email {
  display: block;
  padding-block: var(--sp-8);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 6.2vw, 6.5rem);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.03em;
  /* Correo largo: parte donde haga falta antes que desbordar. */
  overflow-wrap: anywhere;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.detail + .detail {
  margin-top: var(--sp-6);
}

.detail__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  margin: 0;
  padding: 0;
}

.detail__link {
  display: inline-block;
  padding-block: 0.6rem;
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
}

.detail__arrow {
  color: var(--accent);
  font-size: 0.6em;
  vertical-align: 0.4em;
}

.detail__place {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
}

.detail__note {
  margin-top: var(--sp-2);
}

@media (min-width: 900px) {
  .detail + .detail {
    margin-top: 0;
  }
}
</style>
