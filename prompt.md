MÓDULO 10 — PERFIL, CONSISTENCIA GLOBAL Y PREPARACIÓN FINAL DEL PROTOTIPO

Proyecto:
Sistema web de Gestión de Planes de Trabajo de docentes FISEI — UTA.

IMPORTANTE:
Este es el ÚLTIMO módulo funcional del prototipo.

El objetivo NO es crear nuevas funcionalidades complejas.

Centrarse exclusivamente en:

1. Perfil del usuario.
2. Cambio de contraseña.
3. Estados vacíos / mensajes de sistema básicos.
4. Consistencia visual y terminológica global.
5. Preparación del prototipo para demostración final.

NO implementar backend real.
NO implementar APIs.
NO crear autenticación real.
NO crear base de datos.
NO agregar funcionalidades no solicitadas.
NO refactorizar módulos anteriores salvo correcciones mínimas de
consistencia visual o navegación.

Trabajar sobre los mockups React existentes.

==========================================================
CONTEXTO CONSOLIDADO DEL SISTEMA
==========================================================

Roles DEMO principales:

DOCENTE
Ing. Andrea Pérez, Mg.

REVISOR
Ing. Carlos López, Mg.

ADMINISTRADOR
Ing. Laura Medina, Mg.

Período activo del escenario:

Julio – Diciembre 2026

Fecha de referencia del sistema:

07/09/2026

Mantener estos actores, roles, fecha y período.

NO crear nuevos usuarios innecesarios.

==========================================================
PANTALLA 01 — PERFIL DEL DOCENTE
==========================================================

Desde el sidebar:

Perfil

Mostrar una pantalla institucional clara.

Título:

Mi Perfil

Subtítulo:

Consulte la información asociada a su cuenta institucional.

Bloque superior:

Avatar:
AP

Nombre:
Ing. Andrea Pérez, Mg.

Correo institucional:
andrea.perez@uta.edu.ec

Estado:
ACTIVO

Rol:
Docente

NO mostrar:

- cédula;
- teléfono;
- dirección;
- tipo de contrato;
- tiempo completo;
- datos personales no confirmados.

==========================================================
INFORMACIÓN DE LA CUENTA
==========================================================

Mostrar:

Nombre completo
Ing. Andrea Pérez, Mg.

Correo institucional
andrea.perez@uta.edu.ec

Rol del sistema
Docente

Estado de cuenta
Activo

Los campos institucionales pueden mostrarse en modo solo lectura.

No asumir que el docente puede modificar libremente su nombre,
correo o rol.

==========================================================
GRUPOS INSTITUCIONALES
==========================================================

Mostrar una sección:

Grupos institucionales

Para Andrea:

Unidad de Titulación

Comisión de Eventos Académicos

Mostrar únicamente grupos existentes en el escenario consolidado.

Cada grupo puede mostrar:

Nombre
Tipo
Rol dentro del grupo

Utilizar únicamente roles ya establecidos:

Miembro
Coordinador
Otro

Para Andrea utilizar:

Miembro

si no existe otra definición confirmada.

NO utilizar:

Responsable

como rol del grupo.

"Responsable" pertenece al contexto de las actividades.

==========================================================
SEGURIDAD DE LA CUENTA
==========================================================

Mostrar tarjeta:

Seguridad

Acción:

CAMBIAR CONTRASEÑA

No mostrar ni recuperar contraseña actual.

No mostrar contraseñas temporales en pantalla.

==========================================================
PANTALLA 02 — CAMBIAR CONTRASEÑA
==========================================================

Abrir modal o vista secundaria:

Cambiar contraseña

Campos:

Contraseña actual
Nueva contraseña
Confirmar nueva contraseña

Agregar controles:

mostrar / ocultar contraseña

Indicaciones mínimas:

"La nueva contraseña debe cumplir los requisitos de seguridad
configurados por la institución."

NO inventar una política institucional exacta como:

- mínimo 12 caracteres;
- símbolos obligatorios;
- caducidad de 90 días;

si esos valores no han sido confirmados.

Para el prototipo puede validarse conceptualmente:

- nueva contraseña no vacía;
- confirmación coincidente;
- no igual a la actual.

Botones:

Cancelar
ACTUALIZAR CONTRASEÑA

Tras éxito:

✓ Contraseña actualizada correctamente.

No realizar autenticación real.

==========================================================
PANTALLA 03 — PERFIL DEL REVISOR
==========================================================

Cuando la sesión DEMO corresponde a:

Ing. Carlos López, Mg.

mostrar la MISMA estructura visual del perfil.

Datos:

Nombre:
Ing. Carlos López, Mg.

