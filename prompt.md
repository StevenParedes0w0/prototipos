REFACCIÓN TRANSVERSAL — PLANTILLAS OFICIALES T1/T2
Y FLUJO DEFINITIVO DEL INFORME

IMPORTANTE:

NO crear un nuevo módulo independiente.
NO rehacer documentEngine.
NO alterar el flujo de firma, rondas, revisión o validación ya aprobado.
NO modificar la paleta visual.
NO realizar refactors fuera de este alcance.

El objetivo es sustituir la estructura DEMO del Informe por la
estructura institucional suministrada y alinear la generación visual
de Plan e Informe con los formatos oficiales proporcionados.

==========================================================
1. FUENTES DOCUMENTALES OFICIALES
==========================================================

Utilizar como referencias maestras:

PLAN DE TRABAJO:
UTA-SGC-A-2-1-P7-T1

INFORME:
UTA-SGC-A-2-1-P7-T2

El documento generado/previsualizado debe reproducir visualmente la
estructura de estos formatos:

- encabezados;
- títulos;
- distribución;
- tablas;
- tipografía;
- tamaños;
- espaciados;
- pie de página;
- numeración;
- FIRMAS DE RESPONSABILIDAD;
- CONTROL DE HISTORIAL DE CAMBIOS.

NO generar un documento "inspirado" en la plantilla.

El objetivo visual del prototipo es representar el formato oficial
con la mayor fidelidad posible.

==========================================================
2. INFORME DEJA DE SER "ESTRUCTURA DEMO"
==========================================================

Eliminar del Informe:

ESTRUCTURA DEMO

y:

ESTRUCTURA PENDIENTE DE DEFINICIÓN INSTITUCIONAL

porque ya existe el formato institucional T2 suministrado.

En Administración → Plantillas Documentales mostrar:

Informe

Formato:
UTA-SGC-A-2-1-P7-T2

Estado:
ACTIVA

Para Plan:

Plan de Trabajo

Formato:
UTA-SGC-A-2-1-P7-T1

Estado:
ACTIVA

==========================================================
3. MODELO DEL INFORME
==========================================================

Mantener:

documentType = "INFORME"

Agregar un dato específico:

informeOrigen:

- DERIVADO_PLAN
- INDEPENDIENTE

Agregar además:

relatedPlanId?: string

aplicaRegistroContactos: boolean

No crear otro documentEngine.

==========================================================
4. NUEVO WIZARD DEL INFORME
==========================================================

Reemplazar el wizard DEMO actual por:

PASO 1
Información general

PASO 2
Antecedentes

PASO 3
Desarrollo de actividades

PASO 4
Conclusiones y oportunidades de mejora

PASO 5
Registro de contactos y gestiones, cuando aplique

PASO 6
Anexos

PASO 7
Previsualización

PASO 8
Firma y envío

Puede compactarse visualmente el stepper si es necesario,
pero conservar conceptualmente estas partes.

==========================================================
5. PASO 1 — INFORMACIÓN GENERAL
==========================================================

Mostrar:

Unidad académica / administrativa *

Carrera *

Informe de *

Período *

Fecha de elaboración *

Origen del Informe *

----------------------------------------------------------

Origen:

○ Derivado de un Plan de Trabajo

○ Informe independiente

----------------------------------------------------------

Si elige:

DERIVADO DE UN PLAN DE TRABAJO

mostrar:

Plan de Trabajo relacionado *

Ejemplo:

Plan de Trabajo — Unidad de Titulación
Julio – Diciembre 2026
Versión 1.0

Solo mostrar Planes del usuario/contexto correspondientes.

Si elige:

INFORME INDEPENDIENTE

no exigir Plan relacionado.

==========================================================
6. CARRERA — NUEVO REQUERIMIENTO
==========================================================

Incorporar conceptualmente:

user.careers[]

Ejemplo Andrea:

- Ingeniería de Software
- Tecnologías de la Información

o los datos DEMO que ya existan.

Reglas:

Si el usuario pertenece a una sola carrera:
preseleccionarla.

Si pertenece a varias:
mostrar selector obligatorio.

No permitir escoger una carrera que no pertenezca al usuario.

Mostrar Carrera en Plan e Informe cuando corresponda.

En el documento institucional ubicar conceptualmente:

UNIDAD ACADÉMICA / ADMINISTRATIVA

CARRERA

antes de identificar el Plan/Informe, conforme a la retroalimentación
obtenida durante la presentación.

No convertir Carrera en texto libre.

==========================================================
7. PASO 2 — ANTECEDENTES
==========================================================

Título institucional:

1. ANTECEDENTES

