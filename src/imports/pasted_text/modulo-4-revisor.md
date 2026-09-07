MÓDULO 4 — REVISIÓN, OBSERVACIONES, DEVOLUCIÓN, APROBACIÓN Y FIRMA

Continúa utilizando exactamente el sistema visual, datos compartidos,
componentes y reglas funcionales ya aprobadas.

NO rediseñar:
- identidad visual;
- sidebar;
- topbar;
- tipografía;
- colores;
- botones;
- tablas;
- visualizador de PDF;
- badges;
- modales;
- componentes de firma;
- modelo de PlanDraft / Plan persistido;
- estructura institucional del PDF.

Este módulo cambia la perspectiva.

Hasta ahora trabajamos principalmente con:

DOCENTE / ELABORADOR.

Ahora diseñaremos la experiencia del:

REVISOR.

IMPORTANTE:

Una misma persona puede ser docente en un contexto y revisor en otro.

No asumir que “Revisor” es necesariamente un rol global exclusivo.

El permiso depende conceptualmente de:

usuario
+ grupo institucional
+ documento
+ etapa actual.

============================================================
OBJETIVO DEL MÓDULO
============================================================

Permitir que un revisor:

1. consulte únicamente los documentos que han llegado a su etapa;
2. abra el Plan de Trabajo firmado por el elaborador;
3. revise el PDF sin modificarlo directamente;
4. registre observaciones generales o por sección;
5. apruebe o devuelva el documento;
6. firme electrónicamente cuando aprueba;
7. conozca si existen otros revisores obligatorios en el mismo paso;
8. permita avanzar el documento únicamente cuando todos los revisores
   obligatorios del paso hayan aprobado;
9. preserve el historial de revisión;
10. respete la revisión estrictamente secuencial.

Generar 6 mockups/estados principales:

01 — Bandeja de revisión
02 — Revisión del Plan de Trabajo
03 — Gestión de observaciones
04 — Devolver con observaciones
05 — Aprobar y firmar
06 — Confirmación de aprobación / estado del paso

Resolución de referencia:

1440 × 1024 px.

============================================================
REGLA PRINCIPAL — VISIBILIDAD SECUENCIAL
============================================================

Un usuario solo puede revisar un documento cuando el flujo ha llegado
formalmente a su etapa.

Ejemplo:

Paso 1
Elaborador

Paso 2
Revisión
- Revisor A
- Revisor B

Paso 3
Coordinación

Paso 4
Validación

Mientras el documento está en Paso 2:

Revisor A:
puede revisar.

Revisor B:
puede revisar.

Coordinador:
NO puede revisar todavía.

Autoridad de validación:
NO puede revisar todavía.

No permitir accesos anticipados a etapas futuras.

============================================================
PANTALLA 01 — BANDEJA DE REVISIÓN
============================================================

Cambiar el contexto visual del usuario.

Usuario ficticio:

Ing. Carlos López, Mg.

Contexto visible:

Revisor

Mantener sidebar institucional.

Opciones para este contexto:

Inicio

Bandeja de revisión

Planes de Trabajo

Seguimiento

Grupos asignados

Notificaciones

Perfil

Cerrar sesión

No mostrar funciones administrativas.

“Bandeja de revisión” debe aparecer seleccionada.

============================================================
ENCABEZADO
============================================================

Breadcrumb:

Inicio
>
Bandeja de revisión

Título:

Bandeja de revisión

Descripción:

“Consulte los documentos que requieren su revisión en la etapa actual.”

============================================================
RESUMEN SUPERIOR
============================================================

Mostrar tarjetas compactas:

Pendientes de revisión
3

Revisados hoy
2

Devueltos
1

No llenar con métricas innecesarias.

============================================================
FILTROS
============================================================

Período:
Julio – Diciembre 2026

Grupo:
Todos

Estado:
Pendientes

Buscar:
“Buscar documento o elaborador...”

============================================================
TABLA PRINCIPAL
============================================================

Columnas:

Documento

Grupo institucional

Elaborador

Versión

Recibido

Etapa

Estado

Acción

Ejemplo 1:

Plan de Trabajo

Comisión de Eventos Académicos

Ing. Andrea Pérez, Mg.

Versión 1.0

06 sep. 2026
09:15

Revisión

PENDIENTE

Acción:

REVISAR

Ejemplo 2:

Plan de Trabajo

Unidad de Titulación

Ing. María Torres, Mg.

Versión 1.0

05 sep. 2026
16:40

Revisión

PENDIENTE

Acción:

REVISAR

============================================================
DOCUMENTOS NO DISPONIBLES
============================================================

NO mostrar en la bandeja documentos que todavía estén:

- con el elaborador;
- en una etapa anterior;
- en una etapa posterior;
- pertenecientes a grupos donde el usuario no es revisor.

La bandeja representa trabajo real asignado al usuario.

============================================================
PANTALLA 02 — REVISIÓN DEL PLAN DE TRABAJO
============================================================

Al presionar:

REVISAR

abrir la pantalla principal de revisión.

Breadcrumb:

Bandeja de revisión
>
Plan de Trabajo
>
Revisión

Título:

Revisar Plan de Trabajo

Subtítulo:

Comisión de Eventos Académicos

Información secundaria:

Elaborador:
Ing. Andrea Pérez, Mg.

Versión:
1.0

Período:
Julio – Diciembre 2026

Recibido:
06/09/2026 — 09:15

Estado:

EN REVISIÓN

============================================================
LAYOUT PRINCIPAL
============================================================

Utilizar modo de alta densidad.

La sidebar puede estar colapsada en modo compacto para dar más espacio.

Layout recomendado:

70 % visualizador del documento
30 % panel de revisión.

NO comprimir el PDF excesivamente.

============================================================
VISUALIZADOR PDF
============================================================

Mostrar exactamente el mismo documento institucional firmado
por el elaborador.

No reconstruir con datos diferentes.

Debe contener:

- encabezado institucional;
- Justificación;
- Objetivo;
- Matriz de actividades;
- Anexos si existen;
- Firmas de responsabilidad;
- Control de historial de cambios.

La fila:

ELABORADO POR

debe mostrar:

Ing. Andrea Pérez, Mg.
Firmado electrónicamente.

La fila del revisor actual debe continuar:

Pendiente.

============================================================
CONTROLES DEL PDF
============================================================

Página X de Y

-

100 %

+

Ajustar

DESCARGAR DOCUMENTO

No permitir:

Editar PDF.

============================================================
PANEL DERECHO — INFORMACIÓN DE REVISIÓN
============================================================

Título:

Revisión del documento

Mostrar:

Etapa actual:
Revisión

Revisor:
Ing. Carlos López, Mg.

Grupo:
Comisión de Eventos Académicos

Versión:
1.0

============================================================
FLUJO DE APROBACIÓN
============================================================

Mostrar timeline compacto:

✓ Elaborado y firmado

● Revisión
  0 de 2 revisores aprobados

○ Coordinación

○ Validación final

IMPORTANTE:

En este ejemplo existen 2 revisores obligatorios en el mismo paso.

Mostrar:

Revisores de esta etapa

Ing. Carlos López, Mg.
● Pendiente

Ing. Patricia Salazar, Mg.
● Pendiente

No inventar que un revisor debe esperar al otro dentro del mismo paso
si ambos pueden revisar paralelamente.

El paso completo termina cuando:

2 de 2

han aprobado.

============================================================
CHECKLIST DE REVISIÓN
============================================================

Incluir ayuda opcional, no obligatoria:

Aspectos a verificar

□ Información general

□ Justificación

□ Objetivo

□ Matriz de actividades

□ Anexos

□ Firmas y formato documental

Este checklist ayuda al revisor pero NO modifica el documento.

No convertirlo en una metodología institucional obligatoria si todavía
no está confirmada.

============================================================
ACCIONES PRINCIPALES
============================================================

Agregar observación

DEVOLVER CON OBSERVACIONES

APROBAR Y FIRMAR

“APROBAR Y FIRMAR” debe ser la acción positiva principal.

“DEVOLVER CON OBSERVACIONES” debe tener estilo de advertencia,
no rojo destructivo extremo.

============================================================
PANTALLA 03 — GESTIÓN DE OBSERVACIONES
============================================================

Las observaciones pueden ser:

- generales;
- asociadas a una sección concreta.

No limitar artificialmente la cantidad.

Al presionar:

AGREGAR OBSERVACIÓN

abrir drawer superpuesto desde la derecha.

No reducir el ancho del PDF.

============================================================
FORMULARIO DE OBSERVACIÓN
============================================================

