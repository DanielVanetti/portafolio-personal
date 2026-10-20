---
name: motion-rules
description: Presupuesto y reglas de animación del portafolio (GSAP, ScrollTrigger, Lenis, SplitType). Cargar SIEMPRE antes de escribir, modificar o revisar cualquier animación de este proyecto.
---

# Motion — narrativo y sutil

**Stack:** `gsap` + `ScrollTrigger` + `lenis` (smooth scroll) + `split-type`
(reveals de texto línea por línea). Todo vive en plugins y composables de cliente
(`*.client.ts`) — el sitio es SSG, el motion solo existe en el navegador.

**Principio rector:** el motion acompaña al contenido, **no lo protagoniza**.
Si un efecto no aporta jerarquía o narrativa, se elimina.

## Presupuesto de animación

Esta tabla es el límite completo. **Nada fuera de esta lista.**

| Efecto | Dónde | Especificación |
|---|---|---|
| Preloader minimal | Primera carga | Contador o logo tipográfico, 1.2–1.8s máx, cortina que sube. Solo una vez por sesión (`sessionStorage`) |
| Reveal de titulares | Todos los H1/H2 | SplitType por líneas, `y: 110% → 0`, stagger 80ms, ease `power4.out`, 0.9s |
| Fade-up de bloques | Párrafos, cards | `opacity 0→1`, `y: 24→0`, 0.7s, trigger al 80% del viewport, **una sola vez** |
| Marquee | Franja de skills | Loop horizontal lento, pausa en hover |
| Hover de proyectos | Lista en Inicio/Proyectos | El título se desplaza + aparece el plate del proyecto |
| Subrayado café | Links de nav | Línea que se dibuja de izquierda a derecha, 0.3s |
| Transición de página | Entre rutas | `pageTransition` de Nuxt: fade + leve `y`, 0.4s |
| Parallax sutil | Plates del hero | **Máximo 8–10%** de desplazamiento |
| Campo del hero | Solo Inicio | Tres tintes radiales a la deriva, ciclos de 29/37/43s (no múltiplos entre sí: el loop no debe percibirse). Se pausan al salir de pantalla |
| Reglas que se dibujan | `hr` de sección | `scaleX` 0→1, 1.1s, `power3.inOut`, una vez |
| Progreso de scroll | Global | Hairline de café, `scaleX` atado al scroll. Decorativa: sin rol ARIA |
| Inicial que se rompe | Hero de Inicio | `ShatterLetter`: la "D" se parte en fragmentos que se apartan del cursor con un resorte amortiguado y se recomponen al salir. Solo `transform`; con reduced-motion no se activa; el nombre real vive en un `h1` `.sr-only` |
| Demos de motion | `/detalles` | `MotionTile`: 12 demos monocromas (hover, foco o toque). Son contenido educativo, no decoración: pueden usar propiedades fuera de `transform`/`opacity` **solo dentro del escenario de la demo**, nunca en el layout de la página |

## Reglas duras

1. **`prefers-reduced-motion: reduce` desactiva todo** salvo fades de 0.2s.
   Obligatorio, sin excepciones.
2. **Solo se anima `transform` y `opacity`.** Nunca propiedades que provoquen
   layout (width, height, top, margin…). 60fps o el efecto se corta.
3. **El contenido debe ser visible sin JavaScript.** Las clases que ocultan
   elementos antes de animarlos se aplican únicamente cuando JS está activo
   (por ejemplo, una clase en `<html>` añadida desde el cliente).
4. `ScrollTrigger.refresh()` después de cada cambio de ruta
   (hook `page:transition:finish`); `kill()` de los triggers en `onUnmounted`.
5. **Nunca acceder a `window`, `document` o `matchMedia` en el setup del servidor.**
   Todo dentro de `onMounted` o de un plugin `.client.ts`.

## Prohibido

- Librerías de partículas.
- Tilt 3D, cursores personalizados que reemplacen al del sistema.
- Efectos que compitan con el contenido o retrasen la lectura.
- Animaciones de entrada que se repitan cada vez que un elemento vuelve al viewport
  (se ejecutan una sola vez).
