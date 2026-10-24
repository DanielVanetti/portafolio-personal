<script setup lang="ts">
import { gsap } from 'gsap'
import type { Lesson } from '~/data/lessons'

/**
 * Tarjeta de un principio de motion: un escenario claro con una demo en
 * tinta y café y, debajo, la explicación.
 *
 * La demo se reproduce al pasar el cursor, al enfocar con teclado o al
 * tocar/pulsar (que la fija hasta el siguiente toque). El texto está siempre
 * visible: la demo es un refuerzo, no la única fuente de información.
 */
const { t, path } = useLocale()

const props = withDefaults(
  defineProps<{
    lesson: Lesson
    // 'stage' deja solo el escenario, para la página del principio.
    variant?: 'card' | 'stage'
  }>(),
  { variant: 'card' }
)

const stageRef = ref<HTMLElement | null>(null)
const hovering = ref(false)
const focused = ref(false)
const pinned = ref(false)

const playing = computed(() => hovering.value || focused.value || pinned.value)
// El vaivén automático del parallax solo tiene sentido sin cursor que lo guíe.
const swaying = computed(() => pinned.value && !hovering.value)

const onEnter = (event: PointerEvent) => {
  if (event.pointerType === 'mouse') hovering.value = true
}

const onLeave = () => {
  hovering.value = false
  stageRef.value?.style.setProperty('--mx', '0')
  stageRef.value?.style.setProperty('--my', '0')
}

// Parallax guiado por el cursor: -1 a 1 en cada eje.
const onMove = (event: PointerEvent) => {
  if (props.lesson.kind !== 'parallax' || event.pointerType !== 'mouse') return
  const stage = stageRef.value
  if (!stage) return
  const rect = stage.getBoundingClientRect()
  stage.style.setProperty('--mx', String(((event.clientX - rect.left) / rect.width - 0.5) * 2))
  stage.style.setProperty('--my', String(((event.clientY - rect.top) / rect.height - 0.5) * 2))
}

// --- Value Change: el contador cuenta desde cero cada vez ---
const TARGET = 1284
const counter = ref(TARGET)
let counterTween: gsap.core.Tween | undefined

watch(playing, on => {
  if (!on || props.lesson.kind !== 'value' || prefersReducedMotion()) return
  const state = { v: 0 }
  counterTween?.kill()
  counter.value = 0
  counterTween = gsap.to(state, {
    v: TARGET,
    duration: 1.4,
    ease: 'power3.out',
    onUpdate: () => {
      counter.value = Math.round(state.v)
    }
  })
})

onUnmounted(() => counterTween?.kill())

