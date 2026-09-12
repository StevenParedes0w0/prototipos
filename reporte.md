# Auditoría integral del mockup interactivo

## 1. Problemas encontrados

### Estructurales

- El cambio de contexto DEMO sustituía la identidad autenticada, lo que permitía firmar o revisar como otra persona.
- Algunas operaciones todavía dependían del documento seleccionado globalmente y las colecciones de ejecución y reportes no se relacionaban con el Plan que las originó.
- La composición de páginas, firmas y contenido usaba supuestos de cinco páginas en datos DEMO.
- Las etapas paralelas de un mismo nivel no se activaban juntas y las etapas futuras podían aparecer antes de tiempo.

### Funcionales

- La firma podía cerrarse como exitosa aunque la identidad, la etapa o el certificado fueran inválidos.
- Crear un Plan no prevenía claramente la combinación duplicada docente, grupo y período.
- Un Informe en borrador no podía retomarse desde la tabla.
- El flujo de devolución, corrección y nueva ronda tenía controles incompletos de autoría y estado.
- Las evidencias cargadas con estado pendiente de validación podían desaparecer de algunas vistas y ofrecer una segunda carga.
- Los permisos de carga y revisión de evidencias usaban usuarios DEMO fijos.

### Documentales

- La portada, encabezado, matriz, pie, firmas e historial se alejaban del T1 institucional.
- El T2 mostraba notas instructivas de la plantilla y separaba firmas mediante páginas fijas.
- La cantidad y composición de páginas no dependía de todo el contenido real.
- La nota de protección de datos se infería del nombre del grupo.
- La representación colectiva reemplazaba los responsables individuales y eliminaba trazabilidad.

### UX

- Había textos residuales de “Mis Planes de Trabajo” y del nombre anterior del sistema.
- Varias acciones de tabla eran verbosas o carecían de ayuda accesible.
- Algunos modales no tenían un comportamiento adecuado para contenido alto.
- El selector de contexto no explicaba que la identidad debía permanecer estable.

### Datos DEMO y consistencia

- Planes, actividades, evidencias y reportes utilizaban fuentes DEMO independientes.
- Ciertos visores inventaban códigos, sellos o contenido de PDF distinto al archivo seleccionado.
- Las versiones de evidencia, la versión formal y la ronda de revisión no se conservaban uniformemente.

### Regresiones detectadas

- Se preservó y volvió a probar el aislamiento multidocumento.
- Se mantuvo la fecha de elaboración congelada después de la firma.
- Se comprobó que una devolución incrementa la ronda y no la versión formal.
- Se comprobó que un artefacto firmado no puede regenerarse silenciosamente.

## 2. Cambios realizados

- Se separó la persona de la sesión DEMO del contexto Docente, Revisor o Administrador.
- El motor ahora exige identidad y etapa activa para firmar, observar, editar observaciones, devolver, aprobar o validar.
- Se activan correctamente los revisores paralelos del nivel actual y se bloquean etapas futuras.
- Los artefactos se componen a partir de contenido, anexos, actividades y flujo; la cantidad de páginas y los slots de firma se derivan de las páginas.
- Las nuevas rondas archivan el artefacto y el flujo anterior, conservan la versión formal y anulan las firmas previas para el artefacto corregido.
- Se agregó denominación colectiva impresa sin sustituir la lista individual de responsables.
- La nota de datos personales depende de una selección explícita.
- Se corrigieron carga, reemplazo, visualización y revisión de un PDF por medio de verificación, con límite DEMO de 10 MB y nueva validación al reemplazar.
- Se vinculó la ejecución de actividades con matrices de Planes validados y se preservó la historia propia de cada evidencia.
- Se añadió selección previa de grupo y período, prevención visible de duplicados y continuidad de borradores.
- Se normalizó la denominación Gestión Documental Académica y se mejoraron acciones accesibles y formularios.
- El modal de firma limpia certificado y contraseña, valida `.p12/.pfx`, fija la ubicación desde metadata y muestra rechazos reales.

## 3. Archivos modificados

- `src/App.tsx`: integración de identidad, contexto, documentos, actividades, evidencias y navegación.
- `src/documentEngine/types.ts`: metadata tipada para páginas, bloques, responsables, observaciones y flujo.
- `src/documentEngine/pagination.ts`: composición y paginación dinámica T1/T2.
- `src/documentEngine/workflow.ts`: identidad canónica, paralelismo y avance secuencial.
- `src/documentEngine/useDocumentEngine.ts`: aislamiento, permisos, artefactos, firma, rondas y persistencia DEMO.
- `src/documentEngine/DocumentPdfPageViewer.tsx`: responsable colectivo y nota explícita de datos personales.
- `src/documentEngine/ModalFirmaDocumental.tsx`: manejo temporal y validación de certificado.
- `src/documentEngine/mockDataDocument.ts`: eliminación de pageCount y ubicaciones fijas como fuente de verdad.
- `src/modulo5/*`: validación de archivos, visor PDF coherente y acciones por responsable.
- `src/modulo6/*`: sincronización Plan–actividad–evidencia y permisos de revisión.
- `src/modulo7/types.ts`: soporte tipado para destinos configurables del flujo.
- `src/modulo8/types.ts`: contexto tipado para eventos y notificaciones.
- `src/modulo9/ModalVistaPreviaReporte.tsx`: nomenclatura general normalizada.
- `src/modulo10/PerfilView.tsx`: perfil asociado a la identidad de sesión.
- `src/modulo11/MisDocumentosView.tsx`: creación sin duplicados y continuidad por tipo documental.
- `tests/document-engine.test.mjs`: escenarios de regresión del motor documental.

