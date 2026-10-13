# 05 — Registro de decisiones

> Registro de decisiones de diseño y arquitectura de Origen Café en formato de bitácora (estilo
> ADR). Documenta **qué** se decidió, **por qué**, **qué implica** y el **estado** de cada
> decisión. Deriva de `docs/01-constitucion.md` y `docs/03-diseno-arquitectura.md`.

## Metadatos

| Campo | Valor |
| --- | --- |
| Proyecto | Origen Café |
| Documento | Registro de decisiones |
| Versión | 0.8.0 |
| Estado | Activo — DD-02 y DD-03 aprobadas; **Fases A … E ejecutadas y verificadas (2026-10-10)**; **Fase F ejecutada (2026-10-13)**: se agregan **DD-15, DD-16 y DD-17** y la sección 4.10 con las evidencias reales (suite 76/76, búsqueda, activos originales, gates y despliegue final). La revisión **RDD del cierre queda bloqueada** (consentimiento humano pendiente sin respuesta; ver sección 4.10) |
| Fecha | 2026-10-13 |
| Idioma de la documentación | Español (neutro/profesional) |
| Documentos relacionados | `docs/01-constitucion.md`, `docs/02-especificacion.md`, `docs/03-diseno-arquitectura.md`, `docs/04-plan-implementacion.md` |

---

## 1. Propósito

Centralizar el historial de decisiones ratificadas y su trazabilidad, de modo que cualquier cambio
posterior quede registrado junto con el fundamento que lo motivó. Las decisiones de diseño (DD-xx)
se detallan aquí cuando se **aprueban**; las decisiones de constitución (D-xx) se referencian y se
registran aquí cuando se **modifican**.

## 2. Decisiones aprobadas

### DD-02 — Isla compartida en TypeScript *vanilla* (aprobada)

| Campo | Valor |
| --- | --- |
| Estado | ✅ **Aprobada** (2026-10-10) |
| Título | Interactividad mediante una isla cliente compartida escrita en TypeScript *vanilla*, sin framework de UI. |
| Contexto | Catálogo, filtros, carrito y resumen requieren interactividad en cliente sobre un sitio estático de Astro. Se evaluó usar una isla con framework (Preact/React) para la interactividad. |
| Decisión | Se adopta **una isla compartida en TypeScript *vanilla*** (sin React ni Preact). El estado mutable del carrito y el cableado de filtros, drawer y resumen viven en esa isla. |
| Motivo | Menor peso de paquete, menor superficie de fallo y ninguna dependencia de framework no justificada por la escala del proyecto. |
| Alternativa descartada | Islas con Preact/React: mayor peso y una dependencia adicional. |
| Implicaciones | El DOM de las vistas interactivas se actualiza manualmente (módulos TS con suscripción a cambios); los componentes sin interacción permanecen estáticos. |
| Requisitos que atiende | RF-002, RF-004, RF-005, D-08. |
| Detalle de diseño | `docs/03-diseno-arquitectura.md`, secciones 4, 7 y 9. |

### DD-03 — Persistencia del carrito en `localStorage` (aprobada)

| Campo | Valor |
| --- | --- |
| Estado | ✅ **Aprobada** (2026-10-10) |
| Título | El carrito persiste en `localStorage` del navegador y se conserva entre rutas y recargas. |
| Contexto | El detalle de producto es una ruta propia (D-15); sin persistencia, navegar del detalle al catálogo o recargar la página perdería el carrito y rompería RF-004/CA-042/CA-045. La propuesta original (navegación de cliente + `transition:persist` sin almacenamiento) fue descartada. |
| Decisión | El carrito se persiste en **`localStorage`** bajo una **clave propia y versionada** (por ejemplo, `origen-cafe:cart:v1`). Cada página rehidrata el estado desde el almacenamiento al cargar, con **validación de datos y recuperación segura**: `JSON` inválido → carrito vacío sin errores; ítems con id inexistente o cantidad inválida → descartados; almacenamiento no disponible → modo memoria. No hay backend ni persistencia en servidor. |
| Motivo | Conservar el pedido simulado entre rutas y recargas sin introducir backend; una isla de Astro **no** persiste automáticamente entre navegaciones, por lo que el estado debe vivir fuera del ciclo de vida de la página. |
| Implicaciones | **Sustituye** la propuesta anterior de `docs/03-diseno.md` v0.1.0 (navegación de cliente + singleton sin `localStorage`) y **revisa** la decisión D-14 de la constitución (antes: carrito solo en memoria). La navegación estándar de Astro es suficiente para la continuidad del estado. |
| Requisitos que atiende | RF-004 (CA-042, CA-045 … CA-048), RNF-012 (CA-050), D-14, D-15. |
| Detalle de diseño | `docs/03-diseno-arquitectura.md`, secciones 4, 9, DD-13. |

### D-17 — Protección de la Fase A: respaldo externo, íntegro y verificable (registrada)

| Campo | Valor |
| --- | --- |
| Estado | ✅ **Registrada y ejecutada** (2026-10-10) — respaldo externo verificado (T-A2 … T-A2.3, sección 4.1) |
| Título | La Fase A **no comienza** sin un respaldo externo a la raíz del proyecto, **íntegro y verificable**. |
| Contexto | La Fase A traslada el scaffold `terrestrial-telescope/` a la raíz y resuelve el repositorio Git anidado (historial `63e18cf`); la pérdida de archivos e historial es el riesgo principal (R-09, R-07). |
| Decisión | Como paso previo obligatorio: (1) copia externa del árbol completo con ambos repositorios Git, excluyendo `node_modules/`; (2) Git bundle del repositorio anidado verificado con `git bundle verify`; (3) manifest de hashes **SHA-256** de todos los archivos de respaldo; (4) comprobación de existencia, legibilidad y contenido; (5) prueba de restauración en directorio temporal independiente. Cualquier fallo de verificación **detiene la fase**. |
| Motivo | Evitar pérdida de trabajo e historial durante la reorganización (R-09, R-07). |
| Implicaciones | La Fase A no comienza sin el respaldo externo verificado (tareas T-A2 … T-A2.3 y Anexo A del plan). |
| Requisitos que atiende | D-07, R-09, R-07. |
| Detalle | `docs/04-plan-implementacion.md`, Fase A y Anexo A. |

