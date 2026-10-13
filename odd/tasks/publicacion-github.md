# ODD — Publicación final en GitHub

> Documento de trabajo de Organic Driven Development. Deriva del mandato de publicación
> (2026-10-13). Estado: **en ejecución**.

## Objetivo

Publicar el código final validado de Origen Café en un repositorio **público** `origen-cafe`
de la cuenta de GitHub autenticada, con un commit inicial descriptivo, push de la rama de
trabajo y verificación posterior.

## Alcance

- Inspección previa (rama, estado, remotos, secretos, respaldo).
- Revisión de `.gitignore` y del contenido a publicar.
- Commit inicial y creación del remoto público.
- Push y verificación (hash, visibilidad, ausencia de secretos).
- Informe de entrega.

## Restricciones

- Sin `--force` ni reescritura de ramas remotas; sin tocar otros repositorios.
- Sin publicar secretos: `.env*`, tokens y credenciales quedan fuera; `node_modules/`, `dist/`,
  `.astro/`, `.vercel/` excluidos por `.gitignore`.
- El respaldo externo y el historial `63e18cf` no se modifican.
- No se marcan como aprobadas comprobaciones que requieran navegador real o Lighthouse.

## Tareas

- [x] **T-P1** Inspección previa y verificación del respaldo/bundle.
- [x] **T-P2** Revisión de `.gitignore` y barrido de secretos sobre el contenido a publicar.
- [ ] **T-P3** Commit inicial descriptivo con el proyecto final validado.
- [ ] **T-P4** Creación del repositorio público y vinculación del remoto.
- [ ] **T-P5** Push de la rama de trabajo.
- [ ] **T-P6** Verificación (hash remoto, visibilidad pública, sin secretos).
- [ ] **T-P7** Informe de entrega.

## Progreso y evidencia

- 2026-10-13 — **T-P1:** rama `master` **sin commits** y **sin remotos**; 18 rutas no
  rastreadas; gates re-ejecutados en el estado final: `astro check` 30 archivos 0/0/0,
  `npm run test` 76/76, `npm run build` 10 páginas. Bundle externo verificado:
  `63e18cfc2a2986b5d3f9fae9a0ac70d01b4f17bb`, historial completo, `git bundle verify` = *okay*.
- 2026-10-13 — **T-P2:** `.gitignore` cubría `dist/`, `.astro/`, `node_modules/`, `.vercel`,
  `.env*`; se añadieron `coverage/`, `*.tsbuildinfo` y `Thumbs.db` (salidas de las herramientas
  nuevas, Fase F). `gh` **no** está instalado; existe credencial de GitHub en el Administrador
  de credenciales de Windows para la cuenta `Camiloarango20`.
