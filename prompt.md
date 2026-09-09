==========================================================
ALCANCE DE ESTA ETAPA — MUY IMPORTANTE
==========================================================

El sistema desarrollado actualmente NO corresponde todavía a la
implementación productiva definitiva.

Estamos construyendo:

MOCKUPS DE ALTA FIDELIDAD + PROTOTIPO NAVEGABLE E INTERACTIVO

cuyo objetivo es:

- validar requerimientos;
- validar flujos de usuario;
- validar navegación;
- validar estados;
- validar roles;
- validar permisos desde el punto de vista de UX;
- validar formularios;
- validar tablas;
- validar modales;
- validar mensajes;
- validar comportamiento visual;
- obtener capturas para documentación;
- presentar el funcionamiento propuesto al cliente/docente.

NO convertir esta etapa en el desarrollo completo del sistema real.

----------------------------------------------------------
QUÉ SÍ DEBE IMPLEMENTARSE
----------------------------------------------------------

Implementar únicamente la lógica necesaria para demostrar correctamente
el comportamiento del prototipo.

Por ejemplo:

- navegación entre pantallas;
- botones funcionales;
- formularios simulados;
- filtros visuales;
- búsqueda;
- selección de opciones;
- modales;
- drawers;
- cambio de roles DEMO;
- estados visuales;
- transiciones entre estados;
- datos mock;
- mensajes de validación;
- alertas;
- toasts;
- contadores reactivos;
- barras de progreso;
- simulación de carga de archivos;
- simulación de aprobación/rechazo;
- simulación de firma cuando corresponda;
- simulación de notificaciones;
- visualización de PDF;
- flujo completo entre pantallas.

Las interacciones deben sentirse reales y ser suficientes para recorrer
los casos de uso durante una demostración.

----------------------------------------------------------
QUÉ NO DEBE IMPLEMENTARSE TODAVÍA
----------------------------------------------------------

NO desarrollar infraestructura productiva que no sea necesaria para el
mockup.

No implementar salvo solicitud explícita:

- backend real;
- API REST real;
- servicios externos;
- base de datos real;
- autenticación productiva;
- autorización de servidor;
- almacenamiento real de documentos;
- almacenamiento cloud;
- envío real de emails;
- notificaciones push reales;
- firma criptográfica real;
- validación real de certificados .p12;
- integración real con IA;
- integración con DTIC;
- despliegue productivo;
- microservicios;
- caching;
- colas;
- WebSockets;
- auditoría backend;
- seguridad productiva;
- optimización prematura;
- pruebas end-to-end complejas;
- arquitectura empresarial innecesaria para el prototipo.

----------------------------------------------------------
DATOS Y ESTADO
----------------------------------------------------------

Utilizar DATOS MOCK coherentes y suficientemente completos para demostrar
todos los escenarios requeridos.

Preferir estado React simple y centralizado cuando sea necesario.

NO introducir localStorage, IndexedDB u otros mecanismos de persistencia
solo por intentar convertir el mockup en una aplicación real.

Si ya existe localStorage de módulos anteriores:

- no eliminarlo si rompería funcionalidades existentes;
- no ampliar su uso innecesariamente;
- no depender de él para demostrar las nuevas pantallas.

Que el prototipo vuelva a sus datos demo después de una recarga es
aceptable salvo que el requisito de la pantalla que estamos probando
necesite específicamente persistencia.

----------------------------------------------------------
ARQUITECTURA
----------------------------------------------------------

NO sobrearquitecturar.

Crear únicamente:

- componentes;
- tipos;
- mock data;
- estado;
- utilidades;

que sean necesarios para implementar correctamente las pantallas y sus
interacciones.

Evitar:

- capas innecesarias;
- abstracciones prematuras;
- refactors grandes;
- patrones empresariales innecesarios;
- sistemas de permisos excesivamente complejos;
- estructuras diseñadas para producción futura.

PRIORIDAD:

1. fidelidad al requerimiento;
2. claridad visual;
3. UX;
4. navegación;
5. consistencia entre pantallas;
6. facilidad para demostrar el flujo.

No priorizar arquitectura productiva sobre estos objetivos.

----------------------------------------------------------
DOCUMENTACIÓN GENERADA POR EL AGENTE
----------------------------------------------------------

NO dedicar tiempo excesivo a generar:

- implementation_plan.md extensos;
- walkthrough.md extensos;
- documentación técnica innecesaria;
- reportes internos del agente.

Puede realizar planificación interna breve si la necesita, pero el
objetivo principal es IMPLEMENTAR EL MOCKUP.

Al finalizar basta con informar:

1. pantallas creadas;
2. flujos disponibles;
3. datos demo importantes;
4. cómo probarlos;
5. limitaciones visuales o funcionales del prototipo.

----------------------------------------------------------
CALIDAD MÍNIMA DEL CÓDIGO
----------------------------------------------------------

Aunque sea un prototipo, evitar código roto.

Al finalizar ejecutar:

npx tsc --noEmit
npm run build

Deben finalizar correctamente.

Corregir también errores evidentes en consola que impidan utilizar el
prototipo.

Esto NO significa convertir el proyecto en una aplicación production-ready.

==========================================================


















AJUSTES FINALES DEL MÓDULO 7 — CONSISTENCIA FUNCIONAL

IMPORTANTE:

NO rediseñar el Módulo 7.
NO cambiar la paleta actual.
NO modificar sidebar, topbar, tarjetas, tablas, botones ni navegación.

La interfaz administrativa actual queda visualmente aprobada.

Realizar únicamente las siguientes correcciones de consistencia con los
requerimientos ya definidos.

==========================================================
1. USUARIOS — NO ASUMIR CÉDULA
==========================================================

Actualmente Gestión de Usuarios muestra:

CI: 180...
y el buscador indica:
"Buscar por nombre, correo o cédula..."

La cédula/identificación NO ha sido confirmada todavía como dato necesario
para este aplicativo.

Eliminar de los mockups administrativos:

- CI visible debajo del nombre;
- búsqueda por cédula;
- identificación obligatoria en formularios.

Mantener:

- nombres;
- apellidos;
- correo institucional;
- roles;
- grupos;
- estado.

No modificar otros datos de usuario.

==========================================================
2. IMPORTACIÓN — MENSAJE DE CREDENCIALES
==========================================================

Mantener la regla ya establecida:

Los usuarios nuevos tendrán una contraseña temporal y deberán cambiarla
en el primer inicio de sesión.

Pero NO afirmar que actualmente el prototipo envía correos reales.

Cambiar el mensaje final que actualmente dice:

"las credenciales temporales generadas se enviaron directamente..."

por un texto conceptual como:

"Los usuarios importados quedarán preparados para recibir sus
credenciales temporales mediante el mecanismo institucional que se
establezca. Las contraseñas no se muestran en pantalla."

El mockup NO debe simular que realmente se envió un correo.

==========================================================
3. ROL DENTRO DEL GRUPO
==========================================================

Evitar utilizar:

"Responsable / Coordinador"

como un único rol interno.

La palabra RESPONSABLE ya se utiliza para indicar responsables de una
actividad específica.

Para membresía del grupo utilizar:

- Miembro
- Coordinador

y, si es necesario:

- Otro

La responsabilidad de una actividad se configura posteriormente en la
Matriz de Actividades y es un concepto independiente.

Ejemplo:

Carlos López
Rol en el grupo:
Coordinador

NO:
Responsable / Coordinador

==========================================================
4. FLUJO DE APROBACIÓN — NO INVENTAR AUTORIDAD
==========================================================

En la etapa:

VALIDACIÓN FINAL

actualmente aparece:

"Aprobación y firma por la Subdirección o Decanato de la FISEI."

Esto NO está confirmado.

