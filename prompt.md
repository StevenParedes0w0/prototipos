# CORRECCIÓN PUNTUAL FINAL — ENCABEZADO T2 + SCROLL DEL VISOR + MODO DE PANTALLA COMPLETA T1/T2

Trabaja sobre el proyecto actual de Gestión Documental Académica FISEI.

Esta es una corrección sobre una implementación que ya funciona y que posee una suite amplia de pruebas. NO quiero una reimplementación del motor documental, NO quiero cambios arquitectónicos innecesarios y NO quiero regresiones en funcionalidades ya validadas.

Antes de modificar código:

1. Revisa AGENTS.md si existe.
2. Revisa requirements.md.
3. Revisa implementation-status.md.
4. Revisa los componentes implicados.
5. Revisa las pruebas E2E existentes, especialmente las relacionadas con:
   - T1
   - T2
   - previsualización
   - A4
   - layout
   - template configuration
6. Revisa las referencias institucionales disponibles en Documentos_guia cuando sean necesarias para comprobar el encabezado documental.
7. Identifica la causa raíz de cada uno de los tres problemas antes de corregirlos.

NO cambies requirements.md para acomodarlo al comportamiento actual.
El código debe ajustarse a los requisitos y no al revés.

======================================================================
OBJETIVO
======================================================================

Resolver correctamente estos tres problemas detectados mediante revisión manual:

A. El encabezado institucional T2 no representa correctamente el tipo de unidad ni la carrera.
B. El área de previsualización no permite recorrer correctamente todo el documento mediante scroll.
C. “Expandir previsualización” no expande realmente el visor: actualmente básicamente oculta la sidebar.

La corrección debe funcionar en T1 y T2 donde corresponda, sin romper A4, documentos existentes, artefactos firmados, paginación, signatureSlots, índices, flujos, rondas, firmas o snapshots institucionales válidos.

======================================================================
1. CORREGIR EL ENCABEZADO INSTITUCIONAL DEL T2
======================================================================

Actualmente el T2 muestra una etiqueta fija:

“Unidad académica / administrativa:”

Esto es incorrecto.

El documento ya conoce el tipo seleccionado y NO debe generar un texto ambiguo.

El comportamiento debe quedar alineado con la procedencia institucional que ya utiliza el T1.

----------------------------------------------------------------------
1.1 Datos que debe conservar el documento
----------------------------------------------------------------------

El documento debe manejar explícitamente, como mínimo:

- unitType
- unitId
- unitName
- careerId cuando aplique
- careerName cuando aplique

No determinar el tipo buscando palabras en el nombre de la unidad.

No determinar una carrera basándose en el grupo institucional.

No utilizar texto visible como identidad interna cuando ya exista ID.

----------------------------------------------------------------------
1.2 Caso: Unidad académica
----------------------------------------------------------------------

Si el usuario seleccionó:

Tipo de unidad:
Unidad académica

el encabezado institucional debe mostrar:

Unidad académica:
Facultad de Ingeniería en Sistemas, Electrónica e Industrial
Carrera de Ingeniería de Software

La Facultad y la Carrera deben aparecer correctamente dentro del área institucional definida por el formato.

IMPORTANTE:

En la referencia T1 actualmente aceptada, Facultad y Carrera aparecen juntas en la misma celda de contenido del encabezado:

Facultad de Ingeniería en Sistemas, Electrónica e Industrial
Carrera de Ingeniería de Software

Mantener esa lógica visual cuando corresponda.

NO mostrar:

“Unidad académica / administrativa:”

Debe decir únicamente:

“Unidad académica:”

----------------------------------------------------------------------
1.3 Caso: Unidad administrativa
----------------------------------------------------------------------

Si se seleccionó:

Tipo de unidad:
Unidad administrativa

el encabezado debe decir únicamente:

“Unidad administrativa:”

y mostrar el nombre correspondiente.

En ese caso:

- NO debe mostrarse una carrera inexistente.
- NO debe quedar una carrera heredada de una selección anterior.
- NO debe imprimirse una fila/celda vacía titulada “Carrera”.
- NO debe renderizarse “Carrera” en portada si institucionalmente no aplica.
- cambiar de Unidad académica a Unidad administrativa debe limpiar correctamente el careerId/careerName que ya no correspondan.

