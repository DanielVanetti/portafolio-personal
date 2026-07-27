# PLAN — Portafolio Personal Estático (Nuxt + Netlify)
### Tarea 1 · Arquitectura de Información · UNA — con dirección de diseño "minimalista editorial + motion"

> **Cómo usar este documento:** pégalo como `PLAN.md` en la raíz del proyecto (o como primer prompt en Claude Code) y dile:
> *"Lee PLAN.md completo. Ejecuta la Fase 0 (preguntas) antes de escribir código. Luego crea los subagentes y skills descritos y avanza fase por fase, deteniéndote al final de cada una para mi revisión."*

---

## 1. Objetivo

Construir un **portafolio personal estático** que cumpla el 100% de la rúbrica de la tarea y que visualmente se sienta como un sitio de estudio de diseño premium — **no** como una tarea de universidad.

**Referencias de estilo (inspiración, nunca copia):**
- **Nudot Studio (nudot.com.tw):** preloader minimal, tipografía display enorme, etiquetas editoriales entre paréntesis `( 01 )` `( Sobre Mí )`, índices numerados `01 // 05`, marquees de texto, grids asimétricos, hovers con reveal de imagen, motion coreografiado (GSAP).
- **Izanami (izanami-official.com):** calma y armonía japonesa, ritmo de scroll pausado, reveals suaves de texto línea por línea, mucho aire, fotografía protagonista, serif elegante.

**Dirección de estilo elegida (UNA sola, disciplinada): Minimalista editorial con motion narrativo sutil.**

---

## 2. Requisitos obligatorios de la tarea (no negociables)

| # | Requisito | Cómo se cumple |
|---|---|---|
| 1 | Proyecto creado con `nuxi init` | `npx nuxi@latest init portfolio` |
| 2 | Páginas: Inicio, Sobre Mí, Proyectos, Contacto, Blog | `pages/index.vue`, `pages/sobre-mi.vue`, `pages/proyectos.vue`, `pages/contacto.vue`, `pages/blog/index.vue` + `pages/blog/[slug].vue` |
| 3 | Navegación con `<NuxtLink>` | Header y footer usan exclusivamente `<NuxtLink>`; cero `<a>` internos |
| 4 | `layouts/default.vue` con header y footer compartidos | Layout único con `<slot />`, nav fija y footer editorial |
| 5 | `useHead` con título y meta descripción por página | Cada página define `useHead({ title, meta: [description] })` únicos |
| 6 | Publicar en Netlify | `nuxt generate` (SSG) + deploy; URL final documentada |
| 7 | Entrega en AulaVirtual sin `node_modules` | Script de empaquetado + archivo `ENTREGA.md` con la URL de Netlify |

**Regla:** ninguna decisión de diseño puede romper un requisito. Si hay conflicto, gana la rúbrica.

---

## 3. Supuestos (Claude Code debe confirmarlos en la Fase 0)

- **[RESUELTO]** Contenido personal: ver **Sección 11 — Contenido real del usuario** (extraído de su CV). Solo falta confirmar: foto de retrato disponible y títulos definitivos de los posts del blog. Prohibido lorem ipsum en la entrega final.
- **[Supuesto 2]** Base **clara** (blanco roto + tinta) con una o dos secciones invertidas en oscuro para contraste dramático (híbrido Izanami/Nudot). Confirmar preferencia.
- **[Supuesto 3]** Nuxt 4 (lo que instale `nuxi init` hoy). Blog con **datos locales** (`data/posts.ts`) + ruta dinámica `[slug]` — demuestra rutas automáticas sin backend.
- **[Supuesto 4]** Idioma del sitio: español (con labels editoriales en inglés tipo `( ABOUT )` como recurso gráfico, al estilo Nudot).

---

## 4. Design System (skill `design-system`)

