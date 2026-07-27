---
name: design-system
description: Sistema de diseño del portafolio (paleta, tipografía, layout, accesibilidad). Cargar SIEMPRE antes de escribir o modificar cualquier CSS, componente Vue o maquetación de este proyecto.
---

# Design System — minimalista editorial

Dirección única y disciplinada: **minimalista editorial**. Si una decisión no cabe
en esta dirección, no entra. Nada de híbridos.

## Paleta — los neutros trabajan, el café acentúa

```css
:root {
  --bg:         #FAF9F6;  /* blanco roto cálido — fondo dominante */
  --ink:        #141311;  /* negro tinta — texto principal */
  --gray-600:   #57534E;  /* gris templado — texto secundario */
  --gray-300:   #D6D3CE;  /* líneas, bordes hairline */
  --coffee:     #6F4E37;  /* café — ÚNICO acento */
  --coffee-soft:#A78B72;  /* café claro — solo sobre fondo oscuro */
  --bg-dark:    #121110;  /* secciones invertidas */
  --ink-dark:   #F5F3EF;  /* texto sobre oscuro */
}
```

**Regla del café (no negociable):** aparece quirúrgicamente, en **≤10% de la
superficie**. Sus únicos usos legítimos son: numeraciones `( 01 )`, subrayado de
hover en links, y un detalle por sección. **Nunca** como fondo de una sección
completa.

**Base elegida:** clara (`--bg`) dominante, con **una o dos secciones invertidas**
en `--bg-dark` para contraste dramático. Sobre fondo oscuro el acento cambia a
`--coffee-soft` (el café normal no alcanza contraste AA sobre negro).

## Tipografía — máximo 2 familias

- **Display / titulares:** `Fraunces` (serif con carácter), pesos 300 y 600.
- **Cuerpo / labels:** `Space Grotesk`, pesos 400 y 500. Los labels van en
  mayúsculas pequeñas con `letter-spacing: 0.12em`.

Escala con **saltos grandes** — nunca 14/15/16/17px:

```
0.75rem · 1rem · 1.25rem · 2rem · 3.5rem · 6rem · 9rem
```

Los titulares grandes usan `clamp()` para escalar entre móvil y desktop.

## Layout

- Grid de **12 columnas**, composición **asimétrica**: texto en col 2–6, imagen o
  plate en col 7–12, **alternando** de sección en sección.
- Espaciado en escala de **8px**. Secciones con `padding-block` generoso: 8–12rem
  en desktop.
- Separadores editoriales: bordes hairline de `1px solid var(--gray-300)`.

### Recursos gráficos firma

Estos elementos son la identidad visual del sitio; usarlos con consistencia:

- Etiquetas entre paréntesis: `( 01 — SOBRE MÍ )`
- Índices numerados: `01 — 05`
- Coordenadas y año en el footer: `10.63°N, 85.44°W — Liberia, CR`
- Líneas horizontales que se "dibujan" al hacer scroll

### Imágenes

Este proyecto **no tiene fotos ni capturas**. Los proyectos se representan con
**composiciones tipográficas monocromas** (índice grande + nombre + stack, sobre
fondo oscuro). **Prohibido el stock photography** — antes nada que una foto genérica.

## Accesibilidad (no negociable)

- Contraste **WCAG AA** en todo el texto. Verificado: `--coffee` sobre `--bg` ≈ 7:1 ✓
- `:focus-visible` visible en todos los elementos interactivos.
- Targets táctiles ≥ 44px.
- HTML semántico: `header`, `nav`, `main`, `footer`, `article`, `section`.

## Antipatrones (rechazar en revisión)

- Más de 2 familias tipográficas.
- Café usado como fondo de sección o en grandes superficies.
- Tamaños intermedios fuera de la escala (14px, 15px, 17px…).
- Lorem ipsum o copy de plantilla ("Bienvenido a mi web").
- Sombras difusas, degradados, bordes redondeados grandes — no pertenecen a la
  dirección editorial.
