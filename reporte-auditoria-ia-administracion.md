# Reporte de auditoría E2E: IA, administración y reset DEMO

Fecha: 15/09/2026  
Alcance: mockup interactivo de alta fidelidad para Gestión Documental Académica.

## 1. Resumen ejecutivo

Se auditó el asistente de redacción T1/T2, la configuración de plantillas, los catálogos institucionales, el dashboard administrativo y los límites de persistencia/reset. Se encontraron y corrigieron dos bugs reales: el asistente podía fabricar contenido cuando el campo estaba vacío y el botón **Restablecer documentos DEMO** también eliminaba plantillas y unidades administrativas.

Las funciones ya correctas se conservaron y se cubrieron con regresiones E2E. El resultado final es TypeScript y build correctos, cuatro pruebas Node aprobadas y 32 pruebas E2E aprobadas. No cambiaron snapshots.

## 2. Estado inicial encontrado

- T1 y T2 ya mostraban una comparación entre texto original y sugerido, con acciones explícitas para aplicar o descartar.
- Los textos asistidos ya se persistían mediante el borrador T1 por documento y el borrador T2 en `localStorage`.
- El builder de plantillas ya permitía mover secciones de contenido requeridas y opcionales; encabezado y pie permanecían fijos.
- La configuración T1/T2 ya se persistía por separado y los documentos capturaban un snapshot de la plantilla vigente.
- El catálogo de unidades académicas y administrativas ya alimentaba los selectores T1/T2 y conservaba snapshots históricos.
- El dashboard ya recibía métricas calculadas desde el estado DEMO real.
- La suite inicial focalizada de seis pruebas pasó, pero no cubría todos los recorridos obligatorios de IA, reload, cambio de conteos y límites del reset.
- El reset documental invocaba también `adminState.restablecerDemo()`, mezclando dominios de persistencia.

## 3. Bugs reales encontrados

### 3.1 Solicitud de mejora sobre un campo vacío

- **Comportamiento observado:** T1 y T2 podían generar una frase institucional aun cuando el texto original estaba vacío.
- **Causa raíz:** los handlers construían la sugerencia sin validar `original.trim()`.
- **Requisito afectado:** un campo vacío debe mostrar `Ingrese un texto antes de solicitar una mejora.` y no inventar contenido.
- **Corrección:** se añadió validación previa, mensaje inline accesible con `role="alert"` y cancelación completa de la simulación.
- **Regresión:** `ai-writing-assistant.spec.ts` comprueba el mensaje y la ausencia del botón de aplicación cuando el campo está vacío.

### 3.2 Reset documental borraba configuración administrativa

- **Comportamiento observado:** **Restablecer documentos DEMO** llamaba a `adminState.restablecerDemo()` y restablecía unidades y plantillas.
- **Causa raíz:** una sola acción de UI agrupaba el reset documental, el seguimiento y la configuración administrativa.
- **Requisito afectado:** el reset documental no debe borrar plantillas, catálogos ni preferencias administrativas independientes.
- **Corrección:** se retiró el reset administrativo de esa acción. El botón restaura la colección documental, actividades/evidencias DEMO y borradores documentales T1/T2.
- **Regresión:** `demo-reset-boundaries.spec.ts` crea una unidad, modifica T1, crea un documento, ejecuta el reset y verifica la conservación administrativa antes y después de recargar.

## 4. Asistente IA

El asistente sigue siendo una simulación local sin APIs externas.

### T1

- La sugerencia no se aplica automáticamente.
- **Aplicar** modifica únicamente el campo que originó la solicitud.
- **Descartar** conserva exactamente el texto original.
- Se comprobó aplicar en **Justificación** y descartar en **Objetivo** de forma consecutiva.
- Ambos valores se conservaron al avanzar, retroceder y recargar el documento.
- Un campo vacío muestra el mensaje requerido y no abre una sugerencia inventada.

### T2

- Se comprobó aplicar en **Conclusiones** y descartar en **Oportunidades de mejora**.
- La sugerencia captura el texto y campo de origen antes de iniciar la simulación, evitando cruces entre campos.
- Los valores se conservaron al avanzar, retroceder, cancelar y reabrir el borrador.
- El caso vacío se rechaza con el mismo mensaje inline.

## 5. Plantillas

- Encabezado y pie continúan como marco fijo.
- Las secciones de contenido, incluidas las requeridas, continúan reordenables.
- Guardar un cambio estructural requiere confirmación.
- El orden T1 guardado sobrevivió a reload.
- Cambiar T1 no alteró la configuración T2.
- Un T1 nuevo tomó el orden guardado tanto en páginas como en el índice dinámico.
- Un documento T1 creado antes de un cambio posterior conservó su snapshot.
- T2 tomó su propia configuración en la previsualización y conservó independencia respecto de T1.
- Restaurar predeterminado recuperó el orden T1 inicial y persistió al reabrir la plantilla.
- Las regresiones existentes de motor confirman que los artefactos firmados permanecen inmutables.

## 6. Catálogos

- Una unidad académica nueva con carrera apareció en el selector T1.
- El Plan guardó unidad y carrera seleccionadas.
- Desactivar la unidad la retiró de documentos nuevos sin modificar el snapshot histórico del Plan existente.
- Una unidad administrativa nueva apareció en T2.
- Al elegir tipo administrativo, el selector Carrera desapareció y la procedencia institucional se renderizó sin carrera.
- Los datos administrativos de unidades y plantillas sobrevivieron a reload y al reset documental.

