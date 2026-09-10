REFACCIÓN UX — CREACIÓN DOCUMENTAL Y WIZARD DEL INFORME

IMPORTANTE:

La lógica funcional ya está aprobada.

NO modificar:
- documentEngine;
- T1;
- estructura documental T2;
- formalVersion;
- reviewRound;
- approvalFlow;
- datos del Informe;
- firma;
- generación de páginas;
- formatos A4.

Esta tarea es exclusivamente UX/UI del proceso de creación.

==========================================================
1. PROBLEMA ACTUAL
==========================================================

El wizard del Informe funciona, pero visualmente está demasiado
comprimido y amontonado.

Problemas observados:

- 8 pasos intentan mostrarse en una sola fila.
- el último paso todavía aparece truncado como "7 P".
- demasiados elementos compiten en la parte superior.
- el usuario no identifica rápidamente dónde está.
- la previsualización queda comprimida.
- existen demasiados acentos visuales.
- el flujo parece más complejo de lo que realmente es.

NO solucionar reduciendo simplemente el tamaño de fuente.

Reorganizar la jerarquía.

==========================================================
2. MODAL "CREAR NUEVO DOCUMENTO"
==========================================================

Mantener modal centrado.

Título:

Crear nuevo documento

Subtítulo:

Seleccione el tipo de documento institucional que desea elaborar.

Mostrar dos tarjetas iguales:

PLAN DE TRABAJO

Descripción:
Planifique actividades, objetivos y medios de verificación
para un grupo y período académico.

Formato:
UTA-SGC-A-2-1-P7-T1

Botón:
CREAR PLAN DE TRABAJO

----------------------------------

INFORME

Descripción:
Documente la ejecución, resultados y seguimiento de las
actividades institucionales.

Formato:
UTA-SGC-A-2-1-P7-T2

Botón:
CREAR INFORME

Eliminar el badge:

DEMO

porque T2 ya corresponde a un formato institucional suministrado.

==========================================================
3. COLOR DEL MODAL
==========================================================

Ambos documentos pertenecen al mismo sistema.

Usar azul institucional como color principal de ambos botones.

La diferenciación entre:

Plan
Informe

debe realizarse mediante:

- icono;
- nombre;
- código T1/T2;

NO mediante dos identidades cromáticas completamente diferentes.

==========================================================
4. NUEVA CABECERA DEL WIZARD
==========================================================

No mostrar los 8 nombres comprimidos en una única línea.

Crear una cabecera limpia:

Crear Informe

Formato UTA-SGC-A-2-1-P7-T2

                                   Paso X de 8

Debajo:

barra horizontal de progreso.

Ejemplo:

Paso 3 de 8

[████████████░░░░░░░░░░░]

Desarrollo de actividades

==========================================================
5. NAVEGACIÓN DE PASOS
==========================================================

Debajo de la barra mostrar los pasos en GRID.

Desktop:

4 columnas x 2 filas.

Fila 1:

1 Información general
2 Antecedentes
3 Desarrollo de actividades
4 Conclusiones y oportunidades

Fila 2:

5 Registro de contactos
6 Anexos
7 Previsualización
8 Firma y envío

Estados:

COMPLETADO:
check verde.

ACTUAL:
círculo azul institucional + texto destacado.

PENDIENTE:
gris.

Nunca truncar textos como:

7 P

Si un nombre necesita dos líneas:
permitir dos líneas.

NO utilizar nowrap para forzar ocho pasos dentro de una sola fila.

==========================================================
6. COMPORTAMIENTO RESPONSIVE DEL STEPPER
==========================================================

>= 1400px:
4 columnas x 2 filas.

1000–1399px:
4 columnas x 2 filas con labels compactos.

< 1000px:
2 columnas x 4 filas.

Nunca cortar el texto horizontalmente.

Nunca reducir los labels hasta hacerlos ilegibles.

==========================================================
7. CONTENEDOR PRINCIPAL
==========================================================

Cada paso debe tener una única tarjeta de contenido principal.

Ejemplo:

[Título de sección]
[Descripción breve]

-----------------------------------

campos / contenido

-----------------------------------

No distribuir información funcional en múltiples contenedores
innecesarios.

Usar aproximadamente:

max-width: 1100px–1200px

centrado.

==========================================================
8. PASO 1 — INFORMACIÓN GENERAL
==========================================================

Mantener los campos existentes.

Organización visual:

FILA 1
Unidad Académica / Administrativa
Carrera

FILA 2
Informe de
Período Académico

FILA 3
Grupo Institucional / Comisión
Fecha de Elaboración

DIVISOR

Origen del Informe

[ Derivado de un Plan ] [ Informe independiente ]

Si deriva:

Plan de Trabajo relacionado

Mantener esta estructura.

No agregar campos.

==========================================================
9. TARJETAS DE ORIGEN
==========================================================

