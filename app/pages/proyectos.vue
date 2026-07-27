<script setup lang="ts">
import { PROJECTS } from '~/data/projects'

useHead({
  title: 'Proyectos — Daniel González Picado',
  meta: [
    {
      name: 'description',
      content:
        'Cinco proyectos de desarrollo web y móvil: migración de un sistema de escritorio a la web, una app móvil con mapas, una plataforma de servicios, soporte en producción y WordPress a medida.'
    }
  ]
})
</script>

<template>
  <div>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel index="01" text="Proyectos" />
        </div>
        <h1 class="col-1-8 page-head__title">
          Cinco proyectos, contados por el problema que resolvían.
        </h1>
        <p class="col-1-6 page-head__note muted">
          01 — 0{{ PROJECTS.length }}
        </p>
      </div>
    </section>

    <section class="section projects">
      <div class="wrap">
        <article
          v-for="(project, i) in PROJECTS"
          :key="project.index"
          class="grid project"
          :class="{ 'project--flip': i % 2 === 1 }"
        >
          <div class="project__body">
            <SectionLabel :index="project.index" :text="project.context" />

            <h2 class="project__title">{{ project.title }}</h2>

            <dl class="project__detail">
              <dt class="label">El problema</dt>
              <dd>{{ project.problem }}</dd>

              <dt class="label">Qué hice</dt>
              <dd>{{ project.work }}</dd>

              <dt class="label">Qué quedó</dt>
              <dd>{{ project.result }}</dd>
            </dl>

            <p class="mono-meta muted project__stack">
              {{ project.stack.join(' · ') }}
            </p>
          </div>

          <div class="project__plate">
            <ProjectPlate
              :index="project.index"
              :title="project.title"
              :stack="project.stack"
            />
          </div>
        </article>
      </div>
    </section>

    <section class="section closing">
      <div class="wrap">
        <hr class="rule">
        <p class="closing__text">
          ¿Algo de esto se parece a lo que necesitás?
          <NuxtLink to="/contacto" class="link-underline">Escribime</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
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

.page-head__note {
  margin-top: var(--sp-4);
}

.project {
  align-items: start;
  padding-block: var(--sp-8);
  border-top: var(--hairline);
}

.project:last-of-type {
  border-bottom: var(--hairline);
}

.project__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.project__title {
  font-size: var(--fs-h2);
  font-weight: 300;
}

.project__detail {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  margin: 0;
}

.project__detail dt {
  margin-top: var(--sp-2);
  color: var(--accent);
}

.project__detail dd {
  margin: 0;
}

.project__plate {
  order: -1;
  margin-bottom: var(--sp-4);
}

@media (min-width: 900px) {
  .project__body {
    grid-column: 1 / 7;
  }

  .project__plate {
    order: 0;
    grid-column: 8 / 13;
    margin-bottom: 0;
    /* Acompaña al texto largo sin repetir scroll. */
    position: sticky;
    top: 8rem;
  }

  .project--flip .project__body {
    grid-column: 7 / 13;
  }

  .project--flip .project__plate {
    grid-column: 1 / 6;
    grid-row: 1;
  }
}

.closing {
  padding-bottom: var(--sp-16);
}

.closing__text {
  max-width: 26ch;
  margin-top: var(--sp-6);
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-snug);
  letter-spacing: -0.02em;
}
</style>
