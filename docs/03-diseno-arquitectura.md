# 03 — Diseño de arquitectura

> Fase de diseño del ciclo SDD. Traduce la constitución (`docs/01-constitucion.md`) y la
> especificación (`docs/02-especificacion.md`) en decisiones de arquitectura, estructura de
> archivos, componentes, modelo de datos, estado del carrito y estrategia de estilos. **No es
> implementación**: este documento describe *qué* se va a construir y *por qué*, no el código final.

## Metadatos

| Campo | Valor |
| --- | --- |
| Proyecto | Origen Café |
| Documento | Diseño de arquitectura |
| Versión | 0.2.3 |
| Estado | **Ratificado** — DD-02 y DD-03 aprobadas (2026-10-10); DD-15/16/17 aprobadas en la Fase F (2026-10-13) |
| Fecha | 2026-10-13 |
| Idioma de la documentación | Español (neutro/profesional) |
| Documentos relacionados | `docs/01-constitucion.md`, `docs/02-especificacion.md`, `docs/04-plan-implementacion.md`, `docs/05-registro-decisiones.md` |
| Base de referencia | Constitución v0.3.0 + Especificación v0.3.0 |

## 1. Propósito y alcance

Definir la arquitectura de una **landing page estática** de café de especialidad, construida con
Astro + TypeScript + Tailwind CSS v4, que se desplegará en Vercel. El diseño cubre:

- Arquitectura general y modelo de interactividad (islas cliente) **ratificado** (DD-02/DD-03).
- Estructura final de carpetas en la raíz del proyecto.
- Rutas, páginas y componentes.
- Modelo de datos de demostración y tipos TypeScript.
- Módulo de estado del carrito: almacenamiento local, validación de datos y actualización de la interfaz.
- Estrategia de estilos (Tailwind v4 + tokens), responsividad y accesibilidad.
- Preparación del despliegue en Vercel.

**Fuera de alcance del diseño:** implementación de código, contenido comercial real, backend,
base de datos, pasarela de pagos, autenticación y cualquier dato que no sea de demostración.

## 2. Principios de diseño

1. **La especificación manda.** Cada decisión de diseño traza a un requisito (RF/RNF) o a una
   decisión de arquitectura (D-xx / DD-xx). Nada se diseña sin requisito que lo respalde.
2. ***Static-first*.** Salida estática sin servidor. La interactividad se limita a islas cliente
   explícitas.
3. ***Mobile-first* y accesible.** Se diseña primero para pantallas pequeñas y con accesibilidad
   como requisito, no como añadido (RNF-001, RNF-003).
4. **Demo-only y honesto.** Todos los datos son ficticios y están etiquetados como demostración
   (D-12, RF-010). Nunca se afirma información real.
5. **Sin secretos ni red.** El repositorio no contiene credenciales ni claves; el despliegue usa
   valores por defecto de Vercel. No hay `fetch` ni persistencia en servidor (RNF-009).
6. **Simplicidad sobre ceremonia.** Un único punto de estado del carrito en cliente, sin framework
   de UI (DD-02 ratificado) y con la única persistencia local acotada al carrito (DD-03 ratificado).

## 3. Decisiones de diseño (DD)

Cada decisión indica su motivo, los requisitos que atiende y su estado. **Todas las decisiones
fueron ratificadas**; el registro formal está en `docs/05-registro-decisiones.md`.

