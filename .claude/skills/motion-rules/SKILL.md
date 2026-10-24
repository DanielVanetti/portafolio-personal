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
| Entrada de la portada | Hero de Inicio | `data-reveal="intro"`: fade-up en cascada (stagger 120 ms) al abrir la compuerta, **sin esperar al scroll** |
| Acordeón de proyectos | Sección Proyectos | Panel que se abre animando `grid-template-rows` 0fr→1fr (0.6 s). El título se desplaza al hover y el plate sigue al cursor sobre filas cerradas |
| Subrayado café | Links de nav | Línea que se dibuja de izquierda a derecha, 0.3s |
| Transición de página | Entre rutas | `pageTransition` de Nuxt: fade + leve `y`, 0.4s |
| Parallax sutil | Plates del hero | **Máximo 8–10%** de desplazamiento |
| Rejilla de puntos | Hero de Inicio | `DotField` (canvas): los puntos cercanos al cursor crecen, se tiñen de café y se apartan; un clic lanza una onda. Solo dibuja mientras algo cambia y se para fuera de pantalla |
| Palabra que rota | Hero de Inicio | `HeroWordmark`: tras la D, Daniel → Dev → Diseño/Design. Letras con `y` + `blur` en cascada; el nombre se queda más tiempo. Pausa fuera de pantalla y con la pestaña oculta |
| Reglas que se dibujan | `hr` de sección | `scaleX` 0→1, 1.1s, `power3.inOut`, una vez |
| Progreso de scroll | Global | Hairline de café, `scaleX` atado al scroll. Decorativa: sin rol ARIA |
| Inicial que se rompe | Hero de Inicio | `ShatterLetter`: la "D" se parte en fragmentos que se apartan del cursor con un resorte amortiguado y se recomponen al salir. Solo `transform`; con reduced-motion no se activa; el nombre real vive en un `h1` `.sr-only` |
| Texto que se enciende | Sobre mí | `ScrollRevealText`: palabras de 16 % a 100 % de opacidad con `scrub`. Se arma tras el primer scroll y solo si el párrafo está por debajo: nadie ve un texto apagado que no puede encender |
| Contadores | Cifras de Sobre mí | `NumberTicker`: cuentan hasta su valor al entrar en pantalla, una vez. El servidor pinta el valor final |
| Foco de luz | Tarjetas | `SpotlightCard`: halo café muy tenue que sigue al cursor y borde que se aviva al hover |
| Descifrado | Etiquetas del stack | `ScrambleText`: símbolos al azar que se resuelven de izquierda a derecha al hover; el ancho no cambia |
| Botón magnético | CTAs del hero | `MagneticButton`: se deja atraer un 28 % por el cursor y el texto rueda hacia arriba |
| Menú móvil | Header | Cortina con `clip-path` y enlaces en cascada; Esc lo cierra |
| Demos de motion | `/detalles` | `MotionTile`: 12 demos monocromas (hover, foco o toque). Son contenido educativo, no decoración: pueden usar propiedades fuera de `transform`/`opacity` **solo dentro del escenario de la demo**, nunca en el layout de la página |

**Excepciones conscientes a "solo `transform` y `opacity`":**
- `filter: blur` en la palabra que rota y `clip-path` en el menú móvil: no
  provocan layout.
- `grid-template-rows` del acordeón y `width` de la píldora de la nav: sí
  recalculan layout, pero en un solo elemento, durante menos de un segundo y
  solo como respuesta a un clic o un hover. No usar este recurso en nada que
  se anime solo o con el scroll.

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