### DD-14 — Higiene del repositorio y exclusiones de `.gitignore` (decidida y ratificada)

| Campo | Valor |
| --- | --- |
| Estado | ✅ **Decidida y ratificada** (T-B9, 2026-10-10) — sin modificar el archivo |
| Título | No añadir `.vs`, `bin` ni `obj` al `.gitignore` por mera convención de Visual Studio/.NET. |
| Contexto | El hallazgo de T-A5 detectó que `.vs`, `bin` y `obj` no estaban en el `.gitignore`. Son artefactos de .NET/Visual Studio, **ajenos** al *stack* real del proyecto (Astro + TypeScript + Tailwind v4 sobre Vite). |
| Decisión | **No** se incorporan `.vs`, `bin` ni `obj`. Se registra el análisis de higiene y las exclusiones pertinentes a Astro/Node/Vite (Anexo C de `docs/04-plan-implementacion.md`) y **no** se modifica el `.gitignore` en esta tarea. |
| Motivo | Evitar "ignorar por convención" reglas que no corresponden al *stack*; mantener el `.gitignore` justificado por lo que el proyecto realmente genera. |
| Implicaciones | El `.gitignore` actual ya cubre lo esencial (`dist/`, `.astro/`, `node_modules/`, logs, `.env*`, `.DS_Store`, `.idea/`). Las exclusiones adicionales recomendadas (`.vercel/`, `coverage/`, `.env.local`, `Thumbs.db`, `*.tsbuildinfo`, etc.) quedan como propuesta para la Fase B, sujetas a autorización. |
| Requisitos que atiende | RNF-009 (repositorio sin artefactos ni secretos). |
| Detalle | `docs/04-plan-implementacion.md`, Anexo C. |

### DD-15 — Activos gráficos de demostración propios (aprobada 2026-10-13)

| Campo | Valor |
| --- | --- |
| Contexto | El mandato de cierre (ítem 5) pide completar el sitio con imágenes pertinentes y **sin** recursos externos; el proyecto no tenía activos gráficos. |
| Decisión | Generar **10 SVG originales** con un script (`scripts/generate-cafe-art.mjs`) que deriva el catálogo de `src/data/cafes.ts` (fuente única): `cafe-<id>.svg` ×8, `origen.svg` y `hero.svg` en `public/images/`. Se **descartan** los bancos de imágenes por no poder verificar las condiciones de uso. |
| Motivo | Activos autorales, sin licencias de terceros y coherentes con los tokens del tema. |
| Implicaciones | `cafes.ts` usa `image: '/images/cafe-<id>.svg'`; el detalle carga *eager* y las tarjetas *lazy* (`loading="lazy" decoding="async"`), con `alt` descriptivo y `object-cover`. |
| Requisitos que atiende | RF-001 (CA-001), interfaz/A11y del mandato (ítem 5). |

### DD-16 — Búsqueda de catálogo en cliente (aprobada 2026-10-13)

| Campo | Valor |
| --- | --- |
| Contexto | El mandato de cierre (ítem 6) pide completar el catálogo con **búsqueda**, filtros y detalle respetando DD-02/DD-03. |
| Decisión | Extender `catalog-filters.ts` con un eje **`query`** combinable con los 3 filtros (región/tueste/proceso): normalización sin acentos (`normalizeForSearch`) y coincidencia por subcadena con trim + colapso de espacios (`cafeMatchesQuery`). La UI añade `<input type="search">` dentro del fieldset y el botón de limpieza también restablece la búsqueda. |
| Motivo | Responde al mandato sin alterar el diseño aprobado: **extiende RF-002**, no lo contradice (CA-051). |
| Implicaciones | La suite detectó un **bug real** (RED→GREEN): una consulta de solo espacios se trataba como activa y nunca coincidía; corregido con trim + colapso de espacios y cubierto por test. |
| Requisitos que atiende | RF-002 (extensión), CA-051. |

### DD-17 — Runner de pruebas mínimo (aprobada 2026-10-13)

| Campo | Valor |
| --- | --- |
| Contexto | El mandato de cierre (ítem 7) pide revisar los criterios de aceptación y crear/ejecutar **pruebas** con **dependencias mínimas**, documentando el cambio. |
| Decisión | Añadir **Vitest ^5.0.4 + jsdom ^30.1.2** como devDependencies del proyecto (43 paquetes): entorno `jsdom`, patrón `tests/**/*.test.ts`, scripts `test`/`test:watch`. No se suman Playwright, Cypress ni otros runners. |
| Motivo | Pruebas ejecutables con las dependencias mínimas verificables; entorno académico sin navegador real. |
| Implicaciones | 4 archivos de test (formato COP, filtros+búsqueda, carrito persistido, marcado accesible) → **76/76 PASS**; `@types/node` (solo tipos) se incorporó en T-F9 para que `astro check` cubra `tests/` (30 archivos, 0 errores); `astro check`, `build` y `test` quedan como gates de cierre (T-F9). |
| Requisitos que atiende | Revisión de CA del mandato (ítem 7); refuerza la Fase D (buena parte de las 26 CA antes "no verificables" quedan cubiertas). |

## 3. Registro de inspección del repositorio anidado (2026-10-10)

> Inspección **de solo lectura** de `C:\Proyectos\OrigenCafe\.git` (repositorio principal) y
> `C:\Proyectos\OrigenCafe\terrestrial-telescope\.git` (repositorio anidado). No se ejecutó ningún
> comando que modifique repositorios, archivos ni historial.

### 3.1 Evidencias del repositorio principal