| ID | Decisión | Motivo | Requisitos | Estado |
| --- | --- | --- | --- | --- |
| DD-01 | Salida **estática** de Astro (`output: 'static'`, sin adaptador). El despliegue sirve archivos pre-renderizados. | No hay backend ni datos dinámicos; simplifica el despliegue en Vercel. | D-08, RNF-002, RNF-009 | Ratificada |
| DD-02 | Interactividad mediante **una isla cliente compartida** escrita en **TypeScript *vanilla*** (sin framework de UI). Catálogo, filtros, carrito y resumen operan sobre esa isla. | Mantiene el stack sin dependencias de framework (menos peso, menos superficie de fallo) y centraliza el estado en un único punto. Alternativa descartada: islas con Preact/React (mayor peso y una dependencia adicional no justificada por la escala del proyecto). | RF-002, RF-004, RF-005, D-08 | **Ratificada (2026-10-10)** |
| DD-03 | El carrito **persiste en `localStorage`** del navegador bajo una **clave propia y versionada**; cada página rehidrata el estado desde el almacenamiento al cargar, con validación de datos y recuperación segura (JSON inválido, entradas desconocidas, almacenamiento no disponible). La supervivencia entre rutas y recargas **no depende de la navegación de cliente**: funciona con navegación estándar de Astro. | D-15 define el detalle como ruta propia; sin persistencia, navegar o recargar perdería el carrito y rompería RF-004/CA-042/CA-045. `localStorage` conserva el estado entre rutas y recargas sin backend. Una isla de Astro **no** persiste automáticamente entre navegaciones: el estado se reconstruye desde el almacenamiento en cada carga. | RF-004, CA-042, CA-045 … CA-048, RNF-012, D-14, D-15 | **Ratificada (2026-10-10)** — sustituye la propuesta anterior (`<ClientRouter />` + `transition:persist` sin almacenamiento) |
| DD-04 | Datos de demostración en un módulo tipado `src/data/cafes.ts`. Valores **ficticios** y marcados como demo. | Evita inventar o afirmar datos comerciales reales; facilita sustituirlos más adelante. | RF-001, RF-010, D-12 | Ratificada |
| DD-05 | Formato de precios con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`, siempre acompañado de aviso demo. | Formato consistente y localizado para COP; soporta CA-043. | RF-005, CA-043, D-16 | Ratificada |
| DD-06 | Aviso de demostración como componente reutilizable (`DemoNotice.astro`) más microcopy junto a los precios. | Garantiza visibilidad del aviso (RF-010) en todos los puntos donde aparecen datos ficticios. | RF-010 | Ratificada |
| DD-07 | Rutas: `/` (inicio con secciones catálogo, origen y contacto) y `/cafes/[id]` (detalle de café). | D-15 exige ruta propia y *deep-linkable* para el detalle. | RF-003, CA-041, D-15 | Ratificada |
| DD-08 | Estilos con **Tailwind CSS v4** vía `@tailwindcss/vite`; tokens de tema en `src/styles/global.css` usando la directiva `@theme`. | D-08 fija Tailwind v4; los tokens centralizan la identidad visual. | RNF-004, RNF-007, D-08 | Ratificada |
| DD-09 | Accesibilidad base: foco visible, roles/aria en el carrito (patrón *drawer/dialog*), etiquetas en el formulario y contraste AA. | La accesibilidad es requisito, no opción (RNF-003). | RNF-003 | Ratificada |
| DD-10 | Sin red y sin backend: no `fetch`, no API, no persistencia en servidor. El pedido y el formulario son **simulados**; la única persistencia local es el carrito en `localStorage` (DD-03). | D-12 y RNF-009 prohiben backend y datos reales. | RF-006, RF-008, D-12, RNF-009, RNF-012 | Ratificada |
| DD-11 | Semántica y SEO: *layout* con `lang="es"`, `header`/`main`/`footer`, `<title>` y descripción por página. | Idioma de UI en español y estructura semántica. | RNF-004, RNF-010, RNF-011 | Ratificada |
| DD-12 | Filtros combinables (región ficticia, perfil de tueste, método de proceso) aplicados en cliente sobre el estado del catálogo. | D-13 concreta los tres ejes de filtrado. | RF-002, CA-040, D-13 | Ratificada |
| DD-13 | Esquema **versionado** del carrito persistido (campo `version` + `items`), validación estricta al cargar y **recuperación segura**: JSON inválido → carrito vacío; ítems inválidos → descartados; almacenamiento no disponible → modo memoria. | Soporta los criterios CA-046, CA-047, CA-048 y CA-050 de RF-004/RNF-012. | RF-004, RNF-012 | Ratificada |
| DD-15 | Ilustraciones de demostración como **SVG autorales** (`scripts/generate-cafe-art.mjs`, derivados de `src/data/cafes.ts` en `public/images/`), servidas con `<img>` (`alt` con significado; *lazy* en tarjetas, *eager* en detalle). | Activos propios, sin licencias de terceros; coherentes con el tema. | RF-001 (CA-001), mandato de cierre (ítem 5) | **Aprobada (2026-10-13)** |
| DD-16 | **Búsqueda** de catálogo en cliente: eje `query` combinable con los 3 filtros, normalización sin acentos y coincidencia por subcadena (trim + colapso de espacios en `cafeMatchesQuery`). | El mandato (ítem 6) exige búsqueda; extiende RF-002 y respeta DD-02/DD-03. | RF-002 (CA-051) | **Aprobada (2026-10-13)** |
| DD-17 | **Runner de pruebas mínimo**: Vitest ^5.0.4 + jsdom ^30.1.2 (devDependencies), entorno `jsdom`, `tests/**/*.test.ts`. | Pruebas ejecutables con dependencias mínimas (mandato, ítem 7). | Revisión de CA (Fase D) | **Aprobada (2026-10-13)** |

## 4. Arquitectura de la aplicación

```
┌──────────────────────────────────────────────────────────────┐
│                        Navegador (cliente)                     │
│                                                                │
│   Documento HTML (pre-renderizado por Astro)                   │
│   ├── Layout.astro  (lang="es", header/main/footer)            │
│   ├── Contenido estático (texto, cards, imágenes)              │
│   └── Isla cliente compartida (DD-02)                          │
│         ├── cart-store.ts   ← único estado mutable del carrito │
│         │     (lee/escribe localStorage, valida y notifica)    │
│         ├── cableado de filtros (RF-002)                       │
│         ├── carrito / drawer / resumen (RF-004, RF-005)        │
│         └── formulario y pedido simulados (RF-006, RF-008)     │
│                                                                │
│   localStorage (DD-03/DD-13) ← persistencia del carrito        │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │ build estático
┌──────────────────────────────────────────────────────────────┐
│   Astro (build)  →  dist/  →  hosting estático (Vercel)        │
│   Sin servidor de aplicación, sin base de datos, sin APIs      │
└──────────────────────────────────────────────────────────────┘
```

**Flujo de datos:** cada página carga → la isla se hidrata → `cart-store` lee `localStorage`,
valida y publica el estado → las vistas suscritas se actualizan. Las interacciones del usuario
agregar/eliminar/ajustar mutan el *store* → las vistas se vuelven a renderizar → el estado se
persiste a `localStorage`. No hay llamadas de red. La navegación entre `/` y `/cafes/[id]` (con
recarga o sin ella) reconstruye el estado desde el almacenamiento en cada página.

> **Una isla de Astro no persiste automáticamente entre navegaciones.** Cada página hidrata y
> destruye sus propias islas; no comparten memoria entre rutas. La continuidad del carrito se
> logra porque el estado vive en `localStorage` (fuera del ciclo de vida de la página) y cada
> página lo rehidrata al arrancar su isla. Esto funciona incluso con la navegación MPA estándar de
> Astro (recarga completa) y no requiere `<ClientRouter />` ni `transition:persist` para el estado.

## 5. Estructura final de archivos (propuesta, en la raíz)

Resultado esperado tras ejecutar las fases A/B del plan de implementación (ver
`docs/04-plan-implementacion.md`). El **traslado del scaffold a la raíz (Fase A)** y la
**configuración base (Fase B)** ya se ejecutaron (2026-10-10); los componentes restantes se
incorporan en la Fase C.

```
C:\Proyectos\OrigenCafe\
├── docs/                          ← documentación SDD (se preserva)
│   ├── 01-constitucion.md
│   ├── 02-especificacion.md
│   ├── 03-diseno-arquitectura.md
│   ├── 04-plan-implementacion.md
│   └── 05-registro-decisiones.md
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                    ← imágenes locales (si aplica)
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── DemoNotice.astro
│   │   ├── Hero.astro
│   │   ├── CafeCard.astro
│   │   ├── Catalog.astro
│   │   ├── Filters.astro
│   │   ├── CartDrawer.astro
│   │   ├── OrderSummary.astro
│   │   ├── OriginSection.astro
│   │   └── ContactForm.astro
│   ├── data/
│   │   └── cafes.ts               ← datos de demostración (ficticios)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── types.ts
│   │   ├── cart-store.ts          ← estado + persistencia + validación
│   │   └── format.ts
│   ├── pages/
│   │   ├── index.astro
│   │   └── cafes/
│   │       └── [id].astro
│   └── styles/
│       └── global.css             ← @import "tailwindcss" + @theme
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
├── .vscode/                      ← carpetas de editor del scaffold (se trasladan)
├── AGENTS.md                     ← instrucciones de agentes (se trasladan tal cual)
├── CLAUDE.md                     ← instrucciones de agente (se trasladan tal cual)
└── README.md                     ← reemplazado en la Fase B (2026-10-10)
```

> **Precondiciones de la Fase A (D-17):** antes de ejecutar el traslado se requiere (1) el respaldo
> externo verificado — copia íntegra del árbol con ambos repositorios Git (excluye `node_modules/`),
> bundle del repositorio anidado verificado con `git bundle verify`, manifest de hashes SHA-256 y
> prueba de restauración en directorio temporal — y (2) la decisión sobre el historial `63e18cf`
> (recomendación en `docs/05-registro-decisiones.md`, sección 3). Detalle operativo en
> `docs/04-plan-implementacion.md`, Anexos A y B.

> **Nota:** los nombres de archivos y carpetas usan **inglés** (identificadores técnicos); el
> contenido visible al usuario es **español** (D-10, D-11).

## 6. Rutas y páginas

| Ruta | Archivo | Tipo | Contenido | Requisitos |
| --- | --- | --- | --- | --- |
| `/` | `src/pages/index.astro` | Estática + isla | Hero, catálogo con filtros, sección Origen, contacto, footer | RF-001, RF-002, RF-007, RF-008, RF-009 |
| `/cafes/[id]` | `src/pages/cafes/[id].astro` | Estática (generada) + isla | Detalle del café según `id`: nombre, origen ficticio, tueste, proceso, notas, precio demo, acción "agregar al pedido" | RF-003, CA-041, D-15 |

Con `output: 'static'` y `getStaticPaths`, Astro genera una página por cada café del módulo de
datos. El identificador `id` debe ser estable y *slug-friendly* (por ejemplo, `etiopia-yirgacheffe-demo`).

## 7. Componentes

| Componente | Naturaleza | Responsabilidad | Requisitos |
| --- | --- | --- | --- |
| `Layout.astro` | Estático | Envoltorio HTML, `lang="es"`, metadatos, monta la isla del carrito | RNF-004, RNF-010, RNF-011, DD-03 |
| `Header.astro` | Estático (+ enlace a isla) | Navegación global, marca, acceso al carrito (contador) | RF-009, RF-004 |
| `Footer.astro` | Estático | Información de cierre, aviso demo | RF-009, RF-010 |
| `DemoNotice.astro` | Estático | Aviso reutilizable de contenido ficticio | RF-010 |
| `Hero.astro` | Estático | Encabezado de bienvenida de la landing | RF-001 |
| `CafeCard.astro` | Estático | Tarjeta de café en el catálogo (enlaza al detalle) | RF-001, RF-003 |
| `Catalog.astro` | Estático + isla | Grilla de `CafeCard` filtrable | RF-001, RF-002 |
| `Filters.astro` | Isla | Controles de región/tueste/proceso (combinables) | RF-002, CA-040, D-13 |
| `CartDrawer.astro` | Isla | Panel del carrito: líneas, cantidades, eliminar, estado vacío | RF-004, CA-009 … CA-011 |
| `OrderSummary.astro` | Isla | Resumen y totales en COP + acción de pedido simulado | RF-005, RF-006, CA-043 |
| `OriginSection.astro` | Estático | Relato del origen del café (contenido ficticio) | RF-007 |
| `ContactForm.astro` | Isla | Formulario validado en cliente, envío simulado | RF-008 |

**Criterio de isla:** solo los componentes con estado o interacción (filtros, carrito, resumen,
formulario) son islas cliente. Todo lo demás se renderiza estático.

## 8. Modelo de datos y tipos (TypeScript)

Tipos propuestos (los nombres en inglés; los valores son **ficticios**):

```ts
// src/lib/types.ts

