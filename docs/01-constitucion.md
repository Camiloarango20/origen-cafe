# 01 — Constitución del proyecto Origen Café

> **Fase 0 — Constitución y definición.** Este documento no describe implementación de interfaz. Establece el problema, el alcance, las reglas y las restricciones que gobiernan las fases posteriores, en el marco de Spec-Driven Development (SDD).

## Metadatos

| Campo | Valor |
| --- | --- |
| Proyecto | Origen Café |
| Contexto académico | Taller de Diseño de Sistemas — ITM |
| Metodología | Spec-Driven Development (SDD) |
| Fase del proyecto | 0 — Constitución y definición |
| Versión del documento | 0.4.0 |
| Estado | Decisiones de arquitectura ratificadas (DD-02 / DD-03); inspección del repositorio anidado documentada (2026-10-10) |
| Fecha | 2026-10-10 |
| Idioma de la documentación | Español (neutro/profesional) |
| Documentos relacionados | `docs/02-especificacion.md`, `docs/03-diseno-arquitectura.md`, `docs/04-plan-implementacion.md`, `docs/05-registro-decisiones.md` |

---

## 1. Problema que resuelve

No existe una presencia digital que permita a una marca de café de origen colombiano (en este caso, una marca ficticia) presentar su catálogo de productos, comunicar su origen y ofrecer a un visitante la posibilidad de explorar productos y armar un pedido simulado.

El proyecto aborda ese problema como **ejercicio académico**: diseñar y especificar una landing page interactiva para la marca ficticia **Origen Café**, aplicando la metodología SDD desde la constitución hasta la verificación.

El producto no persigue una operación comercial real. Su valor es demostrar un proceso disciplinado de diseño de sistemas: partir de un problema, definir alcance, derivar requisitos verificables y recién entonces implementar.

## 2. Objetivo general

Desarrollar una **landing page interactiva, moderna, profesional, adaptable a móviles y funcional** para la marca ficticia Origen Café, que comunique el origen del café, presente un catálogo navegable y permita simular un pedido en el frontend, utilizando Astro, TypeScript y Tailwind CSS bajo la metodología SDD.

## 3. Objetivos específicos

1. **OE-01** Definir el problema, el alcance, las restricciones y los riesgos del proyecto (esta fase).
2. **OE-02** Especificar requisitos funcionales y no funcionales con identificadores únicos y criterios de aceptación verificables.
3. **OE-03** Diseñar la arquitectura de la interfaz (páginas, componentes y flujo de navegación) y el modelo de datos de demostración.
4. **OE-04** Implementar la interfaz con Astro, TypeScript y Tailwind CSS en la fase de ejecución.
5. **OE-05** Garantizar un diseño responsivo (enfoque *mobile-first*) y accesible.
6. **OE-06** Simular el flujo de catálogo → detalle → pedido íntegramente en el frontend, sin backend.
7. **OE-07** Verificar el resultado contra los criterios de aceptación definidos en la especificación.

## 4. Usuarios objetivo

Los usuarios se describen de forma **cualitativa** (no se utilizan estadísticas ni segmentaciones reales).

### Usuarios del producto

| ID | Usuario | Descripción | Necesidad principal |
| --- | --- | --- | --- |
| U-01 | Visitante general | Persona que llega a la landing, mayoritariamente desde móvil. | Entender de qué se trata la marca y explorar el catálogo con rapidez. |
| U-02 | Cliente potencial | Visitante interesado en el producto o en contactar a la marca. | Ver detalle de productos, armar un pedido simulado y dejar un mensaje. |

### Partes interesadas (stakeholders)

| ID | Stakeholder | Interés |
| --- | --- | --- |
| S-01 | Equipo del taller | Entregar un artefacto coherente con la metodología SDD. |
| S-02 | Docente evaluador | Verificar el cumplimiento de la especificación y los criterios de aceptación. |

> **Nota:** los datos de producto, productores, fincas, certificaciones, precios y estadísticas son **contenido de demostración** y se identifican como tal en toda la interfaz (ver RF-010).

## 5. Alcance

### 5.1 Incluido en el alcance

