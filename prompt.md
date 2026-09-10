CORRECCIÓN CRÍTICA — AISLAMIENTO MULTIDOCUMENTO + TÍTULO + UBICACIÓN DE FIRMA

IMPORTANTE:

La refacción UX del Wizard del Informe está APROBADA.

NO rediseñar:
- modal Crear nuevo documento;
- stepper;
- barra de progreso;
- Paso 1;
- Paso 3;
- Paso 7;
- Paso 8;
- paleta;
- T1;
- T2 visual;
- estructura de 5 páginas.

Corregir exclusivamente los problemas descritos.

==========================================================
1. ERROR CRÍTICO — ESTADO DE UN DOCUMENTO CONTAMINA OTRO
==========================================================

Se detectó una regresión grave.

Después de trabajar con el Informe:

SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

el documento:

Plan de Trabajo — Unidad de Titulación

aparece como:

EN REVISIÓN

aunque muestra:

Firmas: 3 de 3

Andrea — firmado
Carlos — firmado
Patricia — firmado

y anteriormente su estado canónico era:

documentState = VALIDADO
operationalState = EN EJECUCIÓN

Esto es inconsistente.

Además, el visor del Plan muestra:

FIRMAR Y CONTINUAR

aunque ya posee las tres firmas.

==========================================================
2. REGLA DE AISLAMIENTO DOCUMENTAL
==========================================================

Cada documento debe poseer completamente su propio:

- documentState;
- operationalState;
- formalVersion;
- reviewRound;
- signatures;
- observations;
- artifact;
- artifactHistory;
- flowStages;
- auditEvents relacionados;
- timestamps.

Las operaciones sobre un Informe NO deben modificar el Plan relacionado.

El vínculo:

Informe -> Plan relacionado

es una referencia de origen.

NO implica compartir estado mutable.

==========================================================
3. REVISAR selectedDocId / selectedDocument
==========================================================

Auditar especialmente:

selectedDocId
seleccionarDocumento()
currentDocument
documents.map(...)
actualizaciones por id

Todos los métodos del motor deben modificar exclusivamente:

document.id === targetDocumentId

Nunca modificar:

documents[0]

ni el documento previamente seleccionado por accidente.

Revisar especialmente:

firmarComoElaborador()
enviarARevision()
generarArtefactoInforme()
crearNuevoDocumento()
aprobarYFirmarRevisor()
validarYFirmarFinal()

Cada operación debe conocer explícitamente el documento objetivo.

==========================================================
4. RESTAURAR ESCENARIO CANÓNICO DEL PLAN
==========================================================

Plan de Trabajo — Unidad de Titulación:

documentState:
VALIDADO

operationalState:
EN EJECUCIÓN

formalVersion:
1.0

reviewRound:
1

firmas:
3 de 3

Andrea:
firmado

Carlos:
firmado

Patricia:
firmado

No debe aparecer:

FIRMAR Y CONTINUAR

para Andrea en este documento.

Debe permanecer disponible únicamente la visualización del documento
final y las acciones correspondientes al Plan en ejecución.

==========================================================
5. INFORME DEBE MANTENER SU ESTADO INDEPENDIENTE
==========================================================

El Informe de seguimiento debe evolucionar independientemente:

BORRADOR
→ LISTO PARA FIRMA
→ FIRMADO POR ELABORADOR
→ EN REVISIÓN
→ ...
→ VALIDADO

Firmar o enviar el Informe no debe cambiar el estado del Plan origen.

==========================================================
6. CORREGIR NORMALIZACIÓN DEL TÍTULO
==========================================================

Todavía se observa en Paso 7:

INFORME DE:
INFORME DE SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Esto demuestra que previewArtifact todavía usa una ruta diferente.

Resultado obligatorio:

INFORME DE:
SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

La función compartida debe eliminar al inicio:

Informe de:
Informe de

sin distinguir mayúsculas/minúsculas.

Ejemplo:

normalizeInformeTitle(
  "Informe de seguimiento de actividades de titulación"
)

=

"SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN"

Usar la MISMA función en:

- previewArtifact del wizard;
- artifact almacenado;
- DocumentPdfPageViewer;
- ModalFirmaDocumental cuando muestra el nombre formal.

No duplicar implementaciones.

IMPORTANTE:

La lista de Gestión Documental puede seguir mostrando:

Seguimiento de actividades de titulación

sin forzar mayúsculas.

