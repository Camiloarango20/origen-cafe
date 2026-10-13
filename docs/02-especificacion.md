# 02 — Especificación de requisitos Origen Café

> **Fase 0 — Constitución y definición.** Especificación de requisitos funcionales y no funcionales, con identificadores únicos y criterios de aceptación verificables, en el marco de Spec-Driven Development (SDD). Este documento no describe implementación.

## Metadatos

| Campo | Valor |
| --- | --- |
| Proyecto | Origen Café |
| Documento | Especificación de requisitos |
| Versión | 0.4.0 |
| Estado | Decisiones ratificadas (DD-02 / DD-03); **Fases A … E ejecutadas y verificadas (2026-10-10)** y **Fase F de cierre ejecutada (2026-10-13)** — búsqueda añadida (RF-002 extendido, CA-051) y gráficos propios (DD-15) |
| Fecha | 2026-10-13 |
| Documentos relacionados | `docs/01-constitucion.md`, `docs/03-diseno-arquitectura.md`, `docs/04-plan-implementacion.md`, `docs/05-registro-decisiones.md` |

---

## 1. Propósito

Definir los requisitos funcionales y no funcionales de la landing page Origen Café, junto con criterios de aceptación verificables, como base para las fases de diseño, implementación y verificación. Esta especificación deriva de la constitución (`docs/01-constitucion.md`) y respeta sus restricciones de alcance.

## 2. Convenciones

### 2.1 Identificadores

| Prefijo | Significado | Rango |
| --- | --- | --- |
| `RF-###` | Requisito funcional | RF-001 … |
| `RNF-###` | Requisito no funcional | RNF-001 … |
| `CA-###` | Criterio de aceptación | CA-001 … |
| `U-##`, `S-##` | Usuarios y stakeholders | Definidos en `01-constitucion.md` |
| `OE-##` | Objetivos específicos | Definidos en `01-constitucion.md` |

### 2.2 Prioridad (MoSCoW)

| Valor | Significado |
| --- | --- |
| **Must** | Obligatorio para la entrega de esta fase del proyecto. |
| **Should** | Importante; se incluye si el tiempo lo permite. |
| **Could** | Deseable; mejora la experiencia. |
| **Won't** | Fuera del alcance actual (no se implementará en este proyecto). |

### 2.3 Formato de criterios de aceptación

Cada criterio se expresa como **Dado / Cuando / Entonces** (precondición / acción / resultado observable y verificable).

### 2.4 Aviso sobre los datos

Todos los nombres de productos, orígenes, notas de cata, precios y contenidos son **ficticios** y se identifican en la interfaz como contenido de demostración. No representan productores, fincas, certificaciones ni precios reales.

Los precios se expresan en **pesos colombianos (COP)** únicamente como **formato ilustrativo** de valores ficticios, con un **aviso visible de demostración** (D-16).

---

## 3. Requisitos funcionales

### RF-001 — Catálogo de cafés (Must)

**Descripción:** La página principal muestra un catálogo de cafés de demostración en formato de tarjetas (*cards*), cada una con nombre, imagen original de demostración (SVG local, DD-15), origen y precio demo.

**Trazabilidad:** F-01 · OE-01, OE-04

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-001 | El visitante abre la página de catálogo | La página carga | Se muestran al menos 4 tarjetas de café con nombre, imagen y precio demo |
| CA-002 | Se renderizan las tarjetas | Se inspecciona la interfaz | Cada precio visible está acompañado de una indicación de que es contenido de demostración |

### RF-002 — Filtros de catálogo (Must)

**Descripción:** El visitante puede **buscar** y **filtrar** el catálogo: la búsqueda por texto (palabra o fragmento, sin distinguir acentos) es **combinable** con los filtros por **región ficticia**, **perfil de tueste** y **método de proceso** (D-13). Todo se aplica en el cliente (DD-02) y el resultado se actualiza sin recargar la página.

