# PROMPT MAESTRO — REFACTORIZACIÓN POST-REUNIÓN INSTITUCIONAL

## Sistema de Gestión Documental Académica — FISEI / UTA

Estás trabajando sobre un prototipo avanzado en **React + TypeScript + Vite** de un sistema institucional para la FISEI — Universidad Técnica de Ambato.

El sistema ya posee múltiples módulos funcionales y un motor documental compartido. **NO se debe reconstruir el proyecto desde cero ni reemplazar componentes aprobados innecesariamente.**

Tu trabajo consiste en realizar una **refactorización transversal posterior a una reunión de validación con usuarios institucionales**, incorporando las observaciones obtenidas sin destruir las funcionalidades existentes.

---

# 1. OBJETIVO GENERAL

Ajustar el sistema actual para que:

1. El proceso de elaboración de Planes de Trabajo siga el mismo orden lógico que el documento institucional.
2. El flujo de creación sea más natural para el docente.
3. Las actividades puedan gestionarse con mayor flexibilidad.
4. Responsables, recursos y medios de verificación respondan a escenarios reales.
5. La fecha de elaboración tenga comportamiento documental correcto.
6. El Plan T1 mantenga fidelidad con el formato institucional.
7. El Informe T2 continúe derivando correctamente información del Plan.
8. La revisión permita vincular visualmente una observación con una parte concreta del documento.
9. La firma del elaborador se exprese como **finalización de su elaboración**, no como una decisión manual de enrutamiento.
10. Los flujos de aprobación puedan variar según grupo institucional.
11. Las acciones en tablas sean más compactas mediante iconos comprensibles.
12. No se inventen reglas relacionadas con procesos institucionales todavía no confirmados, especialmente QIPOC.

---

# 2. REGLA FUNDAMENTAL: NO REGRESIONES

Antes de modificar código, revisar la arquitectura existente.

NO reemplazar componentes funcionales solo por preferencia personal.

NO modificar la identidad visual institucional general.

NO volver a introducir funcionalidades o errores que ya fueron corregidos.

Deben conservarse obligatoriamente las siguientes reglas.

### 2.1 Motor multidocumento

Plan e Informe son entidades documentales completamente independientes.

Crear, editar, firmar o enviar un Informe NO puede modificar el Plan del cual deriva.

Todas las operaciones documentales deben continuar trabajando contra un:

```ts
targetDocId
```

explícito o mecanismo equivalente seguro.

Debe mantenerse la arquitectura basada en mutaciones aisladas de documentos.

---

### 2.2 Plan e Informe independientes

Escenario de referencia:

```text
Plan de Trabajo — Unidad de Titulación
VALIDADO
EN EJECUCIÓN
Firmas: 3 de 3
```

Crear posteriormente un Informe asociado a ese Plan NO debe cambiar absolutamente ninguno de esos valores.

Ejemplo esperado:

```text
PLAN
VALIDADO
EN EJECUCIÓN
3/3 firmas
```

y simultáneamente:

```text
INFORME
BORRADOR
o
FIRMADO POR ELABORADOR
o
EN REVISIÓN
```

según el punto del flujo.

---

### 2.3 Versión formal ≠ ronda de revisión

Conservar estrictamente esta diferencia:

```ts
formalVersion = "1.0"
reviewRound = 1
```

Una devolución por observaciones NO genera:

```text
Versión 2.0
```

La corrección genera una nueva ronda de revisión.

Ejemplo:

```text
Versión formal 1.0
Ronda 1
→ DEVUELTO
→ EN CORRECCIÓN
→ Ronda 2
```

Una versión formal 2.0 únicamente puede surgir por una decisión institucional externa/formal.

---

### 2.4 Artefactos anteriores

Cuando una nueva ronda comienza:

* conservar artefacto anterior;
* conservar firmas anteriores como históricas;
* convertir observaciones resueltas en históricas;
* crear nuevo artefacto;
* solicitar nuevamente las firmas correspondientes.

Nunca sobrescribir silenciosamente el documento anterior.

---

### 2.5 T1 y T2

Mantener los formatos:

```text
UTA-SGC-A-2-1-P7-T1
UTA-SGC-A-2-1-P7-T2
```

