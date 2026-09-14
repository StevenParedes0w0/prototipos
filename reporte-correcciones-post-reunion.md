# Reporte de correcciones post-reunión

## 1. Fuentes revisadas

- `AGENTS.md`: alcance de mockup, aislamiento documental, identidad, firmas, responsables, estados y criterios de terminación.
- `requirements.md`: FR-RESP-001 a FR-RESP-005, historial T1 y Firma y Finalización. Este documento consolidado ya establece que el documento continúa automáticamente al siguiente nivel configurado.
- `implementation-status.md`: deudas declaradas sobre responsables colectivos y resaltado.
- `prompt.md`: evidencia funcional posterior a la reunión y criterios de aceptación de esta intervención.
- `tests/e2e/README.md`, suite E2E y prueba del motor documental.
- Notas importadas `src/imports/pasted_text/ai-redaction-pdf-format.md`, `modulo-3-plan-trabajo.md` y `modulo-3-sync.md`: reflejan el comportamiento anterior de firma y envío separados.
- Código actual del wizard T1/T2, motor documental, visor, observaciones, ejecución y evidencias.

`reporte-e2e-secundario.md` no estaba disponible en el proyecto al iniciar esta intervención. No se restauró ni recreó.

## 2. Responsable colectivo

### Comportamiento anterior

El artefacto podía guardar `Integrantes de la Unidad`, la matriz mostraba cantidades como `3 personas` y la vista de revisión mostraba nombres individuales incluso al seleccionar a todo el grupo. La selección del borrador conservaba nombres, pero no mantenía siempre `responsableIds` y `responsableNames` desde el momento de selección.

### Requerimiento confirmado

Cuando todos los integrantes aplicables están seleccionados, la presentación debe usar una denominación colectiva. La frase literal confirmada para Comisión es `Responsable de la comisión`. Para los otros tipos se aplican `Responsable de la unidad`, `Responsable del club` y `Responsable del grupo`.

### Implementación

Se creó `src/documentEngine/responsibleDisplay.ts` como única función de decisión de la etiqueta visible. La comparación elimina duplicados y exige que el conjunto de IDs seleccionados coincida con todos los integrantes aplicables.

La selección conserva simultáneamente:

- `responsables`, por compatibilidad;
- `responsableNames`, para trazabilidad explícita;
- `responsableIds`, para identidad y permisos;
- `responsablesEtiqueta`, solo para presentación colectiva.

Al desmarcar una persona, la etiqueta vuelve a los nombres individuales. Al seleccionar todo nuevamente, vuelve a la denominación colectiva sin duplicar IDs.

### Consumidores corregidos

- drawer de configuración y tabla de matriz;
- vista `Revisar matriz de actividades` y su acción Editar;
- composición y visualización T1;
- detalle documental;
- sincronización a ejecución;
- vistas de actividades, seguimiento y revisión de evidencias.

Los permisos de evidencias siguen usando IDs reales mediante la lógica existente. T2 deriva sus actividades sin alterar los responsables del Plan base.

### Pruebas

`tests/e2e/responsible-collective.spec.ts` verifica selección total, IDs y nombres, etiqueta en UI y T1, selección parcial, reselección, ausencia de duplicados y persistencia después de recargar.

## 3. Historial inicial

### Texto anterior

`Elaboración inicial del Plan de Trabajo`, además de variantes DEMO con `Emisión inicial`.

### Texto final

`Elaboración del Plan de Trabajo`.

### Alcance

Se actualizó el requisito consolidado, la creación de nuevos T1, la composición de respaldo y los fixtures canónicos que se vuelven a generar con `Restablecer DEMO`. No se agregó una migración que reescriba artefactos firmados persistidos: su inmutabilidad permanece intacta. `formalVersion`, `reviewRound`, fecha y `artifactHistory` no cambian por esta corrección.

## 4. Firmar y finalizar

### Evidencia encontrada

Las notas importadas antiguas pedían `Firmar` y luego `Enviar a revisión`. El requisito consolidado posterior, en `requirements.md`, sección 26, establece que al finalizar se firma, el documento deja de ser editable y continúa automáticamente al siguiente nivel configurado. El prompt post-reunión confirma la corrección verbal de `Firmar y enviar` a `Firmar y finalizar` y solicita resolver esa discrepancia.

### Decisión final

Se aplica la opción A:

`FIRMAR Y FINALIZAR` → firma única → finalización de elaboración → activación automática de la siguiente etapa → `EN REVISIÓN`.

### Cambio realizado

El motor ejecuta firma y transición en una sola mutación con `targetDocId`. El T1 muestra después la confirmación `Plan de Trabajo enviado a revisión`; T2 vuelve a la bandeja tras la misma operación. Se retiró la segunda acción visible `ENVIAR A REVISIÓN`.

La API heredada `enviarARevision` permanece únicamente para compatibilidad con estados persistidos antiguos `FIRMADO POR ELABORADOR`; ante un documento ya enviado devuelve `false`, por lo que no duplica la activación.

El Club Académico mantiene el bloqueo previo: sin siguiente etapa válida no firma, no entra en revisión y no inventa actores.

### Cobertura actualizada

