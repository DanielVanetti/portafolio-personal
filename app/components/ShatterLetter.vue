<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Letra de gran tamaño que se rompe en fragmentos bajo el cursor y se
 * recompone al soltarla.
 *
 * Cómo funciona: la letra se dibuja una vez como texto normal (la "base") y
 * otra vez por cada fragmento, recortada con un clip-path triangular. En
 * reposo se ve solo la base, nítida y sin costuras; en cuanto algo se mueve,
 * la base se oculta y los fragmentos —que coinciden exactamente con ella—
 * se separan con un resorte ligeramente amortiguado.
 *
 * Los fragmentos salen de una malla con puntos desplazados por un generador
 * determinista, así el servidor y el cliente producen el mismo marcado.
 * Es decorativo: el nombre real vive en un h1 aparte.
 */
const props = withDefaults(
  defineProps<{
    letter?: string
    cols?: number
    rows?: number
    // Banda vertical de la caja que realmente ocupa el glifo, en %.
    top?: number
    bottom?: number
  }>(),
  { letter: 'D', cols: 5, rows: 6, top: 14, bottom: 92 }
)

interface Shard {
  clip: string
  origin: string
  cx: number
  cy: number
  spin: number
}

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6D2B79F5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const buildShards = (): Shard[] => {
  const rand = mulberry32(11)
  const { cols, rows, top, bottom } = props
  const stepX = 100 / cols
  const stepY = (bottom - top) / rows

  // Malla de (cols+1) x (rows+1) puntos; los del borde no se desplazan,
  // para que la silueta exterior quede intacta.
  const grid: [number, number][][] = []
  for (let r = 0; r <= rows; r++) {
    const row: [number, number][] = []
    for (let c = 0; c <= cols; c++) {
      let x = c * stepX
      let y = top + r * stepY
      if (c > 0 && c < cols && r > 0 && r < rows) {
        x += (rand() - 0.5) * stepX * 0.75
        y += (rand() - 0.5) * stepY * 0.75
      }
      row.push([x, y])
    }
    grid.push(row)
  }

  const shards: Shard[] = []
  const push = (points: [number, number][]) => {
    const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length
    const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length
    shards.push({
      clip: `polygon(${points.map(p => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(', ')})`,
      origin: `${cx.toFixed(2)}% ${cy.toFixed(2)}%`,
      cx,
      cy,
      spin: rand() * 2 - 1
    })
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = grid[r]![c]!
      const b = grid[r]![c + 1]!
      const d = grid[r + 1]![c + 1]!
      const e = grid[r + 1]![c]!
      // Diagonal alternada: la malla no se lee como una cuadrícula.
      if ((r + c) % 2) {
        push([a, b, d])
        push([a, d, e])
      } else {
        push([a, b, e])
        push([b, d, e])
      }
    }
  }
  return shards
}

const shards = buildShards()

const rootRef = ref<HTMLElement | null>(null)
const broken = ref(false)

let els: HTMLElement[] = []
let enabled = false
let running = false
let inside = false
let strength = 1
let burstTimer: ReturnType<typeof setTimeout> | undefined

const count = shards.length
const px = new Float32Array(count)
const py = new Float32Array(count)
const pr = new Float32Array(count)
const vx = new Float32Array(count)
const vy = new Float32Array(count)
const vr = new Float32Array(count)
const tx = new Float32Array(count)
const ty = new Float32Array(count)
const tr = new Float32Array(count)

let box = { left: 0, top: 0, w: 1, h: 1 }

const measure = () => {
  const rect = rootRef.value?.getBoundingClientRect()
  if (rect) box = { left: rect.left, top: rect.top, w: rect.width, h: rect.height }
}

// Constantes del resorte: rigidez baja y poco amortiguamiento dan el rebote
// con el que la letra se vuelve a armar.
const STIFFNESS = 0.09
const DAMPING = 0.78