Mantener la fidelidad visual ya alcanzada.

No volver a introducir:

* QR inventados;
* hashes ficticios;
* seriales ficticios;
* códigos criptográficos ficticios;
* sellos inexistentes;
* cargos institucionales inventados;
* autoridades fijas no confirmadas;
* metadatos técnicos visibles dentro del A4.

---

# 3. CORRECCIÓN PRINCIPAL — ORDEN DEL WIZARD DEL PLAN T1

La secuencia actual debe revisarse.

En la validación institucional se indicó que la introducción de la información debe guardar relación con el orden del documento.

La secuencia conceptual correcta debe ser:

```text
1. Información General
2. Contenido
3. Actividades
4. Matriz de Actividades
5. Anexos
6. Previsualización
7. Firma y Finalización
```

Si actualmente “Actividades” y “Matriz de Actividades” son pantallas separadas, pueden seguir siéndolo.

Lo importante es que:

```text
Información General
↓
Justificación / Objetivo
↓
Actividades
↓
Matriz
↓
Anexos
↓
Previsualización
↓
Firma
```

No debe volver a suceder:

```text
Información General
→ Actividades
→ Matriz
→ Contenido
```

porque ese fue uno de los problemas detectados.

---

# 4. PASO 1 — INFORMACIÓN GENERAL

Mantener los datos institucionales ya existentes.

Revisar especialmente:

* Unidad académica;
* Facultad;
* Carrera;
* Grupo institucional;
* Período académico;
* Fecha de elaboración.

Evitar campos redundantes.

La Carrera debe depender conceptualmente de la Facultad correspondiente.

No convertir esta pantalla en un formulario gigante.

Usar información precargada del usuario cuando esté disponible.

---

# 5. FECHA DE ELABORACIÓN — CORRECCIÓN IMPORTANTE

Actualmente debe existir una diferencia conceptual entre:

```text
fecha actual del sistema
```

y:

```text
fecha de elaboración del documento
```

La fecha de elaboración NO puede cambiar cuando posteriormente:

* un revisor abre el documento;
* otro usuario firma;
* el documento cambia de etapa;
* se consulta el documento días después.

La fecha debe consolidarse cuando el elaborador finaliza formalmente la elaboración.

Modelo conceptual sugerido:

```ts
draftCreatedAt
elaborationFinalizedAt
```

o equivalente.

El documento A4 debe mostrar:

```text
Fecha de elaboración = fecha consolidada al finalizar la elaboración
```

Una vez establecida:

```text
NO modificar automáticamente.
```

No usar la fecha actual cada vez que el componente renderiza.

---

# 6. PASO 2 — CONTENIDO DEL PLAN

Esta etapa debe contener como mínimo:

```text
1. JUSTIFICACIÓN
2. OBJETIVO
```

Mantener el asistente IA ya existente.

La IA:

* propone;
* compara texto original vs sugerido;
* NO sobrescribe automáticamente;
* requiere que el docente acepte explícitamente.

---

# 7. PRECARGA DE JUSTIFICACIÓN

Incorporar capacidad de cargar un **texto base editable** para la Justificación.

Ejemplo conceptual:

```text
Texto institucional/preconfigurado
↓
docente puede:
- editarlo;
- ampliarlo;
- reemplazarlo;
- eliminarlo.
```

NO debe ser un texto obligatorio inmutable.

La fuente del texto puede ser una plantilla/configuración DEMO por grupo.

No inventar contenido normativo nuevo.

---

# 8. PASO 3 — ACTIVIDADES

Debe existir realmente la posibilidad de:

```text
+ AGREGAR ACTIVIDAD
```

No limitar el prototipo a actividades precargadas.

Una actividad podrá provenir de:

* POA;
* Plan de Mejoras;
* Acción de Mejora;
* otra categoría configurada;
* actividad libre.

Debe existir una opción:

```text
Actividad
```

o:

```text
Otra actividad
```

para cuando no corresponda a POA, Plan de Mejora o Acción de Mejora.

No obligar al docente a inventar una categoría institucional.

---

# 9. CREACIÓN DE ACTIVIDAD LIBRE

Permitir ingresar:

```text
Nombre de actividad *
Categoría (opcional)
```