### Paleta — neutros trabajan, el café acentúa
```css
:root {
  --bg:        #FAF9F6;  /* blanco roto cálido */
  --ink:       #141311;  /* negro tinta */
  --gray-600:  #57534E;  /* gris templado — texto secundario */
  --gray-300:  #D6D3CE;  /* líneas, bordes hairline */
  --coffee:    #6F4E37;  /* café — ÚNICO acento: links hover, números, detalles */
  --coffee-soft:#A78B72; /* café claro — solo sobre fondo oscuro */
  --bg-dark:   #121110;  /* secciones invertidas */
  --ink-dark:  #F5F3EF;  /* texto sobre oscuro */
}
```
**Regla del café:** aparece quirúrgicamente (≤10% de la superficie): numeraciones `( 01 )`, subrayados de hover, un detalle por sección. Nunca como fondo de secciones completas.

### Tipografía (máx. 2 familias, vía `@nuxt/fonts`)
- **Display / titulares:** `Fraunces` (serif con carácter) — pesos 300/600, tamaños 3–9rem con `clamp()`.
- **Cuerpo / labels:** `Space Grotesk` — labels en mayúsculas pequeñas con `letter-spacing: 0.12em`.
- Escala con saltos grandes: 0.75 / 1 / 1.25 / 2 / 3.5 / 6 / 9 rem. Nada de 14/15/16/17.

### Layout
- Grid de 12 columnas, composición **asimétrica** (texto col 2–6, imagen col 7–12, alternando).
- Espaciado en escala de 8px; secciones con `padding-block` generoso (8–12rem desktop).
- Bordes hairline `1px var(--gray-300)` como separadores editoriales.
- Recursos gráficos firma: etiquetas `( SOBRE MÍ )`, índices `01 — 05`, coordenadas/año en el footer, líneas horizontales que "dibujan" al hacer scroll.

### Accesibilidad (no negociable)
- Contraste WCAG AA (verificar café sobre blanco: `#6F4E37` sobre `#FAF9F6` ≈ 7:1 ✓).
- Focus visible en todos los links; targets ≥ 44px; HTML semántico (`header/nav/main/footer/article`).

---

## 5. Motion (skill `motion-rules`)

**Stack:** `gsap` + `ScrollTrigger` + `lenis` (smooth scroll) + `SplitType` (reveals de texto). Todo en plugins/composables de cliente (`.client.ts`) — es SSG, el motion solo vive en el navegador.

**Presupuesto de animación (para que sea elegante, no circo):**

| Efecto | Dónde | Especificación |
|---|---|---|
| Preloader minimal | Primera carga | Contador o logo tipográfico, 1.2–1.8s máx, cortina que sube (estilo Nudot) — solo una vez por sesión (sessionStorage) |
| Reveal de titulares | Todos los H1/H2 | SplitType por líneas, `y: 110% → 0`, stagger 80ms, ease `power4.out`, 0.9s |
| Fade-up de bloques | Párrafos, cards | `opacity 0→1, y: 24→0`, 0.7s, trigger al 80% del viewport, una sola vez |
| Marquee | Franja de skills/servicios | Texto en loop horizontal lento (estilo Nudot), pausa en hover |
| Hover de proyectos | Lista en Inicio/Proyectos | Título se desplaza + imagen aparece siguiendo el cursor (o crossfade en la card) |
| Subrayado café | Links de nav | Línea que se dibuja de izquierda a derecha, 0.3s |
| Transición de página | Entre rutas | `pageTransition` de Nuxt: fade + leve `y`, 0.4s — sobrio |
| Parallax sutil | Imágenes hero | Máx. 8–10% de desplazamiento |

**Reglas duras:**
1. `prefers-reduced-motion: reduce` → desactivar todo salvo fades de 0.2s. Obligatorio.
2. Solo se anima `transform` y `opacity` (nunca layout). 60fps o se corta el efecto.
3. Nada de librerías de partículas, tilt 3D ni efectos que compitan con el contenido. El motion acompaña, no protagoniza (lección Izanami).
4. `ScrollTrigger.refresh()` tras cada cambio de ruta; matar triggers en `onUnmounted`.