**Trazabilidad:** F-02 · OE-04

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-003 | El catálogo completo está visible | El visitante selecciona un filtro con resultados | Solo se muestran los cafés que cumplen el filtro |
| CA-004 | Hay filtros activos | El visitante limpia los filtros | Se vuelve a mostrar el catálogo completo |
| CA-005 | El visitante aplica un filtro sin coincidencias | El filtro se aplica | Se muestra un mensaje de "sin resultados" |
| CA-040 | El catálogo está visible | Se revisan los controles de filtrado | Existen filtros por región ficticia, perfil de tueste y método de proceso, combinables entre sí |
| CA-051 | El catálogo está visible | El visitante escribe un término de búsqueda (con o sin acentos) | Se muestran solo los cafés cuyo nombre, origen, región, tueste o proceso contienen el término; la búsqueda es combinable con los filtros activos |

### RF-003 — Detalle de producto (Must)

**Descripción:** Al seleccionar una tarjeta del catálogo, el visitante accede a una **ruta propia de Astro** de detalle de producto (D-15), con la información del café (descripción, notas de cata, origen, presentaciones y precio demo en COP) y una acción para agregarlo al pedido.

**Trazabilidad:** F-03 · OE-04

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-006 | El catálogo está visible | El visitante selecciona una tarjeta | Navega a la ruta de detalle del café correspondiente |
| CA-007 | La vista de detalle está abierta | Se visualiza la información | Los datos mostrados corresponden al café seleccionado y están marcados como demo |
| CA-008 | La vista de detalle está abierta | El visitante usa la acción "agregar al pedido" | El producto se incorpora al resumen del pedido |
| CA-041 | La ruta de detalle de un café es conocida | Se abre o recarga directamente esa URL | La página de detalle se renderiza correctamente (ruta propia y enlazable) |

### RF-004 — Carrito de compras simulado (Must)

**Descripción:** El visitante puede agregar productos, eliminar productos y ajustar cantidades. El carrito persiste en **`localStorage`** del navegador (D-14 / DD-03) y se **conserva entre rutas y recargas**: cada página rehidrata el estado desde el almacenamiento local al cargar, de modo que ni navegar entre rutas ni recargar la página lo pierde. El módulo de estado debe manejar `JSON` inválido o entradas desconocidas con **recuperación segura** (restablecer el carrito a un estado consistente sin romper la interfaz). No hay backend ni envío de datos (RNF-009). El mecanismo se define en `docs/03-diseno-arquitectura.md` (DD-03).

**Trazabilidad:** F-04 · OE-06

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-009 | El carrito tiene al menos un producto | El visitante elimina ese producto | El producto desaparece del carrito |
| CA-010 | El carrito tiene un producto en cantidad 1 | El visitante disminuye la cantidad | La cantidad no baja de 1 (o el producto se elimina, según el diseño) |
| CA-011 | El carrito tiene 0 productos | El visitante abre el carrito | Se muestra un estado vacío con una invitación a explorar el catálogo |
| CA-042 | El carrito tiene ítems persistidos | El visitante recarga la página | El carrito se restaura con los mismos ítems desde `localStorage` (no aparece vacío) |
| CA-045 | El carrito tiene un producto agregado desde la ruta de detalle | El visitante navega de vuelta al catálogo (con recarga o sin ella) | El carrito conserva el producto (la navegación entre rutas no lo reinicia) |
| CA-046 | `localStorage` contiene un valor que no es `JSON` válido (por ejemplo, texto truncado o corrupto) | La página de cualquier ruta carga | El carrito se restablece a vacío, no se muestra ningún error y la interfaz sigue funcionando con normalidad |
| CA-047 | `localStorage` contiene un carrito con entradas inválidas (cantidad ≤ 0, ítem sin id o id inexistente en el catálogo) | La página carga | Las entradas inválidas se descartan y el carrito resultante queda en un estado consistente y utilizable |
| CA-048 | `localStorage` no está disponible (bloqueado por el navegador, cuota excedida o modo privado restrictivo) | El visitante usa la aplicación | El sitio no falla: el carrito funciona en memoria durante la sesión y, si el almacenamiento se restablece, el estado vuelve a persistirse |

### RF-005 — Resumen de pedido y totales (Must)

**Descripción:** El carrito muestra los ítems, la cantidad, el subtotal por ítem y un total general, calculados en el cliente. Los importes son de demostración.

