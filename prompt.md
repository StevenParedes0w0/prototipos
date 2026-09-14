# CORRECCIÓN FOCALIZADA POST-REUNIÓN
## Gestión Documental Académica FISEI — Fidelidad funcional + regresión E2E

Quiero que realices una intervención MUY CONTROLADA sobre el mockup existente.

NO debes rediseñar la aplicación.
NO debes hacer un refactor general.
NO debes sustituir componentes que ya funcionan correctamente.
NO debes modificar T1/T2, flujos, permisos, evidencias, versiones, rondas o persistencia salvo donde sea estrictamente necesario para cumplir las correcciones descritas en este prompt.
NO debes romper ninguna de las pruebas existentes.

El objetivo es corregir cuatro puntos concretos que todavía no reflejan completamente lo solicitado durante la última reunión de validación con los docentes/clientes.

Antes de modificar código:

1. Lee:
   - AGENTS.md
   - requirements.md
   - implementation-status.md
   - prompt.md si existe
   - reporte-e2e-secundario.md
   - README de E2E
   - transcripciones/notas de la última reunión disponibles en el proyecto
   - especialmente cualquier archivo donde aparezcan expresiones similares a:
     - “Responsable de la comisión”
     - “Seleccionar todos”
     - “Firmar y finalizar”
     - “Subrayar”
     - “Resaltar”
     - “Observación”
     - “Fuente”
     - “Elaborado por”

2. Inspecciona primero el comportamiento actual antes de corregirlo.

3. Considera la última reunión institucional como nueva evidencia funcional.
   Si un requerimiento anterior entra en conflicto directo con una decisión explícita posterior de esa reunión, NO adaptes silenciosamente el código:
   - documenta el conflicto;
   - determina cuál es la decisión posterior;
   - actualiza la documentación funcional correspondiente únicamente si realmente la reunión modifica el requisito;
   - deja trazabilidad en el reporte final.

IMPORTANTE:
No cambies requisitos solamente para justificar el código existente.

---

# CONTEXTO GENERAL QUE DEBES PRESERVAR

La aplicación es un MOCKUP INTERACTIVO DE ALTA FIDELIDAD, no un sistema productivo.

Conservar:

- React + TypeScript + Vite.
- Motor documental existente.
- targetDocId explícito.
- separación de identidad de sesión y contexto.
- unicidad del Plan por:
  teacherId + groupId + periodId.
- formalVersion separada de reviewRound.
- artefactos firmados inmutables.
- artifactHistory.
- observaciones por documento/ronda.
- T1 y T2 aislados.
- evidencia independiente del versionado del Plan.
- una evidencia PDF por medio.
- flujo configurable por grupo.
- revisores paralelos dentro de una misma etapa cuando corresponda.
- siguiente etapa bloqueada hasta cumplir la etapa actual.
- flujo incompleto del Club Académico permanece PENDIENTE.
- NO inventar actores institucionales.
- NO inventar hashes, QR o firma real.
- firma DEMO claramente identificada como simulación.
- certificado/contraseña no persistidos.
- estilo institucional azul/blanco.
- documentos A4 ya existentes.
- footer T1 vigente.
- portada T1 vigente.
- paginación dinámica.
- signatureSlots dinámicos.
- Source/Fuente y Elaborado por ya separados.
- fecha de elaboración persistida.
- periodos cerrados en solo lectura.
- Administración actual.
- notificaciones actuales.
- reportes sin ranking ni evaluación de desempeño.

No reintroduzcas mocks paralelos ni estados duplicados.

---

# OBJETIVO 1
# CORREGIR “SELECCIONAR TODOS” EN RESPONSABLES

La última reunión fue explícita:

Cuando TODOS los integrantes del grupo son responsables de una actividad, NO se desea que el documento muestre todos los nombres individualmente.

La reunión utilizó expresamente como ejemplo:

“Responsable de la comisión”

También se habló de usar una denominación general en lugar de detallar a cada integrante.

Actualmente existen casos donde:

- la interfaz de revisión de matriz sigue mostrando:
  Andrea, Carlos, Patricia...
- o el documento imprime:
  “Integrantes de la Unidad”.

Eso no refleja de forma suficientemente fiel lo solicitado.

## Comportamiento requerido

Internamente SIEMPRE deben conservarse:

- responsableIds
- responsableNames

