CORRECCIONES FINALES DEL MÓDULO 8 — CONSISTENCIA ENTRE NOTIFICACIONES,
OBJETOS Y TRAZABILIDAD

IMPORTANTE:

NO rediseñar ninguna pantalla.
NO modificar la arquitectura del módulo.
NO cambiar estilos.
NO agregar funcionalidades productivas.
NO realizar refactors amplios.

Las pantallas y UX actuales quedan aprobadas.

Corregir exclusivamente las siguientes inconsistencias detectadas durante
las pruebas manuales.

==========================================================
1. EVIDENCIA OBSERVADA — NAVEGACIÓN CONTEXTUAL
==========================================================

Actualmente existe una inconsistencia crítica.

La notificación indica:

Evidencia observada
Medio: Acta
Actividad:
Seguimiento al avance de trabajos de titulación

pero al pulsar:

VER OBSERVACIÓN

el modal muestra:

Medio: Informe

Esto es incorrecto.

La navegación debe abrir EXACTAMENTE la evidencia asociada a la
notificación.

Para este escenario utilizar de manera canónica:

Actividad:
Seguimiento al avance de trabajos de titulación

Grupo:
Unidad de Titulación

Medio:
Acta

Versión evaluada:
v1.0

Revisor:
Ing. Carlos López, Mg.

Fecha / Hora:
07/09/2026 — 10:28

Plazo:
18/09/2026 — 23:59

El modal "Observación del revisor" debe mostrar esos mismos datos.

No utilizar datos hardcodeados de otra evidencia.

==========================================================
2. TEXTO DEL MODAL DE OBSERVACIÓN
==========================================================

Actualmente el subtítulo indica:

"Detalle formal de las observaciones registradas por la comisión."

Cambiar por:

"Detalle de la observación registrada por el revisor."

o:

"Detalle de la observación registrada durante la revisión."

No atribuir la observación genéricamente a una comisión cuando el sistema
registra al revisor individual.

==========================================================
3. UNIFICAR HORA DE OBSERVACIÓN DEL ACTA
==========================================================

Utilizar en todo el Módulo 8:

07/09/2026 — 10:28

para el evento:

EVIDENCIA OBSERVADA — Acta v1.0.

Actualmente algunas vistas muestran 10:25.

Corregir:

- notificación;
- auditoría;
- detalle;
- timeline;
- modal de observación;

para que todas referencien el mismo evento.

==========================================================
4. PLAN CORREGIDO REENVIADO
==========================================================

Actualmente Carlos recibe:

"Plan corregido reenviado"

para:

Comisión de Eventos Académicos.

Sin embargo, el timeline canónico del Plan termina en:

CORRECCIÓN INICIADA.

Para mantener el escenario actualmente validado:

ELIMINAR temporalmente la notificación:

"Plan corregido reenviado"

de la bandeja DEMO de Carlos.

NO alterar el Plan actual solamente para justificar esa notificación.

Mantener el escenario actual del Plan:

PLAN FIRMADO
→
PLAN ENVIADO A REVISIÓN
→
OBSERVACIÓN REGISTRADA
→
PLAN DEVUELTO
→
CORRECCIÓN INICIADA

El reenvío se demostrará posteriormente cuando el flujo de corrección
avance hasta Firma y Envío.

==========================================================
5. CRONOLOGÍA DEL PLAN
==========================================================

Unificar las fechas del mismo Plan.

Utilizar como secuencia DEMO coherente:

05/09/2026 — 23:41
PLAN FIRMADO ELECTRÓNICAMENTE

06/09/2026 — 09:15
PLAN ENVIADO A REVISIÓN

06/09/2026 — 10:25
OBSERVACIÓN REGISTRADA

07/09/2026 — 09:35
PLAN DEVUELTO

07/09/2026 — 09:45
CORRECCIÓN INICIADA

De esta forma ninguna acción sucede antes de que el Plan haya sido
devuelto.

Actualizar el timeline y la notificación con estas mismas referencias.

El Plan mantiene:

Versión formal 1.0

La devolución y corrección NO generan automáticamente versión 2.0.

==========================================================
6. CONTADOR DE NOTIFICACIONES
==========================================================

En la tarjeta superior actualmente aparece:

"2 pendientes de revisión"

debajo de:

NO LEÍDAS

Cambiar por:

"2 notificaciones sin leer"

o simplemente:

"sin leer"

El contador representa notificaciones no leídas,
no tareas pendientes de revisión.

==========================================================
7. TIPO DE NOTIFICACIÓN DE ASIGNACIÓN
==========================================================

La notificación:

"Asignación a grupo institucional"

actualmente aparece con badge:

"Catálogo actualizado"

Esto es incorrecto.

Cambiar el badge por:

"Asignación a grupo"

o:

"Grupo institucional"

Mantener el mensaje:

"Ha sido asignada como Miembro al grupo Unidad de Titulación..."

==========================================================
8. FILTRO DE PERÍODO EN NOTIFICACIONES
==========================================================

Agregar al Centro de Notificaciones un filtro visual sencillo:

Período:
Julio – Diciembre 2026

Puede ser un select MOCK.

No implementar lógica compleja.

Debe coexistir con:

Tipo
Buscar
Todas / No leídas / Leídas

==========================================================
9. FILTROS DE FECHA EN AUDITORÍA
==========================================================

Agregar los filtros solicitados originalmente:

Fecha desde
Fecha hasta

en formato visual DD/MM/AAAA.

Mantener:

Buscar
Módulo
Usuario
Rol
Tipo de evento
Grupo institucional

La lógica puede ser filtrado simple de arrays MOCK.

==========================================================
10. IDENTIFICADOR INTERNO DE AUDITORÍA
==========================================================

En el drawer de detalle actualmente aparece:

ID: aud-03

Ocultarlo de la interfaz.

Es un identificador interno MOCK y no aporta al usuario institucional.

Puede mantenerse internamente en los datos React.

Mantener visible:

REGISTRO INMUTABLE

pero no mostrar IDs internos.

==========================================================
11. VERSIONAMIENTO DE EVIDENCIA
==========================================================

En el timeline aparece un texto similar a:

"La sustitución de una evidencia observada genera formalmente la
versión 2.0..."

Cambiar por:

"La sustitución de una evidencia observada genera una nueva versión
de la evidencia (v2.0), que deberá ser validada nuevamente."

IMPORTANTE:

Versión de evidencia:
v1.0 → v2.0

NO equivale a:

Versión formal del Plan:
1.0 → 2.0

Mantener ambas conceptos separados.

==========================================================
12. NO MODIFICAR
==========================================================

Mantener:

- campana;
- dropdown;
- Centro de Notificaciones;
- tarjetas;
- leído/no leído;
- navegación contextual;
- cambio de rol;
- Auditoría;
- métricas;
- tabla;
- drawer;
- estados anterior/posterior;
- timeline;
- datos sensibles ocultos;
- paginación;
- botón Restablecer DEMO.

No desarrollar backend ni persistencia adicional.

==========================================================
VERIFICACIÓN
==========================================================

Ejecutar:

npx tsc --noEmit
npm run build

No iniciar el Módulo 9.