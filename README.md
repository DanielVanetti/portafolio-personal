# Portafolio personal — Daniel González Picado

Sitio estático construido con Nuxt 4 para la Tarea 1 del curso Arquitectura de
Información (Universidad Nacional). Dirección visual: **minimalista editorial
con motion narrativo sutil**.

Para los detalles de la entrega —URL publicada, cumplimiento de la rúbrica y
resultados de Lighthouse— ver [`ENTREGA.md`](./ENTREGA.md).

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run generate` | Genera el sitio estático en `.output/public` |
| `npm run build` | Build de servidor (útil para comprobar que nada rompe el SSR) |
| `npx serve .output/public` | Sirve la build estática en local |

## Estructura

```
app/
├── app.vue              NuxtLayout + NuxtPage
├── layouts/default.vue  Header y footer compartidos
├── pages/               Las 5 páginas + blog/[slug].vue
├── components/          AppHeader, AppFooter, SectionLabel, MarqueeStrip,
│                        ProjectRow, ProjectPlate, FeaturedProjects,
│                        ThePreloader, ScrollProgress
├── composables/         useReveal — reveals con GSAP y compuerta del preloader
├── plugins/             gsap.client.ts
├── data/                site.ts, projects.ts, posts.ts
└── assets/css/          tokens.css, base.css
```

Nuxt 4 usa `app/` como directorio fuente, así que `pages/`, `layouts/` y
`components/` viven ahí y no en la raíz.

## Convenciones del proyecto

La paleta, la tipografía y la escala de espaciado viven como custom properties
en `app/assets/css/tokens.css`; nada de color o tamaño se escribe a mano en los
componentes. Dos reglas que conviene conocer antes de tocar el código:

1. **El contenido debe verse sin JavaScript.** Los estados iniciales de las
   animaciones cuelgan de la clase `.js-motion`, que un script en línea del
   `<head>` solo añade si hay JS y el usuario no pidió `prefers-reduced-motion`.
2. **Solo se anima `transform` y `opacity`.** Nada que provoque layout.

## Nota sobre npm

El `.npmrc` fija `legacy-peer-deps=true` para esquivar un bug de npm 10.9 (el que
trae Node 22.12) al resolver las dependencias de pares de Vite. Con npm 11 o
superior puede eliminarse.