de todas las personas seleccionadas.

NO eliminar trazabilidad individual.

NO guardar solamente la denominación colectiva.

La denominación colectiva es únicamente de PRESENTACIÓN.

Crear una función central y reutilizable para determinar el texto visible.

Ejemplo conceptual:

getResponsibleDisplayLabel({
  groupType,
  selectedResponsibleIds,
  allGroupMemberIds,
  selectedResponsibleNames
})

Reglas:

### Si NO están seleccionados todos

Mostrar los nombres individuales correspondientes.

Ejemplo:

Andrea + Carlos

→
“Ing. Andrea Pérez, Mg., Ing. Carlos López, Mg.”

### Si están seleccionados TODOS los integrantes

Mostrar una denominación colectiva.

Para Comisión:

“Responsable de la comisión”

Para Unidad:

“Responsable de la unidad”

Para Club:

“Responsable del club”

Para Otro:

“Responsable del grupo”

IMPORTANTE:

La frase confirmada literalmente en la reunión fue
“Responsable de la comisión”.

Las otras denominaciones son equivalentes semánticos según el tipo de grupo.

Si existe en los documentos institucionales o requisitos una denominación mejor confirmada para Unidad/Club/Otro, utiliza esa en lugar de inventar una nueva.

NO mostrar:

“3 personas”

en el documento formal cuando el grupo completo está seleccionado.

NO mostrar:

“Integrantes de la Unidad”

si la decisión posterior de la reunión exige la representación como Responsable del grupo.

## Lugares a revisar

No corrijas solamente el PDF.

Audita TODOS los consumidores:

- drawer/modal de configuración de actividad;
- tabla de matriz;
- vista “Revisar matriz de actividades”;
- previsualización T1;
- artefacto firmado T1;
- documento abierto desde bandeja del docente;
- documento abierto desde bandeja del revisor;
- corrección de ronda;
- T2 derivado si consume el responsable del Plan;
- ejecución de actividades;
- evidencias;
- historial;
- cualquier helper que transforme responsables.

La representación visual puede ser colectiva.

Los permisos SIEMPRE deben continuar usando IDs reales.

## Regla importante

Si existen 3 miembros y se seleccionan los 3:

responsableIds =
[A, B, C]

responsableNames =
[Andrea, Carlos, Patricia]

display =
“Responsable de la unidad”

Si luego se desmarca Patricia:

responsableIds =
[A, B]

display =
“Andrea Pérez, Carlos López”

Nunca perder los IDs de A/B/C por haber utilizado previamente “Seleccionar todos”.

---

# PRUEBA E2E DEL OBJETIVO 1

Añadir o ampliar la cobertura existente.

Caso:

1. Restablecer DEMO.
2. Andrea crea Plan de Unidad de Titulación.
3. Seleccionar todos los responsables en una actividad.
4. Guardar.
5. Verificar estado interno:
   - existen todos los IDs;
   - existen todos los nombres.
6. Verificar pantalla de matriz:
   - utiliza representación colectiva.
7. Verificar PDF T1:
   - utiliza representación colectiva.
8. Desmarcar una persona.
9. Guardar.
10. Verificar:
    - representación vuelve a nombres individuales;
    - IDs correctos;
    - no existen duplicados.
11. Volver a seleccionar todos.
12. Verificar nuevamente etiqueta colectiva.
13. Recargar navegador.
14. Verificar persistencia de IDs y representación.

---

# OBJETIVO 2
# TEXTO DEL HISTORIAL INICIAL

En el artefacto T1 actual aparece algo similar a:

“Elaboración inicial del Plan de Trabajo”

La reunión pidió como redacción predeterminada:

“Elaboración del Plan de Trabajo”

Corrige la primera entrada del:

CONTROL DE HISTORIAL DE CAMBIOS

para que utilice exactamente:

“Elaboración del Plan de Trabajo”

salvo que el documento institucional oficial entregado por el cliente muestre una redacción distinta y posterior.

No cambies:

- Versión 1.0
- fecha;
- formalVersion;
- reviewRound;
- artifactHistory.

Esto es una corrección textual, no de modelo.

Audita también documentos DEMO nuevos.

NO reescribas silenciosamente documentos históricos firmados ya existentes si conceptualmente deben permanecer inmutables.

El reset DEMO sí puede generar nuevamente los fixtures canónicos con la redacción corregida si corresponde.

