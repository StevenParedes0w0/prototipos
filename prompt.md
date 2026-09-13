Lee COMPLETAMENTE antes de modificar cualquier archivo:

- AGENTS.md
- requirements.md
- implementation-status.md
- reporte.md o el último reporte de implementación disponible
- tests/document-engine.test.mjs
- playwright.config.ts
- tests/e2e/README.md
- todos los archivos existentes dentro de tests/e2e/
- la carpeta Documentos_guia únicamente cuando una prueba toque fidelidad documental

IMPORTANTE:
Este proyecto es un MOCKUP INTERACTIVO DE ALTA FIDELIDAD.

NO debes:
- convertirlo en una implementación productiva;
- agregar backend;
- agregar servicios externos;
- implementar criptografía real;
- integrar DTIC;
- agregar correo real;
- agregar almacenamiento remoto;
- sustituir las simulaciones DEMO existentes;
- reestructurar el motor documental si no es estrictamente necesario;
- cambiar reglas ya validadas solo para facilitar los tests;
- eliminar comportamiento correcto para hacer pasar Playwright;
- inventar requisitos institucionales.

La suite E2E principal ya existe y actualmente pasa 6/6.

El objetivo de esta nueva tarea NO es rehacer esos tests.
El objetivo es crear una SEGUNDA CAPA DE COBERTURA E2E sobre escenarios secundarios, casos límite, permisos negativos, administración e histórico.

==================================================
1. REGLA PRINCIPAL DE TRABAJO
==================================================

Primero audita la implementación actual contra estos escenarios.

Para cada escenario:

1. verifica si el comportamiento ya existe;
2. intenta automatizarlo con Playwright;
3. si la prueba revela que la aplicación ya funciona correctamente, conserva el comportamiento y agrega únicamente la prueba;
4. si la prueba revela un bug real respecto de requirements.md, corrige el bug;
5. agrega una prueba de regresión que demuestre la corrección;
6. no modifiques comportamiento correcto para adaptar la aplicación al test;
7. no debilites aserciones solo para conseguir PASS.

La aplicación debe ser la fuente de verdad funcional.
Playwright debe comprobarla, no condicionarla artificialmente.

==================================================
2. INFRAESTRUCTURA EXISTENTE
==================================================

Reutiliza la infraestructura ya implementada:

- Playwright 1.63.0
- Chromium
- Vite
- puerto estable 4173
- timezone America/Guayaquil
- locale es-EC
- viewport 1600x900
- screenshots
- video
- trace
- HTML report
- helpers existentes

No dupliques helpers si ya existe una función equivalente.

Si necesitas agregar selectores estables, prioriza:

- aria-label
- role
- accessible name
- data-testid solo cuando sea realmente necesario

Evita selectores basados en:
- índices arbitrarios
- nth-child frágiles
- clases Tailwind
- posición visual
- texto DEMO susceptible a cambiar si existe una alternativa semántica más estable

==================================================
3. NUEVA SUITE: COBERTURA SECUNDARIA
==================================================

Quiero ampliar la suite con los siguientes escenarios.

No es obligatorio que cada apartado sea un archivo independiente.
Agrúpalos de forma coherente.

--------------------------------------------------
ESCENARIO A — UNICIDAD DE PLANES
--------------------------------------------------

Validar de extremo a extremo la regla:

PLAN DE TRABAJO único por:

teacherId + groupId + periodId

Debe comprobarse:

A1.
Andrea + Comisión de Eventos Académicos + Julio–Diciembre 2026

debe detectar un Plan existente.

Debe mostrar:
- grupo;
- período;
- versión formal;
- ronda;
- estado;
- acción contextual coherente.

En el dataset actual debe poder mostrarse:
“Continuar corrección”
si el Plan está EN CORRECCIÓN.

A2.
Andrea + Unidad de Titulación + una combinación libre definida actualmente

debe permitir crear un nuevo borrador.

No hardcodees una combinación diferente si el dataset canónico ya define cuál es libre.

A3.
Después de crear ese Plan:
la misma combinación debe considerarse ocupada inmediatamente.

A4.
Un INFORME relacionado con el Plan NO debe bloquear la creación de un Plan.

A5.
Otro período no debe producir falso duplicado.

A6.
Otro grupo no debe producir falso duplicado.

A7.
Otro docente no debe producir falso duplicado.

A8.
Después de ejecutar:
“Restablecer documentos DEMO”