Si se utiliza:

```text
Otra
```

permitir:

```text
Especificar categoría
```

pero la categoría NO debe convertirse en requisito para crear una actividad ordinaria.

---

# 10. PASO 4 — MATRIZ DE ACTIVIDADES

La matriz debe mantener la estructura institucional T1.

Cada actividad debe permitir configurar:

```text
Actividad
Cronograma:
  Desde
  Hasta
Responsable(s)
Recursos
Medios de verificación
```

Mantener fecha completa:

```text
DD/MM/YYYY
```

Validar:

```text
Desde <= Hasta
```

y mantener las restricciones ya existentes relacionadas con período y feriados.

No eliminar validaciones funcionales previamente aprobadas.

---

# 11. RESPONSABLES — REFACTORIZACIÓN

Este punto debe mejorar significativamente.

Actualmente debe permitirse:

```text
1 responsable
N responsables
Todos los integrantes del grupo
```

Regla:

```text
mínimo = 1
```

La interfaz debería utilizar selección múltiple con checkboxes.

Ejemplo:

```text
☑ Andrea Pérez
☑ Carlos López
☐ Juan ...
☐ María ...

□ Seleccionar todos
```

Cuando se seleccionen todos los integrantes del grupo, evitar imprimir una lista innecesariamente enorme.

Mostrar una denominación colectiva según el tipo de grupo.

Ejemplos conceptuales:

Para Comisión:

```text
Integrantes de la Comisión
```

Para Unidad:

```text
Integrantes de la Unidad
```

Para Club:

```text
Integrantes del Club
```

NO hardcodear:

```text
Responsables de la comisión
```

para todos los tipos de grupo.

La estructura debe derivarse del objeto `Grupo institucional`.

---

# 12. RESPONSABLES Y BASE DE DATOS

El selector debe consumir conceptualmente miembros asociados al grupo.

Para el prototipo puede usar mock data, pero la arquitectura debe representar:

```text
Usuario
↕
Membresía de Grupo
↕
Grupo Institucional
```

No usar listas totalmente independientes sin relación con el grupo.

No implementar backend real si no es necesario para el prototipo.

---

# 13. RECURSOS — CATÁLOGO + OTRO

Mantener el catálogo administrable existente.

El docente debe poder:

```text
☑ Material digital
☑ Sistema institucional
☐ Documentación física
☐ Laboratorio
...
```

Agregar:

```text
☐ Otro
```

Al seleccionar Otro:

```text
Especifique el recurso
[________________________]
```

Permitir múltiples recursos.

---

# 14. MEDIOS DE VERIFICACIÓN — CATÁLOGO + OTRO

Misma lógica.

Ejemplos disponibles DEMO pueden incluir:

```text
Informe
Acta
Registro
Resolución
Registro fotográfico
Certificado
Ficha
```

pero NO convertir esta lista en una lista normativa cerrada.

Agregar:

```text
Otro
```

con:

```text
Especifique el medio de verificación
```

Mantener la regla existente:

```text
Cada medio seleccionado requiere exactamente 1 PDF durante la ejecución.
```

No confundir:

```text
medio de verificación
```

con:

```text
archivo/evidencia cargado posteriormente.
```

---

# 15. ADMINISTRACIÓN DE CATÁLOGOS

Administración debe seguir permitiendo configurar:

```text
Actividades
Recursos
Medios de verificación
```

No duplicar catálogos.

Las opciones personalizadas creadas mediante “Otro” no necesariamente deben convertirse automáticamente en elementos globales del catálogo.

Evitar esa decisión automática.

---

# 16. FUENTE Y ELABORADO POR — T1

Actualmente revisar el pie de:

```text
Tabla 1.- Matriz de actividades
```

Deben considerarse dos conceptos diferentes.

## Fuente

Debe ser editable.

Ejemplo:

```text
Fuente:
[________________________]
```

Puede corresponder a:

* una comisión;
* un documento;
* una resolución;
* otra fuente institucional.

No asumir automáticamente siempre la misma.

---

## Elaborado por

Debe generarse automáticamente.

Debe derivarse del grupo institucional responsable de la planificación.

Ejemplo conceptual:

```text
Elaborado por: Unidad de Titulación
```