Crear una regresión automática sencilla para esta cadena.

---

# OBJETIVO 3
# REVISAR “FIRMAR Y FINALIZAR” VS “ENVIAR A REVISIÓN”

ESTE PUNTO REQUIERE AUDITORÍA ANTES DE MODIFICAR.

La última reunión contiene una decisión que parece contradecir parcialmente el comportamiento actual.

Durante la reunión se corrigió:

“Firmar y enviar”

por:

“Firmar y finalizar”

y se indicó que cuando el docente finaliza, el documento continúa al flujo de revisión.

Actualmente el mockup separa:

1. FIRMAR Y FINALIZAR ELABORACIÓN
2. ENVIAR A REVISIÓN

Esta separación fue implementada anteriormente y cuenta con pruebas E2E.

NO cambies esto automáticamente sin investigar.

## Debes hacer lo siguiente

Busca la fuente exacta de la última reunión.

Determina si la decisión final realmente fue:

A)

FIRMAR Y FINALIZAR
→ firma
→ finaliza elaboración
→ automáticamente EN REVISIÓN

o si se confirmó posteriormente:

B)

FIRMAR Y FINALIZAR ELABORACIÓN
→ FIRMADO POR ELABORADOR
→ acción separada ENVIAR A REVISIÓN
→ EN REVISIÓN

Debes establecer cuál es la decisión MÁS RECIENTE Y EXPLÍCITA.

## Si la última reunión confirma A

Entonces:

modifica el comportamiento para que la firma exitosa del elaborador:

BORRADOR / LISTO PARA FIRMA
↓
FIRMAR Y FINALIZAR ELABORACIÓN
↓
firma válida
↓
elaboración terminada
↓
activa siguiente etapa configurada
↓
EN REVISIÓN

No debe existir una segunda confirmación “ENVIAR A REVISIÓN”.

La pantalla posterior debe indicar:

“Plan de Trabajo enviado a revisión”

o equivalente coherente.

Pero esta transición SOLO puede ocurrir si existe una siguiente etapa válida/configurada.

### Flujo incompleto

Para Club Académico, que permanece PENDIENTE:

NO inventar revisores.

NO pasar a EN REVISIÓN.

Mantener el bloqueo ya existente.

Si la política vigente impide incluso la firma del elaborador cuando no existe etapa posterior, conservarla salvo que la reunión contradiga explícitamente ese comportamiento.

### Revisores

El flujo posterior mantiene:

- etapas paralelas;
- etapas secuenciales;
- firmas;
- rondas;
- devolución;
- corrección;
- historial.

## Si la última decisión confirma B

NO cambies el comportamiento actual.

En ese caso documenta claramente que:

- la reunión fue revisada;
- existía una formulación ambigua;
- la decisión posterior/canónica mantiene firma y envío separados.

No hagas cambios solamente porque este prompt señala la discrepancia.

## Si se cambia a A

Actualizar todas las pruebas que actualmente esperan:

FIRMADO POR ELABORADOR
→ ENVIAR A REVISIÓN

pero NO reducir cobertura.

Las nuevas pruebas deben garantizar:

- una sola firma del elaborador;
- no doble envío;
- no doble activación de etapa;
- recarga conserva EN REVISIÓN;
- primer revisor recibe el documento;
- otro documento no cambia;
- flujo incompleto sigue bloqueado.

---

# OBJETIVO 4
# VALIDAR Y COMPLETAR “RESALTAR Y OBSERVAR”

La última reunión solicitó que el revisor pudiera:

- señalar visualmente una parte del documento;
- resaltar/subrayar una zona;
- asociar una observación a esa zona;
- identificar en qué página está;
- posteriormente permitir al docente localizar exactamente lo observado.

La conversación terminó inclinándose por una solución SIMPLE:

una función de RESALTADO.

NO implementar:

- editor de dibujo completo;
- lápiz libre;
- múltiples herramientas complejas;
- Photoshop;
- anotaciones PDF reales;
- OCR;
- modificación física del PDF;
- edición del artefacto firmado.

El artefacto firmado debe seguir siendo INMUTABLE.

Los resaltados pertenecen al sistema de revisión.

## Ya existe implementación parcial

El código/reporte anterior menciona:

- DocumentObservationAnchor
- pageNumber
- x
- y
- width
- height
- selección rectangular
- capa semitransparente
- número de observación
- “IR AL RESALTADO”