---

## 6. Arquitectura del proyecto

```
portfolio/
├── PLAN.md
├── .claude/
│   ├── agents/            # subagentes (sección 7)
│   └── skills/
│       ├── design-system/SKILL.md
│       └── motion-rules/SKILL.md
├── nuxt.config.ts         # ssr:true + nitro preset static, @nuxt/fonts, css global
├── app.vue                # NuxtLayout + NuxtPage + pageTransition
├── layouts/default.vue    # Header (nav NuxtLink) + slot + Footer
├── pages/
│   ├── index.vue          # Hero tipográfico, marquee, proyectos destacados, CTA
│   ├── sobre-mi.vue       # Retrato + bio editorial + valores/skills numerados
│   ├── proyectos.vue      # Lista editorial con índices 01—NN y hover reveal
│   ├── contacto.vue       # Email gigante clicable + redes + ubicación
│   └── blog/
│       ├── index.vue      # Listado de posts (fecha, título, tag)
│       └── [slug].vue     # Post individual (ruta dinámica, useHead dinámico)
├── components/
│   ├── AppHeader.vue / AppFooter.vue
│   ├── SectionLabel.vue   # "( 01 — SOBRE MÍ )"
│   ├── Marquee.vue / ProjectRow.vue / RevealText.vue / Preloader.vue
├── composables/useReveal.ts   # wrapper GSAP reutilizable
├── plugins/lenis.client.ts · gsap.client.ts
├── data/projects.ts · posts.ts
├── assets/css/tokens.css · base.css
└── public/ (imágenes optimizadas .webp, favicon, og.jpg)
```

---

## 7. Subagentes de Claude Code (`.claude/agents/*.md`)

Crear estos 5 agentes al inicio. Cada uno con `tools` mínimos y su descripción:

| Agente | Rol | Cuándo se invoca |
|---|---|---|
| `scaffold-engineer` | Inicializa con `nuxi init`, instala deps (`gsap`, `lenis`, `split-type`, `@nuxt/fonts`), configura `nuxt.config.ts` para SSG y estructura de carpetas | Fase 1 |
| `design-builder` | Construye tokens, layout, header/footer y componentes base **siguiendo la skill `design-system`**. No escribe animaciones | Fase 2–3 |
| `motion-engineer` | Implementa preloader, reveals, marquee, hovers y transiciones **siguiendo la skill `motion-rules`**. No toca contenido ni layout | Fase 4 |
| `content-writer` | Redacta copy real (con los datos del usuario), tono editorial, cero frases plantilla ("Bienvenido a mi web" prohibido); escribe `useHead` únicos por página | Fase 3 (paralelo) |
| `qa-auditor` | Audita contra: rúbrica de la tarea (sección 2), pre-flight de diseño (sección 9), accesibilidad y Lighthouse. Reporta hallazgos con severidad 0–4; no corrige él mismo, delega | Fase 5, y al final de cada fase |

**Skills de proyecto:** copiar la sección 4 en `.claude/skills/design-system/SKILL.md` y la sección 5 en `.claude/skills/motion-rules/SKILL.md`, de modo que cualquier agente que toque UI o animación las cargue automáticamente.

---

## 8. Fases de ejecución (con dependencias)

**Fase 0 — Confirmación rápida (sin código).** El contenido base ya está en la Sección 11. Solo confirmar con Daniel: (a) base clara u oscura, (b) si tiene foto de retrato y capturas de sus proyectos, (c) títulos definitivos de los 3 posts del blog. *No bloquear más de un intercambio.*

**Fase 1 — Scaffold** (`scaffold-engineer`). `nuxi init` → deps → `nuxt.config.ts` (SSG, fonts, css) → estructura de carpetas → `.gitignore` → verificación: `npm run dev` levanta y las 6 rutas responden. **Commit.**