o:

```text
Elaborado por: Comisión de Eventos Académicos
```

NO pedir al docente escribir ese dato manualmente.

NO confundirlo con el nombre individual del usuario si el formato institucional hace referencia al órgano responsable.

Mantener la apariencia exacta exigida por T1.

---

# 17. HISTORIAL DE CAMBIOS

Primera entrada creada automáticamente.

Para Plan:

```text
Versión: v1.0
Descripción del cambio: Elaboración del Plan de Trabajo
Fecha de actualización: <fecha consolidada>
```

Para Informe:

```text
Versión: v1.0
Descripción del cambio: Elaboración inicial del Informe
Fecha de actualización: <fecha correspondiente>
```

No utilizar:

```text
Emisión inicial
```

si contradice el texto acordado para el escenario.

---

# 18. ÚLTIMO PASO DEL DOCENTE — CAMBIAR CONCEPTO

Actualmente pueden existir textos como:

```text
Firma y Envío
ENVIAR A REVISIÓN
FIRMAR Y CONTINUAR
```

Para el elaborador, cambiar el concepto principal a:

```text
FIRMA Y FINALIZACIÓN
```

CTA principal:

```text
FIRMAR Y FINALIZAR
```

Texto auxiliar:

```text
Al finalizar, el documento continuará automáticamente al siguiente nivel configurado del flujo institucional.
```

El docente NO debe tener que decidir manualmente:

```text
“¿a quién envío?”
```

Eso lo determina el flujo.

---

# 19. TRANSICIÓN INTERNA DE ESTADOS

Internamente puede seguir existiendo algo equivalente a:

```text
LISTO PARA FIRMA
↓
FIRMADO POR ELABORADOR
↓
EN REVISIÓN
```

Pero desde UX debe percibirse como una operación coherente.

Ejemplo:

```text
[FIRMAR Y FINALIZAR]
```

Firma correcta:

```text
✓ Documento firmado correctamente.
La elaboración ha finalizado.
El documento continúa al siguiente nivel de revisión.
```

Después:

```text
EN REVISIÓN
```

No dejar al usuario atrapado en una pantalla esperando presionar otro botón redundante.

---

# 20. FIRMA ELECTRÓNICA

Mantener el modal existente.

Debe incluir:

```text
Documento
Grupo
Firmante
Cargo

Certificado .p12 / .pfx
Contraseña del certificado
Ubicación dentro del documento
Confirmación de revisión
```

Mantener:

```text
El certificado y su contraseña se utilizan únicamente durante el proceso de firma y no se almacenan permanentemente.
```

Mantener únicamente en interfaz:

```text
Mecanismo de firma sujeto a integración institucional.
```

NO incorporar esta advertencia dentro del documento A4.

---

# 21. UBICACIÓN DE FIRMA

Mantener `signatureSlots` reales.

NO volver a usar:

```ts
pageCount - 1
```

como heurística principal.

NO hardcodear:

```text
Página 4
Página 5
```

Debe derivarse de la estructura real:

```ts
artifact.pages
artifact.signatureSlots
```

Cada slot debe identificar:

```ts
role
action
label
pageIndex
pageNumber
```

---

# 22. INFORME T2 DERIVADO DEL PLAN

Mantener la funcionalidad existente.

Al seleccionar:

```text
Derivado de un Plan de Trabajo
```

el sistema debe cargar automáticamente las actividades correspondientes al Plan seleccionado.

NO duplicarlas manualmente.

El docente únicamente debe completar información de ejecución.

Ejemplo:

```text
Actividad
Medio de verificación
% de ejecución
Observaciones
```

---

# 23. QUITAR NOTAS INNECESARIAS DEL T2

En el documento final NO mostrar instrucciones destinadas al usuario como:

```text
Nota 1...
Nota 2...
Si deriva de...
```

cuando dichas instrucciones solo explican cómo llenar el formato.

Si el Informe está derivado del Plan:

```text
mostrar directamente la tabla.
```

No explicar dentro del documento por qué aparece.

---

# 24. INFORME INDEPENDIENTE

Mantener posibilidad funcional si ya existe.

Pero no mezclarlo con un informe derivado.

Cuando sea independiente:

```text
NO importar matriz del Plan.
```

Utilizar la estructura textual prevista para el formato.

No inventar procesos que no estén definidos.

---

# 25. PAGINACIÓN DINÁMICA

NO volver a hardcodear:

```ts
pageCount: 5
```

El total debe derivarse de:

```ts
artifact.pages.length
```

o fuente equivalente tipada.

Mantener:

```ts
DocumentPage[]
```

en el artefacto.

El visor debe funcionar con:

```text
3
4
5
6
8
N páginas
```

---

# 26. REVISIÓN DOCUMENTAL — NUEVA MEJORA SOLICITADA

Incorporar una herramienta simple para relacionar visualmente una observación con una zona del documento.

NO crear un editor PDF complejo.

NO agregar decenas de herramientas.

Agregar solamente:

```text
RESALTAR Y OBSERVAR
```

o equivalente.

---

# 27. FUNCIONAMIENTO DEL RESALTADO

Flujo deseado:

```text
1. Revisor abre documento.
2. Activa modo “Resaltar”.
3. Selecciona visualmente una zona de la página.
4. Se crea un resaltado semitransparente.
5. Sistema abre campo:
   “Agregar observación”
6. Revisor escribe observación.
7. Guardar.
```

La observación queda vinculada a:

```ts
pageNumber
anchor
observationId
```

---

# 28. REPRESENTACIÓN DEL ANCLA

Si el visor permite overlay HTML sobre el A4, usar coordenadas normalizadas.

Modelo conceptual:

```ts
interface DocumentObservationAnchor {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

Los valores deberían ser relativos:

```text
0..1
```

y no píxeles absolutos.

Así el resaltado continúa alineado aunque cambie el zoom.

---

# 29. RELACIÓN OBSERVACIÓN ↔ RESALTADO

Mostrar un número pequeño:

```text
1
2
3
```

junto al highlight.

En panel lateral:

```text
Observación 1
Página 3

“Corregir redacción del objetivo...”

[IR AL RESALTADO]
```

Al pulsar:

```text
IR AL RESALTADO
```

navegar a la página y enfocar visualmente la anotación.

---

# 30. SIMPLICIDAD DE LA HERRAMIENTA

Solo implementar inicialmente:

```text
Resaltado rectangular/selección
+
Observación
```

NO implementar:

* dibujo libre;
* lápiz;
* tachado;
* flechas;
* múltiples colores manuales;
* editor tipo Acrobat;
* edición del contenido PDF;
* comentarios flotantes complejos.

La reunión solicitó algo fácil de comprender.

---

# 31. INMUTABILIDAD DEL ARTEFACTO

MUY IMPORTANTE.

El resaltado NO modifica el artefacto firmado.

Debe vivir como metadata del proceso de revisión:

```ts
DocumentObservation
```

El artefacto A4 permanece inmutable.

Conceptualmente:

```text
Artefacto firmado
+
capa de revisión
```

No:

```text
artefacto firmado modificado.
```

---

# 32. DEVOLUCIÓN CON OBSERVACIONES

Mantener:

```text
EN REVISIÓN
→ DEVUELTO
→ EN CORRECCIÓN
```

Cuando se devuelve:

* observaciones permanecen activas;
* resaltados permanecen visibles para el elaborador;
* elaborador puede acceder directamente a la observación;
* no modificar formalVersion.

---

# 33. NUEVA RONDA

Cuando el docente termine de corregir:

```text
PREPARAR NUEVA RONDA
```

Internamente:

* artefacto anterior → histórico;
* firmas anteriores → históricas;
* observaciones resueltas → históricas;
* nuevo artefacto;
* `reviewRound + 1`;
* firma nuevamente requerida.

Mantener:

```text
formalVersion = 1.0
```

salvo decisión institucional.

---

# 34. FLUJOS CONFIGURABLES POR GRUPO

Mantener y reforzar esta capacidad.

Cada:

```text
Grupo institucional
```

puede disponer de su propio:

```text
Flujo de aprobación
```

No asumir que todas las comisiones siguen exactamente:

```text
Docente
→ Carlos
→ Patricia
```

Eso es solamente un escenario DEMO.

---

# 35. TIPOS DE ETAPA

Revisar si el modelo actual soporta adecuadamente distintos tipos de etapa.

Debe permitir conceptualmente:

```text
Elaboración
Revisión con firma
Validación con firma
Aprobación/registro sin firma individual
```

Si es necesario ampliar el modelo, hacerlo de manera limpia.

Ejemplo conceptual:

```ts
actionMode:
  | "SIGN_AND_APPROVE"
  | "APPROVE_ONLY"