No reimplementar si ya funciona.

PRIMERO PRUÉBALO.

---

# COMPORTAMIENTO ESPERADO DEL RESALTADO

En vista de revisión:

Debe existir una acción claramente identificable:

“RESALTAR Y OBSERVAR”

o equivalente accesible.

Flujo:

1. Revisor pulsa Resaltar y observar.
2. Cursor entra en modo selección.
3. Revisor arrastra sobre el A4.
4. Se calcula un rectángulo normalizado relativo a la página.
5. Se abre formulario de observación.
6. Página se asigna automáticamente.
7. Revisor escribe observación.
8. Guarda.
9. Aparece un resaltado semitransparente sobre esa zona.
10. Aparece un identificador visible:
    1, 2, 3...
11. Panel de observaciones muestra la observación correspondiente.
12. “IR AL RESALTADO”:
    - cambia a la página correcta;
    - desplaza/focaliza la zona;
    - ofrece feedback visual.

La observación debe conservar:

- documentId;
- round;
- pageNumber;
- anchor;
- author/reviewer;
- text;
- timestamp;
- status.

NO modificar artifact.pages.

NO incorporar el resaltado dentro de la representación serializada del artefacto firmado.

---

# ZOOM

Este punto es especialmente importante.

Las coordenadas deben almacenarse NORMALIZADAS respecto a la página.

Ejemplo:

x = 0.32
y = 0.41
width = 0.25
height = 0.08

NO almacenar solamente píxeles absolutos del viewport.

El resaltado debe mantenerse sobre la misma región con:

- 80 %
- 100 %
- 125 %

o los niveles disponibles equivalentes.

NO debe desplazarse visualmente por cambiar el zoom.

---

# NAVEGACIÓN ENTRE PÁGINAS

Caso:

Observación 1 → página 3
Observación 2 → página 4

Desde página 1:

“IR AL RESALTADO” de Obs.2

debe abrir página 4 y enfocar Obs.2.

No debe mostrar el resaltado en todas las páginas.

---

# DEVOLUCIÓN Y CORRECCIÓN

Después de devolver el documento:

Andrea debe poder visualizar:

- observación;
- página;
- texto;
- revisor;
- resaltado asociado.

En modo corrección:

debe existir forma de navegar al resaltado.

Al marcar la observación como resuelta:

NO eliminarla.

Debe pasar al historial cuando corresponda.

Al preparar Ronda 2:

- formalVersion permanece 1.0;
- reviewRound pasa a 2;
- resaltados/observaciones de la ronda anterior permanecen históricos;
- el nuevo artefacto no hereda marcas como si fueran contenido físico del documento.

---

# APROBACIÓN

Con observaciones ACTIVAS:

APROBAR / APROBAR Y FIRMAR

debe permanecer bloqueado conforme a la regla actual.

Después de resolver/devolver según el flujo:

el comportamiento debe ser coherente.

No confundir:

observación registrada
≠
resaltado gráfico.

Una observación general puede existir SIN anchor.

Una observación por página puede existir con o sin anchor.

Un resaltado SIEMPRE debe estar asociado a una observación.

---

# ACCESIBILIDAD

Agregar si falta:

aria-label="Resaltar y observar"

aria-label contextual para:

“Ir al resaltado de observación 1”

El modo de resaltado debe poder cancelarse.

Escape debería cancelar el modo si es sencillo y no introduce regresiones.

No depender únicamente del color para identificar observaciones.

Debe existir número/etiqueta.

---

# E2E DEL RESALTADO

Añadir una prueba Playwright específica.

Sugerencia:

tests/e2e/highlight-observation.spec.ts

Escenario:

1. Reset DEMO.
2. Crear/usar Plan en revisión.
3. Cambiar sesión a revisor asignado.
4. Abrir documento.
5. Ir a página 4.
6. Activar “Resaltar y observar”.
7. Ejecutar mouse drag sobre una región estable del A4.
8. Registrar:
   “Corregir esta actividad”.
9. Verificar:
   Observaciones (1)
10. Verificar que existe anchor.
11. Verificar:
   anchor.pageNumber === 4
12. Verificar:
   0 <= x <= 1
   0 <= y <= 1
   width > 0
   height > 0