Las pruebas del motor y E2E verifican una sola firma, ausencia de segundo envío, activación única, persistencia tras recarga, disponibilidad para el primer revisor, aislamiento de otros documentos, revisores paralelos y bloqueo del flujo incompleto.

## 5. Resaltar y observar

### Estado previo

Ya existían `DocumentObservationAnchor`, coordenadas normalizadas, selección rectangular, capa semitransparente, numeración, asociación con observación, persistencia y acción `IR AL RESALTADO`.

### Componentes reutilizados y correcciones

Se conservó el modelo y el visor existentes. Se corrigió el cierre del arrastre para calcular el rectángulo con la posición final del puntero, evitando depender de una actualización de estado pendiente. También se añadió:

- `aria-label="Resaltar y observar"`;
- `aria-label` contextual para navegar a cada resaltado;
- rol y etiqueta accesibles en la marca numerada;
- cancelación con Escape;
- enfoque visual y de teclado al navegar;
- atributos de diagnóstico para comprobar página y geometría sin acoplar la prueba a diferencias de píxeles.

### Funcionamiento validado

El revisor selecciona una región del A4 y registra la observación. El ancla conserva `documentoId`, artefacto, ronda, página, autor, texto, fecha, estado y coordenadas `x/y/width/height` normalizadas. El cambio de zoom conserva las proporciones relativas. `Ir al resaltado` abre la página correcta y enfoca la marca.

Al devolver, el docente ve el texto y el resaltado, puede marcar la observación como resuelta y preparar la ronda 2. La versión formal continúa en 1.0, la observación queda `HISTORICAL`, el artefacto firmado queda en `artifactHistory` y la marca no se incorpora a `artifact.pages`.

## 6. Archivos modificados

- `requirements.md`
- `implementation-status.md`
- `src/App.tsx`
- `src/documentEngine/responsibleDisplay.ts`
- `src/documentEngine/types.ts`
- `src/documentEngine/pagination.ts`
- `src/documentEngine/useDocumentEngine.ts`
- `src/documentEngine/mockDataDocument.ts`
- `src/documentEngine/DocumentPdfPageViewer.tsx`
- `src/modulo11/WizardInformeView.tsx`
- `src/modulo11/DetalleDocumentoModal.tsx`
- `src/modulo5/types.ts`
- `src/modulo5/MisActividadesView.tsx`
- `src/modulo5/DetalleActividadView.tsx`
- `src/modulo6/useSeguimientoState.ts`
- `src/modulo6/DetalleSeguimientoPlanView.tsx`
- `src/modulo6/RevisarEvidenciaView.tsx`
- `tests/document-engine.test.mjs`
- `tests/e2e/README.md`
- `tests/e2e/helpers.ts`
- `tests/e2e/document-flow.spec.ts`
- `tests/e2e/persistence.spec.ts`
- `tests/e2e/multidocument.spec.ts`
- `tests/e2e/responsible-collective.spec.ts`
- `tests/e2e/highlight-observation.spec.ts`

No se modificaron snapshots.

## 7. Nuevas pruebas

- `responsible-collective.spec.ts`: ciclo total → parcial → total, estado interno, UI, T1 y recarga.
- `highlight-observation.spec.ts`: Escape, arrastre, ancla normalizada, bloqueo de aprobación, navegación, zoom, recarga, devolución, corrección y ronda 2.
- El test del motor añade regresiones para las cuatro etiquetas colectivas, selección parcial, historial exacto y envío automático sin duplicación.

## 8. Resultados completos

- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS.
- `node --test tests/document-engine.test.mjs`: 1/1 PASS.
- pruebas E2E nuevas aisladas: 2/2 PASS.
- `npm run test:e2e`: 19/19 PASS.
- snapshots T1/T2: PASS sin actualizaciones.

## 9. Bugs reales encontrados

1. Seleccionar todos usaba una etiqueta semánticamente incorrecta o un conteo/nombres individuales según la pantalla.
2. El borrador no conservaba siempre IDs y nombres explícitos desde la selección.
3. El botón Editar de la revisión de matriz no abría la actividad.
4. Firma y envío estaban separados pese al requisito consolidado de transición automática.
5. El cierre del arrastre del resaltado podía depender de un estado React anterior al último movimiento.
6. Faltaban etiquetas accesibles, enfoque y cancelación con Escape en el resaltado.

## 10. Pendientes institucionales

- La denominación específica para tipos distintos de Comisión, Unidad y Club queda configurable; el valor de respaldo es `Responsable del grupo`.
- La integración real de firma con DTIC continúa pendiente y la operación sigue marcada como DEMO.
- No existe una transcripción cruda separada de la reunión posterior; la decisión se respalda en el prompt suministrado y el `requirements.md` consolidado.

## 11. Riesgos restantes

- Los resaltados son una capa de revisión del mockup y no anotaciones físicas dentro de un PDF, por diseño.
- Estados antiguos `FIRMADO POR ELABORADOR` que ya existan en almacenamiento local conservan compatibilidad mediante la función heredada; `Restablecer DEMO` usa el flujo canónico nuevo.
- Los avisos de Vite sobre futura carga nativa de configuración y tamaño de chunk permanecen fuera del alcance funcional de estas correcciones.