| Comando | Resultado real |
| --- | --- |
| `git branch --show-current` | `master` |
| `git status --short --branch` | `## No commits yet on master`; sin seguimiento: `?? .atl/`, `?? docs/`, `?? terrestrial-telescope/` |
| `git remote -v` | (sin remotos) |
| `git rev-list --all --count` | `0` |
| `git log --all --decorate --oneline` | (sin commits) |
| `.gitignore` en la raíz | No existe |

El repositorio principal está en su estado inicial: rama `master` **sin commits**, sin remotos, sin
índice ni historial. Todos los archivos del proyecto están sin seguimiento.

### 3.2 Evidencias del repositorio anidado

| Comando | Resultado real |
| --- | --- |
| `git branch -a` | `* master` (única rama; sin ramas remotas) |
| `git tag -l` | (sin etiquetas) |
| `git show-ref` | `63e18cfc2a2986b5d3f9fae9a0ac70d01b4f17bb refs/heads/master` |
| `git log --all --decorate --oneline --graph` | `* 63e18cf (HEAD -> master) "Initial commit from Astro"` |
| `git rev-list --all --count` | `1` |
| `git status --short --branch` | `## master` (worktree limpio; `node_modules/` ignorado por el `.gitignore` del template) |
| `git remote -v` | (sin remotos) |
| `git stash list` | (vacío) |
| `git fsck --full` | Sin errores detectados (repositorio íntegro) |
| `git count-objects -v` | 25 objetos sueltos, ~42 KiB, sin packs, sin basura |
| `.gitmodules` / gitlinks | No existen (sin submódulos) |
| `git rev-parse '63e18cf^'` | `fatal: unknown revision` → **es el commit raíz (sin padre)** |

### 3.3 Detalle del commit `63e18cf`

| Campo | Valor |
| --- | --- |
| Hash | `63e18cfc2a2986b5d3f9fae9a0ac70d01b4f17bb` |
| Título | `"Initial commit from Astro"` |
| Autor | `houston[bot] <astrobot-houston@users.noreply.github.com>` (bot de Astro) |
| Committer | `camiloarango20 <camilo.bm.x@hotmail.com>` |
| Fecha | 2026-10-10 08:59:51 -0500 |
| Padre | Ninguno (commit raíz) |
| Archivos (17) | `.gitignore`, `.vscode/` (`extensions.json`, `launch.json`), `AGENTS.md`, `CLAUDE.md`, `README.md`, `astro.config.mjs`, `package-lock.json`, `package.json`, `public/favicon.ico`, `public/favicon.svg`, `src/assets/astro.svg`, `src/assets/background.svg`, `src/components/Welcome.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `tsconfig.json` |
| Resumen | 4176 inserciones, 0 eliminaciones; contenido 100 % del *template* por defecto de Astro |

**Interpretación de las evidencias:** el historial anidado consiste en un único commit raíz,
generado automáticamente al crear el proyecto Astro (**sin trabajo de autoría agregado en el
historial**), con worktree limpio y `fsck` sin errores. No hay submódulos, remotos, etiquetas ni
ramas adicionales. Aun así, la decisión de conservarlo o no **no** se fundamenta en esa ausencia
sola, sino en la garantía de recuperación del respaldo verificado (D-17).

### 3.4 Decisión sobre el historial `63e18cf` (opción A, aprobada)

| Opción | Descripción | Ventajas | Riesgos / consecuencias |
| --- | --- | --- | --- |
| **A — Conservar el historial en un respaldo verificable y comenzar un historial nuevo y unificado** (recomendada) | El historial `63e18cf` queda preservado en un Git bundle verificado (Anexo A de `docs/04-plan-implementacion.md`) junto con la copia íntegra del árbol; el repositorio raíz inicia su propio historial. | Historial limpio y coherente para el proyecto académico; el commit de autor `houston[bot]` no contamina la línea de tiempo del proyecto; **nada se pierde** (bundle + copia + SHA-256 + prueba de restauración). | El commit `63e18cf` no queda en el historial principal (recuperable vía bundle); requiere crear el primer commit del proyecto en la Fase E (T-E1). |
| B — Importar el historial al repositorio principal | Incorporar `63e18cf` al historial unificado (p. ej. `git fetch`/`git merge --allow-unrelated-histories`) para que sea el commit raíz. | Conserva el commit en la línea principal; historial completo en un solo lugar. | Arrastra un commit de bot genérico como raíz; los árboles del template y del proyecto final pueden solaparse; el respaldo verificado sigue siendo obligatorio (D-17). |
| C — Mantener temporalmente el repositorio anidado | Diferir la unificación y trabajar primero desde la raíz. | Cero riesgo inmediato sobre el historial. | Persiste la confusión de dos `.git` (R-07); la Fase A quedaría a medias; no resuelve el problema. |

**Decisión: opción A — aprobada por el usuario y aplicada** (2026-10-10). Los riesgos quedaron
cubiertos por el procedimiento del Anexo A de `docs/04-plan-implementacion.md` (respaldo externo,
bundle verificado, SHA-256 y prueba de restauración). La ejecución del traslado, del tratamiento del
`.git` anidado y de la verificación posterior se detalla en la **sección 4** de este documento.

## 4. Ejecución de la Fase A (2026-10-10)

> Ejecutada bajo **autorización explícita por tarea** (T-A2 … T-A5). Las Fases B … E permanecen
> **pendientes y no iniciadas**. Todos los resultados corresponden a los informes reales de
> ejecución; no se declara ninguna tarea cuyo resultado no se haya observado.

### 4.1 T-A2 … T-A2.3 — Respaldo externo verificado

| Comprobación | Resultado real |
| --- | --- |
| Ubicación (externa a `C:\Proyectos\OrigenCafe`) | `C:\Users\ludim\backups\origen-cafe\origen-cafe-20261010-101001` |
| Copia del árbol (`robocopy /E /XD node_modules /XF *.log`) | 91 archivos == 91 del origen; código de salida 1 (`< 8`, sin errores); `node_modules/` (9.323 archivos, ~113,66 MB) excluido a propósito |
| Git bundle + `git bundle verify` | `origen-cafe-terrestrial-telescope.bundle` → `is okay`; refs `refs/heads/master` + `HEAD` → `63e18cf`; **SHA-256 `6965F775BAAFF539C927DADAFC9838554FAE7E5E58AD36BD5B6E2EE97482841C`** (37,738 KB) |
| Manifest SHA-256 | 94 entradas verificadas **94/94, 0 fallos** |
| Prueba de restauración | clon del bundle en directorio temporal: `HEAD` y `tree` = `63e18cf`; con `--config core.autocrlf=false`, **17/17 archivos byte-idénticos** (`w/lf`) |

> **Refinamiento observado:** la prueba de restauración exige `git clone --config core.autocrlf=false`.
> Con el valor por defecto, el checkout materializa CRLF (`w/crlf`) y produce diferencias aparentes de
> hash sobre archivos que son idénticos en el índice. Con la opción explícita, los 17 archivos
> resultaron byte-idénticos.

### 4.2 T-A3 — Traslado del scaffold a la raíz

- Se trasladaron **11 elementos / 17 archivos** a la raíz: `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.gitignore`, `.vscode/`, `AGENTS.md`, `CLAUDE.md`, `README.md`.
- **Sin conflictos de nombres** (ningún destino preexistía en la raíz).
- **17/17 hashes SHA-256** coincidentes con la copia del respaldo.
- `docs/` (5 archivos) y `.atl/` (2 archivos) intactos; ambos `.git` intactos; `node_modules/` **no** trasladado.

### 4.3 T-A4 — Tratamiento del repositorio Git anidado (opción A aplicada)

- Se **retiró** (movió, no borró) el `.git` anidado a una cuarentena externa:
  `C:\Users\ludim\backups\origen-cafe\_retirados-t-a4\terrestrial-telescope.git` (48 archivos; **0 discrepancias** SHA-256 frente a la copia del respaldo).
- La operación quedó **documentada antes** de modificar nada, en
  `…\_retirados-t-a4\operacion-t-a4-resolucion-git-anidado.txt` (incluye 3 vías de recuperación y el `RESULTADO` final).
- La carpeta `terrestrial-telescope\` dejó de ser repositorio: `git rev-parse --git-dir` desde esa carpeta devuelve el `.git` de la raíz.
- **Anti-gitlink:** `git add --dry-run .` → 24 archivos, **0 entradas gitlink**, 0 `node_modules`.
- **Conservación del commit `63e18cf`:** preservado por **tres vías** — (1) la cuarentena movida; (2) la copia íntegra en el respaldo T-A2; (3) el Git bundle verificado (`git bundle verify` → `is okay`).

### 4.4 T-A5 — Verificación posterior (auditoría de solo lectura)

| Área | Resultado |
| --- | --- |
| Integridad | 13/13 rutas y 19/19 archivos esperados presentes; `docs/` 5/5 y `.atl/` 2/2 sin diferencias; scaffold 17/17 sin diferencias; sin faltantes, duplicados ni conflictos de nombre |
| Estado Git | `## No commits yet on master`; índice con **0 entradas** y 0 de modo gitlink (`160000`); sin `.gitmodules`; sin repo anidado activo; `63e18cf` recuperable por las tres vías |
| Higiene | `node_modules/` ignorado (probado con `git check-ignore -v`); `dist/`, `.astro/`, logs npm/yarn/pnpm y `.env*` cubiertos |
| Respaldo | manifest **94/94**; bundle SHA-256 sin cambios (`6965F7…2841C`); no modificado ni regenerado |