const formatted = computed(() => String(counter.value).replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
</script>

<template>
  <article
    class="tile"
    :data-kind="lesson.kind"
    :data-playing="playing"
    :data-sway="swaying"
    :data-variant="variant"
  >
    <button
      ref="stageRef"
      type="button"
      class="stage"
      :aria-pressed="pinned"
      @pointerenter="onEnter"
      @pointerleave="onLeave"
      @pointermove="onMove"
      @focus="focused = true"
      @blur="focused = false"
      @click="pinned = !pinned"
    >
      <span class="scene" aria-hidden="true">
        <!-- Easing: lo lineal contra la salida suave -->
        <template v-if="lesson.kind === 'easing'">
          <span class="easing">
            <span class="easing__lane">
              <span class="easing__tag">linear</span>
              <span class="easing__dot easing__dot--linear"></span>
            </span>
            <span class="easing__lane">
              <span class="easing__tag">ease-out</span>
              <span class="easing__dot easing__dot--out"></span>
            </span>
          </span>
        </template>

        <!-- Offset & Delay: barras que arrancan escalonadas -->
        <template v-else-if="lesson.kind === 'offset'">
          <span class="offset">
            <span v-for="n in 5" :key="n" class="offset__bar" :style="{ '--i': n - 1 }"></span>
          </span>
        </template>

        <!-- Parenting: el hijo orbita porque hereda la rotación del padre -->
        <template v-else-if="lesson.kind === 'parenting'">
          <span class="parent">
            <span class="parent__core"></span>
            <span class="parent__child"></span>
          </span>
        </template>

        <!-- Transformation: una forma que se vuelve otra -->
        <template v-else-if="lesson.kind === 'transformation'">
          <span class="morph"></span>
        </template>

        <!-- Value Change: un número que cuenta -->
        <template v-else-if="lesson.kind === 'value'">
          <span class="value">
            <span class="value__num">{{ formatted }}</span>
            <span class="value__bar">
              <span class="value__fill" :style="{ transform: `scaleX(${counter / TARGET})` }"></span>
            </span>
          </span>
        </template>

        <!-- Masking: el relleno aparece a través de una máscara -->
        <template v-else-if="lesson.kind === 'masking'">
          <span class="mask">
            <span class="mask__base">Detalle</span>
            <span class="mask__fill">Detalle</span>
          </span>
        </template>

        <!-- Overlay: una hoja sube sobre el contenido y lo atenúa -->
        <template v-else-if="lesson.kind === 'overlay'">
          <span class="overlay">
            <span class="overlay__line"></span>
            <span class="overlay__line overlay__line--short"></span>
            <span class="overlay__line"></span>
            <span class="overlay__scrim"></span>
            <span class="overlay__sheet">
              <span class="overlay__handle"></span>
              <span class="overlay__line overlay__line--dark"></span>
              <span class="overlay__line overlay__line--dark overlay__line--short"></span>
            </span>
          </span>
        </template>

        <!-- Cloning: el original deja copias en su camino -->
        <template v-else-if="lesson.kind === 'cloning'">
          <span class="clone">
            <span v-for="n in 3" :key="n" class="clone__dot" :style="{ '--i': n }"></span>
            <span class="clone__dot clone__dot--origin"></span>
          </span>
        </template>

        <!-- Obscuration: una cortina descubre las formas -->
        <template v-else-if="lesson.kind === 'obscuration'">
          <span class="obscure">
            <span class="obscure__shape obscure__shape--circle"></span>
            <span class="obscure__shape obscure__shape--square"></span>
            <span class="obscure__shape obscure__shape--bar"></span>
            <span class="obscure__panel"></span>
          </span>
        </template>

        <!-- Parallax: tres capas a distinta velocidad -->
        <template v-else-if="lesson.kind === 'parallax'">
          <span class="para">
            <span class="para__layer" style="--k: 8"><span class="para__far"></span></span>
            <span class="para__layer" style="--k: 20"><span class="para__mid"></span></span>
            <span class="para__layer" style="--k: 40"><span class="para__near"></span></span>
          </span>
        </template>

        <!-- Dimensionality: capas que se separan en profundidad -->
        <template v-else-if="lesson.kind === 'dimensionality'">
          <span class="dim">
            <span class="dim__layer dim__layer--back"></span>
            <span class="dim__layer dim__layer--mid"></span>
            <span class="dim__layer dim__layer--front"></span>
          </span>
        </template>

        <!-- Dolly & Zoom: el fondo crece, el sujeto no cambia -->
        <template v-else-if="lesson.kind === 'dolly'">
          <span class="dolly">
            <span v-for="n in 5" :key="n" class="dolly__ring" :style="{ '--i': n }"></span>
            <span class="dolly__subject"></span>
          </span>
        </template>
      </span>

      <!-- El nombre accesible sale de este texto oculto; la pista visible
           cambia con el estado y por eso queda fuera del árbol. -->
      <span class="sr-only">{{ t.details.demo(lesson.name) }}</span>
      <!-- Indicador de estado: reproducir / en marcha. Solo forma, sin texto. -->
      <span class="stage__play" aria-hidden="true">
        <svg v-if="!playing" viewBox="0 0 16 16"><path d="M5.5 3.8v8.4L12 8z" fill="currentColor" /></svg>
        <svg v-else viewBox="0 0 16 16"><path d="M5 4h2v8H5zM9 4h2v8H9z" fill="currentColor" /></svg>
      </span>
    </button>

    <div v-if="variant === 'card'" class="body">
      <!-- h2: en Detalles son el primer nivel bajo el h1 de la página. -->
      <h2 class="body__name">{{ lesson.name }}</h2>
      <p class="body__text muted">{{ lesson.text }}</p>
      <NuxtLink :to="path('details', lesson.slug)" class="body__more">
        {{ t.details.more }}<span class="sr-only">: {{ lesson.name }}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
.tile {
  --fg: var(--ink);
  --ac: var(--coffee);
  --dim: #A8A29A;
  --line: var(--gray-300);
  --paper: #FFFFFF;
  --ease-io: cubic-bezier(0.65, 0, 0.35, 1);

  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

/* ---------- Escenario ---------------------------------------- */

.stage {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  padding: 0;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: var(--bg-soft);
  color: var(--fg);
  transition: border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
  font: inherit;
  text-align: left;
  cursor: pointer;
  /* Que el scroll vertical siga funcionando al arrastrar el dedo encima. */
  touch-action: pan-y;
}

.scene {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.stage:hover,
.stage[aria-pressed='true'] {
  border-color: var(--gray-300);
  background: #ECE8E2;
}

/* Arriba a la derecha y con fondo propio: algunas demos (Dolly & Zoom)
   crecen hasta las esquinas y sin esto le pasarían por encima. */
.stage__play {
  position: absolute;
  top: var(--sp-2);
  right: var(--sp-2);
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--paper);
  color: var(--fg);
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.stage__play svg {
  width: 0.85rem;
  height: 0.85rem;
}

[data-playing='true'] .stage__play {
  border-color: var(--ac);
  background: var(--ac);
  color: var(--paper);
}

/* ---------- Texto -------------------------------------------- */

.body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding-inline: 0.25rem;
}

.body__name {
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.03em;
}

.body__text {
  font-size: var(--fs-sm);
}

.body__more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  min-height: 44px;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--accent);
}