la colección debe volver exactamente al dataset canónico.

El documento creado durante el test debe desaparecer y una combinación que originalmente era libre debe volver a estar libre.

--------------------------------------------------
ESCENARIO B — MATRIZ / CAMPO “OTRO”
--------------------------------------------------

Reproducir exactamente el problema que ya fue corregido.

B1.
Abrir configuración de una actividad.

B2.
En Recursos:
marcar “Otro”.

B3.
Dejar vacío:
“Especifique el recurso”

B4.
Intentar:
“Guardar actividad”.

Debe suceder todo esto:

- el drawer NO se cierra;
- el documento NO avanza;
- aparece un error inline;
- el campo inválido recibe foco;
- los demás datos permanecen intactos.

B5.
Escribir un recurso personalizado válido.

El error debe desaparecer.

B6.
Repetir la misma lógica para:
Medios de verificación → Otro.

B7.
Un “Otro” vacío NO debe incrementar el contador de recursos o medios.

B8.
Una vez completado correctamente:
- estado COMPLETA;
- contador actualizado;
- botón Continuar habilitado.

--------------------------------------------------
ESCENARIO C — RESPONSABLES MÚLTIPLES
--------------------------------------------------

C1.
Abrir una actividad con tres integrantes disponibles.

C2.
Marcar:
“Seleccionar todos”.

Comprobar:

- todos los responsables quedan seleccionados;
- se conservan IDs individuales;
- la vista de revisión muestra los nombres individuales;
- el documento puede usar una denominación colectiva impresa cuando corresponda;
- esa denominación colectiva NO reemplaza internamente la trazabilidad individual.

C3.
Desmarcar uno.

“Seleccionar todos” debe reflejar correctamente el estado resultante.

C4.
Volver a marcar todos.

No deben aparecer:
- duplicados;
- responsables fantasma;
- IDs repetidos.

--------------------------------------------------
ESCENARIO D — FECHAS Y FERIADOS
--------------------------------------------------

Usar un período y feriados DEMO ya existentes.

No inventar nuevos feriados salvo que sea estrictamente necesario para el test y se definan claramente como fixtures de prueba.

D1.
Intentar iniciar una actividad en una fecha marcada como feriado.

Debe rechazarse.

D2.
Intentar terminar una actividad en una fecha marcada como feriado.

Debe rechazarse.

D3.
Crear una actividad donde exista un feriado ENTRE Desde y Hasta.

Debe permitirse.

D4.
La fecha Hasta debe seguir representando que la evidencia estará disponible hasta:
23:59 del día seleccionado.

D5.
Probar fechas ISO YYYY-MM-DD y comprobar que no exista desfase por timezone.

--------------------------------------------------
ESCENARIO E — AUTORIZACIONES NEGATIVAS
--------------------------------------------------

Este bloque es especialmente importante.

E1.
Andrea autenticada NO puede aprobar una etapa asignada a Carlos.

E2.
Carlos autenticado como Revisor NO puede firmar como Patricia.

E3.
Carlos en etapa de Revisión NO puede ejecutar anticipadamente Coordinación.

E4.
Patricia en Validación final NO debe poder actuar si las etapas anteriores aún no han concluido.

E5.
Un docente no responsable de una actividad NO puede cargar o reemplazar evidencia.

E6.
Un revisor no asignado NO puede validar evidencia.

E7.
Cambiar únicamente el contexto visual Docente/Revisor/Administrador NO debe cambiar la identidad autenticada.

E8.
Perfil debe continuar mostrando la persona autenticada real.

Cuando una acción esté bloqueada:
la UI no debe limitarse silenciosamente a deshabilitarla.

Debe existir una explicación accesible, mediante:
- texto;
- tooltip;
- title;
- aria-description;
- mensaje contextual;
o mecanismo equivalente.

Si actualmente un botón queda deshabilitado sin explicar por qué, considera esto una deficiencia UX y corrígelo de forma mínima.

--------------------------------------------------
ESCENARIO F — APROBACIÓN Y OBSERVACIONES
--------------------------------------------------

Este escenario debe proteger el bug que vimos manualmente.

F1.
Abrir un documento asignado a Carlos.

F2.
Comprobar que el documento realmente está:
EN REVISIÓN
y que la etapa actual corresponde a Carlos.

F3.
Verificar que antes de completar las condiciones necesarias:
APROBAR Y FIRMAR
puede estar bloqueado.