## 4. Requisitos cumplidos

- FR-AUTH-005: identidad única durante la sesión, separada del contexto activo.
- FR-GRP-004 y FR-GRP-005: Plan por docente, grupo y período sin duplicado.
- FR-RESP-001 a FR-RESP-005: responsables múltiples, seleccionar todos y representación colectiva trazable.
- FR-REC-002 a FR-REC-004 y FR-MED-002 a FR-MED-003: “Otro” obligatorio, validado y enfocado.
- FR-T1-005 y FR-SIGN-001 a FR-SIGN-005: fecha congelada, certificado temporal y firma sobre el artefacto exacto.
- FR-REV-001 a FR-REV-003: etapas secuenciales, revisores paralelos y artefacto firmado inmutable.
- Secciones 29 a 33: observaciones ancladas, resaltado, devolución, ronda y flujo configurable.
- Secciones 36 a 41: Informe derivado del Plan, actividades importadas, notas instructivas omitidas y pageCount dinámico.
- Secciones 42 a 48: actividades en ejecución, permisos y un PDF versionado por medio.
- Secciones 51, 52, 54 y 56: navegación contextual, trazabilidad, solo lectura y estados vacíos/errores en las zonas modificadas.

## 5. Requisitos pendientes por decisión institucional

- Procedimiento externo/QIPOC: actor, momento de descarga/carga y condición de aprobación.
- Reglas institucionales definitivas para cierre o reapertura de períodos.
- Condiciones definitivas para permitir Informes independientes.
- Integración técnica final de certificados y firma con DTIC.

## 6. Pruebas automáticas realizadas

- `npx tsc --noEmit`: correcto, sin errores.
- `npm run build`: correcto. Vite solo reporta avisos no bloqueantes sobre configuración futura y tamaño del bundle.
- `node tests/document-engine.test.mjs`: correcto. Cubre aislamiento T1/T2, inmutabilidad, paginación, firma, observación anclada, devolución, corrección, rondas, validación y órgano sin firma personal.

## 7. Pruebas manuales que debo realizar

### Plan T1

Inicio → Gestión Documental Académica → Nuevo documento → Plan de Trabajo → elegir grupo y período → crear borrador → completar los siete pasos → seleccionar todos los responsables → previsualizar → firmar con `.p12/.pfx` DEMO → resultado esperado: documento en revisión, responsables colectivos impresos e identidades individuales conservadas.

### Revisión y nueva ronda

Selector Sesión DEMO → Carlos López → contexto Revisor → Bandeja → abrir documento asignado → activar resaltado → marcar una zona → escribir observación → devolver → cambiar sesión a Andrea → Gestión Documental → corregir → reenviar → resultado esperado: Ronda 2, versión formal 1.0 y artefacto anterior visible en historial.

### Informe T2 y aislamiento

Gestión Documental → Nuevo documento → Informe → seleccionar Plan validado → completar porcentajes y textos → previsualizar → firmar → volver al Plan relacionado → resultado esperado: actividades importadas y Plan sin cambios de firmas, estado o contenido.

### Evidencias

Sesión Andrea → Mis Actividades → actividad donde es responsable → cargar un PDF por cada medio → reemplazar uno → sesión Carlos → Evidencias por validar → observar → sesión Andrea → reemplazar → sesión Carlos → validar → resultado esperado: nueva versión, estado pendiente tras reemplazo y validación posterior.

### Identidad y flujo

Selector Sesión DEMO → Andrea → cambiar solo el contexto varias veces → Perfil → resultado esperado: la persona sigue siendo Andrea; una acción de firma o aprobación asignada a otra persona es rechazada.

### Administración e histórico

Sesión Laura → contexto Administrador → Flujos → abrir dos grupos → comparar etapas → Histórico/Cierre → probar cierre DEMO → resultado esperado: configuraciones diferentes por grupo y período cerrado en solo lectura, sin afirmar reapertura institucional.

La conexión de navegador de automatización no estuvo disponible en esta sesión. Por ello estas rutas quedan como la lista exacta de comprobación visual final en el navegador del mockup.