.body__more svg {
  width: 0.9rem;
  height: 0.9rem;
  transition: transform var(--dur-fast) var(--ease-out);
}

.body__more:hover svg {
  transform: translateX(3px);
}

/* En su propia página la demo manda: más ancha y más baja, y la escena crece
   en proporción. Se maqueta a 1/z del tamaño y se escala z veces desde la
   esquina, así los anchos en % siguen cabiendo y nada se recorta. */
.tile[data-variant='stage'] .stage {
  aspect-ratio: 16 / 9;
}

.tile[data-variant='stage'] .scene {
  --z: 1.8;
  inset: auto;
  top: 0;
  left: 0;
  width: calc(100% / var(--z));
  height: calc(100% / var(--z));
  transform: scale(var(--z));
  transform-origin: top left;
}

@media (max-width: 899px) {
  .tile[data-variant='stage'] .scene {
    --z: 1.2;
  }
}

/* ---------- 01 Easing ---------------------------------------- */

.easing {
  display: grid;
  gap: 2.25rem;
  width: 78%;
}

.easing__lane {
  position: relative;
  height: 1.25rem;
  border-bottom: 1px solid var(--line);
}

.easing__tag {
  position: absolute;
  left: 0;
  top: -1.4rem;
  font-size: var(--fs-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--gray-600);
}

.easing__dot {
  position: absolute;
  left: 0;
  bottom: -0.35rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  transition: left 1.4s;
}

.easing__dot--linear {
  background: var(--dim);
  transition-timing-function: linear;
}

.easing__dot--out {
  background: var(--ac);
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

[data-playing='true'] .easing__dot {
  left: calc(100% - 1.25rem);
}

/* ---------- 02 Offset & Delay -------------------------------- */

.offset {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 52%;
}

.offset__bar {
  width: 1.75rem;
  height: 100%;
  background: var(--fg);
  transform: scaleY(0.28);
  transform-origin: bottom;
  transition: transform 0.7s var(--ease-out) calc(var(--i) * 90ms);
}

.offset__bar:first-child {
  background: var(--ac);
}

[data-playing='true'] .offset__bar {
  transform: scaleY(1);
}

/* ---------- 03 Parenting ------------------------------------- */

.parent {
  position: relative;
  width: 6rem;
  height: 6rem;
  border: 1px solid var(--dim);
  transition: transform 1.4s var(--ease-io);
}

.parent__core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  margin: -0.25rem 0 0 -0.25rem;
  border-radius: 50%;
  background: var(--fg);
}

.parent__child {
  position: absolute;
  top: -0.65rem;
  right: -0.65rem;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  background: var(--ac);
}

[data-playing='true'] .parent {
  transform: translateX(-1.5rem) rotate(180deg);
}

/* ---------- 04 Transformation -------------------------------- */

.morph {
  width: 7rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--ac);
  transition:
    width 0.9s var(--ease-io),
    height 0.9s var(--ease-io),
    border-radius 0.9s var(--ease-io),
    transform 0.9s var(--ease-io),
    background-color 0.9s var(--ease-io);
}

[data-playing='true'] .morph {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.5rem;
  background: var(--fg);
  transform: rotate(90deg);
}

/* ---------- 05 Value Change ---------------------------------- */

.value {
  display: grid;
  gap: 1rem;
  width: 70%;
}

