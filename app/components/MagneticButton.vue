<script setup lang="ts">
import { gsap } from 'gsap'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Botón-enlace con dos gestos: se deja atraer un poco por el cursor
 * (magnético) y, al pasar por encima, el texto rueda hacia arriba y entra una
 * copia desde abajo.
 *
 * El texto duplicado va oculto a lectores de pantalla, así que el nombre
 * accesible es la etiqueta una sola vez. Sin cursor fino o con
 * reduced-motion queda como un botón normal.
 */
const props = withDefaults(
  defineProps<{
    label: string
    to?: RouteLocationRaw
    href?: string
    variant?: 'solid' | 'ghost'
    arrow?: boolean
  }>(),
  { variant: 'solid', arrow: true, to: undefined, href: undefined }
)

const wrapRef = ref<HTMLElement | null>(null)
let moveX: gsap.QuickToFunc | undefined
let moveY: gsap.QuickToFunc | undefined
let target: HTMLElement | null = null

const STRENGTH = 0.28

const onMove = (event: PointerEvent) => {
  if (!moveX || !moveY || !wrapRef.value) return
  const rect = wrapRef.value.getBoundingClientRect()
  moveX((event.clientX - rect.left - rect.width / 2) * STRENGTH)
  moveY((event.clientY - rect.top - rect.height / 2) * STRENGTH)
}

const onLeave = () => {
  if (!target) return
  gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
}

onMounted(() => {
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  target = wrapRef.value?.firstElementChild as HTMLElement | null
  if (!target) return
  moveX = gsap.quickTo(target, 'x', { duration: 0.4, ease: 'power3' })
  moveY = gsap.quickTo(target, 'y', { duration: 0.4, ease: 'power3' })
})

onUnmounted(() => {
  if (target) gsap.killTweensOf(target)
})

const isExternal = computed(() => !!props.href)
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <span ref="wrapRef" class="mbtn-wrap" @pointermove="onMove" @pointerleave="onLeave">
    <component
      :is="isExternal ? 'a' : NuxtLink"
      :to="isExternal ? undefined : to"
      :href="isExternal ? href : undefined"
      class="mbtn"
      :class="`mbtn--${variant}`"
    >
      <span class="mbtn__roll">
        <span class="mbtn__label">{{ label }}</span>
        <span class="mbtn__label mbtn__label--copy" aria-hidden="true">{{ label }}</span>
      </span>
      <svg v-if="arrow" class="mbtn__icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </component>
  </span>
</template>

<style scoped>
.mbtn-wrap {
  display: inline-block;
  /* Zona de atracción algo mayor que el botón. */
  padding: 0.5rem;
  margin: -0.5rem;
}

.mbtn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding: 0 1.5rem;
  border: 1px solid var(--text);
  border-radius: var(--radius-pill);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  will-change: transform;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.mbtn--solid {
  background: var(--text);
  color: var(--surface);
}

.mbtn--solid:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.mbtn--ghost {
  background: transparent;
  color: var(--text);
}

.mbtn--ghost:hover {
  background: var(--text);
  color: var(--surface);
}

/* Texto que rueda: dos copias apiladas, se ve una por vez. */
.mbtn__roll {
  position: relative;
  display: inline-block;
  overflow: hidden;
  line-height: 1.2;
}

.mbtn__label {
  display: block;
  transition: transform 0.45s var(--ease-out);
}

.mbtn__label--copy {
  position: absolute;
  inset: 100% 0 auto;
}

.mbtn:hover .mbtn__label,
.mbtn:focus-visible .mbtn__label {
  transform: translateY(-100%);
}

.mbtn__icon {
  width: 1rem;
  height: 1rem;
  transition: transform var(--dur-fast) var(--ease-out);
}

.mbtn:hover .mbtn__icon {
  transform: translateX(3px);
}
</style>