Textarea amplio.

Si el Informe deriva de un Plan de Trabajo:

preparar automáticamente un texto base editable que relacione el
Informe con el Plan seleccionado.

No hardcodear números de:

- resolución;
- memorando;
- disposición;
- autoridad.

Si existe un documento de respaldo seleccionado, utilizar sus datos.

Si no existe:
dejar el contenido editable para el usuario.

El asistente de IA puede utilizarse aquí como SUGERENCIA.

==========================================================
8. PASO 3 — DESARROLLO DE ACTIVIDADES
==========================================================

Título:

2. DESARROLLO DE ACTIVIDADES

COMPORTAMIENTO A:

INFORME DERIVADO DE PLAN DE TRABAJO

Mostrar la tabla institucional:

ACTIVIDADES

MEDIOS DE VERIFICACIÓN

PORCENTAJE DE EJECUCIÓN

OBSERVACIONES

Las columnas:

ACTIVIDADES
y
MEDIOS DE VERIFICACIÓN

deben obtenerse automáticamente del Plan relacionado.

No escribirlas nuevamente manualmente.

Para cada actividad permitir editar:

Porcentaje de ejecución:
0 a 100

Observaciones:
texto

Validar:

0 <= porcentaje <= 100

NO deducir automáticamente que:

evidencia validada = 100%

porque son conceptos diferentes.

Puede utilizarse información de actividades/evidencias como apoyo visual,
pero el porcentaje corresponde al Informe institucional.

==========================================================
9. INFORME INDEPENDIENTE
==========================================================

Cuando:

informeOrigen = INDEPENDIENTE

NO mostrar la tabla derivada del Plan.

Mostrar una sección editable de:

Desarrollo de actividades

porque el formato T2 contempla Informes originados por requerimientos
no planificados.

No inventar una planificación previa.

==========================================================
10. PASO 4 — CONCLUSIONES Y OPORTUNIDADES
==========================================================

Mostrar exactamente:

3. CONCLUSIONES

campo editable

4. OPORTUNIDADES DE MEJORA

campo editable

Mantener asistente:

✨ Mejorar redacción

como sugerencia.

No sobrescribir automáticamente.

==========================================================
11. PASO 5 — REGISTRO DE CONTACTOS
==========================================================

Título:

5. REGISTRO DE CONTACTOS Y GESTIONES DE LA DELEGACIÓN

Mostrar primero:

¿Este Informe corresponde a una delegación, visita técnica,
comisión u otro caso que requiera registrar contactos?

○ Sí
○ No

Si NO:

marcar conceptualmente:

No aplica.

Si SÍ:

mostrar tabla:

Nombre o propósito de la delegación

Ciudad, país o institución

Entidad y persona de contacto

Datos de contacto

Tema o propósito

Acuerdo y seguimiento

Permitir agregar varias filas.

No mostrar esta tabla innecesariamente cuando no aplica.

==========================================================
12. PASO 6 — ANEXOS
==========================================================

Título:

6. ANEXOS

Reutilizar el gestor ya existente.

Si no existen anexos:

el documento debe mostrar:

No aplica.

NO eliminar silenciosamente la sección.

Mantener separados:

ANEXOS DEL INFORME

de

EVIDENCIAS DE ACTIVIDADES.

==========================================================
13. PREVISUALIZACIÓN DEL INFORME
==========================================================

La previsualización debe representar el formato T2.

Debe incluir conceptualmente:

PORTADA / ENCABEZADO

SISTEMA DE GESTIÓN DE LA CALIDAD

UNIVERSIDAD TÉCNICA DE AMBATO

INFORME DE: ...

UNIDAD ACADÉMICA / ADMINISTRATIVA

CARRERA, cuando corresponda

FECHA DE ELABORACIÓN

Formato Nº:
UTA-SGC-A-2-1-P7-T2

Luego:

ÍNDICE DE CONTENIDOS

ÍNDICE DE TABLAS

Luego:

1. ANTECEDENTES

2. DESARROLLO DE ACTIVIDADES

Tabla 1 cuando derive de Plan

3. CONCLUSIONES

4. OPORTUNIDADES DE MEJORA

5. REGISTRO DE CONTACTOS Y GESTIONES
si aplica

6. ANEXOS

FIRMAS DE RESPONSABILIDAD

CONTROL DE HISTORIAL DE CAMBIOS

==========================================================
14. NO FIJAR 5 PÁGINAS
==========================================================

Aunque el archivo institucional de referencia tenga cinco páginas,
NO asumir:

pageCount = 5

La cantidad final depende del contenido.

Utilizar siempre:

Página X de N

generada desde el artefacto.

