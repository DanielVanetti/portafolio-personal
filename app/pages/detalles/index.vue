<script setup lang="ts">
import { MOTION_LESSONS, PRACTICES } from '~/data/lessons'

useHead({
  title: 'Detalles — Daniel González Picado',
  meta: [
    {
      name: 'description',
      content:
        'Doce principios de motion y seis buenas prácticas de usabilidad, explicados con demos interactivas. Las cosas que me gusta implementar para que un producto sea fácil de usar.'
    }
  ]
})

useReveal()

type Timer = ReturnType<typeof setTimeout>
const timers: Timer[] = []
const later = (fn: () => void, ms: number) => {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}
onUnmounted(() => timers.forEach(clearTimeout))

const practice = (index: string) => PRACTICES.find(p => p.index === index)!

/* ---------- 01 Áreas táctiles --------------------------------- */

const showHit = ref(false)
const taps = reactive({ small: 0, large: 0 })

/* ---------- 02 Feedback inmediato ----------------------------- */

type SaveState = 'idle' | 'loading' | 'done'
const saveState = ref<SaveState>('idle')
const withFeedback = ref(true)

const save = () => {
  if (saveState.value !== 'idle') return
  saveState.value = 'loading'
  later(() => {
    saveState.value = 'done'
    later(() => {
      saveState.value = 'idle'
    }, 1600)
  }, 1100)
}

const saveLabel = computed(() => {
  if (!withFeedback.value) return saveState.value === 'done' ? 'Guardado' : 'Guardar cambios'
  if (saveState.value === 'loading') return 'Guardando…'
  if (saveState.value === 'done') return 'Guardado ✓'
  return 'Guardar cambios'
})

/* ---------- 03 Contraste -------------------------------------- */

const lin = (c: number) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = (r: number, g: number, b: number) =>
  0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

// Luminancia del fondo del panel (--bg: #FAF9F6).
const BG_LUMINANCE = luminance(250, 249, 246)

// Arranca aprobando (≈5:1): la página no debe fallar su propia regla. Al
// bajar el control se ve el momento exacto en que deja de leerse.
const level = ref(55)
const grey = computed(() => Math.round(214 - (214 - 20) * (level.value / 100)))
const ratio = computed(() => {
  const l = luminance(grey.value, grey.value, grey.value)
  return (BG_LUMINANCE + 0.05) / (l + 0.05)
})
const ratioText = computed(() => `${ratio.value.toFixed(1).replace('.', ',')} : 1`)
const passes = computed(() => ratio.value >= 4.5)

/* ---------- 04 Foco visible ----------------------------------- */

const removeFocus = ref(false)

/* ---------- 05 Errores que ayudan ----------------------------- */

const helpful = ref(true)
const email = ref('daniel.gmail.com')

const emailError = computed(() => {
  const value = email.value.trim()
  if (!value) return ''
  if (!helpful.value) {
    return /^\S+@\S+\.\S+$/.test(value) ? '' : 'Error 400: entrada inválida.'
  }
  if (!value.includes('@')) return 'Falta el @. Un correo se ve así: nombre@correo.com'
  if (!/@[^@\s]+\.[^@\s]+$/.test(value)) return 'Falta el dominio después del @, por ejemplo: .com'
  return ''
})

/* ---------- 06 Deshacer --------------------------------------- */

const INITIAL_DOCS = ['Factura de marzo', 'Factura de abril', 'Factura de mayo']
const docs = ref<string[]>([...INITIAL_DOCS])
const removed = ref<{ name: string, at: number } | null>(null)
let undoTimer: Timer | undefined

const removeDoc = (index: number) => {
  const name = docs.value[index]
  if (name === undefined) return
  docs.value.splice(index, 1)
  removed.value = { name, at: index }
  clearTimeout(undoTimer)
  undoTimer = later(() => {
    removed.value = null
  }, 5000)
}

const undoRemove = () => {
  if (!removed.value) return
  docs.value.splice(removed.value.at, 0, removed.value.name)
  removed.value = null
  clearTimeout(undoTimer)
}

const restoreDocs = () => {
  docs.value = [...INITIAL_DOCS]
  removed.value = null
}
</script>

