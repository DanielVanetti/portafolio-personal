<script setup lang="ts">
import { SITE } from '~/data/site'

/**
 * Cabecera fija. Solo enlaza secciones de la landing: Detalles tiene su
 * propia banda dentro de la página y su enlace en el pie, para que la
 * navegación se lea como la de una sola página.
 *
 * En escritorio, una píldora se desliza bajo el enlace que está bajo el
 * cursor (y descansa en el de la sección visible). En móvil los enlaces viven
 * en un menú a pantalla completa. Al bajar de la portada gana un fondo
 * translúcido para no pelear con el contenido de debajo.
 */
const { t, locale, otherLocale, path, section, switchTo } = useLocale()
const route = useRoute()

const items = computed(() => [
  { id: 'about', label: t.value.nav.about, to: section('about') },
  { id: 'work', label: t.value.nav.work, to: section('work') },
  { id: 'contact', label: t.value.nav.contact, to: section('contact') }
])

const onHome = computed(() => route.path === path('home'))

// --- Sección visible ---
const current = ref<string | null>(null)
let sectionObserver: IntersectionObserver | undefined

const watchSections = () => {
  sectionObserver?.disconnect()
  current.value = null
  if (!onHome.value) return
  nextTick(() => {
    sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) current.value = entry.target.id
      }
    }, { rootMargin: '-45% 0px -50% 0px' })
    for (const id of ['about', 'stack', 'work', 'contact']) {
      const el = document.getElementById(id)
      if (el) sectionObserver.observe(el)
    }
  })
}

const activeId = computed(() => {
  if (current.value === 'stack') return 'about'
  return current.value
})

// --- Píldora ---
const listRef = ref<HTMLElement | null>(null)
const pill = reactive({ x: 0, w: 0, visible: false })

const placePill = (el: Element | null | undefined) => {
  if (!el || !listRef.value) {
    pill.visible = false
    return
  }
  const box = (el as HTMLElement).getBoundingClientRect()
  const parent = listRef.value.getBoundingClientRect()
  pill.x = box.left - parent.left
  pill.w = box.width
  pill.visible = true
}

const restPill = () => {
  placePill(listRef.value?.querySelector('.is-active'))
}

watch(activeId, () => nextTick(restPill))

// --- Fondo al bajar ---
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 24
}

// --- Menú móvil ---
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)

const closeMenu = (restoreFocus = false) => {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) menuButton.value?.focus()
}

const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu(true)
}

watch(menuOpen, open => {
  document.documentElement.classList.toggle('menu-open', open)
})

watch(() => route.fullPath, () => {
  closeMenu()
  watchSections()
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', restPill)
  watchSections()
  nextTick(restPill)
})

onUnmounted(() => {
  sectionObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', restPill)
  document.documentElement.classList.remove('menu-open')
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled || !onHome, 'is-menu': menuOpen }">
    <div class="wrap site-header__inner">
      <NuxtLink :to="path('home')" class="brand">
        <span class="brand__mark" aria-hidden="true">D</span>
        <span class="brand__name">{{ SITE.shortName }}</span>
        <span class="sr-only"> — {{ t.a11y.home }}</span>
      </NuxtLink>

      <nav class="nav" :aria-label="t.a11y.mainNav">
        <div ref="listRef" class="nav__track" @pointerleave="restPill">
          <ul class="nav__list" role="list">
            <li v-for="item in items" :key="item.id">
              <NuxtLink
                :to="item.to"
                class="nav__link"
                :class="{ 'is-active': activeId === item.id }"
                :aria-current="activeId === item.id ? 'location' : undefined"
                @pointerenter="placePill($event.currentTarget as Element)"
                @focus="placePill($event.currentTarget as Element)"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
          <span
            class="nav__pill"
            :class="{ 'is-visible': pill.visible }"
            :style="{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }"
            aria-hidden="true"
          ></span>
        </div>
      </nav>

      <div class="site-header__tools">
        <!-- El nombre accesible es la frase oculta: "ES / EN" no dice qué hace. -->
        <NuxtLink :to="switchTo" class="lang" :hreflang="otherLocale">
          <span class="sr-only">{{ t.a11y.switchLang }}</span>
          <span aria-hidden="true" :class="{ 'is-on': locale === 'es' }">ES</span>
          <span class="lang__sep" aria-hidden="true">/</span>
          <span aria-hidden="true" :class="{ 'is-on': locale === 'en' }">EN</span>
        </NuxtLink>

        <button
          ref="menuButton"
          type="button"
          class="menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span></span>
          <span class="menu-btn__label">{{ menuOpen ? t.a11y.close : t.a11y.menu }}</span>
        </button>
      </div>
    </div>

    <div id="mobile-menu" class="mobile-menu" :class="{ 'is-open': menuOpen }" :inert="!menuOpen ? true : undefined">
      <ul class="mobile-menu__list" role="list">
        <li v-for="(item, i) in items" :key="item.id" :style="{ '--i': i }">
          <NuxtLink :to="item.to" class="mobile-menu__link" @click="closeMenu()">
            <span class="mobile-menu__index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition: background-color 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
}