----------------------------------------------------------------------
1.4 Wizard T2
----------------------------------------------------------------------

El paso Información General del Informe debe permitir seleccionar explícitamente:

- Tipo de unidad
  - Unidad académica
  - Unidad administrativa

- Unidad

- Carrera, SOLO cuando corresponda a una unidad académica y sea aplicable.

La visibilidad del selector de Carrera debe depender del tipo/unidad seleccionados.

No dejar una Carrera invisible pero todavía almacenada.

----------------------------------------------------------------------
1.5 Consistencia T1/T2
----------------------------------------------------------------------

T1 y T2 deben compartir la misma semántica para procedencia institucional.

No crear dos reglas incompatibles.

Si existe código reutilizable para construir los metadatos del encabezado, preferir una única fuente de verdad.

NO cambiar el formato visual T1 que ya fue aceptado salvo que sea imprescindible para eliminar duplicación o inconsistencia.

======================================================================
2. CORREGIR EL SCROLL DEL VISOR DOCUMENTAL
======================================================================

Existe un bug de UX importante:

En determinadas previsualizaciones no es posible continuar desplazándose verticalmente para inspeccionar el contenido inferior.

Esto debe corregirse de raíz.

----------------------------------------------------------------------
2.1 Comportamiento requerido
----------------------------------------------------------------------

El área del documento debe poder desplazarse:

- verticalmente,
- horizontalmente cuando la orientación, zoom o ancho de página lo requieran.

Debe ser posible llegar desde la parte superior hasta la parte inferior de la página/documento.

Debe funcionar con:

- T1 vertical,
- T1 matriz horizontal,
- T2,
- zoom 100%,
- zoom aumentado,
- vista normal,
- vista expandida.

----------------------------------------------------------------------
2.2 No bloquear el scroll
----------------------------------------------------------------------

Revisar especialmente combinaciones de:

- height
- max-height
- min-height
- overflow
- overflow-y
- overflow-x
- flex
- min-height: 0
- position: sticky/fixed
- contenedores padres con overflow:hidden

No arreglarlo añadiendo solamente un valor enorme fijo de altura.

El visor debe aprovechar el viewport disponible de manera responsive.

----------------------------------------------------------------------
2.3 Toolbar
----------------------------------------------------------------------

La toolbar del visor puede permanecer visible/sticky si actualmente funciona bien.

Pero:

- no debe cubrir contenido,
- no debe impedir llegar al final de la página,
- no debe crear un segundo scroll confuso salvo que sea intencional.

----------------------------------------------------------------------
2.4 Panel derecho
----------------------------------------------------------------------

El panel:

- cadena de aprobación,
- aspectos a verificar,
- observaciones,
- acciones,

debe seguir siendo utilizable.

Si necesita scroll independiente por su longitud, puede tenerlo.

Pero el scroll del panel derecho NO debe impedir desplazar el documento.

----------------------------------------------------------------------
2.5 Footer de acciones del wizard
----------------------------------------------------------------------

Los controles inferiores como:

- Anterior
- Siguiente
- Guardar borrador

deben mantenerse accesibles.

Evitar layouts donde el visor crezca infinitamente y empuje estas acciones fuera de una estructura utilizable.

======================================================================
3. MODO “EXPANDIR PREVISUALIZACIÓN” REAL
======================================================================

La implementación actual no satisface el propósito del botón.

Actualmente “Expandir previsualización” básicamente oculta la sidebar.

Eso NO es suficiente.

Quiero un verdadero modo de visualización ampliada.

Debe implementarse tanto para:

- Plan de Trabajo T1
- Informe T2

y debe reutilizar, en lo posible, la misma infraestructura.

----------------------------------------------------------------------
3.1 Comportamiento esperado
----------------------------------------------------------------------

Al presionar el icono de Expandir previsualización:

el visor documental debe transformarse en una experiencia de pantalla completa dentro de la aplicación.

Como mínimo debe:

- ocupar todo el viewport disponible,
- usar position fixed o una solución equivalente,
- usar inset: 0 o comportamiento equivalente,
- aparecer por encima de sidebar, wizard y contenido ordinario,
- utilizar un z-index adecuado,
- maximizar ancho,
- maximizar alto.

NO considerar cumplido este requisito simplemente colapsando la sidebar.

----------------------------------------------------------------------
3.2 Elementos visibles en modo expandido
----------------------------------------------------------------------

Debe conservarse una toolbar compacta que permita como mínimo:

- Página anterior
- Página siguiente
- selección/navegación de páginas
- indicador Página X de Y
- versión formal
- ronda
- zoom -
- zoom +
- Ajustar
- porcentaje de zoom
- salir de vista expandida

Usar ICONOS de la librería existente.

NO usar emojis.

----------------------------------------------------------------------
3.3 Documento
----------------------------------------------------------------------

En modo expandido:

- la página debe aprovechar mucho mejor el espacio;
- conservar su relación de aspecto;
- conservar A4;
- no deformarse;
- no estirarse artificialmente;
- permitir scroll vertical;
- permitir scroll horizontal cuando corresponda;
- respetar landscape/portrait según metadata de la página.

----------------------------------------------------------------------
3.4 Panel documental derecho
----------------------------------------------------------------------

No elimines la cadena institucional y controles del documento de forma arbitraria.

Implementa una solución responsive.

En una pantalla amplia puede mantenerse el panel derecho.

Si el ancho disponible resulta insuficiente, se puede:

- compactar,
- colapsar,
- permitir ocultarlo mediante un icono,

pero debe seguir existiendo una forma clara de consultarlo.

No generar un layout donde el panel reduzca nuevamente el documento a un tamaño incómodo.

----------------------------------------------------------------------
3.5 Salir de vista expandida
----------------------------------------------------------------------

Debe existir un icono claro para salir.

También debe aceptarse ESC si resulta viable y estable.

Al salir:

- volver exactamente al modo normal,
- conservar página actual,
- conservar zoom,
- conservar documento actual,
- conservar estado del wizard,
- no reiniciar formularios,
- no regenerar otro documento,
- no cambiar targetDocId.

----------------------------------------------------------------------
3.6 Fullscreen API
----------------------------------------------------------------------

Si Fullscreen API puede incorporarse de forma estable, puede utilizarse como mejora adicional.

Pero NO dependas exclusivamente de ella.

El requisito obligatorio es una vista full-viewport estable dentro de la aplicación.

Debe funcionar incluso si el navegador rechaza Fullscreen API.

======================================================================
4. T1 Y T2 DEBEN UTILIZAR EL MISMO COMPONENTE/COMPORTAMIENTO
======================================================================

No quiero dos implementaciones divergentes.

Audita DocumentPdfPageViewer y los wrappers que lo consumen.

Preferir:

- una sola lógica de expand/collapse,
- una sola lógica de scroll,
- una sola toolbar,
- un solo cálculo responsive,

con personalización por metadatos cuando sea necesario.

No duplicar una versión T1 y otra T2 si no existe una razón estructural real.

======================================================================
5. NO REGRESIONES
======================================================================

No modificar ni romper:

- unicidad de Plan por teacherId + groupId + periodId,
- aislamiento Plan / Informe,
- artefactos firmados inmutables,
- rondas,
- versión formal,
- firma DEMO,
- firma manual simulada,
- firma única,
- workflow,
- revisores paralelos,
- observaciones,
- devoluciones,
- correcciones,
- evidencia,
- historial,
- cierre DEMO,
- documentos históricos,
- A4,
- signatureSlots,
- pageCount dinámico,
- orientation de página,
- footer institucional,
- índices dinámicos,
- orden configurable de secciones,
- configuración administrativa de plantillas.

No tocar módulos que no sean necesarios.

======================================================================
6. REGLA DE A4
======================================================================

TODO documento institucional de este mockup debe continuar en A4.

- portrait cuando corresponda,
- landscape cuando corresponda.

No introducir Carta/Letter.

No corregir el scroll o fullscreen cambiando el tamaño lógico de la hoja.