13. Cambiar a página 2.
14. Pulsar “Ir al resaltado”.
15. Verificar página 4.
16. Verificar resaltado visible.
17. Cambiar zoom.
18. Verificar que el anchor sigue correspondiendo a la misma zona.
19. Recargar.
20. Verificar persistencia.
21. Devolver.
22. Cambiar sesión realmente a Andrea.
23. Continuar corrección.
24. Verificar observación + resaltado.
25. Marcar resuelta.
26. Preparar Ronda 2.
27. Verificar:
    - ronda 2;
    - formalVersion 1.0;
    - observación anterior histórica;
    - artifactHistory intacto.

Si Playwright no permite comparar geométricamente con precisión absoluta debido a fuentes/renderizado:

usar tolerancia razonable.

NO crear pruebas extremadamente frágiles por diferencias de 1-2 píxeles.

---

# AUDITORÍA VISUAL COMPLEMENTARIA

Después de las cuatro correcciones anteriores, revisa específicamente T1:

## Página 1

Debe conservar:

- encabezado institucional;
- Facultad;
- Carrera;
- Fecha de elaboración;
- UNIVERSIDAD TÉCNICA DE AMBATO;
- UNIDAD ACADÉMICA / ADMINISTRATIVA;
- PLAN DE TRABAJO DE;
- PERÍODO;
- bloque principal equilibrado verticalmente.

NO mover nuevamente la portada si ya cumple.

## Footer

Conservar:

izquierda:
“Documento de uso interno controlado por la Universidad Técnica de Ambato”

centro:
“Formato Nº: UTA-SGC-A-2-1-P7-T1”

derecha:
número dinámico.

UNA sola fila.

SIN border-top.

SIN hr.

## Página índice

Páginas derivadas de artifact.pages.

Nunca hardcodear 5.

## Matriz

Si todos son responsables:

debe utilizar la denominación colectiva corregida.

## Página final

Conservar:

ANEXOS
FIRMAS DE RESPONSABILIDAD
CONTROL DE HISTORIAL DE CAMBIOS

Primera descripción:

“Elaboración del Plan de Trabajo”

---

# NO REGRESIONES CRÍTICAS

Después de los cambios deben seguir funcionando:

1. Unicidad del Plan.
2. Duplicate modal.
3. Continuar corrección.
4. Otro recurso.
5. Otro medio.
6. Responsables parciales.
7. Responsables totales.
8. Feriados.
9. 23:59.
10. Permisos.
11. Identidad/contexto separados.
12. Sesión real de revisor.
13. Revisores paralelos.
14. Coordinación secuencial.
15. Validación final.
16. Devolución.
17. Ronda 2 sin versión formal 2.0.
18. artifactHistory.
19. T2 derivado.
20. aislamiento Plan/Informe.
21. Evidencias.
22. reemplazo de evidencia.
23. evidencia v2.0.
24. cierre DEMO.
25. histórico solo lectura.
26. reset.
27. notificaciones.
28. reportes.
29. flujo incompleto.
30. snapshots T1.
31. snapshots T2.

---

# NO HACER

NO introducir backend.

NO introducir API.

NO introducir PostgreSQL.

NO introducir Firebase.

NO introducir Supabase.

NO introducir firma criptográfica real.

NO introducir almacenamiento cloud.

NO crear QR falsos.

NO crear hashes falsos.

NO inventar procedimiento QIPOC.

NO inventar decisión del Consejo Directivo.

NO inventar cargos o revisores.

NO modificar formatos institucionales sin evidencia.

NO migrar a otro framework.

NO cambiar la paleta institucional.

NO eliminar datos DEMO necesarios para pruebas.

NO convertir el mockup en un producto de producción.

NO reescribir componentes completos que ya están estables.

---

# PRUEBAS OBLIGATORIAS

Al finalizar ejecuta:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

npm run test:e2e

Además ejecutar individualmente las nuevas pruebas antes de la suite completa.

La suite actual parte aproximadamente de:

17 E2E PASS
+
1 Node PASS

El resultado final NO puede tener menos cobertura.

Si actualizas una prueba porque un requisito confirmado cambió:

documenta explícitamente:

ANTES:
comportamiento esperado anterior

AHORA:
comportamiento confirmado por reunión

FUENTE:
decisión de reunión

No “arregles” un test solamente para hacerlo pasar.

---

# SNAPSHOTS

