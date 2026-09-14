# PASADA FOCALIZADA DE CORRECCIÓN INSTITUCIONAL Y FUNCIONAL
## Gestión Documental Académica FISEI — T1, T2, IA, catálogos institucionales, dashboard y plantillas configurables

Quiero que realices una intervención focalizada sobre el mockup interactivo actual.

Esta tarea NO es una nueva auditoría general del proyecto.
NO quiero refactors arquitectónicos oportunistas.
NO quiero reconstruir componentes que ya funcionan.
NO quiero convertir el mockup en un sistema productivo.

El objetivo es resolver SEIS hallazgos concretos identificados durante la revisión manual de aproximadamente 110 capturas del sistema y al contrastar la implementación con los documentos institucionales de referencia.

============================================================
0. CONTEXTO Y REGLA GENERAL
============================================================

El proyecto es un:

MOCKUP INTERACTIVO DE ALTA FIDELIDAD

Stack actual:
- React
- TypeScript
- Vite
- Playwright
- estado/persistencia DEMO
- motor documental propio

Ya existe una suite estable de aproximadamente:

19 E2E PASS / 0 FAIL
+
tests del motor PASS
+
TypeScript PASS
+
Build PASS
+
snapshots T1/T2 PASS

DEBES PRESERVAR ESA ESTABILIDAD.

No se permite resolver estos hallazgos rompiendo funcionalidades previamente estabilizadas.

============================================================
1. FUENTES QUE DEBES REVISAR ANTES DE MODIFICAR CÓDIGO
============================================================

Lee completamente, en este orden:

1. AGENTS.md
2. requirements.md
3. implementation-status.md
4. reporte-correcciones-post-reunion.md
5. reporte-e2e-secundario.md
6. tests/document-engine.test.mjs
7. playwright.config.ts
8. tests/e2e/README.md
9. tests/e2e/helpers.ts
10. todos los specs E2E existentes relacionados con:
    - T1
    - T2
    - firma
    - responsables
    - administración
    - plantillas
    - IA
    - revisión
11. carpeta Documentos_guia completa

Debes revisar de forma ESPECIAL:

Documentos_guia/TI-JD2026-UTIT-PLAN-V01-signed.pdf

Este documento es una REFERENCIA REAL de cómo debe verse el Plan de Trabajo.

También revisar:

Documentos_guia/UTA-SGC-A-2-1-P7-T2 Formato Informe (1).docx

Este documento es la referencia institucional del Informe T2.

Si existen otras versiones T1/T2 posteriores dentro de Documentos_guia, determina cuál es la más reciente y documenta la decisión.

NO inventes formato documental.

============================================================
2. FUNCIONES YA ESTABLES QUE NO DEBES ROMPER
============================================================

Preservar explícitamente:

- identidad autenticada separada del contexto;
- currentUser separado de activeContext;
- cambio de sesión DEMO explícito;
- unicidad del Plan por:
  teacherId + groupId + periodId;
- formalVersion separada de reviewRound;
- ronda 2 sin convertir automáticamente el Plan en versión 2.0;
- artifactHistory;
- artefactos firmados inmutables;
- targetDocId explícito;
- aislamiento Plan ↔ Informe;
- revisión paralela;
- Coordinación posterior a revisores obligatorios;
- Validación final;
- observaciones;
- Resaltar y observar;
- anchors normalizados;
- firma DEMO;
- flujo incompleto del Club;
- responsables colectivos;
- responsableIds individuales;
- responsableNames individuales;
- denominación colectiva de presentación;
- feriados;
- regla de 23:59;
- anexos;
- evidencias;
- exactamente un PDF vigente por medio;
- reemplazo de evidencia;
- versionado independiente de evidencia;
- período cerrado = solo lectura;
- histórico;
- notificaciones;
- reportes sin rankings ni evaluación de personal;
- footer T1;
- portada T1;
- pageCount dinámico;
- signatureSlots dinámicos;
- snapshots visuales existentes.

NO reintroduzcas mocks paralelos.
NO dupliques fuentes de verdad.
NO hardcodees documentos o usuarios para hacer pasar pruebas.

============================================================
3. OBJETIVOS DE ESTA PASADA
============================================================

Resolver únicamente estos SEIS bloques:

A. Bug del asistente IA al aplicar sugerencias.
B. Corregir encabezado institucional T1 según PDF firmado.
C. Implementar selección Unidad académica / administrativa y catálogo configurable por Administración.
D. Corregir T2 funcional y documentalmente según plantilla oficial.
E. Convertir Panel General de Administración en un dashboard útil.
F. Implementar realmente el configurador drag-and-drop de plantillas documentales.

Cada bloque debe:
- auditar estado actual;
- reproducir el comportamiento;
- corregir solo lo necesario;
- incorporar E2E/regresión;
- preservar comportamiento previo.

============================================================
A. BUG DEL ASISTENTE DE IA
============================================================

PROBLEMA CONFIRMADO MANUALMENTE:

Los asistentes de:

- Mejorar redacción
- Mejorar objetivo
- y equivalentes en Informe

sí generan una sugerencia.

PERO:

al pulsar APLICAR,
la sugerencia NO rellena/reemplaza correctamente el campo de texto correspondiente.

Esto es un bug funcional.

------------------------------------------------------------
A1. COMPORTAMIENTO ESPERADO
------------------------------------------------------------

El flujo debe ser:

Texto original
→ solicitar sugerencia
→ mostrar propuesta
→ usuario elige:

APLICAR
o
DESCARTAR

APLICAR debe:

1. identificar exactamente qué campo originó la solicitud;
2. copiar la propuesta al campo correcto;
3. actualizar estado React;
4. activar autosave normal;
5. actualizar contador de palabras si existe;
6. actualizar estado de completitud;
7. persistir tras recarga;
8. NO modificar otros campos.

DESCARTAR debe:

- cerrar propuesta;
- conservar exactamente el texto original.

------------------------------------------------------------
A2. CAMPOS A AUDITAR
------------------------------------------------------------

T1:
- Justificación
- Objetivo

T2:
- Antecedentes
- conclusiones
- oportunidades
- cualquier otro campo que actualmente tenga helper de redacción

No hardcodear un único textarea.

Crear una abstracción razonable si actualmente existen handlers duplicados.

Ejemplo conceptual:

applySuggestion(targetFieldId, suggestion)

pero utiliza la arquitectura existente.

------------------------------------------------------------
A3. SEGURIDAD DE ESTADO
------------------------------------------------------------

Evitar bugs como:

- sugerencia de Justificación aplicada en Objetivo;
- sugerencia T2 aplicada en T1;
- aplicar después de cambiar de documento;
- suggestion stale;
- closure antigua;
- textareas uncontrolled que no reciben el nuevo valor;
- state local separado de draft;
- autosave escribiendo el valor anterior.

------------------------------------------------------------
A4. E2E IA
------------------------------------------------------------

Crear algo similar a:

tests/e2e/ai-writing-assistant.spec.ts

Escenario mínimo T1:

1. reset DEMO;
2. crear Plan;
3. ir a Contenido;
4. escribir:
   "texto inicial"
5. pulsar Mejorar redacción;
6. esperar sugerencia DEMO;
7. APLICAR;
8. comprobar:
   textarea != "texto inicial";
9. comprobar que contiene la sugerencia;
10. recargar;
11. comprobar persistencia.

Después:

12. generar sugerencia para Objetivo;
13. DESCARTAR;
14. comprobar que Objetivo mantiene el valor original.

Agregar al menos una comprobación equivalente en T2.

============================================================
B. CORREGIR ENCABEZADO T1 SEGÚN PDF FIRMADO
============================================================

REFERENCIA PRINCIPAL:

Documentos_guia/TI-JD2026-UTIT-PLAN-V01-signed.pdf

El encabezado actual del T1 mejoró, pero su estructura todavía NO coincide suficientemente con el documento real.

------------------------------------------------------------
B1. PROBLEMA ACTUAL
------------------------------------------------------------

Actualmente se representa aproximadamente:

Unidad académica / administrativa | Facultad...
Carrera                           | Ingeniería de Software
Fecha de elaboración             | ...

Sin embargo, en el PDF firmado la Facultad y la Carrera forman parte del mismo bloque/celda de información institucional.

NO debe existir una fila visual independiente para Carrera si el documento de referencia no la tiene de esa manera.

------------------------------------------------------------
B2. ESTRUCTURA ESPERADA
------------------------------------------------------------

