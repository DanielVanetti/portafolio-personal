<script setup lang="ts">
import { getLessons, PRACTICES } from '~/data/lessons'

/**
 * Detalles: principios de motion y prácticas de usabilidad, cada uno con una
 * demo. Se usa en /detalles y en /en/details; el idioma sale de la ruta.
 *
 * Las dos partes van en pestañas. Las dos se renderizan siempre (el
 * prerender las indexa y sin JS se ven seguidas); con JS solo se muestra la
 * elegida.
 */
const { t, locale, section } = useLocale()

useHead(() => ({
  title: t.value.meta.detailsTitle,
  meta: [{ name: 'description', content: t.value.meta.detailsDescription }]
}))

useReveal()

const lessons = computed(() => getLessons(locale.value))
const practices = computed(() => PRACTICES[locale.value])
const ui = computed(() => t.value.details.ui)

// --- Pestañas ---
type Tab = 'motion' | 'usability'
const TABS: Tab[] = ['motion', 'usability']
const tab = ref<Tab>('motion')
const tabsReady = ref(false)
const tabRefs = ref<HTMLButtonElement[]>([])

const onTabKey = (event: KeyboardEvent) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const i = TABS.indexOf(tab.value)
  const next = event.key === 'Home' ? 0
    : event.key === 'End' ? TABS.length - 1
      : (i + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
  tab.value = TABS[next]!
  tabRefs.value[next]?.focus()
}

onMounted(() => {
  tabsReady.value = true
})

type Timer = ReturnType<typeof setTimeout>
const timers: Timer[] = []
const later = (fn: () => void, ms: number) => {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}
onUnmounted(() => timers.forEach(clearTimeout))

const practice = (i: number) => ({ index: String(i + 1).padStart(2, '0'), ...practices.value[i]! })

/* ---------- 01 Áreas táctiles --------------------------------- */

const showHit = ref(false)
const taps = reactive({ small: 0, large: 0 })

/* ---------- 02 Respuesta inmediata ---------------------------- */

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
  if (!withFeedback.value) return saveState.value === 'done' ? ui.value.saved : ui.value.save
  if (saveState.value === 'loading') return ui.value.saving
  if (saveState.value === 'done') return `${ui.value.saved} ✓`
  return ui.value.save
})

/* ---------- 03 Contraste -------------------------------------- */

const lin = (c: number) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = (r: number, g: number, b: number) =>
  0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

// El texto de muestra va sobre --bg-soft (#F1EEE9).
const BG_LUMINANCE = luminance(241, 238, 233)

// Arranca aprobando (≈5:1): la página no debe fallar su propia regla. Al
// bajar el control se ve el momento exacto en que deja de leerse.
const level = ref(58)
const grey = computed(() => Math.round(214 - (214 - 20) * (level.value / 100)))
const ratio = computed(() => {
  const l = luminance(grey.value, grey.value, grey.value)
  return (BG_LUMINANCE + 0.05) / (l + 0.05)
})
const passes = computed(() => ratio.value >= 4.5)

/* ---------- 04 Foco visible ----------------------------------- */

const removeFocus = ref(false)

/* ---------- 05 Errores que ayudan ----------------------------- */

const helpful = ref(true)
const email = ref('daniel.gmail.com')

const emailError = computed(() => {
  const value = email.value.trim()
  if (!value) return ''
  if (!helpful.value) return /^\S+@\S+\.\S+$/.test(value) ? '' : ui.value.errGeneric
  if (!value.includes('@')) return ui.value.errAt
  if (!/@[^@\s]+\.[^@\s]+$/.test(value)) return ui.value.errDomain
  return ''
})

/* ---------- 06 Deshacer --------------------------------------- */

const docs = ref<string[]>([...ui.value.docs])
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
  docs.value = [...ui.value.docs]
  removed.value = null
}
</script>