<template>
  <div>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel text="Detalles" />
        </div>
        <h1 class="col-full page-head__title" data-reveal="lines">
          Cosas que me gusta implementar.
        </h1>
        <p class="col-2-8 lead page-head__intro" data-reveal="up">
          El movimiento y los pequeños detalles deciden si un producto se siente
          confiable o torpe. Esto es lo que busco en cada interfaz: que sea fácil
          de usar y que se note que alguien la cuidó.
        </p>
      </div>
    </section>

    <!-- ( 01 — MOVIMIENTO ) -->
    <section class="section">
      <div class="wrap">
        <div class="grid section__head">
          <div class="col-1-6">
            <SectionLabel index="01" text="Movimiento" />
          </div>
          <p class="col-7-12 lead" data-reveal="up">
            Doce principios de animación. Pasá el cursor sobre cada tarjeta, o
            tocala, para verla en acción.
          </p>
        </div>

        <div class="tiles">
          <MotionTile
            v-for="(lesson, i) in MOTION_LESSONS"
            :key="lesson.kind"
            :lesson="lesson"
            :index="String(i + 1).padStart(2, '0')"
          />
        </div>
      </div>
    </section>

    <!-- ( 02 — BUENAS PRÁCTICAS ) — franja invertida -->
    <section class="section invert practices">
      <div class="wrap">
        <div class="grid section__head">
          <div class="col-1-6">
            <SectionLabel index="02" text="Buenas Prácticas" />
          </div>
          <p class="col-7-12 lead" data-reveal="up">
            Detalles que casi nadie nota cuando están bien hechos, y que todos
            notan cuando faltan. Son los que vuelven un producto fácil de usar y,
            por eso, valioso.
          </p>
        </div>

        <!-- 01 · Áreas táctiles -->
        <PracticeBlock v-bind="practice('01')">
          <label class="switch">
            <input v-model="showHit" type="checkbox">
            <span>Mostrar la zona pulsable</span>
          </label>

          <div class="taps">
            <div class="taps__col">
              <p class="mono-meta muted">24 px — el mínimo</p>
              <div class="taps__row">
                <button
                  v-for="n in 4"
                  :key="n"
                  type="button"
                  class="tap tap--small"
                  :class="{ 'is-shown': showHit }"
                  aria-label="Objetivo táctil pequeño"
                  @click="taps.small++"
                >+</button>
              </div>
              <p class="mono-meta muted">Pulsaciones: {{ taps.small }}</p>
            </div>

            <div class="taps__col">
              <p class="mono-meta muted">44 px — cómodo</p>
              <div class="taps__row">
                <button
                  v-for="n in 4"
                  :key="n"
                  type="button"
                  class="tap tap--large"
                  :class="{ 'is-shown': showHit }"
                  aria-label="Objetivo táctil de 44 píxeles"
                  @click="taps.large++"
                >+</button>
              </div>
              <p class="mono-meta muted">Pulsaciones: {{ taps.large }}</p>
            </div>
          </div>
        </PracticeBlock>

        <!-- 02 · Feedback inmediato -->
        <PracticeBlock v-bind="practice('02')">
          <div class="seg" role="group" aria-label="Tipo de botón">
            <button type="button" class="seg__btn" :aria-pressed="!withFeedback" @click="withFeedback = false">
              Sin feedback
            </button>
            <button type="button" class="seg__btn" :aria-pressed="withFeedback" @click="withFeedback = true">
              Con feedback
            </button>
          </div>

          <button
            type="button"
            class="btn btn--save"
            :class="{
              'is-loading': withFeedback && saveState === 'loading',
              'is-done': withFeedback && saveState === 'done'
            }"
            :aria-busy="saveState === 'loading'"
            @click="save"
          >
            <span v-if="withFeedback && saveState === 'loading'" class="btn__dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
            {{ saveLabel }}
          </button>

          <p class="mono-meta muted" role="status">
            {{ withFeedback
              ? 'Cada paso se ve: pulsado, guardando, listo.'
              : 'Pulsá y esperá: durante un segundo no pasa nada visible.' }}
          </p>
        </PracticeBlock>

        <!-- 03 · Contraste -->
        <PracticeBlock v-bind="practice('03')">
          <label class="field">
            <span class="label">Color del texto</span>
            <input
              v-model.number="level"
              type="range"
              min="0"
              max="100"
              class="range"
              :aria-valuetext="`Contraste ${ratioText}`"
            >
          </label>

          <p
            class="contrast-sample"
            :style="{ color: `rgb(${grey}, ${grey}, ${grey})` }"
          >
            Entregamos el viernes. Si algo no queda claro en esta frase, el
            problema es del contraste y no de tu vista.
          </p>

          <p class="mono-meta muted">Mové el control hacia la izquierda y mirá cuándo deja de leerse.</p>

          <p class="verdict" :class="passes ? 'is-pass' : 'is-fail'" role="status">
            <span class="verdict__ratio">{{ ratioText }}</span>
            <span class="mono-meta">{{ passes ? 'Cumple AA' : 'No cumple AA (mínimo 4,5 : 1)' }}</span>
          </p>
        </PracticeBlock>

        <!-- 04 · Foco visible -->
        <PracticeBlock v-bind="practice('04')">
          <label class="switch">
            <input v-model="removeFocus" type="checkbox">
            <span>Quitar el contorno de foco (mal ejemplo)</span>
          </label>

          <div class="focus-demo" :class="{ 'is-bad': removeFocus }">
            <button type="button" class="btn">Anterior</button>
            <button type="button" class="btn">Siguiente</button>
            <button type="button" class="btn btn--solid">Enviar</button>
          </div>

          <p class="mono-meta muted">
            Usá la tecla Tab para recorrerlos. {{ removeFocus
              ? 'Ahora no hay forma de saber dónde estás.'
              : 'El contorno te dice siempre dónde estás.' }}
          </p>
        </PracticeBlock>

        <!-- 05 · Errores que ayudan -->
        <PracticeBlock v-bind="practice('05')">
          <div class="seg" role="group" aria-label="Tipo de mensaje">
            <button type="button" class="seg__btn" :aria-pressed="!helpful" @click="helpful = false">
              Mensaje genérico
            </button>
            <button type="button" class="seg__btn" :aria-pressed="helpful" @click="helpful = true">
              Mensaje útil
            </button>
          </div>

          <label class="field">
            <span class="label">Correo electrónico</span>
            <input
              v-model="email"
              type="text"
              inputmode="email"
              autocomplete="off"
              class="input"
              :class="{ 'is-invalid': emailError }"
              :aria-invalid="emailError ? 'true' : 'false'"
              aria-describedby="email-msg"
            >
          </label>

          <p id="email-msg" class="msg" :class="{ 'is-error': emailError }" role="status">
            {{ emailError || 'Se ve bien.' }}
          </p>
        </PracticeBlock>

        <!-- 06 · Deshacer -->
        <PracticeBlock v-bind="practice('06')">
          <ul class="docs" role="list">
            <li v-for="(doc, i) in docs" :key="doc" class="docs__item">
              <span>{{ doc }}</span>
              <button type="button" class="docs__del" @click="removeDoc(i)">
                Eliminar<span class="sr-only"> {{ doc }}</span>
              </button>
            </li>
            <li v-if="!docs.length" class="docs__empty">
              <span class="muted">No queda nada.</span>
              <button type="button" class="docs__del" @click="restoreDocs">Restaurar lista</button>
            </li>
          </ul>

          <p class="toast" :class="{ 'is-visible': removed }" role="status" aria-live="polite">
            <template v-if="removed">
              <span>Eliminaste «{{ removed.name }}».</span>
              <button type="button" class="toast__undo" @click="undoRemove">Deshacer</button>
            </template>
            <span v-else class="muted">Eliminá algo: no te va a preguntar si estás seguro.</span>
          </p>
        </PracticeBlock>
      </div>
    </section>

    <!-- ( CTA ) -->
    <section class="section closing">
      <div class="wrap">
        <hr class="rule" data-draw>
        <p class="closing__text" data-reveal="up">
          ¿Tu producto tiene alguno de estos detalles por resolver?
          <NuxtLink to="/contacto" class="closing__link link-underline">Hablemos.</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head__intro {
  margin-top: var(--sp-6);
}