Debe existir una explicación observable de por qué.

F4.
Completar los aspectos requeridos de revisión.

F5.
Sin observaciones activas:
APROBAR Y FIRMAR debe habilitarse.

F6.
Registrar una observación.

Comprobar inmediatamente:

Observaciones (1)

F7.
Recargar la página.

Debe continuar:
Observaciones (1)

F8.
Abrir el documento nuevamente desde bandeja.

La observación debe seguir asociada a:
- documentId;
- formalVersion;
- round;
- page;
- author;
- status.

F9.
Con observación activa:
APROBAR Y FIRMAR debe permanecer bloqueado.

F10.
Devolver el documento.

F11.
Andrea debe ver:
- documento DEVUELTO / EN CORRECCIÓN según la vista;
- observación recibida;
- motivo de devolución;
- ronda original preservada.

F12.
Corregir y reenviar.

Debe iniciar:
Ronda 2

pero mantener:
Versión formal 1.0

F13.
Las firmas de la ronda anterior deben quedar históricas y no válidas para el artefacto corregido.

--------------------------------------------------
ESCENARIO G — FLUJO INCOMPLETO
--------------------------------------------------

Usar un grupo DEMO cuyo flujo permanezca intencionalmente incompleto.

Actualmente puede ser:
Club Académico de Software

si requirements.md y el dataset siguen definiéndolo así.

G1.
Crear o abrir Plan.

G2.
Llegar a Firma y Finalización.

G3.
Comprobar mensaje:

“El flujo de aprobación de este grupo aún no está completamente configurado.”

o equivalente vigente.

G4.
Firma/envío que requiere siguiente etapa no debe inventar responsable.

G5.
Documento NO debe pasar artificialmente a EN REVISIÓN.

G6.
La UI debe indicar que se requiere configuración administrativa.

--------------------------------------------------
ESCENARIO H — ADMINISTRACIÓN DE FLUJOS
--------------------------------------------------

Crear un smoke test funcional de Administración.

H1.
Entrar como Laura / Administrador DEMO.

H2.
Abrir configuración de flujos.

H3.
Abrir al menos dos grupos.

H4.
Confirmar que la configuración es POR GRUPO y no global.

H5.
Comprobar que:
Unidad de Titulación
puede tener un flujo completo.

H6.
Comprobar que:
Club Académico de Software
puede mantener un flujo incompleto.

H7.
No inventar actores faltantes.

Cuando un actor no esté definido:
debe conservarse como:
pendiente de configuración
o texto equivalente.

--------------------------------------------------
ESCENARIO I — CIERRE E HISTÓRICO
--------------------------------------------------

Automatizar el comportamiento DEMO ya definido.

I1.
Entrar a histórico/cierre.

I2.
Período activo Julio–Diciembre 2026 NO debe aparecer como cerrado ordinariamente.

I3.
Debe existir:
PROBAR CIERRE — DEMO

I4.
Al activarlo:
mostrar advertencia de simulación.

I5.
Después de confirmar:
estado CERRADO DEMO.

I6.
Los documentos del período deben quedar:
SOLO LECTURA.

I7.
No debe existir edición normal.

I8.
Debe existir:
RESTABLECER DEMO

I9.
RESTABLECER DEMO NO debe describirse como:
“reapertura institucional”.

Debe presentarse claramente como restauración de la simulación.

I10.
Verificar histórico de Enero–Junio 2026.

Comprobar al menos el caso canónico vigente:

- Plan FINALIZADO;
- período CERRADO;
- actividades y evidencias históricas;
- formal versioning separado de rondas;
- modo solo lectura.

No hardcodear cifras si el dataset canónico cambió legítimamente.
Usar los valores actuales definidos por fixtures.

--------------------------------------------------
ESCENARIO J — NOTIFICACIONES CONTEXTUALES
--------------------------------------------------

Crear un smoke test.

J1.
Entrar con un usuario que tenga notificaciones.

J2.
Abrir una notificación asociada a:
- Plan;
- evidencia;
o documento existente.

J3.
Comprobar que navega al objeto correcto.

J4.
No debe abrir otro Plan por depender de selectedDocument global.

J5.
El contador de sin leer debe actualizarse si el comportamiento actual lo contempla.

No convertir notificaciones DEMO en notificaciones reales.

--------------------------------------------------
ESCENARIO K — REPORTES
--------------------------------------------------

Crear smoke tests de los reportes actuales.

K1.
Abrir reportes como Docente.