```

No implementar todavía un proceso externo real.

---

# 36. CONSEJO DIRECTIVO / ETAPAS SIN FIRMA PERSONAL

La reunión indicó que puede haber procesos donde la siguiente instancia sea un órgano y no una persona individual.

Por tanto, permitir conceptualmente una etapa como:

```text
Consejo Directivo
```

sin tener que inventar:

```text
Nombre del firmante
Cargo del firmante
Firma electrónica individual
```

Pero:

NO configurar automáticamente Consejo Directivo para todos los grupos.

Debe depender del flujo configurado.

---

# 37. QIPOC — NO IMPLEMENTAR COMO REGLA DEFINITIVA

IMPORTANTE.

Durante la reunión NO quedó definido definitivamente:

* quién envía por QIPOC;
* cuándo se descarga;
* quién vuelve a registrar el documento;
* quién adjunta el respaldo;
* si el coordinador valida después;
* qué evidencia se exige;
* si QIPOC forma parte del sistema o es externo.

Por tanto:

**NO crear un flujo QIPOC definitivo.**

NO hardcodear:

```text
Docente → QIPOC → Coordinador
```

NO hardcodear:

```text
Coordinador debe subir QIPOC
```

NO hardcodear:

```text
QIPOC obligatorio
```

---

# 38. TRATAMIENTO TEMPORAL DE QIPOC

Si es necesario mostrar conceptualmente algo, usar únicamente una etiqueta neutral:

```text
Proceso institucional externo
Pendiente de validación
```

o no mostrarlo todavía.

Puede dejarse un extension point en el modelo, pero sin comportamiento productivo.

No alterar el flujo actual basándose en una hipótesis.

---

# 39. ACCIONES DE TABLAS — USAR ICONOS

Refactorizar progresivamente las columnas:

```text
ACCIONES
```

de las tablas principales.

Actualmente existen demasiados botones con texto.

Ejemplo actual:

```text
VER
VER OBSERVACIONES
CONTINUAR CORRECCIÓN
ACTIVIDADES
CONTINUAR
```

Convertir mayormente a iconos.

---

# 40. ICONOS PROPUESTOS

Ejemplos conceptuales:

```text
👁 / Eye
Ver documento

✏️ / Pencil
Continuar edición / Corregir

💬 / MessageSquare
Ver observaciones

📋 / ListChecks
Actividades

▶ / Play
Continuar

⬇ / Download
Descargar

🕘 / History
Historial
```

Preferir iconos de la librería ya usada en el proyecto.

NO introducir una nueva librería si ya existe Lucide, Heroicons u otra equivalente.

---

# 41. TOOLTIP Y ACCESIBILIDAD

Cada botón iconográfico DEBE incluir:

```html
title="Ver documento"
```

y:

```html
aria-label="Ver documento"
```

Ejemplo:

```tsx
<button
  title="Ver observaciones"
  aria-label="Ver observaciones"
>
  <MessageSquare />