**Fase 2 — Sistema de diseño y layout** (`design-builder`). Tokens CSS → `layouts/default.vue` con header/footer → componentes base (`SectionLabel`, `Marquee` estático, `ProjectRow`) → verificación visual en las 3 rupturas (móvil/tablet/desktop). **Commit.**

**Fase 3 — Páginas + contenido** (`design-builder` + `content-writer`). Las 5 páginas con contenido real, `useHead` único por página, `data/projects.ts` y `data/posts.ts`, ruta dinámica `[slug]` funcionando. Sitio completo y usable **sin una sola animación todavía**. **Commit.**

**Fase 4 — Motion** (`motion-engineer`). Plugins Lenis/GSAP → preloader → reveals → marquee animado → hovers → transición de página → `prefers-reduced-motion`. El sitio debe seguir siendo 100% funcional con JS deshabilitado (contenido visible: usar clases que ocultan solo si JS está activo). **Commit.**

**Fase 5 — QA + Deploy** (`qa-auditor` + `scaffold-engineer`).
1. Auditoría completa (sección 9) y corrección de hallazgos severidad 3–4.
2. `npm run generate` → verificar `.output/public` → deploy en Netlify (build command `npm run generate`, publish `.output/public` — o `dist` según versión).
3. Probar la URL publicada: las 6 rutas, refresh directo en `/blog/mi-post` (SSG debe servirla), metadatos con el inspector.
4. Crear `ENTREGA.md` con la URL de Netlify + instrucciones, y empaquetar: `zip -r entrega.zip . -x "node_modules/*" ".output/*" ".nuxt/*" ".git/*"`.

---

## 9. Checklist final (el `qa-auditor` no aprueba sin esto)

**Rúbrica de la tarea:**
- [ ] Proyecto nace de `nuxi init` (visible en estructura y `package.json`)
- [ ] Existen las 5 páginas pedidas y navegan entre sí solo con `<NuxtLink>`
- [ ] `layouts/default.vue` con header + footer compartidos en todas las rutas
- [ ] `useHead` con título Y meta descripción **únicos** en cada página (verificado en el HTML generado)
- [ ] Publicado en Netlify, todas las rutas funcionan con acceso directo/refresh
- [ ] `ENTREGA.md` con la URL + zip sin `node_modules`

**Calidad de diseño (anti-slop):**
- [ ] UNA dirección de estilo nombrable: minimalista editorial — sin híbridos
- [ ] Jerarquía legible en 3 segundos; máx. 2 familias tipográficas
- [ ] Café como único acento, usado con moderación; neutros dominan
- [ ] Cero lorem ipsum, cero copy de plantilla, contenido real
- [ ] Spacing en escala consistente; contraste AA; focus visible
- [ ] `prefers-reduced-motion` respetado; solo `transform/opacity` animados
- [ ] Responsive real: móvil sin titulares rotos ni marquees que desborden
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95

---

## 10. Riesgos previstos y mitigación