K2.
Abrir reportes como Revisor/Administrador cuando corresponda.

K3.
Comprobar que se muestran estados documentales.

K4.
No deben aparecer conceptos prohibidos como:

- ranking de docentes;
- score individual;
- desempeño laboral;
- productividad individual;
- sanciones automáticas;
- predicciones;
- calificaciones del profesor.

K5.
Validar que:
evidencia completa
y
evidencia validada

se mantienen como conceptos diferentes.

K6.
Los previews o descargas DEMO deben seguir identificándose como DEMO cuando corresponda.

--------------------------------------------------
ESCENARIO L — REGRESIÓN VISUAL T2
--------------------------------------------------

Actualmente ya existe regresión visual T1.

Agregar al menos una prueba visual para T2.

Generar un Informe derivado de un Plan válido.

Capturar de forma estable:

- una página inicial/encabezado representativa;
- una página de contenido;
- página que contenga firmas si corresponde.

Validar:

- estructura institucional;
- título normalizado;
- ausencia de “INFORME DE: INFORME DE:”;
- ausencia de notas instructivas de plantilla;
- footer coherente;
- páginas calculadas desde artifact.pages;
- firmas ubicadas desde signatureSlots;
- ninguna dependencia de pageCount fijo.

NO modificar T2 solo para que coincida con un snapshot nuevo.

Primero inspecciona visualmente la implementación contra Documentos_guia.

Si detectas una desviación REAL:
corrige la aplicación y después genera el snapshot.

==================================================
4. REGRESIONES VISUALES
==================================================

Los snapshots existentes T1 son importantes.

No los actualices automáticamente al primer fallo.

Ante una diferencia:

1. inspecciona screenshot esperado;
2. inspecciona screenshot actual;
3. determina si el cambio es:
   a) mejora legítima;
   b) regresión;
   c) diferencia de rendering;
4. únicamente actualiza snapshots si la nueva representación es correcta respecto de Documentos_guia.

NO utilizar:
--update-snapshots

como solución automática.

==================================================
5. ESTADO DEMO Y AISLAMIENTO
==================================================

Todos los tests deben ser independientes.

Cada spec debe poder ejecutarse:
- sola;
- dentro de toda la suite;
- repetida;
sin depender del orden de ejecución.

Antes de cada escenario:
restaura o inicializa explícitamente el estado DEMO requerido.

No permitas dependencia accidental entre tests mediante localStorage.

Confirma particularmente que:

- Plan A no muta Plan B;
- Plan no muta Informe;
- Informe no muta Plan;
- evidencia no cambia versión formal del Plan;
- una devolución cambia ronda, no versión formal;
- reset DEMO realmente reinicia fixtures.

==================================================
6. NO REGRESAR FUNCIONES YA VALIDADAS
==================================================

Mientras trabajas, protege explícitamente:

- aislamiento multidocumento;
- targetDocId explícito;
- persona autenticada != contexto activo;
- firma DEMO temporal;
- contraseña no persistida;
- certificado no persistido;
- firma docente única;
- artefacto firmado inmutable;
- formalVersion independiente de reviewRound;
- revisores paralelos;
- siguiente etapa bloqueada hasta que todos aprueben;
- observaciones persistentes;
- cada medio = exactamente 1 PDF vigente;
- reemplazo de evidencia = nueva versión de evidencia;
- fecha de elaboración congelada;
- T1 dinámico;
- T2 dinámico;
- footer T1 una sola fila;
- footer sin línea horizontal superior;
- orientación por página;
- pageCount = pages.length;
- signatureSlots derivados de pages.

==================================================
7. MEJORAS DE TESTABILIDAD PERMITIDAS
==================================================

Puedes hacer cambios mínimos en UI si son necesarios para testabilidad o accesibilidad.

Ejemplos permitidos:

aria-label
aria-describedby
title
role
data-testid
mensajes de motivo de bloqueo
labels accesibles

NO usar la tarea como excusa para rediseñar componentes.

==================================================
8. ARCHIVOS E2E ESPERADOS
==================================================

Puedes reorganizar si existe una estructura mejor, pero idealmente crear o extender algo similar a:

tests/e2e/plan-uniqueness.spec.ts
tests/e2e/matrix-validation.spec.ts
tests/e2e/permissions.spec.ts
tests/e2e/admin-flow.spec.ts
tests/e2e/history-close.spec.ts
tests/e2e/notifications-reports.spec.ts
tests/e2e/t2-visual-regression.spec.ts

