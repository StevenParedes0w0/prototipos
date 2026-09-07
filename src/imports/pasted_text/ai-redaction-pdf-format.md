CORRECCIÓN DEL MÓDULO 3 — IA DE REDACCIÓN + FORMATO INSTITUCIONAL DEL PDF

IMPORTANTE:
NO rediseñar la aplicación completa.

La interfaz web actual está aprobada visualmente.

Mantener exactamente:
- sidebar;
- topbar;
- stepper;
- colores;
- tipografía;
- formularios;
- tarjetas;
- botones;
- badges;
- modales;
- navegación;
- autoguardado;
- PlanDraft compartido;
- persistencia;
- flujo Contenido → Anexos → Previsualización → Firma → Envío.

Esta corrección afecta principalmente:

1. asistencia con IA para redacción;
2. formato institucional del PDF;
3. firmas de responsabilidad;
4. historial de cambios;
5. convención de versiones;
6. sincronización del documento generado.

============================================================
1. INCORPORAR ASISTENTE DE IA PARA REDACCIÓN
============================================================

Agregar asistencia de IA únicamente en las secciones textuales editables del Plan de Trabajo.

Actualmente las secciones editables son:

- Justificación;
- Objetivo.

NO agregar un chatbot flotante global.
NO agregar IA en todas las pantallas.
NO hacer que la IA modifique automáticamente el documento.

La IA debe funcionar como ASISTENTE DE REDACCIÓN.

============================================================
1.1 JUSTIFICACIÓN
============================================================

En la tarjeta:

“Justificación”

agregar un botón secundario con icono discreto de IA:

✨ MEJORAR REDACCIÓN

Al presionarlo, abrir un menú pequeño con opciones:

- Mejorar redacción
- Corregir ortografía y gramática
- Hacer más claro
- Dar tono más formal

Mantener el texto original sin modificar mientras se genera la sugerencia.

Después mostrar un drawer o modal:

Título:

Sugerencia de redacción

Mostrar dos bloques:

TEXTO ORIGINAL

[contenido actual]

VERSIÓN SUGERIDA

[texto generado por la IA]

Acciones:

DESCARTAR

APLICAR SUGERENCIA

IMPORTANTE:

La IA jamás reemplaza automáticamente el texto.

Solo se incorpora la sugerencia cuando el docente presiona:

APLICAR SUGERENCIA.

Mostrar mensaje discreto:

“La sugerencia generada debe ser revisada por el docente antes de incorporarse al documento.”

============================================================
1.2 OBJETIVO
============================================================

Agregar funcionalidad equivalente.

Botón:

✨ MEJORAR OBJETIVO

Opciones:

- Mejorar redacción
- Hacer más claro
- Dar tono institucional
- Corregir ortografía y gramática

Mantener siempre un ÚNICO objetivo.

NO crear:
- objetivo general;
- objetivos específicos;
- objetivos secundarios.

============================================================
1.3 COMPORTAMIENTO DE IA
============================================================

La IA debe:

- sugerir;
- no sustituir automáticamente;
- conservar el control del docente;
- permitir comparar original y sugerencia;
- permitir descartar;
- permitir aplicar.

Cuando se aplica una sugerencia:

actualizar:

PlanDraft.justificacion

o

PlanDraft.objetivo

según corresponda.

Activar autoguardado:

Guardando...
→
Cambios guardados.

La previsualización debe utilizar inmediatamente la nueva redacción.

============================================================
2. PANEL LATERAL DE CONTENIDO
============================================================

Corregir etiquetas del panel lateral.

Mostrar:

Contenido del documento

Información general
AUTO

Matriz de actividades
AUTO

Justificación
EDITABLE

Objetivo
EDITABLE

Anexos
OPCIONAL

Firmas de responsabilidad
AUTO

Historial de cambios
AUTO

No mostrar:

“Anexos — AUTO”.

Cambiar:

“Firmas”

por:

“Firmas de responsabilidad”.

Cambiar:

“Historial”

por:

“Historial de cambios”.

============================================================
3. FORMATO INSTITUCIONAL DEL DOCUMENTO
============================================================

