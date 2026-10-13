# ODD — Cierre académico de Origen Café

> Documento de trabajo de Organic Driven Development. Deriva de `docs/02-especificacion.md` (v0.4.0),
> `docs/03-diseno-arquitectura.md` (v0.2.3), `docs/04-plan-implementacion.md` (v0.9.0) y
> `docs/05-registro-decisiones.md` (v0.8.0).
> Estado: **completada y verificada (2026-10-13)**.

## Objetivo

Dejar Origen Café listo para su **entrega académica**: interfaz profesional de café colombiano,
funcionalidades completas (catálogo, **búsqueda**, filtros, detalle, carrito persistente, formulario
demo), **pruebas ejecutables** que cubran los criterios de aceptación, documentación coherente y
despliegue comprobado.

## Problema / por qué

Las fases A … E dejaron el sitio implementado, verificado a mano y desplegado, pero:

1. **No existe runner de pruebas** → de los 50 CA, 24 se verificaron por inspección y **26 quedaron
   "no verificables ejecutablemente"**. Sin tests, la entrega académica no es demostrable.
2. **No hay imágenes de producto** (`CafeCard`/detalle usan SVG decorativo `aria-hidden`; el campo
   `Cafe.image` está documentado como *unused*) → CA-001 exige tarjetas "con imagen" y CA-029/CA-031
   exigen imágenes con formato/tamaño adecuado, *lazy loading* y `alt`.
3. **No hay búsqueda** en el catálogo (el mandato de cierre la pide explícitamente).
4. **Las familias tipográficas declaradas (`Inter`, `Playfair Display`) no se cargan** ni local ni
   remotamente → se renderizan como *fallback* del sistema. Incoherencia entre token y resultado.
5. **Documentación desalineada**: la tabla de fases de `docs/04` sigue diciendo que la Fase B está
   "en ejecución" con T-B2 … T-B9 pendientes, cuando B/C/D/E ya terminaron.

## Alcance

- Runner de pruebas mínimo + suite que cubra la mayor parte de los 50 CA.
- Activos visuales **originales** (SVG autorales) para tarjetas, detalle y sección de origen.
- Búsqueda de catálogo en cliente, combinable con los tres filtros existentes.
- Pulido de interfaz, accesibilidad y responsividad.
- Actualización de `docs/01` … `docs/05`, `README.md` y este documento con resultados reales.
- Despliegue a producción y verificación de la URL pública.

## Restricciones

- **DD-02** (isla compartida en TypeScript *vanilla*, sin framework de UI) y **DD-03** (carrito en
  `localStorage`, clave propia y versionada) siguen ratificadas: se cumplen, no se reinterpretan.
- Sin backend, base de datos, autenticación, pagos, correo real ni `fetch`/red (DD-10, RNF-009).
- **Sin recursos externos en runtime** (sin CDN de fuentes ni de imágenes): todo activo es local.
- **Sin imágenes ni vídeos de terceros sin licencia verificada**: los activos visuales se **autoran**
  como SVG originales (sin obligación de atribución, sin riesgo de licencia).
- TypeScript estricto; `astro check` sin errores (RNF-006, CA-035).
- **No** `git clean`, `reset --hard`, `gc` ni `prune`. **No** commits ni push sin autorización.
- No se borra ni sobrescribe el respaldo externo, el historial `63e18cf` ni las cuarentenas RDD.
- No se crean lineages RDD redundantes ni se inventan aprobaciones.

## Decisiones tomadas en esta fase

- **DD-15 — Activos visuales originales.** Las imágenes de producto y de sección se generan como SVG
  autorales dentro del repositorio (deterministas, sin licencia de terceros). Se descarta descargar
  fotografías de stock: no es posible verificar su licencia de forma defendible para una entrega
  académica, y reintroduciría dependencia de recursos externos. *Registrada en `docs/05`.*