</button>
```

Nunca dejar un icono sin explicación.

---

# 42. EXCEPCIONES AL USO DE ICONOS

No convertir absolutamente todos los CTA a iconos.

Mantener texto en acciones importantes como:

```text
FIRMAR Y FINALIZAR
DEVOLVER DOCUMENTO
APROBAR Y FIRMAR
GUARDAR
CANCELAR
NUEVO DOCUMENTO
```

Los iconos deben utilizarse principalmente en:

```text
tablas
filas
acciones compactas
```

---

# 43. ESTADOS VISUALES

Mantener semántica:

```text
Azul → acción primaria / institucional
Verde → completado / validado
Amarillo → requiere atención / corrección
Rojo → error / destructivo
Gris → pendiente / neutral
```

No volver a introducir morado como color dominante.

---

# 44. FORMATOS T1/T2 — NO TOCAR SIN NECESIDAD

La fidelidad visual actual requirió múltiples correcciones.

Por tanto:

NO rediseñar los A4.

NO “modernizar” las plantillas.

NO cambiar arbitrariamente:

* tipografía;
* tamaños;
* espaciados;
* portada;
* footer;
* tablas;
* encabezado;
* índice;
* firmas;
* control de cambios.

Modificar únicamente lo necesario para los nuevos requerimientos funcionales.

---

# 45. NO REINTRODUCIR TÍTULO DUPLICADO

El T2 debe continuar mostrando:

```text
INFORME DE: SEGUIMIENTO DE ACTIVIDADES DE TITULACIÓN
```

y nunca:

```text
INFORME DE: INFORME DE SEGUIMIENTO...
```

Mantener la normalización existente.

---

# 46. `currentUser` Y CONTEXTO

Mantener distinción estricta:

```text
currentUser = persona autenticada
activeContext = rol/contexto utilizado
```

Cambiar contexto NO puede convertir a Andrea en Carlos.

En DEMO puede simularse otra sesión.

Pero una misma persona no debe cambiar de identidad por seleccionar un rol.

---

# 47. FIRMA E IDENTIDAD

Cada firma debe comprobar:

```text
currentUser.id === signer.id
```

y:

```text
signer está asignado a la etapa actual
```

No permitir firmar por otro usuario mediante cambio de vista.

---

# 48. T2 — PORCENTAJES

En Informe derivado:

```text
0..100
```

Validar numéricamente.

No permitir:

```text
-10
150
texto
```

La tabla A4 debe mostrar:

```text
85%
100%
```

sin barras visuales.

---

# 49. T2 — CORRESPONDENCIA CON T1

Si T2 deriva de T1:

La cantidad y nombre de actividades deben provenir del Plan relacionado.

Nunca utilizar actividades DEMO distintas al Plan real seleccionado.

Ejemplo:

```text
Plan Unidad de Titulación
5 actividades
```

→ Informe derivado:

```text
exactamente esas actividades
```

hasta que el modelo institucional permita otra regla.

---

# 50. PRUEBAS MANUALES OBLIGATORIAS

Después de implementar, ejecutar los siguientes escenarios.

## ESCENARIO A — Orden del Plan

Crear nuevo Plan.

Confirmar:

```text
Información General
→ Contenido
→ Actividades
→ Matriz
→ Anexos
→ Previsualización
→ Firma y Finalización
```

---

## ESCENARIO B — Fecha

Crear Plan el:

```text
07/09/2026
```

Finalizar elaboración.

Cambiar de sesión/revisor.

Abrir posteriormente.

Debe continuar mostrando:

```text
07/09/2026
```

No fecha del revisor.

---

## ESCENARIO C — Nueva actividad

Agregar:

```text
Actividad: Reunión de seguimiento académico
Categoría: Actividad
```

Debe aparecer en matriz.

---

## ESCENARIO D — Responsables

Probar:

```text
1 responsable
2 responsables
todos los integrantes
```

Los tres casos deben ser válidos.

---

## ESCENARIO E — Otro recurso

Seleccionar:

```text
Otro
```

Escribir recurso.

Debe guardarse correctamente.

---

## ESCENARIO F — Otro medio

Seleccionar:

```text
Otro
```

Escribir medio.

Debe conservarse en la matriz.

---

## ESCENARIO G — T2 derivado

Crear Informe a partir del Plan Unidad de Titulación.

Debe importar automáticamente las actividades del Plan.

---

## ESCENARIO H — Aislamiento

Firmar Informe.

Verificar:

```text
Informe → cambia estado.
Plan → absolutamente intacto.
```

---

## ESCENARIO I — Firma finalización

Elaborador pulsa:

```text
FIRMAR Y FINALIZAR
```

Firma correctamente.

Resultado esperado:

```text
EN REVISIÓN
```

sin requerir un segundo botón redundante de envío.

---

## ESCENARIO J — Observación resaltada

Revisor abre página 3.

Resalta zona.

Registra:

```text
“Revisar la redacción de este párrafo.”
```

Debe quedar:

```text
Página 3
Resaltado 1
Observación 1
```

Botón:

```text
IR AL RESALTADO
```

debe llevar a esa región.

---

## ESCENARIO K — devolución

Revisor devuelve.

Docente debe visualizar:

* observación;
* página;
* resaltado.

Formal version:

```text
1.0
```

Ronda:

```text
1
```

---

## ESCENARIO L — nueva ronda

Docente corrige.

Prepara reenvío.

Resultado:

```text
formalVersion = 1.0
reviewRound = 2
```

---

## ESCENARIO M — iconos

Todas las acciones compactas de una tabla deben:

* mostrar icono;
* mostrar tooltip/title;
* tener `aria-label`;
* ejecutar la misma acción que antes.

---

# 51. PRUEBAS DE REGRESIÓN IMPORTANTES

Confirmar que continúan funcionando:

```text
Plan VALIDADO / EN EJECUCIÓN
Informe independiente del Plan
Revisión
Devolución
Corrección
Nueva ronda
Firma del revisor
Validación final
Auditoría
Notificaciones
Histórico
Admin
Catálogos
Plantillas T1/T2
```

---

# 52. TYPESCRIPT

Ejecutar:

```bash
npx tsc --noEmit
```

Debe terminar con:

```text
0 errores.
```

NO solucionar errores utilizando indiscriminadamente:

```ts
any
```

Si el modelo requiere una nueva estructura, tiparla correctamente.

---

# 53. BUILD

Ejecutar:

```bash
npm run build
```

Debe terminar correctamente.

---

# 54. NO HACER

No:

* reconstruir la aplicación;
* cambiar toda la paleta;
* cambiar T1/T2 sin necesidad;
* implementar backend;
* implementar firma criptográfica real;
* implementar QIPOC real;
* inventar reglamentos;
* inventar resoluciones;
* inventar autoridades;
* inventar hashes;
* inventar QR;
* eliminar historial;
* mezclar Plan e Informe;
* usar una variable global para modificar documentos;
* hardcodear `pageCount`;
* hardcodear páginas de firma;
* generar versión 2.0 por una devolución;
* convertir resaltados de revisión en modificaciones del artefacto firmado.

---

# 55. CRITERIO DE ÉXITO

El resultado debe sentirse como una mejora del sistema existente, no como otro prototipo distinto.

Debe poder demostrarse esta historia completa:

```text
DOCENTE
↓
crea Plan siguiendo el orden del formato
↓
define contenido
↓
define actividades
↓
completa matriz
↓
revisa documento
↓
firma y finaliza
↓

