# MÓDULO 6 — SEGUIMIENTO Y VALIDACIÓN DE EVIDENCIAS
## Aplicativo web para la gestión de planes de trabajo, actividades y evidencias de docentes de la FISEI — UTA

Continúa desarrollando el prototipo existente.

NO crear un proyecto nuevo.
NO reemplazar ni reconstruir los módulos anteriores.
NO modificar comportamientos ya validados salvo que sea estrictamente necesario para integrar este módulo.
NO introducir regresiones en:
- autenticación;
- gestión de Planes de Trabajo;
- creación de planes;
- flujo de revisión;
- corrección de planes devueltos;
- ejecución de actividades;
- carga de evidencias;
- reemplazo de evidencias;
- auditoría;
- permisos por responsable;
- visor PDF;
- Dashboard.

Mantener exactamente el diseño institucional ya establecido:
- sidebar azul oscuro;
- topbar;
- tipografía;
- tarjetas;
- badges;
- tablas;
- botones;
- espaciados;
- colores;
- modales;
- drawers;
- breadcrumbs;
- estados visuales.

Todo el sistema debe permanecer EN ESPAÑOL.

==========================================================
1. OBJETIVO DEL MÓDULO
==========================================================

Implementar el proceso mediante el cual los revisores institucionales puedan:

1. consultar evidencias cargadas por los docentes;
2. visualizar el archivo PDF real correspondiente;
3. verificar su relación con la actividad y medio de verificación;
4. validar la evidencia;
5. registrar una observación cuando la evidencia no sea correcta;
6. consultar el historial de versiones;
7. conocer si una evidencia fue reemplazada;
8. mantener trazabilidad de todas las decisiones;
9. dar seguimiento al cumplimiento por docente, grupo y Plan de Trabajo.

Este módulo NO debe permitir modificar la planificación original de una actividad.

La información de:
- actividad;
- fechas;
- responsables;
- recursos;
- medios de verificación;

proviene del Plan de Trabajo aprobado y debe ser SOLO LECTURA durante esta etapa.

==========================================================
2. REGLAS DE NEGOCIO OBLIGATORIAS
==========================================================

### RN-01 — Una evidencia cargada no equivale automáticamente a evidencia validada

Distinguir claramente:

CARGADA
PENDIENTE DE VALIDACIÓN
VALIDADA
OBSERVADA
PLAZO VENCIDO

No utilizar el mismo estado para "archivo existente" y "archivo aprobado por el revisor".

Ejemplo:

ACTA
Archivo: acta_reunion.pdf
Estado: PENDIENTE DE VALIDACIÓN

### RN-02 — Validación

La evidencia es validada por un revisor autorizado para el grupo institucional correspondiente.

Registrar obligatoriamente:

- evidencia;
- versión del archivo;
- usuario revisor;
- fecha;
- hora;
- resultado;
- observación, si existe.

### RN-03 — Observación

Si una evidencia no es adecuada:

Estado:

OBSERVADA

El revisor deberá registrar obligatoriamente una observación textual.

Ejemplo:

"La evidencia presentada no permite verificar completamente el cumplimiento de la actividad."

NO inventar categorías institucionales de rechazo que no hayan sido definidas.

### RN-04 — Reemplazo después de una observación

Mientras el plazo ordinario siga vigente, un docente responsable puede reemplazar la evidencia observada.

Al reemplazarla:

v1.0 — observada
↓
v2.0 — pendiente de validación

La observación de v1.0 NO se elimina.

Debe permanecer en el historial.

### RN-05 — Evidencia previamente validada que posteriormente se reemplaza

Actualmente el docente puede reemplazar libremente una evidencia hasta las 23:59 de la fecha límite.

Por tanto:

si una evidencia VALIDADA se reemplaza dentro del plazo permitido:

- la versión validada permanece en historial;
- la nueva versión se convierte en la vigente;
- la nueva versión vuelve a estado PENDIENTE DE VALIDACIÓN;
- necesita ser revisada nuevamente.

Ejemplo:

v1.0
VALIDADA por Carlos López

↓ reemplazo

v2.0
PENDIENTE DE VALIDACIÓN

NO transferir automáticamente la validación de una versión anterior a una nueva.

### RN-06 — Vencimiento

Los plazos de evidencias siguen siendo:

HASTA las 23:59 de la fecha final de la actividad.

Una vez vencido el plazo ordinario:

NO mostrar acciones normales de:
- cargar;
- reemplazar.

Mostrar:

"El plazo ordinario para cargar o reemplazar evidencias ha finalizado. Cualquier habilitación extraordinaria estará sujeta al procedimiento institucional que se establezca."

NO inventar:
- prórrogas;
- número de días extraordinarios;
- personas autorizadoras;
- procedimientos no definidos.

### RN-07 — Responsabilidad

Pertenecer al mismo grupo institucional NO significa automáticamente poder modificar cualquier evidencia.

Solamente los responsables de la actividad pueden:

- cargar;
- reemplazar evidencias.

Los revisores autorizados pueden:

- consultar;
- revisar;
- validar;
- observar.

Las verificaciones deben existir también a nivel de operación/código.

NO depender únicamente de ocultar botones.

### RN-08 — Un archivo por medio

Cada medio de verificación requiere exactamente:

1 archivo PDF vigente.

Ejemplo:

Actividad:
Seguimiento al avance de trabajos de titulación

Medios:
Informe
Acta

Debe existir:

Informe → 1 PDF
Acta → 1 PDF

Cada medio posee su propio:
- archivo;
- versión;
- estado;
- auditoría;
- validación.

### RN-09 — No eliminar trazabilidad

Nunca eliminar del historial:

- archivos reemplazados;
- observaciones;
- validaciones;
- fechas;
- usuarios;
- versiones.

Las versiones anteriores son solo lectura.

### RN-10 — Visor

El botón VER debe mostrar EL ARCHIVO REAL asociado a la evidencia.

No sustituirlo por:
- documento institucional ficticio;
- documento generado automáticamente;
- plantilla simulada diferente del archivo cargado.

Si el prototipo no puede renderizar físicamente determinados PDF, mantener al menos la referencia y metadatos reales del archivo cargado.

### RN-11 — Visibilidad

Un revisor solo puede consultar evidencias correspondientes a:

- grupos institucionales que tenga asignados;
- documentos o actividades que tenga permitido revisar.

No permitir exposición transversal de información de grupos no asignados.

==========================================================
3. FECHA DE REFERENCIA DEL PROTOTIPO
==========================================================

Mantener la fecha centralizada que ya utiliza el proyecto:

FECHA_SISTEMA = 07/09/2026

No utilizar Date.now() indiscriminadamente para los datos demo.

Todas las fechas simuladas deben ser coherentes con esta fecha.

No crear eventos registrados en el futuro respecto de FECHA_SISTEMA.

==========================================================
4. ESTADOS DE EVIDENCIA
==========================================================

Implementar visualmente:

CARGADA
- azul o neutro;
- archivo recibido;
- todavía no evaluado.

PENDIENTE DE VALIDACIÓN
- amarillo suave.

VALIDADA
- verde.

OBSERVADA
- naranja o rojo suave.

PLAZO VENCIDO
- rojo.

Debe ser imposible confundir:

"EVIDENCIA CARGADA"

con

"EVIDENCIA VALIDADA".

==========================================================
5. PANTALLA 01 — BANDEJA DE EVIDENCIAS POR VALIDAR
==========================================================

Rol principal:

REVISOR

Agregar en el menú del revisor una opción:

"Evidencias por validar"

o integrar correctamente esta funcionalidad dentro de "Seguimiento" si arquitectónicamente resulta más coherente.

Título:

Evidencias por validar

Subtítulo:

"Revise las evidencias cargadas correspondientes a los grupos institucionales asignados."

Mostrar tarjetas resumen:

PENDIENTES DE VALIDACIÓN
VALIDADAS HOY
OBSERVADAS
TOTAL REVISADAS

