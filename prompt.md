CORRECCIÓN VISUAL DE ALTA FIDELIDAD T1 + SCROLL DEL VISOR DOCUMENTAL

IMPORTANTE:

La lógica documental ya está aprobada.

NO modificar:
- documentEngine;
- formalVersion;
- reviewRound;
- firmas;
- revisión;
- observaciones;
- auditoría;
- flujo multinivel;
- estados;
- navegación funcional.

Esta tarea es exclusivamente:

1. hacer que la representación visual del documento T1 reproduzca
   fielmente el DOCX suministrado;
2. corregir el scroll del modal/visor documental;
3. mantener la interfaz exterior del sistema intacta.

==========================================================
1. PRINCIPIO VISUAL FUNDAMENTAL
==========================================================

Diferenciar:

INTERFAZ DEL SISTEMA
vs.
DOCUMENTO INSTITUCIONAL.

La interfaz puede mantener:

- azul institucional;
- botones modernos;
- badges;
- panel lateral;
- navegación de páginas.

Pero la hoja renderizada dentro del visor NO debe heredar el
design system visual de la aplicación.

El documento debe parecer el DOCX original.

NO utilizar encabezados azules de aplicación dentro de las tablas
del documento si el formato fuente utiliza gris/blanco/negro.

==========================================================
2. RESTAURAR LA ESTRUCTURA REAL DE PÁGINAS T1
==========================================================

El escenario actual muestra:

Página 1 de 4.

Esto no reproduce el formato suministrado.

Para el contenido DEMO actual generar como mínimo:

PÁGINA 1
PORTADA

PÁGINA 2
ÍNDICE DE CONTENIDO
ÍNDICE DE TABLAS

PÁGINA 3
1. JUSTIFICACIÓN
2. OBJETIVO

PÁGINA 4
3. MATRIZ DE ACTIVIDADES

PÁGINA 5
4. ANEXOS
FIRMAS DE RESPONSABILIDAD
CONTROL DE HISTORIAL DE CAMBIOS

El pageCount sigue siendo dinámico para documentos reales.

NO hardcodear siempre cinco páginas.

Pero el contenido DEMO actual, por su tamaño, debe reproducir la
estructura base de cinco páginas del formato suministrado.

==========================================================
3. PÁGINA 1 — PORTADA T1
==========================================================

La primera página NO debe contener:

- índices;
- justificación;
- objetivo.

Debe reproducir la portada.

Después del encabezado mostrar con el espaciado amplio del documento:

UNIVERSIDAD TÉCNICA
DE AMBATO

centrado, grande y en dos líneas visuales cuando corresponda.

Debajo:

UNIDAD ACADÉMICA / ADMINISTRATIVA:
<valor>

PLAN DE TRABAJO DE:
<grupo/documento>

PERÍODO:
Julio – Diciembre 2026

Respetar los grandes espacios verticales de la plantilla.

NO compactar la portada.

==========================================================
4. TIPOGRAFÍA DE LA PORTADA
==========================================================

Reproducir las medidas del DOCX fuente.

Referencia:

UNIVERSIDAD TÉCNICA DE AMBATO
- Helvetica
- 36 pt
- Bold
- centrado

UNIDAD ACADÉMICA / ADMINISTRATIVA
PLAN DE TRABAJO DE
PERÍODO
- Helvetica
- 18 pt
- Bold

No reducir estos tamaños para hacer caber más contenido.

La finalidad es reproducir el formato fuente.

==========================================================
5. ENCABEZADO T1 — RECONSTRUIR
==========================================================

El encabezado actual es incorrecto.

NO utilizar:

[Escudo]
[SISTEMA DE GESTIÓN DE LA CALIDAD /
 UNIVERSIDAD TÉCNICA DE AMBATO /
 PLAN DE TRABAJO]
[Formato Nº]

Recrear la estructura tabular del DOCX.

Conceptualmente:

┌──────────────────────┬──────────────────────────┬───────────────┐
│                      │ UNIVERSIDAD TÉCNICA DE AMBATO           │
│      ESCUDO          ├──────────────────────────────────────────┤
│                      │ PLAN DE TRABAJO: <valor>                 │
│ SISTEMA DE GESTIÓN   ├──────────────────────────┬───────────────┤
│ DE LA CALIDAD        │ Unidad académica /       │ <valor>       │
│                      │ administrativa:          │               │
│                      ├──────────────────────────┼───────────────┤
│                      │ Fecha de elaboración:    │ <valor>       │
└──────────────────────┴──────────────────────────┴───────────────┘

La celda izquierda debe abarcar verticalmente todo el encabezado.

Dentro de ella:

ESCUDO UTA

y debajo:

SISTEMA DE GESTIÓN
DE LA CALIDAD

NO colocar "SISTEMA DE GESTIÓN DE LA CALIDAD" sobre
"UNIVERSIDAD TÉCNICA DE AMBATO" en la columna central.

==========================================================
6. FORMATO Nº NO VA EN EL ENCABEZADO
==========================================================

Eliminar:

Formato Nº: UTA-SGC-A-2-1-P7-T1

de la caja superior derecha del encabezado.

El Formato Nº pertenece al pie de página.

==========================================================
7. ESTILO DEL ENCABEZADO
==========================================================

Reproducir visualmente:

UNIVERSIDAD TÉCNICA DE AMBATO
- aproximadamente 11 pt
- negrita
- centrado

SISTEMA DE GESTIÓN DE LA CALIDAD
- aproximadamente 7 pt
- negrita
- azul oscuro del documento fuente

Unidad académica / administrativa
Fecha de elaboración
- aproximadamente 7 pt
- negrita
- respetar el azul/gris del formato fuente

PLAN DE TRABAJO
- respetar estilo de la plantilla original.

Reproducir también:

- bordes finos oscuros;
- celdas grises donde corresponda;
- proporciones de columnas;
- alturas aproximadas.

==========================================================
8. CARRERA
==========================================================

Carrera es una adaptación solicitada durante la revisión con el
profesor.

Mantenerla.

Pero integrarla sin destruir la estructura del encabezado original.

Puede agregarse conceptualmente como una fila adicional inmediatamente
después de Unidad académica / administrativa y antes de Fecha de
elaboración, manteniendo exactamente el mismo estilo visual de las
filas institucionales.

No ubicar Carrera horizontalmente junto a Unidad si eso altera
completamente la plantilla.

==========================================================
9. ENCABEZADO REPETIDO
==========================================================

El formato T1 muestra el encabezado institucional nuevamente en las
páginas interiores.

Por tanto:

Página 2
Página 3
Página 4
Página 5

deben mostrar la misma tabla de encabezado institucional,
salvo que la fuente indique otro comportamiento.

NO sustituirlo por una línea pequeña con:

UNIVERSIDAD TÉCNICA DE AMBATO      Formato Nº ...

como ocurre actualmente en las páginas interiores.

==========================================================
10. PÁGINA 2 — ÍNDICES
==========================================================

Crear una página específica para:

ÍNDICE DE CONTENIDO

y debajo, con amplio espacio:

ÍNDICE DE TABLAS

No colocar Justificación en esa misma página.

Mantener el espaciado amplio visible en la plantilla.

Los contenidos del índice pueden generarse dinámicamente.

==========================================================
11. PÁGINA 3 — JUSTIFICACIÓN Y OBJETIVO
==========================================================

Mostrar:

1. JUSTIFICACIÓN

texto justificado

2. OBJETIVO

texto justificado

Referencia visual:

Títulos:
- aproximadamente 14 pt;
- bold;
- color oscuro similar a #323E4F.

Cuerpo:
- aproximadamente 10 pt;
- Helvetica/estilo equivalente de la plantilla;
- alineación JUSTIFICADA;
- interlineado y espaciado similares al documento fuente.

NO usar líneas horizontales azules debajo de cada título si no aparecen
en la plantilla original.

==========================================================
12. PÁGINA 4 — ORIENTACIÓN HORIZONTAL
==========================================================