- Una landing page de una sola aplicación web estática (Astro) con secciones de inicio, catálogo, origen y contacto.
- Catálogo de cafés con datos de demostración.
- Filtrado del catálogo.
- Vista de detalle de producto.
- Carrito y resumen de pedido **simulados en el frontend**, con persistencia local en `localStorage`.
- Sección narrativa de "Origen".
- Formulario de contacto con validación en cliente (sin envío real).
- Diseño responsivo y accesible.

### 5.2 Excluido del alcance (en esta fase y en el proyecto)

- Backend, API propia, base de datos y persistencia en servidor.
- Pagos reales y pasarelas de pago.
- Autenticación, cuentas de usuario y panel de administración.
- Envío real de correos o integración con servicios externos.
- CMS o gestión de contenido dinámico.
- Multi-idioma (la interfaz será en un solo idioma).
- Analítica, seguimiento de usuarios o publicidad.

> **Aclaración:** el carrito simulado persiste únicamente en `localStorage` del navegador (D-14/DD-03). Eso **no** constituye persistencia en servidor ni requiere backend; no rompe la exclusión anterior.

## 6. Funcionalidades incluidas

| ID | Funcionalidad | Requisito asociado |
| --- | --- | --- |
| F-01 | Catálogo de cafés | RF-001 |
| F-02 | Filtros de catálogo | RF-002 |
| F-03 | Detalle de producto | RF-003 |
| F-04 | Carrito de compras (simulado) | RF-004 |
| F-05 | Resumen de pedido y totales | RF-005 |
| F-06 | Simulación de pedido (confirmación demo) | RF-006 |
| F-07 | Sección de origen | RF-007 |
| F-08 | Formulario de contacto | RF-008 |
| F-09 | Navegación global (encabezado y pie de página) | RF-009 |
| F-10 | Etiquetado de contenido de demostración | RF-010 |

> El detalle de cada funcionalidad y sus criterios de aceptación se encuentra en `docs/02-especificacion.md`.

## 7. Funcionalidades excluidas

Se explicitan para evitar *scope creep*:

- Registro y perfil de usuario.
- Pago en línea y facturación.
- Inventario real y control de stock en servidor.
- Reseñas o comentarios persistidos.
- Búsqueda avanzada con índice del lado del servidor.
- Cupones, promociones o descuentos dinámicos calculados por un backend.
- Internacionalización.
- Blog o gestor de contenidos.

## 8. Stack tecnológico objetivo

| Capa | Tecnología | Notas |
| --- | --- | --- |
| Framework | Astro | Framework de sitios orientado a contenido, con islas de interactividad. |
| Lenguaje | TypeScript | Tipado estático en modo estricto (`astro/tsconfigs/strict`). Se incorporan `typescript` y `@astrojs/check` para habilitar `astro check` (D-09). |
| Estilos | Tailwind CSS v4 | Mediante el plugin `@tailwindcss/vite` (D-08). Enfoque *mobile-first*. |
| Interactividad | Islas de Astro | Componentes cliente para catálogo, filtros y carrito. Estrategia **ratificada** en `docs/03-diseno-arquitectura.md` (DD-02/DD-03): isla compartida en TypeScript *vanilla* y carrito persistido en `localStorage`. |
| Gestor de paquetes | npm | El scaffold usa `package-lock.json` (lockfileVersion 3). |
| Entorno | Node.js | El scaffold declara `node >= 22.12.0`; el entorno local tiene Node v24.21.0 y npm 11.19.0 (compatible). |
| Backend | No aplica | El pedido se simula en el frontend (D-12). |

> Las decisiones D-05 a D-17 (sección 11) fijan el stack objetivo. Las versiones exactas de cada dependencia se fijarán al incorporarlas en la fase de implementación.

## 9. Restricciones

| ID | Restricción |
| --- | --- |
| C-01 | No se implementan backend, base de datos ni pagos reales. |
| C-02 | El pedido se simula íntegramente en el frontend. |
| C-03 | Todos los datos comerciales son ficticios y deben estar etiquetados como contenido de demostración. |
| C-04 | No se inventan datos sobre productores, fincas, certificaciones, precios definitivos ni estadísticas reales. |
| C-05 | En esta fase (Fase 0) no se instalan dependencias, no se generan componentes y no se implementa código de interfaz. |
| C-06 | No se modifican ni eliminan archivos del scaffold existente (`terrestrial-telescope/`) sin autorización; su tratamiento se rige por D-06, D-07 y D-17. |
| C-07 | La documentación se redacta en español; el código y los artefactos técnicos siguen convenciones estándar (inglés para identificadores y nombres técnicos). |
| C-08 | El entorno de desarrollo es Windows; los comandos del proyecto deben ser compatibles. |