Debes reproducir la estructura del PDF firmado lo más fielmente posible.

La celda asociada a:

Unidad académica / administrativa

debe contener la información institucional correspondiente, incluyendo:

Facultad de Ingeniería en Sistemas, Electrónica e Industrial
Carrera de Software

o la nomenclatura vigente del documento de referencia.

Después:

Fecha de elaboración

debe aparecer en su fila correspondiente.

IMPORTANTE:

No interpretes esto como concatenar arbitrariamente texto.

Reproduce:
- distribución;
- bordes;
- combinaciones de celdas;
- alturas;
- alineación;
- jerarquía;
- tipografía;
- logo;
- gris/azul institucional

según el PDF real.

------------------------------------------------------------
B3. PORTADA CENTRAL
------------------------------------------------------------

Audita también que la carátula T1 muestre correctamente:

UNIVERSIDAD TÉCNICA DE AMBATO

UNIDAD ACADÉMICA / ADMINISTRATIVA:
<valor>

CARRERA:
<valor, cuando aplique>

PLAN DE TRABAJO DE:
<grupo>

PERÍODO:
<período>

Si el ejemplo firmado separa visualmente Facultad y Carrera en la portada:
respétalo.

NO empujes otra vez el bloque central hacia abajo.

Debe continuar equilibrado alrededor del centro vertical.

------------------------------------------------------------
B4. NO ROMPER FOOTER
------------------------------------------------------------

Mantener EXACTAMENTE el comportamiento actual validado:

izquierda:
Documento de uso interno controlado por la Universidad Técnica de Ambato

centro:
Formato Nº: UTA-SGC-A-2-1-P7-T1

derecha:
número dinámico de página

una sola fila

SIN border-top
SIN hr

------------------------------------------------------------
B5. VISUAL REGRESSION
------------------------------------------------------------

La modificación del encabezado T1 probablemente cambiará snapshots.

NO ejecutar:

--update-snapshots

automáticamente.

Primero:
- comparar contra PDF firmado;
- confirmar que el cambio es una mejora legítima;
- actualizar únicamente los snapshots T1 afectados.

Documentar qué snapshot cambió y por qué.

============================================================
C. UNIDAD ACADÉMICA / ADMINISTRATIVA CONFIGURABLE
============================================================

Este requerimiento fue mencionado explícitamente durante reunión.

Actualmente:

“Unidad académica / administrativa”

se maneja demasiado como un texto fijo.

La solución debe permitir definir correctamente:

TIPO DE UNIDAD

y

UNIDAD

desde catálogos administrativos.

------------------------------------------------------------
C1. MODELO DEMO
------------------------------------------------------------

Separar conceptualmente:

unitType:
ACADEMIC
ADMINISTRATIVE

institutionalUnitId

institutionalUnitName

careerId opcional

careerName opcional

NO mezclar esta entidad con:

Grupo institucional
(Comisión, Unidad, Club, Otro)

Son conceptos diferentes.

------------------------------------------------------------
C2. ADMINISTRACIÓN
------------------------------------------------------------

Agregar un catálogo administrativo claramente identificable, por ejemplo:

Unidades académicas y administrativas

El Administrador debe poder DEMOSTRAR:

- listar;
- crear;
- editar;
- activar/desactivar;
- seleccionar tipo:
  Académica
  Administrativa

Para una unidad académica:
puede tener asociadas carreras.

Para una administrativa:
no exigir carrera.

No implementar backend.

Usar estado DEMO existente.

------------------------------------------------------------
C3. WIZARD T1
------------------------------------------------------------

En Información general:

Tipo de unidad *
[ Unidad académica ▼ ]

Unidad *
[ Facultad de Ingeniería en Sistemas, Electrónica e Industrial ▼ ]

Carrera *
[ Software ▼ ]

Cuando se seleccione:

Unidad administrativa

Carrera debe:

- ocultarse;
o
- quedar como No aplica,

según mejor coherencia UX.

NO pedir carrera obligatoria a una unidad administrativa.

------------------------------------------------------------
C4. WIZARD T2
------------------------------------------------------------

El Informe debe consumir la misma fuente institucional.

NO crear un catálogo T2 independiente.

------------------------------------------------------------
C5. DOCUMENTOS GENERADOS
------------------------------------------------------------

T1/T2 deben renderizar:

Unidad académica:
<valor>

o

Unidad administrativa:
<valor>

según la selección.

Evitar imprimir siempre:

Unidad académica / administrativa:

si ya conocemos el tipo concreto.

EXCEPCIÓN:

Si el formato institucional oficial exige literalmente ese rótulo genérico en el encabezado,
conservar el rótulo de la plantilla pero insertar correctamente el valor.

Distingue:
modelo funcional
vs
texto fijo de plantilla.

------------------------------------------------------------
C6. E2E
------------------------------------------------------------

Crear algo como:

tests/e2e/institutional-units.spec.ts

Probar:

1. Administrador crea unidad académica DEMO;
2. asocia carrera;
3. Andrea crea Plan;
4. selecciona esa unidad;
5. carrera aparece;
6. PDF la refleja.

Luego:

7. Administrador crea/usa unidad administrativa;
8. Andrea la selecciona;
9. carrera no se exige;
10. PDF refleja correctamente la selección.

También comprobar:
- opción desactivada no aparece en nuevo documento;
- documento existente conserva su valor histórico aunque luego la opción administrativa sea desactivada.

============================================================
D. CORREGIR INFORME T2
============================================================

Este es uno de los bloques más importantes.

REFERENCIA:

Documentos_guia/UTA-SGC-A-2-1-P7-T2 Formato Informe (1).docx

La implementación actual del T2 tiene avances funcionales, pero todavía existen errores de fidelidad y validación.

NO reutilices ciegamente el layout T1.

T1 y T2 comparten algunos elementos institucionales, pero NO tienen exactamente la misma estructura.

------------------------------------------------------------
D1. TÍTULO DUPLICADO
------------------------------------------------------------

PROBLEMA:

Actualmente puede aparecer:

INFORME DE: INFORME DE SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Eso es incorrecto.

El modelo debe guardar el contenido semántico:

Seguimiento de actividades de titulación

y el renderer agrega UNA sola vez:

INFORME DE:
SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Centraliza la normalización.

Debe aceptar entradas legacy como:

"Informe de seguimiento de actividades"

y normalizar sin duplicar.

E2E obligatorio.

------------------------------------------------------------
D2. ENCABEZADO T2
------------------------------------------------------------

Reproduce el encabezado de la plantilla T2.

NO reutilizar automáticamente:

Plan de Trabajo / Carrera / estructuras exclusivas de T1.

La plantilla T2 contiene conceptualmente:

UNIVERSIDAD TÉCNICA DE AMBATO
INFORME DE: ...
Unidad académica / administrativa:
Fecha de elaboración:

Respeta:
- celdas;
- bordes;
- gris;
- alineación;
- logo;
- alturas.

Si Carrera no forma parte del header T2 oficial:
NO agregarla solo porque T1 la tenga.

------------------------------------------------------------
D3. INFORME DERIVADO DE PLAN
------------------------------------------------------------

Existe actualmente un bug/deficiencia visual:

Puede seleccionarse:

Derivado de un Plan de Trabajo

pero continuar sin seleccionar realmente un Plan relacionado.

Eso NO debe permitirse.

Cuando modo === DERIVED:

relatedPlanId es obligatorio.

Sin Plan:
- mostrar error;
- impedir Continuar.

------------------------------------------------------------
D4. PLANES ELEGIBLES
------------------------------------------------------------

Mostrar únicamente Planes que cumplan reglas canónicas actuales:

- pertenecen al usuario actual cuando corresponda;
- VALIDADO o EN EJECUCIÓN según requirements;
- no usar Planes ajenos;
- no usar un Informe;
- no usar Plan inválido.

No inventar condiciones institucionales nuevas.

------------------------------------------------------------
D5. IMPORTACIÓN
------------------------------------------------------------

Después de seleccionar un Plan derivado:

importar automáticamente al T2:

- actividades;
- medios de verificación;
- referencias necesarias;
- metadatos institucionales;
- período;
- grupo cuando corresponda.

NO compartir referencias mutables con el Plan.

Debe existir copia/derivación aislada.

Crear/firmar/editar T2 nunca modifica el Plan.

------------------------------------------------------------
D6. TABLA DE ACTIVIDADES
------------------------------------------------------------

Si el Informe es derivado:

la Tabla 1 debe mostrar las actividades del Plan.