REVISOR
↓
revisa documento
↓
resalta una zona
↓
registra observación
↓
devuelve
↓

DOCENTE
↓
corrige
↓
genera Ronda 2
↓
firma y finaliza nuevamente
↓

REVISOR
↓
aprueba y firma
↓

SIGUIENTE ETAPA CONFIGURADA
↓
continúa según flujo institucional
```

Y paralelamente:

```text
PLAN VALIDADO
↓
EJECUCIÓN DE ACTIVIDADES
↓
EVIDENCIAS
↓
INFORME T2 DERIVADO DEL PLAN
```

sin alterar el Plan original.

---

# 56. ENTREGABLE FINAL DEL AGENTE

Al terminar, NO respondas únicamente “implementado”.

Genera un reporte detallado con:

```text
1. Archivos modificados
2. Cambios de modelo
3. Cambios del wizard T1
4. Cambios en actividades
5. Cambios en responsables
6. Cambios en recursos
7. Cambios en medios de verificación
8. Cambios en fecha de elaboración
9. Cambios en Fuente / Elaborado por
10. Cambios en Firma y Finalización
11. Cambios en revisión y resaltados
12. Cambios en flujos configurables
13. Cambios de iconos en tablas
14. Resultado de pruebas manuales
15. Resultado de tsc
16. Resultado de build
17. Elementos deliberadamente NO implementados
18. Riesgos o puntos todavía pendientes
```

En el apartado de elementos NO implementados debe aparecer explícitamente:

```text
QIPOC / procedimiento institucional externo:
PENDIENTE DE VALIDACIÓN INSTITUCIONAL.
No se ha creado una regla definitiva.
```

---