**Trazabilidad:** F-05 · OE-06

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-012 | El carrito tiene varios ítems con distintas cantidades | Se muestra el resumen | El total equivale a la suma de (precio unitario demo × cantidad) de cada ítem |
| CA-013 | Se modifica la cantidad de un ítem | Cambia la cantidad | El subtotal y el total se recalculan correctamente |

### RF-006 — Simulación de pedido (Must)

**Descripción:** El visitante puede "finalizar" el pedido mediante una acción que muestra una confirmación simulada en el frontend. No se envía información a ningún servidor.

**Trazabilidad:** F-06 · OE-06

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-014 | El carrito tiene al menos un ítem | El visitante confirma el pedido | Se muestra una confirmación de pedido simulado con el resumen |
| CA-015 | La confirmación está visible | Se inspecciona la pantalla | Se indica claramente que el pedido es una simulación y que no se realizó ninguna compra real |
| CA-016 | La confirmación se mostró | El visitante cierra la confirmación | El carrito queda vacío (y el estado vacío se persiste) |

### RF-007 — Sección de origen (Should)

**Descripción:** Sección narrativa que comunica la historia y el origen del café. El texto es **ilustrativo/ficticio** y no afirma hechos reales sobre productores, fincas ni certificaciones.

**Trazabilidad:** F-07 · OE-01, OE-04

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-017 | El visitante navega a la sección "Origen" | La sección se muestra | Presenta contenido narrativo sobre el origen del café |
| CA-018 | La sección está visible | Se inspecciona el contenido | El texto no presenta afirmaciones sobre productores, fincas o certificaciones reales sin marcarlas como ficticias |

### RF-008 — Formulario de contacto (Must)

**Descripción:** Formulario con campos (por ejemplo, nombre, correo y mensaje) y validación en el cliente. No envía datos a ningún servidor; muestra confirmación simulada.

**Trazabilidad:** F-08 · OE-04

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-019 | El formulario está visible | El visitante envía con campos obligatorios vacíos | Se muestran mensajes de error y no se envía |
| CA-020 | El visitante ingresa un correo con formato inválido | Intenta enviar | Se muestra un error de validación del correo |
| CA-021 | Todos los campos son válidos | El visitante envía el formulario | Se muestra una confirmación simulada y el formulario se restablece |

### RF-009 — Navegación global y diseño responsivo en la estructura (Must)

**Descripción:** Encabezado con navegación a las secciones principales y pie de página con información mínima. La interfaz se adapta a móvil, tableta y escritorio.

**Trazabilidad:** F-09 · OE-05

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-022 | El visitante está en cualquier sección | Usa un enlace de la navegación | Se desplaza a la sección correspondiente |
| CA-023 | La interfaz se ve en un ancho móvil | Se navega | La navegación es utilizable sin desplazamiento horizontal |
| CA-024 | La interfaz se ve en un ancho de escritorio | Se navega | El contenido se distribuye en el layout de escritorio sin romperse |

### RF-010 — Etiquetado de contenido de demostración (Must)

**Descripción:** Toda la información comercial ficticia (productos, precios, orígenes, notas) se identifica de forma visible como contenido de demostración.

**Trazabilidad:** F-10 · OE-01

**Criterios de aceptación:**

| ID | Dado | Cuando | Entonces |
| --- | --- | --- | --- |
| CA-025 | El visitante recorre las secciones de catálogo, detalle y pedido | Visualiza datos comerciales | Existe al menos una indicación visible de que los datos son de demostración |
| CA-026 | Existe contenido de "origen" | Se revisa | No se presenta información ficticia como si fuera verificada o real |
| CA-043 | Se muestran precios en la interfaz | Se inspecciona un precio | El valor se presenta en COP y está acompañado por el aviso de que es un precio ficticio de demostración |

---

## 4. Requisitos no funcionales

### RNF-001 — Responsividad (Must)

Diseño *mobile-first* con puntos de corte consistentes (por ejemplo, móvil, tableta, escritorio).

- **CA-027:** En anchos de 360 px, 768 px y 1280 px la interfaz no presenta desplazamiento horizontal ni superposición de elementos.

### RNF-002 — Rendimiento (Should)