==========================================================
15. PLAN DE TRABAJO — ALINEACIÓN T1
==========================================================

Sin rehacer su wizard, corregir la previsualización del Plan para que
respete el formato T1 suministrado.

Estructura:

PORTADA

ÍNDICE DE CONTENIDO

ÍNDICE DE TABLAS

1. JUSTIFICACIÓN

2. OBJETIVO

3. MATRIZ DE ACTIVIDADES

4. ANEXOS

FIRMAS DE RESPONSABILIDAD

CONTROL DE HISTORIAL DE CAMBIOS

Matriz:

ACTIVIDADES

CRONOGRAMA
- Desde
- Hasta

RESPONSABLE

RECURSOS
(humano, tecnológico, económico, material)

MEDIOS DE VERIFICACIÓN

==========================================================
16. RECURSOS DEL PLAN
==========================================================

El formato T1 clasifica conceptualmente los recursos como:

- Humano
- Tecnológico
- Económico
- Material

No llenar el prototipo con recursos arbitrarios solo para ocupar espacio.

En futuras configuraciones administrativas debe poder existir:

Tipo de recurso
Nombre
Descripción
Estado

No hace falta desarrollar ahora un nuevo módulo.

==========================================================
17. FIRMAS DE RESPONSABILIDAD
==========================================================

Reutilizar la tabla dinámica construida desde flowStages.

Para Plan e Informe:

ELABORACIÓN
→ Elaborado por

ETAPA DE REVISIÓN
→ Revisado por
(una fila por cada firmante que corresponda)

ETAPA FINAL
→ configurable como:

Validado por

o

Aprobado por

Agregar al modelo de flujo:

finalActionLabel:

"VALIDADO_POR"
|
"APROBADO_POR"

Para el escenario DEMO actual puede utilizarse:

VALIDADO_POR

pero el motor debe soportar ambas formas porque las plantillas
institucionales contemplan las dos alternativas.

==========================================================
18. CONTROL DE HISTORIAL DE CAMBIOS
==========================================================

Mostrar exactamente las columnas:

Versión

Descripción del Cambio

Fecha de Actualización

Mantener:

1.0
2.0
3.0...

para versiones formales.

NO registrar una devolución como nueva versión formal.

==========================================================
19. FIRMA Y REVISIÓN
==========================================================

NO cambiar documentEngine.

Informe y Plan deben seguir usando:

ModalFirmaDocumental

RevisorDocumentEngineView

ModalDevolverDocumental

artifactHistory

reviewRound

formalVersion

signatures

observations

flowStages

La revisión continúa página por página.

==========================================================
20. DESCARGA FINAL
==========================================================

Mantener exactamente la regla ya implementada:

solo el usuario que ejecutó la validación final puede mostrar:

DESCARGAR DOCUMENTO FINAL

No modificar.

==========================================================
21. MIS DOCUMENTOS
==========================================================

Mantener la pantalla unificada actual.

Para Informe ya NO mostrar:

ESTRUCTURA DEMO

Mostrar:

Informe

Formato institucional:
UTA-SGC-A-2-1-P7-T2

Para Plan:

Formato:
UTA-SGC-A-2-1-P7-T1

No saturar la tabla; el número de formato puede verse en el detalle.

==========================================================
22. ADMINISTRACIÓN → PLANTILLAS
==========================================================

Cambiar:

Informe
ESTRUCTURA PENDIENTE DE DEFINICIÓN INSTITUCIONAL

por:

Informe

Formato:
UTA-SGC-A-2-1-P7-T2

Estado:
ACTIVA

Plan:

Formato:
UTA-SGC-A-2-1-P7-T1

Estado:
ACTIVA

No inventar una tercera plantilla.

==========================================================
23. ESCENARIO DEMO PRINCIPAL
==========================================================

Demostrar:

Andrea
↓
Mis Documentos
↓
Nuevo Documento
↓
Informe
↓
Origen:
Derivado de Plan de Trabajo
↓
Plan relacionado:
Unidad de Titulación — 1.0
↓
Carrera
↓
Antecedentes
↓
Desarrollo

Las actividades y medios aparecen automáticamente.

Andrea completa:

Porcentaje de ejecución
Observaciones
↓
Conclusiones
↓
Oportunidades de mejora
↓
Registro de contactos:
No aplica
↓
Anexos:
No aplica
↓
Previsualización oficial T2
↓
Firma
↓
Enviar
↓
Carlos
↓
Bandeja de Revisión
↓
Tipo:
Informe
↓
Revisar página por página
↓
DEVOLVER
o
APROBAR Y FIRMAR
↓
Validación final