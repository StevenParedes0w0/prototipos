# CORRECCIÓN INTEGRAL PRIORITARIA — CREACIÓN DE PLANES + FIDELIDAD DOCUMENTAL T1

Antes de modificar cualquier archivo:

1. Lee COMPLETAMENTE:
   - `AGENTS.md`
   - `requirements.md`
   - `implementation-status.md`
   - toda la carpeta `Documentos_guia`
2. Inspecciona el código actual relacionado con:
   - creación de Plan de Trabajo;
   - prevención de duplicados;
   - datos DEMO y restauración DEMO;
   - motor documental;
   - composición/paginación T1;
   - visor A4;
   - portada institucional;
   - encabezados;
   - pies de página;
   - firmas;
   - historial de cambios.
3. No asumas que `implementation-status.md` contiene todos los consumidores.
4. Busca todos los lugares donde se construyen, clonan, restauran, visualizan o validan Planes de Trabajo.
5. No me entregues únicamente análisis: IMPLEMENTA las correcciones.

Este proyecto es exclusivamente un MOCKUP INTERACTIVO DE ALTA FIDELIDAD.
NO implementar backend, API real, base de datos productiva, firma criptográfica real, infraestructura, servicios externos ni integraciones DTIC.
Las simulaciones deben seguir siendo claramente simulaciones cuando corresponda.

---

# OBJETIVO DE ESTA PASADA

Resolver en una sola intervención dos grupos de problemas:

A. El sistema actualmente termina mostrando que prácticamente todas las combinaciones de grupo/período “ya existen”, dificultando o impidiendo crear un Plan nuevo durante la demostración.

B. El formato institucional T1 TODAVÍA NO reproduce correctamente varias correcciones visuales indicadas expresamente durante las reuniones, especialmente la portada y el pie de página.

NO realizar rediseños generales de la aplicación.
NO cambiar la identidad visual azul institucional.
NO alterar flujos que ya funcionan correctamente salvo que sean consumidores directos de estas correcciones.

---

# PARTE A — CORREGIR CREACIÓN Y DETECCIÓN DE PLANES DUPLICADOS

## A1. Regla canónica de unicidad

La única regla confirmada para impedir Planes duplicados es:

`docente autenticado + grupo institucional + período académico`

Debe existir como máximo un Plan de Trabajo por esa combinación.

La comparación debe usar identificadores estables, NO nombres visibles.

Ejemplo conceptual:

```ts
plan.teacherId === currentUser.id &&
plan.groupId === selectedGroupId &&
plan.periodId === selectedPeriodId
````

NO considerar duplicado solo porque:

* exista otro Plan del mismo período;
* exista otro Plan del mismo grupo pero de otro docente;
* exista otro Plan del mismo docente pero de otro grupo;
* exista otro documento de tipo Informe;
* exista un Plan histórico de otro período;
* exista un Plan relacionado a otro grupo;
* exista un documento DEMO con texto parecido;
* el nombre visible sea similar.

Normalizar estados y modelos sin usar coincidencias parciales por strings.

---

## A2. Auditar la causa real del problema actual

Actualmente, al abrir:

`Nuevo documento → Plan de Trabajo`

el sistema termina indicando para muchas o todas las opciones:

> “Ya existe un Plan para este docente, grupo y período.”

NO tapes el problema eliminando simplemente documentos arbitrariamente.

Determina por qué sucede realmente.

Revisar al menos:

* estado de `documents`;
* `mockDataDocument.ts`;
* inicialización de DEMO;
* función de creación;
* función de búsqueda de duplicados;
* restauración DEMO;
* persistencia local;
* posible acumulación de Planes creados en pruebas;
* documentos clonados;
* Planes generados por error;
* documentos históricos;
* estado restaurado tras reload;
* combinación entre datos iniciales y datos persistidos.

Si existen documentos legítimos para una combinación, deben seguir bloqueando el duplicado.

---

## A3. La interfaz debe distinguir claramente un duplicado real

Si existe exactamente el Plan:

Andrea + Unidad de Titulación + Julio–Diciembre 2026

entonces debe impedir:

Andrea + Unidad de Titulación + Julio–Diciembre 2026

Pero debe seguir permitiendo, por ejemplo:

Andrea + Club Académico de Software + Julio–Diciembre 2026

SI esa combinación exacta todavía no existe.

También debe permitir:

Andrea + Unidad de Titulación + Enero–Junio 2026

SI esa combinación exacta todavía no existe.

---

## A4. Mejorar el modal cuando existe el documento

Cuando haya un duplicado REAL, no basta con dejar el botón deshabilitado.

Mostrar:

> Ya existe un Plan de Trabajo para este docente, grupo y período.

Mostrar debajo información del Plan existente:

* grupo;
* período;
* versión formal;
* ronda;
* estado actual.

Y ofrecer una acción contextual válida:

* `Continuar borrador`, si está en BORRADOR;
* `Ver documento`, si ya fue firmado/enviado;
* `Continuar corrección`, si está EN CORRECCIÓN.

NO permitir crear una segunda entidad.

Usar preferentemente iconos cuando la acción sea compacta y el significado sea evidente, con `title` accesible.

---

## A5. Entorno DEMO utilizable

El mockup DEBE permitir demostrar la creación de un Plan nuevo.

Después de:

`Restablecer documentos DEMO`

debe existir al menos UNA combinación válida:

`docente actual + grupo disponible + período disponible`

que NO tenga un Plan existente y permita crear uno desde cero.

IMPORTANTE:

No inventes grupos ajenos a los grupos canónicos ya definidos.

Grupos institucionales canónicos disponibles:

* Unidad de Titulación
* Comisión de Eventos Académicos
* Comisión de Vinculación con la Sociedad
* Club Académico de Software

Puedes reorganizar qué combinaciones existen por defecto en DEMO siempre que mantengas escenarios suficientes para:

* documento BORRADOR;
* documento EN REVISIÓN;
* documento EN CORRECCIÓN;
* Plan VALIDADO/EN EJECUCIÓN;
* al menos una combinación completamente libre para crear un Plan nuevo.

NO llenar todas las combinaciones posibles.

---

## A6. Persistencia DEMO

Si el usuario crea manualmente un Plan para una combinación libre, desde ese momento esa combinación sí debe quedar ocupada durante esa sesión/persistencia DEMO.

`Restablecer documentos DEMO` debe volver al dataset canónico.

No mezclar documentos creados en una sesión anterior después del reset.

Verificar especialmente localStorage u otra persistencia usada actualmente.

---

# PARTE B — FIDELIDAD DEL FORMATO INSTITUCIONAL T1

ESTA PARTE ES PRIORITARIA.

No basta con que el documento “se parezca”.
Debe respetar las observaciones visuales expresadas en las reuniones y los archivos institucionales de `Documentos_guia`.

Audita el renderer/compositor T1 completo.

---

# B1. PORTADA — POSICIÓN VERTICAL DEL BLOQUE CENTRAL

La portada actual tiene el bloque:

`UNIDAD ACADÉMICA / ADMINISTRATIVA: ...`

`PLAN DE TRABAJO DE: ...`

`PERÍODO: ...`

demasiado abajo.

CORREGIRLO.

El bloque debe aparecer visualmente alrededor de la ZONA CENTRAL VERTICAL de la página A4, no pegado hacia el tercio inferior.

La intención visual debe ser aproximadamente:

ENCABEZADO INSTITUCIONAL
↓
espacio moderado
↓
UNIVERSIDAD TÉCNICA DE AMBATO
↓
espacio
↓
BLOQUE PRINCIPAL DEL DOCUMENTO
↓
espacio
↓
FOOTER

No debe existir un enorme espacio vacío entre:

`UNIVERSIDAD TÉCNICA DE AMBATO`

y

`UNIDAD ACADÉMICA / ADMINISTRATIVA`.

El conjunto:

* UNIDAD ACADÉMICA / ADMINISTRATIVA
* PLAN DE TRABAJO DE
* PERÍODO

debe comportarse como un bloque único y estar visualmente equilibrado alrededor de la mitad de la hoja.

NO usar coordenadas absurdamente específicas solo para la captura actual.
La composición debe resistir:

* nombres cortos;
* nombres largos de grupos;
* diferentes períodos;
* distinta resolución del visor.

---

# B2. CONTENIDO EXACTO DEL BLOQUE CENTRAL T1

Mantener el formato conceptual:

`UNIDAD ACADÉMICA / ADMINISTRATIVA: Facultad de Ingeniería en Sistemas, Electrónica e Industrial`

`PLAN DE TRABAJO DE: <NOMBRE DEL GRUPO>`

`PERÍODO: <PERÍODO ACADÉMICO>`

Los prefijos deben destacar tipográficamente.

El valor puede continuar en línea o saltar de línea de manera natural si no cabe.

Evitar:

* cortes arbitrarios;
* solapamientos;
* texto excesivamente grande;
* alineación demasiado baja;
* separación vertical desproporcionada.

---

# B3. FOOTER T1 — UNA SOLA FILA

ESTA CORRECCIÓN ES OBLIGATORIA.

Actualmente el pie aparece partido en múltiples líneas y además existe una línea horizontal superior.

Debe quedar en UNA SOLA FILA visual.

Estructura:

IZQUIERDA:
`Documento de uso interno controlado por la Universidad Técnica de Ambato`

CENTRO:
`Formato Nº: UTA-SGC-A-2-1-P7-T1`

DERECHA:
`<número de página>`

Todo debe pertenecer a la misma fila del footer.

No quiero:

`Documento de uso interno controlado por la Universidad`
`Técnica de Ambato`

en dos líneas.

Debe intentar mantenerse completo en una sola línea mediante:

* tamaño tipográfico institucional/discreto;
* anchuras razonables;
* flex/grid;
* distribución adecuada del espacio.

NO reducir el texto hasta hacerlo ilegible.

---

# B4. ELIMINAR COMPLETAMENTE LA LÍNEA HORIZONTAL DEL FOOTER

Actualmente existe una línea horizontal encima del pie de página.

ELIMINARLA.

No sustituir por:

* border-top;
* hr;
* pseudo-elemento;
* box-shadow que simule línea;
* borde parcial.

El footer debe flotar limpio sobre el fondo blanco, igual al modelo institucional.

Revisar TODAS las páginas T1.

No quiero que se elimine solo de la portada y permanezca en las páginas 2–N.

---

# B5. FOOTER CONSISTENTE EN TODAS LAS PÁGINAS

Página 1:

* texto institucional;
* Formato Nº;
* número 1.

Página 2:

* mismo footer;
* número 2.

Página N:

* mismo footer;
* número N.

Nunca:

* variar el texto;
* cambiar `Nº` por `N°`;
* mover el formato a otra fila;
* mostrar una línea superior;
* partir el texto institucional innecesariamente.

Texto exacto:

`Documento de uso interno controlado por la Universidad Técnica de Ambato`

Formato exacto:

`Formato Nº: UTA-SGC-A-2-1-P7-T1`

---

# B6. REVISAR LA PORTADA CONTRA EL DOCUMENTO GUÍA, NO CONTRA LA VERSIÓN ACTUAL

No tomes la implementación actual como fuente de verdad.

La fuente de verdad debe ser:

1. `Documentos_guia`;
2. `requirements.md`;
3. aclaraciones confirmadas en `implementation-status.md`.

Si la implementación contradice esos documentos, corregir implementación.

---

# B7. ENCABEZADO

Mantener encabezado institucional actual siempre que coincida con el documento guía.

Debe incluir:

* sello/logo institucional correspondiente;
* `SISTEMA DE GESTIÓN DE LA CALIDAD`;
* `UNIVERSIDAD TÉCNICA DE AMBATO`;
* `PLAN DE TRABAJO: <GRUPO>`;
* Unidad académica/administrativa;
* Carrera;
* Fecha de elaboración.

No inventar:

* hashes;
* QR;
* códigos de verificación;
* certificaciones;
* metadatos técnicos;
* sellos digitales ficticios.

---

# B8. FECHA DE ELABORACIÓN

La fecha mostrada debe provenir del documento.

Una vez firmado el artefacto:

* no debe cambiar silenciosamente;
* no debe utilizar `new Date()` en cada render;
* no debe actualizarse al recargar.

Debe permanecer vinculada al artefacto/documento generado.

---

# B9. ÍNDICES Y PAGINACIÓN DINÁMICA

NO volver a introducir `pageCount = 5` como fuente de verdad.

La composición debe continuar derivándose de:

`artifact.pages.length`

o del mecanismo tipado actual equivalente.

Los índices deben utilizar los números de página reales resultantes de la composición.

Si cambia el número de páginas por:

* número de actividades;
* anexos;
* firmas;
* contenido textual;

deben cambiar automáticamente:

* navegación;
* índice de contenido;
* índice de tablas;
* slots de firma;
* número del footer.

---

# B10. MATRIZ

NO modificar su estructura salvo que el documento guía muestre una diferencia concreta.

Preservar:

* Actividades;
* Cronograma Desde/Hasta;
* Responsable;
* Recursos;
* Medios de verificación.

Preservar orientación horizontal cuando corresponda.

La representación colectiva:

`Responsable de la unidad`
`Integrantes de la unidad`
`Responsable del club`
etc.

puede imprimirse cuando se haya seleccionado la totalidad de integrantes, pero los IDs individuales deben mantenerse internamente para trazabilidad.

---

# B11. FIRMAS

La tabla de firmas debe continuar siendo generada desde el flujo configurado.

NO volver a hardcodear:

* cantidad de firmantes;
* Página 4;
* Página 5;
* Carlos;
* Patricia;
* validador concreto.

Usar:

`signatureSlots`

y metadata del artefacto/páginas.

Si el grupo tiene flujo incompleto, mostrar:

> El flujo de aprobación de este grupo aún no está completamente configurado.

y NO inventar responsables.

---

# B12. HISTORIAL

Mantener:

`CONTROL DE HISTORIAL DE CAMBIOS`

Columnas:

* Versión
* Descripción del Cambio
* Fecha de Actualización

La corrección/devolución durante una ronda NO crea automáticamente versión formal 2.0.

Ronda de revisión y versión formal siguen siendo conceptos distintos.

---

# PARTE C — CORREGIR EL VISOR SIN CAMBIAR EL DOCUMENTO

Distinguir estrictamente:

1. layout del visor;
2. layout del documento A4.

No “arreglar” la portada desplazando externamente el canvas/página dentro del visor.

El cambio debe realizarse EN LA COMPOSICIÓN DEL DOCUMENTO.

Debe verse correctamente tanto:

* al 100%;
* usando Ajustar;
* en visor amplio;
* en modal;
* en paso de Previsualización.

---

# PARTE D — NO REGRESIONAR ESTAS FUNCIONALIDADES

NO romper:

* identidad de sesión separada del contexto;
* aislamiento multidocumento;
* Informe T2 independiente del Plan;
* firma DEMO;
* firma y envío separados;
* artefacto firmado inmutable;
* revisores paralelos;
* etapas secuenciales;
* observaciones;
* nueva ronda;
* versión formal independiente;
* evidencias;
* un PDF por medio;
* reemplazo y revalidación;
* estados históricos;
* paginación dinámica;
* `signatureSlots`;
* fecha congelada;
* validación de `Otro`;
* responsables múltiples;
* “Seleccionar todos”.

---

# PARTE E — ACCIONES DE TABLA

Aprovecha esta pasada únicamente donde corresponda a archivos que ya estés modificando.

Preferir iconos para acciones repetitivas de tablas:

* Ver → icono ojo
* Editar → lápiz
* Continuar → flecha/documento
* Observaciones → comentario
* Historial → reloj/historial
* Eliminar → papelera

Cada icono debe tener:

* `title`;
* `aria-label`.

NO convertir acciones críticas ambiguas en iconos sin ayuda.

Acciones principales de formularios como:

`Continuar`
`Guardar borrador`
`Firmar`
`Enviar a revisión`

pueden continuar con texto.

---

# PARTE F — PRUEBAS OBLIGATORIAS

Implementa pruebas automáticas donde el proyecto ya tenga infraestructura suficiente.

Como mínimo comprobar:

## Test de unicidad

Debe bloquear:

Andrea + Unidad de Titulación + Jul–Dic 2026
si ya existe exactamente esa combinación.

Debe permitir:

Andrea + Club Académico de Software + Jul–Dic 2026
si no existe.

Debe permitir:

Andrea + Unidad de Titulación + Ene–Jun 2026
si no existe.

Debe ignorar para unicidad un Informe T2.

---

## Test de reset DEMO

1. Crear un Plan en combinación inicialmente libre.
2. Verificar que pasa a considerarse duplicado.
3. Ejecutar Restablecer DEMO.
4. Confirmar que vuelve al dataset canónico.
5. Confirmar que vuelve a existir al menos una combinación disponible.

---

## Test de footer

Verificar estructuralmente que T1 genere:

`Documento de uso interno controlado por la Universidad Técnica de Ambato`

`Formato Nº: UTA-SGC-A-2-1-P7-T1`

y número de página.

No debe existir componente/borde dedicado a la línea horizontal superior.

---

## Test de paginación

La cantidad total debe corresponder a las páginas generadas, NO a una constante.

---

# PARTE G — VALIDACIÓN VISUAL MANUAL QUE DEBES PREPARAR

Después de implementar, deja el sistema DEMO en condiciones de que yo pueda hacer esta prueba:

### Escenario 1 — combinación existente

Gestión Documental Académica
→ Nuevo documento
→ Plan de Trabajo
→ seleccionar una combinación existente.

Debe aparecer:

> Ya existe un Plan de Trabajo para este docente, grupo y período.

y la acción contextual apropiada.

---

### Escenario 2 — combinación nueva

Cambiar a una combinación realmente libre.

`Crear borrador` debe habilitarse.

Crear el documento.

Debe abrir:

`Crear Plan de Trabajo`.

---

### Escenario 3 — portada

Completar lo mínimo y llegar a Previsualización.

Página 1 debe mostrar aproximadamente:

[Encabezado institucional]

```
      UNIVERSIDAD TÉCNICA
          DE AMBATO

  UNIDAD ACADÉMICA / ADMINISTRATIVA: ...
  
  PLAN DE TRABAJO DE: ...
  
  PERÍODO: ...
