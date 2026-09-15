Sí. En este punto conviene darle al agente un **prompt quirúrgico**, porque el visor T1/T2, A4, fullscreen, scroll, encabezados y responsables colectivos ya pasaron la revisión visual. No queremos que una corrección pequeña provoque una regresión grande.

Puedes enviarle este prompt completo:

````text
# MICROCORRECCIÓN FINAL — FORMATO INSTITUCIONAL DE FECHAS EN T1/T2
## Gestión Documental Académica FISEI — Mockup interactivo de alta fidelidad

Quiero realizar una corrección MUY ACOTADA sobre el sistema actual.

IMPORTANTE:
La infraestructura documental T1/T2 que ya funciona se considera APROBADA visual y funcionalmente.

NO realices refactorizaciones generales.
NO rediseñes el visor.
NO cambies la estructura A4.
NO alteres los flujos documentales.
NO cambies datos DEMO salvo que sea estrictamente necesario para una prueba.
NO modifiques reglas institucionales.
NO aproveches esta tarea para “mejorar” otras partes del proyecto.

El objetivo es corregir exclusivamente una inconsistencia visual detectada en las fechas impresas dentro de los documentos institucionales.

---

# 1. PROBLEMA DETECTADO

En la previsualización del Plan de Trabajo T1, específicamente en la tabla:

`MATRIZ DE ACTIVIDADES`

las fechas del cronograma actualmente pueden mostrarse directamente en formato ISO, por ejemplo:

`2026-09-02`
`2026-09-27`
`2026-09-03`
`2026-09-22`

Eso es correcto como representación INTERNA del dato, pero no como presentación del documento institucional.

La representación visual esperada en las celdas del documento debe ser:

`02/09/2026`
`27/09/2026`
`03/09/2026`
`22/09/2026`

Es decir:

`DD/MM/YYYY`

---

# 2. REGLA FUNDAMENTAL

Debemos separar estrictamente:

## Representación interna

Debe mantenerse preferentemente como fecha ISO:

`YYYY-MM-DD`

Ejemplo:

`2026-09-02`

Esto es correcto para:

- estado interno;
- formularios;
- comparación de fechas;
- persistencia;
- validaciones;
- localStorage;
- lógica del motor;
- reglas de feriados;
- deadlines;
- pruebas que requieran valores normalizados.

NO cambies estas estructuras internas a strings `DD/MM/YYYY`.

## Representación institucional visible

Cuando una fecha de calendario almacenada como `YYYY-MM-DD` sea impresa dentro del documento formal T1/T2, debe mostrarse como:

`DD/MM/YYYY`

Ejemplo:

`2026-09-02`

debe renderizarse como:

`02/09/2026`

Por tanto, la corrección pertenece a la capa de PRESENTACIÓN / COMPOSICIÓN DEL ARTEFACTO, no al modelo de datos.

---

# 3. MUY IMPORTANTE — EVITAR ERROR DE ZONA HORARIA

No quiero que esta corrección introduzca el típico bug de JavaScript:

```ts
new Date("2026-09-02")
````

seguido de una conversión a hora local.

El proyecto usa Ecuador / `America/Guayaquil`, GMT-5.

Una fecha `YYYY-MM-DD` representa aquí una fecha CIVIL, no un instante UTC.

No debe existir ninguna posibilidad de que:

`2026-09-02`

termine mostrándose como:

`01/09/2026`

por un desplazamiento de zona horaria.

Para fechas ISO puras `YYYY-MM-DD`, utiliza una transformación timezone-safe.

Una solución válida sería conceptualmente:

```ts
const [year, month, day] = isoDate.split("-");
return `${day}/${month}/${year}`;
```

o una utilidad equivalente robusta.

No es obligatorio utilizar exactamente ese código, pero la solución debe evitar conversiones UTC/local innecesarias.

---

# 4. ALCANCE DE LA AUDITORÍA

Primero localiza todos los consumidores relevantes de fechas dentro de la generación/renderizado documental.

Revisa al menos:

* composición T1;
* matriz de actividades T1;
* composición T2;
* tablas T2 que puedan utilizar fechas de actividades;
* artefactos derivados de Planes;
* índices o bloques documentales si imprimen fechas;
* cualquier helper de fechas utilizado por `DocumentPdfPageViewer`;
* funciones de composición dentro del motor documental.

Busca explícitamente lugares donde se imprima directamente algo similar a:

```ts
activity.startDate
activity.endDate
actividad.desde
actividad.hasta
date
```

sin pasar por un formatter institucional.

No quiero que arregles solamente una celda concreta si existe el mismo escape ISO en otro punto del documento.

PERO:

la auditoría debe estar limitada a las fechas que aparecen DENTRO DEL ARTEFACTO DOCUMENTAL T1/T2.

No cambies arbitrariamente el formato de fechas en:

* administración;
* auditoría;
* listas;
* formularios;
* historial técnico;
* estado interno;
* pruebas;
* datos DEMO;

salvo que exista una razón directamente vinculada al artefacto institucional.

---

# 5. CREAR UNA ÚNICA UTILIDAD DE PRESENTACIÓN

Si actualmente no existe una función central adecuada, crea una utilidad pequeña y reutilizable, por ejemplo conceptualmente:

```ts
formatInstitutionalDate(...)
```

El nombre exacto puede seguir las convenciones existentes del proyecto.

Debe cumplir al menos:

```text
2026-09-02 -> 02/09/2026
2026-12-31 -> 31/12/2026
2026-01-05 -> 05/01/2026
```

No debe romper:

* strings vacíos;
* `undefined`;
* valores ya preparados específicamente para otro tipo de presentación;
* fechas que no tengan el patrón exacto `YYYY-MM-DD`.

No conviertas indiscriminadamente cualquier string que contenga guiones.

Preferiblemente detectar explícitamente:

```regex
^\d{4}-\d{2}-\d{2}$
```

Si un valor no coincide, debe preservarse o tratarse de manera segura según la arquitectura existente.

---

# 6. NO CAMBIAR “FECHA DE ELABORACIÓN”

ATENCIÓN:

En las capturas ya aprobadas, el encabezado institucional muestra correctamente fechas como:

`15 de septiembre de 2026`

Esto se considera CORRECTO.

NO conviertas esa fecha a:

`15/09/2026`

La corrección de `DD/MM/YYYY` aplica principalmente a fechas tabulares/campos de cronograma donde actualmente se está filtrando el valor ISO sin formatear.

Debemos conservar la diferencia semántica:

## Fecha de elaboración institucional

Puede seguir mostrándose como:

`15 de septiembre de 2026`

## Cronograma / Desde / Hasta

Debe verse como:

`02/09/2026`

`27/09/2026`

Por tanto, no crees una regla global que reemplace todas las fechas visibles del sistema.

---

# 7. T1 — COMPORTAMIENTO ESPERADO

En:

`MATRIZ DE ACTIVIDADES`

las columnas:

`Desde`
`Hasta`

deben utilizar `DD/MM/YYYY`.

Ejemplo esperado:

| Actividades                                     | Desde      | Hasta      |
| ----------------------------------------------- | ---------- | ---------- |
| Seguimiento al avance de trabajos de titulación | 02/09/2026 | 27/09/2026 |
| Difusión de normativa interna de titulación     | 03/09/2026 | 22/09/2026 |

NO debe aparecer:

`2026-09-02`

en el artefacto visual.

---

# 8. T2 — AUDITORÍA PREVENTIVA

El T2 ya fue corregido y visualmente aprobado.

No quiero modificar su estructura.

Únicamente verifica si alguna tabla o sección del Informe puede imprimir directamente fechas ISO provenientes del Plan relacionado o de actividades.

Si existe, aplica la misma utilidad de presentación.

Si T2 no contiene actualmente campos de este tipo o ya están correctamente formateados, NO cambies nada.

No inventes campos adicionales.

---

# 9. NO REGRESIONAR LO YA APROBADO

Estas características están APROBADAS y deben permanecer EXACTAMENTE funcionales:

## T1

* A4.
* Portada.
* Encabezado institucional.
* `Unidad académica` o `Unidad administrativa` según procedencia.
* Facultad + Carrera dentro de la celda institucional cuando corresponda.
* portada centrada.
* índice dinámico.
* matriz landscape cuando corresponda.
* `Responsable de la unidad` cuando se seleccionan todos los responsables.
* IDs individuales preservados internamente.
* firmas.
* control de historial de cambios.
* footer:

  * izquierda: `Documento de uso interno controlado por la Universidad Técnica de Ambato`
  * centro: `Formato Nº: UTA-SGC-A-2-1-P7-T1`
  * derecha: página dinámica.
* sin línea horizontal superior en footer.
* A4 portrait/landscape según metadata.
* `pageCount = artifact.pages.length`.
* `signatureSlots` dinámicos.
* fullscreen real.
* scroll vertical/horizontal.
* conservación de página y zoom al entrar/salir del fullscreen.

## T2

* A4.
* encabezado académico correcto.
* encabezado administrativo correcto.
* Carrera visible solo para procedencia académica.
* Carrera eliminada de metadata para procedencia administrativa.
* `Unidad académica` / `Unidad administrativa`, nunca literal combinado.
* visor expandido real.
* scroll.
* toolbar.
* panel documental.
* páginas dinámicas.
* firmas.
* historial.
* footer T2.
* aislamiento absoluto respecto al Plan fuente.

No quiero una regresión en ninguna de estas áreas.

---

# 10. RESPONSABLES — NO TOCAR

Ya está aprobado este comportamiento:

Si TODOS los integrantes válidos de la unidad/grupo son responsables:

se imprime una etiqueta colectiva como:

`Responsable de la unidad`

o la etiqueta colectiva vigente según el tipo de grupo.

Internamente deben seguir existiendo todos los IDs/nombres.

Si solo se seleccionan algunos:

se muestran responsables individuales.

NO modifiques esta lógica durante esta microcorrección.

---

# 11. PRUEBA UNITARIA / MOTOR PARA EL FORMATTER

Añade una prueba específica para el formatter si la arquitectura lo permite.

Debe comprobar mínimo:

```text
2026-09-02 -> 02/09/2026
2026-12-31 -> 31/12/2026
2026-01-05 -> 05/01/2026
```

Y también:

* no timezone shift;
* valor vacío no provoca excepción;
* `undefined` no provoca excepción;
* un string que no es `YYYY-MM-DD` no se corrompe.

No hace falta sobreingeniería.

---

# 12. PRUEBA E2E DE REGRESIÓN

Añade o amplía una prueba Playwright focalizada.

Puede formar parte de la prueba visual T1 existente o de una regresión funcional específica.

Debe:

1. restaurar DEMO;
2. abrir/crear un T1 con matriz;
3. llegar a previsualización;
4. navegar a la matriz;
5. comprobar que aparecen fechas `DD/MM/YYYY`;
6. comprobar que los valores ISO correspondientes NO aparecen visibles en la tabla.

Ejemplo conceptual:

Debe encontrar:

`02/09/2026`

y NO:

`2026-09-02`

No acoples la prueba innecesariamente a fechas DEMO que puedan variar si existe una estrategia mejor con el contenido de la actividad creada durante el test.

---

# 13. REGRESIÓN VISUAL

Inspecciona los snapshots ANTES de modificarlos.

Si el único cambio esperado en:

`t1-matriz-...png`

es:

```text
2026-09-02
```

→

```text
02/09/2026
```

ese cambio es legítimo.

Actualiza únicamente snapshots realmente afectados.

NO regeneres todos los snapshots indiscriminadamente.

En el reporte indica exactamente cuáles cambiaron y por qué.

---

# 14. NO USAR EMOJIS

Mantener la regla vigente:

NO añadir emojis visibles en la interfaz.

Si fuese necesario un indicador visual, usar iconos SVG/Lucide o el sistema de iconos existente.

Esta tarea probablemente no requiere añadir ninguno.

El test existente:

`tests/no-visible-emojis.test.mjs`

debe continuar pasando.

---

# 15. VALIDACIONES OBLIGATORIAS

Al finalizar ejecuta:

```bash
npx tsc --noEmit
npm run build
node --test tests/document-engine.test.mjs
node --test tests/a4-page-size.test.mjs
node --test tests/no-visible-emojis.test.mjs
```

Ejecuta además la prueba focalizada que hayas creado/modificado.

Después ejecuta:

```bash
npm run test:e2e
```

Resultado requerido:

* TypeScript PASS
* Build PASS
* Motor PASS
* A4 PASS
* No visible emojis PASS
* prueba focalizada PASS
* suite E2E completa PASS

No aceptes actualizar snapshots simplemente para conseguir PASS sin inspeccionar visualmente la diferencia.

---

# 16. INSPECCIÓN VISUAL OBLIGATORIA

Además de los tests, inspecciona visualmente como mínimo:

### T1 matriz

* Desde.
* Hasta.
* formato DD/MM/YYYY.
* tabla sin desbordamiento.
* página landscape intacta.
* footer intacto.
* responsable colectivo intacto.

### T1 portada

Confirmar que no cambió.

### T1 firmas/historial

Confirmar que no cambió.

### T2 portada

Confirmar que no cambió.

Si T2 tiene una tabla con fechas derivadas:
confirmar también formato correcto.

---

# 17. CRITERIO DE ACEPTACIÓN

La tarea solo se considera terminada cuando:

1. Los datos internos continúan en ISO `YYYY-MM-DD`.
2. Las fechas de cronograma del documento T1 se muestran `DD/MM/YYYY`.
3. No existe desfase de día por timezone.
4. `Fecha de elaboración` conserva el formato institucional largo actualmente aprobado.
5. T2 no presenta fugas ISO equivalentes.
6. No se rompe A4.
7. No se rompe landscape.
8. No se altera la composición institucional.
9. No se altera fullscreen.
10. No se altera scroll.
11. No se altera zoom.
12. No se altera el estado de página.
13. No se altera la lógica de responsables.
14. No se altera el flujo de firma/revisión.
15. No se altera la persistencia.
16. Todos los tests pasan.

---

# 18. REPORTE FINAL

Entrega un reporte breve pero técnico con exactamente estas secciones:

## Reporte — normalización visual de fechas institucionales

### 1. Causa raíz

Explicar dónde escapaban fechas ISO al renderer.

### 2. Corrección

Archivos y helper utilizados.

### 3. Separación modelo/presentación

Confirmar que internamente se mantiene `YYYY-MM-DD`.

### 4. Prevención de timezone

Explicar cómo se evitó el desplazamiento UTC/local.

### 5. T1

Indicar ejemplos antes/después.

### 6. T2

Indicar si existían o no fugas equivalentes y qué se hizo.

### 7. Regresión visual

Indicar snapshots inspeccionados y cuáles cambiaron.

### 8. Pruebas

Tabla con todos los comandos y resultado PASS/FAIL.

### 9. Archivos modificados

Lista exacta.

### 10. Riesgos restantes

Solo riesgos reales encontrados. No inventar pendientes.

---

# PRIORIDAD FINAL

Esta es una MICROCORRECCIÓN.

Prioridad:

1. corregir presentación de fechas;
2. evitar timezone bugs;
3. preservar absolutamente todo lo aprobado;
4. añadir una regresión automática;
5. no tocar nada fuera del alcance.

Si durante la auditoría descubres otro problema no relacionado, NO lo corrijas silenciosamente.

Regístralo en el reporte como hallazgo separado para que decidamos posteriormente si merece intervención.

```
