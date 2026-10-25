<script setup lang="ts">
import { SITE, SOCIALS } from '~/data/site'
import { PROJECTS } from '~/data/projects'

/**
 * La landing: hero, sobre mí, stack, proyectos, detalles y contacto en una
 * sola página. Se usa tal cual en / (español) y en /en (inglés); el idioma
 * sale de la ruta.
 */
const { t, locale, path, section } = useLocale()

useHead(() => ({
  title: t.value.meta.homeTitle,
  meta: [{ name: 'description', content: t.value.meta.homeDescription }]
}))

useReveal()

const projects = computed(() => PROJECTS[locale.value])

// --- Copiar el correo ---
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(SITE.email)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 2200)
  } catch {
    // Sin permiso de portapapeles el enlace mailto sigue ahí al lado.
  }
}

onUnmounted(() => clearTimeout(copyTimer))
</script>

<template>
  <div>
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="hero">
      <DotField />

      <div class="wrap hero__inner">
        <h1 class="sr-only">{{ t.hero.h1 }}</h1>

        <div class="hero__mark" data-reveal="intro">
          <HeroWordmark :words="t.hero.words" :em="t.hero.wordsEm" />
        </div>

        <div class="hero__foot">
          <p class="hero__statement" data-reveal="intro">{{ t.hero.statement }}</p>

          <div class="hero__side" data-reveal="intro">
            <div class="hero__ctas">
              <MagneticButton :label="t.hero.ctaPrimary" :to="section('work')" />
              <MagneticButton :label="t.hero.ctaSecondary" :to="section('contact')" variant="ghost" :arrow="false" />
            </div>
            <p class="hero__meta mono-meta muted">{{ t.hero.role }} · {{ t.hero.place }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Sobre mí ─────────────────────────────────────────── -->
    <section id="about" class="section about">
      <div class="wrap">
        <SectionLabel index="01" :text="t.about.label" />

        <ScrollRevealText class="about__reveal" :text="t.about.reveal" />

        <ol class="now" role="list">
          <li v-for="(item, i) in t.about.now" :key="item.verb" class="now__item" data-reveal="up">
            <span class="now__index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="now__verb">{{ item.verb }}</span>
            <span class="now__text muted">{{ item.text }}</span>
          </li>
        </ol>

        <div class="about__sub">
          <h2 class="about__subtitle">{{ t.about.principlesTitle }}</h2>
          <div class="principles">
            <SpotlightCard
              v-for="(principle, i) in t.about.principles"
              :key="principle.title"
              tag="article"
              class="principle"
              data-reveal="up"
            >
              <span class="principle__index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="principle__title">{{ principle.title }}</h3>
              <p class="principle__text muted">{{ principle.text }}</p>
            </SpotlightCard>
          </div>
        </div>

        <div class="about__sub grid">
          <h2 class="about__subtitle col-1-6">{{ t.about.educationTitle }}</h2>
          <ol class="timeline col-7-12" role="list">
            <li v-for="item in t.about.education" :key="item.title" class="timeline__item" data-reveal="up">
              <span class="mono-meta timeline__period">{{ item.period }}</span>
              <span class="timeline__title">{{ item.title }}</span>
              <span class="mono-meta muted">{{ item.place }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ── Stack ────────────────────────────────────────────── -->
    <section id="stack" class="section invert stack">
      <div class="wrap">
        <div class="section-head">
          <SectionLabel index="02" :text="t.stack.label" />
          <h2 class="section-head__title" data-reveal="lines">{{ t.stack.title }}</h2>
        </div>
        <StackGrid :groups="t.stack.groups" />
      </div>
    </section>

    <!-- ── Detalles: banda de acceso ───────────────────────── -->
    <section class="band-section" aria-labelledby="band-title">
      <div class="wrap">
        <SpotlightCard class="band" data-reveal="up">
          <div class="band__shapes" aria-hidden="true">
            <span class="band__shape band__shape--circle"></span>
            <span class="band__shape band__shape--square"></span>
            <span class="band__shape band__shape--pill"></span>
          </div>
          <div class="band__copy">
            <h2 id="band-title" class="band__title">{{ t.teaser.title }}</h2>
            <p class="band__text muted">{{ t.teaser.text }}</p>
          </div>
          <MagneticButton :label="t.teaser.cta" :to="path('details')" variant="ghost" class="band__cta" />
        </SpotlightCard>
      </div>
    </section>

    <!-- ── Proyectos ────────────────────────────────────────── -->
    <section id="work" class="section work">
      <div class="wrap">
        <div class="section-head">
          <SectionLabel index="03" :text="t.work.label" />
          <h2 class="section-head__title" data-reveal="lines">{{ t.work.title }}</h2>
        </div>
        <ProjectsAccordion :projects="projects" :labels="t.work" />
      </div>
    </section>

    <!-- ── Contacto ─────────────────────────────────────────── -->
    <section id="contact" class="section contact">
      <div class="wrap">
        <SectionLabel index="04" :text="t.contact.label" />
        <h2 class="contact__title" data-reveal="lines">{{ t.contact.title }}</h2>

        <div class="grid contact__grid">
          <div class="contact__main" data-reveal="up">
            <p class="contact__text">{{ t.contact.text }}</p>
            <div class="contact__email">
              <a :href="`mailto:${SITE.email}`" class="contact__address link-underline">{{ SITE.email }}</a>
              <button type="button" class="copy" :class="{ 'is-done': copied }" @click="copyEmail">
                <svg v-if="!copied" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="5" y="5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3" />
                  <path d="M3 10.5V4a1 1 0 0 1 1-1h6.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
                </svg>
                <svg v-else viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span role="status">{{ copied ? t.contact.copied : t.contact.copy }}</span>
              </button>
            </div>
          </div>

          <div class="contact__side" data-reveal="up">
            <div class="contact__block">
              <p class="label">{{ t.contact.online }}</p>
              <ul class="contact__links" role="list">
                <li v-for="social in SOCIALS" :key="social.href">
                  <a :href="social.href" target="_blank" rel="noopener noreferrer" class="contact__link">
                    {{ social.label }}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div class="contact__block">
              <p class="label">{{ t.contact.whereTitle }}</p>
              <p class="contact__where">{{ t.contact.where }}</p>
              <p class="muted contact__availability">{{ t.contact.availability }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ───────────────────────────────────────────────── */

.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.hero__inner {
  display: flex;
  flex-direction: column;
  min-height: min(calc(100svh - 4.5rem), 62rem);
  padding-block: var(--sp-6) var(--sp-6);
}

.hero__mark {
  margin-block: auto;
  padding-block: var(--sp-6);
  container-type: inline-size;
  --wm-max: clamp(5.25rem, min(26vw, 40svh), 21rem);
}

.hero__foot {
  display: grid;
  gap: var(--sp-4);
  align-items: end;
}

.hero__statement {
  max-width: 24ch;
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.hero__side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

@media (min-width: 900px) {
  .hero__foot {
    grid-template-columns: 1fr auto;
    gap: var(--sp-8);
  }

  .hero__side {
    align-items: flex-end;
  }
}

/* ── Encabezados de sección ─────────────────────────────── */

.section-head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-8);
}

.section-head__title {
  max-width: 18ch;
  font-size: var(--fs-h1);
  line-height: var(--lh-tight);
  letter-spacing: -0.04em;
}

/* ── Sobre mí ───────────────────────────────────────────── */

.about__reveal {
  max-width: 28ch;
  margin-top: var(--sp-6);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.4vw, 4rem);
  font-weight: 300;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

/* Tres verbos en grande: lo que hago ahora, sin párrafos. */
.now {
  display: grid;
  margin: var(--sp-12) 0 0;
  padding: 0;
  list-style: none;
  border-top: var(--hairline);
}

.now__item {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: var(--sp-2);
  row-gap: var(--sp-1);
  align-items: baseline;
  padding-block: var(--sp-4);
  border-bottom: var(--hairline);
}

.now__index {
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.now__verb {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  transition: transform var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.now__text {
  grid-column: 2;
  max-width: 34ch;
  font-size: var(--fs-sm);
}

.now__item:hover .now__verb {
  transform: translateX(0.4rem);
  color: var(--accent);
}

@media (min-width: 900px) {
  .now {
    grid-template-columns: repeat(3, 1fr);
    border-bottom: var(--hairline);
  }

  .now__item {
    padding: var(--sp-6) var(--sp-4) var(--sp-6) 0;
    border-bottom: 0;
  }

  .now__item + .now__item {
    padding-left: var(--sp-4);
    border-left: var(--hairline);
  }
}

.about__sub {
  margin-top: var(--sp-12);
}

.about__subtitle {
  margin-bottom: var(--sp-4);
  font-size: var(--fs-h3);
  letter-spacing: -0.03em;
}

.principles {
  display: grid;
  gap: var(--sp-2);
}

.principle {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding: var(--sp-4);
}

.principle__index {
  font-family: var(--font-display);
  color: var(--accent);
}

.principle__title {
  margin-top: var(--sp-4);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

.principle__text {
  font-size: var(--fs-sm);
}

.timeline {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: var(--sp-3);
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

@media (min-width: 900px) {
  .principles {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ── Detalles: banda de acceso ─────────────────────────── */

.band-section {
  padding-top: var(--sp-8);
}

.band {
  display: grid;
  gap: var(--sp-3);
  align-items: center;
  padding: var(--sp-4);
}

.band__copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.band__title {
  font-size: var(--fs-lead);
  line-height: var(--lh-snug);
  letter-spacing: -0.03em;
}

.band__text {
  font-size: var(--fs-sm);
}

.band__cta {
  justify-self: start;
}

/* Tres formas pequeñas que se reacomodan al pasar el cursor: un adelanto de
   lo que hay en Detalles, sin contarlo con texto. */
.band__shapes {
  position: relative;
  width: 5.5rem;
  height: 3.5rem;
}

.band__shape {
  position: absolute;
  transition: transform 0.7s var(--ease-out), border-radius 0.7s var(--ease-out);
}

.band__shape--circle {
  top: 0.25rem;
  left: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--coffee);
}

.band__shape--square {
  top: 0;
  left: 2.4rem;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 5px;
  background: var(--ink);
}

.band__shape--pill {
  bottom: 0;
  left: 1.6rem;
  width: 3.4rem;
  height: 1rem;
  border: 1px solid var(--ink);
  border-radius: var(--radius-pill);
}

.band:hover .band__shape--circle {
  transform: translate(3.5rem, 1.4rem) scale(0.7);
}

.band:hover .band__shape--square {
  transform: translate(-2.4rem, 1.9rem) rotate(90deg);
  border-radius: 50%;
}

.band:hover .band__shape--pill {
  transform: translate(-1.6rem, -2.5rem);
}

@media (min-width: 900px) {
  .band {
    grid-template-columns: auto 1fr auto;
    gap: var(--sp-4);
    padding: var(--sp-3) var(--sp-4) var(--sp-3) var(--sp-3);
  }

  .band__cta {
    justify-self: end;
  }
}

/* ── Contacto ───────────────────────────────────────────── */

.contact {
  padding-bottom: var(--sp-16);
}

.contact__title {
  margin-top: var(--sp-3);
  font-size: var(--fs-display);
  line-height: var(--lh-tight);
  letter-spacing: -0.05em;
}

.contact__grid {
  margin-top: var(--sp-8);
  row-gap: var(--sp-8);
}

.contact__text {
  max-width: 34ch;
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.contact__email {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-6);
}

.contact__address {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3.4vw, 2.75rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.copy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 1rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.copy:hover {
  border-color: var(--text);
}

.copy.is-done {
  border-color: var(--coffee);
  background: var(--coffee);
  color: var(--bg);
}

.copy svg {
  width: 1rem;
  height: 1rem;
}

.contact__side {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.contact__block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding-top: var(--sp-2);
  border-top: var(--hairline);
}

.contact__links {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.contact__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding-block: 0.4rem;
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  letter-spacing: -0.02em;
}

.contact__link svg {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--accent);
  transition: transform var(--dur-fast) var(--ease-out);
}

.contact__link:hover svg {
  transform: translate(3px, -3px);
}

.contact__where {
  font-family: var(--font-display);
  font-size: var(--fs-body);
}

.contact__availability {
  font-size: var(--fs-sm);
}

@media (min-width: 900px) {
  .contact__main {
    grid-column: 1 / 8;
  }

  .contact__side {
    grid-column: 9 / 13;
  }
}
</style>
