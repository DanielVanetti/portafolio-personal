<script setup lang="ts">
import { gsap } from 'gsap'
import type { Project } from '~/data/projects'

/**
 * Lista de proyectos como acordeón: cada fila se abre para contar el
 * problema, qué hice y qué quedó. Abre el primero de entrada.
 *
 * El panel se despliega animando grid-template-rows de 0fr a 1fr: la altura
 * real la calcula el navegador, sin medir nada. Sin JS (sin la clase .js en
 * <html>) todos los paneles quedan abiertos y la lista sigue completa.
 *
 * En escritorio, al pasar sobre una fila cerrada aparece su plate
 * tipográfica siguiendo al cursor.
 */
const props = defineProps<{
  projects: readonly Project[]
  labels: { problem: string, did: string, result: string }
}>()

const open = ref<string | null>(props.projects[0]?.index ?? null)
const mounted = ref(false)
const toggle = (index: string) => {
  open.value = open.value === index ? null : index
}

// --- Plate que sigue al cursor ---
const listRef = ref<HTMLElement | null>(null)
const plateRef = ref<HTMLElement | null>(null)
const active = ref<Project | null>(null)
let plates = false
let moveX: gsap.QuickToFunc | undefined
let moveY: gsap.QuickToFunc | undefined

const show = (project: Project) => {
  if (!plates || open.value === project.index) return hide()
  active.value = project
  gsap.to(plateRef.value, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
}

const hide = () => {
  if (!plates) return
  gsap.to(plateRef.value, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: 'power3.out' })
}

const track = (event: PointerEvent) => {
  if (!plates || !listRef.value) return
  const rect = listRef.value.getBoundingClientRect()
  moveX?.(event.clientX - rect.left)
  moveY?.(event.clientY - rect.top)
}

watch(open, hide)

onMounted(() => {
  mounted.value = true
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const plate = plateRef.value
  if (!plate) return
  plates = true
  gsap.set(plate, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.94 })
  moveX = gsap.quickTo(plate, 'x', { duration: 0.5, ease: 'power3' })
  moveY = gsap.quickTo(plate, 'y', { duration: 0.5, ease: 'power3' })
})

onUnmounted(() => gsap.killTweensOf(plateRef.value))
</script>

<template>
  <div ref="listRef" class="acc" @pointermove="track" @pointerleave="hide">
    <article
      v-for="project in projects"
      :key="project.index"
      class="acc__item"
      :class="{ 'is-open': open === project.index }"
    >
      <h3 class="acc__heading">
        <button
          :id="`work-${project.index}-btn`"
          type="button"
          class="acc__trigger"
          :aria-expanded="open === project.index"
          :aria-controls="`work-${project.index}`"
          @click="toggle(project.index)"
          @pointerenter="show(project)"
          @pointerleave="hide"
        >
          <span class="acc__index">{{ project.index }}</span>
          <span class="acc__title">{{ project.title }}</span>
          <span class="acc__context mono-meta muted">{{ project.context }}</span>
          <span class="acc__icon" aria-hidden="true"></span>
        </button>
      </h3>

      <div
        :id="`work-${project.index}`"
        class="acc__panel"
        role="region"
        :aria-labelledby="`work-${project.index}-btn`"
        :inert="mounted && open !== project.index ? true : undefined"
      >
        <div class="acc__inner">
          <div class="acc__cols">
            <div>
              <p class="label acc__label">{{ labels.problem }}</p>
              <p>{{ project.problem }}</p>
            </div>
            <div>
              <p class="label acc__label">{{ labels.did }}</p>
              <p>{{ project.work }}</p>
            </div>
            <div>
              <p class="label acc__label">{{ labels.result }}</p>
              <p>{{ project.result }}</p>
            </div>
          </div>
          <ul class="acc__stack" role="list">
            <li v-for="tech in project.stack" :key="tech" class="acc__chip">{{ tech }}</li>
          </ul>
        </div>
      </div>
    </article>

    <div ref="plateRef" class="acc__plate" aria-hidden="true">
      <ProjectPlate v-if="active" :index="active.index" :title="active.title" :stack="active.stack" />
    </div>
  </div>
</template>

<style scoped>
.acc {
  position: relative;
  border-bottom: var(--hairline);
}

.acc__item {
  border-top: var(--hairline);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.acc__item:hover,
.acc__item.is-open {
  border-top-color: var(--text);
}

.acc__heading {
  font-size: inherit;
}

.acc__trigger {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  grid-template-areas:
    'index title icon'
    'index context icon';
  align-items: center;
  column-gap: var(--sp-2);
  row-gap: 0.25rem;
  width: 100%;
  padding: var(--sp-4) 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.acc__index {
  grid-area: index;
  align-self: start;
  padding-top: 0.6em;
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.acc__title {
  grid-area: title;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4.5rem);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.04em;
  transition: transform var(--dur-fast) var(--ease-out);
}

.acc__trigger:hover .acc__title {
  transform: translateX(0.5rem);
}

.acc__context {
  grid-area: context;
  /* El botón hereda la serif del h3; la meta va en la sans de las etiquetas. */
  font-family: var(--font-body);
}

/* Más que se vuelve menos: dos barras, la vertical gira hasta acostarse. */
.acc__icon {
  grid-area: icon;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--rule);
  border-radius: 50%;
  transition: border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}

.acc__icon::before,
.acc__icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.9rem;
  height: 1px;
  margin-left: -0.45rem;
  background: currentColor;
  transition: transform 0.45s var(--ease-out);
}

.acc__icon::after {
  transform: rotate(90deg);
}

.is-open .acc__icon {
  border-color: var(--text);
  background: var(--text);
  color: var(--surface);
}

.is-open .acc__icon::after {
  transform: rotate(0deg);
}

.acc__panel {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.6s var(--ease-out);
}

html.js .acc__item:not(.is-open) .acc__panel {
  grid-template-rows: 0fr;
}

.acc__inner {
  min-height: 0;
  overflow: hidden;
}

.acc__cols {
  display: grid;
  gap: var(--sp-3);
  padding: 0 0 var(--sp-3) 0;
}

.acc__cols p:not(.acc__label) {
  font-size: var(--fs-sm);
}

.acc__label {
  margin-bottom: var(--sp-1);
  color: var(--accent);
}

.acc__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0 0 var(--sp-6);
}

.acc__chip {
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  font-size: var(--fs-label);
  letter-spacing: 0.06em;
}

.acc__plate {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: clamp(13rem, 18vw, 18rem);
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
}

.acc__plate :deep(.plate) {
  border-radius: var(--radius);
}

@media (hover: hover) and (pointer: fine) {
  .acc__plate {
    display: block;
  }
}

@media (min-width: 900px) {
  .acc__trigger {
    grid-template-columns: 4rem 1fr auto auto;
    grid-template-areas: 'index title context icon';
    column-gap: var(--sp-4);
  }

  .acc__cols {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-6);
    padding-left: calc(4rem + var(--sp-4));
  }

  .acc__stack {
    padding-left: calc(4rem + var(--sp-4));
  }

  .acc__context {
    text-align: right;
  }
}

@media (prefers-reduced-motion: reduce) {
  .acc__plate {
    display: none;
  }
}
</style>