Reutiliza:
tests/e2e/helpers.ts

No copies grandes bloques de interacción entre specs.

==================================================
9. TESTS UNITARIOS / MOTOR
==================================================

Si durante la auditoría detectas lógica de dominio que sea mejor probar sin navegador, agrega también pruebas a:

tests/document-engine.test.mjs

Especialmente para:

- uniqueness key;
- review permissions;
- stage activation;
- holiday validation;
- round/version separation;
- evidence authorization;
- observation identity.

No dupliques innecesariamente el mismo nivel de comprobación.

El test E2E debe demostrar el comportamiento visible.
El test del motor debe proteger la regla de dominio.

==================================================
10. EJECUCIÓN FINAL OBLIGATORIA
==================================================

Al terminar ejecuta, EN ESTE ORDEN:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

npm run test:e2e

Si existe una suite secundaria separada:
ejecútala también explícitamente.

Después ejecuta nuevamente TODA la suite E2E completa para asegurar que los nuevos cambios no rompieron los seis escenarios anteriores.

El resultado aceptable es:

- TypeScript PASS
- Build PASS
- tests de motor PASS
- tests E2E anteriores PASS
- tests E2E nuevos PASS

No declares completado si existe un fallo real.

==================================================
11. SI PLAYWRIGHT ENCUENTRA UN BUG
==================================================

No ocultarlo.

Para cada bug encontrado durante los tests:

1. explica la causa raíz;
2. corrige la aplicación;
3. agrega regresión;
4. vuelve a ejecutar la suite afectada;
5. vuelve a ejecutar toda la suite.

Si un comportamiento depende de una decisión institucional pendiente:
NO inventes la regla.

Marca el escenario como:
PENDIENTE DE VALIDACIÓN INSTITUCIONAL

y comprueba únicamente que el mockup no inventa comportamiento.

==================================================
12. REPORTE FINAL
==================================================

Genera o actualiza un archivo:

reporte-e2e-secundario.md

Debe contener:

# Reporte E2E — Cobertura secundaria

## 1. Escenarios auditados

## 2. Bugs reales encontrados

Para cada bug:
- comportamiento observado;
- causa raíz;
- requisito afectado;
- corrección;
- test de regresión.

## 3. Nuevas pruebas implementadas

Indicar por escenario:
- archivo;
- qué comprueba;
- estado.

## 4. Cambios en la aplicación

Separar:
- cambios funcionales;
- cambios de accesibilidad/testabilidad;
- cambios documentales;
- cambios DEMO.

## 5. Regresión visual

Indicar:
- snapshots nuevos;
- snapshots modificados;
- razón de cada modificación.

## 6. Cobertura E2E total

Indicar:

- cantidad anterior de tests;
- cantidad nueva;
- total final;
- PASS/FAIL.

## 7. Pruebas de motor

Indicar nuevos casos añadidos.

## 8. Pendientes institucionales

Solo los reales.

## 9. Riesgos que todavía no tienen cobertura automática

No ocultarlos.

## 10. Resultado de comandos

Mostrar:

npx tsc --noEmit
npm run build
node --test tests/document-engine.test.mjs
npm run test:e2e

con resultado final.

==================================================
13. CRITERIO DE TERMINACIÓN
==================================================

No termines después de escribir los tests.

Debes:

AUDITAR
→ IMPLEMENTAR TESTS
→ EJECUTARLOS
→ DETECTAR BUGS
→ CORREGIR BUGS REALES
→ VOLVER A EJECUTAR
→ VALIDAR REGRESIONES
→ GENERAR REPORTE.

No modifiques funcionalidades sin motivo comprobable.

No hagas refactors cosméticos grandes.

No conviertas el mockup en producción.

Prioriza:

1. consistencia funcional;
2. reglas de dominio;
3. permisos;
4. persistencia;
5. trazabilidad;
6. ausencia de regresiones;
7. fidelidad documental;
8. accesibilidad/testabilidad;
9. estabilidad de los tests.

Por el chat responde de forma breve mientras trabajas.
No necesito narración paso a paso.
Solo interrúmpeme si existe una decisión institucional que realmente impida continuar.

Al finalizar, entrégame únicamente:
- resumen breve;
- número total de pruebas PASS;
- bugs encontrados y corregidos;
- pendientes reales;
- ruta del reporte-e2e-secundario.md.