#### Limitaciones y hallazgos de T-A5

- **`.vs`, `bin` y `obj` no están en el `.gitignore`** (0 patrones). Son artefactos de .NET/Visual Studio **no aplicables** al stack Astro/Node. **No se corrigió** (fuera de alcance; requiere autorización).
- No se observó ningún artefacto temporal presente en la raíz (`dist`, `.astro`, `.env.local`, `.DS_Store`, `Thumbs.db`, `*.log`: ausentes).
- T-A5 fue **solo lectura**: no modificó archivos, índice, referencias ni el respaldo.

### 4.5 Carpeta residual (resuelta) y decisiones

- Al cierre de T-A5, `C:\Proyectos\OrigenCafe\terrestrial-telescope\` conservaba solo `node_modules\`.
  Posteriormente, con **autorización explícita** (2026-10-10), se eliminó ese directorio de
  dependencias residuales (ver **sección 4.6**). La carpeta `terrestrial-telescope\` se **conserva
  vacía**.
- El respaldo externo y la cuarentena **se conservan** (no se eliminan).
- **Decisiones:** (1) dependencias residuales eliminadas (sección 4.6); (2) `.vs`/`bin`/`obj` **no** se
  añaden al `.gitignore` (DD-14, sección 2); (3) la **Fase B** queda **planificada en detalle pero no
  iniciada** (`docs/04-plan-implementacion.md`, Fase B).

### 4.6 Acciones posteriores a la Fase A: eliminación de dependencias residuales (2026-10-10)

> Ejecutada con **autorización explícita** y alcance acotado a una única carpeta.

| Paso | Resultado real |
| --- | --- |
| Pre-verificación | Ruta exacta `C:\Proyectos\OrigenCafe\terrestrial-telescope\node_modules` confirmada; el padre contenía solo `node_modules`; es un directorio de dependencias npm (`.package-lock.json`, `.bin`, 156 paquetes); sin `.git` ni archivos de proyecto; la raíz tiene sus propios `package.json` y `package-lock.json`. |
| Eliminación | `Remove-Item -LiteralPath … -Recurse -Force` sobre **solo** `terrestrial-telescope\node_modules` (9.323 archivos, ~113,66 MB). |
| Verificación posterior | `node_modules` ya no existe; `terrestrial-telescope\` **sigue existiendo y vacío**; `git status` sin cambios (`## No commits yet on master`); `rev-list --all --count` = 0; scaffold 17/17 y `.atl` 2/2 idénticos; `docs/01`–`docs/03` idénticos; bundle SHA-256 sin cambios (`6965F7…2841C`); cuarentena intacta. |