Correo:
carlos.lopez@uta.edu.ec

Roles del sistema:

Docente
Revisor

Si el prototipo diferencia contexto activo mostrar:

Contexto actual:
Revisor

IMPORTANTE:

Diferenciar:

currentUser
de
activeContext

Cambiar contexto NO cambia de persona.

No volver a introducir el error antiguo:

Andrea en TopBar
Carlos en Sidebar.

TopBar, Sidebar, Perfil, observaciones, firmas y acciones deben leer
el mismo currentUser.

==========================================================
GRUPOS DE CARLOS
==========================================================

Utilizar únicamente grupos existentes donde ya aparezca asociado.

Por ejemplo:

Unidad de Titulación
Rol dentro del grupo:
Coordinador

Comisión de Eventos Académicos
Rol dentro del grupo:
Miembro

No inventar nuevos grupos.

==========================================================
PANTALLA 04 — PERFIL DEL ADMINISTRADOR
==========================================================

Usuario:

Ing. Laura Medina, Mg.

Correo institucional DEMO existente.

Rol:
Administrador

Estado:
Activo

No asignarla automáticamente como:

- autoridad final;
- revisora;
- coordinadora;
- docente;

si no existe esa configuración.

El Administrador administra el sistema, pero su rol administrativo
NO implica automáticamente participar en los flujos académicos.

==========================================================
PANTALLA 05 — ESTADOS VACÍOS
==========================================================

Crear o verificar estados vacíos coherentes para vistas donde puedan
existir cero resultados.

NO crear pantallas independientes si no son necesarias.

Ejemplos:

MIS PLANES

"No existen Planes de Trabajo para los filtros seleccionados."

MIS ACTIVIDADES

"No existen actividades para los filtros seleccionados."

EVIDENCIAS

"No existen evidencias para los filtros seleccionados."

NOTIFICACIONES

"No tiene notificaciones para mostrar."

BANDEJA DE REVISIÓN

"No existen documentos pendientes de revisión."

EVIDENCIAS POR VALIDAR

"No existen evidencias pendientes de validación."

CONSULTA HISTÓRICA

"No existen registros históricos para los filtros seleccionados."

AUDITORÍA

"No se encontraron eventos para los filtros aplicados."

Utilizar:

icono neutro
mensaje principal
texto secundario breve

No utilizar ilustraciones excesivas.

==========================================================
PANTALLA 06 — ACCESO NO AUTORIZADO
==========================================================

Preparar un estado reutilizable:

Acceso restringido

Texto:

"No dispone de permisos para acceder a este recurso."

Acción:

VOLVER

Este estado debe poder utilizarse conceptualmente si un rol intenta
abrir directamente una vista no autorizada.

No implementar seguridad backend.

Solo mockup / estado de interfaz.

==========================================================
PANTALLA 07 — RECURSO NO DISPONIBLE
==========================================================

Preparar un estado simple para enlaces inexistentes o recursos no
encontrados:

Recurso no disponible

"No fue posible encontrar el elemento solicitado."

Acción:

VOLVER AL INICIO

No crear un sistema complejo de routing si no es necesario.

==========================================================
CONSISTENCIA GLOBAL OBLIGATORIA
==========================================================

Realizar una revisión VISUAL Y TERMINOLÓGICA ligera de todos los módulos.

NO refactorizar lógica.

Verificar únicamente consistencia.

==========================================================
A. IDENTIDAD DEL USUARIO
==========================================================

En cada contexto:

Sidebar
TopBar
Perfil
Firmas
Observaciones
Auditoría

deben mostrar el usuario correcto.

DOCENTE:
Andrea Pérez

REVISOR:
Carlos López

ADMINISTRADOR:
Laura Medina

No mezclar identidades.

==========================================================
B. PERÍODO
==========================================================

Período activo:

Julio – Diciembre 2026

No volver a introducir:

Sep 2026 – Feb 2027
u otros períodos activos ficticios.

Históricos:

Enero – Junio 2026
Julio – Diciembre 2025

==========================================================
C. FECHA DEL SISTEMA
==========================================================

Mantener:

07/09/2026

No cambiarla para adaptar escenarios individuales.

==========================================================
D. FORMATO DE FECHAS
==========================================================

En interfaz utilizar preferentemente:

DD/MM/AAAA

Ejemplo:

07/09/2026

Cuando exista hora:

07/09/2026 — 10:28

No alterar internamente valores ISO si ya son necesarios para código.

==========================================================
E. TERMINOLOGÍA
==========================================================

Usar de forma consistente:

Grupo institucional

Plan de Trabajo

Actividad

Responsable de actividad

Medio de verificación