======================================================================
7. ICONOS, NO EMOJIS
======================================================================

No añadir emojis visibles.

Para:

- expandir,
- contraer,
- cerrar,
- advertencias,
- controles,

usar iconos SVG/componentes de la librería visual que ya utiliza el proyecto.

Mantener vigente la prueba no-visible-emojis.

======================================================================
8. PRUEBAS AUTOMÁTICAS NUEVAS/ACTUALIZADAS
======================================================================

No me basta con “se ve bien”.

Implementar pruebas que protejan específicamente estas correcciones.

----------------------------------------------------------------------
8.1 Encabezado T2 académico
----------------------------------------------------------------------

Crear/usar un T2 con:

Unidad académica
+
Facultad
+
Carrera

Comprobar en el artefacto:

- aparece “Unidad académica”
- aparece Facultad
- aparece Carrera de Ingeniería de Software
- NO aparece “Unidad académica / administrativa”

----------------------------------------------------------------------
8.2 Encabezado T2 administrativo
----------------------------------------------------------------------

Cambiar a:

Unidad administrativa

Comprobar:

- aparece “Unidad administrativa”
- aparece su unidad seleccionada
- NO aparece Carrera
- NO queda careerName persistido incorrectamente
- NO aparece el literal combinado.

----------------------------------------------------------------------
8.3 Scroll T1
----------------------------------------------------------------------

Abrir T1 preview.

Comprobar que el contenedor es desplazable y se puede alcanzar el contenido inferior.

Repetir en página horizontal de matriz.

----------------------------------------------------------------------
8.4 Scroll T2
----------------------------------------------------------------------

Abrir T2 preview.

Desplazar el visor desde arriba hasta abajo mediante Playwright.

Verificar que se puede llegar al final del contenido.

----------------------------------------------------------------------
8.5 Expandido T1
----------------------------------------------------------------------

Entrar a T1 preview.

Pulsar expandir.

Comprobar que:

- el visor ocupa prácticamente todo el viewport,
- NO se trata únicamente del sidebar colapsado,
- se conserva toolbar,
- se conserva documento,
- se puede hacer scroll,
- se puede salir,
- al salir se conserva página y estado.

----------------------------------------------------------------------
8.6 Expandido T2
----------------------------------------------------------------------

Repetir el mismo escenario para T2.

----------------------------------------------------------------------
8.7 ESC
----------------------------------------------------------------------

Si se implementa soporte ESC:

- entrar en expandido,
- presionar Escape,
- comprobar retorno normal sin pérdida de estado.

======================================================================
9. REGRESIÓN VISUAL
======================================================================

Si cambia el layout legítimamente, no actualices snapshots de forma automática y ciega.

Antes de aceptar un snapshot nuevo:

1. inspecciona el diff,
2. confirma que el cambio corresponde exclusivamente a mayor espacio útil/layout,
3. confirma que:
   - A4 sigue intacto,
   - encabezados no se deformaron,
   - tablas no se recortaron,
   - firmas no se movieron indebidamente,
   - footer no desapareció,
   - marca BORRADOR sigue correcta,
   - texto institucional no fue alterado accidentalmente.

Documenta qué snapshots cambiaste y por qué.

======================================================================
10. ARCHIVOS A REVISAR
======================================================================

Como mínimo inspecciona, sin asumir que todos deben modificarse:

- src/App.tsx
- src/modulo11/WizardInformeView.tsx
- src/documentEngine/DocumentPdfPageViewer.tsx
- componentes del wizard T1
- renderer/composer T1
- renderer/composer T2
- tipos/document metadata
- procedencia institucional
- template configuration
- tests/e2e/preview-layout.spec.ts
- pruebas de T2
- pruebas A4
- pruebas visuales

Encuentra la implementación real antes de modificar.

No inventes archivos.

======================================================================
11. COMANDOS DE VALIDACIÓN OBLIGATORIOS
======================================================================

Al finalizar ejecuta:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

node --test tests/a4-page-size.test.mjs

node --test tests/no-visible-emojis.test.mjs

las pruebas E2E específicas creadas/modificadas

