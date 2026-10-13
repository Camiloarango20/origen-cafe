# Fase B — Configuración base (Origen Café)

> Documento de trabajo ODD. **Fuente de verdad: `docs/04-plan-implementacion.md`** (sección «Fase B»).
> Este archivo es un espejo de recuperación; no redefine alcance, requisitos ni criterios.

## Objetivo

Dejar el proyecto Astro con TypeScript estricto y Tailwind CSS v4 operativos, la estructura de
carpetas y convenciones fijadas, el arranque (placeholder) de la isla compartida y el build/`check`
verificados. La Fase C queda habilitada al terminar.

## Alcance

- Configuración: `package.json`, `astro.config.mjs`, `tsconfig.json` (si aplica), `src/styles/global.css`.
- Estructura y convención de recursos; `README.md` del proyecto.
- Arranque placeholder de la isla (`src/lib/island.ts` + contenedor + `<script>`), **sin** lógica de negocio.
- Verificación: `npm run check` y `npm run build`.

## Fuera de alcance

- Rutas, componentes de UI, catálogo, filtros, carrito, formulario y estilos finales → **Fase C**.
- Despliegue, commits, push, alteración de `.git`, respaldo o historial preservado.

## Tareas

| ID | Tarea | Estado |
| --- | --- | --- |
| T-B1 | Ajustar `package.json` (identidad, `private`, `engines`, scripts) | ✅ Ejecutada (2026-10-10) |
| T-B2 | Añadir devDependencies: `tailwindcss`, `@tailwindcss/vite`, `typescript`, `@astrojs/check` | ✅ Ejecutada (2026-10-10) |
| T-B3 | Tailwind v4 como plugin de Vite en `astro.config.mjs` | ✅ Ejecutada |
| T-B4 | `src/styles/global.css` con `@import "tailwindcss"` + `@theme` | ✅ Ejecutada |
| T-B5 | `src/layouts/Layout.astro` base (`lang="es"`, metadatos, `global.css`, `slot`) | ✅ Ejecutada |
| T-B6 | Estructura de carpetas y convención de recursos + `README.md` | ✅ Ejecutada |
| T-B7 | Arranque placeholder de la isla (`src/lib/island.ts` + contenedor) | ✅ Ejecutada |
| T-B8 | Instalar y verificar: `npm run check` + `npm run build` → `dist/` | ✅ Ejecutada |
| T-B9 | Documentar higiene y exclusiones de `.gitignore` (Anexo C) | ✅ Ejecutada |

**Fase B completada el 2026-10-10.**

## Rutas de ejecución (ODD)

- **Ruta elegida: inline directa**, por ser una fase de configuración cohesiva, secuencial e
  interdependiente (instalar → configurar → build → verificar) donde cada paso depende del resultado
  observable del anterior. La evidencia real de los comandos la captura el propio orquestador.
- Delegación no aplicada: no hay exploración amplia nueva ni escritura desacoplada que justifique
  un worker separado; el trabajo es acotado y dirigido por las decisiones ya ratificadas.

## Verificación y evidencia

- `npm run check` → 6 archivos, 0 errores / 0 warnings / 0 hints.
- `npm run build` → 1 página → `dist/` (`index.html` + `_astro/index.*.css` de 8.551 B con tokens y utilidades).
- Estructura verificada contra `docs/03-diseno-arquitectura.md`, sección 5.
- Detalle completo: `docs/04-plan-implementacion.md` (v0.7.0) y `docs/05-registro-decisiones.md` §4.8 (v0.6.0).
- Hallazgo: `astro check` no soporta TypeScript 7 → `typescript` fijado en `^6.0.3`.

## Restricciones

- Sin commits/push/despliegue; sin `git clean/reset --hard/gc/prune`.
- Respaldo externo, `manifest.sha256` y `terrestrial-telescope.git` intactos.
- Datos comerciales ficticios marcados como demo; sin backend, red, pagos ni CMS.