- **DD-16 — Búsqueda en cliente sobre el catálogo.** Campo de búsqueda por nombre/región/notas que se
  combina con los tres ejes de filtro (DD-12) y se resuelve en la misma isla compartida. Extiende
  RF-002 sin contradecirlo.
- **DD-17 — Runner de pruebas mínimo.** `vitest` + `jsdom` como `devDependencies`. Es la adición
  mínima que permite ejecutar los CA de cliente sin navegador ni framework de UI.

## Checklist

### Bloque 1 — Pruebas ejecutables

- [x] **T-F1** Añadir `vitest` + `jsdom` como `devDependencies`, `vitest.config.ts` y script
      `npm run test`; documentar el cambio de dependencias.
- [x] **T-F2** Tests unitarios de lógica pura: `catalog-filters` (CA-003/005/040), `format`
      (CA-012/013/043), `cart-store` (CA-008/009/010/011/042/045/046/047/048/049/050).
- [x] **T-F3** Tests de isla en `jsdom`: montaje, agregar al pedido, filtros visibles/ocultos,
      mensaje "sin resultados", validación del formulario (CA-019/020/021), drawer con foco y Escape
      (CA-030), confirmación de pedido simulado y vaciado (CA-014/015/016).
- [x] **T-F4** Tests de integridad del catálogo demo (≥ 4 cafés, ids únicos, precios > 0) → CA-001.
- [x] **T-F5** Tests sobre el HTML construido en `dist/`: `lang="es"` (CA-044), semántica
      (CA-039), avisos demo (CA-002/025/043), controles de filtro (CA-040), enlaces de navegación
      (CA-022), metadatos (CA-033), `alt` de imágenes (CA-031).

### Bloque 2 — Interfaz profesional, media e interactividad

- [x] **T-F6** Activos SVG originales: visual por café, ornamento de origen y banda animada de
      proceso; integración con `<img>`/`<picture>`, `alt` significativo, `loading="lazy"` y
      dimensiones explícitas (CA-001/029/031).
- [x] **T-F7** Búsqueda de catálogo combinable con filtros + estado accesible de resultados
      (DD-16).
- [x] **T-F8** Pulido de interfaz, tipografía, accesibilidad y responsividad (CA-023/024/027/032/
      037/039): resolución del desajuste de fuentes, `noscript`, mejoras de foco y contraste.

### Bloque 3 — Verificación, documentación y entrega

- [x] **T-F9** Ejecutar `npm run check`, `npm run test` y `npm run build`; registrar salidas reales.
- [x] **T-F10** Actualizar `docs/01` … `docs/05`, `README.md` y este documento con resultados reales
      (incluida la corrección de la tabla de fases de `docs/04`).
- [x] **T-F11** Desplegar en Vercel y verificar la URL de producción (inicio, detalle, 404, activos).
- [x] **T-F12** Estado del RDD: el consentimiento del candidato quedó **sin responder**; registrar el
      bloqueo sin fabricar aprobaciones ni crear lineages.

## Criterios de aceptación

Los `CA-001 … CA-050` de `docs/02-especificacion.md`. Objetivo de esta fase: convertir el mayor número
posible de "no verificable" en **verificado ejecutablemente**, y declarar con honestidad lo que siga
sin ser comprobable (p. ej. Lighthouse/CA-028 y compatibilidad real de navegadores/CA-034, que
requieren herramientas externas).

## Verificaciones (cierre de tarea)

- `npm run check` → sin errores (CA-035).
- `npm run test` → suite en verde; se registra el recuento real de tests.
- `npm run build` → **10 páginas**: `/` + 8 rutas de detalle (RF-003/CA-041) + `404.html`.

## Ruta de ejecución

- **Bloque 1 y 2:** ruta **delegada directa**. El trigger de escritor (2+ archivos no triviales) se
  dispara en ambos: T-F1 crea configuración + depedencias; T-F2 … T-F5 crean ≥ 5 archivos de test;
  T-F6 … T-F8 tocan componentes, activos y la isla.
