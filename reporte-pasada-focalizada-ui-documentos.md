# Reporte — Pasada focalizada UI y documentos

Fecha: 14 de septiembre de 2026  
Naturaleza: mockup interactivo de alta fidelidad.

## 1. Fuentes institucionales revisadas

- `requirements.md`, `implementation-status.md`, `AGENTS.md` y `prompt.md`.
- `Documentos_guia/TI-JD2026-UTIT-PLAN-V01-signed.pdf`: PDF T1 firmado, 6 páginas A4. Se usó como fuente principal para encabezado, portada y footer.
- `Documentos_guia/UTA-SGC-A-2-1-P7-T2 Formato Informe (1).docx`: DOCX T2, convertido de forma temporal a PDF para inspección visual; 5 páginas tamaño carta.
- `Documentos_guia/UTA-SGC-A-2-1-P7-T1 Formato Plan de trabajo (1).docx`, `comisiones.xlsx` y `PROPUESTAS DE MEJORA CARRERA DE TI.xlsx`: revisados para estructura, tablas y coherencia de datos DEMO.
- No se encontraron versiones T1/T2 más recientes en `Documentos_guia`.
- Se mantuvieron las decisiones confirmadas de las reuniones documentadas. Los textos instructivos de las plantillas no se imprimen como contenido final.

## 2. Asistente IA

La causa raíz del error T1 era el orden de actualización: `setState` se ejecutaba y, de inmediato, el autosave recibía el draft anterior, con riesgo de sobrescribir la sugerencia aplicada. Se conectaron Justificación y Objetivo al autosave del borrador por documento y se eliminó la escritura posterior con estado obsoleto.

En T1 y T2 cada propuesta conserva `field`, `original` y `suggestion`. Aplicar escribe solo en el campo de origen; Descartar cierra la propuesta sin modificar el texto. Los textareas son controlados y sus contadores/completitud se actualizan con el estado React. T2 guarda sus campos textuales en `fisei-informe-draft-v2`; el reset DEMO y la firma final limpian ese borrador.

Cobertura: aplicar y persistir Justificación T1, descartar Objetivo T1 y aplicar/persistir Antecedentes T2.

## 3. Encabezado T1

Antes existía una fila independiente `Carrera`, ausente en el PDF firmado. El encabezado final usa cuatro filas: Universidad; título del Plan; unidad institucional con Facultad y Carrera en una única celda de valor; y fecha de elaboración. Se ajustaron tipografía serif, azul institucional, fondo gris, bordes, alturas y fecha larga.

La portada mantiene Facultad y Carrera como bloques separados, seguida del grupo y período. El footer conserva una sola fila, sin línea superior, con texto de uso interno, código T1 y página dinámica.

Se revisaron y actualizaron selectivamente los snapshots `t1-portada`, `t1-matriz` y `t1-firmas-historial` porque el encabezado repetido cambió legítimamente en las tres capturas.

## 4. Unidad académica / administrativa

Modelo DEMO:

- `institutionalUnitType`: `ACADEMIC` o `ADMINISTRATIVE`;
- `institutionalUnitId` y nombre histórico dentro del artefacto;
- `careerId` y carrera solo para unidades académicas;
- entidad independiente de grupos, comisiones, unidades operativas y clubes.

Administración permite listar, crear, editar y activar/desactivar unidades. Una académica exige al menos una carrera; una administrativa no muestra ni exige Carrera. La configuración persiste en `localStorage`.

Los wizards T1 y T2 consumen el mismo catálogo. Las opciones inactivas no aparecen en nuevos documentos. Los artefactos ya creados guardan nombre, tipo y carrera como snapshot, por lo que desactivar el catálogo no altera el histórico.

## 5. T2

Errores reales corregidos:

- normalización incompleta permitía `INFORME DE: INFORME DE...`;
- T2 heredaba la fila Carrera del encabezado T1;
- el footer T2 añadía una línea superior que no está en la plantilla;
- el modo derivado permitía avanzar sin un Plan válido;
- el bloque central de portada se desplazaba fuera del área visible;
- el borrador textual T2 no sobrevivía al cierre/reapertura.

`normalizeInformeTitle` acepta entradas legacy con o sin dos puntos y guarda el título semántico en mayúsculas. El renderer agrega `INFORME DE:` una sola vez.

El encabezado T2 se implementó como estructura propia de cuatro filas, sin Carrera. El modo derivado limita los planes a T1 del usuario actual, con estado validado o en ejecución. La selección importa actividades, medios, grupo, período y metadatos institucionales mediante copias. La tabla derivada usa únicamente Actividad, Medios de verificación, Porcentaje de ejecución y Observaciones. El modo independiente usa desarrollo textual y no imprime una tabla vacía.

Firmas, páginas y ubicaciones siguen `artifact.pages.length` y `signatureSlots`. El historial usa solo datos del artefacto. La regresión compara el Plan completo antes y después de crear/firmar el Informe.

Se revisaron y actualizaron selectivamente `t2-portada`, `t2-contenido` y `t2-firmas` tras contrastarlos con el DOCX.

## 6. Dashboard administrador

El Panel General ahora muestra:

- borradores, en revisión, en corrección, validados y en ejecución;
- evidencias pendientes, observadas y validadas;
- flujos configurados y pendientes;
- usuarios, grupos y período activo;
- actividad documental reciente sin exponer credenciales o datos sensibles.

Las tarjetas navegan a Reportes, validación de evidencias, Flujos, Usuarios, Grupos, Períodos y Auditoría. No incluye rankings, puntuaciones, productividad, evaluación docente ni predicciones.