No puede llegar vacía si el Plan tiene actividades.

Para cada actividad revisar la plantilla oficial y renderizar únicamente los campos institucionalmente previstos.

Si el Informe es INDEPENDIENTE:

no mostrar una Tabla 1 vacía fingiendo derivación.

Seguir lo indicado por la plantilla/documentación:
el desarrollo independiente debe seguir la modalidad prevista.

------------------------------------------------------------
D7. SECCIONES T2
------------------------------------------------------------

Auditar contra la plantilla oficial:

1. Información General
2. Antecedentes
3. Desarrollo de Actividades
4. Conclusiones y Oportunidades
5. Registro de Contactos
6. Anexos
7. Previsualización
8. Firma y Finalización

Confirmar que ninguna nota instructiva de la plantilla se imprime como contenido real.

------------------------------------------------------------
D8. CONTACTOS
------------------------------------------------------------

Auditar:
- estructura;
- títulos;
- columnas;
- representación;
- vacíos;
- no imprimir placeholders instructivos.

------------------------------------------------------------
D9. FIRMAS T2
------------------------------------------------------------

Las firmas deben derivarse de:

signatureSlots

y del flujo configurado.

NO usar páginas hardcodeadas.

NO asumir:
Página 5

Usar:

artifact.pages.length
signatureSlots

------------------------------------------------------------
D10. HISTORIAL T2
------------------------------------------------------------

CONTROL DE HISTORIAL DE CAMBIOS

debe respetar la plantilla T2.

No inventar entradas.

------------------------------------------------------------
D11. FOOTER T2
------------------------------------------------------------

Usar:

Formato Nº: UTA-SGC-A-2-1-P7-T2

página dinámica.

Revisar disposición contra DOCX.

------------------------------------------------------------
D12. E2E T2
------------------------------------------------------------

Extender o crear:

tests/e2e/t2-derived-validation.spec.ts

Probar:

A.
Seleccionar Derivado
sin Plan
→ Continuar bloqueado.

B.
Seleccionar Plan válido
→ actividades importadas.

C.
Previsualización
→ título no duplicado.

D.
Header coincide estructuralmente con T2.

E.
Tabla de actividades contiene datos.

F.
Crear/firmar T2.

G.
Volver al Plan.

H.
Plan conserva:
- estado
- firmas
- versión
- ronda
- actividades

sin modificación.

------------------------------------------------------------
D13. SNAPSHOTS T2
------------------------------------------------------------

Como el layout va a cambiar:

NO actualizar snapshots automáticamente.

Contrastar con DOCX.

Actualizar solo:
- portada/header;
- contenido;
- firmas

si el cambio es correcto.

Documentar cada diferencia.

============================================================
E. DASHBOARD REAL DE ADMINISTRACIÓN
============================================================

Actualmente:

Panel General

ya contiene tarjetas como:

- usuarios activos;
- grupos;
- período;
- flujos;

pero se comporta más como portada/configuración que como un dashboard operativo.

Quiero mejorarlo SIN convertirlo en sistema de BI.

------------------------------------------------------------
E1. OBJETIVO
------------------------------------------------------------

El Dashboard debe responder visualmente:

¿Qué está ocurriendo en Gestión Documental ahora mismo?

Sin:
- rankings;
- productividad;
- scores;
- evaluación docente;
- predicciones;
- sanciones.

------------------------------------------------------------
E2. MÉTRICAS SUGERIDAS
------------------------------------------------------------

Con datos DEMO actuales:

Documentos
- Borradores
- En revisión
- En corrección
- Validados
- En ejecución

Evidencias
- Pendientes de validación
- Observadas
- Validadas

Configuración
- Flujos configurados
- Flujos pendientes

Período
- período activo;
- fecha/estado;
- próximos eventos si existen.

Auditoría
- actividad reciente documental
  SIN mostrar datos sensibles innecesarios.

------------------------------------------------------------
E3. DISEÑO
------------------------------------------------------------

Mantener:

azul institucional
verde éxito
ámbar advertencia
rojo solo para error/destructivo
grises neutrales

No introducir morado dominante.

Usar:
- cards;
- contadores;
- pequeños indicadores;
- quizá una gráfica simple si ya existe infraestructura;

pero NO sobrecargar.

Preferir conteos a porcentajes.