## 10. Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- | --- |
| R-01 | Ambigüedad sobre datos comerciales (qué es real y qué es demo). | Media | Alto | Etiquetar todo contenido ficticio como demostración (RF-010 / C-03). |
| R-02 | *Scope creep*: agregar pagos, backend o autenticación. | Media | Alto | Esta constitución fija el alcance excluido; todo cambio requiere autorización. |
| R-03 | El scaffold existente (`terrestrial-telescope`) no está alineado con el stack (sin Tailwind, nombre genérico) y contiene un repositorio Git anidado. | Alta | Medio | Decidido: se reutiliza y adapta (D-06). La alineación (Tailwind, dependencias, renombrado, traslado a la raíz) se ejecuta en una tarea posterior con comprobaciones previas (D-07) y respaldo verificado (D-17). |
| R-04 | Complejidad de la interactividad (carrito y filtros) dentro del modelo de islas de Astro. | Media | Medio | Estrategia **ratificada** (DD-02/DD-03) en `docs/03-diseno-arquitectura.md`; mantener el estado acotado y validar los datos persistidos (JSON inválido, entradas desconocidas). |
| R-05 | Diseño responsivo o accesibilidad descuidados. | Media | Medio | Criterios de aceptación específicos (RF-009 / RNF-001 / RNF-003). |
| R-06 | Recursos visuales (imágenes) reales no disponibles o con derechos. | Media | Bajo | Usar marcadores de posición (*placeholders*) y contenido ilustrativo. |
| R-07 | Repositorio Git anidado dentro del árbol del proyecto genera confusión de versiones. | Media | Medio | Inspeccionado el 2026-10-10: contiene únicamente el commit raíz `63e18cf` del template de Astro, sin remotos, etiquetas ni ramas adicionales; resolución pendiente de decisión (sección 12, ítem 2). No se eliminó nada; no inicializar submódulos sin decisión explícita. |
| R-08 | Restricción de tiempo del ejercicio académico. | Media | Medio | Priorizar requisitos *Must* de la especificación. |
| R-09 | Pérdida de archivos durante el traslado del scaffold. | Media | Alto | Respaldo e integridad verificados antes de mover (D-17) y verificación posterior (plan, T-A5). |
| R-10 | Datos del carrito corruptos o incompatibles en `localStorage` rompen la interfaz. | Media | Medio | Validación y recuperación segura en el módulo de estado (DD-03; RF-004, CA-046 … CA-048). |

## 11. Decisiones acordadas y contradicciones resueltas

### Decisiones acordadas