Los números deben calcularse desde los datos, no colocarse como texto visual independiente.

Agregar filtros:

- Período académico
- Grupo institucional
- Docente
- Plan de Trabajo
- Actividad
- Medio de verificación
- Estado
- búsqueda textual

Tabla:

ACTIVIDAD
DOCENTE
GRUPO
MEDIO
ARCHIVO
CARGADO
FECHA LÍMITE
ESTADO
ACCIÓN

Ejemplo:

Seguimiento al avance de trabajos de titulación
Ing. Andrea Pérez, Mg.
Unidad de Titulación
Acta
acta_seguimiento.pdf
07/09/2026 — 10:30
18/09/2026 — 23:59
PENDIENTE DE VALIDACIÓN
[ REVISAR ]

El botón REVISAR abre la siguiente pantalla.

==========================================================
6. PANTALLA 02 — REVISAR EVIDENCIA
==========================================================

Diseño recomendado:

70% visor PDF
30% panel de revisión

similar al módulo de revisión de Planes de Trabajo para mantener consistencia.

### Encabezado

Mostrar:

Revisar evidencia

Actividad
Plan de Trabajo
Grupo
Docente
Medio de verificación
Versión
Fecha de carga
Fecha límite
Estado

Ejemplo:

Actividad:
Seguimiento al avance de trabajos de titulación

Medio:
Acta

Versión:
2.0

Subido por:
Ing. Andrea Pérez, Mg.

Carga:
07/09/2026 — 10:30

Plazo:
18/09/2026 — 23:59

### Visor

Debe mostrar el PDF asociado a la versión vigente.

Controles:

- página anterior;
- siguiente;
- zoom -;
- zoom +;
- ajustar;
- descargar.

### Panel lateral

Sección:

Información de la actividad

Mostrar solo lectura:

Responsables
Recursos
Desde
Hasta
Medio de verificación
Estado del archivo

Agregar:

Historial de la evidencia

Ejemplo:

v2.0 — VIGENTE
v1.0 — SUSTITUIDA

Botón:

VER TRAZABILIDAD

En la zona inferior:

[ VALIDAR EVIDENCIA ]

[ OBSERVAR EVIDENCIA ]

==========================================================
7. PANTALLA 03 — OBSERVAR EVIDENCIA
==========================================================

Al pulsar:

OBSERVAR EVIDENCIA

abrir modal.

Título:

Registrar observación

Mostrar:

Actividad
Medio
Archivo
Versión
Docente

Campo obligatorio:

Observación *

Textarea.

Ejemplo demo:

"El documento cargado no permite comprobar completamente el desarrollo de la actividad. Revise el contenido y vuelva a cargar la evidencia correspondiente."

Botones:

Cancelar
CONFIRMAR OBSERVACIÓN

Antes de confirmar:

mostrar aviso:

"La evidencia quedará registrada como observada. El docente podrá reemplazarla mientras el plazo ordinario permanezca vigente."

Después:

estado = OBSERVADA

Mostrar confirmación:

"Evidencia observada correctamente."

Registrar:

usuario
fecha
hora
versión
texto de observación

Crear notificación para el docente.

==========================================================
8. PANTALLA 04 — VALIDAR EVIDENCIA
==========================================================

Al pulsar:

VALIDAR EVIDENCIA

abrir modal de confirmación.

Título:

Validar evidencia

Contenido:

"Confirme que ha revisado el archivo correspondiente a este medio de verificación."

Resumen:

Actividad
Medio
Archivo
Versión
Docente

Checkbox:

"Confirmo que he revisado esta evidencia."

Botones:

Cancelar
VALIDAR EVIDENCIA

No es necesario solicitar certificado .p12 para esta operación a menos que exista una regla institucional explícita.

No inventar firma electrónica para la validación de evidencias.

Después:

estado = VALIDADA

Registrar:

- revisor;
- fecha;
- hora;
- versión validada.

Mostrar:

"Evidencia validada correctamente."