export type Region = 'norte-demo' | 'sur-demo' | 'centro-demo' | 'oriente-demo';
export type RoastProfile = 'claro' | 'medio' | 'oscuro';
export type ProcessMethod = 'lavado' | 'natural' | 'honey';

export interface Cafe {
  id: string;              // slug estable, p. ej. "etiopia-yirgacheffe-demo"
  name: string;            // nombre visible (ficticio)
  region: Region;          // región ficticia (RF-002)
  roast: RoastProfile;     // perfil de tueste (RF-002)
  process: ProcessMethod;  // método de proceso (RF-002)
  notes: string[];         // notas de cata (texto libre ficticio)
  priceCop: number;        // precio ilustrativo en COP (D-16)
  description: string;     // descripción ficticia
  image?: string;          // ruta de imagen local (opcional)
}

export interface OrderItem {
  cafeId: string;          // referencia al café (id conocido del catálogo)
  quantity: number;        // entero >= 1 (CA-010)
  priceCop: number;        // copia del precio demo al agregar (RF-005)
}

export interface CartState {
  items: OrderItem[];
}

export interface CatalogFilters {
  region?: Region;
  roast?: RoastProfile;
  process?: ProcessMethod;
}
```

> Nota de diseño: el ítem del carrito copia `priceCop` al momento de agregar (RF-005) y la
> validación de carga lo contrasta contra el catálogo vigente, descartando ítems cuyo `id` ya no
> exista (CA-047).

El módulo `src/data/cafes.ts` exporta `cafes: Cafe[]` con un conjunto de demostración (por ejemplo,
6 a 8 elementos) **claramente ficticio**. Ejemplo ilustrativo de un registro (valor ficticio):

```ts
// src/data/cafes.ts (extracto ilustrativo — contenido de demostración)
export const cafes: Cafe[] = [
  {
    id: 'etiopia-yirgacheffe-demo',
    name: 'Yirgacheffe (demo)',
    region: 'norte-demo',
    roast: 'claro',
    process: 'lavado',
    notes: ['cítrico', 'floral'],
    priceCop: 42000,
    description: 'Descripción de demostración. Este producto es ficticio y no corresponde a un café real.',
  },
  // ...
];
```

> El precio `42000` es un número ilustrativo de formato, **no** un precio real de mercado.

## 9. Estado e interactividad del carrito

**`src/lib/cart-store.ts`** — módulo singleton a nivel de módulo, sin dependencias. Combina tres
responsabilidades acotadas:

1. **Estado en memoria:** publica `CartState` y notifica cambios a las vistas suscritas.
2. **Almacenamiento local (DD-03/DD-13):** persiste en `localStorage` bajo una clave única propia
   del proyecto (por ejemplo, `origen-cafe:cart:v1`) con **esquema versionado**.
3. **Validación y recuperación segura (DD-13):** al cargar, deserializa y valida cada entrada;
   ante datos corruptos restablece un estado consistente sin romper la interfaz.

```ts
// API propuesta (sin implementar aún)
type Listener = (state: CartState) => void;