La aplicación web moderna NO debe adoptar el diseño antiguo del documento.

Sin embargo:

EL PDF GENERADO debe aproximarse fielmente al formato institucional proporcionado como referencia.

Separar conceptualmente:

INTERFAZ WEB MODERNA
≠
DOCUMENTO INSTITUCIONAL.

La interfaz conserva el diseño actual.

El PDF utiliza la plantilla institucional.

============================================================
4. ENCABEZADO INSTITUCIONAL DEL PDF
============================================================

Reemplazar el encabezado simplificado actual del PDF.

Crear una estructura visual basada en el documento institucional de referencia.

Debe incluir:

[ESPACIO PARA LOGOTIPO / IDENTIDAD UTA]

No inventar un escudo diferente.

A la derecha:

UNIVERSIDAD TÉCNICA DE AMBATO

Debajo:

PLAN DE TRABAJO: {NOMBRE DEL GRUPO INSTITUCIONAL}

Ejemplo:

PLAN DE TRABAJO: UNIDAD DE TITULACIÓN

Incluir bloque:

Unidad académica / administrativa:

y los datos institucionales correspondientes.

Para el prototipo utilizar información demostrativa coherente como:

Facultad de Ingeniería en Sistemas, Electrónica e Industrial

sin inventar carreras adicionales no confirmadas.

Incluir:

Fecha de elaboración:

{fecha de elaboración del documento}

Ejemplo:

05 de septiembre de 2026

La fecha debe provenir del PlanDraft.

NO escribir valores hardcodeados.

============================================================
5. DATOS DINÁMICOS DEL ENCABEZADO
============================================================

El encabezado debe generarse automáticamente utilizando:

PlanDraft.grupo
PlanDraft.periodo
PlanDraft.fechaElaboracion
PlanDraft.version
información institucional configurada.

El docente NO debe escribir manualmente:

- facultad;
- nombre del grupo;
- fecha;
- versión.

============================================================
6. CUERPO DEL DOCUMENTO
============================================================

Mantener las secciones:

1. JUSTIFICACIÓN

2. OBJETIVO

3. MATRIZ DE ACTIVIDADES

4. ANEXOS
solo si existen

5. FIRMAS DE RESPONSABILIDAD

6. CONTROL DE HISTORIAL DE CAMBIOS

La numeración debe adaptarse automáticamente si posteriormente la plantilla cambia.

============================================================
7. MATRIZ DE ACTIVIDADES DEL PDF
============================================================

Mantener columnas institucionales:

ACTIVIDAD

DESDE

HASTA

RESPONSABLE

RECURSOS

MEDIOS DE VERIFICACIÓN

Los valores deben proceder EXCLUSIVAMENTE de:

PlanDraft.activities.

NO utilizar información ficticia adicional.

NO resumir los recursos solamente como:

“2 recursos”

en el PDF final.

En el PDF deben aparecer los nombres reales seleccionados.

Ejemplo:

Responsable:
Ing. Andrea Pérez, Mg.
Ing. Carlos López, Mg.

Recursos:
Matriz de seguimiento
Almacenamiento institucional

Medios de verificación:
Informe
Acta

La interfaz web puede continuar utilizando cantidades para ahorrar espacio.

El PDF debe mostrar datos completos.

============================================================
8. FIRMAS DE RESPONSABILIDAD
============================================================

Reemplazar las tarjetas simplificadas actuales del PDF por una TABLA institucional.

Título:

FIRMAS DE RESPONSABILIDAD

Columnas:

ACCIONES
NOMBRE
CARGO
FIRMA

Estructura conceptual:

------------------------------------------------
Elaborado por:
Nombre del docente elaborador
Cargo
Firma
------------------------------------------------
Revisado por:
Revisor obligatorio 1
Cargo
Firma
------------------------------------------------
Revisado por:
Revisor obligatorio 2
Cargo
Firma
------------------------------------------------
Validado por:
Autoridad correspondiente
Cargo
Firma
------------------------------------------------

IMPORTANTE:

Un mismo paso de revisión puede tener VARIOS revisores.

No asumir que existe solamente un revisor por etapa.