==========================================================
9. PANTALLA 05 — ESTADO DE EVIDENCIA PARA EL DOCENTE
==========================================================

Actualizar la vista:

MIS EVIDENCIAS

Actualmente existen estados como:

CARGADA
PENDIENTE
PLAZO VENCIDO

Agregar:

PENDIENTE DE VALIDACIÓN
VALIDADA
OBSERVADA

Ejemplo:

ACTA
archivo_acta.pdf
OBSERVADA

[ VER OBSERVACIÓN ]
[ REEMPLAZAR ]

REEMPLAZAR solo aparece si:

- el usuario es responsable;
- el plazo sigue vigente.

Al pulsar VER OBSERVACIÓN:

abrir modal:

Observación del revisor

Mostrar:

Revisor
Fecha
Hora
Versión observada
Observación

### Si está validada

Mostrar:

VALIDADA

Validado por:
Ing. Carlos López, Mg.

Fecha:
07/09/2026 — 11:15

Si el plazo continúa vigente, mantener la posibilidad de reemplazo porque esa regla ya fue definida.

Pero mostrar una advertencia antes de reemplazar:

"Esta evidencia ya fue validada. Si reemplaza el archivo, la nueva versión deberá ser revisada nuevamente."

==========================================================
10. PANTALLA 06 — TRAZABILIDAD COMPLETA DE LA EVIDENCIA
==========================================================

Modal:

Trazabilidad y Auditoría de Evidencia

Ejemplo:

ACTA
Seguimiento al avance de trabajos de titulación

--------------------------------------

v2.0
VIGENTE
PENDIENTE DE VALIDACIÓN

07/09/2026 — 10:30
Cargado por: Andrea Pérez

--------------------------------------

v1.0
SUSTITUIDA
OBSERVADA

06/09/2026 — 15:40
Cargado por: Andrea Pérez

Observada:
06/09/2026 — 17:15

Por:
Carlos López

Observación:
"El documento no contiene..."

--------------------------------------

La auditoría debe soportar cronológicamente eventos como:

ARCHIVO CARGADO
ARCHIVO REEMPLAZADO
EVIDENCIA OBSERVADA
EVIDENCIA VALIDADA

No borrar eventos anteriores.

==========================================================
11. PANTALLA 07 — SEGUIMIENTO INSTITUCIONAL
==========================================================

Utilizar la opción existente:

SEGUIMIENTO

para crear una vista institucional destinada inicialmente al revisor.

Título:

Seguimiento de Planes de Trabajo

Mostrar información consolidada.

Tarjetas:

Planes en ejecución
Actividades en curso
Actividades vencidas
Evidencias pendientes de validación
Evidencias observadas
Evidencias validadas

Filtros:

Período
Grupo institucional
Docente
Plan
Estado

Tabla:

DOCENTE
GRUPO
PLAN
ACTIVIDADES
EVIDENCIAS CARGADAS
VALIDADAS
OBSERVADAS
VENCIDAS
ACCIÓN

No mostrar información mediante porcentajes exclusivamente.

Utilizar también cantidades reales:

7 de 10 actividades

8 de 12 evidencias cargadas

6 de 12 validadas

1 observada

Puede existir una barra de avance como apoyo visual.

==========================================================
12. PANTALLA 08 — DETALLE DE SEGUIMIENTO
==========================================================

Al pulsar:

VER SEGUIMIENTO

mostrar:

Plan de Trabajo
Docente
Grupo
Período
Versión

Resumen:

Actividades:
10

Con evidencias completas:
7

En ejecución:
2

Pendientes:
1

Vencidas:
1

Evidencias:
12 requeridas
10 cargadas
8 validadas
1 observada
2 pendientes de carga

Mostrar listado de actividades.

Cada actividad debe indicar:

- nombre;
- rango de ejecución;
- responsables;
- medios requeridos;
- cantidad cargada;
- cantidad validada;
- estado.

Ejemplo:

Seguimiento al avance de trabajos de titulación

2 medios requeridos
2 cargados
1 validado
1 pendiente de validación