CORRECCIÓN MUY IMPORTANTE:

La página:

3. MATRIZ DE ACTIVIDADES

del DOCX original está en orientación HORIZONTAL / LANDSCAPE.

El visor actual la muestra en vertical y comprime toda la tabla.

Implementar orientación por página dentro del artefacto.

Ejemplo conceptual:

artifact.pages[n].orientation =
"portrait" | "landscape"

Para la matriz T1:

orientation = "landscape"

El visor debe adaptar automáticamente el contenedor de la hoja.

NO girar la interfaz completa.

Solo la página/documento.

==========================================================
13. MATRIZ — ESTILO VISUAL
==========================================================

Título:

3. MATRIZ DE ACTIVIDADES

Subtítulo:

Tabla 1.- Matriz de actividades

La tabla NO debe utilizar un encabezado azul sólido como actualmente.

Reproducir el estilo del DOCX:

- fondo blanco;
- encabezados claros/grises;
- bordes negros/grises;
- texto negro;
- estructura sobria de Word.

Columnas:

Actividades

Cronograma
  Desde
  Hasta

Responsable

Recursos
(humano, tecnológico, económico, material)

Medios de verificación

Debajo:

Fuente:
Elaborado por:

==========================================================
14. NOTA DE PROTECCIÓN DE DATOS T1
==========================================================

El formato fuente incluye debajo de la matriz una nota condicional
sobre tratamiento de datos personales.

Mantener soporte para esta nota.

Mostrarla únicamente cuando el contenido del Plan recopile datos
personales conforme al criterio de la plantilla.

Para el escenario DEMO se puede visualizar si ayuda a reproducir
la página fuente.

NO convertirla en regla automática si todavía no se ha definido cómo
detectarlo.

==========================================================
15. PÁGINA FINAL — FIRMAS
==========================================================

La tabla actual también utiliza un encabezado azul.

Cambiar para reproducir el formato fuente:

FIRMAS DE RESPONSABILIDAD

Tabla:

ACCIONES | NOMBRE | CARGO | FIRMA

- fondo de encabezado gris claro;
- texto negro;
- bordes oscuros;
- filas con altura mayor;
- sin fondo azul institucional.

Las celdas de firma deben tener suficiente altura física para la
representación de la firma.

NO compactar las firmas como una tabla de datos normal.

==========================================================
16. DESCRIPCIONES DE LAS ACCIONES
==========================================================

En la primera columna respetar conceptualmente los textos del formato:

Elaborado por:
(Delegado técnico de la unidad académica o administrativa)

Revisado por:
(jefe inmediato superior según la procedencia del plan)

Validado por:
(Líder de la unidad académica o administrativa según la procedencia
del plan)

ó

Aprobado por:
(órgano colegiado correspondiente según la procedencia del plan)

El flujo determinará si corresponde Validado por o Aprobado por.

No mostrar ambos simultáneamente como dos firmantes si el flujo solo
requiere uno.

==========================================================
17. HISTORIAL
==========================================================

Mantener:

CONTROL DE HISTORIAL DE CAMBIOS

Tabla:

Versión
Descripción del Cambio
Fecha de Actualización

Cambiar el encabezado azul actual por el estilo gris/claro del DOCX.

==========================================================
18. PIE DE PÁGINA
==========================================================

Incorporar visualmente en cada página el pie de la plantilla:

izquierda:
Documento de uso interno controlado por la Universidad Técnica de Ambato

centro/derecha:
Formato Nº: UTA-SGC-A-2-1-P7-T1

extremo derecho:
número de página

Ejemplo:

Documento de uso interno...     Formato Nº: UTA-SGC-A-2-1-P7-T1    4

No poner el código de formato en la cabecera para compensar su ausencia
en el pie.

==========================================================
19. DIMENSIONES POR PÁGINA
==========================================================

El renderer NO debe asumir una única orientación/dimensión para todo
el documento.

Debe soportar:

portrait
landscape

por página.

El T1 suministrado utiliza orientación vertical en las páginas de
contenido general y orientación horizontal en la matriz.

