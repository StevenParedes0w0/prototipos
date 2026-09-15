# Reporte — Micro-pasada funcional final

Fecha: 14 de septiembre de 2026  
Fase: mockup interactivo de alta fidelidad.

## 1. T2 derivado y dataset DEMO

La causa del combo vacío era funcionalmente concreta: el filtro exigía correctamente un T1 del usuario autenticado en estado `VALIDADO` o `EN EJECUCIÓN`, pero el dataset restaurable no tenía ninguno para Andrea.

Se añadió el Plan canónico `doc-plan-andrea-vinculacion-2026` con esta combinación:

- docente: Ing. Andrea Pérez, Mg. (`usr-andrea-01`);
- grupo: Comisión de Vinculación con la Sociedad (`grp-4`);
- período: Julio – Diciembre 2026 (`per-1`);
- estado documental: `VALIDADO`;
- estado operativo: `EN EJECUCIÓN`.

Incluye flujo completado, dos actividades, responsables por ID, recursos y medios. No ocupa Andrea + Unidad de Titulación + Julio–Diciembre 2026, que permanece libre para las pruebas T1. También se añadió un empty state explicativo para usuarios sin Planes elegibles.

`tests/e2e/t2-canonical-dataset.spec.ts` parte de `Restablecer documentos DEMO`, usa la sesión Andrea, selecciona este Plan, verifica actividades y medios, llega a la previsualización y compara el Plan origen completo antes/después.

## 2. Stepper T2

La cabecera anterior repetía formato, progreso, título y ocho pasos en dos filas. Se reemplazó por una cabecera compacta con título, `Paso X de 8 — nombre`, barra fina y una sola fila horizontal.

Cada paso conserva título completo, estado accesible y diferenciación por número, icono SVG, borde, fondo y estado deshabilitado. En anchos menores la fila usa overflow horizontal controlado. `tests/e2e/t2-stepper.spec.ts` verifica a 1600 × 900 altura menor a 130 px, ocho pasos en la misma coordenada vertical, paso actual, bloqueo y navegación.

## 3. Cero emojis

Se localizaron pictogramas emoji en wizard T1/T2, configurador, perfil, documentos, actividades, auditoría, trazabilidad, notificaciones, cierre y reportes. Se sustituyeron por SVG de la librería local: `Sparkles`, `Lock`, `GripVertical`, `Info`, `AlertTriangle`, `Clock`, `FileText`, `FileSpreadsheet`, `Paperclip`, `Download`, `Search`, `History`, `ShieldCheck`, `Building2`, `User` y equivalentes.

`tests/no-visible-emojis.test.mjs` inspecciona los 87 archivos ejecutables `.ts/.tsx` bajo `src`, excluye las notas Markdown importadas que no forman parte de la aplicación y permite el símbolo legal de copyright. Resultado: PASS, cero pictogramas detectados.

## 4. A4 global

Se centralizó `PAGE_SIZE_A4`:

- portrait: 210 × 297 mm, 794 × 1123 px de referencia;
- landscape: 297 × 210 mm, 1123 × 794 px de referencia.

El visor expone `data-page-format="A4"`, dimensiones, orientación y proporción A4. T1 y T2 usan portrait salvo secciones con orientación propia; la matriz T1 conserva landscape A4 aunque cambie de posición.

`tests/a4-page-size.test.mjs` verifica constantes, portrait T1/T2 y landscape de matriz. No queda una selección Letter/Carta en el renderer. El DOCX T2 se conserva como referencia de contenido, pero la salida se normaliza a A4.

## 5. Configurador

En T1 son movibles: Información general, Justificación, Objetivo, Matriz, Anexos, Firmas e Historial. En T2 son movibles: Información general, Antecedentes, Desarrollo, Conclusiones, Oportunidades, Contactos, Anexos, Firmas e Historial.

Solo Encabezado institucional y Pie institucional permanecen fijos como marco de página. Las secciones requeridas aparecen siempre activas y ya no se confunden con secciones bloqueadas. Las opcionales/condicionales conservan activación y desactivación.

Guardar abre `Confirmar cambio de estructura` y explica que el cambio afecta solo documentos futuros. Restaurar predeterminado tiene una confirmación independiente. Orden y visibilidad persisten por plantilla en `localStorage`; T1 y T2 siguen aislados.

## 6. Renderer dinámico

El snapshot ahora conserva `templateId`, `configVersion`, `sectionOrder`, `activeSectionIds` y `capturedAt`. El compositor recorre esa lista, crea páginas en el orden guardado, numera títulos por posición real, construye el índice con números de página derivados y mantiene la orientación de cada sección.

Se corrigieron los previews T1 y T2, que antes llamaban a `buildDocumentPages` y eludían el snapshot. El visor configurado representa portada, índice, textos, matrices, contactos, anexos, firmas e historial desde `DocumentPage.blocks`.

La prueba de T1 cambia Objetivo, Información general, Firmas e Historial; luego comprueba que:

- `templateConfiguration.sectionOrder` coincide con Administración;
- el orden único de `artifact.pages[].contentSections` coincide con la configuración;
- el índice DOM `data-index-section` coincide con ese mismo orden;
- un cambio administrativo posterior no altera el snapshot del documento anterior.

La prueba T2 ejecuta el equivalente mínimo y valida el índice dinámico de la previsualización. Los artefactos firmados no se recomponen.

## 7. Estrategia IA

Se creó `docs/architecture/ai-provider-strategy.md` con:

- GroqCloud + GPT-OSS 120B como objetivo DEV configurable;
- OpenAI API + GPT-5.6 Luna como objetivo PROD configurable;
- `AiWritingService` → `AiProvider` → `GroqAiProvider` / `OpenAiProvider`;
- selección futura por `AI_PROVIDER`;
- ruta React → Spring Boot → proveedor;
- fallback que conserva el texto original;
- prohibición de claves en React, `VITE_*`, `localStorage`, logs y artefactos.

El mockup continúa con respuestas deterministas locales equivalentes a `MockAiProvider` y no realiza llamadas externas.

## 8. Base de datos

Se creó `docs/architecture/database-strategy.md`. PostgreSQL queda definido como base relacional principal, gratuita, local o institucional on-premise, detrás de Spring Boot. El desarrollo futuro podrá usar instalación local o Docker Compose local.

No se agregó backend, dependencia de PostgreSQL, DBaaS ni reemplazo de `localStorage`. La ubicación futura de binarios/PDF queda pendiente de validación institucional.

## 9. Bugs reales encontrados

1. Andrea no tenía un Plan canónico elegible para demostrar T2 tras reset.
2. El stepper T2 ocupaba dos filas y generaba una colisión de nombre accesible con el campo Antecedentes.
3. Había pictogramas emoji dispersos en pantallas principales y modales.
4. El tamaño A4 no estaba centralizado ni expuesto de forma verificable en el visor.
5. El configurador trataba `REQUERIDA` como sinónimo de bloqueada para Información general, Firmas e Historial.
6. Guardar y restaurar estructura no pedían confirmación.
7. El snapshot de plantilla existía, pero el compositor ignoraba su orden y mantenía títulos, índice y páginas hardcodeados.
8. Los previews T1/T2 usaban el constructor heredado y no representaban el orden real.
9. El nuevo Plan canónico duplicaba una notificación inicial; se evitó ese evento derivado porque el fixture de notificaciones ya representa el escenario DEMO.

## 10. Archivos modificados

- Documentación: `requirements.md`, `implementation-status.md`, `docs/architecture/ai-provider-strategy.md`, `docs/architecture/database-strategy.md`.
- Motor: `src/documentEngine/types.ts`, `pagination.ts`, `useDocumentEngine.ts`, `mockDataDocument.ts`, `DocumentPdfPageViewer.tsx`.
- Aplicación y UI: `src/App.tsx`, `src/components/icons.tsx`, `src/modulo11/WizardInformeView.tsx`, `MisDocumentosView.tsx`, `src/modulo7/PlantillasDocumentalesView.tsx`, `mockDataAdmin.ts`, `useAdminState.ts`, `UsuariosView.tsx`, y pantallas con sustitución de iconografía en módulos 5, 8, 9 y 10.
- Pruebas: motor, A4, emojis, dataset T2, stepper T2, configurador, validación T2 y regresiones visuales T1/T2.

`prompt.md` ya estaba modificado y `reporte-correcciones-post-reunion.md` ya estaba eliminado al iniciar. No se modificó el prompt ni se restauró ningún reporte eliminado. `reporte-e2e-secundario.md` continúa ausente.

## 11. Tests nuevos/modificados

Nuevos:

- `tests/e2e/t2-canonical-dataset.spec.ts`;
- `tests/e2e/t2-stepper.spec.ts`;
- `tests/a4-page-size.test.mjs`;
- `tests/no-visible-emojis.test.mjs`.

Ampliados:

- `tests/e2e/template-builder.spec.ts`;
- `tests/e2e/t2-derived-validation.spec.ts`;
- `tests/e2e/visual-regression.spec.ts`;
- `tests/e2e/t2-visual-regression.spec.ts`;
- `tests/document-engine.test.mjs`.

## 12. Resultado final

- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS, 93 módulos transformados.
- `node --test tests/document-engine.test.mjs`: 1/1 PASS.
- `node --test tests/a4-page-size.test.mjs`: 1/1 PASS.
- `node --test tests/no-visible-emojis.test.mjs`: 1/1 PASS.
- pruebas focalizadas dataset T2: 1/1 PASS.
- pruebas focalizadas stepper T2: 1/1 PASS.
- pruebas focalizadas configurador: 2/2 PASS.
- `npm run test:e2e`: **28 PASS, 0 FAIL, 0 omitidas**.

Vite mantiene advertencias no bloqueantes preexistentes sobre futura carga nativa de configuración y tamaño del chunk principal.

## 13. Snapshots actualizados

Se actualizaron únicamente las seis capturas afectadas por A4 y el renderer dinámico, después de inspección visual:

- `tests/e2e/visual-regression.spec.ts-snapshots/t1-portada-chromium-win32.png`;
- `tests/e2e/visual-regression.spec.ts-snapshots/t1-matriz-chromium-win32.png`;
- `tests/e2e/visual-regression.spec.ts-snapshots/t1-firmas-historial-chromium-win32.png`;
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-portada-chromium-win32.png`;
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-contenido-chromium-win32.png`;
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-firmas-chromium-win32.png`.

## 14. Pendientes institucionales

- Confirmar despliegue, credenciales, límites y nombres de modelo vigentes cuando se implemente el backend de IA.
- Definir esquema productivo, política de migraciones y operación institucional de PostgreSQL.
- Definir dónde se almacenarán los archivos binarios/PDF; esta decisión no se inventó.
- La integración real de firma con DTIC continúa fuera del alcance del mockup.