La tabla debe construirse dinámicamente desde:

PlanDraft.approvalFlow.

============================================================
9. FLUJO CON VARIOS REVISORES
============================================================

Mantener el modelo funcional:

Flujo de aprobación
→ Paso
→ uno o varios revisores.

Ejemplo:

Paso 1:
Elaborador

Paso 2:
Revisión
- Revisor A
- Revisor B

Paso 3:
Coordinación

Paso 4:
Validación

Un paso con múltiples revisores solo se completa cuando todos
los revisores obligatorios han aprobado.

La interfaz web puede continuar mostrando un timeline moderno.

El PDF debe traducir ese flujo a la tabla institucional.

============================================================
10. REPRESENTACIÓN DE FIRMA EN EL PDF
============================================================

No insertar un QR falso.

La celda FIRMA debe representar el estado actual.

Antes de firmar:

Pendiente

Después de firmar:

Firmado electrónicamente

Nombre
Fecha
Hora

Puede reservarse visualmente espacio para una futura representación
compatible con la firma electrónica utilizada por la Universidad.

No afirmar todavía que el QR exacto de la plantilla institucional
ya está implementado.

La firma criptográfica real se validará técnicamente posteriormente.

============================================================
11. FIRMA DEL ELABORADOR
============================================================

Después de que el docente firma:

actualizar la fila:

ELABORADO POR

con:

Nombre:
Ing. Andrea Pérez, Mg.

Firma:
Firmado electrónicamente

Fecha:
05/09/2026

Hora:
23:41

Estos datos deben proceder del evento de firma real del prototipo.

============================================================
12. REVISORES AÚN NO FIRMADOS
============================================================

Mientras el documento todavía no ha pasado por revisión:

las filas:

REVISADO POR
VALIDADO POR

deben mostrar:

Pendiente

No inventar firmas ni nombres no configurados.

Si el flujo tiene cargos genéricos:

Responsable de revisión
Coordinador/a
Autoridad correspondiente

pueden utilizarse provisionalmente.

============================================================
13. CONTROL DE HISTORIAL DE CAMBIOS
============================================================

Cambiar la sección actual.

Título exacto:

CONTROL DE HISTORIAL DE CAMBIOS

Columnas exactas:

Versión

Descripción del Cambio

Fecha de Actualización

Ejemplo inicial:

Versión:
1.0

Descripción del Cambio:
Elaboración inicial del Plan de Trabajo

Fecha de Actualización:
05/09/2026

============================================================
14. CONVENCIÓN DE VERSIONES
============================================================

Cambiar la convención actual de:

Versión 1
Versión 2
Versión 3

por:

Versión 1.0
Versión 2.0
Versión 3.0

Para el MVP.

NO implementar todavía:

1.1
1.2
1.3

salvo que una regla institucional futura lo requiera.

Actualizar esta convención en toda la aplicación:

- Mis Planes de Trabajo;
- Información General;
- Resumen;
- Previsualización;
- Firma;
- Confirmación de envío;
- Estado del flujo;
- Historial;
- PDF.

============================================================
15. FECHA DE ELABORACIÓN
============================================================

Agregar al PlanDraft:

fechaElaboracion.

Esta fecha debe quedar asociada a la versión documental.

Para Versión 1.0:

fecha correspondiente a la elaboración de esa versión.

Mostrarla en el encabezado institucional.

El historial de cambios puede utilizar la misma fecha para la elaboración inicial.

============================================================
16. PREVISUALIZACIÓN
============================================================

Mantener el diseño actual:

visualizador A4
+
panel de verificación.

Pero sustituir el contenido del A4 por la plantilla institucional mejorada.

Mantener watermark:

BORRADOR

antes de firma/aprobación.

Mantener controles:

Página X de Y

-

100 %

+

Ajustar

DESCARGAR BORRADOR

============================================================
17. PANEL DE VERIFICACIÓN
============================================================

Mantener:

Información general completa

5 actividades configuradas

Justificación completa

Objetivo completo

Si existen anexos:

✓ Anexos revisados

Si no existen:

✓ Sin anexos

Agregar:

✓ Formato institucional generado

✓ Documento listo para firma

Estado:

LISTO PARA FIRMAR

============================================================
18. ANEXOS
============================================================

Mantener la pantalla actual.

No cambiar todavía tipos de archivo.

Pero diferenciar claramente:

ANEXOS DEL PLAN

de

EVIDENCIAS DE ACTIVIDADES.

Los anexos pertenecen al documento.

Las evidencias se cargan durante ejecución.

No mezclar ambos conceptos.

============================================================
19. FIRMA Y ENVÍO
============================================================

Mantener la pantalla actual de:

Firmar y enviar Plan de Trabajo.

Actualizar:

Versión:
1.0

Mantener:

certificado;
contraseña;
checkbox de confirmación;
mensaje de seguridad;
botón Firmar documento;
botón Enviar a revisión.

============================================================
20. FLUJO VISUAL ANTES DE FIRMA
============================================================

Antes de firmar:

1. Elaborador
● Firma pendiente

2. Revisión
○ Pendiente

3. Coordinación
○ Pendiente

4. Validación
○ Pendiente

No destacar Revisión todavía.

============================================================
21. FLUJO VISUAL DESPUÉS DE FIRMA
============================================================

Después de firmar:

1. Elaborador
✓ Firmado

2. Revisión
● Pendiente

3. Coordinación
○ Pendiente

4. Validación
○ Pendiente

============================================================
22. DOCUMENTO ENVIADO
============================================================

Después de confirmar envío:

Estado:
EN REVISIÓN

Versión:
1.0

Mantener pantalla de éxito actual.

Mostrar:

✓ Elaborado y firmado

● En revisión

○ Coordinación

○ Validación final

============================================================
23. MIS PLANES DE TRABAJO
============================================================

Actualizar todas las versiones mostradas:

Versión 1
→
Versión 1.0

Mantener estados actuales.

No cambiar navegación.

============================================================
24. IA Y AUDITORÍA
============================================================

Cuando el docente aplica una sugerencia de IA:

registrar conceptualmente un evento:

“Sugerencia de IA aplicada”

pero NO almacenar necesariamente el prompt completo o datos sensibles.

La autoría final continúa siendo del docente.

No mostrar en el PDF:

“Texto generado por IA”.

El documento final representa el contenido aceptado por el docente.

============================================================
25. SINCRONIZACIÓN
============================================================

Todo debe continuar utilizando la MISMA fuente de verdad:

PlanDraft.

La IA modifica:
PlanDraft.justificacion
PlanDraft.objetivo

La previsualización lee:
PlanDraft

La firma utiliza:
el documento generado desde PlanDraft

El PDF final utiliza:
el mismo contenido firmado.

No crear documentos hardcodeados diferentes.

============================================================
26. PRUEBA FUNCIONAL
============================================================

Verificar:

1. Abrir Contenido.
2. Editar Justificación.
3. Usar “Mejorar redacción”.
4. Comparar Original / Sugerencia.
5. Aplicar sugerencia.
6. Confirmar que el editor cambia.
7. Ir a Previsualización.
8. Confirmar que el PDF muestra exactamente la nueva Justificación.
9. Confirmar encabezado institucional.
10. Confirmar versión 1.0.
11. Confirmar tabla FIRMAS DE RESPONSABILIDAD.
12. Confirmar tabla CONTROL DE HISTORIAL DE CAMBIOS.
13. Firmar.
14. Confirmar que la fila ELABORADO POR refleja la firma.
15. Enviar.
16. Confirmar estado EN REVISIÓN.
17. Volver a Mis Planes.
18. Confirmar Versión 1.0 y estado EN REVISIÓN.

============================================================
27. NO MODIFICAR
============================================================

No cambiar:

- diseño general de la aplicación;
- sidebar;
- topbar;
- stepper;
- matriz de configuración;
- selector de actividades;
- lógica de actividades obligatorias;
- PlanDraft;
- autoguardado;
- guardado de borrador;
- persistencia;
- navegación;
- estados ya aprobados.

Esta es una corrección funcional y documental del Módulo 3.

NO generar todavía las pantallas del revisor.