load(): void;                                     // lee localStorage, valida y publica (al hidratar)
add(cafeId: string, quantity?: number): void;     // RF-004, CA-008; agrega/suma y persiste
remove(cafeId: string): void;                     // CA-009; elimina y persiste
setQuantity(cafeId: string, quantity: number): void; // RF-004; ajusta (>= 1) y persiste
clear(): void;                                    // RF-006 (tras pedido simulado); persiste
getState(): CartState;
subscribe(listener: Listener): () => void;        // notificación de cambios a la vista
```

**Ciclo de vida y recuperación segura:**

1. La isla se hidrata en cada página (`client:load` o `client:idle` en `Layout.astro`).
2. `load()` intenta `JSON.parse` del valor guardado. Si el valor **no es JSON válido** (texto
   truncado o corrupto), se descarta, el carrito queda vacío y no se muestra error (CA-046).
3. Cada ítem se valida: `cafeId` debe existir en el catálogo, `quantity` entero ≥ 1, `priceCop`
   número ≥ 0. Los ítems inválidos se **descartan** (CA-047). Si la versión del esquema no es la
   soportada, se aplica migración o reinicio seguro (CA-050).
4. Si `localStorage` **no está disponible** (excepción de acceso, cuota, modo privado), el store
   opera en memoria durante la sesión y reintenta persistir en cada mutación (CA-048).
5. Cada mutación (`add`, `remove`, `setQuantity`, `clear`) actualiza el estado en memoria,
   **notifica** a los suscriptores (contador del header, drawer, resumen) y **persiste**
   `JSON.stringify` a `localStorage`. Si la escritura falla, la interfaz sigue funcionando en
   memoria.
6. Navegar a otra ruta o recargar destruye la instancia anterior; la página nueva vuelve a
   `load()` desde `localStorage` y reproduce el mismo carrito (CA-042, CA-045).

**Cableado de vistas:**

1. `Header` (contador), `CartDrawer` y `OrderSummary` se suscriben al store en la carga de la isla.
2. El drawer y el resumen viven en la isla compartida; no requieren estado entre páginas más allá
   del que el store rehidrata.
3. Filtros: el estado de `CatalogFilters` se aplica en el cliente para mostrar/ocultar `CafeCard`;
   es independiente del carrito y no se persiste (vive solo en la página actual).
4. Pedido simulado: `clear()` tras la confirmación y el estado vacío se persiste (CA-016).

**Fallback sin JavaScript:** el contenido esencial (catálogo, información) se renderiza estático;
sin JS no hay carrito ni filtros interactivos, pero la página sigue siendo legible y navegable
(*progressive enhancement*).

## 10. Estilos y tema (Tailwind v4)

Configuración sin `tailwind.config.js` (Tailwind v4):

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-coffee-50: #faf6f1;
  --color-coffee-100: #f0e6d9;
  --color-coffee-500: #7a5230;
  --color-coffee-700: #4a2f1a;
  --color-coffee-900: #2a1a0e;
  --color-accent: #c8102e;              /* acento (demo) */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Playfair Display", serif;
  --radius-card: 1rem;
}
```