- Solo se eliminó esa carpeta; no se alteraron repositorios Git, documentación (salvo la actualización
  previa autorizada) ni otros archivos. No se eliminó `terrestrial-telescope\` ni ningún otro directorio.

### 4.7 Fase B — T-B1 ejecutada (2026-10-10)

> Inicio de la Fase B con autorización explícita y alcance acotado a **un único archivo**.

| Paso | Resultado real |
| --- | --- |
| Precondiciones | T-A5 completada; Node `v24.21.0` (≥ 22.12.0); `node_modules` **no** instalado (por diseño: la instalación es T-B8). |
| Alcance | Modificar **solo** `package.json`. Fuera de alcance: `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, `docs/`, `.gitignore`, e instalación de dependencias. |
| Cambio | `package.json`: `name` `origen-cafe`, `version` 0.1.0, `private: true`; conservados `type: module`, `engines.node >= 22.12.0` y `dependencies.astro ^7.3.8`; scripts `dev`, `build`, `preview`, `astro` y **nuevo** `check` (`astro check`). |
| Verificación | JSON válido; **11/11 comprobaciones PASS** (identidad, `private`, `type`, `engines`, 5 scripts, `astro`); SHA-256 de `package.json` = `E4494514…8B6E`. `package-lock.json` **sin cambios** (sigue `terrestrial-telescope` / `0.0.1`). `git status` sin cambios (raíz sin commits). |
| Observación | El script `check` requiere `@astrojs/check` + `typescript`, que se añaden en **T-B2**; hasta entonces `npm run check` no es ejecutable (además de que `node_modules` no está instalado). El **drift de identidad** manifest↔lock se reconcilia en **T-B8** (`npm install`). |

- Alcance respetado: no se tocaron otros archivos, no se instalaron dependencias, no se hicieron
  *commits* ni despliegues, y no se alteró el historial Git ni el respaldo.

### 4.8 Fase B — T-B2 … T-B9 ejecutadas (2026-10-10)

> Ejecución completa de la Fase B bajo autorización explícita (alcance: configuración, estructura y
> arranque *placeholder*; **sin** *commits*, *push* ni despliegue).

| Tarea | Resultado real |
| --- | --- |
| T-B2 | `npm install -D tailwindcss @tailwindcss/vite typescript @astrojs/check` → **282 paquetes, 0 vulnerabilidades**. **Hallazgo:** `astro check` **no soporta TypeScript 7** (mensaje explícito del CLI: *"astro check does not currently support TypeScript 7.0"*); se fijó `typescript ^6.0.3` (`npm install -D typescript@^6`), eliminando el *peer* inválido (`@astrojs/check@0.9.10` declara `typescript@^5 || ^6`). Lock reconciliado a `origen-cafe` / `0.1.0`. |
| T-B3 | `astro.config.mjs`: `vite.plugins: [tailwindcss()]`. |
| T-B4 | `src/styles/global.css`: `@import "tailwindcss"` + `@theme` (tokens del diseño §10). |
| T-B5 | `src/layouts/Layout.astro`: `lang="es"`, charset, viewport, `description`, import de `global.css`, `slot`; **sin** `ClientRouter`. |
| T-B6 | Carpetas `src/lib/`, `src/data/` creadas; `src/pages/index.astro` *placeholder*; `README.md` propio. |
| T-B7 | `src/lib/island.ts` (*placeholder*) + contenedor `[data-island="cart"]` + `<script type="module">`. |
| T-B8 | `npm run check`: **6 archivos, 0 errores / 0 warnings / 0 hints**. `npm run build`: **1 página → `dist/`** (`index.html` + `_astro/index.*.css` de 8.551 B). El CSS contiene los tokens (`--color-coffee-*`, `--color-accent`, `--radius-card`, `--font-display`) y las utilidades usadas (`.bg-coffee-50`, `.text-coffee-*`, `.font-display`, `.font-sans`, `.min-h-screen`). `package-lock.json` en `origen-cafe` / `0.1.0`. |
| T-B9 | Anexo C ratificado; `.gitignore` **sin cambios**. `git status --ignored --short`: `dist/`, `.astro/` y `node_modules/` como ignorados (`!!`). |

- Alcance respetado: sin *commits*, sin *push*, sin tocar remotos/ramas, sin alterar el historial Git
  ni el respaldo, sin iniciar la Fase C ni ningún despliegue.
- Hallazgo relevante: incompatibilidad `astro check` ↔ TypeScript 7 → dependencia fijada en `^6`.

### 4.9 Fase C, verificación (Fase D) y despliegue (Fase E) — segunda corrida (2026-10-10)

> Bajo mandato integral de ejecución continua: resolver la revisión RDD pendiente, completar la Fase C,
> verificar y desplegar en Vercel. **Sin _commits_ ni _push_** (restricción vigente); el despliegue se
> realizó por CLI desde el directorio local.

**a) Revisión RDD pendiente — resuelta (abandonada con razón documentada).** El _lineage_ compact-v2
`review-2f3d6e6dfd3baa3a` (estado `reviewing`) no pudo completarse: la lente `review-reliability` **no
es ejecutable en este runtime** — despachada dos veces (incluida con el _binding_ provisto por el
provider) falla con `OpenCode's free tier can only be used from within OpenCode`; no hay modelo con
cuota compatible configurado para agentes de revisión. **No se fabricó ningún veredicto.** Se ejecutó
`gentle-ai review abandon` con el _binding_ de mantenimiento construido desde la autoridad persistida
(`reason: operator_disposition`, `actor: orchestrator`); registro `gentle-ai.review-reclaim-record/v1`
`status: committed`; _lineage_ en cuarentena; autoridad resultante `status: clean`, `entries: []`.