Reproducir ese comportamiento.

==========================================================
20. SCROLL DEL MODAL — ERROR ACTUAL
==========================================================

El modal de detalle documental actualmente no permite desplazarse
verticalmente para ver la totalidad de la página/documento cuando
la ventana es más pequeña que el contenido.

Corregir obligatoriamente.

El modal debe ocupar como máximo el viewport.

Estructura recomendada:

Modal overlay:
position: fixed;
inset: 0;

Modal container:
height: min(94vh, ...);
max-height: 94vh;
display: flex;
flex-direction: column;
overflow: hidden;

Header del modal:
flex-shrink: 0;

Tabs:
flex-shrink: 0;

Área central:
flex: 1;
min-height: 0;
overflow: hidden;

Zona del visor documental:
overflow: auto;
min-height: 0;

Panel lateral:
overflow-y: auto;
min-height: 0;

Footer:
flex-shrink: 0;

IMPORTANTE:

Debe ser posible hacer scroll con:

- rueda del mouse;
- touchpad;
- scrollbar visible cuando corresponda.

El scroll debe afectar principalmente el área del documento/panel,
NO desplazar fuera de pantalla el header principal del modal.

==========================================================
21. SCROLL DE LA HOJA
==========================================================

Si la página A4/A4-landscape supera el área visible:

permitir scroll vertical y horizontal dentro del visor.

No recortar la hoja.

No esconder la parte inferior.

El botón:

Ajustar

debe hacer que la página completa quepa en el área visible cuando
sea posible.

100%

debe representar aproximadamente su tamaño de visualización normal y
permitir scroll.

==========================================================
22. MODAL RESPONSIVE
==========================================================

Probar al menos:

1920x1080
1600x900
1366x768

En todas:

- debe verse el header del modal;
- debe poder accederse a todas las páginas;
- el footer no debe bloquear el documento;
- el panel lateral debe poder desplazarse;
- la hoja no debe quedar cortada permanentemente.

==========================================================
23. NO CAMBIAR EL VISOR EXTERIOR
==========================================================

Mantener:

Anterior
Siguiente
Página X de N
botones de página
zoom
Ajustar
panel de flujo/revisión

La corrección es de comportamiento y fidelidad del documento,
no un rediseño completo del visor.

==========================================================
24. APLICAR EL MISMO PRINCIPIO AL T2
==========================================================

No rehacer T2 en esta tarea.

Pero las correcciones genéricas deben beneficiar también al Informe:

- scroll;
- footer;
- encabezado repetido;
- tipografía del documento;
- tablas sin design system web;
- orientación por página cuando corresponda.

NO asumir que T1 y T2 tienen necesariamente exactamente las mismas
dimensiones o estructura.

==========================================================
25. NAVEGACIÓN
==========================================================

Si aún aparece:

Mis Documentos

en el Sidebar del DOCENTE, cambiar a:

Documentación Académica

Título de pantalla:

Gestión Documental Académica

Mantener:

+ NUEVO DOCUMENTO

Dentro siguen existiendo:

Plan de Trabajo
Informe

No cambiar rutas internas si no es necesario.

==========================================================
26. VERIFICACIÓN VISUAL OBLIGATORIA
==========================================================

Comparar la previsualización del Plan con el DOCX fuente.

Revisar explícitamente:

[ ] Página 1 = portada real
[ ] Página 2 = índices
[ ] Página 3 = Justificación / Objetivo
[ ] Matriz en horizontal
[ ] encabezado tabular correcto
[ ] encabezado repetido
[ ] Helvetica/tamaños aproximados
[ ] tablas grises/no azul web
[ ] firmas con altura suficiente
[ ] footer visible
[ ] número de página
[ ] código del formato en footer
[ ] modal permite scroll
[ ] 100% permite scroll
[ ] Ajustar permite ver página completa

==========================================================
27. VERIFICACIÓN TÉCNICA
==========================================================

Ejecutar:

npx tsc --noEmit
npm run build

No realizar otras modificaciones.