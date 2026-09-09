CORRECCIÓN FINAL DE CONSISTENCIA — MÓDULO 8

NO rediseñar ninguna pantalla.
NO modificar navegación.
NO cambiar estilos.
NO agregar funcionalidades.

Corregir únicamente dos inconsistencias de datos DEMO.

==========================================================
1. ACTIVIDAD PRINCIPAL
==========================================================

La actividad institucional:

"Seguimiento al avance de trabajos de titulación"

debe conservar los mismos datos utilizados y validados en módulos
anteriores.

Restablecer/garantizar:

Desde:
02/09/2026

Hasta:
18/09/2026

Plazo ordinario de evidencias:
18/09/2026 — 23:59

NO utilizar para esta misma actividad:

15/09/2026 — 20/09/2026

ni crear otra representación contradictoria.

La notificación:

"Actividad próxima a vencer"

NO necesita utilizar esta actividad principal.

Mantener para dicha notificación una actividad DEMO diferente con
vencimiento:

12/09/2026

de forma que respecto a:

FECHA_SISTEMA = 07/09/2026

corresponda a:

"Faltan 5 días".

==========================================================
2. EVENTO DE PERÍODO ACADÉMICO
==========================================================

El período institucional activo del prototipo es:

Julio – Diciembre 2026

Eliminar cualquier referencia a:

"Sep 2026 - Feb 2027"

porque corresponde a un período diferente y contradice los módulos
anteriores.

Eliminar también:

"ponderaciones"

porque no existe ningún requerimiento confirmado relacionado con
ponderaciones académicas.

Mantener el evento:

CONFIGURACIÓN DEL PERÍODO ACTUALIZADA

Fecha:
05/09/2026 — 14:10

Descripción sugerida:

"Se actualizaron parámetros de configuración del período académico
Julio – Diciembre 2026."

Si se necesita mayor detalle:

"Se actualizaron las ventanas de elaboración y revisión configuradas
para el período académico Julio – Diciembre 2026."

No inventar otros parámetros institucionales.

==========================================================
VERIFICACIÓN
==========================================================

Ejecutar:

npx tsc --noEmit
npm run build

No realizar ningún otro cambio.