## 7. Dashboard

- **Borradores** deriva de documentos en `BORRADOR` o `LISTO PARA FIRMA`.
- **En revisión** deriva de documentos en `EN REVISIÓN` o `EN VALIDACIÓN FINAL`.
- Las demás tarjetas reciben conteos actuales de documentos, evidencias, flujos, usuarios, grupos y período desde los hooks de estado.
- Crear un Plan DEMO incrementó el conteo de borradores.
- Restablecer documentos devolvió el conteo a la base canónica.
- Se verificó la navegación desde tarjetas de flujos y usuarios.
- No se muestran rankings, scoring, productividad, desempeño docente ni predicciones personales.

## 8. Reset DEMO

- **Restablecer documentos DEMO:** restaura la colección documental canónica, seguimiento/actividades/evidencias DEMO y elimina borradores documentales T1/T2.
- **Restaurar predeterminado de plantilla:** afecta únicamente la plantilla T1 o T2 seleccionada.
- **Recargar/F5:** conserva documentos persistidos, borradores vigentes y configuración administrativa almacenada.
- El reset documental conserva unidades institucionales y configuraciones de plantillas; se verificó también después de F5.

## 9. Pruebas nuevas

- `tests/e2e/ai-writing-assistant.spec.ts`: ampliada con entrada vacía, aplicar/descartar consecutivo, aislamiento de campos, navegación y reload para T1/T2.
- `tests/e2e/template-builder.spec.ts`: ampliada con persistencia tras reload e independencia T1/T2.
- `tests/e2e/admin-dashboard.spec.ts`: ampliada con creación documental, actualización reactiva y retorno a la base tras reset.
- `tests/e2e/demo-reset-boundaries.spec.ts`: nueva; valida los límites entre documentos, plantillas, catálogos y reload.
- `tests/e2e/institutional-units.spec.ts`: ejecutada como cobertura focalizada de consumo de catálogo e inmutabilidad histórica; no requirió cambios.

## 10. Snapshots

No se modificaron snapshots. Las regresiones visuales T1 y T2 aprobaron con los archivos existentes.

En la primera ejecución completa, la captura `t1-portada.png` agotó el timeout sin reportar diferencia visual. La prueba aislada pasó y una segunda ejecución completa terminó con 32/32, por lo que se clasificó como inestabilidad transitoria de captura y no se actualizó la referencia.

## 11. Archivos modificados

- `src/App.tsx`
- `src/modulo11/WizardInformeView.tsx`
- `tests/e2e/ai-writing-assistant.spec.ts`
- `tests/e2e/template-builder.spec.ts`
- `tests/e2e/admin-dashboard.spec.ts`
- `tests/e2e/demo-reset-boundaries.spec.ts`
- `implementation-status.md`
- `reporte-auditoria-ia-administracion.md`

No se restauraron reportes eliminados.

## 12. Comandos

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS; advertencias no bloqueantes de Vite sobre configuración nativa y tamaño del bundle |
| `node --test tests/document-engine.test.mjs` | 1 PASS / 0 FAIL |
| `node --test tests/a4-page-size.test.mjs` | 1 PASS / 0 FAIL |
| `node --test tests/institutional-date-format.test.mjs` | 1 PASS / 0 FAIL |
| `node --test tests/no-visible-emojis.test.mjs` | 1 PASS / 0 FAIL; 87 archivos TS/TSX inspeccionados |
| `npx playwright test tests/e2e/ai-writing-assistant.spec.ts tests/e2e/template-builder.spec.ts tests/e2e/admin-dashboard.spec.ts tests/e2e/institutional-units.spec.ts tests/e2e/demo-reset-boundaries.spec.ts` | 7 PASS / 0 FAIL |
| `npm run test:e2e` primera ejecución | 31 PASS / 1 timeout de captura |
| `npx playwright test tests/e2e/visual-regression.spec.ts` | 1 PASS / 0 FAIL |
| `npm run test:e2e` ejecución final | 32 PASS / 0 FAIL |

## 13. Conteo final

- **E2E:** 32 PASS / 0 FAIL.
- **Node:** 4 PASS / 0 FAIL.
- **TypeScript:** PASS.
- **Build:** PASS.
- **Snapshots modificados:** 0.

## 14. Riesgos restantes

### Bug real

No queda un bug funcional conocido dentro del alcance auditado. La primera captura visual agotó el timeout una vez; la prueba aislada y la segunda suite completa aprobaron sin diferencias.

### Limitación DEMO

- El asistente usa respuestas deterministas locales.
- La persistencia se basa en estado React y `localStorage`.
- La firma, archivos y notificaciones siguen simulados.
- El reordenamiento usa drag-and-drop HTML5 y está orientado al mockup de escritorio.

### Pendiente de validación institucional

- Catálogo definitivo de unidades y carreras.
- Libertad final permitida para reordenar secciones oficiales T1/T2.
- Textos y criterios institucionales que debe usar el asistente.
- Proveedor y reglas definitivas de firma e IA.

### Trabajo futuro de producción

- Backend y persistencia institucional.
- Integración real con Groq/OpenAI si se aprueba.
- SSO/LDAP, DTIC, firma electrónica criptográfica y almacenamiento documental real.
- Controles productivos de seguridad, auditoría, observabilidad y recuperación.