<template>
  <div>
    <section class="section page-head">
      <div class="wrap grid">
        <div class="col-1-6">
          <SectionLabel :text="t.details.label" />
        </div>
        <h1 class="col-full page-head__title" data-reveal="lines">{{ t.details.title }}</h1>
        <p class="col-2-8 lead page-head__intro" data-reveal="up">{{ t.details.intro }}</p>
      </div>
    </section>

    <section class="section body-section">
      <div class="wrap">
        <!-- Pestañas: flechas, Inicio y Fin para moverse con teclado. -->
        <div class="tabs" role="tablist" :aria-label="t.details.label" data-reveal="up" @keydown="onTabKey">
          <button
            v-for="(key, i) in TABS"
            :id="`tab-${key}`"
            :key="key"
            ref="tabRefs"
            type="button"
            role="tab"
            class="tabs__tab"
            :aria-selected="tab === key"
            :aria-controls="`panel-${key}`"
            :tabindex="tab === key ? 0 : -1"
            @click="tab = key"
          >
            {{ t.details.tabs[key] }}
            <span class="tabs__count">{{ key === 'motion' ? lessons.length : practices.length }}</span>
          </button>
          <span class="tabs__pill" :class="`is-${tab}`" aria-hidden="true"></span>
        </div>

        <!-- ── Movimiento ── -->
        <div
          id="panel-motion"
          class="panel"
          role="tabpanel"
          aria-labelledby="tab-motion"
          :hidden="tabsReady && tab !== 'motion' ? true : undefined"
        >
          <p class="panel__intro muted">{{ t.details.motionIntro }}</p>
          <div class="tiles">
            <MotionTile v-for="lesson in lessons" :key="lesson.kind" :lesson="lesson" />
          </div>
        </div>

        <!-- ── Usabilidad ── -->
        <div
          id="panel-usability"
          class="panel"
          role="tabpanel"
          aria-labelledby="tab-usability"
          :hidden="tabsReady && tab !== 'usability' ? true : undefined"
        >
          <p class="panel__intro muted">{{ t.details.usabilityIntro }}</p>

          <!-- 01 · Áreas táctiles -->
          <PracticeBlock v-bind="practice(0)">
            <label class="switch">
              <input v-model="showHit" type="checkbox">
              <span>{{ ui.showHit }}</span>
            </label>

            <div class="taps">
              <div class="taps__col">
                <p class="mono-meta muted">{{ ui.small }}</p>
                <div class="taps__row">
                  <button
                    v-for="n in 4"
                    :key="n"
                    type="button"
                    class="tap tap--small"
                    :class="{ 'is-shown': showHit }"
                    :aria-label="ui.smallTarget"
                    @click="taps.small++"
                  >+</button>
                </div>
                <p class="mono-meta muted">{{ ui.taps }}: {{ taps.small }}</p>
              </div>

              <div class="taps__col">
                <p class="mono-meta muted">{{ ui.large }}</p>
                <div class="taps__row">
                  <button
                    v-for="n in 4"
                    :key="n"
                    type="button"
                    class="tap tap--large"
                    :class="{ 'is-shown': showHit }"
                    :aria-label="ui.largeTarget"
                    @click="taps.large++"
                  >+</button>
                </div>
                <p class="mono-meta muted">{{ ui.taps }}: {{ taps.large }}</p>
              </div>
            </div>
          </PracticeBlock>

          <!-- 02 · Respuesta inmediata -->
          <PracticeBlock v-bind="practice(1)">
            <div class="seg" role="group" :aria-label="ui.buttonKind">
              <button type="button" class="seg__btn" :aria-pressed="!withFeedback" @click="withFeedback = false">{{ ui.noFeedback }}</button>
              <button type="button" class="seg__btn" :aria-pressed="withFeedback" @click="withFeedback = true">{{ ui.withFeedback }}</button>
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

            <p class="mono-meta muted" role="status">{{ withFeedback ? ui.feedbackOn : ui.feedbackOff }}</p>
          </PracticeBlock>

          <!-- 03 · Contraste -->
          <PracticeBlock v-bind="practice(2)">
            <label class="field">
              <span class="label">{{ ui.textColor }}</span>
              <input
                v-model.number="level"
                type="range"
                min="0"
                max="100"
                class="range"
                :aria-valuetext="ui.ratio(ratio)"
              >
            </label>

            <p class="contrast-sample" :style="{ color: `rgb(${grey}, ${grey}, ${grey})` }">{{ ui.sample }}</p>

            <p class="mono-meta muted">{{ ui.contrastHint }}</p>

            <p class="verdict" :class="passes ? 'is-pass' : 'is-fail'" role="status">
              <span class="verdict__ratio">{{ ui.ratio(ratio) }}</span>
              <span class="mono-meta">{{ passes ? ui.passes : ui.fails }}</span>
            </p>
          </PracticeBlock>

          <!-- 04 · Foco visible -->
          <PracticeBlock v-bind="practice(3)">
            <label class="switch">
              <input v-model="removeFocus" type="checkbox">
              <span>{{ ui.removeFocus }}</span>
            </label>

            <div class="focus-demo" :class="{ 'is-bad': removeFocus }">
              <button type="button" class="btn">{{ ui.previous }}</button>
              <button type="button" class="btn">{{ ui.next }}</button>
              <button type="button" class="btn btn--solid">{{ ui.send }}</button>
            </div>

            <p class="mono-meta muted">{{ removeFocus ? ui.focusOff : ui.focusOn }}</p>
          </PracticeBlock>

          <!-- 05 · Errores que ayudan -->
          <PracticeBlock v-bind="practice(4)">
            <div class="seg" role="group" :aria-label="ui.messageKind">
              <button type="button" class="seg__btn" :aria-pressed="!helpful" @click="helpful = false">{{ ui.generic }}</button>
              <button type="button" class="seg__btn" :aria-pressed="helpful" @click="helpful = true">{{ ui.helpful }}</button>
            </div>

            <label class="field">
              <span class="label">{{ ui.emailLabel }}</span>
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

            <p id="email-msg" class="msg" :class="{ 'is-error': emailError }" role="status">{{ emailError || ui.ok }}</p>
          </PracticeBlock>

          <!-- 06 · Deshacer -->
          <PracticeBlock v-bind="practice(5)">
            <ul class="docs" role="list">
              <li v-for="(doc, i) in docs" :key="doc" class="docs__item">
                <span>{{ doc }}</span>
                <button type="button" class="docs__del" @click="removeDoc(i)">
                  {{ ui.remove }}<span class="sr-only"> {{ doc }}</span>
                </button>
              </li>
              <li v-if="!docs.length" class="docs__empty">
                <span class="muted">{{ ui.empty }}</span>
                <button type="button" class="docs__del" @click="restoreDocs">{{ ui.restore }}</button>
              </li>
            </ul>

            <p class="toast" :class="{ 'is-visible': removed }" role="status" aria-live="polite">
              <template v-if="removed">
                <span>{{ ui.removed(removed.name) }}</span>
                <button type="button" class="toast__undo" @click="undoRemove">{{ ui.undo }}</button>
              </template>
              <span v-else class="muted">{{ ui.idle }}</span>
            </p>
          </PracticeBlock>
        </div>
      </div>
    </section>

    <section class="section closing">
      <div class="wrap">
        <hr class="rule" data-draw>
        <p class="closing__text" data-reveal="up">
          {{ t.details.closing }}
          <NuxtLink :to="section('contact')" class="closing__link link-underline">{{ t.details.closingLink }}</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-head__intro {
  margin-top: var(--sp-6);
}