| ID | Decisión | Motivo |
| --- | --- | --- |
| D-01 | La documentación se redacta en español. | Proyecto académico en español para el ITM; los nombres de archivo solicitados son en español. |
| D-02 | Todo dato comercial se marca explícitamente como contenido de demostración. | Evita presentar información ficticia como real (C-03, C-04). |
| D-03 | No se modifican ni eliminan archivos existentes sin autorización. | Instrucción explícita del encargo (acotada por C-06). |
| D-04 | El alcance de la Fase 0 es exclusivamente documental. | Instrucción explícita del encargo (C-05). |
| D-05 | La raíz definitiva del proyecto será `C:\Proyectos\OrigenCafe`. | Alinea la raíz del repositorio con la ubicación de `docs/`. |
| D-06 | Se reutiliza el scaffold Astro existente; no se genera otro proyecto. | Aprovecha el trabajo ya disponible en lugar de rehacerlo. |
| D-07 | Trasladar los archivos útiles del scaffold a la raíz y resolver el repositorio Git anidado en una **tarea posterior, con comprobaciones previas**. Aún **no ejecutado**. | Requiere verificación previa para no perder trabajo ni romper el control de versiones. |
| D-08 | Stack objetivo: Astro + TypeScript + Tailwind CSS v4 mediante `@tailwindcss/vite`. | Tailwind v4 vía `@tailwindcss/vite` es la integración vigente recomendada para Astro ≥ 5.2.0. |
| D-09 | Incorporar `typescript` y `@astrojs/check` para habilitar `astro check`. | Verificación de tipos y calidad de código (RNF-006). |
| D-10 | El idioma de la interfaz será español (`lang="es"`). | Audiencia colombiana del proyecto. |
| D-11 | La documentación SDD continúa en español (ratifica D-01). | Coherencia idiomática del proyecto. |
| D-12 | Catálogo, precios, orígenes y pedidos son de demostración; sin pagos, backend, base de datos ni envío real de formularios. | Alcance académico (C-01 … C-04). |
| D-13 | Los filtros del catálogo serán por **región ficticia**, **perfil de tueste** y **método de proceso**. | Concreta el alcance de RF-002. |
| D-14 | El carrito persiste en **`localStorage`** del navegador (clave local, sin backend) y se conserva entre rutas y recargas. **Revisada en v0.3.0** al ratificar DD-03 (antes: carrito solo en memoria, sin `localStorage`). | Conservar el pedido simulado entre navegaciones y recargas sin introducir backend (DD-03). |
| D-15 | La vista de detalle de producto es una **ruta propia de Astro**. | URLs navegables y recargables; define la estructura de rutas (RF-003). |
| D-16 | Los precios se expresan en **pesos colombianos (COP)**, únicamente como **formato ilustrativo de precios ficticios**, con aviso visible de demostración. | Legibilidad local sin afirmar precios reales. |
| D-17 | La Fase A **no comienza sin un respaldo externo a la raíz del proyecto, íntegro y verificable**: copia completa del árbol con ambos repositorios Git (excluye `node_modules/`, se reinstala con `npm install`), bundle del repositorio anidado verificado con `git bundle verify`, hashes SHA-256 de los archivos de respaldo y prueba de restauración en directorio temporal. Aún **no ejecutado**. | Garantizar que archivos e historial son recuperables antes de cualquier movimiento (R-09, R-07). |

> **Ratificaciones formales:** las decisiones de diseño **DD-02** (isla compartida en TypeScript *vanilla*, sin React/Preact) y **DD-03** (persistencia del carrito en `localStorage`) fueron **aprobadas** por el usuario. Su registro detallado está en `docs/03-diseno-arquitectura.md` y `docs/05-registro-decisiones.md`.

### Contradicción detectada y su resolución

| ID | Observación | Resolución |
| --- | --- | --- |
| X-01 | El encargo pidió "determinar si la carpeta está vacía o si ya existe un proyecto". La carpeta **no estaba vacía**: contiene `.atl/` (registro de skills del harness) y `terrestrial-telescope/`, un **scaffold por defecto de Astro** (`astro ^7.3.8`, sin Tailwind, con `.git` anidado, `node_modules/`, `src/`, `public/`). | Resuelta: se reutiliza el scaffold (D-06) y su traslado a la raíz se planificó para una tarea posterior (D-07). Ver D-05. |
| X-02 | La redacción original de D-14 fijaba el carrito "en memoria, sin `localStorage`", contradiciendo la necesidad de conservarlo entre rutas y recargas. | Resuelta en v0.3.0: al ratificar DD-03 se revisó D-14 para persistir el carrito en `localStorage`. Ver `docs/05-registro-decisiones.md`. |

> **Estado físico actual (a la fecha de este documento):** el scaffold **sigue** en `terrestrial-telescope/`, su repositorio Git anidado (`terrestrial-telescope/.git`, commit `63e18cf`) **no fue eliminado** y la reorganización de archivos **no se ejecutó**. La inspección del 2026-10-10 confirmó: repo raíz en `master` **sin commits** y sin remotos; repo anidado en `master` con **un único commit raíz** (`63e18cf "Initial commit from Astro"`, autor `houston[bot]`), sin remotos, etiquetas, ramas adicionales ni stashes, y con `git fsck` sin errores. Evidencia completa en `docs/05-registro-decisiones.md`, sección 3. La reorganización se hará en una tarea posterior con **respaldo externo verificado previo** (D-17) y autorización explícita.