------------------------------------------------------------
E4. INTERACCIÓN
------------------------------------------------------------

Cuando sea razonable:

clic en
“3 En revisión”
→ filtra/navega a documentos En revisión.

clic en
“2 evidencias pendientes”
→ lleva a seguimiento/validación correspondiente.

No es obligatorio si implica complejidad excesiva, pero sí deseable.

------------------------------------------------------------
E5. E2E
------------------------------------------------------------

Crear smoke:

tests/e2e/admin-dashboard.spec.ts

Comprobar:
- cards visibles;
- conteos coherentes con fixtures;
- sin conceptos prohibidos;
- links principales no llevan a pantallas incorrectas.

============================================================
F. CONFIGURADOR DRAG-AND-DROP DE PLANTILLAS
============================================================

PROBLEMA ACTUAL:

Administración → Plantillas documentales → CONFIGURAR

actualmente solo permite VER la estructura.

No existe configuración real por arrastre.

Se solicitó poder ordenar/configurar secciones.

Necesitamos implementarlo como funcionalidad DEMO de alta fidelidad.

NO construir un diseñador de PDFs completo.

------------------------------------------------------------
F1. OBJETIVO UX
------------------------------------------------------------

Abrir:

Administración
→ Plantillas documentales
→ T1 o T2
→ CONFIGURAR

Debe mostrar:

“Configurar plantilla”

con una lista de secciones.

Ejemplo:

⋮⋮ Información general
    REQUERIDA
    Bloqueada

⋮⋮ Justificación
    REQUERIDA

⋮⋮ Objetivo
    REQUERIDA

⋮⋮ Matriz de actividades
    REQUERIDA

⋮⋮ Anexos
    OPCIONAL

⋮⋮ Firmas
    INSTITUCIONAL / BLOQUEADA

⋮⋮ Historial
    INSTITUCIONAL / BLOQUEADA

------------------------------------------------------------
F2. DRAG-AND-DROP
------------------------------------------------------------

Implementar drag-and-drop para las secciones permitidas.

Usar una solución liviana ya compatible con el proyecto.

Antes de agregar una nueva dependencia:
revisa package.json.

Si ya existe una librería:
reutilízala.

Si no:
puedes implementar HTML5 drag/drop o una dependencia pequeña y justificada.

NO introducir una dependencia enorme para esto.

------------------------------------------------------------
F3. BLOQUES BLOQUEADOS
------------------------------------------------------------

No todo debe ser movible.

Los elementos institucionalmente rígidos deben aparecer bloqueados.

Por ejemplo:

- encabezado;
- footer;
- firmas;
- historial

según lo que permita cada formato.

No permitas que el administrador destruya el documento oficial.

------------------------------------------------------------
F4. PROPIEDADES
------------------------------------------------------------

Cada sección puede tener, según corresponda:

Estado:
- Requerida
- Opcional
- Condicional

Visibilidad:
- Activa

Orden:
- drag/drop

No permitir desactivar una sección institucional obligatoria.

------------------------------------------------------------
F5. VISTA PREVIA
------------------------------------------------------------

Agregar una pequeña vista previa o representación de orden.

NO hace falta renderizar PDF en tiempo real si complica excesivamente.

Puede ser:

Vista previa de estructura

1. Información general
2. Justificación
3. Objetivo
4. Matriz
5. Anexos
6. Firmas
7. Historial

Actualizada después del drag.

------------------------------------------------------------
F6. GUARDAR
------------------------------------------------------------

Botones:

Cancelar
Restaurar predeterminado
Guardar configuración

Al guardar:
- persistir estado DEMO;
- cerrar modal;
- mostrar confirmación.

NO modificar documentos firmados existentes.

La configuración se aplica únicamente a nuevos borradores/documentos generados posteriormente.

------------------------------------------------------------
F7. T1/T2
------------------------------------------------------------

Mantener configuraciones separadas:

T1
T2

Modificar T1 no debe cambiar T2.

------------------------------------------------------------
F8. E2E DRAG
------------------------------------------------------------

Crear:

tests/e2e/template-builder.spec.ts

Probar:

1. entrar como Admin;
2. Plantillas;
3. Configurar T1;
4. capturar orden inicial;
5. arrastrar una sección movible;
6. verificar nuevo orden;
7. guardar;
8. cerrar/reabrir;
9. orden persiste;
10. Restaurar predeterminado;
11. orden vuelve al original.