.section__head {
  margin-bottom: var(--sp-8);
}

.tiles {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-8) var(--sp-4);
}

@media (min-width: 700px) {
  .tiles {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .tiles {
    grid-template-columns: repeat(3, 1fr);
  }
}

.practices .section__head {
  margin-bottom: var(--sp-4);
}

.practices {
  padding-bottom: var(--sp-8);
}

/* ---------- Controles compartidos de las demos ------------------ */

.switch {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  min-height: 44px;
  font-size: var(--fs-sm);
  cursor: pointer;
}

.switch input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--coffee);
}

.seg {
  display: inline-flex;
  align-self: flex-start;
  border: 1px solid var(--text);
}

.seg__btn {
  min-height: 44px;
  padding: 0 var(--sp-2);
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.seg__btn[aria-pressed='true'] {
  background: var(--text);
  color: var(--surface);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-1);
  min-height: 44px;
  padding: 0 var(--sp-3);
  border: 1px solid var(--text);
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  cursor: pointer;
}

.btn--solid {
  background: var(--text);
  color: var(--surface);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

/* ---------- 01 Áreas táctiles ----------------------------------- */

.taps {
  display: grid;
  gap: var(--sp-3);
}

.taps__col {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.taps__row {
  display: flex;
  gap: 2px;
}

.tap {
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px dashed transparent;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}

/* Los dos tamaños son a propósito: el pequeño es el mínimo de WCAG 2.2
   (24 px), que se puede usar pero cuesta; 44 px es lo cómodo. */
.tap--small {
  width: 1.5rem;
  height: 1.5rem;
}

.tap--large {
  width: 2.75rem;
  height: 2.75rem;
}

.tap.is-shown {
  border-color: var(--accent);
  background: rgba(111, 78, 55, 0.12);
}

.tap:active {
  background: rgba(111, 78, 55, 0.3);
}

@media (min-width: 600px) {
  .taps {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ---------- 02 Feedback ----------------------------------------- */

.btn--save {
  align-self: flex-start;
  min-width: 13rem;
  transition:
    transform 0.15s var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.btn--save:active {
  transform: scale(0.97);
}

.btn--save.is-loading {
  background: var(--gray-300);
  border-color: var(--gray-300);
}

.btn--save.is-done {
  background: var(--coffee);
  border-color: var(--coffee);
  color: var(--bg);
}

.btn__dots {
  display: inline-flex;
  gap: 3px;
}

.btn__dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text);
  animation: dot 0.9s ease-in-out infinite;
}

.btn__dots span:nth-child(2) { animation-delay: 0.15s; }
.btn__dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot {
  0%, 80%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
}

/* ---------- 03 Contraste ---------------------------------------- */

.range {
  width: 100%;
  min-height: 44px;
  accent-color: var(--coffee);
}

.contrast-sample {
  font-family: var(--font-display);
  font-size: var(--fs-lead);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--sp-2);
  padding-top: var(--sp-2);
  border-top: var(--hairline);
}

.verdict__ratio {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.verdict.is-pass .verdict__ratio {
  color: var(--coffee);
}

/* ---------- 04 Foco --------------------------------------------- */

.focus-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.focus-demo.is-bad button:focus-visible {
  outline: none;
}

/* ---------- 05 Errores ------------------------------------------ */

.input {
  min-height: 44px;
  padding: 0 var(--sp-2);
  border: 1px solid var(--text);
  border-radius: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--fs-body);
}

.input.is-invalid {
  border-color: var(--coffee);
  border-width: 2px;
}

.msg {
  min-height: 3rem;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.msg.is-error {
  color: var(--coffee);
}

/* ---------- 06 Deshacer ----------------------------------------- */

.docs {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs__item,
.docs__empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-height: 3.5rem;
  border-top: var(--hairline);
}

.docs__del,
.toast__undo {
  min-height: 44px;
  padding: 0 var(--sp-1);
  border: 0;
  background: transparent;
  color: var(--coffee);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  cursor: pointer;
}

.toast {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-height: 3.5rem;
  padding: 0 var(--sp-2);
  background: var(--bg-dark);
  color: var(--ink-dark);
  font-size: var(--fs-sm);
  transition: opacity var(--dur-fast) var(--ease-out);
}

.toast:not(.is-visible) {
  background: transparent;
  padding: 0;
  color: var(--text-muted);
}

.toast__undo {
  color: var(--coffee-soft);
}
</style>