Solo actualizar snapshots si existe un cambio visual legítimo derivado de estos requerimientos.

NO regenerar snapshots masivamente.

Si cambia la matriz únicamente porque:

“Integrantes de la Unidad”

pasa a:

“Responsable de la unidad”

entonces actualizar exclusivamente los snapshots afectados.

Conservar cualquier otro snapshot sin modificaciones.

---

# DOCUMENTACIÓN

Actualizar:

implementation-status.md

y crear o actualizar:

reporte-correcciones-post-reunion.md

El reporte debe incluir:

# Reporte de correcciones post-reunión

## 1. Fuentes revisadas

## 2. Responsable colectivo
- comportamiento anterior;
- requerimiento confirmado;
- implementación;
- persistencia de IDs;
- consumidores corregidos;
- pruebas.

## 3. Historial inicial
- texto anterior;
- texto final;
- alcance.

## 4. Firmar y finalizar
- transcripción/requisito encontrado;
- comportamiento anterior;
- decisión final;
- si cambió o no;
- justificación;
- pruebas actualizadas.

## 5. Resaltar y observar
- estado previo;
- componentes reutilizados;
- funcionamiento;
- coordenadas;
- zoom;
- navegación;
- corrección;
- historial.

## 6. Archivos modificados

## 7. Nuevas pruebas

## 8. Resultados completos

## 9. Bugs reales encontrados

## 10. Pendientes institucionales

## 11. Riesgos restantes

---

# CRITERIOS DE ACEPTACIÓN

No declares completado el trabajo hasta comprobar:

### RESPONSABLES

[ ] Seleccionar una persona muestra una persona.

[ ] Seleccionar varias, pero no todas, muestra esas personas.

[ ] Seleccionar todos usa denominación colectiva.

[ ] IDs individuales permanecen guardados.

[ ] Desmarcar uno revierte a nombres individuales.

[ ] PDF usa la misma lógica.

[ ] T2/ejecución/evidencias no pierden permisos.

### HISTORIAL

[ ] Primera entrada usa “Elaboración del Plan de Trabajo”.

[ ] Versión y ronda no cambian por esta corrección.

### FIRMA

[ ] Se investigó la última decisión real.

[ ] Comportamiento implementado coincide con la decisión más reciente.

[ ] Flujo incompleto no inventa actores.

[ ] No hay doble firma.

[ ] No hay doble envío.

### RESALTADO

[ ] Existe Resaltar y observar.

[ ] Mouse drag funciona.

[ ] Observación queda vinculada.

[ ] Página correcta.

[ ] Coordenadas normalizadas.

[ ] Persiste tras recarga.

[ ] Ir al resaltado funciona.

[ ] Zoom no desalineó significativamente la marca.

[ ] Docente ve el resaltado durante corrección.

[ ] Observación resuelta queda histórica.

[ ] Artefacto firmado no se modifica.

### REGRESIÓN

[ ] TypeScript PASS.

[ ] Build PASS.

[ ] Motor PASS.

[ ] E2E completo PASS.

[ ] Ninguna funcionalidad institucional previamente estable se degradó.

---

# PRIORIDAD

Prioridad de decisión:

1. Última decisión explícita del cliente/reunión.
2. Documento institucional oficial.
3. requirements.md actualizado con evidencia real.
4. Arquitectura documental ya estabilizada.
5. UX.
6. Conveniencia técnica.

No uses una solución técnicamente cómoda si contradice lo solicitado por el cliente.

---

# FORMA DE TRABAJO

Quiero que trabajes directamente sobre el proyecto.

NO me devuelvas únicamente recomendaciones.

Inspecciona.
Reproduce.
Corrige.
Prueba.
Vuelve a probar.
Documenta.

Si encuentras un defecto adicional directamente relacionado con estos cuatro puntos, corrígelo si la solución es segura y agrega una regresión.

Si encuentras algo no relacionado:
NO amplíes el alcance.
Regístralo como hallazgo pendiente.

Al terminar, entrégame el reporte técnico completo junto con:

- cantidad final de E2E;
- PASS/FAIL;
- archivos modificados;
- bugs encontrados;
- decisión final sobre Firmar y finalizar;
- evidencia de la denominación colectiva;
- estado real de Resaltar y observar;
- si hubo actualización de snapshots;
- cualquier discrepancia aún pendiente con la última reunión.