- **CA-028:** La página de inicio obtiene una puntuación objetivo de rendimiento ≥ 90 en Lighthouse (móvil) en la fase de verificación.
- **CA-029:** Las imágenes usan formatos y tamaños adecuados, y las no visibles inicialmente se cargan de forma diferida (*lazy loading*).

### RNF-003 — Accesibilidad (Must)

Objetivo: WCAG 2.1 nivel AA en los flujos principales.

- **CA-030:** Toda la funcionalidad es operable solo con teclado (incluidos filtros, carrito y formulario).
- **CA-031:** Las imágenes con significado tienen texto alternativo; los campos del formulario tienen etiquetas asociadas.
- **CA-032:** El contraste de texto cumple la relación mínima de AA.

### RNF-004 — SEO y metadatos (Should)

- **CA-033:** La página define título, descripción y metadatos sociales básicos.

### RNF-005 — Compatibilidad de navegadores (Should)

- **CA-034:** La interfaz funciona en las versiones actuales de Chrome, Edge y Firefox, y en Safari móvil.

### RNF-006 — Tipado y calidad de tipos (Must)

- **CA-035:** El proyecto pasa `astro check` sin errores, con TypeScript en modo estricto habilitado (D-09).

### RNF-007 — Mantenibilidad y estructura (Should)

- **CA-036:** La interfaz se organiza en componentes reutilizables (encabezado, tarjeta de producto, lista de catálogo, carrito, formulario) con separación clara de responsabilidades.

### RNF-008 — Usabilidad (Should)

- **CA-037:** Un visitante nuevo puede pasar de la página de inicio a un producto y agregarlo al pedido sin instrucciones externas.

### RNF-009 — Privacidad y ausencia de backend (Must)

- **CA-038:** Ningún dato ingresado por el visitante se transmite a un servidor; el formulario y el pedido son simulaciones en el cliente.
- **CA-049:** El carrito persiste únicamente en `localStorage` del dispositivo; ningún dato del carrito sale del navegador ni se transmite a un servidor (RNF-009 / DD-03).

### RNF-010 — Semántica y estructura del documento (Should)

- **CA-039:** La página usa HTML semántico (encabezados jerárquicos, `main`, `nav`, `footer`) y una estructura de encabezados coherente.

### RNF-011 — Idioma de la interfaz (Must)

- **CA-044:** El documento declara `lang="es"` y la totalidad de la copia visible al usuario está en español (D-10).

### RNF-012 — Persistencia local segura (Must)

El carrito se persiste en el cliente de forma aislada y tolerante a fallos.

- **CA-050:** El carrito se guarda bajo una clave de `localStorage` propia del proyecto, con estructura versionada; los cambios de versión o esquema no rompen la carga (migración o reinicio seguro).

---

## 5. Trazabilidad objetivo ↔ requisito

| Objetivo | Requisitos relacionados |
| --- | --- |
| OE-01 Definir problema y alcance | RF-007, RF-010 |
| OE-02 Especificar requisitos | Este documento |
| OE-03 Diseñar arquitectura y datos | RF-001 … RF-010 (detalle de arquitectura y datos en `docs/03-diseno-arquitectura.md`) |
| OE-04 Implementar interfaz | RF-001, RF-002, RF-003, RF-007, RF-008, RF-009 |
| OE-05 Diseño responsivo y accesible | RF-009, RNF-001, RNF-003 |
| OE-06 Simulación del pedido | RF-004, RF-005, RF-006 |
| OE-07 Verificación | Todos (vía criterios de aceptación) |

## 6. Modelo de datos conceptual (demostración)

> Modelo **conceptual** para orientar la implementación del frontend. Todos los valores son ficticios.

**Café**

| Campo | Tipo | Nota |
| --- | --- | --- |
| `id` | string | Identificador único |
| `nombre` | string | Nombre de fantasía (demo) |
| `origen` | string | Región de fantasía (demo) |
| `tueste` | string | Perfil de tueste |
| `proceso` | string | Método de proceso |
| `notasCata` | string[] | Notas descriptivas (demo) |
| `descripcion` | string | Texto ficticio |
| `precio` | number | Precio **demo** expresado en COP, no definitivo (D-16) |
| `imagen` | string | Marcador de posición |