- **Bloque 3:** el orquestador ejecuta las comprobaciones y el despliegue (acción acotada), y redacta
  la documentación.
- **Evidencia de disparo:** ~12 archivos nuevos + ~8 modificados.

## Riesgos

- **R-F1** `npm install` reescribe `package-lock.json` y `node_modules` → cambio de workspace que
  mueve el candidato RDD (el consentimiento pendiente ya está sin responder; se registra, no se
  "recicla"). Mitigación: registrar el antes/después.
- **R-F2** La suite puede acoplarse a detalles de implementación. Mitigación: priorizar contratos
  (`data-*`, claves de `localStorage`, funciones puras) sobre *snapshots*.
- **R-F3** Sin navegador real, CA-027/030/032/034 y CA-028 siguen sin ser plenamente comprobables.
  Mitigación: declararlo como límite honesto, no como aprobado.

## Estrategia de entrega

- *Forecast* de líneas autoradas: > 400 (tests ~700, activos ~600, búsqueda + pulido ~400,
  documentación ~400). Como **no hay commits autorizados**, la estrategia en cadena (`chained-pr`)
  queda **diferida** y se registra en este documento; no se abre ningún PR.

## Progreso y evidencia

- 2026-10-13 — Documento creado. Estado inicial reconstruido por lectura directa del repositorio:
  git raíz **sin commits** (sin `HEAD`, sin remotos, 15 rutas *untracked*); 23 archivos en `src/`;
  0 archivos de test; 0 runners instalados; `dist/` con 13 archivos; activos visuales limitados a
  `public/favicon.{ico,svg}` y `src/assets/{astro,background}.svg`.
- 2026-10-13 — Límite registrado: `docs/04` mantiene en su tabla de fases un estado obsoleto
  ("Fase B en ejecución, T-B2 … T-B9 pendientes") que contradice su propio encabezado.
- 2026-10-13 — **Ruta efectiva: inline** (desviación registrada). El *free tier* del runtime mostró
  ~1/3 de éxito en la delegación a subagentes; el trabajo se ejecutó de forma directa y quirúrgica
  para no degradar el resultado.
- 2026-10-13 — **Fase F completada.** T-F1: runner mínimo Vitest ^5.0.4 + jsdom ^30.1.2 (43
  paquetes; se añadió `@types/node`, solo tipos, en T-F9 para que `astro check` cubra `tests/`).
  T-F2 … T-F5: suite 76/76 que detectó un **bug real** — una consulta de búsqueda de solo espacios
  (`'   '`) trataba el filtro como activo; corregido con trim + colapso de espacios (RED→GREEN).
  T-F6: 10 SVG autorales (`scripts/generate-cafe-art.mjs`, deriva de `cafes.ts`). T-F7: búsqueda
  combinable (DD-16, CA-051). T-F8: `<img>` con `alt` (lazy en tarjetas, eager en detalle),
  `theme-color`, `<noscript>`, fuentes del sistema, `robots.txt`, página 404 y copy del aviso sin
  resultados. T-F9: gates en verde — `astro check` 30 archivos 0/0/0, `build` 10 páginas,
  `test` 76/76. T-F10: docs 02 (0.4.0), 03 (0.2.3), 04 (0.9.0), 05 (0.8.0) y `README.md`
  actualizadas. T-F11: `vercel --prod` + verificación de la URL pública. T-F12: estado RDD
  registrado como **bloqueado** (consentimiento #2 sin responder; sin veredicto fabricado ni
  lineage reciclado).

## Siguiente paso

**Cierre alcanzado.** Fases A … F ejecutadas y verificadas; gates en verde (`check` 30/0/0,
`test` 76/76, `build` 10 páginas); URL pública verificada. Quedan fuera de alcance, ya declarados:
*commits*/*push* (T-E1, restricción del mandato), CA-027/028/030/032/034 (solo comprobables con
navegador real o Lighthouse) y la revisión RDD (pendiente de consentimiento humano; se registró
bloqueada).