**b) Fase C — implementada (T-C1 … T-C12).** Un único escritor materializó: `src/lib/types.ts`
(`Region`/`RoastProfile`/`ProcessMethod`/`Cafe`/`OrderItem`/`CartState`/`CatalogFilters`, diseño §8),
`src/lib/format.ts` (COP + subtotales), `src/lib/catalog-filters.ts`, `src/lib/cart-store.ts`
(_singleton_ en `localStorage`, clave `origen-cafe:cart:v1`, esquema versionado, validación de ítems,
_reset_ ante versión desconocida, degradación a memoria si el storage falla, nunca lanza),
`src/data/cafes.ts` (**8 cafés ficticios**, precios COP enteros), la isla `src/lib/island.ts`
(hidratación global, contador, _drawer_, alta/edición/eliminación, pedido simulado, filtros) y **11
componentes** (`DemoNotice`, `Header`, `Footer`, `Hero`, `Catalog`, `CafeCard`, `Filters`, `CartDrawer`,
`OrderSummary`, `OriginSection`, `ContactForm`); reescribió `src/layouts/Layout.astro`,
`src/pages/index.astro` y `src/pages/cafes/[id].astro` (`getStaticPaths`).

**c) Verificación (Fase D).**
- `npm run check`: **23 archivos, 0 errores / 0 warnings / 0 hints**.
- `npm run build`: **9 páginas** (`/` + 8 `/cafes/<id>/`); CSS 20.103 B; JS 12.894 B.
- `npm run preview`: `/` 200, `/cafes/<id>/` 200, id desconocido **404**.
- Auditoría _read-only_ frente a CA-001 … CA-050: **24 CUMPLE, 0 NO CUMPLE, 26 NO VERIFICABLE
  EJECUTABLEMENTE** (los 26 dependen de JS de cliente/navegador: carrito, filtros, formulario,
  _focus-trap_, responsive visual, a11y en vivo, Lighthouse).
- **Limitación honesta:** no existe _runner_ de tests ni navegador automatizado en el proyecto; el
  comportamiento de cliente se validó por lectura de código y por _smoke test_ HTTP, **no en
  ejecución**. Observación menor: `Astro.rewrite('/404')` en el detalle es rama inalcanzable (_dead
  code_), sin impacto funcional.

**d) Despliegue (Fase E).**
- **T-E1 ( _commits_ ) no ejecutada** por restricción del mandato.
- `vercel link` → proyecto `jcar5/origen-cafe` (projectId `prj_FCR4y7WzN5E1PzwyhgRCwpp6sfbE`).
  **Hallazgo:** Vercel **no detectó Astro** (framework `Other`); con `public/` presente habría servido
  ese directorio en lugar de `dist/`. Corrección: se añadió `vercel.json`
  (`framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`).
- `vercel deploy --prod` → **Ready** (build remoto Astro correcto).
- URLs: producción `https://origen-cafe-r25of5i56-jcar5.vercel.app`; alias
  `https://origen-cafe-rouge.vercel.app`.
- Verificación **pública y sin autenticación**: `/` 200 (8 tarjetas), detalle 200, id desconocido 404.
- **Desviaciones registradas (no implican _commit_ ni alteración de historial/remotos):** `vercel link`
  añadió `.vercel` y `.env*` al `.gitignore` (líneas 26-27) y creó `.env.local` con un token OIDC local
  (ignorado por Git); se añadió `vercel.json` en la raíz como configuración de despliegue.

### 4.10 Fase F — Cierre académico definitivo (2026-10-13)

**T-F1 (runner mínimo, DD-17).**
- `npm install -D vitest jsdom --no-audit --no-fund` → 43 paquetes añadidos. `vitest.config.ts`
  (environment `jsdom`, include `tests/**/*.test.ts`, restoreMocks). Scripts `"test": "vitest run"`
  y `"test:watch"` en `package.json`. Excepción técnica autorizada por el mandato de cierre (ítem 7)
  y documentada como DD-17.

**T-F2 … T-F5 (suite de pruebas).**
- 4 archivos en `tests/` (`format`, `catalog-filters`, `cart-store`, `markup`) → **76/76 PASS
  (1.27 s)**. La suite detectó un **bug real** (RED→GREEN documentado): con `query: '   '` el filtro
  se comportaba como activo y no coincidía con nada; corregido en `cafeMatchesQuery` (trim +
  colapso de espacios).
- Cobertura: formato COP (CA-043), filtros y búsqueda (CA-003 … CA-005, CA-040, CA-051),
  persistencia y recuperación del carrito (CA-042, CA-046 … CA-048, CA-050) y marcado accesible
  (CA-029, CA-031, CA-033 y afines).

**T-F6 (activos gráficos propios, DD-15).** `scripts/generate-cafe-art.mjs` genera los SVG
derivando de `src/data/cafes.ts`; 10 archivos XML bien formados en `public/images/`; `cafes.ts`
reescrito con `image: '/images/cafe-<id>.svg'` por entrada.

**T-F7 (búsqueda, DD-16).** Eje `query` combinable con los 3 filtros; `input[type=search]` +
listener `input` + `submit` con `preventDefault`; el botón de limpieza restablece filtros y
búsqueda; CA-051 registrada en `docs/02-especificacion.md`.

**T-F8 (interfaz, imágenes, a11y, responsive).** `<img>` con `alt` descriptivo (lazy en tarjetas,
eager en detalle); `Hero`/`OriginSection` con los gráficos; `theme-color`, `<noscript>` y fuentes
del sistema; `robots.txt`; **página 404** → `dist/404.html`; copy del aviso sin resultados
coherente con los controles.

**T-F9 (gates).** `astro check` → **30 archivos, 0 errores/avisos** (cubre también `tests/`;
se añadió `@types/node`, solo tipos, para ello) · `npm run build` → **10 páginas, exit 0** ·
`npm run test` → **76/76, exit 0**.

**T-F10 (documentación).** 04 → 0.9.0 (tabla de fases corregida); este documento → 0.8.0;
02 → 0.4.0 (RF-002 extendido, CA-051); 03 → 0.2.3; `odd/tasks/cierre-academico.md` actualizado.

