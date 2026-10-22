<script setup lang="ts">
/**
 * Rejilla de puntos del hero, en canvas.
 *
 * Cerca del cursor los puntos crecen, se tiñen de café y se apartan un poco;
 * un clic lanza una onda que recorre la rejilla. Escucha los eventos en el
 * elemento padre (el hero), así el canvas no intercepta nada: los enlaces y
 * la D siguen recibiendo el puntero.
 *
 * Solo dibuja cuando algo cambia: en reposo, un único frame estático. Fuera
 * de pantalla se detiene, y con reduced-motion no escucha nada.
 */
const canvasRef = ref<HTMLCanvasElement | null>(null)

const GAP = 28
const BASE_R = 1.25
const MAX_R = 3.4
const REACH = 170
const PUSH = 7
const WAVE_SPEED = 900 // px por segundo
const WAVE_WIDTH = 70
const WAVE_LIFE = 1.3 // segundos

// Gris cálido algo más oscuro que --gray-300, y --coffee, en RGB, para mezclar sin parsear CSS en cada frame.
const REST = [196, 191, 184]
const HOT = [111, 78, 55]

let ctx: CanvasRenderingContext2D | null = null
let host: HTMLElement | null = null
let width = 0
let height = 0
let dots: { x: number, y: number }[] = []
let pointer = { x: -9999, y: -9999, inside: false }
let waves: { x: number, y: number, t0: number }[] = []
let frame = 0
let visible = true
let resizeObserver: ResizeObserver | undefined
let visibilityObserver: IntersectionObserver | undefined

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas || !host) return
  const rect = host.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

  // Rejilla centrada: el sobrante se reparte a los dos lados.
  const cols = Math.floor(width / GAP)
  const rows = Math.floor(height / GAP)
  const ox = (width - (cols - 1) * GAP) / 2
  const oy = (height - (rows - 1) * GAP) / 2
  dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dots.push({ x: ox + c * GAP, y: oy + r * GAP })
  }
  draw(performance.now())
}

const draw = (now: number) => {
  if (!ctx) return false
  ctx.clearRect(0, 0, width, height)

  waves = waves.filter(w => (now - w.t0) / 1000 < WAVE_LIFE)
  let busy = pointer.inside || waves.length > 0

  // Los puntos en reposo van en un solo path: son casi todos y así se
  // dibujan con un único fill. Los activos se pintan uno a uno.
  ctx.beginPath()
  ctx.fillStyle = `rgb(${REST.join(',')})`
  const hot: { x: number, y: number, f: number }[] = []

  for (const dot of dots) {
    let f = 0
    let dx = 0
    let dy = 0

    if (pointer.inside) {
      const ddx = dot.x - pointer.x
      const ddy = dot.y - pointer.y
      const d = Math.hypot(ddx, ddy)
      if (d < REACH) {
        const k = 1 - d / REACH
        f = k * k
        const n = d || 1
        dx += (ddx / n) * PUSH * f
        dy += (ddy / n) * PUSH * f
      }
    }

    for (const wave of waves) {
      const age = (now - wave.t0) / 1000
      const ddx = dot.x - wave.x
      const ddy = dot.y - wave.y
      const d = Math.hypot(ddx, ddy)
      const band = 1 - Math.abs(d - age * WAVE_SPEED) / WAVE_WIDTH
      if (band > 0) {
        const k = band * (1 - age / WAVE_LIFE)
        f = Math.max(f, k)
        const n = d || 1
        dx += (ddx / n) * PUSH * 1.6 * k
        dy += (ddy / n) * PUSH * 1.6 * k
      }
    }

    if (f < 0.02) {
      ctx.moveTo(dot.x + BASE_R, dot.y)
      ctx.arc(dot.x, dot.y, BASE_R, 0, Math.PI * 2)
    } else {
      hot.push({ x: dot.x + dx, y: dot.y + dy, f })
    }
  }
  ctx.fill()

  for (const dot of hot) {
    const mix = (i: number) => Math.round(REST[i]! + (HOT[i]! - REST[i]!) * Math.min(1, dot.f * 1.4))
    ctx.beginPath()
    ctx.fillStyle = `rgb(${mix(0)},${mix(1)},${mix(2)})`
    ctx.arc(dot.x, dot.y, BASE_R + (MAX_R - BASE_R) * dot.f, 0, Math.PI * 2)
    ctx.fill()
  }

  return busy
}

const loop = (now: number) => {
  frame = 0
  const busy = draw(now)
  if (busy && visible) frame = requestAnimationFrame(loop)
}

const wake = () => {
  if (!frame && visible) frame = requestAnimationFrame(loop)
}

const local = (event: PointerEvent) => {
  const rect = host!.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

const onMove = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return
  pointer = { ...local(event), inside: true }
  wake()
}

const onLeave = () => {
  pointer.inside = false
  wake()
}

const onDown = (event: PointerEvent) => {
  waves.push({ ...local(event), t0: performance.now() })
  if (waves.length > 4) waves.shift()
  wake()
}

onMounted(() => {
  host = canvasRef.value?.parentElement ?? null
  if (!host) return

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  resize()

  if (prefersReducedMotion()) return

  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  host.addEventListener('pointerdown', onDown)

  visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) wake()
  })
  visibilityObserver.observe(host)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  host?.removeEventListener('pointermove', onMove)
  host?.removeEventListener('pointerleave', onLeave)
  host?.removeEventListener('pointerdown', onDown)
})
</script>

<template>
  <canvas ref="canvasRef" class="dot-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.dot-field {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Se disuelve hacia los bordes: la rejilla se lee como textura del papel,
     no como un rectángulo pegado encima. Es una máscara, no un color. */
  -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%);
}
</style>