.body-section {
  padding-top: var(--sp-8);
}

/* ---------- Pestañas -------------------------------------------- */

.tabs {
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.3rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  background: var(--bg-soft);
}

.tabs__tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 2.75rem;
  padding: 0 1.4rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--gray-600);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out);
}

.tabs__tab[aria-selected='true'] {
  color: var(--bg);
}

.tabs__count {
  display: grid;
  place-items: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  border-radius: var(--radius-pill);
  background: rgba(20, 19, 17, 0.08);
  font-size: 0.75rem;
  letter-spacing: 0;
}

.tabs__tab[aria-selected='true'] .tabs__count {
  background: rgba(250, 249, 246, 0.18);
}

/* La píldora de fondo se desliza a la pestaña elegida. */
.tabs__pill {
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  left: 0.3rem;
  width: calc(50% - 0.3rem);
  border-radius: var(--radius-pill);
  background: var(--ink);
  transition: transform 0.5s var(--ease-out);
}

.tabs__pill.is-usability {
  transform: translateX(100%);
}

/* ---------- Paneles ---------------------------------------------- */

.panel {
  margin-top: var(--sp-6);
}

.panel:not([hidden]) {
  animation: panel-in 0.6s var(--ease-out);
}

@keyframes panel-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}

.panel__intro {
  max-width: 48ch;
  margin-bottom: var(--sp-6);
  font-size: var(--fs-body);
}

.tiles {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-6) var(--sp-3);
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
  padding: 0.25rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  background: var(--bg);
}

.seg__btn {
  min-height: 2.75rem;
  padding: 0 var(--sp-2);
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--gray-600);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.seg__btn[aria-pressed='true'] {
  background: var(--ink);
  color: var(--bg);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-1);
  min-height: 44px;
  padding: 0 var(--sp-3);
  border: 1px solid var(--ink);
  border-radius: var(--radius-pill);
  background: var(--bg);
  color: var(--ink);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.btn--solid {
  background: var(--ink);
  color: var(--bg);
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
  border-radius: 6px;
  background: transparent;
  color: var(--ink);
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
  border-color: var(--coffee);
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

/* ---------- 02 Respuesta inmediata ------------------------------ */

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
  border-color: var(--gray-300);
  background: var(--gray-300);
}

.btn--save.is-done {
  border-color: var(--coffee);
  background: var(--coffee);
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
  background: var(--ink);
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
  min-height: 48px;
  padding: 0 var(--sp-2);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--ink);
  font: inherit;
  font-size: var(--fs-body);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.input:focus {
  border-color: var(--ink);
}

.input.is-invalid {
  border-color: var(--coffee);
  box-shadow: 0 0 0 3px rgba(111, 78, 55, 0.14);
}

.msg {
  min-height: 3rem;
  font-size: var(--fs-sm);
  color: var(--gray-600);
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
  letter-spacing: 0.06em;
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
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: var(--ink-dark);
  font-size: var(--fs-sm);
}

.toast:not(.is-visible) {
  padding: 0;
  background: transparent;
  color: var(--gray-600);
}

.toast__undo {
  color: var(--coffee-soft);
}
</style>