Además:

12. intentar mover bloque bloqueado;
13. comprobar que no cambia.

14. Configurar T2;
15. comprobar que orden T2 es independiente.

------------------------------------------------------------
F9. APLICACIÓN EN DOCUMENTO
------------------------------------------------------------

IMPORTANTE:

No basta con mover tarjetas solo visualmente.

Si la configuración actual del motor documental permite que el orden controle realmente el documento generado, conecta el builder con esa configuración.

Si hacerlo contradice el formato institucional rígido:

NO inventes libertad absoluta.

En ese caso:
- permite ordenar únicamente las secciones realmente configurables;
- documenta los límites.

El mockup debe demostrar configuración real sin falsificar que todo el formato es editable.

============================================================
4. HALLAZGOS ADICIONALES RELACIONADOS
============================================================

Si mientras trabajas encuentras un bug DIRECTAMENTE relacionado con A–F:

- corrígelo;
- agrega regresión;
- documenta.

Si encuentras algo no relacionado:

NO amplíes el alcance.

Añádelo a:
“HALLAZGOS PENDIENTES”

en el reporte.

============================================================
5. PRUEBAS OBLIGATORIAS
============================================================

Al finalizar ejecutar EN ESTE ORDEN:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

Ejecutar individualmente cada spec nuevo:

npx playwright test tests/e2e/ai-writing-assistant.spec.ts

npx playwright test tests/e2e/institutional-units.spec.ts

npx playwright test tests/e2e/t2-derived-validation.spec.ts

npx playwright test tests/e2e/admin-dashboard.spec.ts

npx playwright test tests/e2e/template-builder.spec.ts

y cualquier spec adicional nuevo.

Después:

npm run test:e2e

Toda la suite debe pasar.

La suite actual tiene alrededor de:

19 E2E

No reportes números inventados.

Reporta el número real final.

============================================================
6. VISUAL REGRESSION
============================================================

T1 y T2 tienen snapshots.

Ante fallo:

NO hacer automáticamente:
--update-snapshots

Primero inspeccionar.

Solo actualizar si:

- la modificación proviene de una corrección institucional confirmada;
- el nuevo resultado coincide mejor con Documentos_guia.

Documentar:
- snapshot anterior;
- snapshot nuevo;
- razón.

============================================================
7. ACCESIBILIDAD Y TESTABILIDAD
============================================================

Puedes añadir únicamente lo necesario:

aria-label
aria-describedby
role
title
data-testid

Ejemplos:

data-testid="ai-suggestion-apply"
data-testid="institutional-unit-type"
data-testid="institutional-unit-select"
data-testid="career-select"
data-testid="template-section-justification"
data-testid="template-drag-handle"
data-testid="admin-dashboard"

No contaminar toda la UI.

============================================================
8. NO HACER
============================================================

NO backend.

NO PostgreSQL.

NO Firebase.

NO Supabase.

NO AWS.

NO API real de IA.

NO S3.

NO autenticación productiva.

NO firma criptográfica.

NO QR.

NO hash ficticio.

NO editor PDF real.

NO canvas gráfico complejo.

NO diseñador WYSIWYG completo.

NO ranking de docentes.

NO desempeño laboral.

NO predicciones.

NO inventar normas institucionales.

NO reescribir arquitectura estable.

NO cambiar colores globales.

============================================================
9. DOCUMENTACIÓN
============================================================

Actualizar:

implementation-status.md

Crear:

reporte-pasada-focalizada-ui-documentos.md

Debe incluir:

# Reporte — Pasada focalizada UI y documentos

## 1. Fuentes institucionales revisadas

Indicar:
- PDF T1 firmado
- DOCX T2
- requirements
- reuniones

## 2. Asistente IA

- causa raíz;
- campos afectados;
- solución;
- autosave;
- tests.

## 3. Encabezado T1

- diferencia anterior;
- estructura oficial;
- implementación final;
- snapshots.

## 4. Unidad académica / administrativa

- modelo;
- catálogo;
- comportamiento T1;
- comportamiento T2;
- Administración;
- tests.

## 5. T2

- errores encontrados;
- título;
- header;
- relación Plan;
- importación;
- tabla;
- firmas;
- footer;
- aislamiento;
- snapshots.

