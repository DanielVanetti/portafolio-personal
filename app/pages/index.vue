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

useReveal()
</script>

<template>
  <div>
    <!-- ( HERO ) — el nombre a sangre sobre un campo de luz a la deriva -->
    <section class="hero">
      <!--
        Capa decorativa. Va fuera del flujo y detrás del contenido, así que
        no puede provocar layout shift ni tapar el texto. Sin JS los tintes
        se quedan quietos: siguen siendo un fondo válido.
      -->
      <div class="hero__field" aria-hidden="true" data-field>
        <span class="field__tint field__tint--coffee" data-field-tint></span>
        <span class="field__tint field__tint--sand" data-field-tint></span>
        <span class="field__tint field__tint--ink" data-field-tint></span>
        <span class="field__grain"></span>
      </div>

      <!-- El contenido sube algo más rápido que el campo al hacer scroll:
           de ahí la sensación de profundidad. Máx. 8%, como fija el plan. -->
      <div class="wrap hero__inner" data-parallax>
        <SectionLabel :text="SITE.tagline" />

        <h1 class="hero__name" data-reveal="hero">
          <span class="reveal-line">
            <span class="reveal-line__inner" data-reveal-line>Daniel</span>
          </span>
          <span class="reveal-line">
            <span class="reveal-line__inner" data-reveal-line>González</span>
          </span>
        </h1>

        <p class="hero__statement lead" data-reveal="up">
          Sistemas a medida e integraciones de IA para los procesos que una
          empresa usa todos los días.
        </p>

        <div class="hero__meta">
          <span class="mono-meta muted">↓ Scroll</span>
          <span class="mono-meta muted">( Knotfix — {{ year }} )</span>
        </div>
      </div>
    </section>

    <!-- ( 01 — SOBRE MÍ ) -->
    <section class="section">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel index="01" text="Sobre Mí" />
        </div>

        <div class="col-7-12 stack" data-reveal="up">
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
          <p class="col-7-12 lead" data-reveal="up">
            Tres proyectos donde el problema real no era el que aparecía en el
            enunciado.
          </p>
        </div>

        <FeaturedProjects :projects="FEATURED_PROJECTS" class="rows" />

        <NuxtLink to="/proyectos" class="cta-link link-underline">
          Ver los cinco proyectos
        </NuxtLink>
      </div>
    </section>

    <!-- ( CTA ) -->
    <section class="section closing">
      <div class="wrap">
        <hr class="rule" data-draw>
        <p class="closing__text" data-reveal="up">
          Estoy abierto a proyectos y a posiciones donde haya algo que
          <NuxtLink to="/contacto" class="link-underline">construir en serio</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* El hero es la única sección a sangre del sitio: el campo de luz llega
   hasta los cuatro bordes y el contenido sigue alineado a la retícula. */
.hero {
  position: relative;
  /* isolation crea el contexto de apilamiento que necesita el z-index
     negativo del campo: sin esto se iría detrás del fondo del body. */
  isolation: isolate;
  overflow: hidden;
}

.hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  /* svh, no vh: en móvil la barra del navegador no debe recortar el nombre. */
  min-height: min(92svh, 60rem);
  padding-block: var(--sp-8) var(--sp-4);
}

/* ---------- Campo de luz ----------------------------------- */

.hero__field {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* Se disuelve contra el papel arriba y abajo. Sin esto el campo termina
     en un canto recto y el hero se lee como un rectángulo pegado encima
     de la página, no como parte de ella. */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    #000 7%,
    #000 74%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    #000 7%,
    #000 74%,
    transparent 100%
  );
}

.field__tint {
  position: absolute;
  display: block;
  /* vmax mantiene los tintes desbordando la pantalla en cualquier
     proporción: nunca se ve el borde del círculo. */
  width: 68vmax;
  height: 68vmax;
  border-radius: 50%;
  will-change: transform;
}

.field__tint--coffee {
  top: -22vmax;
  right: -14vmax;
  background: radial-gradient(circle closest-side, var(--field-coffee), transparent 100%);
}

.field__tint--sand {
  bottom: -26vmax;
  left: -18vmax;
  background: radial-gradient(circle closest-side, var(--field-sand), transparent 100%);
}

.field__tint--ink {
  top: 18%;
  left: 34%;
  width: 52vmax;
  height: 52vmax;
  background: radial-gradient(circle closest-side, var(--field-ink), transparent 100%);
}

/* Grano: ruido SVG en línea, sin petición de red. Da textura de papel y
   rompe el bandeado que dejan los degradados grandes. */
.field__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
  background-size: 140px 140px;
  /* Muy por debajo de lo que parece razonable: en multiply, el grano suma
     sobre toda la superficie. Por encima de ~0.2 el papel cálido se apaga
     a gris y el hero deja de casar con el resto del sitio. */
  opacity: 0.16;
  mix-blend-mode: multiply;
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
  /* El borde inferior lo pone el propio componente. */
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