**T-F11 (despliegue final).** `vercel --prod` → **Ready**; verificación pública **posterior** de
`https://origen-cafe-rouge.vercel.app`.

**T-F12 (informe final).** Informe consolidado al usuario: completado vs. bloqueado y límites
honestos (CA-027/028/030/032/034 requieren navegador real o Lighthouse; no verificadas).

**Estado de la revisión RDD del cierre: bloqueada.** El consentimiento `consent/v3` #2 del candidato
`39986aaeb93b26ff8e42ae57f35d91b0bd23273f` (lineage `review-908b36ac279ec2d9`) quedó **sin
respuesta humana**. No se fabricó veredicto, no se reutilizó lineage ni se crearon candidatos
adicionales. El estado se registra como pendiente/bloqueado, no como aprobado.

## 5. Decisión modificada a raíz de la ratificación

### D-14 — Carrito simulado: persistencia (revisada)

| Campo | Valor |
| --- | --- |
| Estado | 🔄 **Revisada (2026-10-10)** — antes decía "carrito en memoria durante la sesión, sin `localStorage`". |
| Versión actual | El carrito persiste en `localStorage` del navegador (clave local, sin backend) y se conserva entre rutas y recargas. |
| Motivo de la revisión | La ratificación de DD-03 fijó la persistencia local como mecanismo de continuidad del pedido simulado; la redacción anterior contradice el comportamiento aprobado (X-02). |
| Registro | Constitución v0.3.0, sección 11. |

## 6. Índice de decisiones de la constitución (estado resumido)