No permitir modificar el Plan desde esta pantalla.

==========================================================
13. DISTINGUIR DOS CONCEPTOS
==========================================================

Este punto es MUY IMPORTANTE.

No utilizar:

"evidencias completas"

como sinónimo de:

"evidencias validadas".

Son conceptos diferentes.

Ejemplo:

Actividad A

2 de 2 archivos cargados
= EVIDENCIAS COMPLETAS

pero:

1 de 2 validados
= VALIDACIÓN INCOMPLETA

Mantener ambos indicadores separados.

No romper el comportamiento existente del Módulo 5.

==========================================================
14. SINCRONIZACIÓN REACTIVA
==========================================================

Todo debe utilizar UNA FUENTE DE VERDAD COMPARTIDA.

Cuando el revisor valida una evidencia:

PENDIENTE DE VALIDACIÓN
→
VALIDADA

debe actualizarse inmediatamente en:

- bandeja del revisor;
- detalle de evidencia;
- Mis Evidencias;
- detalle de actividad;
- Seguimiento;
- Dashboard correspondiente.

Cuando observa:

PENDIENTE DE VALIDACIÓN
→
OBSERVADA

también debe propagarse.

Cuando el docente reemplaza:

OBSERVADA
→
PENDIENTE DE VALIDACIÓN

La versión se incrementa.

NO requerir recargar la página.

==========================================================
15. PERSISTENCIA DEL PROTOTIPO
==========================================================

Actualmente el proyecto utiliza datos mock y algunos estados persistentes.

Para este módulo:

centralizar el estado de evidencias.

Preferiblemente crear:

useEvidenciasState

o extender correctamente:

useActividadesState

pero NO duplicar arrays de evidencias en múltiples componentes.

Si se utiliza localStorage para demostración:

- utilizar claves únicas;
- serializar las versiones;
- recuperar estados al recargar;
- manejar datos inexistentes;
- evitar sobrescribir información de otros módulos.

El prototipo debe seguir funcionando aunque localStorage esté vacío.

==========================================================
16. PERMISOS A NIVEL DE CÓDIGO
==========================================================

Implementar funciones equivalentes a:

puedeGestionarEvidencia(usuario, actividad)

puedeRevisarEvidencia(usuario, actividad)

No limitarse al renderizado visual.

Ejemplo:

Andrea
responsable de act-1
→ puede cargar/reemplazar.

Carlos
revisor asignado a Unidad de Titulación
→ puede revisar/validar/observar.

Andrea
no responsable de act-demo-carlos
→ solo lectura.

==========================================================
17. CAMBIO DE ROL DEMO
==========================================================

Mantener el selector de rol que ya existe para pruebas.

Docente:
Ing. Andrea Pérez, Mg.

Revisor:
Ing. Carlos López, Mg.

Al cambiar a Revisor:

SIDEBAR
TOPBAR
AVATAR
NOMBRE
ROL
PERMISOS
MENÚ

deben cambiar conjuntamente.

No repetir el error anterior donde el sidebar mostraba Carlos y el TopBar Andrea.

Marcar el cambio de rol como mecanismo DEMO si es necesario.

==========================================================
18. NOTIFICACIONES
==========================================================

Generar notificaciones internas demo cuando:

- una evidencia sea observada;
- una evidencia sea validada;
- una evidencia observada sea reemplazada;
- exista una evidencia próxima a vencer;
- venza una evidencia pendiente.

Ejemplos:

"Su evidencia 'Acta' fue observada por Ing. Carlos López, Mg."

"Su evidencia 'Informe' fue validada."

No implementar servicios externos de correo todavía.

==========================================================
19. DATOS DEMO MÍNIMOS
==========================================================

Preparar escenarios suficientes para probar:

A. Evidencia pendiente de validación.

B. Evidencia validada.

C. Evidencia observada.

D. Evidencia observada y posteriormente reemplazada.

E. Evidencia validada y posteriormente reemplazada.

F. Evidencia con plazo vencido.

G. Actividad con dos medios:
- uno validado;
- otro pendiente.

