# ODD — Fase C: Implementación por requisito (RF-001 … RF-010)

> Documento de trabajo de Organic Driven Development. Deriva de `docs/02-especificacion.md` (v0.3.0),
> `docs/03-diseno-arquitectura.md` (v0.2.2) y `docs/04-plan-implementacion.md` (v0.7.0, Fase C).
> Estado: **completada y verificada (2026-10-10) — desplegada en Vercel**.

## Objetivo

Implementar la landing/catálogo estático de Origen Café (Astro + TypeScript + Tailwind v4 + isla
compartida en TS vanilla) cubriendo todos los requisitos funcionales **RF-001 … RF-010** con sus
criterios de aceptación, sin backend, sin red y sin secretos.

## Problema / por qué

La Fase B dejó solo un esqueleto (layout, tokens, placeholder de isla). La Fase C agrega el catálogo,
filtros, detalle, carrito persistente, resumen, pedido simulado, sección de origen y formulario, con
accesibilidad y responsividad. Es la base sobre la que correrán la verificación (Fase D) y el
despliegue (Fase E).

## Alcance

- Datos de demostración tipados y componentes/`lib` según la estructura del diseño (sección 5).
- Rutas `/` y `/cafes/[id]` (DD-07).
- Persistencia del carrito en `localStorage` con clave versionada y recuperación segura (DD-03/DD-13).
- Idiomas: identificadores en inglés; **copia visible al usuario en español** (D-10, D-11).
- **Fuera de alcance:** backend, pagos, autenticación, correo real, CMS, `fetch`/red, frameworks de UI,
  internacionalización.

## Restricciones

- Sin dependencias nuevas; TypeScript estricto; Tailwind v4 ya configurado (`@tailwindcss/vite`).
- Sin recursos externos (CDN de fuentes/imágenes): usar *system fonts* y marcadores locales/inline.
- No commits ni push en esta ejecución (mandato vigente).
- No tocar `docs/`, `.gitignore`, `package.json`, `astro.config.mjs` salvo necesidad justificada.

## Checklist (T-C1 … T-C12)

- [x] **T-C1** `src/lib/types.ts` + `src/data/cafes.ts` (8 cafés ficticios tipados).
- [x] **T-C2** `DemoNotice.astro` + microcopy demo junto a precios.
- [x] **T-C3** `Header.astro`, `Footer.astro`, navegación global.
- [x] **T-C4** `Catalog.astro`, `CafeCard.astro` (catálogo estático sobre `cafes.ts`).
- [x] **T-C5** `Filters.astro` + `catalog-filters.ts` (región/tueste/proceso, combinables).
- [x] **T-C6** `src/pages/cafes/[id].astro` con `getStaticPaths` (8 rutas).
- [x] **T-C7** `cart-store.ts` (persistencia + validación + recuperación) + `CartDrawer.astro`.
- [x] **T-C8** `OrderSummary.astro` + `format.ts` (totales en COP + aviso demo).
- [x] **T-C9** Pedido simulado + `clear()` persistido.
- [x] **T-C10** `OriginSection.astro` (contenido ficticio).
- [x] **T-C11** `ContactForm.astro` (validación cliente + envío simulado).
- [x] **T-C12** Tema/tokens, pulido responsivo y accesibilidad final.

## Criterios de aceptación

Todos los `CA-001 … CA-050` de `docs/02-especificacion.md` (se evaluarán formalmente en Fase D). En la
Fase C deben quedar satisfechos los de RF-001 … RF-010, incluida la recuperación ante `JSON` inválido
(CA-046 … CA-048) y la persistencia segura (CA-050).

## Verificaciones (cierre de tarea)

- `npm run check` → sin errores (CA-035).
- `npm run build` → `dist/` generado con ambas rutas (RF-003/CA-041).

## Ruta de ejecución

- **Ruta:** delegada directa. Un único escritor (`gentle-ai-worker`) para todos los archivos de la
  Fase C (≥ 2 archivos no triviales → trigger de escritor). Evidencia de disparo: ~20 archivos.
- **Disparadores de delegación:** trigger de escritor (2+ archivos no triviales). Mapeo: documentación
  ya leída por el orquestador (docs/02, docs/03, docs/04).

## Progreso y evidencia

- 2026-10-10 — Documento creado. Fase C habilitada (DD-02/DD-03 ratificadas). RDD resuelto: lineage
  colgado `review-2f3d6e6dfd3baa3a` abandonado con razón documentada (`operator_disposition`);
  authority store `clean`.
- 2026-10-10 — **Fase C implementada** por `gentle-ai-worker` (escritor único, status `completed`):
  `src/lib/{types,format,catalog-filters,cart-store,island}.ts`, `src/data/cafes.ts` (8 cafés ficticios),
  11 componentes + `Welcome.astro`, y `Layout.astro` / `index.astro` / `cafes/[id].astro` reescritos.
- 2026-10-10 — **Verificación (Fase D, read-only por `gentle-ai-verify`):** `npm run check` → 23
  archivos, 0/0/0; `npm run build` → 9 páginas (`/` + 8 detalle), CSS 20.103 B, JS 12.894 B; `preview`
  → `/` 200 (27.629 B), detalle 200 (9.071 B), id desconocido 404, `favicon.svg` 200. Matriz
  CA-001 … CA-050: **24 CUMPLE, 0 NO CUMPLE, 26 NO VERIFICABLE EJECUTABLEMENTE** (JS cliente/navegador).
  Observación menor: `Astro.rewrite('/404')` es rama inalcanzable (_dead code_).
- 2026-10-10 — **Fase E desplegada:** `vercel deploy --prod` → **Ready**; se añadió `vercel.json`
  (`framework: astro`, `outputDirectory: dist`) porque Vercel no detectó Astro. URL pública
  `https://origen-cafe-rouge.vercel.app` verificada sin autenticación (200/200/404). T-E1 (_commits_)
  fuera de alcance por restricción del mandato.
- **Limitación honesta:** no hay _runner_ de tests ni navegador automatizado → el comportamiento de
  cliente (carrito, filtros, formulario, focus-trap, responsive, a11y en vivo) se validó por lectura de
  código y _smoke test_ HTTP, **no en ejecución**.
- **Forecast de líneas:** > 400 líneas autoradas (heurística de planificación, no criterio de
  aceptación). Sin commits en esta ejecución → la estrategia de entrega (chained PR) queda diferida a
  cuando se autoricen commits.

## Siguiente paso

Fases C, D y E completadas. Pendiente (fuera de alcance en esta ejecución): T-E1 (_commits_/_push_) e
implementación de las 26 comprobaciones de cliente con un _runner_ de tests (p. ej. Vitest + jsdom) si
se autoriza añadir dependencias.
