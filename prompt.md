AJUSTES FINALES Y PRUEBAS DEL MÓDULO 5

NO rediseñar las pantallas existentes.
NO modificar la arquitectura visual ya aprobada.
NO eliminar funcionalidades.

El módulo funciona correctamente. Realizar únicamente los siguientes ajustes y casos de prueba.

==================================================
1. PERMISOS SEGÚN RESPONSABLE DE LA ACTIVIDAD
==================================================

Implementar y demostrar explícitamente la autorización por responsable.

Regla:

Solo los docentes configurados como responsables de una actividad
pueden cargar o reemplazar sus evidencias.

Crear un caso DEMO:

Actividad:
"Revisión de documentación de titulación"

Grupo:
Unidad de Titulación

Responsable único:
Ing. Carlos López, Mg.

Andrea Pérez pertenece al grupo pero NO es responsable.

Comportamiento esperado al ingresar como Andrea Pérez:

- La actividad NO debe aparecer en "Mis Actividades",
  puesto que esa vista contiene únicamente actividades asignadas
  al docente autenticado.

- Si la actividad puede consultarse desde otra vista general del
  Plan de Trabajo, Andrea podrá verla solamente en modo lectura.

- No mostrar acciones:
  CARGAR EVIDENCIA
  REEMPLAZAR

- Mostrar si corresponde:
  "Solo lectura — usted no es responsable de esta actividad."

La autorización debe plantearse también a nivel de operación.
No debe depender únicamente de ocultar botones.

==================================================
2. CONSISTENCIA TEMPORAL
==================================================

Actualmente existen fechas demo inconsistentes.

Ejemplo:

fecha de carga nueva:
07/09/2026

plazo:
18/09/2026

pero aparece:
"Faltan 5 días"

También existen evidencias precargadas con fecha:
15/09/2026

No mezclar reloj real, reloj demo y timestamps mock.

Centralizar una única fuente temporal para todo el prototipo.

Puede usarse una fecha DEMO fija o la fecha actual real,
pero todas las operaciones deben usar la misma referencia:

- días restantes;
- actividades vencidas;
- timestamps;
- cargas;
- reemplazos;
- auditoría;
- avisos.

No deben existir cargas futuras respecto de la fecha actual
utilizada por el sistema.

==================================================
3. TEXTO DE EVIDENCIAS
==================================================

Cambiar:

"Cada medio de verificación exige exactamente 1 archivo PDF legalizado."

por:

"Cada medio de verificación requiere exactamente 1 archivo PDF."

No asumir que toda evidencia debe estar legalizada,
ya que ese requisito todavía no ha sido confirmado.

==================================================
4. AVISO DE PLAZO VENCIDO
==================================================

Cambiar el texto:

"La modificación posterior al vencimiento requiere autorización
según el procedimiento institucional correspondiente."

por:

"El plazo ordinario para cargar o reemplazar evidencias ha finalizado.
Cualquier habilitación extraordinaria estará sujeta al procedimiento
institucional que se establezca."

No crear botones de prórroga ni procedimientos extraordinarios.

==================================================
5. VISOR DE EVIDENCIAS
==================================================

Documentar/garantizar la siguiente regla:

VER debe visualizar exactamente el archivo PDF cargado por el usuario.

El PDF institucional utilizado actualmente puede mantenerse como
representación DEMO del visor, pero en la implementación real no
debe reemplazarse el archivo subido por un documento generado.

==================================================
6. SINCRONIZACIÓN DE ESTADOS
==================================================

Cuando una actividad pasa de:

1 de 2 evidencias

a:

2 de 2 evidencias

actualizar inmediatamente su estado a:

EVIDENCIAS COMPLETAS

La actualización debe propagarse a:

- Detalle de actividad;
- Mis Actividades;
- contador superior;
- Mis Evidencias;
- Dashboard;
- progreso del Plan de Trabajo, si corresponde.

No requerir recargar manualmente la página.

==================================================
PRUEBAS
==================================================

A. Andrea abre una actividad donde sí es responsable:
   puede cargar/reemplazar.

B. Actividad Andrea + Carlos:
   Andrea puede gestionar evidencias.

C. Actividad únicamente Carlos:
   Andrea no puede gestionar evidencias y no aparece en
   "Mis Actividades".

D. Cargar última evidencia faltante:
   1/2 → 2/2.

E. Regresar a Mis Actividades:
   verificar que aumenta el contador de
   "Evidencias completas".

F. Verificar Dashboard:
   comprobar propagación del estado.

G. Actividad vencida:
   comprobar que carga y reemplazo permanecen bloqueados.

H. VER una evidencia:
   comprobar visor.

I. Reemplazar evidencia:
   comprobar auditoría v1 → sustituida,
   v2 → vigente.

Ejecutar además:

npx tsc --noEmit
npm run build