Reducir altura visual.

Cada tarjeta:

radio
título
una sola descripción breve

Activo:

borde azul institucional
fondo azul muy claro

Inactivo:

borde gris
fondo blanco

No convertirlas en grandes bloques decorativos.

==========================================================
10. PASOS DE EDICIÓN TEXTUAL
==========================================================

Para:

Antecedentes
Conclusiones
Oportunidades

usar:

Título de sección
Descripción breve

Textarea amplio

botón secundario:
✨ Mejorar redacción

El botón de IA debe ser secundario.

No debe competir visualmente con:

Siguiente

==========================================================
11. FOOTER FIJO DEL WIZARD
==========================================================

Mantener footer inferior consistente.

Izquierda:

Cancelar

Centro opcional:

Guardado automáticamente

Derecha:

← Anterior
Siguiente →

En Paso 1:

Cancelar                     Siguiente →

En Paso 8:

← Anterior                   Finalizar / Enviar

No cambiar la lógica existente.

==========================================================
12. PREVISUALIZACIÓN — PASO 7
==========================================================

Este paso requiere más espacio que los formularios.

Al entrar en Paso 7:

colapsar automáticamente el Sidebar si ya existe esa capacidad.

Permitir que el visor utilice prácticamente todo el ancho disponible.

No encerrar la previsualización dentro de una tarjeta estrecha.

==========================================================
13. TOOLBAR DEL VISOR EN PASO 7
==========================================================

La barra actual se comprime demasiado.

Agrupar controles:

IZQUIERDA:

Anterior
Página X de N
Siguiente

CENTRO:

[1][2][3][4][5]

DERECHA:

v1.0 · Ronda 1

[-] 100% [+]
Ajustar

No permitir que:

Versión formal 1.0 · Ronda 1

se divida en 3 o 4 líneas.

Mostrarlo como pill compacto:

v1.0 · Ronda 1

==========================================================
14. CORREGIR TÍTULO DUPLICADO EN PREVISUALIZACIÓN
==========================================================

Todavía existe inconsistencia.

En el modal general se muestra correctamente:

INFORME DE:
SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Pero en la previsualización del wizard todavía puede mostrarse:

INFORME DE:
INFORME DE SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

Corregir.

Crear UNA ÚNICA función compartida, por ejemplo:

normalizeInformeTitle(titulo)

Debe eliminar del inicio, ignorando mayúsculas/minúsculas:

"Informe de:"
"Informe de"

Ejemplo entrada:

Informe de seguimiento de actividades de titulación

Salida:

SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN

La misma función debe ser utilizada por:

- previewArtifact;
- artifact final;
- DocumentPdfPageViewer.

NO mantener tres normalizaciones separadas.

==========================================================
15. PAGECOUNT — NO VOLVER A HARDCODEAR
==========================================================

El escenario DEMO actual tiene cinco páginas.

Correcto.

Pero técnicamente no mantener:

pageCount = 5

como fuente de verdad.

La fuente de verdad debe ser:

artifact.pages.length

Por tanto:

artifact.pageCount = artifact.pages.length

El escenario DEMO actual produce 5 porque contiene 5 páginas.

Un Informe futuro con más contenido puede generar N páginas.

Mantener:

Página X de N.

==========================================================
16. REDUCCIÓN DEFINITIVA DEL MORADO
==========================================================

No utilizar morado como color de interacción principal.

Usar:

AZUL:
acciones y selección.

VERDE:
completado.

AMARILLO:
borrador/advertencia.

GRIS:
pendiente/neutro.

ROJO:
error/destructivo.

El badge "INFORME" puede utilizar azul suave o neutro.

No morado fuerte.

==========================================================
17. NO TOCAR EL A4
==========================================================

Esta refacción corresponde a la INTERFAZ.

NO modificar:

- encabezado T2;
- portada;
- índices;
- tablas;
- firmas;
- footer;
- tipografía del documento.

==========================================================
18. VERIFICACIÓN VISUAL
==========================================================

Probar:

Nuevo Documento
Paso 1
Paso 2
Paso 3
Paso 7
Paso 8

Comprobar:

[ ] modal de selección limpio
[ ] sin badge DEMO en Informe
[ ] wizard no se siente amontonado
[ ] 8 pasos completamente legibles
[ ] ningún "7 P"
[ ] actual azul
[ ] completados verdes
[ ] pendientes grises
[ ] contenido centrado y jerarquizado
[ ] footer consistente
[ ] previsualización tiene espacio
[ ] v1.0 · Ronda 1 no se parte
[ ] no existe "INFORME DE: INFORME DE..."
[ ] A4 no sufrió cambios

==========================================================
19. VERIFICACIÓN TÉCNICA
==========================================================

npx tsc --noEmit
npm run build

No realizar otras modificaciones.