H. Actividad donde Andrea NO sea responsable.

I. Evidencia perteneciente a grupo que Carlos NO tenga asignado, para comprobar que no aparece en su bandeja.

==========================================================
20. PRUEBAS FUNCIONALES OBLIGATORIAS
==========================================================

Antes de considerar terminado el módulo probar:

PRUEBA 1
Revisor entra a Evidencias por validar.

Debe visualizar únicamente evidencias autorizadas.

PRUEBA 2
Abrir evidencia.

Debe visualizarse el archivo asociado.

PRUEBA 3
Validar evidencia.

Debe pasar inmediatamente a VALIDADA.

PRUEBA 4
Observar evidencia.

Debe exigir texto de observación.

PRUEBA 5
Volver a Docente.

Debe visualizar OBSERVADA.

PRUEBA 6
Reemplazar evidencia observada dentro del plazo.

Debe crear nueva versión y volver a PENDIENTE DE VALIDACIÓN.

PRUEBA 7
Consultar auditoría.

Deben aparecer ambas versiones y la observación histórica.

PRUEBA 8
Intentar reemplazar evidencia vencida.

Debe bloquearse.

PRUEBA 9
Intentar gestionar evidencia siendo usuario no responsable.

Debe bloquearse incluso a nivel de función.

PRUEBA 10
Validar uno de dos medios.

Debe mostrar:

2/2 cargados
1/2 validados

NO mostrar 2/2 validados.

PRUEBA 11
Cambiar Docente → Revisor.

TopBar y Sidebar deben mostrar el mismo usuario.

PRUEBA 12
Recargar navegador.

Los estados demo persistentes no deben corromperse ni volver arbitrariamente al estado inicial si existe persistencia configurada.

==========================================================
21. REQUISITOS TÉCNICOS
==========================================================

React:
respetar estrictamente Rules of Hooks.

NO colocar:

if (...) return ...

antes de hooks que puedan dejar de ejecutarse en otro render.

Todos:
useState
useMemo
useEffect
useCallback

deben mantener orden estable.

TypeScript:

npx tsc --noEmit

debe terminar con:

0 errores.

Build:

npm run build

debe finalizar correctamente.

No dejar:
- imports sin usar;
- errores de consola;
- warnings graves;
- referencias undefined;
- datos inconsistentes.

==========================================================
22. NO IMPLEMENTAR TODAVÍA
==========================================================

NO implementar en este módulo:

- administración general de usuarios;
- configuración DTIC;
- plazo extraordinario definitivo;
- calificaciones de docentes;
- ranking de docentes;
- evaluación numérica;
- penalizaciones automáticas;
- cierre administrativo definitivo;
- eliminación de historial;
- inteligencia artificial para revisar evidencias;
- procedimientos institucionales no confirmados.

==========================================================
23. CRITERIO DE FINALIZACIÓN
==========================================================

El Módulo 6 solo puede darse por terminado si funciona el ciclo completo:

DOCENTE
carga evidencia
↓
PENDIENTE DE VALIDACIÓN
↓
REVISOR
abre evidencia
↓
┌───────────────────┴────────────────────┐
│                                        │
VALIDAR                              OBSERVAR
│                                        │
VALIDADA                              OBSERVADA
                                         │
                                         ▼
                                    DOCENTE
                                    reemplaza
                                         │
                                         ▼
                                NUEVA VERSIÓN
                                         │
                                         ▼
                              PENDIENTE DE VALIDACIÓN

y toda la trazabilidad permanece disponible.

==========================================================
24. ENTREGA
==========================================================

Al terminar:

1. indicar archivos creados;
2. indicar archivos modificados;
3. listar pantallas implementadas;
4. listar reglas implementadas;
5. indicar cómo probar cada flujo;
6. indicar datos demo utilizados;
7. ejecutar:
   npx tsc --noEmit
8. ejecutar:
   npm run build
9. informar expresamente cualquier limitación real del prototipo.

NO declarar el módulo terminado si alguna de estas pruebas falla.