const tick = () => {
  let moving = false
  let offset = false

  for (let i = 0; i < count; i++) {
    vx[i] = (vx[i]! + (tx[i]! - px[i]!) * STIFFNESS) * DAMPING
    vy[i] = (vy[i]! + (ty[i]! - py[i]!) * STIFFNESS) * DAMPING
    vr[i] = (vr[i]! + (tr[i]! - pr[i]!) * STIFFNESS) * DAMPING
    px[i] = px[i]! + vx[i]!
    py[i] = py[i]! + vy[i]!
    pr[i] = pr[i]! + vr[i]!

    const away = Math.abs(px[i]!) > 0.3 || Math.abs(py[i]!) > 0.3 || Math.abs(pr[i]!) > 0.05
    const live = away
      || Math.abs(vx[i]!) > 0.03 || Math.abs(vy[i]!) > 0.03
      || Math.abs(tx[i]! - px[i]!) > 0.1 || Math.abs(ty[i]! - py[i]!) > 0.1
    if (away) offset = true
    if (live) moving = true

    const el = els[i]
    if (el) {
      el.style.transform = away
        ? `translate3d(${px[i]!.toFixed(2)}px, ${py[i]!.toFixed(2)}px, 0) rotate(${pr[i]!.toFixed(2)}deg)`
        : ''
    }
  }

  if (offset !== broken.value) broken.value = offset

  if (!moving && !inside) {
    gsap.ticker.remove(tick)
    running = false
  }
}

const start = () => {
  if (running) return
  running = true
  gsap.ticker.add(tick)
}

const aim = (clientX: number, clientY: number) => {
  const x = clientX - box.left
  const y = clientY - box.top
  const size = Math.max(box.w, box.h)
  const radius = size * 0.42 * (strength > 1 ? 1.6 : 1)
  const push = size * 0.3 * strength

  for (let i = 0; i < count; i++) {
    const s = shards[i]!
    const dx = (s.cx / 100) * box.w - x
    const dy = (s.cy / 100) * box.h - y
    const dist = Math.hypot(dx, dy) || 1
    const f = dist < radius ? (1 - dist / radius) ** 1.4 : 0
    tx[i] = (dx / dist) * f * push
    ty[i] = (dy / dist) * f * push
    tr[i] = s.spin * f * 28 * strength
  }
}

const release = () => {
  tx.fill(0)
  ty.fill(0)
  tr.fill(0)
}

const onEnter = (event: PointerEvent) => {
  if (!enabled) return
  inside = true
  measure()
  aim(event.clientX, event.clientY)
  start()
}

const onMove = (event: PointerEvent) => {
  if (!enabled) return
  inside = true
  aim(event.clientX, event.clientY)
  start()
}

const onLeave = () => {
  if (!enabled) return
  inside = false
  release()
  start()
}

// Un toque (o clic) dispara una explosión más fuerte que se asienta sola.
const onDown = (event: PointerEvent) => {
  if (!enabled) return
  inside = true
  measure()
  strength = 2.2
  aim(event.clientX, event.clientY)
  start()
  clearTimeout(burstTimer)
  burstTimer = setTimeout(() => {
    strength = 1
    // Con cursor se queda a merced de este; con dedo, se arma de nuevo.
    if (event.pointerType === 'mouse') aim(event.clientX, event.clientY)
    else {
      inside = false
      release()
    }
    start()
  }, 450)
}

onMounted(() => {
  if (prefersReducedMotion()) return
  els = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.shard') ?? [])
  enabled = els.length === count
  window.addEventListener('resize', measure)
})

onUnmounted(() => {
  clearTimeout(burstTimer)
  gsap.ticker.remove(tick)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <span
    ref="rootRef"
    class="shatter"
    :class="{ 'is-broken': broken }"
    aria-hidden="true"
    @pointerenter="onEnter"
    @pointermove="onMove"
    @pointerleave="onLeave"
    @pointercancel="onLeave"
    @pointerdown="onDown"
  >
    <span class="shatter__base">{{ letter }}</span>
    <span class="shatter__shards">
      <span
        v-for="(shard, i) in shards"
        :key="i"
        class="shard"
        :style="{ clipPath: shard.clip, transformOrigin: shard.origin }"
      >{{ letter }}</span>
    </span>
  </span>
</template>

<style scoped>
.shatter {
  position: relative;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  /* El scroll vertical sigue funcionando al arrastrar el dedo encima. */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.shatter__base {
  display: block;
}

.shatter__shards {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.shard {
  position: absolute;
  inset: 0;
  display: block;
  will-change: transform;
}

.is-broken .shatter__base {
  visibility: hidden;
}

.is-broken .shatter__shards {
  visibility: visible;
}
</style>