**Ítem de pedido (`OrderItem`)**

| Campo | Tipo | Nota |
| --- | --- | --- |
| `cafeId` | string | Referencia al café |
| `cantidad` | number | Entero ≥ 1 |
| `precioUnitario` | number | Copia del precio demo al momento de agregar |

**Pedido (`Order`)**

| Campo | Tipo | Nota |
| --- | --- | --- |
| `items` | `OrderItem[]` | Ítems del pedido |
| `total` | number | Suma de `precioUnitario × cantidad` |

> **Persistencia:** el `Order` se serializa como `JSON` en `localStorage` (DD-03). Si el valor guardado no puede deserializarse o validarse, se restablece a un pedido vacío y se conserva el funcionamiento normal (RF-004, CA-046 … CA-048).

## 7. Supuestos y dependencias

- El proyecto se desarrollará sobre Astro con TypeScript y Tailwind CSS v4 (`@tailwindcss/vite`), según las decisiones D-08 y D-09 de `docs/01-constitucion.md`.
- Los gráficos de demostración son **SVG autorales generados por script** (DD-15): no se dependen recursos de terceros ni licencias externas.
- El navegador del visitante tiene JavaScript habilitado para las islas interactivas.
- El navegador del visitante dispone de `localStorage` para la persistencia del carrito; si no está disponible, la aplicación degrada a estado en memoria (CA-048).
- La ratificación de DD-02/DD-03 (ver `docs/05-registro-decisiones.md`) habilita la Fase C del plan; la reorganización física del scaffold (D-07/D-17) se completará antes de la implementación.

## 8. Requisitos explícitamente fuera de alcance (Won't)

- RF y RNF asociados a pagos reales, autenticación, backend, base de datos, envío real de correos e internacionalización. **No** se implementarán en este proyecto.

## 9. Dudas y supuestos pendientes (reales)

Resueltas por las decisiones D-13 … D-16 de la constitución (atributos de filtrado, persistencia del carrito, ubicación de la vista de detalle, moneda) y por la ratificación de DD-02/DD-03 (estrategia de interactividad y persistencia; ver `docs/05-registro-decisiones.md`). Las dudas que **permanecen abiertas** son:

1. Mecánica y momento del traslado físico del scaffold a la raíz (D-07), planificado en `docs/04-plan-implementacion.md`; pendiente de respaldo verificado (D-17) y autorización.
2. Manejo del historial del repositorio Git anidado al resolverlo.
3. Detalle del formato de precios en COP: definido a nivel de diseño (DD-05); a confirmar al implementar.

## 10. Historial de cambios

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.1.0 | 2026-10-10 | Creación inicial del documento (propuesta de requisitos, Fase 0). |
| 0.2.0 | 2026-10-10 | Se concretan los filtros (región/tueste/proceso), el carrito en memoria, el detalle como ruta propia y los precios en COP con aviso demo. Se agregan CA-040 … CA-044, RNF-011 y se actualiza RNF-006. Decisiones registradas en `docs/01-constitucion.md`. |
| 0.2.1 | 2026-10-10 | Revisión de coherencia: RF-004 aclara la conservación del carrito entre rutas (nuevo CA-045) y se referencian `docs/03-diseno.md` y `docs/04-plan-implementacion.md`. |
| 0.3.0 | 2026-10-10 | Ratificación de DD-02/DD-03. RF-004 pasa a persistencia en `localStorage` con manejo de `JSON` inválido y recuperación segura: se revisa CA-042 (recarga restaura el carrito), se agregan CA-046, CA-047, CA-048, CA-049 y CA-050, y se agrega RNF-012. Se actualizan las referencias del diseño a `docs/03-diseno-arquitectura.md` y se depuran las dudas pendientes. |
| 0.4.0 | 2026-10-13 | **Fase F de cierre.** RF-002 se extiende con **búsqueda combinable** (nuevo **CA-051**; DD-16) y RF-001 concreta las imágenes como **SVG originales propios** (DD-15). Se actualiza el supuesto de recursos gráficos. Ninguna decisión previa se modifica. |