Los valores anteriores son **propuesta de paleta de demostración**; se ajustarán al implementar.
Los tokens `@theme` generan utilidades (`bg-coffee-500`, `font-display`, etc.). No se fija todavía
un sistema de diseño cerrado: se documentará en el código al implementar.

## 11. Estrategia responsiva

| Breakpoint | Objetivo | Derivación |
| --- | --- | --- |
| `< 640px` (móvil) | Una columna; catálogo en una tarjeta por fila; drawer a pantalla casi completa | RNF-001, RNF-007 |
| `640–1024px` (tablet) | Dos columnas de catálogo; drawer lateral | RNF-001, RNF-007 |
| `> 1024px` (escritorio) | Tres a cuatro columnas; drawer lateral persistente | RNF-001, RNF-007 |

Enfoque *mobile-first* con utilidades responsivas de Tailwind.

## 12. Accesibilidad

- **Foco visible** en todos los controles interactivos.
- **Carrito/drawer** con patrón accesible: rol `dialog`, `aria-label`, cierre con `Escape`, foco
  atrapado mientras está abierto y retorno del foco al disparador al cerrar.
- **Filtros** como grupo con etiquetas asociadas; cambios anunciados de forma comprensible.
- **Formulario** con `<label>` por campo, mensajes de error asociados (`aria-describedby`) y
  estados de validación accesibles.
