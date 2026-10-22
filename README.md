# Portafolio personal — Tarea 1

**Estudiante:** Daniel González Picado
**Curso:** Arquitectura de Información — Escuela de Informática, Universidad Nacional
**Proyecto:** Sitio web personal estático construido con Nuxt 4

---

## Sitio publicado

**URL:** <https://danielgonzalezportafolio.netlify.app/>

El sitio es bilingüe: español en la raíz e inglés bajo `/en`. Todas las rutas
funcionan con acceso directo y con recarga (F5), porque el sitio se genera de
forma estática y cada ruta tiene su propio `index.html`:

| Español | Inglés | Página |
|---|---|---|
| `/` | `/en` | Landing: hero, sobre mí, stack, proyectos y contacto |
| `/detalles` | `/en/details` | Detalles — principios de motion y prácticas de usabilidad, con demos |
| `/detalles/<slug>` | `/en/details/<slug>` | Un principio de motion (ruta dinámica, 12 páginas por idioma) |

> **Cambios posteriores a la entrega original:**
> - El Blog (`/blog` y `/blog/<slug>`) se sustituyó por Detalles y su ruta
>   dinámica. `/blog` redirige a `/detalles` (ver `netlify.toml`).
> - Sobre Mí, Proyectos y Contacto dejaron de ser páginas separadas: ahora son
>   secciones de la landing. `/sobre-mi`, `/proyectos` y `/contacto` redirigen
>   a su sección (`/#about`, `/#work`, `/#contact`).

---

## Cumplimiento de los requisitos

| # | Requisito | Dónde se comprueba |
|---|---|---|
| 1 | Proyecto creado con `nuxi init` | `package.json` (dependencia `nuxt`), estructura `app/` y `nuxt.config.ts` generados por la plantilla `minimal` |
| 2 | Páginas Inicio, Sobre Mí, Proyectos, Contacto y Blog | **Ya no se cumple al pie de la letra.** Sobre Mí, Proyectos y Contacto son secciones de `app/components/LandingView.vue` (sus rutas antiguas redirigen a ellas) y el Blog se sustituyó por Detalles. La ruta dinámica sigue en `app/pages/detalles/[slug].vue` |
| 3 | Navegación con `<NuxtLink>` | `app/components/AppHeader.vue` y `AppFooter.vue`. No existe ningún `<a href="/...">` interno en todo `app/` |
| 4 | `layouts/default.vue` con header y footer compartidos | `app/layouts/default.vue` — se aplica a todas las rutas y fija el idioma del documento y los enlaces `hreflang` |
| 5 | `useHead` con título y meta descripción por página | Cada vista (`LandingView`, `DetailsView`, `LessonView`) los define por idioma; en los principios se derivan del contenido. Los 28 pares título/descripción son únicos |
| 6 | Publicado en Netlify | Ver URL arriba. Configuración en `netlify.toml` |
| 7 | Entrega sin librerías de Node | El paquete no incluye `node_modules` ni artefactos de build |

---

## Estructura del proyecto

```
app/
├── app.vue              NuxtLayout + NuxtPage
├── layouts/default.vue  Header y footer compartidos; idioma y hreflang
├── pages/               index, detalles/index, detalles/[slug] y sus gemelas
│                        en/index, en/details/index, en/details/[slug]:
│                        envoltorios finos de las vistas
├── components/
│   ├── LandingView, DetailsView, LessonView     las vistas, una por tipo de página
│   ├── AppHeader, AppFooter, SectionLabel, ThePreloader, ScrollProgress
│   ├── HeroWordmark, ShatterLetter, DotField    el hero
│   ├── MagneticButton, SpotlightCard, ScrambleText,
│   │   ScrollRevealText, NumberTicker            efectos de la landing
│   ├── StackGrid, ProjectsAccordion, ProjectPlate
│   └── MotionTile, PracticeBlock                 demos de Detalles
├── composables/         useReveal (animaciones de entrada), useLocale (idioma)
├── utils/locale.ts      rutas por idioma
├── i18n/messages.ts     textos de la interfaz en español e inglés
├── plugins/             gsap.client.ts
├── data/                site.ts, projects.ts y lessons.ts, por idioma
└── assets/css/          tokens.css, base.css
```

---

## Decisiones técnicas

- **Nuxt 4 y la carpeta `app/`.** `nuxi init` genera hoy Nuxt 4, cuyo directorio
  fuente por defecto es `app/`. Por eso `layouts/`, `pages/` y `components/`
  viven dentro de `app/` en lugar de en la raíz. El requisito de tener un
  `layouts/default.vue` compartido se cumple igual.
- **Rutas automáticas.** No hay ningún archivo de rutas: cada `.vue` dentro de
  `app/pages/` se convierte en una ruta por su nombre. `detalles/[slug].vue`
  demuestra el enrutamiento dinámico; sus rutas se prerenderizan desde
  `app/data/lessons.ts` en los dos idiomas.
- **Dos idiomas sin dependencias.** El idioma sale de la ruta (`/en` o no) a
  través de `useLocale`; no hay estado que sincronizar. Las páginas en inglés
  usan las mismas vistas que las de español, y `en` se tipa contra `es` en
  `i18n/messages.ts`: si falta una traducción, no compila.
- **Sin backend.** Proyectos y detalles leen de `app/data/`, así que el sitio
  es 100 % estático.
- **El hero.** Se ve una "D" que se rompe en fragmentos bajo el cursor
  (`ShatterLetter`) seguida del resto de la palabra, que rota entre Daniel,
  Dev y Diseño / Design (`HeroWordmark`). El nombre completo sigue siendo el
  `h1`, oculto visualmente para lectores de pantalla y buscadores. Detrás, una
  rejilla de puntos en canvas reacciona al cursor y al clic (`DotField`).
- **El sitio funciona sin JavaScript.** Las animaciones se apoyan en clases
  que un script en línea añade al `<html>`. Sin ellas nada se oculta: el texto
  se ve entero y los proyectos del acordeón quedan abiertos.
- **`prefers-reduced-motion` respetado.** Con esa preferencia activa no se
  ejecuta el preloader ni ninguna animación de entrada, la palabra del hero se
  queda en "Daniel" y la rejilla de puntos no reacciona.

---

## Resultados de Lighthouse

Medidos con Lighthouse 12 sobre la build estática (`npm run generate`),
después de convertir el sitio en landing bilingüe.

**Escritorio** (preset desktop):

| Ruta | Performance | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 |
| `/en` | 99 | 100 | 100 | 100 |
| `/detalles` | 100 | 100 | 100 | 100 |
| `/en/details` | 99 | 100 | 100 | 100 |
| `/detalles/<slug>` | 100 | 100 | 100 | 100 |
| `/en/details/<slug>` | 99 | 100 | 100 | 100 |

CLS de 0 y TBT de 20 ms o menos en todas las rutas.

**Móvil** (emulación por defecto: 4G lento y CPU ×4): Performance entre 86 y
92, con accesibilidad, buenas prácticas y SEO en 100. El LCP ronda los 3 s,
igual que antes de los rediseños; la landing suma algo de bloqueo (TBT ≈ 260
ms en Inicio) por hidratar los fragmentos de la D y la rejilla de puntos.
