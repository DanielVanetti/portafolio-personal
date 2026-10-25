<script setup lang="ts">
import { SITE, SOCIALS } from '~/data/site'

/**
 * Pie de página. Tres piezas con intención:
 * - un reloj con la hora de Liberia, que dice dónde está quien construye esto;
 * - un botón circular para volver arriba, con el texto girando a su alrededor;
 * - el nombre a escala de fachada, cuyas letras se levantan y se tiñen de café
 *   al pasar el cursor, como un dock.
 * Todo es decorativo o redundante: sin JS o con reduced-motion el pie queda
 * quieto y completo.
 */
const { t, path, section } = useLocale()
const year = new Date().getFullYear()

const nav = computed(() => [
  { label: t.value.nav.about, to: section('about') },
  { label: t.value.nav.work, to: section('work') },
  { label: t.value.nav.details, to: path('details') },
  { label: t.value.nav.contact, to: section('contact') }
])

// --- Reloj de Liberia ---
// Solo en el cliente: la hora del servidor al prerenderizar no sirve de nada.
const time = ref<string | null>(null)
let clock: ReturnType<typeof setInterval> | undefined
const formatter = new Intl.DateTimeFormat('es-CR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Costa_Rica'
})
const tick = () => {
  time.value = formatter.format(new Date())
}

// --- Volver arriba ---
const toTop = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true })
}

// --- Wordmark con letras que se levantan ---
const NAME = 'Daniel González'
const letters = Array.from(NAME)
const markRef = ref<HTMLElement | null>(null)
let spans: HTMLElement[] = []
let pointerX: number | null = null
let frame = 0
let wave = false

const paint = () => {
  frame = 0
  for (const span of spans) {
    let f = 0
    if (pointerX !== null) {
      const box = span.getBoundingClientRect()
      const d = Math.abs(box.left + box.width / 2 - pointerX)
      const k = Math.max(0, 1 - d / 220)
      f = k * k
    }
    span.style.setProperty('--f', f.toFixed(3))
  }
}

const onMarkMove = (event: PointerEvent) => {
  if (!wave || event.pointerType !== 'mouse') return
  pointerX = event.clientX
  if (!frame) frame = requestAnimationFrame(paint)
}

const onMarkLeave = () => {
  if (!wave) return
  pointerX = null
  if (!frame) frame = requestAnimationFrame(paint)
}

onMounted(() => {
  tick()
  clock = setInterval(tick, 15000)
  wave = !prefersReducedMotion()
  spans = Array.from(markRef.value?.querySelectorAll<HTMLElement>('.foot-mark__ch') ?? [])
})