```

[Footer]

El bloque central NO debe quedar cerca del borde inferior.

---

### Escenario 4 — footer

Inspeccionar páginas 1, 2, 3, 4 y última.

Debe existir una sola fila:

`Documento de uso interno controlado por la Universidad Técnica de Ambato     Formato Nº: UTA-SGC-A-2-1-P7-T1     N`

SIN línea horizontal encima.

---

# PARTE H — CRITERIOS DE ACEPTACIÓN

No consideres la tarea terminada hasta cumplir TODOS:

[ ] La unicidad usa docenteId + groupId + periodId.
[ ] No se compara por nombre visible.
[ ] Informes no bloquean creación de Planes.
[ ] Después de Restablecer DEMO existe al menos una combinación libre.
[ ] Los duplicados reales continúan bloqueados.
[ ] Existe acción para continuar/ver el documento existente.
[ ] La portada T1 mueve el bloque institucional principal hacia la zona vertical media.
[ ] No queda exageradamente abajo.
[ ] El footer completo está en una única fila.
[ ] Se usa exactamente `Nº`.
[ ] La línea horizontal sobre el footer desapareció.
[ ] Todas las páginas T1 usan el mismo footer.
[ ] El número de página es dinámico.
[ ] pageCount continúa siendo dinámico.
[ ] signatureSlots continúan siendo dinámicos.
[ ] No se rompe firma DEMO.
[ ] No se rompe aislamiento multidocumento.
[ ] No se inventan requisitos institucionales.
[ ] T1 sigue siendo un mockup interactivo, no un sistema productivo.

---

# PARTE I — EJECUCIÓN TÉCNICA FINAL

Al finalizar ejecutar obligatoriamente:

```bash
npx tsc --noEmit
npm run build
node tests/document-engine.test.mjs
```

Si existe otro test suite relevante del proyecto, ejecútalo también.

No ocultes fallos.

---

# PARTE J — REPORTE FINAL

Crear o actualizar:

`reporte-correccion-integral.md`

con estas secciones:

1. Causa del problema de duplicados.
2. Lógica anterior.
3. Lógica corregida.
4. Dataset DEMO resultante.
5. Cambios exactos realizados al T1.
6. Posicionamiento anterior y nuevo de portada.
7. Implementación nueva del footer.
8. Archivos modificados.
9. Tests ejecutados.
10. Regresiones revisadas.
11. Pendientes institucionales reales.
12. Ruta manual exacta para validar la implementación.

Incluye explícitamente:

* qué combinación DEMO queda libre para crear un Plan nuevo;
* qué combinación DEMO debe bloquear por duplicidad;
* cómo se calcula actualmente `pageCount`;
* cómo se calculan actualmente `signatureSlots`.

---

# REGLA FINAL DE TRABAJO

NO hagas cambios cosméticos aleatorios.
NO reestructures módulos que no lo necesitan.
NO reemplaces lógica dinámica con valores quemados.
NO inventes datos institucionales.
NO cambies requisitos confirmados.

Inspecciona primero la implementación real, identifica la causa, corrige la fuente del problema y después corrige todos sus consumidores.

Por el chat responde de forma mínima durante la ejecución.
Al finalizar entrega únicamente un resumen corto y la ruta del `reporte-correccion-integral.md`.