Título:

Nueva observación

Campo:

Tipo de observación *

Opciones:

General

Sección específica

============================================================
SI SELECCIONA GENERAL
============================================================

Mostrar:

Observación *

Textarea.

Ejemplo:

“Revisar la coherencia general entre las actividades propuestas
y el objetivo del Plan de Trabajo.”

============================================================
SI SELECCIONA SECCIÓN ESPECÍFICA
============================================================

Campo:

Sección *

Opciones:

Información general

Justificación

Objetivo

Matriz de actividades

Anexos

Firmas de responsabilidad

Historial de cambios

Después:

Observación *

Ejemplo:

“La actividad 4 no identifica claramente el recurso requerido.”

============================================================
ACCIONES
============================================================

Cancelar

AGREGAR OBSERVACIÓN

============================================================
LISTADO DE OBSERVACIONES
============================================================

El panel principal debe mostrar después:

Observaciones
3

Ejemplo:

JUSTIFICACIÓN

“Reforzar la relación entre la necesidad identificada y las
actividades propuestas.”

Ing. Carlos López, Mg.
06 sep. 2026 — 10:25

------------------------------------------------

MATRIZ DE ACTIVIDADES

“La actividad 4 requiere revisar el recurso seleccionado.”

Ing. Carlos López, Mg.
06 sep. 2026 — 10:28

------------------------------------------------

GENERAL

“Verificar coherencia del documento antes de reenviar.”

Ing. Carlos López, Mg.
06 sep. 2026 — 10:30

Permitir al revisor actual:

Editar

Eliminar

sus propias observaciones mientras todavía no haya enviado
formalmente la devolución.

No permitir editar observaciones de otros revisores.

============================================================
OBSERVACIONES Y APROBACIÓN
============================================================

Si existen observaciones guardadas, no asumir automáticamente que
el documento debe devolverse.

El revisor aún puede:

- eliminar/resolver sus propias observaciones;
- o devolver.

Pero antes de aprobar, si permanecen observaciones activas del propio
revisor, mostrar confirmación:

“Existen observaciones registradas. Revise o elimine las observaciones
antes de aprobar el documento.”

No aprobar dejando observaciones contradictorias activas.

============================================================
PANTALLA 04 — DEVOLVER CON OBSERVACIONES
============================================================

Al presionar:

DEVOLVER CON OBSERVACIONES

mostrar modal de confirmación.

Título:

Devolver Plan de Trabajo

Mensaje:

“El documento será devuelto al elaborador para realizar correcciones.
La versión permanecerá registrada como parte del historial de revisión.”

Mostrar resumen:

Documento:
Plan de Trabajo

Grupo:
Comisión de Eventos Académicos

Versión:
1.0

Observaciones:
3

============================================================
MOTIVO GENERAL
============================================================

Campo:

Mensaje para el elaborador *

Textarea.

Ejemplo:

“Por favor, revise las observaciones registradas y realice las
correcciones correspondientes antes de reenviar el documento.”

Las observaciones detalladas ya están almacenadas.

Este campo sirve como mensaje general.

============================================================
ADVERTENCIA IMPORTANTE
============================================================

Mostrar:

“Al devolver el documento, el flujo de aprobación se detendrá y el
Plan volverá al elaborador.”

Botones:

Cancelar

CONFIRMAR DEVOLUCIÓN

============================================================
DESPUÉS DE DEVOLVER
============================================================

Estado del Plan:

DEVUELTO

Etapa actual:

Elaborador — Corrección requerida

La edición se habilita nuevamente para el elaborador.

El revisor ya no puede modificar el documento.

============================================================
REGLA DE REINICIO DEL FLUJO
============================================================

Cuando el elaborador corrija el documento:

1. las firmas anteriores sobre el contenido anterior NO se reutilizan;
2. el elaborador debe firmar nuevamente;
3. el documento vuelve al PRIMER paso de revisión;
4. todos los revisores obligatorios vuelven a revisar;
5. aprobaciones anteriores permanecen solo como historial.

NO copiar una aprobación antigua sobre el documento corregido.

============================================================
DOCUMENTO CORREGIDO
============================================================

No crear todavía toda la pantalla del elaborador corregido.

Solo preparar la lógica para que después aparezca:

DEVUELTO
→ EN CORRECCIÓN
→ FIRMADO NUEVAMENTE
→ EN REVISIÓN