- **Contraste** mínimo AA (4.5:1) en texto y controles.
- Imágenes con texto alternativo; elementos decorativos con `alt=""` o `aria-hidden`.

Alineado con RNF-003.

## 13. Límites del sistema

Se explicitan los límites entre contenido estático, interactividad y datos de demostración:

| Capa | Qué contiene | Qué NO contiene |
| --- | --- | --- |
| Contenido estático (HTML pre-renderizado) | Estructura semántica, textos, cards, imágenes, avisos demo | Estado mutable, lógica de negocio, datos de sesión |
| Interactividad (isla compartida, DD-02) | Filtros, carrito, resumen, formulario; único estado mutable del carrito | Acceso a red, persistencia distinta de `localStorage` del carrito |
| Datos de demostración (`src/data/cafes.ts`) | Catálogo de cafés 100 % ficticio y tipado | Datos reales, precios de mercado, certificaciones verificadas |
| Persistencia (DD-03/DD-13) | Únicamente el carrito en `localStorage`, versionado y validado | Preferencias, historial, formularios, cualquier dato a servidor |

## 14. Preparación del despliegue en Vercel

- **Build:** `npm run build` genera `dist/`. `output: 'static'` → sitio estático puro.
- **Detección:** Vercel reconoce Astro automáticamente; no se requieren variables de entorno ni
  secretos.
- **Node:** usar una versión compatible con el proyecto (engines actuales: `node >=22.12.0`).
- **Repositorio:** el despliegue se hará desde el repositorio Git raíz una vez resuelta la
  reorganización del scaffold y autorizado el *push* (puertas humanas, ver plan).
- **Archivos ignorados:** `node_modules/`, `dist/`, `.astro/`.

El despliegue efectivo está **fuera de alcance de este documento** y se planifica en la Fase E de
`docs/04-plan-implementacion.md`.

## 15. Trazabilidad diseño ↔ requisitos