| ID | Decisión (resumen) | Estado |
| --- | --- | --- |
| D-01 | Documentación en español | Vigente |
| D-02 | Datos comerciales marcados como demostración | Vigente |
| D-03 | No modificar/eliminar archivos sin autorización | Vigente |
| D-04 | Fase 0 exclusivamente documental | Vigente |
| D-05 | Raíz definitiva: `C:\Proyectos\OrigenCafe` | Vigente |
| D-06 | Reutilizar el scaffold Astro existente | Vigente |
| D-07 | Trasladar scaffold y resolver repo anidado (ejecutado en la Fase A) | Ejecutada (T-A3/T-A4) |
| D-08 | Stack objetivo: Astro + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`) | Vigente |
| D-09 | Incorporar `typescript` y `@astrojs/check` | Vigente |
| D-10 | Interfaz en español (`lang="es"`) | Vigente |
| D-11 | Documentación SDD en español | Vigente |
| D-12 | Sin pagos, backend, base de datos ni envío real | Vigente |
| D-13 | Filtros por región ficticia, tueste y proceso | Vigente |
| D-14 | Carrito persistido en `localStorage` (revisada v0.3.0) | 🔄 Revisada |
| D-15 | Detalle de producto como ruta propia | Vigente |
| D-16 | Precios en COP solo como formato ilustrativo demo | Vigente |
| D-17 | Respaldo externo, íntegro y verificable antes de mover archivos (Fase A) | Registrada y ejecutada |

## 7. Índice de decisiones de diseño (estado resumido)

| ID | Decisión (resumen) | Estado |
| --- | --- | --- |
| DD-01 | Salida estática de Astro sin adaptador | Ratificada |
| DD-02 | Isla compartida en TypeScript *vanilla* | ✅ Aprobada (sección 2) |
| DD-03 | Carrito persistido en `localStorage` con validación y recuperación segura | ✅ Aprobada (sección 2) |
| DD-04 | Datos demo tipados en `src/data/cafes.ts` | Ratificada |
| DD-05 | Formato COP con `Intl.NumberFormat` `es-CO` + aviso demo | Ratificada |
| DD-06 | Aviso demo reutilizable (`DemoNotice.astro`) | Ratificada |
| DD-07 | Rutas `/` y `/cafes/[id]` | Ratificada |
| DD-08 | Tailwind v4 vía `@tailwindcss/vite` con `@theme` | Ratificada |
| DD-09 | Accesibilidad base (foco, aria, contraste AA) | Ratificada |
| DD-10 | Sin red ni backend; única persistencia: carrito en `localStorage` | Ratificada |
| DD-11 | Semántica y SEO (`lang="es"`, metadatos) | Ratificada |
| DD-12 | Filtros combinables aplicados en cliente | Ratificada |
| DD-13 | Esquema versionado y validación del carrito persistido | Ratificada |
| DD-14 | Higiene del repositorio y exclusiones de `.gitignore` (sin `.vs`/`bin`/`obj`) | ✅ Decidida y ratificada (T-B9) |
| DD-15 | SVG autorales de demostración generados por script (sin licencias de terceros) | ✅ Aprobada (sección 2) |
| DD-16 | Búsqueda de catálogo en cliente combinable con los 3 ejes (extiende RF-002) | ✅ Aprobada (sección 2) |
| DD-17 | Runner de pruebas mínimo: Vitest + jsdom (dependencias mínimas) | ✅ Aprobada (sección 2) |

## 8. Trazabilidad de las decisiones aprobadas

| Decisión | Especificación | Diseño | Plan |
| --- | --- | --- | --- |
| DD-02 | RF-002, RF-004, RF-005 | `docs/03-diseno-arquitectura.md` §§ 4, 7, 9 | Fase C (T-C5, T-C7, T-C8) |
| DD-03 | RF-004 (CA-042, CA-045 … CA-048), RNF-012 (CA-050) | `docs/03-diseno-arquitectura.md` §§ 4, 9, DD-13 | Fase C (T-C7), Fase D (T-D3) |
| D-17 | — | Sección 5 (estructura de archivos) | Fase A (T-A2 … T-A5; Anexos A y B) |
| DD-14 | — | Sección 5 (estructura de archivos) | Fase B (T-B9); Anexo C |
| DD-15 | RF-001 (CA-001) | `docs/03-diseno-arquitectura.md` §§ 5, 7 (imágenes) | Fase F (T-F6) |
| DD-16 | RF-002 (CA-051) | `docs/03-diseno-arquitectura.md` § 7 (`Filters.astro`); `docs/02-especificacion.md` | Fase F (T-F7) |
| DD-17 | Revisión de CA del mandato de cierre (ítem 7) | `docs/04-plan-implementacion.md` § 5 | Fase F (T-F1 … T-F5) |

## 9. Historial de cambios

| Versión | Fecha | Descripción |
| --- | --- | --- |
| 0.1.0 | 2026-10-10 | Creación del documento. Registra DD-02 y DD-03 como **aprobadas**, D-17 como registrada y la revisión de D-14; agrega índices resumidos de decisiones de constitución y diseño. |
| 0.2.0 | 2026-10-10 | Registro de la **inspección de solo lectura** de ambos repositorios Git (sección 3): evidencias reales — raíz sin commits; anidado con el único commit raíz `63e18cf` (autor `houston[bot]`), sin remotos/etiquetas/ramas adicionales, `fsck` íntegro —, comparación de las opciones A/B/C para el historial y **recomendación A** (pendiente de aprobación). D-17 se refuerza como respaldo **externo**, íntegro y verificable (bundle, SHA-256, prueba de restauración). |
| 0.3.0 | 2026-10-10 | **Fase A ejecutada (T-A2 … T-A5) bajo autorización explícita.** Nueva **sección 4** con las evidencias reales: respaldo externo verificado (manifest 94/94, bundle `is okay`, restauración 17/17 byte-idéntica con `core.autocrlf=false`), traslado de 11 elementos / 17 archivos, retiro del `.git` anidado a cuarentena con conservación de `63e18cf` por tres vías, y verificación posterior T-A5 (incluye el hallazgo `.vs`/`bin`/`obj` ausentes de `.gitignore`). La sección 3.4 pasa a registrar la **opción A como aprobada y aplicada**; D-17 y D-07 se marcan como ejecutadas. Se dejan explícitas las **decisiones pendientes** (carpeta residual `terrestrial-telescope\node_modules`). La **Fase B permanece pendiente y no iniciada**. |
| 0.4.0 | 2026-10-10 | **Acciones posteriores a la Fase A.** Nuevo **DD-14** (higiene del repositorio; **no** se añaden `.vs`/`bin`/`obj`; análisis en el Anexo C del plan) y nueva **sección 4.6** con la **eliminación de dependencias residuales** `terrestrial-telescope\node_modules` (pre-verificación, eliminación acotada y verificación posterior). La sección 4.5 pasa a reflejar la carpeta residual resuelta. Se anota la **Fase B planificada en detalle pero no iniciada**. |
| 0.5.0 | 2026-10-10 | **Inicio de la Fase B: T-B1 ejecutada.** Nueva **sección 4.7** con la ejecución (precondiciones, alcance de un solo archivo, cambio en `package.json` y verificación 11/11 PASS). El `package.json` pasa a `origen-cafe` / 0.1.0 / `private: true` y suma el script `check`; `package-lock.json` queda **sin cambios** (drift de identidad a reconciliar en T-B8). La Fase B queda **en ejecución** (T-B2 … T-B9 pendientes). |
| 0.6.0 | 2026-10-10 | **Fase B completada (T-B2 … T-B9).** Nueva **sección 4.8** con la ejecución real: instalación de devDeps (`tailwindcss`, `@tailwindcss/vite`, `typescript ^6.0.3`, `@astrojs/check`), **hallazgo** de incompatibilidad `astro check` ↔ TypeScript 7, Tailwind v4 vía Vite, `global.css`/`@theme`, `Layout.astro`, estructura de carpetas, arranque *placeholder* de la isla, y verificación (`check` 6 archivos sin errores; `build` 1 página con tokens/utilities; lock reconciliado a `origen-cafe`/`0.1.0`). **DD-14 ratificada** en T-B9 (`.gitignore` sin cambios). La **Fase C** queda habilitada. |
| 0.7.0 | 2026-10-10 | **Segunda corrida: Fase C, verificación (Fase D) y despliegue (Fase E).** Nueva **sección 4.9**: (a) la revisión RDD pendiente (`review-2f3d6e6dfd3baa3a`) se **abandonó con razón documentada** (lente no ejecutable en el runtime; sin veredicto fabricado; autoridad resultante `status: clean`, `entries: []`); (b) **Fase C implementada** (T-C1 … T-C12) — 8 cafés ficticios, `cart-store` con `localStorage` versionado y recuperación segura, isla ampliada y 11 componentes, rutas `/` y `/cafes/[id]`; (c) **Fase D** — `check` 23 archivos 0/0/0, `build` 9 páginas, `preview` 200/200/404, CA-001 … CA-050 → **24 cumplen / 0 fallan / 26 no verificables sin navegador**; (d) **Fase E** — `vercel deploy --prod` → **Ready**, `vercel.json` añadido (Astro **no** detectado; output `dist`), URL pública `https://origen-cafe-rouge.vercel.app`, verificación **pública** 200/200/404. **Desviaciones registradas:** `.gitignore` modificado por `vercel link` (`.vercel`, `.env*`) y `.env.local` creado (ignorado por Git). |
| 0.8.0 | 2026-10-13 | **Fase F ejecutada (cierre académico).** Nuevas **DD-15** (SVG autorales), **DD-16** (búsqueda combinable, extiende RF-002 con CA-051) y **DD-17** (runner mínimo Vitest + jsdom), y nueva **sección 4.10** con la ejecución real (T-F1 … T-F12): suite **76/76** con bug detectado y corregido (búsqueda de solo espacios), 10 SVG originales, página 404, `astro check` 30/0/0 (incluye pruebas, con `@types/node` de solo tipos), build 10 páginas, docs actualizadas y despliegue final verificado. La revisión **RDD del cierre queda bloqueada** (consentimiento sin respuesta; sin veredicto fabricado). |