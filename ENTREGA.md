# Entrega — Tarea 1

**Estudiante:** Daniel González Picado
**Curso:** Arquitectura de Información — Universidad Nacional
**Proyecto:** Portafolio personal estático con Nuxt

---

## Sitio publicado

> ⚠️ **Pendiente:** sustituir por la URL real después del deploy en Netlify.

**URL:** `https://PENDIENTE.netlify.app`

Todas las rutas funcionan con acceso directo y con recarga (F5), porque el sitio
se genera de forma estática y cada ruta tiene su propio `index.html`:

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/sobre-mi` | Sobre Mí |
| `/proyectos` | Proyectos |
| `/blog` | Blog |
| `/blog/<slug>` | Post individual (ruta dinámica) |
| `/contacto` | Contacto |

---

## Cumplimiento de los requisitos

| # | Requisito | Dónde se comprueba |
|---|---|---|
| 1 | Proyecto creado con `nuxi init` | `package.json` (dependencia `nuxt`), estructura `app/` y `nuxt.config.ts` generados por la plantilla `minimal` |
| 2 | Páginas Inicio, Sobre Mí, Proyectos, Contacto y Blog | `app/pages/` — más la ruta dinámica `app/pages/blog/[slug].vue` |
| 3 | Navegación con `<NuxtLink>` | `app/components/AppHeader.vue` y `AppFooter.vue`. No existe ningún `<a href="/...">` interno en todo `app/` |
| 4 | `layouts/default.vue` con header y footer compartidos | `app/layouts/default.vue` — se aplica a las 6 rutas |
| 5 | `useHead` con título y meta descripción por página | Cada archivo de `app/pages/`; en `blog/[slug].vue` se derivan del post. Los 8 pares título/descripción generados son únicos |
| 6 | Publicado en Netlify | Ver URL arriba. Configuración en `netlify.toml` |
| 7 | Entrega sin `node_modules` | Ver "Cómo se empaquetó" |

---

## Cómo ejecutarlo en local

```bash
npm install
npm run dev       # http://localhost:3000
```

Para reproducir la build de producción:

```bash
npm run generate  # deja el sitio estático en .output/public
npx serve .output/public
```

> **Nota sobre `npm install`:** el proyecto incluye un `.npmrc` con
> `legacy-peer-deps=true`. Es un rodeo a un bug de npm 10.9 (el que trae Node
> 22.12) al resolver las dependencias de pares de Vite. Con npm 11 o superior
> se puede eliminar.

---

## Resultados de Lighthouse

Medido sobre la build estática (`--preset=desktop`):

| Ruta | Performance | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 |
| `/sobre-mi` | 100 | 100 | 100 | 100 |
| `/proyectos` | 100 | 100 | 100 | 100 |
| `/contacto` | 100 | 100 | 100 | 100 |
| `/blog` | 100 | 100 | 100 | 100 |
| `/blog/<slug>` | 99 | 100 | 100 | 100 |

CLS de 0 en las seis rutas.

---

## Decisiones técnicas que vale la pena señalar

- **Nuxt 4 y la carpeta `app/`.** `nuxi init` genera hoy Nuxt 4, cuyo directorio
  fuente por defecto es `app/`. Por eso `layouts/`, `pages/` y `components/`
  viven dentro de `app/` en lugar de en la raíz. El requisito de tener un
  `layouts/default.vue` compartido se cumple igual.
- **Sin backend.** El blog lee de `app/data/posts.ts` y los proyectos de
  `app/data/projects.ts`. La ruta dinámica `[slug]` demuestra el enrutamiento
  automático de Nuxt sin necesidad de un servidor.
- **El sitio funciona sin JavaScript.** Las animaciones se apoyan en una clase
  que un script en línea añade al `<html>` solo si hay JS y el usuario no ha
  pedido menos movimiento. Sin esa clase, nada se oculta y todo el contenido
  es legible.
- **`prefers-reduced-motion` respetado.** Con esa preferencia activa no se
  ejecuta el preloader ni ningún reveal, y el marquee se detiene.

---

## Cómo se empaquetó

```powershell
powershell -ExecutionPolicy Bypass -File scripts/empaquetar.ps1
```

El script genera `entrega.zip` excluyendo `node_modules`, `.output`, `.nuxt`,
`.git` y las cachés de build.