| Requisito | Cobertura en el diseño |
| --- | --- |
| RF-001 Catálogo | `Catalog.astro`, `CafeCard.astro`, `src/data/cafes.ts` (DD-04), `public/images/*.svg` (DD-15) |
| RF-002 Filtros | `Filters.astro`, `CatalogFilters`, DD-12, DD-16 (búsqueda, CA-051) |
| RF-003 Detalle | `/cafes/[id].astro`, DD-07 |
| RF-004 Carrito | `cart-store.ts` (persistencia + validación), `CartDrawer.astro`, DD-02/DD-03/DD-13 |
| RF-005 Precios/resumen | `OrderSummary.astro`, `format.ts`, DD-05 |
| RF-006 Pedido simulado | `OrderSummary.astro`, `cart-store.clear()`, DD-10 |
| RF-007 Origen | `OriginSection.astro` |
| RF-008 Contacto | `ContactForm.astro`, DD-10 |
| RF-009 Navegación | `Header.astro`, `Footer.astro`, `Layout.astro` |
| RF-010 Aviso demo | `DemoNotice.astro`, DD-06 |
| RNF-001 Responsive | Sección 11 |
| RNF-002 Rendimiento | DD-01, DD-02 (isla mínima) |
| RNF-003 Accesibilidad | DD-09, sección 12 |
| RNF-004 Semántica | DD-11, `Layout.astro` |
| RNF-006 `astro check` | Configuración TS + script `check` (plan) |
| RNF-009 Sin secretos / sin red | DD-10, sección 14 |
| RNF-010 SEO | DD-11 |
| RNF-011 Idioma español | D-10, DD-11 |
| RNF-012 Persistencia local segura | DD-03, DD-13, sección 9 |

## 16. Decisiones ratificadas (2026-10-10)

1. **DD-02 — Interactividad:** isla compartida con TypeScript *vanilla* (sin framework de UI).
   **Ratificada.**
2. **DD-03 — Persistencia del carrito entre rutas y recargas:** `localStorage` con clave propia,
   esquema versionado, validación y recuperación segura. **Ratificada**; sustituye la propuesta
   anterior de `<ClientRouter />` + `transition:persist` sin almacenamiento.

El registro formal de ambas consta en `docs/05-registro-decisiones.md`. Con esta ratificación, la
Fase C del plan de implementación queda **habilitada**.

## 17. Historial de cambios

| Versión | Fecha | Descripción |
| --- | --- | --- |
| 0.1.0 | 2026-10-10 | Creación del documento. Define arquitectura estática, estructura final de archivos, rutas, componentes, modelo de datos, estrategia de estilos, responsividad, accesibilidad, aviso demo y preparación de despliegue. Registra DD-01 … DD-12 y las dos decisiones pendientes de ratificación. |
| 0.2.0 | 2026-10-10 | **Ratificación de DD-02 y DD-03** (registro formal en `docs/05-registro-decisiones.md`). DD-03 pasa a persistencia en `localStorage` con clave versionada, validación y recuperación segura (nuevo DD-13; se revisa DD-10 y se aclara que las islas de Astro no persisten entre navegaciones). Se agrega la sección de límites del sistema, se expande el diseño del `cart-store` y se actualiza la trazabilidad (RNF-012). El documento se renombra a `03-diseno-arquitectura.md`. |
| 0.2.1 | 2026-10-10 | Inspección documental del repositorio anidado (2026-10-10). Se completa la estructura final de archivos en la raíz (`.vscode/`, `AGENTS.md`, `CLAUDE.md`, `README.md`) y se registran las precondiciones de la Fase A (respaldo externo verificado, D-17, y decisión pendiente sobre el historial `63e18cf`). |
| 0.2.2 | 2026-10-10 | **Actualización factual de estado (sin cambios de diseño).** La sección 5 refleja que el traslado del scaffold a la raíz (Fase A) y la configuración base (Fase B) **ya se ejecutaron** (2026-10-10); se precisa que el `README.md` fue reemplazado en la Fase B. Ninguna decisión de diseño (DD-01 … DD-13) se modifica. |
| 0.2.3 | 2026-10-13 | **Fase F (cierre académico).** Se incorporan **DD-15** (SVG autorales en `public/images/`), **DD-16** (búsqueda de catálogo, RF-002/CA-051) y **DD-17** (runner de pruebas Vitest + jsdom). Se actualiza la trazabilidad diseño ↔ requisitos. Sin cambios en decisiones previas. |