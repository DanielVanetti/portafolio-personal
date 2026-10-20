<script setup lang="ts">
import { SITE } from '~/data/site'

useHead({
  title: 'Sobre Mí — Daniel González Picado',
  meta: [
    {
      name: 'description',
      content:
        'Ingeniero en Sistemas de Información por la UNA y estudiante de la Licenciatura en Desarrollo Web. Experiencia en migraciones de sistemas, desarrollo web y móvil, y soporte de aplicaciones en producción.'
    }
  ]
})

useReveal()

const education = [
  {
    period: 'En curso',
    title: 'Licenciatura en Desarrollo Web',
    place: 'Universidad Nacional'
  },
  {
    period: '2025',
    title: 'Ingeniería en Sistemas de Información — Grado',
    place: 'Universidad Nacional'
  },
  {
    period: '2024',
    title: 'Diplomado en Programación de Aplicaciones Informáticas',
    place: 'Universidad Nacional'
  }
]

const principles = [
  {
    index: '01',
    title: 'Entender antes de tocar',
    text: 'Un sistema en producción hace cosas que nadie documentó. Averiguar cuáles son es parte del trabajo, no un paso previo.'
  },
  {
    index: '02',
    title: 'Los datos primero',
    text: 'Una interfaz mal resuelta se corrige el lunes. Un dato mal migrado se descubre tres meses después, y ya no hay vuelta atrás.'
  },
  {
    index: '03',
    title: 'Escribir lo que se aprende',
    text: 'La documentación que sale de un proyecto suele sobrevivir al proyecto. En más de un caso fue lo más valioso que quedó.'
  }
]
</script>

<template>
  <div>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel index="01" text="Sobre Mí" />
        </div>
        <h1 class="col-full page-head__title" data-reveal="lines">
          Ingeniero en sistemas, desarrollador web por oficio.
        </h1>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid">
        <div class="col-2-6 bio" data-reveal="up">
          <p class="lead">
            Vivo en {{ SITE.location }} y llevo un par de años trabajando en
            proyectos que ya tenían usuarios antes de que yo llegara.
          </p>
          <p>
            Estudié Ingeniería en Sistemas de Información en la Universidad
            Nacional y ahora curso la Licenciatura en Desarrollo Web en la misma
            institución. En paralelo he trabajado en migraciones de sistemas de
            escritorio a la web, en aplicaciones móviles, y en el mantenimiento de
            aplicaciones empresariales que ya estaban en producción.
          </p>
          <p>
            Ese último trabajo fue el que más me formó. Cuando el error que estás
            corrigiendo le está impidiendo trabajar a alguien en este momento,
            aprendés rápido a leer código que no escribiste, a reproducir un
            fallo a partir de un reporte incompleto y a calcular qué más puede
            romperse con tu cambio.
          </p>
          <p>
            Trabajo con metodologías ágiles, principalmente SCRUM, y me muevo
            entre frontend y backend según lo que el proyecto necesite.
          </p>
        </div>

        <aside class="col-8-12 aside">
          <SectionLabel text="Formación" />
          <ol class="timeline" role="list">
            <li v-for="item in education" :key="item.title" class="timeline__item">
              <span class="mono-meta timeline__period">{{ item.period }}</span>
              <span class="timeline__title">{{ item.title }}</span>
              <span class="mono-meta muted">{{ item.place }}</span>
            </li>
          </ol>
        </aside>
      </div>
    </section>

    <section class="section invert principles">
      <div class="wrap">
        <SectionLabel index="02" text="Cómo Trabajo" />
        <div class="principles__grid">
          <article v-for="p in principles" :key="p.index" class="principle" data-reveal="up">
            <span class="principle__index label__index mono-meta">{{ p.index }}</span>
            <h2 class="principle__title">{{ p.title }}</h2>
            <p class="muted">{{ p.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section closing">
      <div class="wrap">
        <hr class="rule">
        <p class="closing__text" data-reveal="up">
          El trabajo está en
          <NuxtLink to="/proyectos" class="closing__link link-underline">Proyectos.</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bio {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.aside {
  margin-top: var(--sp-8);
}

.timeline {
  display: flex;
  flex-direction: column;
  margin: var(--sp-3) 0 0;
  padding: 0;
  list-style: none;
}

.timeline__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: var(--sp-2);
  border-top: var(--hairline);
}

.timeline__period {
  color: var(--accent);
}

.timeline__title {
  font-family: var(--font-display);
  font-size: var(--fs-body);
  font-weight: 300;
  line-height: var(--lh-snug);
}

.principles__grid {
  display: grid;
  gap: var(--sp-6);
  margin-top: var(--sp-8);
}

.principle {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding-top: var(--sp-2);
  border-top: var(--hairline);
}

.principle__title {
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

/* El número de cada principio, grande y en serif: ancla la columna. */
.principle__index {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: none;
}

@media (min-width: 900px) {
  .aside {
    margin-top: 0;
  }

  .principles__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-4);
  }
}
</style>
