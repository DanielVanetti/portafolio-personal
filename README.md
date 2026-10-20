# Portafolio personal — Tarea 1

**Estudiante:** Daniel González Picado
**Curso:** Arquitectura de Información — Escuela de Informática, Universidad Nacional
**Proyecto:** Sitio web personal estático construido con Nuxt 4

---

## Sitio publicado

**URL:** <https://danielgonzalezportafolio.netlify.app/>

Todas las rutas funcionan con acceso directo y con recarga (F5), porque el sitio
se genera de forma estática y cada ruta tiene su propio `index.html`:

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/sobre-mi` | Sobre Mí |
| `/proyectos` | Proyectos |
| `/detalles` | Detalles — principios de motion y buenas prácticas, con demos interactivas |
| `/detalles/<slug>` | Página de un principio de motion (ruta dinámica, 12 páginas) |
| `/contacto` | Contacto |

> **Cambio posterior a la entrega original:** el Blog (`/blog` y
> `/blog/<slug>`) se eliminó y se sustituyó por `/detalles` y su ruta dinámica
> `/detalles/<slug>`. Las direcciones antiguas redirigen a la nueva página
> (ver `netlify.toml`).

---

## Cumplimiento de los requisitos

| # | Requisito | Dónde se comprueba |
|---|---|---|
| 1 | Proyecto creado con `nuxi init` | `package.json` (dependencia `nuxt`), estructura `app/` y `nuxt.config.ts` generados por la plantilla `minimal` |
| 2 | Páginas Inicio, Sobre Mí, Proyectos, Contacto y Blog | `app/pages/` — el Blog se sustituyó por `detalles/index.vue`; la ruta dinámica pasó de `blog/[slug].vue` a `app/pages/detalles/[slug].vue` |
| 3 | Navegación con `<NuxtLink>` | `app/components/AppHeader.vue` y `AppFooter.vue`. No existe ningún `<a href="/...">` interno en todo `app/` |
| 4 | `layouts/default.vue` con header y footer compartidos | `app/layouts/default.vue` — se aplica a todas las rutas |
| 5 | `useHead` con título y meta descripción por página | Cada archivo de `app/pages/`; en `detalles/[slug].vue` se derivan del principio. Los 16 pares título/descripción generados son únicos |
| 6 | Publicado en Netlify | Ver URL arriba. Configuración en `netlify.toml` |
| 7 | Entrega sin librerías de Node | El paquete no incluye `node_modules` ni artefactos de build |

---

## Estructura del proyecto

```
app/
├── app.vue              NuxtLayout + NuxtPage
├── layouts/default.vue  Header y footer compartidos por todas las rutas
├── pages/               index, sobre-mi, proyectos, contacto, detalles/index
│                        y detalles/[slug]
├── components/          AppHeader, AppFooter, SectionLabel, MarqueeStrip,
│                        ProjectRow, ProjectPlate, FeaturedProjects,
│                        ThePreloader, ScrollProgress, ShatterLetter,
│                        MotionTile, PracticeBlock
├── composables/         useReveal — animaciones de entrada con GSAP
├── plugins/             gsap.client.ts
├── data/                site.ts, projects.ts, lessons.ts
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
  demuestra el enrutamiento dinámico; sus 12 rutas se prerenderizan desde
  `app/data/lessons.ts`.
- **Sin backend.** Los proyectos leen de `app/data/projects.ts` y la página de
  detalles de `app/data/lessons.ts`, así que el sitio es 100 % estático.
- **La inicial del hero.** Lo que se ve en Inicio es una "D" (`ShatterLetter`)
  que se rompe en fragmentos bajo el cursor. El nombre completo sigue siendo el
  `h1`, oculto visualmente para lectores de pantalla y buscadores.
- **El sitio funciona sin JavaScript.** Las animaciones se apoyan en una clase
  que un script en línea añade al `<html>` solo si hay JS y el usuario no ha
  pedido menos movimiento. Sin esa clase, nada se oculta y todo el contenido
  es legible.
- **`prefers-reduced-motion` respetado.** Con esa preferencia activa no se
  ejecuta el preloader ni ninguna animación de entrada, y el marquee se detiene.

---

## Resultados de Lighthouse

Medidos sobre la build estática (`--preset=desktop`):

| Ruta | Performance | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 |
| `/sobre-mi` | 100 | 100 | 100 | 100 |
| `/proyectos` | 100 | 100 | 100 | 100 |
| `/contacto` | 100 | 100 | 100 | 100 |
| `/detalles` y `/detalles/<slug>` | sin medir | sin medir | sin medir | sin medir |

Las cifras de arriba son anteriores al rediseño tipográfico, a la inicial
interactiva del hero y a la página `/detalles`: conviene volver a medirlas
antes de una nueva entrega.
