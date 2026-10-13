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
- [x] **T-P3** Commit inicial descriptivo con el proyecto final validado.
- [x] **T-P4** Creación del repositorio público y vinculación del remoto.
- [x] **T-P5** Push de la rama de trabajo.
- [x] **T-P6** Verificación (hash remoto, visibilidad pública, sin secretos).
- [x] **T-P7** Informe de entrega.

## Progreso y evidencia

- 2026-10-13 — **T-P1:** rama `master` **sin commits** y **sin remotos**; 18 rutas no
  rastreadas; gates re-ejecutados en el estado final: `astro check` 30 archivos 0/0/0,
  `npm run test` 76/76, `npm run build` 10 páginas. Bundle externo verificado:
  `63e18cfc2a2986b5d3f9fae9a0ac70d01b4f17bb`, historial completo, `git bundle verify` = *okay*.
- 2026-10-13 — **T-P2:** `.gitignore` cubría `dist/`, `.astro/`, `node_modules/`, `.vercel`,
  `.env*`; se añadieron `coverage/`, `*.tsbuildinfo` y `Thumbs.db` (salidas de las herramientas
  nuevas, Fase F). `gh` **no** está instalado; existe credencial de GitHub en el Administrador
  de credenciales de Windows para la cuenta `Camiloarango20`.
- 2026-10-13 — **Barrido de secretos:** sobre los 66 archivos del índice no hay `.env`, `.pem`,
  claves privadas ni tokens con valor (`ghp_`, `github_pat_`, `sk-`, JWT `eyJ…`,
  `VERCEL_OIDC_TOKEN=`). Único acierto del patrón JWT: un fragmento base64 dentro de un hash
  `integrity` de `package-lock.json` (falso positivo).
- 2026-10-13 — **T-P3:** commit inicial `1e8b6b4418aae69454bf347b9294cc47a7a4f8d2`
  (`feat: initial Origen Cafe demo storefront`), 66 archivos y 11 641 líneas insertadas; árbol
  de trabajo limpio. Es commit raíz (sin padre): `git log --format="%H %P"` confirma padre vacío.
- 2026-10-13 — **T-P4:** repositorio **público** creado vía API de GitHub
  (`Camiloarango20/origen-cafe`, `private=false`) y remoto `origin` vinculado por HTTPS.
- 2026-10-13 — **T-P5:** `git push -u origin master` sin `--force`; rama `master` publicada y
  con seguimiento configurado.
- 2026-10-13 — **T-P6:** hash local == remoto (`1e8b6b44…`), `git diff HEAD origin/master`
  vacío, `default_branch=master`, 66 blobs en el árbol remoto y **sin** `.env`, `node_modules`,
  `dist`, `.astro` ni `.vercel`; acceso anónimo (sin credenciales) verificado por HTTP:
  repo 200, `README.md` 200 y `docs/05-registro-decisiones.md` 200 vía `raw.githubusercontent.com`.
- 2026-10-13 — **Gates sobre el estado commiteado (post-push):** `astro check` 30 archivos
  0/0/0, `npm run test` 76/76, `npm run build` 10 páginas; árbol limpio.
- 2026-10-13 — **Estado real del RDD:** modo **on** (decidido por *default*; global y
  clone-local unset). `gentle-ai review assess` devuelve `risk=high`,
  `review_due_reason=high_risk` con motivo **`unassessable`**: el candidato no tiene cambios
  pendientes y la forma `--base-ref <commit>` no puede expresar un commit raíz (no existe base
  contra la que comparar). **No se creó ninguna revisión ni se emitió veredicto**; el
  consentimiento de revisión del turno anterior quedó sin responder por decisión del usuario.
  El push es un gate de entrega informativo, no gestionado por el ciclo de revisión.

## Decisiones tomadas en esta tarea

- **D-P1:** el commit inicial se hizo con `git commit -F <archivo-de-mensaje>` (archivo temporal
  fuera del repositorio) para evitar problemas de codificación de PowerShell 5.1 con acentos.
- **D-P2:** como `gh` no está instalado, la creación del repositorio se hizo con la API REST de
  GitHub usando la credencial ya almacenada para la cuenta autenticada `Camiloarango20` (misma
  cuenta que `user.name`), sin imprimir ni registrar el token. No se consultó ni modificó
  ningún otro repositorio.
- **D-P3:** la actualización de evidencia de este documento se publica como segundo *work-unit
  commit* para mantener `local == remoto` con el árbol limpio.