Evidencia

Evidencia cargada

Evidencia validada

Evidencia observada

Período académico

Revisor

Coordinador

Administrador

Evitar cambios arbitrarios de nombres entre módulos.

==========================================================
F. ESTADOS DEL PLAN
==========================================================

Mantener únicamente estados ya utilizados:

BORRADOR
EN REVISIÓN
DEVUELTO
EN CORRECCIÓN
EN EJECUCIÓN
FINALIZADO

No crear nuevos estados sin necesidad.

==========================================================
G. ESTADOS DE EVIDENCIA
==========================================================

Mantener:

PENDIENTE
PENDIENTE DE VALIDACIÓN
VALIDADA
OBSERVADA
PLAZO VENCIDO

"EVIDENCIAS COMPLETAS" representa 100% de archivos requeridos cargados.

NO significa:

VALIDADAS.

==========================================================
H. VERSIONAMIENTO
==========================================================

PLAN:

1.0
2.0
3.0

para versiones formales.

No utilizar:

1.1
1.2

hasta que la institución defina ese comportamiento.

Corrección por devolución:

NO genera automáticamente una nueva versión formal.

EVIDENCIA:

puede tener:

v1.0
v2.0

cuando existe reemplazo de archivo.

No mezclar el versionamiento del Plan con el de la evidencia.

==========================================================
I. IDENTIFICADORES INTERNOS
==========================================================

No mostrar IDs técnicos como:

rep-plan-1
notif-doc-2
aud-03
act-1
m-1-2

en interfaz para usuario final.

Mantenerlos internamente si son necesarios.

==========================================================
J. PALLETA VISUAL
==========================================================

Mantener identidad ya consolidada:

Sidebar:
azul oscuro institucional.

Contenido:
fondo claro.

Cards:
blancas.

Acciones primarias:
azul institucional.

Éxito:
verde.

Advertencia:
ámbar.

Error/destructivo:
rojo.

No volver a introducir:

dark theme automático.

No utilizar rojo como color decorativo principal.

==========================================================
K. BOTONES DEMO / DEBUG
==========================================================

Revisar controles creados únicamente para pruebas.

Por ejemplo:

"Simular 2ª aprobación"

Si deben permanecer para la presentación, marcarlos claramente:

DEMO

Si no son necesarios para el recorrido final, ocultarlos de la
interfaz principal.

NO eliminarlos si hacerlo rompe la capacidad de demostrar el flujo.

==========================================================
L. TEXTOS NO CONFIRMADOS
==========================================================

No introducir:

- resoluciones;
- normativas;
- autoridades;
- códigos institucionales;
- procedimientos;
- tipos contractuales;
- cargos;
- políticas de seguridad específicas;

que no hayan sido confirmados.

Si un dato existe solo para demostrar comportamiento utilizar:

DEMO

cuando sea necesario.

==========================================================
PREPARACIÓN DEL PROTOTIPO PARA PRESENTACIÓN
==========================================================

Verificar que exista un recorrido claro para demostrar:

DOCENTE

Login
→ Inicio
→ Mis Planes
→ Plan
→ Actividades
→ Evidencias
→ Reportes
→ Notificaciones
→ Perfil

REVISOR

Bandeja de revisión
→ Revisar Plan
→ Evidencias por validar
→ Seguimiento
→ Notificaciones
→ Perfil

ADMINISTRADOR

Panel General
→ Usuarios
→ Grupos
→ Períodos
→ Catálogos
→ Flujos
→ Feriados
→ Plantillas
→ Auditoría
→ Reportes / Cierre
→ Perfil

No crear una pantalla especial de "presentación".

Solo garantizar que la navegación existente permita recorrer estos
flujos.

==========================================================
RESTRICCIÓN FINAL
==========================================================

Este módulo NO debe convertirse en otro módulo grande.

Prioridad:

consistencia > nuevas funciones.

No crear:

- configuración avanzada de perfil;
- foto real de usuario;
- preferencias visuales;
- idioma;
- MFA;
- sesiones activas;
- logs de dispositivos;
- privacidad;
- firma de perfil;
- notificaciones configurables;

porque no forman parte de los requerimientos confirmados.

==========================================================
VERIFICACIÓN TÉCNICA
==========================================================

Ejecutar al finalizar:

npx tsc --noEmit
npm run build

Entregar un resumen de:
d
1. Pantallas de Perfil implementadas.
2. Cambio de contraseña.
3. Estados vacíos/restringidos.
4. Inconsistencias globales detectadas y corregidas.
5. Controles DEMO conservados.
6. Resultado de TypeScript y Build.

NO iniciar otro módulo.