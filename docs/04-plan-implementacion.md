# 04 — Plan de implementación

> Fase de planificación del ciclo SDD. Ordena el trabajo de construcción de Origen Café en tareas
> concretas, con dependencias, criterios verificables y puertas de autorización humana. Deriva de la
> constitución (`docs/01-constitucion.md`), la especificación (`docs/02-especificacion.md`) y el
> diseño (`docs/03-diseno-arquitectura.md`). **No se ejecuta nada de este plan sin autorización de
> la fase correspondiente.**

## Metadatos

| Campo | Valor |
| --- | --- |
| Proyecto | Origen Café |
| Documento | Plan de implementación |
| Versión | 0.9.0 |
| Estado | Ratificado — DD-02/DD-03 aprobadas. **Fases A, B, C, D y E ejecutadas y verificadas** (2026-10-10; T-E1 *commits*/*push* **fuera de alcance** por restricción del mandato). **Fase F ejecutada (2026-10-13)**: suite de tests ejecutable **76/76** en verde (Vitest + jsdom), búsqueda de catálogo (DD-16), 10 SVG autorales de demostración (DD-15), página 404, `astro check` 0/0/0, build 10 páginas, docs actualizadas y despliegue final verificado en Vercel (`https://origen-cafe-rouge.vercel.app`). |
| Fecha | 2026-10-13 |
| Idioma de la documentación | Español (neutro/profesional) |
| Documentos relacionados | `docs/01-constitucion.md`, `docs/02-especificacion.md`, `docs/03-diseno-arquitectura.md`, `docs/05-registro-decisiones.md` |

## 1. Propósito

Ofrecer un recorrido ejecutable y verificable, desde el scaffold actual (`terrestrial-telescope/`)
hasta el despliegue público en Vercel, sin saltarse pasos ni inventar requisitos. Cada tarea indica:
descripción, dependencias, trazabilidad a requisitos y su **evidencia de verificación**.

## 2. Enfoque por fases

| Fase | Nombre | Resultado | Puerta de autorización | Estado |
| --- | --- | --- | --- | --- |
| A | Reorganización del scaffold | Proyecto en la raíz, `docs/` y `.atl/` intactos, repo Git anidado resuelto | **Sí** — mover archivos y tocar `.git` | ✅ **Ejecutada (T-A1 … T-A5)** |
| B | Configuración base | Tailwind v4, TypeScript, `astro check`, layout mínimo, build inicial | No (dentro del alcance aprobado) | ✅ **Ejecutada (T-B1 … T-B9)** |
| C | Implementación por requisito | Todas las funcionalidades RF-001 … RF-010 | No — DD-02/DD-03 ya ratificadas | ✅ **Ejecutada (T-C1 … T-C12)** |
| D | Verificación | `astro check`, build, pruebas por CA, responsive, accesibilidad | No | ✅ **Ejecutada** — refuerzo ejecutable en Fase F (76 tests) |
| E | Despliegue en Vercel | Sitio público accesible por URL | **Sí** — commits/push y credenciales | ✅ **Ejecutada** (T-E2 … T-E4; T-E1 *commits*/*push* **fuera de alcance**) |
| F | Cierre académico (2026-10-13) | Suite de tests ejecutable, búsqueda, activos originales, docs coherentes y despliegue final verificado | No — mandato de cierre autorizado | ✅ **Ejecutada (T-F1 … T-F12)** |