## 12. Dudas pendientes (reales)

La ratificación de DD-02 y DD-03 (ver `docs/05-registro-decisiones.md`) resolvió la estrategia de interactividad y la persistencia del carrito. Las siguientes dudas **siguen abiertas**:

1. **Reorganización física del scaffold:** mecánica y momento exactos del traslado de archivos a la raíz (D-07), aún **no ejecutado**. Planificado en `docs/04-plan-implementacion.md`.
2. **Repositorio Git anidado:** qué hacer con su historial al resolverlo en la tarea posterior. **Inspección documentada** el 2026-10-10 (evidencia en `docs/05-registro-decisiones.md`, sección 3): el historial es un único commit raíz `63e18cf` del template de Astro, sin trabajo adicional. **Recomendación registrada (opción A):** conservar el historial en un respaldo verificable y comenzar un historial nuevo y unificado; **decisión final pendiente de aprobación del usuario**.
3. **Formato de presentación de COP:** resuelto a nivel de diseño (`docs/03-diseno-arquitectura.md`, DD-05, `Intl.NumberFormat` `es-CO`); detalle fino a confirmar al implementar.

> Las dudas sobre base del proyecto, versión de Tailwind, atributos de filtrado, idioma de la interfaz, **estrategia de interactividad** y **persistencia del carrito** quedaron **resueltas** por D-05 a D-17 y por la ratificación de DD-02/DD-03.

## 13. Criterios de salida de esta fase

La Fase 0 se considera completa cuando:

- [x] Existe `docs/01-constitucion.md`.
- [x] Existe `docs/02-especificacion.md`.
- [x] Las decisiones de arquitectura quedaron registradas (D-05 … D-17) y ratificadas (DD-02/DD-03); las dudas restantes (sección 12) quedan explícitamente diferidas a tareas posteriores.
- [x] El alcance y el stack objetivo fueron aprobados por el equipo.
- [ ] **Pendiente:** la reorganización física del scaffold **no** se ha ejecutado (D-07/D-17); su ejecución requiere respaldo externo verificado (D-17: copia íntegra + bundle verificado + SHA-256 + prueba de restauración), decisión sobre el historial `63e18cf` y autorización explícita.

## 14. Historial de cambios

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.1.0 | 2026-10-10 | Creación inicial del documento (Fase 0). |
| 0.2.0 | 2026-10-10 | Registro de las decisiones de arquitectura D-05 … D-16 (raíz del proyecto, reutilización del scaffold, stack con Tailwind CSS v4 y `@astrojs/check`, idioma español, filtros, carrito en memoria, detalle como ruta propia, precios en COP). Se resuelve X-01 y se aclara que la reorganización física del scaffold aún **no** se ejecutó. |
| 0.2.1 | 2026-10-10 | Revisión de coherencia: referencias cruzadas a `docs/03-diseno.md` y `docs/04-plan-implementacion.md`; la estrategia de interactividad y el formato COP se remiten al diseño (propuesta). |
| 0.3.0 | 2026-10-10 | Ratificación de **DD-02** (isla compartida en TypeScript *vanilla*) y **DD-03** (carrito persistido en `localStorage`). Se revisa D-14 (antes: carrito en memoria sin `localStorage`) y se registra X-02. Se registra D-17 (protección de la Fase A: respaldo e integridad verificados antes de mover). Se depuran las dudas pendientes y se actualiza la referencia del diseño a `docs/03-diseno-arquitectura.md`, agregando `docs/05-registro-decisiones.md`. La reorganización física **sigue sin ejecutarse**. |
| 0.4.0 | 2026-10-10 | Inspección de solo lectura de ambos repositorios Git (raíz y `terrestrial-telescope/.git`): evidencias registradas (raíz sin commits; anidado con el único commit raíz `63e18cf` de autor `houston[bot]`, sin remotos/etiquetas/ramas adicionales, `fsck` íntegro). D-17 se refuerza como requisito obligatorio de respaldo **externo** e íntegro (bundle verificado, SHA-256, prueba de restauración). La duda sobre el historial `63e18cf` queda documentada con recomendación (opción A) pendiente de aprobación. |