Cambiar por:

"Validación final por la autoridad institucional correspondiente."

o:

"Validación final por la autoridad configurada para este grupo."

La autoridad exacta debe ser configurable.

NO asumir automáticamente:

- Decanato;
- Subdecanato/Subdirección;
- Coordinación de carrera;
- otra autoridad concreta.

Asimismo:

El usuario Administrador NO debe participar automáticamente como
validador por el hecho de ser Administrador.

Laura Medina es usuario DEMO Administrador.

No asignarla automáticamente como autoridad final.

Puede mostrar:

"Autoridad correspondiente"

como dato DEMO/configurable hasta que la institución confirme la persona
o cargo exacto.

Mantener las reglas:

Elaboración
→ Revisión
→ Coordinación
→ Validación final

como flujo DEMO actual.

==========================================================
5. PLANTILLA DE PLAN DE TRABAJO — CORREGIR ESTRUCTURA
==========================================================

La pantalla Plantillas Documentales debe ser consistente con el Plan de
Trabajo que ya fue validado en módulos anteriores.

Actualmente el modal conceptual presenta una estructura distinta.

Para:

PLAN DE TRABAJO INSTITUCIONAL

mostrar conceptualmente estas partes:

1. Información institucional / Información general
   REQUERIDA

2. Justificación
   REQUERIDA

3. Objetivo
   REQUERIDO

4. Matriz de actividades
   REQUERIDA

La matriz incluye:

- Actividad
- Desde
- Hasta
- Responsable(s)
- Recursos
- Medios de verificación

NO crear "Medios de verificación" como una sección documental
independiente si ya forman parte de la matriz.

5. Anexos
   OPCIONAL

6. Firmas de responsabilidad
   REQUERIDA

7. Control de historial de cambios
   REQUERIDO

Utilizar exactamente el título institucional:

FIRMAS DE RESPONSABILIDAD

y:

CONTROL DE HISTORIAL DE CAMBIOS

Para este último recordar las columnas:

Versión
Descripción del Cambio
Fecha de Actualización

==========================================================
6. OBJETIVO
==========================================================

No utilizar:

"Objetivos generales"

El Plan actualmente utiliza un único campo:

OBJETIVO

Mantener:

Justificación
Objetivo

como dos elementos diferentes.

==========================================================
7. VERSIÓN DE PLANTILLA
==========================================================

No utilizar una versión ficticia:

v2.4

si no existe respaldo institucional para ese número.

Para el prototipo utilizar:

Versión de plantilla: 1.0

o marcar explícitamente:

1.0 — DEMO

No confundir:

versión de plantilla documental

con:

versión de un Plan de Trabajo.

Las versiones de Plan siguen utilizando:

1.0
2.0
3.0...

==========================================================
8. FORMATO DE FECHAS ADMINISTRATIVAS
==========================================================

Cuando resulte sencillo y sin afectar lógica existente, mostrar las fechas
al usuario en formato:

DD/MM/AAAA

Ejemplo:

01/07/2026

en lugar de:

2026-07-01

Los valores internos pueden permanecer en formato ISO.

Esto aplica visualmente a:

- Períodos académicos;
- feriados;
- ventanas de elaboración;
- ventanas de revisión.

==========================================================
NO MODIFICAR
==========================================================

Mantener tal como están:

- Panel de Administración;
- paleta actual;
- avatar morado del Administrador;
- Modo Administrador;
- Grupos institucionales;
- obligatoriedad de actividades;
- período configurable;
- reglas de secuencialidad;
- TODOS DEBEN APROBAR;
- regla de feriados;
- recursos;
- medios;
- estado DEMO de las otras plantillas;
- comportamiento temporal del mockup.

No desarrollar backend ni persistencia adicional.

==========================================================
VERIFICACIÓN
==========================================================

Al finalizar ejecutar:

npx tsc --noEmit

npm run build

No realizar refactors amplios.
No iniciar otro módulo.