1. **GSAP/Lenis + SSR rompe el build** → todo motion en `*.client.ts` y `onMounted`; nunca acceder a `window` en setup del servidor.
2. **ScrollTrigger desalineado tras transición de ruta** → `refresh()` en hook `page:transition:finish` y kill de triggers en `onUnmounted`.
3. **Netlify sirve 404 en rutas profundas** → usar `nuxt generate` (prerender de todas las rutas, incluidas `[slug]` vía `nitro.prerender.routes` o crawl).
4. **Sobre-animar** (riesgo #1 de imitar a Nudot) → respetar el presupuesto de la sección 5; si un efecto no aporta jerarquía o narrativa, fuera.
5. **Fuentes que causan layout shift** → `@nuxt/fonts` con `font-display: swap` y `size-adjust`.
6. **Imágenes pesadas** → `.webp` ≤ 200KB, `loading="lazy"` salvo hero.

---

## 11. Contenido real del usuario (fuente: CV)

> Base para el `content-writer`. Reescribir con tono editorial — el CV es la materia prima, no el copy final.

### Identidad
- **Nombre:** Daniel González Picado
- **Rol:** Desarrollador Full Stack (Junior) — usar en el hero algo con carácter, p. ej. display grande `DANIEL GONZÁLEZ` + label `( FULL STACK DEVELOPER — COSTA RICA )`
- **Ubicación:** Liberia, Guanacaste, Costa Rica (buen recurso editorial para el footer: `10.63°N, 85.44°W — Liberia, CR`)
- **Contacto público:** `danielgonzalezpicado@gmail.com` · GitHub `github.com/DanielVanetti` · LinkedIn `linkedin.com/in/daniel-gonzález-picado`
- ⚠️ **Privacidad:** NO publicar el teléfono personal ni los datos de la referencia (MSc. Eddier López) — son para el CV, no para un sitio público.

### Bio (materia prima para "Sobre Mí")
Formación en Ingeniería en Sistemas de Información (UNA, 2025) y actualmente cursando la Licenciatura en Desarrollo Web (UNA). Experiencia práctica en desarrollo web y móvil: migraciones de sistemas de escritorio a web, frontend y backend, soporte de aplicaciones empresariales en producción y desarrollo con WordPress. Trabaja con metodologías ágiles (SCRUM). Ángulo narrativo sugerido: *"del soporte en producción a construir productos completos"* — aprendizaje continuo y trabajo cercano al usuario real.

### Proyectos para `data/projects.ts` (índices 01—05)
| # | Proyecto | Contexto | Qué destacar | Stack |
|---|---|---|---|---|
| 01 | Migración de escritorio a web | ExporPack S.A. · 2024–2025 | Participación en migrar una app de escritorio a web; documentación de procesos y validación de datos | SQL Server, web app |
| 02 | App móvil con mapas | Universidad Nacional · 2024–2025 | Aplicación móvil integrando Google Maps | Google Maps API |
| 03 | Plataforma web para barbería | Universidad Nacional | App web de servicios con funcionalidades de compra/venta | Web full stack, Firebase/SQL |
| 04 | Soporte de aplicaciones en producción | 4GEEKS · 2025 | Mantenimiento correctivo/preventivo en ambientes productivos, análisis de errores front y back, SCRUM | Frontend + backend |
| 05 | Sitios WordPress a medida | 2026 | Temas, plugins y personalización | WordPress, PHP |

*(El `content-writer` redacta cada proyecto con: problema → qué hizo Daniel → resultado. Si hay capturas reales, mejor; si no, composiciones tipográficas monocromas con el índice y el stack — nunca stock.)*

### Skills para el marquee (estilo Nudot)
`C# · PYTHON · PHP · JAVASCRIPT · REACT · ANGULAR · DJANGO · WORDPRESS · SQL SERVER · FIREBASE · DOCKER · GIT · POWER BI · SCRUM`

### Posts sugeridos para el Blog (2–3, basados en experiencia real)
1. *"Lo que aprendí migrando una app de escritorio a la web"* — experiencia ExporPack.
2. *"Soporte en producción: la mejor escuela para un dev junior"* — experiencia 4GEEKS.
3. *"WordPress a medida: cuándo un tema no basta"* — trabajo 2026.

### Formación (para "Sobre Mí", formato timeline editorial)
- Licenciatura en Desarrollo Web — UNA · en curso
- Ingeniería en Sistemas de Información (Grado) — UNA · 2025
- Diplomado en Programación de Aplicaciones Informáticas — UNA · 2024

### Metadatos base (`useHead`)
- Inicio: `Daniel González Picado — Desarrollador Full Stack` / "Portafolio de Daniel González, desarrollador full stack en Costa Rica. Web, móvil y sistemas empresariales."
- Cada página ajusta título y descripción a su contenido (el `qa-auditor` verifica que sean únicos).

---

*Fin del plan. Claude Code: comienza por la Fase 0 (confirmación rápida) y luego ejecuta fase por fase.*