## 6. Dashboard administrador

- métricas;
- navegación;
- restricciones;
- capturas/test.

## 7. Configurador de plantillas

- drag/drop;
- bloques bloqueados;
- propiedades;
- persistencia;
- aplicación;
- reset;
- tests.

## 8. Bugs adicionales encontrados

Solo relacionados.

## 9. Archivos modificados

## 10. Tests nuevos

## 11. Resultado de todos los comandos

## 12. Snapshots modificados

## 13. Pendientes institucionales reales

## 14. Riesgos que aún no tienen cobertura automática

============================================================
10. CRITERIO DE ACEPTACIÓN FINAL
============================================================

NO declarar terminado hasta cumplir:

-----------------------
IA
-----------------------

[ ] Aplicar actualiza el campo correcto.
[ ] Descartar conserva original.
[ ] Autosave funciona.
[ ] Persistencia tras reload.
[ ] T1 probado.
[ ] T2 probado.

-----------------------
T1 HEADER
-----------------------

[ ] Coincide estructuralmente con PDF firmado.
[ ] Facultad/Carrera están en la celda correcta.
[ ] Fecha correcta.
[ ] Portada central conserva alineación.
[ ] Footer no regresó.
[ ] Snapshot revisado.

-----------------------
UNIDAD
-----------------------

[ ] Tipo académica/administrativa seleccionable.
[ ] Catálogo controlado por Admin.
[ ] Unidad académica permite carrera.
[ ] Unidad administrativa no exige carrera.
[ ] T1 consume catálogo.
[ ] T2 consume catálogo.
[ ] Documento histórico no se rompe.

-----------------------
T2
-----------------------

[ ] No existe “INFORME DE: INFORME DE”.
[ ] Header coincide con plantilla T2.
[ ] Derivado exige Plan.
[ ] Plan válido importa actividades.
[ ] Tabla no queda vacía indebidamente.
[ ] Informe independiente no simula derivación.
[ ] Contactos coherentes.
[ ] Firmas dinámicas.
[ ] pageCount dinámico.
[ ] footer T2 correcto.
[ ] Plan origen no se modifica.
[ ] visual regression revisada.

-----------------------
DASHBOARD
-----------------------

[ ] Existe resumen operativo.
[ ] Sin rankings.
[ ] Sin scoring.
[ ] Conteos coherentes.
[ ] UI institucional.
[ ] smoke E2E.

-----------------------
PLANTILLAS
-----------------------

[ ] Drag/drop real.
[ ] Persistencia.
[ ] Restaurar predeterminado.
[ ] Secciones bloqueadas no movibles.
[ ] T1 y T2 independientes.
[ ] Configuración afecta solo nuevos documentos cuando corresponda.
[ ] No se altera documento firmado histórico.
[ ] E2E drag/drop PASS.

-----------------------
REGRESIÓN
-----------------------

[ ] TypeScript PASS.
[ ] Build PASS.
[ ] Motor PASS.
[ ] Nuevos E2E PASS.
[ ] Suite completa E2E PASS.
[ ] Snapshots válidos.
[ ] Sin pérdida de cobertura previa.

============================================================
11. PRIORIDAD
============================================================

Orden de prioridad:

1. Corrección funcional real.
2. Fidelidad institucional T1/T2.
3. Consistencia de estado.
4. No regresiones.
5. Configurabilidad DEMO.
6. UX.
7. Apariencia.

No sacrifiques fidelidad documental por facilidad técnica.

============================================================
12. ENTREGA
============================================================

Trabaja directamente sobre el proyecto.

No me respondas con una propuesta.

Debes:

INSPECCIONAR
→ REPRODUCIR
→ CORREGIR
→ IMPLEMENTAR E2E
→ EJECUTAR
→ CORREGIR REGRESIONES
→ VALIDAR SNAPSHOTS
→ DOCUMENTAR

Al terminar responde únicamente con:

1. resumen breve;
2. bugs reales encontrados;
3. cantidad final E2E PASS/FAIL;
4. resultado TypeScript/build/motor;
5. snapshots modificados;
6. archivos principales modificados;
7. pendientes institucionales;
8. ruta de reporte-pasada-focalizada-ui-documentos.md.

No continúes con mejoras adicionales después de completar esta tarea.
Detente.