y finalmente:

npm run test:e2e

Todas deben pasar.

Si una prueba existente falla:

NO actualices la expectativa automáticamente.

Primero determina si se trata de:

- regresión real,
- cambio legítimo,
- snapshot desactualizado,
- test incorrecto.

======================================================================
12. REVISIÓN MANUAL DEL AGENTE
======================================================================

Después de los tests automáticos, utiliza Playwright/headed o el mecanismo disponible para inspeccionar visualmente como mínimo:

A. T2 Unidad académica
- encabezado correcto
- Facultad
- Carrera

B. T2 Unidad administrativa
- encabezado correcto
- sin Carrera

C. T2 vista normal
- scroll hasta el final

D. T2 vista expandida
- documento aprovechando el viewport
- scroll funcional

E. T1 portrait expandido

F. T1 matriz landscape expandida

G. salir del modo expandido
- misma página
- mismo zoom
- mismo documento

No declares completado el trabajo únicamente porque npm run test:e2e esté verde.

======================================================================
13. CRITERIOS DE ACEPTACIÓN
======================================================================

No cierres la tarea hasta que TODOS estos puntos sean verdaderos:

[ ] T2 ya no imprime “Unidad académica / administrativa”.
[ ] T2 académico imprime “Unidad académica”.
[ ] T2 académico incluye Facultad.
[ ] T2 académico incluye Carrera cuando corresponde.
[ ] T2 administrativo imprime “Unidad administrativa”.
[ ] T2 administrativo no imprime una carrera inexistente.
[ ] cambiar tipo limpia correctamente datos que dejan de aplicar.
[ ] T1 sigue funcionando.
[ ] T2 sigue funcionando.
[ ] preview T1 tiene scroll completo.
[ ] preview T2 tiene scroll completo.
[ ] landscape tiene scroll horizontal si lo necesita.
[ ] expandir T1 ocupa el viewport real de la aplicación.
[ ] expandir T2 ocupa el viewport real de la aplicación.
[ ] expandir NO se limita a ocultar sidebar.
[ ] la toolbar sigue disponible.
[ ] el panel documental continúa accesible.
[ ] salir recupera la vista normal.
[ ] página actual no se pierde.
[ ] zoom no se pierde.
[ ] A4 se conserva.
[ ] ningún emoji nuevo es visible.
[ ] TypeScript PASS.
[ ] Build PASS.
[ ] Motor PASS.
[ ] A4 PASS.
[ ] no-emojis PASS.
[ ] E2E completo PASS.

======================================================================
14. REPORTE FINAL
======================================================================

Al finalizar entrégame un reporte estructurado con:

# Reporte — corrección de encabezado y previsualización T1/T2

## 1. Causas raíz encontradas

Explica por separado:

- encabezado T2,
- scroll,
- expandir preview.

## 2. Cambios realizados

Indica archivos exactos y comportamiento modificado.

## 3. Encabezado T2

Describe cómo queda:

- académico,
- administrativo,
- carrera.

## 4. Scroll

Describe qué contenedor provocaba el bloqueo y cómo quedó resuelto.

## 5. Modo expandido

Explica exactamente qué se oculta, qué permanece y cuánto viewport utiliza.

## 6. Pruebas añadidas/modificadas

Enumera escenarios, no solo nombres de archivo.

## 7. Snapshots

Indica:
- cuáles cambiaron,
- por qué,
- cuáles NO cambiaron.

## 8. Resultados

Tabla con:

npx tsc --noEmit
npm run build
motor
A4
no emojis
E2E específicas
npm run test:e2e

## 9. Riesgos restantes

Solo riesgos reales.

No inventes pendientes institucionales nuevos.

======================================================================
PRIORIDAD
======================================================================

La prioridad es:

1. corregir la lógica del encabezado T2;
2. garantizar navegación/scroll completa;
3. implementar expansión de visor real;
4. mantener A4 e integridad institucional;
5. evitar regresiones;
6. conservar la suite completa en verde.

No realices mejoras adicionales fuera de este alcance salvo que sean imprescindibles para resolver correctamente estas tres causas raíz.