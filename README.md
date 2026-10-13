# Origen Café

Sitio de catálogo de café de especialidad con carrito de compras simulado. Proyecto de
demostración: **los datos de productos, productores, precios y certificaciones son ficticios**.

Sin backend, base de datos, pagos, autenticación, envíos reales ni CMS. Todo el comportamiento
interactivo (catálogo, búsqueda, filtros y carrito) ocurre en el navegador.

## Stack

- [Astro](https://docs.astro.build) (salida estática)
- TypeScript en modo estricto
- Tailwind CSS v4 (vía `@tailwindcss/vite`, sin `tailwind.config.js`)
- Isla compartida en TypeScript vanilla (sin framework de UI)
- Pruebas con Vitest + jsdom (solo devDependencies)

## Requisitos

- Node.js `>= 22.12.0`

## Comandos

| Comando            | Acción                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Instala las dependencias                     |
| `npm run dev`      | Servidor de desarrollo en `localhost:4321`   |
| `npm run build`    | Compila el sitio de producción en `./dist/`  |
| `npm run preview`  | Previsualiza la compilación localmente       |
| `npm run check`    | Comprueba tipos (`astro check`)              |
| `npm run test`     | Ejecuta la suite de pruebas (Vitest + jsdom) |
| `npm run astro ...`| Ejecuta comandos del CLI de Astro            |

## Estructura

```text
/
├── public/               # recursos estáticos servidos tal cual
├── src/
│   ├── assets/           # imágenes locales procesadas por Astro
│   ├── components/       # componentes de interfaz (.astro)
│   ├── data/             # datos del catálogo (demo)
│   ├── layouts/          # plantillas de página
│   ├── lib/              # lógica compartida (isla, store del carrito)
│   ├── pages/            # rutas del sitio
│   └── styles/           # global.css (Tailwind v4 + tokens @theme)
├── tests/                # suite de pruebas (Vitest + jsdom)
├── scripts/              # generador de activos SVG autorales
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Despliegue

El sitio se publica en Vercel (salida estática). La raíz incluye `vercel.json`, que fija
`framework: astro`, `buildCommand: npm run build` y `outputDirectory: dist` (Vercel **no** detectó
Astro automáticamente).

- Producción: `https://origen-cafe-rouge.vercel.app`
- Deploy manual por CLI: `vercel deploy --prod`

## Estado

Fases A … F completadas (2026-10-10 / 2026-10-13): configuración base, implementación del
catálogo con **búsqueda** y filtros, detalle, carrito persistente en `localStorage`, página 404,
activos visuales originales (SVG autorales), verificación y despliegue. La suite de pruebas
(Vitest + jsdom) ejecuta **76 tests en verde** que cubren la mayor parte de los criterios de
aceptación; `astro check` (30 archivos) y `npm run build` (10 páginas) también pasan sin errores.
Límites declarados: los criterios que exigen navegador real o Lighthouse (CA-027/028/030/032/034)
no se verificaron. Todo el contenido comercial es de demostración.