.site-header.is-scrolled {
  border-bottom-color: var(--rule);
  background: rgba(250, 249, 246, 0.82);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
  backdrop-filter: saturate(1.4) blur(14px);
}

.site-header__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-height: 4.5rem;
}

/* ── Marca ──────────────────────────────────────────────── */

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 44px;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color var(--dur-fast) var(--ease-out), transform 0.5s var(--ease-out);
}

.brand:hover .brand__mark {
  background: var(--coffee);
  transform: rotate(-12deg);
}

.brand__name {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
}

/* ── Navegación de escritorio ───────────────────────────── */

.nav {
  display: none;
}

.nav__track {
  position: relative;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  background: rgba(250, 249, 246, 0.6);
}

.nav__list {
  display: flex;
  gap: 0.25rem;
  margin: 0;
  padding: 0.25rem;
}

.nav__link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 1rem;
  border-radius: var(--radius-pill);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-600);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__link:hover,
.nav__link.is-active {
  color: var(--ink);
}

.nav__pill {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0;
  border-radius: var(--radius-pill);
  background: var(--bg-soft);
  box-shadow: inset 0 0 0 1px var(--gray-300);
  opacity: 0;
  transition:
    transform 0.45s var(--ease-out),
    width 0.45s var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

.nav__pill.is-visible {
  opacity: 1;
}

/* ── Herramientas: idioma y menú ────────────────────────── */

.site-header__tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 44px;
  padding: 0 0.9rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--gray-600);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.lang:hover {
  border-color: var(--ink);
}

.lang .is-on {
  color: var(--ink);
}

.lang__sep {
  color: var(--gray-300);
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 1rem;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--ink);
  color: var(--bg);
  font: inherit;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.menu-btn__bars {
  position: relative;
  display: block;
  width: 0.9rem;
  height: 0.5rem;
}

.menu-btn__bars span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transition: transform 0.4s var(--ease-out);
}

.menu-btn__bars span:first-child { top: 0; }
.menu-btn__bars span:last-child { bottom: 0; }

.is-menu .menu-btn__bars span:first-child {
  transform: translateY(0.25rem) rotate(45deg);
}

.is-menu .menu-btn__bars span:last-child {
  transform: translateY(-0.25rem) rotate(-45deg);
}

/* ── Menú móvil ─────────────────────────────────────────── */

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  padding: 6rem var(--gutter) var(--sp-8);
  background: var(--bg);
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  transition: clip-path 0.6s var(--ease-out), visibility 0s linear 0.6s;
}

.mobile-menu.is-open {
  clip-path: inset(0 0 0 0);
  visibility: visible;
  transition: clip-path 0.6s var(--ease-out), visibility 0s;
}

.mobile-menu__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  width: 100%;
  margin: 0;
  padding: 0;
}

.mobile-menu__list li {
  border-top: var(--hairline);
  opacity: 0;
  transform: translateY(1.5rem);
  transition: opacity 0.4s var(--ease-out), transform 0.6s var(--ease-out);
}

.mobile-menu.is-open .mobile-menu__list li {
  opacity: 1;
  transform: none;
  transition-delay: calc(0.15s + var(--i) * 0.06s);
}

.mobile-menu__link {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  padding-block: var(--sp-2);
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 11vw, 4rem);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.mobile-menu__index {
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: var(--ls-label);
  color: var(--accent);
}

@media (min-width: 900px) {
  .nav {
    display: block;
  }

  .menu-btn,
  .mobile-menu {
    display: none;
  }
}

/* En pantallas muy estrechas el nombre se oculta solo a la vista: sigue
   siendo el nombre accesible del enlace. */
@media (max-width: 420px) {
  .brand__name {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}
</style>