onUnmounted(() => {
  clearInterval(clock)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <footer class="site-footer invert">
    <div class="wrap">
      <div class="foot-top">
        <div class="foot-lead">
          <p class="foot-lead__text">{{ t.footer.lead }}</p>
          <p class="foot-clock">
            <span class="foot-clock__dot" aria-hidden="true"></span>
            <span class="label">{{ t.footer.localTime }}</span>
            <span class="foot-clock__time">
              <template v-if="time">
                {{ time.slice(0, 2) }}<span class="foot-clock__colon" aria-hidden="true">:</span>{{ time.slice(3) }}
              </template>
              <template v-else>--:--</template>
            </span>
            <span class="label">UTC−6</span>
          </p>
        </div>

        <nav class="foot-nav" :aria-label="t.a11y.footerNav">
          <div class="foot-nav__col">
            <p class="label">{{ t.footer.navTitle }}</p>
            <ul role="list">
              <li v-for="item in nav" :key="item.label">
                <NuxtLink :to="item.to" class="foot-link">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="foot-nav__col">
            <p class="label">{{ t.footer.socialTitle }}</p>
            <ul role="list">
              <li v-for="social in SOCIALS" :key="social.href">
                <a :href="social.href" class="foot-link" target="_blank" rel="noopener noreferrer">
                  {{ social.label }}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </li>
              <li>
                <a :href="`mailto:${SITE.email}`" class="foot-link">Email</a>
              </li>
            </ul>
          </div>
        </nav>

        <button type="button" class="foot-top-btn" @click="toTop">
          <span class="sr-only">{{ t.footer.top }}</span>
          <svg class="foot-top-btn__ring" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="foot-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text>
              <textPath href="#foot-ring" textLength="285">{{ t.footer.top }} · {{ t.footer.top }} ·</textPath>
            </text>
          </svg>
          <svg class="foot-top-btn__arrow" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <!-- El nombre a escala de fachada. Decorativo: el nombre real está en el h1. -->
      <p
        ref="markRef"
        class="foot-mark"
        aria-hidden="true"
        @pointermove="onMarkMove"
        @pointerleave="onMarkLeave"
      >
        <span v-for="(ch, i) in letters" :key="i" class="foot-mark__ch" :class="{ 'is-space': ch === ' ' }">{{ ch }}</span>
      </p>

      <div class="foot-bottom">
        <p class="mono-meta muted">© {{ year }} {{ SITE.name }} · {{ t.footer.rights }}</p>
        <p class="mono-meta muted">{{ t.footer.made }} {{ SITE.author }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-block: var(--sp-12) var(--sp-4);
  overflow: hidden;
}

/* ── Arriba: frase y reloj · navegación · volver arriba ─── */

.foot-top {
  display: grid;
  gap: var(--sp-6);
  align-items: start;
  padding-bottom: var(--sp-8);
}

.foot-lead {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.foot-lead__text {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: var(--lh-tight);
  letter-spacing: -0.04em;
}

.foot-clock {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.foot-clock__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--coffee-soft);
}

.foot-clock__time {
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

/* Los dos puntos parpadean como en un reloj de mesa. */
.foot-clock__colon {
  animation: blink 2s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0.2; }
}

.foot-nav {
  display: flex;
  gap: var(--sp-8);
}

.foot-nav__col {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.foot-nav ul {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
}

.foot-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.25rem;
  font-family: var(--font-display);
  font-size: var(--fs-body);
  font-weight: 300;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}

.foot-link svg {
  width: 0.9rem;
  height: 0.9rem;
  color: var(--accent);
}

.foot-link:hover {
  color: var(--accent);
  transform: translateX(4px);
}

/* Botón circular: el texto gira despacio alrededor de la flecha. */
.foot-top-btn {
  position: relative;
  display: grid;
  place-items: center;
  justify-self: start;
  width: 7.5rem;
  height: 7.5rem;
  padding: 0;
  border: 1px solid var(--rule);
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}

.foot-top-btn__ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: currentColor;
  font-family: var(--font-body);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  animation: spin 18s linear infinite;
}

.foot-top-btn__arrow {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.4s var(--ease-out);
}

.foot-top-btn:hover {
  border-color: var(--accent);
  background: var(--dark-soft);
}

.foot-top-btn:hover .foot-top-btn__arrow {
  transform: translateY(-4px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── El nombre ──────────────────────────────────────────── */

.foot-mark {
  display: flex;
  max-width: none;
  margin: 0 0 var(--sp-4);
  padding-top: 0.12em;
  font-family: var(--font-display);
  /* Calibrado para que "Daniel González" quepa en una sola línea. */
  font-size: clamp(2.75rem, 13.2vw, 12.4rem);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.05em;
  white-space: nowrap;
  user-select: none;
  cursor: default;
}

/* --f va de 0 a 1 según la cercanía del cursor (lo pone el script). En
   reposo: gris tenue de 3:1 sobre --bg-dark, el mínimo para texto grande. */
.foot-mark__ch {
  --f: 0;

  display: inline-block;
  color: color-mix(in srgb, var(--coffee-soft) calc(var(--f) * 100%), #67615A);
  transform: translateY(calc(var(--f) * -0.14em));
  transition: transform 0.35s var(--ease-out), color 0.35s var(--ease-out);
}

.foot-mark__ch.is-space {
  width: 0.24em;
}

.foot-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--sp-1);
  padding-top: var(--sp-3);
  /* var(--hairline) se resuelve en :root con la línea clara; aquí hace falta
     la de la sección invertida. */
  border-top: 1px solid var(--rule);
}

@media (min-width: 900px) {
  .foot-top {
    grid-template-columns: 1.4fr 1fr auto;
    gap: var(--sp-8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .foot-top-btn__ring,
  .foot-clock__colon {
    animation: none;
  }
}
</style>
