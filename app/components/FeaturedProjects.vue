<script setup lang="ts">
import { gsap } from 'gsap'
import type { Project } from '~/data/projects'

/**
 * Lista de proyectos destacados. En escritorio, pasar el cursor sobre una
 * fila revela su plate tipográfica, que sigue al puntero.
 *
 * El efecto es puramente decorativo: en táctil, con reduced-motion o sin JS
 * la lista se comporta como filas normales y no falta información.
 */
const props = defineProps<{ projects: readonly Project[] }>()

const listRef = ref<HTMLElement | null>(null)
const plateRef = ref<HTMLElement | null>(null)
const active = ref<Project | null>(null)
const enabled = ref(false)

let moveTo: { x?: gsap.QuickToFunc, y?: gsap.QuickToFunc } = {}

const show = (project: Project) => {
  if (!enabled.value) return
  active.value = project
  gsap.to(plateRef.value, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
}

const hide = () => {
  if (!enabled.value) return
  gsap.to(plateRef.value, { autoAlpha: 0, scale: 0.96, duration: 0.3, ease: 'power3.out' })
}

const track = (event: PointerEvent) => {
  if (!enabled.value || !listRef.value) return
  const rect = listRef.value.getBoundingClientRect()
  moveTo.x?.(event.clientX - rect.left)
  moveTo.y?.(event.clientY - rect.top)
}

onMounted(() => {
  if (prefersReducedMotion()) return
  // Sin cursor real el efecto no tiene sentido: en táctil el "hover"
  // se queda pegado tras el toque.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const plate = plateRef.value
  if (!plate) return

  active.value = props.projects[0] ?? null
  enabled.value = true

  gsap.set(plate, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.96 })
  moveTo = {
    x: gsap.quickTo(plate, 'x', { duration: 0.5, ease: 'power3' }),
    y: gsap.quickTo(plate, 'y', { duration: 0.5, ease: 'power3' })
  }
})

onUnmounted(() => {
  gsap.killTweensOf(plateRef.value)
})
</script>

<template>
  <div
    ref="listRef"
    class="featured"
    @pointermove="track"
    @pointerleave="hide"
  >
    <div
      v-for="project in projects"
      :key="project.index"
      @pointerenter="show(project)"
    >
      <ProjectRow
        :index="project.index"
        :title="project.title"
        :context="project.context"
        :stack="project.stack"
      />
    </div>

    <div ref="plateRef" class="featured__plate" aria-hidden="true">
      <ProjectPlate
        v-if="active"
        :index="active.index"
        :title="active.title"
        :stack="active.stack"
      />
    </div>
  </div>
</template>

<style scoped>
.featured {
  position: relative;
  border-bottom: var(--hairline);
}

.featured__plate {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: clamp(14rem, 20vw, 20rem);
  pointer-events: none;
  /* GSAP lo hace visible al primer hover; antes de eso no debe verse
     aunque el JS tarde en arrancar. */
  visibility: hidden;
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .featured__plate {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .featured__plate {
    display: none;
  }
}
</style>