.value__num {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.value__bar {
  height: 2px;
  background: var(--line);
}

.value__fill {
  display: block;
  height: 100%;
  background: var(--ac);
  transform-origin: left;
}

/* ---------- 06 Masking --------------------------------------- */

.mask {
  position: relative;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.mask__base {
  color: transparent;
  /* Más claro que --dim: en reposo es lo único que hay en la tarjeta. */
  -webkit-text-stroke: 1px #8A827A;
}

.mask__fill {
  position: absolute;
  inset: 0;
  color: var(--fg);
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1s var(--ease-io);
}

[data-playing='true'] .mask__fill {
  clip-path: inset(0 0 0 0);
}

/* ---------- 07 Overlay --------------------------------------- */

.overlay {
  position: relative;
  display: grid;
  align-content: start;
  gap: 0.6rem;
  width: 74%;
  height: 72%;
  padding: 0.9rem;
  overflow: hidden;
  border: 1px solid var(--dim);
}

.overlay__line {
  display: block;
  height: 0.5rem;
  background: var(--dim);
}

.overlay__line--short {
  width: 55%;
}

.overlay__line--dark {
  background: var(--gray-300);
}

.overlay__scrim {
  position: absolute;
  inset: 0;
  background: var(--ink);
  opacity: 0;
  transition: opacity 0.5s var(--ease-out);
}

.overlay__sheet {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  gap: 0.6rem;
  padding: 0.75rem 0.9rem 1rem;
  border-top: 1px solid var(--line);
  background: var(--paper);
  transform: translateY(100%);
  transition: transform 0.8s var(--ease-out);
}

.overlay__handle {
  justify-self: center;
  width: 2rem;
  height: 3px;
  background: var(--dim);
}

[data-playing='true'] .overlay__scrim {
  opacity: 0.22;
}

[data-playing='true'] .overlay__sheet {
  transform: translateY(0);
}

/* ---------- 08 Cloning --------------------------------------- */

.clone {
  position: relative;
  width: 3rem;
  height: 3rem;
  transition: transform 0.9s var(--ease-out);
}

.clone__dot {
  position: absolute;
  inset: 0;
  border: 1px solid var(--fg);
  border-radius: 50%;
  opacity: 0;
  transition:
    transform 0.9s var(--ease-out) calc(var(--i) * 70ms),
    opacity 0.4s var(--ease-out) calc(var(--i) * 70ms);
}

.clone__dot--origin {
  border: 0;
  background: var(--ac);
  opacity: 1;
}

[data-playing='true'] .clone {
  transform: translateX(-5.1rem);
}

[data-playing='true'] .clone__dot:not(.clone__dot--origin) {
  opacity: 1;
  transform: translateX(calc(var(--i) * 3.4rem));
}

/* ---------- 09 Obscuration ----------------------------------- */

.obscure {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 78%;
  height: 56%;
  overflow: hidden;
}

.obscure__shape {
  display: block;
  background: var(--fg);
}

.obscure__shape--circle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--ac);
}

.obscure__shape--square {
  width: 3.5rem;
  height: 3.5rem;
}

.obscure__shape--bar {
  width: 1.5rem;
  height: 4.5rem;
  background: var(--dim);
}

.obscure__panel {
  position: absolute;
  inset: 0;
  border-top: 1px solid var(--line);
  background: #E4DFD8;
  transform: translateY(52%);
  transition: transform 0.9s var(--ease-io);
}

[data-playing='true'] .obscure__panel {
  transform: translateY(104%);
}

/* ---------- 10 Parallax -------------------------------------- */

.para {
  position: relative;
  width: 100%;
  height: 100%;
}

.para__layer {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transform: translate(calc(var(--mx, 0) * var(--k) * 1px), calc(var(--my, 0) * var(--k) * 0.6px));
  transition: transform 0.3s ease-out;
}

.para__far {
  width: 9rem;
  height: 9rem;
  border: 1px solid var(--line);
  border-radius: 50%;
}

.para__mid {
  width: 5.5rem;
  height: 5.5rem;
  border: 1px solid var(--dim);
  border-radius: 50%;
}

.para__near {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--ac);
}

/* En táctil no hay cursor que guíe las capas: se mecen solas. */
[data-sway='true'] .para__layer {
  animation: sway 2.4s var(--ease-io) infinite alternate;
}

@keyframes sway {
  from { transform: translateX(calc(var(--k) * -1px)); }
  to { transform: translateX(calc(var(--k) * 1px)); }
}

/* ---------- 11 Dimensionality -------------------------------- */

.dim {
  position: relative;
  width: 6rem;
  height: 6rem;
}

.dim__layer {
  position: absolute;
  inset: 0;
  border: 1px solid var(--dim);
  transition: transform 0.9s var(--ease-out);
}

.dim__layer--back {
  background: #E4DFD8;
  transform: translate(-0.6rem, 0.6rem);
}

.dim__layer--mid {
  background: #D3CDC5;
  transform: translate(-0.3rem, 0.3rem);
}

.dim__layer--front {
  border-color: var(--fg);
  background: var(--fg);
}

[data-playing='true'] .dim__layer--back {
  transform: translate(-2.4rem, 2.4rem);
}

[data-playing='true'] .dim__layer--mid {
  transform: translate(-1.2rem, 1.2rem);
}

[data-playing='true'] .dim__layer--front {
  transform: translate(0.7rem, -0.7rem);
  background: var(--ac);
  border-color: var(--ac);
}

/* ---------- 12 Dolly & Zoom ---------------------------------- */

.dolly {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.dolly__ring {
  position: absolute;
  width: 5rem;
  height: 5rem;
  border: 1px solid var(--dim);
  transform: scale(calc(0.25 + var(--i) * 0.55));
  transition: transform 1.3s var(--ease-out);
}

[data-playing='true'] .dolly__ring {
  transform: scale(calc(0.6 + var(--i) * 0.95));
}

.dolly__subject {
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  background: var(--ac);
}
</style>
