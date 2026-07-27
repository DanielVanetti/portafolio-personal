<script setup lang="ts">
import { SITE, SKILLS } from '~/data/site'
import { FEATURED_PROJECTS } from '~/data/projects'

useHead({
  title: 'Daniel González Picado — Desarrollador Full Stack',
  meta: [
    {
      name: 'description',
      content:
        'Portafolio de Daniel González Picado, desarrollador full stack en Liberia, Costa Rica. Migraciones de sistemas, aplicaciones web y móviles, y soporte en producción.'
    }
  ]
})

const year = new Date().getFullYear()
</script>

<template>
  <div>
    <!-- ( HERO ) — el nombre a sangre, casi tocando los bordes -->
    <section class="hero">
      <div class="wrap hero__inner">
        <SectionLabel :text="SITE.tagline" />

        <h1 class="hero__name">
          <span class="hero__line">Daniel</span>
          <span class="hero__line">González</span>
        </h1>

        <p class="hero__statement lead">
          Del soporte en producción a construir productos completos.
        </p>

        <div class="hero__meta">
          <span class="mono-meta muted">↓ Scroll</span>
          <span class="mono-meta muted">( {{ year }} — Costa Rica )</span>
        </div>
      </div>
    </section>

    <!-- ( 01 — SOBRE MÍ ) -->
    <section class="section">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel index="01" text="Sobre Mí" />
        </div>

        <div class="col-7-12 stack">
          <p class="lead">
            Soy ingeniero en Sistemas de Información y estudio la Licenciatura en
            Desarrollo Web en la Universidad Nacional.
          </p>
          <p>
            Trabajo en la parte del oficio que rara vez sale en las demos:
            sistemas que ya están en producción, datos que no pueden perderse y
            usuarios que necesitan que algo funcione hoy. Es donde aprendí a
            programar de verdad.
          </p>
          <NuxtLink to="/sobre-mi" class="cta-link link-underline">
            Seguir leyendo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ( SKILLS ) — franja invertida, el golpe de contraste del sitio -->
    <section class="invert skills">
      <div class="wrap">
        <SectionLabel index="02" text="Herramientas" />
      </div>
      <MarqueeStrip :items="SKILLS" />
    </section>

    <!-- ( 03 — PROYECTOS ) -->
    <section class="section">
      <div class="wrap">
        <div class="grid section__head">
          <div class="col-1-6">
            <SectionLabel index="03" text="Trabajo Seleccionado" />
          </div>
          <p class="col-7-12 lead">
            Tres proyectos donde el problema real no era el que aparecía en el
            enunciado.
          </p>
        </div>

        <div class="rows">
          <ProjectRow
            v-for="project in FEATURED_PROJECTS"
            :key="project.index"
            :index="project.index"
            :title="project.title"
            :context="project.context"
            :stack="project.stack"
          />
        </div>

        <NuxtLink to="/proyectos" class="cta-link link-underline">
          Ver los cinco proyectos
        </NuxtLink>
      </div>
    </section>

    <!-- ( CTA ) -->
    <section class="section closing">
      <div class="wrap">
        <hr class="rule">
        <p class="closing__text">
          Estoy abierto a proyectos y a posiciones donde haya algo que
          <NuxtLink to="/contacto" class="link-underline">construir en serio</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero__inner {
  display: flex;
  flex-direction: column;
  /* Ocupa la pantalla menos el header, sin forzar 100vh en móvil. */
  min-height: min(84svh, 56rem);
  padding-block: var(--sp-8) var(--sp-4);
}

.hero__name {
  display: flex;
  flex-direction: column;
  margin-block: auto;
  font-size: var(--fs-hero);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.045em;
}

.hero__line {
  display: block;
}

.hero__statement {
  align-self: flex-end;
  max-width: 22ch;
  margin-bottom: var(--sp-8);
  text-align: right;
}

.hero__meta {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-2);
  padding-top: var(--sp-2);
  border-top: var(--hairline);
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-3);
}

.skills {
  padding-block: var(--section-y);
}

.skills .wrap {
  padding-bottom: var(--sp-6);
}

.section__head {
  margin-bottom: var(--sp-8);
}

.rows {
  /* La última fila cierra con su propia línea inferior. */
  border-bottom: var(--hairline);
  margin-bottom: var(--sp-6);
}

.cta-link {
  display: inline-block;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  padding-block: 0.6rem;
}

.closing {
  padding-bottom: var(--sp-16);
}

.closing__text {
  max-width: 24ch;
  margin-top: var(--sp-6);
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.02em;
}

@media (min-width: 700px) {
  .hero__statement {
    max-width: 26ch;
  }
}
</style>