> **Estado de ejecución:** las **Fases A, B, C, D y E están ejecutadas y verificadas** (2026-10-10;
> evidencia en `docs/05-registro-decisiones.md`, secciones 4 y 4.9; solo T-E1 — *commits*/*push* —
> queda **fuera de alcance** por restricción del mandato). La **Fase F (cierre académico) se ejecutó
> el 2026-10-13** (T-F1 … T-F12): pruebas ejecutables, búsqueda, activos originales y despliegue
> final verificado; detalle en la sección 3 y en `docs/05-registro-decisiones.md`, sección 4.10.

## 3. Tareas

Cada tarea incluye **ID**, descripción, dependencias, trazabilidad y evidencia esperada.

### Fase A — Reorganización del scaffold

> La **protección de la Fase A** (D-17) es obligatoria: antes de mover o reorganizar archivos se
> crea un respaldo y se verifica su integridad.

| ID | Tarea | Depende de | Traza a | Evidencia |
| --- | --- | --- | --- | --- |
| T-A1 | Inspeccionar el estado real: `git status`/`git log`/`git remote` en la raíz y en `terrestrial-telescope/`, y listado del árbol del scaffold. | — | D-06, D-07 | ✅ **Ejecutada el 2026-10-10** — evidencias en `docs/05-registro-decisiones.md`, sección 3 |
| T-A2 | Crear **respaldo externo** (fuera de `C:\Proyectos\OrigenCafe`) del árbol completo: proyecto, `docs/`, `.atl/`, `.git` raíz y `.git` anidado, **excluyendo `node_modules/`** (se reinstala con `npm install`). Procedimiento en el Anexo A. | T-A1 | D-17, R-09 | ✅ **Ejecutada el 2026-10-10** — respaldo en `C:\Users\ludim\backups\origen-cafe\origen-cafe-20261010-101001` (91 archivos + bundle + manifest; `node_modules/` excluido). Ver `docs/05-registro-decisiones.md`, sección 4.1 |
| T-A2.1 | **Verificar la integridad del respaldo**: recuento de archivos, comparación de tamaños y **hashes SHA-256** contra el original; comprobar existencia, legibilidad y contenido. | T-A2 | D-17, R-09 | ✅ **Ejecutada** — manifest SHA-256 de 94 entradas verificado **94/94, 0 fallos** |
| T-A2.2 | Crear **Git bundle** del repositorio anidado (`git bundle create … --all` + `git bundle verify`) para preservar el historial `63e18cf` de forma verificable. | T-A2 | D-17, R-07 | ✅ **Ejecutada** — `origen-cafe-terrestrial-telescope.bundle`; `git bundle verify` → `is okay`; refs `refs/heads/master` + `HEAD` → `63e18cf`; SHA-256 `6965F7…2841C` |
| T-A2.3 | **Prueba de restauración** en directorio temporal independiente (clonar el bundle y comparar hashes de una muestra de archivos). | T-A2.1, T-A2.2 | D-17, R-09 | ✅ **Ejecutada** — clon en directorio temporal; `HEAD`/`tree` = `63e18cf`; con `--config core.autocrlf=false`, **17/17 archivos byte-idénticos** |
| T-A3 | Trasladar los archivos útiles del scaffold a la raíz según el plan del Anexo B (`src/`, `public/`, `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.gitignore`, `.vscode/`, `AGENTS.md`, `CLAUDE.md`, `README.md`), **preservando** `docs/` y `.atl/`. | T-A2.3 | D-06, D-07 | ✅ **Ejecutada** — 11 elementos / 17 archivos trasladados; **17/17 SHA-256** coincidentes; `docs/` y `.atl/` intactos; `node_modules/` no trasladado. Ver sección 4.2 |
| T-A4 | Resolver el repositorio Git anidado según la **decisión aprobada** (recomendación: opción A — historial conservado en el bundle verificado; historial nuevo y unificado en la raíz). **Requiere autorización.** | T-A3 | D-07, R-05, R-07 | ✅ **Ejecutada** (opción A) — `.git` anidado retirado a cuarentena `…\_retirados-t-a4\terrestrial-telescope.git`; `git status` de la raíz sin repo anidado ni gitlink. Ver sección 4.3 |
| T-A5 | Verificar la raíz: `git status`, estructura final, `docs/` y `.atl/` intactos. | T-A4 | D-17, R-09 | ✅ **Ejecutada** (solo lectura) — integridad, Git, higiene y respaldo verificados; hallazgo y limitaciones en la sección 4.4 de `docs/05-registro-decisiones.md` |

### Anexo A — Procedimiento de respaldo previo a la Fase A (diseñado y **ejecutado** en T-A2 … T-A2.3)

Procedimiento PowerShell **ejecutado** como parte de T-A2, T-A2.1, T-A2.2 y T-A2.3, **antes de
cualquier movimiento de archivos** (D-17). Resultados reales en `docs/05-registro-decisiones.md`,
sección 4.1. El respaldo resultante se ubica en
`C:\Users\ludim\backups\origen-cafe\origen-cafe-20261010-101001`.

```powershell
# ============================================================
# Respaldo previo a la Fase A — Origen Café                (D-17)
# Ejecutar SOLO con autorización de Fase A. No modifica el proyecto.
# ============================================================
$ErrorActionPreference = 'Stop'

# 1. Parámetros
$root         = 'C:\Proyectos\OrigenCafe'
$backupParent = Join-Path $env:USERPROFILE 'backups\origen-cafe'  # FUERA de la raíz
$stamp        = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDir    = Join-Path $backupParent "origen-cafe-$stamp"
$nested       = Join-Path $root 'terrestrial-telescope'
$bundle       = Join-Path $backupDir 'origen-cafe-terrestrial-telescope.bundle'
$manifest     = Join-Path $backupDir 'manifest.sha256'

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# 2. Copia del árbol (excluye node_modules) — incluye docs/, .atl/ y AMBOS .git
robocopy $root $backupDir /E /XD node_modules /XF *.log
if ($LASTEXITCODE -ge 8) { throw "robocopy falló (código $LASTEXITCODE)" }

# 3. Bundle del repositorio anidado + verificación
git -C $nested bundle create $bundle --all
git bundle verify $bundle
if ($LASTEXITCODE -ne 0) { throw "El bundle no se verificó" }

# 4. Manifest SHA-256 de TODOS los archivos del respaldo
Get-ChildItem -LiteralPath $backupDir -Recurse -File |
  Get-FileHash -Algorithm SHA256 |
  Select-Object @{n='Hash';e={$_.Hash}}, @{n='Path';e={$_.Path.Substring($backupDir.Length + 1)}} |
  Export-Csv -LiteralPath $manifest -NoTypeInformation -Encoding UTF8

# 5. Comprobación: existencia, legibilidad y contenido
$fileCount = (Get-ChildItem -LiteralPath $backupDir -Recurse -File).Count
$zeroBytes = (Get-ChildItem -LiteralPath $backupDir -Recurse -File | Where-Object Length -eq 0).Count
if ($fileCount -eq 0 -or $zeroBytes -gt 0) { throw "Respaldo incompleto o vacío" }
$bundleHash = (Get-FileHash -LiteralPath $bundle -Algorithm SHA256).Hash

# 6. Prueba de restauración en directorio temporal independiente
$testDir  = Join-Path $env:TEMP "origen-cafe-restore-test-$stamp"
git clone $bundle (Join-Path $testDir 'repo-anidado')
$restored = git -C (Join-Path $testDir 'repo-anidado') log --oneline -1

# 7. Informe final (si algo falló antes, throw detuvo la ejecución)
Write-Output "BACKUP OK: $fileCount archivos | hashes en $manifest | bundle: $bundleHash"
Write-Output "Restauración de prueba: $restored"
```

**Qué valida cada comprobación:**

| Paso | Comprobación | Qué asegura |
| --- | --- | --- |
| 2 (`robocopy`) | Código de salida `< 8` | Copia completa del árbol sin errores; `node_modules/` se excluye a propósito (se reinstala con `npm install`, documentado en el respaldo) |
| 3 (bundle) | `git bundle verify` → `ok` | El historial `63e18cf` queda íntegro, autocontenido e independiente del proyecto |
| 4 (manifest) | SHA-256 por archivo | Detección futura de cualquier alteración o corrupción del respaldo |
| 5 (comprobación) | Recuento > 0 y sin archivos de 0 bytes | El respaldo existe, es legible y no está truncado |
| 6 (restauración) | Clon del bundle + `git log` | El historial es recuperable en un entorno limpio, sin tocar el proyecto |
| 7 (corte) | `throw` ante cualquier fallo | **Nunca** se inicia un movimiento destructivo con un respaldo no verificado |

> El respaldo se ubica **fuera de la raíz** del proyecto por exigencia de D-17 (respaldo externo).
> Si `robocopy` no está disponible, se sustituye por `Copy-Item -Recurse` con la misma exclusión
> (`-Exclude` no cubre directorios recursivos; usar un filtro por nombre de directorio) y la misma
> verificación.

> **Refinamiento observado en la ejecución:** la prueba de restauración (paso 6) debe forzar
> `git clone --config core.autocrlf=false …`. Con el valor por defecto, el checkout materializa CRLF
> (`w/crlf`) y produce diferencias aparentes de hash sobre archivos que son idénticos en el índice.
> Con la opción explícita, los 17 archivos resultaron **byte-idénticos**.

### Anexo B — Plan de reorganización: rutas origen → destino (ejecutado en T-A3)

> **Ejecutado (T-A3, 2026-10-10).** Se trasladaron los **11 elementos previstos (17 archivos)** sin
> conflictos de nombres; `docs/`, `.atl/` y ambos `.git` intactos; `node_modules/` y el `.git`
> anidado no se trasladaron. Resultados en `docs/05-registro-decisiones.md`, sección 4.2.

| Origen (absoluto) | Destino (absoluto) | Tratamiento | Notas |
| --- | --- | --- | --- |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\src` | `C:\Proyectos\OrigenCafe\src` | Trasladar | Contenido del template; se reemplazará/añadirá en Fases B/C |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\public` | `C:\Proyectos\OrigenCafe\public` | Trasladar | `favicon.ico`, `favicon.svg` |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\astro.config.mjs` | `C:\Proyectos\OrigenCafe\astro.config.mjs` | Trasladar | Se modificará en Fase B (plugin Tailwind v4) |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\tsconfig.json` | `C:\Proyectos\OrigenCafe\tsconfig.json` | Trasladar | Mismo nombre; sin conflicto (no existe en la raíz) |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\package.json` | `C:\Proyectos\OrigenCafe\package.json` | Trasladar | Se ajustará en Fase B (nombre, scripts) |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\package-lock.json` | `C:\Proyectos\OrigenCafe\package-lock.json` | Trasladar | Debe moverse junto con `package.json` |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\.gitignore` | `C:\Proyectos\OrigenCafe\.gitignore` | Trasladar | No existe `.gitignore` en la raíz; sin conflicto |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\.vscode` | `C:\Proyectos\OrigenCafe\.vscode` | Trasladar | Extensiones y lanzamiento de depuración del template |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\AGENTS.md` | `C:\Proyectos\OrigenCafe\AGENTS.md` | Trasladar | Instrucciones de agentes del template; revisar contenido al implementar |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\CLAUDE.md` | `C:\Proyectos\OrigenCafe\CLAUDE.md` | Trasladar | Ídem |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\README.md` | `C:\Proyectos\OrigenCafe\README.md` | Trasladar | Se reemplazará con el README del proyecto (Fase B) |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\node_modules` | — (no se traslada) | **Eliminado (2026-10-10)** | Dependencias residuales eliminadas con autorización explícita (ver `docs/05-registro-decisiones.md`, sección 4.6). Se reinstala con `npm install` en la raíz |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope\.git` | — (no se traslada) | **Resuelto en T-A4** | Según la decisión sobre `63e18cf` (opción A: historial ya respaldado en bundle verificado) |
| `C:\Proyectos\OrigenCafe\terrestrial-telescope` (resto) | — (no se traslada) | **Conservar (vacío)** | Tras T-A3/T-A4 y la eliminación del `node_modules` residual, la carpeta está **vacía** y se conserva. No se elimina |
| `C:\Proyectos\OrigenCafe\docs` | `C:\Proyectos\OrigenCafe\docs` | **Conservar (no mover)** | Documentación SDD; intacta |
| `C:\Proyectos\OrigenCafe\.atl` | `C:\Proyectos\OrigenCafe\.atl` | **Conservar (no mover)** | Registro de skills del harness; intacto |
| `C:\Proyectos\OrigenCafe\.git` | `C:\Proyectos\OrigenCafe\.git` | **Conservar** | Repositorio principal (sin commits aún); no se toca en esta fase |

**Conflictos de nombres detectados:** ninguno. En la raíz no existen `src/`, `public/`,
`astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.gitignore`, `.vscode/`,
`AGENTS.md`, `CLAUDE.md` ni `README.md`. Los únicos elementos presentes en la raíz (`docs/`, `.atl/`,
`.git/`) se conservan o no se tocan. El único punto sensible es el `.git` anidado, que se resuelve
en T-A4 con decisión explícita y respaldo verificado previo.

### Anexo C — Higiene del repositorio y exclusiones de `.gitignore` (✅ ratificado en T-B9; **sin modificar**)

> **No se modifica `.gitignore` en esta tarea.** Se registra el análisis de las reglas actuales y las
> exclusiones pertinentes al *stack* (Astro, Node, Vite), conforme a la decisión del usuario de **no**
> añadir `.vs`, `bin` ni `obj` por mera convención de Visual Studio/.NET (DD-14,
> `docs/05-registro-decisiones.md`).

**Reglas actuales del `.gitignore` de la raíz** (heredadas del template): `dist/`, `.astro/`,
`node_modules/`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `pnpm-debug.log*`, `.env`,
`.env.production`, `.DS_Store`, `.idea/`.

| Categoría | Cubierto hoy | Pertinente para el stack (a valorar en Fase B) |
| --- | --- | --- |
| Astro | `dist/`, `.astro/` | `.vercel/output/` (si se despliega con el adapter de Vercel) |
| Node | `node_modules/` | `.npm/`, `.node_repl_history`, generalizar `*.log` |
| Vite | — | `.vite/` (caché; ya dentro de `node_modules/.vite`), `*.local` |
| Entorno | `.env`, `.env.production` | `.env.local`, `.env.*.local`; conservar un `.env.example` versionable |
| Pruebas | — | `coverage/` (si se añaden pruebas) |
| TypeScript | — | `*.tsbuildinfo` (si se habilita compilación incremental) |
| Sistema | `.DS_Store` | `Thumbs.db` (Windows) |
| Editor | `.idea/` | `.vscode/` se **conserva versionado** (config del proyecto); no se ignora |
| **No pertinente** | — | `.vs/`, `bin/`, `obj/` (**no aplicables** a Astro/Node; descartados por decisión del usuario) |

**Conclusión:** el `.gitignore` actual ya cubre lo esencial de Astro/Node; las filas marcadas como
"a valorar" son recomendaciones para la Fase B, **no** cambios aplicados. Cualquier modificación del
`.gitignore` requiere autorización expresa.

**Estado (T-B9, 2026-10-10):** ratificado **sin cambios**. Verificación con `git status --ignored
--short`: `dist/`, `.astro/` y `node_modules/` aparecen como ignorados (`!!`). La Fase B no requirió
ninguna modificación del `.gitignore`.

### Fase B — Configuración base (✅ **completada el 2026-10-10**)

> La Fase B **finalizó**: **T-B1 … T-B9 ejecutadas (2026-10-10)** con evidencia observable.
> Detalle de la ejecución real en `docs/05-registro-decisiones.md`, sección 4.8.

| ID | Tarea | Depende de | Traza a | Evidencia |
| --- | --- | --- | --- | --- |
| T-B1 | Ajustar `package.json`: `name` `origen-cafe`, `private: true`, `version` 0.1.0; conservar `type: module` y `engines.node >= 22.12.0`; scripts `dev`, `build`, `preview`, `astro` y `check`. | T-A5 | D-08, RNF-006 | ✅ **Ejecutada el 2026-10-10** — `package.json` con todos los campos exigidos (11/11 PASS); SHA-256 `E4494514…8B6E`. Solo se modificó `package.json`; ver sección 4.7 de `docs/05-registro-decisiones.md` |
| T-B2 | Añadir dependencias de desarrollo: `tailwindcss` + `@tailwindcss/vite`, `typescript`, `@astrojs/check`. | T-B1 | D-08, D-09, DD-08 | ✅ **Ejecutada el 2026-10-10** — devDeps: `@astrojs/check ^0.9.10`, `@tailwindcss/vite ^4.3.3`, `tailwindcss ^4.3.3`, `typescript ^6.0.3`; 282 paquetes, 0 vulnerabilidades. `typescript` se fija en `^6` porque `astro check` no soporta TypeScript 7 (ver sección 4.8) |
| T-B3 | Configurar Tailwind CSS v4 como *plugin* de Vite en `astro.config.mjs` (`vite.plugins`). | T-B2 | DD-08 | ✅ **Ejecutada** — `astro.config.mjs` con `vite.plugins: [tailwindcss()]` |
| T-B4 | Crear `src/styles/global.css` con `@import "tailwindcss"` y bloque `@theme` (tokens de color y tipografía). | T-B3 | DD-08 | ✅ **Ejecutada** — `global.css` con `@theme` (tokens del diseño §10); utilidades y variables emitidas en el CSS del build |
| T-B5 | Crear `Layout.astro` base con `lang="es"`, charset, viewport, metadatos mínimos, import de `global.css` y `slot`, **sin** depender de `<ClientRouter />` para el estado. | T-B4 | DD-03, DD-11, RNF-004 | ✅ **Ejecutada** — `Layout.astro` (`lang="es"`, charset, viewport, `description`, `global.css`, `slot`; sin `ClientRouter`) |
| T-B6 | Fijar la estructura de carpetas y la convención de recursos: `src/components/`, `src/layouts/`, `src/lib/`, `src/data/`, `src/styles/`, `public/`. | T-B4 | DD-01, RNF-009 | ✅ **Ejecutada** — carpetas `src/lib/`, `src/data/` creadas; `index.astro` placeholder; `README.md` propio. Árbol conforme a la sección 5 |
| T-B7 | Montar el arranque de la **isla compartida** (`src/lib/island.ts` + contenedor `[data-island]` + `<script type="module">`) como *placeholder* **sin** lógica de negocio. | T-B5 | DD-02, DD-03 | ✅ **Ejecutada** — `src/lib/island.ts` + `[data-island="cart"]` + `<script type="module">`; compila en el build |
| T-B8 | Instalar dependencias y verificar: `npm run check` sin errores y `npm run build` genera `dist/`. | T-B2, T-B3, T-B4, T-B5, T-B6, T-B7 | RNF-002, RNF-006 | ✅ **Ejecutada** — `npm run check`: 6 archivos, 0 errores/warnings/hints; `npm run build`: 1 página → `dist/` (`index.html` + CSS 8.551 B con tokens y utilidades); `package-lock.json` reconciliado a `origen-cafe`/`0.1.0` |
| T-B9 | Documentar la higiene del repositorio y las exclusiones de `.gitignore` (Anexo C); **no** modificar `.gitignore` sin autorización. | T-A5 | RNF-009 | ✅ **Ejecutada** — Anexo C ratificado; `.gitignore` **sin cambios**; `git status --ignored` muestra `dist/`, `.astro/` y `node_modules/` ignorados |

**Detalle de la Fase B**

| Aspecto | Contenido |
| --- | --- |
| **Archivos previstos** | `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` (alias de import si aplica), `src/styles/global.css` (nuevo), `src/layouts/Layout.astro` (reemplaza el del template), `src/pages/index.astro` (placeholder mínimo), `src/lib/island.ts` (arranque placeholder), `README.md` (reemplazo). |
| **Dependencias** | Externas: `astro` (ya presente), `tailwindcss`, `@tailwindcss/vite`, `typescript`, `@astrojs/check`. Requisito: Node `>= 22.12.0`. Sin dependencias de framework de UI (DD-02). |
| **Riesgos** | Integración Tailwind v4 ↔ Vite (DD-08); `astro/tsconfigs/strict` más exigente de lo esperado; artefactos generados (`.astro/`, `dist/`) versionados por error (RNF-009, P-08); *placeholder* de isla que rompa el build. |
| **Verificaciones** | `npm install` sin errores; `npm run check` limpio; `npm run build` genera `dist/`; página mínima en español; `git status --ignored` muestra `node_modules/`, `dist/` y `.astro/` como ignorados. |
| **Condiciones de salida** | Build y `check` funcionan; layout mínimo renderiza; estructura de carpetas igual a la sección 5 del diseño; sin dependencias injustificadas; la Fase C puede comenzar. |

> **Nota de coherencia (T-B1, resuelta en T-B8):** tras T-B1 el lock conservaba
> `terrestrial-telescope` / `0.0.1`; **T-B8 lo reconcilió** a `origen-cafe` / `0.1.0` mediante
> `npm install`. Ver `docs/05-registro-decisiones.md`, sección 4.8.

### Fase C — Implementación por requisito

> **Habilitada:** DD-02 y DD-03 fueron ratificadas (ver `docs/05-registro-decisiones.md` y
> `docs/03-diseno-arquitectura.md`, sección 16).

> **Estado (2026-10-10): ejecutada (T-C1 … T-C12).** Implementada por un único escritor con los
> archivos previstos. Evidencias: `npm run check` 23 archivos 0/0/0; `npm run build` 9 páginas;
> `npm run preview` con `/` 200, detalle 200, id desconocido 404. Detalle en
> `docs/05-registro-decisiones.md`, sección 4.9.

| ID | Tarea | Depende de | Traza a | Evidencia |
| --- | --- | --- | --- | --- |
| T-C1 | Datos de demostración tipados: `src/lib/types.ts` y `src/data/cafes.ts` con valores ficticios. | T-B8 | RF-001, D-12, DD-04 | `astro check` sin errores de tipos |
| T-C2 | Aviso de demostración reutilizable (`DemoNotice.astro`) y microcopy junto a precios. | T-C1 | RF-010, DD-06 | Aviso visible en las ubicaciones previstas |
| T-C3 | `Header.astro`, `Footer.astro` y navegación global. | T-B8 | RF-009 | Navegación funcional entre `/` y secciones |
| T-C4 | Catálogo estático (`Catalog.astro`, `CafeCard.astro`) sobre `cafes.ts`. | T-C1, T-C3 | RF-001 | Todas las tarjetas se renderizan |
| T-C5 | Filtros combinables (`Filters.astro`) con `CatalogFilters`. | T-C4, DD-12 | RF-002 | CA-003 … CA-005, CA-040 |
| T-C6 | Ruta de detalle `/cafes/[id].astro` con `getStaticPaths`. | T-C1 | RF-003, CA-041, DD-07 | URL profunda abre el café correcto |
| T-C7 | *Store* del carrito con **persistencia y validación** (`cart-store.ts`): clave propia versionada en `localStorage`, `load()` con recuperación segura (JSON inválido → vacío; ítems inválidos → descartados; sin almacenamiento → modo memoria), más drawer (`CartDrawer.astro`). | T-B8, T-C1, DD-02, DD-03, DD-13 | RF-004, CA-009 … CA-011, CA-042, CA-045 … CA-048, RNF-012 (CA-050) | Agregar/eliminar/ajustar; el carrito persiste entre rutas y recargas; un `JSON` corrupto se recupera sin romper la interfaz |
| T-C8 | Resumen y totales en COP (`OrderSummary.astro`, `format.ts`). | T-C7, DD-05 | RF-005, CA-043 | Total en COP con aviso demo |
| T-C9 | Pedido simulado (confirmación sin red) y reinicio del carrito (`clear()` persistido). | T-C8, DD-10 | RF-006, CA-014 … CA-016 | Confirmación visible; carrito vacío luego |
| T-C10 | Sección de origen (`OriginSection.astro`) con contenido ficticio. | T-C1 | RF-007 | Sección presente y etiquetada como demo |
| T-C11 | Formulario de contacto con validación en cliente y envío simulado. | T-B8, DD-10 | RF-008, RNF-003 | Validación y confirmación sin red |
| T-C12 | Tema/tokens, pulido responsivo y accesibilidad final. | T-C4 … T-C11 | RNF-001, RNF-003, RNF-007, DD-08, DD-09 | Secciones 11 y 12 de `docs/03-diseno-arquitectura.md` cumplidas |

**Detalle de la Fase C**

| Aspecto | Contenido |
| --- | --- |
| **Archivos previstos** | `src/lib/types.ts`, `src/lib/format.ts`, `src/lib/cart-store.ts`, `src/lib/catalog-filters.ts`, `src/lib/island.ts` (ampliado), `src/data/cafes.ts`, `src/components/{DemoNotice,Header,Footer,Catalog,CafeCard,Filters,CartDrawer,OrderSummary,OriginSection,ContactForm}.astro`, `src/pages/index.astro`, `src/pages/cafes/[id].astro`, `src/layouts/Layout.astro`. |
| **Dependencias** | Ninguna nueva: TypeScript *vanilla*, sin framework de UI (DD-02); sin red ni backend (DD-10). |
| **Riesgos** | Deriva diseño ↔ código (P-04); persistencia y recuperación del carrito (P-05, DD-13); filtros combinables (DD-12); datos/comercio ficticios que parezcan reales (D-02, D-12). |
| **Verificaciones** | Por requisito (CA de RF-001 … RF-010); carrito persistente entre rutas y recargas; recuperación ante `JSON` inválido; filtros combinables; formulario validado sin envío real. |
| **Condiciones de salida** | RF-001 … RF-010 implementados y trazables a componentes del diseño; sin errores de `check`; accesibilidad base y responsive aplicados. |

### Fase D — Verificación

> **Estado (2026-10-10): ejecutada.** `npm run check` (0 errores) y `npm run build` (9 páginas) OK;
> `npm run preview` OK. Recorrido de CA-001 … CA-050: **24 CUMPLE, 0 NO CUMPLE, 26 NO VERIFICABLE
> EJECUTABLEMENTE** (comportamiento de JS de cliente/navegador). **Limitación:** no hay *runner* de
> tests ni navegador automatizado, por lo que T-D4/T-D5/T-D6 no son verificables ejecutablemente.
> Detalle en `docs/05-registro-decisiones.md`, sección 4.9.

| ID | Tarea | Depende de | Traza a | Evidencia |
| --- | --- | --- | --- | --- |
| T-D1 | Ejecutar `npm run check` sin errores. | Fase C | RNF-006, CA-035 | Salida del comando |
| T-D2 | Ejecutar `npm run build` sin errores. | Fase C | RNF-002, DD-01 | `dist/` generado |
| T-D3 | Recorrer los criterios de aceptación (CA-001 … CA-050) manualmente, incluida la recuperación ante `JSON` inválido (CA-046 … CA-048). | T-D2 | Especificación | Tabla de resultados por CA (cumple/no cumple) |
| T-D4 | Revisión responsiva en 360/768/1280 px. | T-D2 | RNF-001, RNF-007 | Capturas o notas por breakpoint |
| T-D5 | Prueba de accesibilidad básica: teclado, foco, contraste, aria. | T-D2 | RNF-003, DD-09 | Lista de comprobaciones |
| T-D6 | Auditoría de rendimiento (Lighthouse) del build. | T-D2 | RNF-002 | Puntajes registrados |

**Detalle de la Fase D**

| Aspecto | Contenido |
| --- | --- |
| **Archivos previstos** | Ninguno de producto; se registran informes de resultados (p. ej. en `docs/` o un informe de verificación). |
| **Dependencias** | Herramientas de análisis (Lighthouse) ejecutadas localmente; no se añaden al proyecto. |
| **Riesgos** | Verificar "de memoria" sin ejecutar (regla de autonomía); confundir `check` con pruebas funcionales; falsos positivos de accesibilidad. |
| **Verificaciones** | `npm run check`, `npm run build`, recorrido de CA-001 … CA-050 (incl. CA-046 … CA-048), responsive 360/768/1280, accesibilidad (teclado/foco/contraste/aria), Lighthouse. |
| **Condiciones de salida** | CA evaluados con resultado por criterio; sin errores de `check` ni de build; responsive y accesibilidad verificados; puntajes de rendimiento registrados. |

### Fase E — Despliegue en Vercel

> **Estado (2026-10-10): desplegada.** T-E1 (*commits*) **no ejecutada** por restricción del mandato;
> T-E2/T-E3/T-E4 **cumplidas**. `vercel deploy --prod` → **Ready**; se añadió `vercel.json`
> (`framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`) porque Vercel **no
> detectó Astro**. URL pública: `https://origen-cafe-rouge.vercel.app` (`/` 200, detalle 200, id
> desconocido 404). Detalle y desviaciones en `docs/05-registro-decisiones.md`, sección 4.9.

| ID | Tarea | Depende de | Traza a | Evidencia |
| --- | --- | --- | --- | --- |
| T-E1 | Preparar el repositorio Git raíz y crear los *commits* de trabajo. **Requiere autorización.** | Fase D | RNF-009 | `git log` con commits; sin secretos |
| T-E2 | Verificar build de producción local (`npm run build` + `npm run preview`). | T-D2, T-E1 | RNF-002 | Preview local funcional |
| T-E3 | Crear/configurar el proyecto en Vercel y desplegar. **Requiere credenciales/autorización.** | T-E2 | Constitución (despliegue público) | Proyecto creado en Vercel |
| T-E4 | Verificar la URL pública y documentar la entrega. | T-E3 | Constitución | URL accesible; informe final |

**Detalle de la Fase E**

| Aspecto | Contenido |
| --- | --- |
| **Archivos previstos** | `README.md` (instrucciones de build/despliegue); `.vercel/` **no** se versiona; configuración del proyecto en Vercel. |
| **Dependencias** | Cuenta/acceso a Vercel y credenciales (**requieren autorización**); Vercel CLI opcional. |
| **Riesgos** | Versionar secretos (`.env*`) o artefactos (`dist/`, `.vercel/`); desplegar sin build de producción verificado; confundir el despliegue con la entrega. |
| **Verificaciones** | Build de producción local (`npm run build` + `npm run preview`); `git log` sin secretos; URL pública responde y renderiza. |
| **Condiciones de salida** | URL pública accesible; entrega documentada. **Puertas separadas:** los *commits*/*push* (T-E1) y el despliegue (T-E3) requieren autorización explícita e independiente. |

### Fase F — Cierre académico definitivo (✅ ejecutada el 2026-10-13)

| Tarea | Resultado verificado |
| --- | --- |
| T-F1 — Runner mínimo de pruebas | `npm install -D vitest jsdom --no-audit --no-fund`: 43 paquetes; `vitest.config.ts` (environment `jsdom`, `tests/**/*.test.ts`); scripts `test`/`test:watch` (DD-17) |
| T-F2 … T-F5 — Suite de pruebas | `tests/{format,catalog-filters,cart-store,markup}.test.ts` → **76/76 PASS** (1.27 s). Detectó un bug real: una consulta de búsqueda de solo espacios (`'   '`) trataba el filtro como activo; corregido con trim + colapso de espacios en `cafeMatchesQuery` (RED→GREEN) |
| T-F6 — Activos gráficos propios | `scripts/generate-cafe-art.mjs` genera **10 SVG autorales** en `public/images/` derivando de `src/data/cafes.ts` (fuente única); `cafes.ts` pasa a `image: '/images/cafe-<id>.svg'` (DD-15) |
| T-F7 — Búsqueda de catálogo | Eje `query` en `catalog-filters.ts` (`normalizeForSearch` sin acentos, `cafeMatchesQuery`); `input[type=search]` en `Filters.astro`; listener `input` en la isla; combinable con los 3 filtros (DD-16, extiende RF-002 → CA-051) |
| T-F8 — Interfaz, imágenes, a11y y responsive | SVG inline reemplazados por `<img>` (alt con significado; lazy en tarjetas, eager en detalle); `Hero`/`OriginSection` con los gráficos; `theme-color`, `<noscript>` y fuentes del sistema; `robots.txt`; **página 404** → `dist/404.html`; copy del aviso "sin resultados" coherente con los controles |
| T-F9 — Gates | `npm run check` → **30 archivos, 0 errores/avisos** (incluye `tests/`) · `npm run build` → **10 páginas, exit 0** · `npm run test` → **76/76, exit 0** |
| T-F10 — Documentación | 04 → 0.9.0 (tabla de fases corregida, esta sección); 05 → 0.8.0 (DD-15/16/17 + sección 4.10); 02 → 0.4.0 (CA-051); 03 → 0.2.3; ODD de cierre actualizado |
| T-F11 — Despliegue final | `vercel --prod` → **Ready**; verificación pública de `https://origen-cafe-rouge.vercel.app` tras el deploy |
| T-F12 — Informe final y cierre | Informe consolidado (completado vs. bloqueado), límites honestos (CA-027/028/030/032/034) y estado RDD registrado como **bloqueado** (consentimiento sin respuesta; sin veredicto fabricado) |

**Puertas:** sin puertas humanas adicionales; el mandato de cierre del 2026-10-13 autoriza el
alcance y su ítem 10 autoriza el despliegue. **Límites declarados:** no se ejecutó navegador real
(Lighthouse/UX/teclado); la evidencia es estática (inspección, `astro check`, build) y de tests
jsdom.

## 4. Matriz de dependencias (resumen)

```
T-A1 → T-A2 → T-A2.1 → T-A2.2 → T-A2.3 → T-A3 → T-A4 → T-A5
T-A5 → T-B1 → T-B2 → T-B3 → T-B4 → T-B5 → T-B7 → T-B8
              T-B1 → T-B2 → T-B6 ;  T-B2, T-B3, T-B4, T-B5, T-B6, T-B7 → T-B8
              T-A5 → T-B9
T-B8 → T-C1 → T-C2 ; T-C1 → T-C4 (junto a T-C3) ; T-C4 → T-C5
T-B8 → T-C3 ; T-C1, T-C3 → T-C4 ; T-C1 → T-C6 ; T-C1, T-B8 → T-C7 → T-C8 → T-C9
T-C1 → T-C10 ; T-B8 → T-C11 ; T-C4..T-C11 → T-C12
T-C12 → T-D1 → T-D2 → T-D3..T-D6 → T-E1 → T-E2 → T-E3 → T-E4
T-E4 → T-F1 → T-F2..T-F5 ; T-F1 → T-F6 ; T-F6 → T-F7 ; T-F1, T-F7 → T-F8 ; T-F8 → T-F9
T-F9 → T-F10 → T-F11 → T-F12
```

## 5. Estrategia de verificación y pruebas

- **Estática:** `npm run check` (tipos) y `npm run build` (compilación) en cada cierre de fase.
- **Funcional:** recorrido manual de CA-001 … CA-050, registrado con resultado por criterio,
  incluida la prueba de recuperación con `JSON` corrupto en `localStorage` (CA-046 … CA-048).
- **Pruebas automáticas (Fase F, T-F1):** suite **Vitest + jsdom** (`npm run test`) que cubre formato
  COP, filtros y búsqueda, persistencia/recuperación del carrito y marcado accesible: **76/76 en
  verde** (T-F2 … T-F5). El runner mínimo (DD-17) se documentó como excepción técnica autorizada por
  el mandato de cierre (ítem 7).
- **Responsive:** inspección visual por breakpoint (sección 11 del diseño).
- **Accesibilidad:** navegación por teclado, foco, contraste y roles (sección 12 del diseño).
- **Rendimiento:** Lighthouse sobre el build de producción.
- No se declaran resultados que no se hayan observado realmente (regla de autonomía); ninguna fase
  se marca completada sin su evidencia.

## 6. Puertas de autorización humana

| Puerta | Momento | Qué se necesita |
| --- | --- | --- |
| Ratificación de diseño | Antes de la Fase C | ✅ **Cumplida** — DD-02 y DD-03 aprobadas (2026-10-10); registro en `docs/05-registro-decisiones.md` |
| Reorganización y Git | Fase A (T-A3, T-A4) | ✅ **Cumplida** — Fase A ejecutada (2026-10-10): respaldo verificado (T-A2 … T-A2.3), traslado (T-A3) y opción A aplicada sobre el `.git` anidado (T-A4) |
| Commits / push | Fase E (T-E1) | Autorización explícita de versionar y publicar |
| Despliegue | Fase E (T-E3) | ✅ **Cumplida** — deploy autorizado por el mandato de cierre (ítem 10) y ejecutado en la Fase E (2026-10-10) y en la Fase F (T-F11, 2026-10-13) |

## 7. Riesgos del plan

| ID | Riesgo | Mitigación |
| --- | --- | --- |
| P-01 | Pérdida de archivos al mover el scaffold. | T-A2 (respaldo externo) + T-A2.1 (hashes SHA-256) + T-A2.3 (prueba de restauración) + T-A5 (verificación posterior). |
| P-02 | Confusión con el repositorio Git anidado. | Historial conservado en bundle verificado (T-A2.2) + T-A4 con decisión explícita antes de tocar `.git`. |
| P-03 | Cambio de alcance durante la ejecución. | Trazar cada tarea a un requisito; cambios fuera de alcance requieren autorización. |
| P-04 | Deriva entre diseño y código durante Fase C. | Diseño ratificado (DD-02/DD-03); verificar cada tarea contra `docs/03-diseno-arquitectura.md`. |
| P-05 | Datos persistidos corruptos o incompatibles rompen la app. | `cart-store` con validación y recuperación segura (T-C7, DD-13) verificadas en T-D3. |
| P-06 | Integración de Tailwind v4 ↔ Vite mal configurada. | Verificar el *plugin* en `astro.config.mjs` con un build de prueba (T-B3, T-B4). |
| P-07 | Versión de Node insuficiente para Astro. | `engines.node >= 22.12.0` fijado en `package.json` (T-B1). |
| P-08 | Versionar artefactos generados (`dist/`, `.astro/`, `node_modules/`) o secretos. | ✅ Verificado en T-B9: el `.gitignore` los excluye (`git status --ignored`); Anexo C. |
| P-09 | Publicar sin verificación de build de producción. | Puertas separadas de *commit*/*push* (T-E1) y despliegue (T-E3). |

## 8. Criterios de salida por fase

- **Fase A:** ✅ **Cumplida (2026-10-10)** — estructura final igual a la sección 5 del diseño; `docs/`
  y `.atl/` intactos; respaldo externo verificado (T-A2 … T-A2.3: copia íntegra, manifest SHA-256,
  bundle verificado y prueba de restauración) registrado; decisión sobre el historial `63e18cf`
  documentada (opción A); `git status` de la raíz sin repo anidado ni gitlink; **dependencias
  residuales eliminadas** (`terrestrial-telescope\node_modules`, 2026-10-10; la carpeta
  `terrestrial-telescope\` se conserva vacía).
- **Fase B:** ✅ **Cumplida (2026-10-10)** — `npm run build` y `npm run check` funcionan (0 errores);
  layout mínimo en español renderiza; estructura de carpetas igual a la sección 5 del diseño;
  `.gitignore` sin artefactos versionables (Anexo C ratificado).
- **Fase C:** ✅ **Cumplida (2026-10-10)** — RF-001 … RF-010 implementados y trazables a componentes
  del diseño, con persistencia y recuperación del carrito verificadas (CA-042, CA-045 … CA-048,
  CA-050).
- **Fase D:** ✅ **Cumplida (2026-10-10)** — CA-001 … CA-050 evaluados (24 cumplen / 0 fallan /
  26 no verificables sin navegador). En la **Fase F** la verificación se refuerza con la **suite de
  tests ejecutable** (76/76): la mayoría de las CA antes no verificables quedan cubiertas; quedan
  como **límite declarado** las que exigen navegador real o Lighthouse (CA-027, CA-028, CA-030,
  CA-032, CA-034).
- **Fase E:** ✅ **Cumplida (2026-10-10 y re-verificada en T-F11, 2026-10-13)** — URL pública de
  Vercel accesible y verificada; entrega documentada.
- **Fase F:** ✅ **Cumplida (2026-10-13)** — suite Vitest **76/76**; `astro check` 30 archivos
  0/0/0; `npm run build` **10 páginas** exit 0; copy del aviso sin resultados coherente con los
  nuevos controles; docs 02…05 y ODD actualizadas; despliegue final verificado.

## 9. Historial de cambios

| Versión | Fecha | Descripción |
| --- | --- | --- |
| 0.1.0 | 2026-10-10 | Creación del documento. Organiza el trabajo en cinco fases (A–E) con tareas, dependencias, trazabilidad, puertas humanas y criterios de salida. Fase C queda bloqueada hasta ratificar DD-02/DD-03. |
| 0.2.0 | 2026-10-10 | DD-02/DD-03 **ratificadas**: Fase C queda habilitada y la puerta de ratificación se marca cumplida. Se incorpora la protección de la Fase A (T-A2 verificación de integridad, D-17), la persistencia del carrito en `localStorage` con recuperación segura (T-C7, DD-13), la extensión de la verificación a CA-046 … CA-050 y el estado "no ejecutada" explícito para todas las fases. Se actualizan las referencias a `docs/03-diseno-arquitectura.md` y `docs/05-registro-decisiones.md`. |
| 0.3.0 | 2026-10-10 | **Inspección documental de ambos repositorios Git** (2026-10-10): evidencias registradas — raíz en `master` sin commits; anidado con el único commit raíz `63e18cf` (autor `houston[bot]`), sin remotos/etiquetas/ramas adicionales, `git fsck` íntegro. Se diseña el procedimiento de respaldo previo a la Fase A (Anexo A: copia externa, bundle + `git bundle verify`, manifest SHA-256, prueba de restauración y corte ante fallo) y el plan de reorganización con rutas absolutas (Anexo B). La puerta de la Fase A se extiende a la decisión sobre el historial `63e18cf` (recomendación de opción A en `docs/05-registro-decisiones.md`). T-A1 queda marcada como ejecutada; el resto de la Fase A permanece **no ejecutado**. |
| 0.4.0 | 2026-10-10 | **Fase A ejecutada y verificada** (T-A2 … T-A5, con autorización explícita por tarea). Se registran los resultados reales: respaldo externo verificado (manifest 94/94, bundle `is okay`, restauración 17/17 byte-idéntica con `core.autocrlf=false`); traslado de 11 elementos / 17 archivos con 17/17 SHA-256 coincidentes; retiro del `.git` anidado a cuarentena (opción A aplicada) y conservación de `63e18cf` por tres vías; verificación posterior T-A5 con hallazgo (`.vs`/`bin`/`obj` ausentes de `.gitignore`, no aplicables). La Fase A se marca como **ejecutada**; la **Fase B permanece pendiente y no iniciada**; se dejan explícitas las decisiones pendientes (carpeta residual `terrestrial-telescope\node_modules`). |
| 0.5.0 | 2026-10-10 | **Plan detallado de la Fase B** (no iniciada): se amplían las tareas T-B1 … T-B9 (ajuste de `package.json`, Tailwind v4 vía Vite, `astro check`, `global.css`/`@theme`, `Layout.astro`, estructura de carpetas, arranque de la isla compartida, build inicial e higiene) y se añaden bloques de **detalle por fase** (B, C, D y E) con archivos previstos, dependencias, riesgos, verificaciones y condiciones de salida. Nuevo **Anexo C** con el análisis de higiene y exclusiones de `.gitignore` (sin modificar el archivo; `.vs`/`bin`/`obj` descartados por decisión del usuario). Se registra la **eliminación de las dependencias residuales** `terrestrial-telescope\node_modules` (2026-10-10). La Fase B queda **planificada pero no iniciada**. |
| 0.6.0 | 2026-10-10 | **T-B1 ejecutada (inicio de la Fase B).** `package.json` ajustado: `name` `origen-cafe`, `version` 0.1.0, `private: true`; conservados `type: module` y `engines.node >= 22.12.0`; scripts `dev`/`build`/`preview`/`astro`/`check`. Verificación por contenido (11/11 PASS); `package-lock.json` **no** modificado (drift de identidad pendiente de T-B8). La Fase B pasa a **en ejecución** (T-B2 … T-B9 pendientes). |
| 0.7.0 | 2026-10-10 | **Fase B completada (T-B1 … T-B9).** DevDeps instaladas (`tailwindcss`, `@tailwindcss/vite`, `typescript ^6.0.3`, `@astrojs/check`; 282 paquetes, 0 vulnerabilidades); Tailwind v4 como *plugin* de Vite (`astro.config.mjs`); `src/styles/global.css` con `@theme`; `Layout.astro` base en español; estructura de carpetas y `README.md`; *placeholder* de la isla compartida (`src/lib/island.ts`). Verificado: `npm run check` 6 archivos sin errores y `npm run build` 1 página → `dist/` (tokens y utilidades compilados); `package-lock.json` reconciliado a `origen-cafe`/`0.1.0`. Anexo C ratificado sin modificar `.gitignore`. La **Fase C** queda habilitada. |
| 0.9.0 | 2026-10-13 | **Fase F ejecutada (cierre académico).** Nueva sección 3 (Fase F) con la ejecución T-F1 … T-F12: suite Vitest + jsdom **76/76** (bug real corregido: búsqueda con solo espacios), 10 SVG autorales (DD-15), búsqueda combinable (DD-16, CA-051), página 404, gates `check` 30/0/0 + build 10 páginas, docs actualizadas y despliegue final verificado en Vercel. La tabla de fases y los criterios de salida se corrigen para reflejar el estado real (las fases B … E ya estaban ejecutadas; T-E1 sigue **fuera de alcance**). Se registran los límites declarados (CA-027/028/030/032/034) y el estado RDD **bloqueado**. |
| 0.8.0 | 2026-10-10 | **Fases C, D y E ejecutadas (segunda corrida).** Fase C implementada (T-C1 … T-C12) por un único escritor: `types.ts`, `format.ts`, `catalog-filters.ts`, `cart-store.ts`, `cafes.ts` (8 cafés ficticios), isla ampliada y 11 componentes; rutas `/` y `/cafes/[id]`. Fase D: `check` 23 archivos 0/0/0; `build` 9 páginas; `preview` 200/200/404; CA-001 … CA-050 → **24 cumplen, 0 fallan, 26 no verificables ejecutablemente**. Fase E: `vercel deploy --prod` → **Ready**; se añadió `vercel.json` (`framework: astro`, `outputDirectory: dist`) porque **Vercel no detectó Astro**; URL pública `https://origen-cafe-rouge.vercel.app`. **T-E1 (_commits_) fuera de alcance** por restricción del mandato. La revisión RDD pendiente se resolvió (abandonada con razón documentada). Detalle en `docs/05-registro-decisiones.md`, sección 4.9. |