## 7. Configurador de plantillas

Se reemplazó la vista de solo lectura por un builder HTML5 real. Las secciones permitidas se reordenan con drag-and-drop; encabezado, información general, firmas, historial y footer quedan bloqueados. Las secciones permitidas exponen visibilidad activa y su estado requerida/opcional/condicional.

La vista previa enumera el orden vigente. Guardar persiste por plantilla; Restaurar predeterminado recupera el fixture oficial. T1 y T2 tienen estados independientes. Cada documento nuevo captura `templateConfiguration` con orden y secciones activas; los documentos existentes y firmados no se modifican. El renderer conserva los límites rígidos del formato oficial y no ofrece libertad WYSIWYG.

## 8. Bugs adicionales encontrados

- Los IDs de unidades basados solo en `Date.now()` colisionaban bajo reloj DEMO fijo; se añadió un sufijo aleatorio.
- La selección derivada T2 no mostraba una opción vacía explícita y siempre sugería sincronización aunque no hubiera Plan.
- El bloque T2 central dependía de `minHeight` y `space-between`, lo que lo desplazaba en el visor embebido.

## 9. Archivos modificados

Principales:

- `src/App.tsx`
- `src/documentEngine/DocumentPdfPageViewer.tsx`
- `src/documentEngine/types.ts`
- `src/documentEngine/useDocumentEngine.ts`
- `src/modulo11/WizardInformeView.tsx`
- `src/modulo7/AdminDashboardView.tsx`
- `src/modulo7/PlantillasDocumentalesView.tsx`
- `src/modulo7/UnidadesInstitucionalesView.tsx`
- `src/modulo7/mockDataAdmin.ts`
- `src/modulo7/types.ts`
- `src/modulo7/useAdminState.ts`
- `implementation-status.md`
- pruebas y seis snapshots enumerados en las secciones siguientes.

`prompt.md` ya estaba modificado antes de esta ejecución y no fue alterado por la implementación. No se restauró ningún reporte eliminado.

## 10. Tests nuevos

- `tests/e2e/ai-writing-assistant.spec.ts` — 2 escenarios.
- `tests/e2e/institutional-units.spec.ts` — 1 escenario.
- `tests/e2e/t2-derived-validation.spec.ts` — 1 escenario.
- `tests/e2e/admin-dashboard.spec.ts` — 1 escenario.
- `tests/e2e/template-builder.spec.ts` — 1 escenario.
- `tests/document-engine.test.mjs` amplía la regresión de título T2 legacy.

## 11. Resultado de todos los comandos

- `npx tsc --noEmit`: PASS, código 0.
- `npm run build`: PASS, código 0; 93 módulos transformados. Vite informó advertencias no bloqueantes preexistentes sobre `configLoader: native` y tamaño del chunk principal.
- `node --test tests/document-engine.test.mjs`: PASS, 1 prueba, 0 fallos.
- `npx playwright test tests/e2e/ai-writing-assistant.spec.ts`: PASS, 2 pruebas.
- `npx playwright test tests/e2e/institutional-units.spec.ts`: PASS, 1 prueba.
- `npx playwright test tests/e2e/t2-derived-validation.spec.ts`: PASS, 1 prueba.
- `npx playwright test tests/e2e/admin-dashboard.spec.ts`: PASS, 1 prueba.
- `npx playwright test tests/e2e/template-builder.spec.ts`: PASS, 1 prueba.
- `npm run test:e2e`: PASS, **25 pruebas**, 0 fallos, 0 omitidas; duración 1,9 minutos.

## 12. Snapshots modificados

- `tests/e2e/visual-regression.spec.ts-snapshots/t1-portada-chromium-win32.png`
- `tests/e2e/visual-regression.spec.ts-snapshots/t1-matriz-chromium-win32.png`
- `tests/e2e/visual-regression.spec.ts-snapshots/t1-firmas-historial-chromium-win32.png`
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-portada-chromium-win32.png`
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-contenido-chromium-win32.png`
- `tests/e2e/t2-visual-regression.spec.ts-snapshots/t2-firmas-chromium-win32.png`

Los seis se actualizaron solo después de inspeccionar la referencia institucional y las imágenes recibidas/diff. No se actualizó ninguna otra regresión visual.

## 13. Pendientes institucionales reales

- Confirmar catálogo definitivo y nomenclatura oficial de unidades académicas, administrativas y carreras.
- Confirmar qué secciones no rígidas pueden cambiar de orden sin invalidar T1/T2.
- Confirmar autoridades, cargos y destinos colegiados por cada flujo.
- Definir integración DTIC para firma electrónica real y servicio institucional de IA. En el mockup ambos procesos siguen marcados como DEMO.
- Confirmar tamaño de página productivo de T2: el DOCX fuente está configurado en carta, mientras T1 firmado está en A4.

## 14. Riesgos que aún no tienen cobertura automática

- Comparación geométrica/pixel a pixel directa entre el DOM del mockup y el PDF/DOCX externo; la revisión actual combina inspección visual y snapshots internos.
- Edición simultánea en varias pestañas sobre el mismo `localStorage` DEMO.
- Catálogos muy extensos y contenido T2 excepcionalmente largo más allá de los fixtures actuales.
- Aplicación de orden libre al PDF final: se restringió para proteger la estructura oficial; el snapshot de configuración queda en nuevos artefactos, pero el renderer mantiene bloques institucionales rígidos.