==========================================================
7. CORREGIR MODAL DE FIRMA — PÁGINA REAL
==========================================================

Actualmente aparece:

Página 3 — Firmas de Responsabilidad: Elaborado por

Esto quedó obsoleto después de pasar T2 a cinco páginas.

Para el escenario actual:

Andrea / Elaborado por:
Página 4

Carlos / Revisado por:
Página 4

Patricia / Validado por:
Página 5

NO hardcodear estos números.

La ubicación debe derivarse de la página real donde se renderiza
la fila del firmante.

Crear o reutilizar metadatos del artifact/page, por ejemplo:

signatureSlots = [
 {
   stageId,
   userId,
   pageIndex,
   action
 }
]

El ModalFirmaDocumental debe leer esa ubicación real.

Si cambia la paginación del documento, la ubicación debe cambiar
automáticamente.

==========================================================
8. PAGECOUNT — ELIMINAR any SI ES POSIBLE
==========================================================

Actualmente se utiliza una solución similar a:

(artifact as any).pages?.length

Evitar ocultar la estructura del artefacto con `any`.

Si `pages` es parte real del documento, tiparla en DocumentArtifact.

Ejemplo conceptual:

interface DocumentArtifact {
  ...
  pages: DocumentPage[];
}

La navegación debe utilizar:

artifact.pages.length

No mantener dos fuentes de verdad independientes.

Si pageCount debe conservarse por compatibilidad:

pageCount = pages.length

al construir el artefacto.

Nunca:

pageCount = 5

como constante.

==========================================================
9. VALIDACIONES DE UI POR ESTADO
==========================================================

Botones de firma deben aparecer solamente cuando:

currentUser es el firmante asignado

Y

la etapa correspondiente está habilitada

Y

el documento requiere esa firma

Y

esa firma todavía no existe en la ronda vigente.

Si la firma ya existe:
NO mostrar FIRMAR Y CONTINUAR.

Si el documento está VALIDADO:
NO permitir reiniciar firma accidentalmente.

==========================================================
10. PRUEBA DE AISLAMIENTO OBLIGATORIA
==========================================================

Realizar esta secuencia:

A.
Restablecer DEMO.

B.
Abrir Plan de Trabajo — Unidad de Titulación.

Comprobar:

VALIDADO
EN EJECUCIÓN
3 de 3 firmas

C.
Cerrar.

D.
Crear Informe derivado de ese Plan.

E.
Avanzar hasta Paso 8.

F.
Firmar Informe como Andrea.

G.
Enviar Informe a revisión.

H.
Volver a Gestión Documental Académica.

Resultado:

Informe:
EN REVISIÓN
firma Andrea registrada

Plan Unidad de Titulación:
SIGUE VALIDADO / EN EJECUCIÓN
SIGUE con 3 de 3 firmas

I.
Abrir nuevamente el Plan.

Comprobar que:
NO aparece FIRMAR Y CONTINUAR.

==========================================================
11. PRUEBA DE TÍTULO
==========================================================

En Paso 7 debe verse:

INFORME DE: SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Nunca:

INFORME DE: INFORME DE...

==========================================================
12. PRUEBA DE UBICACIÓN DE FIRMA
==========================================================

Andrea:
Página 4 — Firmas de Responsabilidad — Elaborado por

Carlos:
Página 4 — Firmas de Responsabilidad — Revisado por

Patricia:
Página 5 — Firmas de Responsabilidad — Validado por

Los números deben salir del artifact, no de constantes.

==========================================================
13. NO REGRESIÓN
==========================================================

Conservar:

- wizard 8 pasos;
- grid 4x2;
- azul institucional;
- cinco páginas T2 DEMO;
- pageCount dinámico;
- modal de firma;
- certificado .p12/.pfx;
- contraseña temporal;
- revisión secuencial;
- formalVersion;
- reviewRound;
- T1 aprobado;
- diseño A4 actual.

==========================================================
14. VERIFICACIÓN TÉCNICA
==========================================================

Ejecutar:

npx tsc --noEmit
npm run build

Reportar también el resultado de la prueba de aislamiento:

Plan antes de firmar Informe:
VALIDADO / EN EJECUCIÓN / 3 de 3

Informe después del envío:
EN REVISIÓN / 1 de 3

Plan después del envío del Informe:
VALIDADO / EN EJECUCIÓN / 3 de 3

No realizar otras modificaciones.