============================================================
PANTALLA 05 — APROBAR Y FIRMAR
============================================================

Al presionar:

APROBAR Y FIRMAR

abrir modal o pantalla de firma similar a la ya construida para el
elaborador.

Mantener el mismo componente de firma electrónica.

Título:

Aprobar y firmar documento

Texto:

“Al firmar confirma que ha revisado y aprobado esta versión del
Plan de Trabajo.”

Mostrar:

Documento:
Plan de Trabajo

Grupo:
Comisión de Eventos Académicos

Versión:
1.0

Elaborador:
Ing. Andrea Pérez, Mg.

============================================================
CERTIFICADO
============================================================

Certificado de firma *

[Seleccionar archivo]

Contraseña del certificado *

[••••••••]

Mensaje:

“El certificado y su contraseña se utilizarán únicamente durante
el proceso de firma y no serán almacenados permanentemente.”

Checkbox:

☐ Confirmo que he revisado el documento y apruebo esta versión.

============================================================
VALIDACIÓN
============================================================

Si existen observaciones activas creadas por este revisor:

bloquear aprobación.

Mostrar:

“Existen observaciones pendientes asociadas a esta revisión.”

Acción:

REVISAR OBSERVACIONES

============================================================
BOTÓN
============================================================

APROBAR Y FIRMAR

Deshabilitado hasta:

- seleccionar certificado;
- introducir contraseña;
- marcar confirmación;
- no existir observaciones activas incompatibles.

============================================================
DESPUÉS DE FIRMAR
============================================================

Mostrar:

✓ Documento aprobado y firmado

Firmado por:
Ing. Carlos López, Mg.

Fecha:
06/09/2026

Hora:
11:05

============================================================
ACTUALIZACIÓN DEL PDF
============================================================

Actualizar inmediatamente la tabla:

FIRMAS DE RESPONSABILIDAD

La fila correspondiente a este revisor debe cambiar:

Pendiente

→

Firmado electrónicamente
Ing. Carlos López, Mg.
06/09/2026
11:05

No modificar firmas anteriores.

============================================================
PANTALLA 06 — CONFIRMACIÓN DE APROBACIÓN
============================================================

CASO A:
existe otro revisor obligatorio en el mismo paso.

Mostrar:

Documento aprobado correctamente

Texto:

“Su aprobación fue registrada. El documento continuará en esta etapa
hasta que todos los revisores obligatorios hayan completado su revisión.”

Estado:

REVISIÓN EN CURSO

Mostrar:

Revisión
1 de 2 revisores aprobados

✓ Ing. Carlos López, Mg.
  Aprobado y firmado

● Ing. Patricia Salazar, Mg.
  Pendiente

Timeline:

✓ Elaborado y firmado

● Revisión — 1/2

○ Coordinación

○ Validación final

Botones:

VOLVER A BANDEJA

VER DOCUMENTO

============================================================
CASO B:
todos los revisores del paso aprobaron.

Cuando:

2 de 2 revisores

han aprobado:

el sistema debe avanzar automáticamente al siguiente paso.

Mostrar:

Etapa de revisión completada

“Todos los revisores requeridos aprobaron el documento. El Plan ha
avanzado a la siguiente etapa.”

Timeline:

✓ Elaborado y firmado

✓ Revisión — 2/2

● Coordinación

○ Validación final

El coordinador recibe acceso únicamente ahora.

============================================================
REVISIÓN PARALELA DENTRO DEL MISMO PASO
============================================================

IMPORTANTE:

Si un paso contiene varios revisores:

Revisor A
Revisor B
Revisor C

estos revisores pueden actuar dentro de la misma etapa sin esperar
secuencialmente entre sí.

La secuencia estricta aplica ENTRE PASOS.

Ejemplo:

PASO 2 — REVISIÓN
A + B
pueden revisar.

↓

cuando A y B aprobaron:

PASO 3 — COORDINACIÓN
se habilita.

============================================================
¿QUÉ PASA SI UN REVISOR DEVUELVE?
============================================================

Si:

Revisor A
✓ aprobó

pero:

Revisor B
devuelve

entonces:

el paso completo NO está aprobado.

El documento vuelve al elaborador.

La aprobación de Revisor A permanece en historial,
pero NO es válida automáticamente para la versión corregida.

Después de la corrección:

Revisor A debe revisar nuevamente.

Revisor B debe revisar nuevamente.

============================================================
ESTADOS NECESARIOS
============================================================

Utilizar de forma consistente:

PENDIENTE

EN REVISIÓN

APROBADO

DEVUELTO

EN CORRECCIÓN

FIRMADO

No crear demasiados estados adicionales.

============================================================
NOTIFICACIONES
============================================================

Preparar conceptualmente eventos:

Al llegar un documento al revisor:

“Nueva revisión pendiente.”

Al aprobar:

“Aprobación registrada.”

Al completar todos los revisores:

“El documento avanzó a Coordinación.”

Al devolver:

“El Plan de Trabajo fue devuelto al elaborador.”

No desarrollar todavía un centro completo de notificaciones.

============================================================
AUDITORÍA
============================================================

Registrar conceptualmente:

- documento recibido por etapa;
- apertura/revisión;
- observación creada;
- observación editada;
- observación eliminada;
- devolución;
- motivo de devolución;
- aprobación;
- firma;
- fecha/hora;
- avance de etapa.

No permitir eliminar los eventos históricos de auditoría.

============================================================
ACTUALIZACIÓN DEL HISTORIAL DE CAMBIOS
============================================================

IMPORTANTE:

Una aprobación NO crea automáticamente una nueva versión.

No agregar nueva fila de versión solo porque un revisor aprobó.

La tabla:

CONTROL DE HISTORIAL DE CAMBIOS

se modifica cuando realmente existe una nueva versión/cambio
documental según las reglas definidas.

Las revisiones y aprobaciones pertenecen a la auditoría y flujo.

============================================================
PDF INSTITUCIONAL
============================================================

El revisor debe observar exactamente el mismo PDF que firmó
el elaborador.

Después de cada firma aprobatoria:

actualizar únicamente la representación de firmas correspondiente.

No modificar:

- Justificación;
- Objetivo;
- Matriz;
- Anexos;

durante la revisión.

============================================================
INMUTABILIDAD
============================================================

El revisor NO puede editar directamente:

- Justificación;
- Objetivo;
- Matriz;
- actividades;
- fechas;
- recursos;
- responsables;
- anexos.

Solo puede:

- revisar;
- observar;
- aprobar;
- devolver;
- firmar.

============================================================
CASO DE MÚLTIPLES ROLES
============================================================

Si el usuario también es docente:

permitir cambiar de contexto mediante el perfil o selector de rol,
sin crear una cuenta diferente.

Ejemplo:

Ing. Carlos López, Mg.

Contexto actual:
Revisor

Puede cambiar a:
Docente

No desarrollar un selector complejo todavía.

Solo asegurar que la arquitectura visual permita múltiples contextos.

============================================================
PERSISTENCIA
============================================================

Todo debe trabajar sobre el mismo Plan persistido.

No crear una copia independiente llamada:

reviewPlanDemo.

Utilizar el mismo documento que el elaborador envió.

Conceptualmente:

Plan
+
ApprovalFlow
+
ReviewActions
+
Signatures
+
Observations.

============================================================
PRUEBA FUNCIONAL REQUERIDA
============================================================

Verificar el siguiente escenario:

1. Andrea envía Versión 1.0.
2. Carlos recibe el documento.
3. Carlos abre el PDF.
4. Carlos agrega 2 observaciones.
5. Carlos intenta aprobar.
6. El sistema detecta observaciones activas.
7. Carlos decide devolver.
8. Andrea recibe el Plan como DEVUELTO.
9. Andrea corrige y firma nuevamente.
10. El Plan vuelve a Revisión.
11. Carlos aprueba y firma.
12. El segundo revisor todavía está pendiente.
13. El sistema muestra 1/2.
14. El segundo revisor aprueba.
15. El sistema muestra 2/2.
16. Revisión queda completada.
17. Coordinación se habilita.

No desarrollar todavía la interfaz completa del elaborador corrigiendo.

Ese será un estado adicional posterior si es necesario.

============================================================
NO DESARROLLAR TODAVÍA
============================================================

No crear aún:

- ejecución de actividades;
- carga de evidencias;
- solicitud de ampliación;
- validación de evidencias;
- nueva versión 2.0;
- administración;
- auditoría administrativa completa.

Este módulo termina cuando el Plan supera o falla una etapa de revisión.