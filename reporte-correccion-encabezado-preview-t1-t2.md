# Reporte — corrección de encabezado y previsualización T1/T2

## 1. Causas raíz encontradas

### Encabezado T2

El renderer usaba el literal fijo `Unidad académica / administrativa` en el encabezado y la portada. Además, la carrera del T2 estaba omitida en el encabezado repetido y el motor podía recuperar una carrera anterior al generar un informe administrativo.

### Scroll

El wrapper del paso 7 de T2 no resolvía una altura propia dentro de la cadena flex. Su hijo declaraba `height: 100%`, pero el contenedor intermedio mantenía altura automática. El visor terminaba dependiendo del scroll exterior, que estaba bloqueado en ese paso. El contenedor documental interno ya tenía `overflow: auto`, pero no recibía un alto acotado fiable.

### Expandir preview

El estado expandido solo ocultaba la sidebar global. `DocumentPdfPageViewer` continuaba dentro de las dimensiones del wizard y no ocupaba el viewport.

## 2. Cambios realizados

- `src/documentEngine/DocumentPdfPageViewer.tsx`
  - Centraliza la etiqueta, unidad y carrera desde la metadata del artefacto.
  - Renderiza `Unidad académica` o `Unidad administrativa` según `institutionalUnitType`.
  - Muestra la carrera para T1/T2 académicos y la omite en documentos administrativos.
  - Convierte la vista expandida en una capa `position: fixed`, `inset: 0`, `100vw × 100vh` y `z-index: 1000`.
  - Mantiene toolbar, páginas, zoom, panel documental y scroll bidireccional.
  - Permite salir mediante el botón SVG o `Escape` sin reiniciar estado.
- `src/documentEngine/useDocumentEngine.ts`
  - Limpia `careerId` y `carrera` cuando la procedencia efectiva es administrativa, tanto al crear como al generar el artefacto T2.
- `src/modulo11/WizardInformeView.tsx`
  - Limpia inmediatamente los datos de carrera al elegir una unidad administrativa.
  - Corrige la cadena de altura del contenedor del paso 7 con altura resuelta y `minHeight: 0`.
- `tests/e2e/preview-layout.spec.ts`
  - Amplía la cobertura focalizada de procedencia, persistencia, scroll y pantalla completa.

## 3. Encabezado T2

- Académico: muestra `Unidad académica`, la Facultad y `Carrera de Ingeniería de Software` en la celda institucional.
- Administrativo: muestra `Unidad administrativa` y `Dirección de Planificación y Evaluación`.
- En el caso administrativo no renderiza Carrera y el artefacto persistido conserva `careerId: undefined` y `carrera: ""`.
- Ya no aparece el literal combinado `Unidad académica / administrativa`.

## 4. Scroll

El paso 7 ahora entrega al visor todo el alto disponible entre el stepper y el footer del wizard. `document-scroll-container` conserva `overflow: auto`, por lo que permite llegar al borde inferior en portrait y landscape, y desplazarse horizontalmente cuando el zoom excede el ancho útil. El panel derecho mantiene su scroll independiente.

## 5. Modo expandido

El visor cubre el viewport completo con una capa interna de la aplicación. Permanecen visibles la toolbar completa, navegación directa, versión, ronda, zoom, Ajustar, documento A4 y panel documental. El estado actual de página y zoom permanece al entrar y salir. La salida funciona con el control SVG y con `Escape`.

## 6. Pruebas añadidas/modificadas

- T2 académico: etiqueta, Facultad, Carrera y ausencia del literal combinado.
- T2 administrativo: etiqueta y unidad correctas, selector Carrera oculto, carrera ausente y limpieza verificada en el documento persistido.
- T2 normal y expandido: scroll hasta el final, viewport completo, toolbar, zoom, página y salida mediante `Escape`.
- T1 portrait y matriz landscape: scroll vertical, scroll horizontal con zoom, viewport completo, conservación de página y `pageCount`.
- Regresión visual T1/T2 para comprobar encabezados, tablas, firmas, footer y marca BORRADOR.

## 7. Snapshots

Se inspeccionaron antes de actualizarlos.

Cambios legítimos:

- `t1-portada-chromium-win32.png`: etiqueta específica `Unidad académica`.
- `t2-portada-chromium-win32.png`: etiqueta específica y Carrera añadida.
- `t2-contenido-chromium-win32.png`: encabezado repetido corregido.
- `t2-firmas-chromium-win32.png`: encabezado/documento T2 coherente tras la corrección.

No cambiaron:

- `t1-matriz-chromium-win32.png`.
- `t1-firmas-historial-chromium-win32.png`.

La inspección confirmó A4 intacto, tablas sin recorte, firmas sin desplazamiento indebido, footer visible y marca BORRADOR conservada.

## 8. Resultados

| Validación | Resultado |
|---|---:|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS |
| `node --test tests/document-engine.test.mjs` | PASS — 1/1 |
| `node --test tests/a4-page-size.test.mjs` | PASS — 1/1 |
| `node --test tests/no-visible-emojis.test.mjs` | PASS — 1/1; 87 archivos revisados |
| `npx playwright test tests/e2e/preview-layout.spec.ts` | PASS — 3/3 |
| Pruebas visuales T1/T2 | PASS — 2/2 |
| `npm run test:e2e` | PASS — 31/31; 0 fallos |

## 9. Riesgos restantes

La validación cubre los viewports institucionales de escritorio solicitados. Viewports móviles menores no forman parte del alcance de esta corrección.
