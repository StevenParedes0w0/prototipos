# NATURALEZA ACTUAL DEL PROYECTO — MUY IMPORTANTE

Este proyecto se encuentra actualmente en fase de:

**MOCKUP INTERACTIVO DE ALTA FIDELIDAD**

NO se está construyendo todavía la solución productiva definitiva.

El objetivo actual es disponer de un prototipo navegable, coherente y suficientemente funcional para:

- presentar el sistema a usuarios institucionales;
- validar requerimientos;
- validar flujos de trabajo;
- validar formularios;
- validar documentos T1 y T2;
- validar procesos de revisión;
- validar estados y transiciones;
- validar experiencia de usuario;
- recibir retroalimentación institucional;
- demostrar cómo funcionaría el sistema final.

Por lo tanto, el agente debe priorizar:

1. fidelidad visual;
2. coherencia funcional;
3. navegación completa;
4. comportamiento interactivo;
5. consistencia de datos DEMO;
6. representación correcta de los procesos;
7. ausencia de errores durante una demostración.

NO debe convertir innecesariamente el mockup en una arquitectura productiva.

---

## QUÉ SÍ DEBE FUNCIONAR

Aunque sea un mockup, las interacciones que se presentan al usuario deben funcionar.

Por ejemplo:

- crear un Plan;
- avanzar y retroceder entre pasos;
- seleccionar actividades;
- configurar una matriz;
- validar formularios;
- agregar anexos;
- visualizar T1/T2;
- firmar de manera simulada;
- enviar a revisión;
- cambiar estados;
- registrar observaciones;
- devolver documentos;
- corregir;
- aprobar;
- navegar entre distintos roles DEMO;
- subir/reemplazar evidencias simuladas;
- visualizar historial;
- crear un Informe desde un Plan;
- comprobar aislamiento entre documentos.

El objetivo es que durante una demostración el flujo parezca completo y coherente.

---

## QUÉ NO ES NECESARIO IMPLEMENTAR TODAVÍA

Salvo que sea indispensable para demostrar una pantalla o flujo, NO implementar infraestructura productiva real como:

- backend productivo;
- microservicios;
- autenticación institucional real;
- integración real con LDAP/SSO;
- base de datos productiva;
- almacenamiento real de documentos;
- almacenamiento cloud;
- envío real de correo;
- notificaciones push reales;
- firma electrónica criptográfica real;
- validación real de certificados;
- integración real con DTIC;
- generación PDF de producción;
- APIs externas reales;
- sistemas institucionales externos;
- procesamiento masivo;
- balanceadores;
- escalabilidad cloud;
- colas;
- Redis;
- observabilidad productiva;
- CI/CD institucional;
- seguridad de infraestructura definitiva.

Si alguna de estas funcionalidades aparece en el mockup, debe SIMULARSE de manera convincente.

Ejemplo:

El usuario puede seleccionar un archivo `.p12/.pfx`, escribir una contraseña y pulsar "Firmar".

El mockup puede representar exitosamente la firma y modificar el estado del documento.

NO es necesario realizar criptografía real ni integrar todavía el servicio institucional de firma.

---

## DATOS

Los datos actuales son datos DEMO.

Deben ser:

- coherentes entre pantallas;
- persistentes durante el escenario cuando sea necesario;
- suficientemente realistas;
- consistentes entre Plan, Informe, actividades, evidencias, usuarios y flujos.

Pero NO representan necesariamente registros institucionales reales.

No crear complejidad de persistencia productiva solo para conservar datos DEMO.

---

## PERSISTENCIA

Puede utilizarse estado de React, localStorage u otro mecanismo sencillo apropiado para el mockup.

Lo importante es que:

- una demostración no se rompa;
- un documento no modifique accidentalmente otro;
- las transiciones sean coherentes;
- sea posible restablecer escenarios DEMO.

No diseñar todavía la persistencia como si fuera la base de datos definitiva.

---

## ARQUITECTURA

Mantener el código suficientemente limpio, tipado y modular para evitar regresiones.

Sin embargo:

**no hacer sobreingeniería.**

No realizar refactors extensos únicamente para aproximarse a una futura arquitectura productiva si no aportan valor al mockup actual.

Una refactorización sí está justificada cuando:

- corrige un bug;
- evita corrupción de estados;
- evita regresiones;
- permite reutilizar una funcionalidad;
- facilita representar correctamente un requisito;
- mejora significativamente la estabilidad de la demostración.

---

## CRITERIO PRINCIPAL

Ante dos soluciones técnicamente válidas:

A. una implementación productiva compleja;

B. una implementación limpia, segura y suficiente para un mockup interactivo;

elegir **B**.

La implementación productiva será abordada posteriormente cuando los requerimientos hayan sido validados institucionalmente.

# Proyecto
Aplicativo web para la gestión documental académica de la Facultad de Ingeniería en Sistemas, Electrónica e Industrial (FISEI) de la Universidad Técnica de Ambato (UTA).

El sistema permite gestionar principalmente:

- Planes de Trabajo institucionales.
- Informes derivados de Planes de Trabajo.
- Actividades planificadas.
- Evidencias.
- Revisión documental.
- Firmas electrónicas.
- Seguimiento.
- Administración institucional.
- Trazabilidad e historial.

---

# 1. OBJETIVO DE ESTE ARCHIVO

Este archivo define las reglas obligatorias que cualquier agente de programación debe seguir antes de modificar el proyecto.

NO asumir que el comportamiento actual del código es correcto.

La fuente principal de verdad funcional es:

1. `requirements.md`
2. `implementation-status.md`
3. Código actual

Si existe contradicción entre el código y `requirements.md`, prevalece `requirements.md`.

Si una regla está marcada como:

- `CONFIRMADA`: debe implementarse.
- `PENDIENTE DE VALIDACIÓN INSTITUCIONAL`: no inventar comportamiento definitivo.
- `DEMO`: se puede representar visualmente para el prototipo, pero debe quedar claramente identificado como simulación cuando corresponda.

---

# 2. PRINCIPIOS GENERALES

## 2.1 No inventar reglas institucionales

No crear por iniciativa propia:

- Reglamentos.
- Resoluciones.
- Códigos institucionales ficticios.
- Autoridades ficticias definitivas.
- Procedimientos de reapertura.
- Prórrogas.
- Fechas extraordinarias.
- Flujos de aprobación universales.
- Reglas de firma no confirmadas.
- QR institucional falso.
- Identificadores institucionales inexistentes.

Cuando algo no esté definido en `requirements.md`, mantenerlo configurable o marcarlo como DEMO.

---

## 2.2 Prioridad: fidelidad institucional sobre creatividad

Los documentos T1 y T2 deben respetar visualmente los formatos institucionales proporcionados.

No rediseñar libremente los documentos A4.

Para la interfaz web sí se debe conservar un diseño moderno, limpio y coherente.

Diferenciar claramente:

- UI moderna de la aplicación.
- Documento institucional formal generado.

El documento institucional no debe parecer un dashboard web.

---

# 3. DOCUMENTOS OFICIALES

## 3.1 T1

Formato:

`UTA-SGC-A-2-1-P7-T1`

Corresponde a:

`Plan de Trabajo`

## 3.2 T2

Formato:

`UTA-SGC-A-2-1-P7-T2`

Corresponde a:

`Informe`

Los formatos deben respetar:

- Estructura.
- Orden.
- Encabezados.
- Tablas.
- Espaciado.
- Tamaños.
- Pie de página.
- Paginación.
- Secciones.
- Firmas.
- Historial.

No aproximarlos arbitrariamente.

---

# 4. REGLAS CRÍTICAS DE ARQUITECTURA

## 4.1 Aislamiento multidocumento

Cada documento debe ser una entidad independiente.

Nunca modificar otro documento como efecto colateral.

Todas las operaciones documentales deben trabajar mediante un identificador explícito:

`targetDocId`

Ejemplo conceptual:

```ts
mutateDocument(targetDocId, updater)
````

Nunca asumir que el documento seleccionado globalmente es el objetivo de una mutación.

Especialmente evitar que:

* Crear un Informe modifique el Plan base.
* Firmar un Informe cambie firmas del Plan.
* Devolver un documento cambie otro.
* Editar observaciones contamine otro artefacto.

---

# 5. ARTEFACTOS DOCUMENTALES

## 5.1 Inmutabilidad después de firmar

Cuando un documento se firma:

* El contenido firmado debe conservarse exactamente.
* El revisor debe visualizar exactamente el mismo artefacto firmado.
* No regenerar el documento a partir de datos editables después de la firma.
* No reconstruir silenciosamente el PDF.
* No alterar páginas existentes.

Si el documento es devuelto:

* Se crea una nueva ronda de revisión.
* Se genera un nuevo artefacto al reenviar.
* Las firmas anteriores permanecen como historial.
* Las firmas anteriores NO son válidas para el artefacto corregido.

---

# 6. PAGINACIÓN

Nunca hardcodear:

```ts
pageCount: 5
```

o cualquier otro número.

La fuente real debe ser:

```ts
artifact.pages.length
```

o equivalente tipado.

`pageCount` debe derivarse de la composición real del documento.

Si cambia el contenido y cambia el número de páginas:

* Navegación.
* Índices.
* Firmas.
* slots de firma.
* numeración.
* referencias.

deben adaptarse automáticamente.

---

# 7. FIRMA

## 7.1 Certificados

El sistema considera conceptual y provisionalmente certificados:

* `.p12`
* `.pfx`

con contraseña.

El archivo y contraseña:

* se utilizan únicamente durante el proceso de firma;
* NO deben almacenarse permanentemente;
* NO deben registrarse en logs;
* NO deben persistirse en localStorage;
* NO deben serializarse.

La integración técnica definitiva depende de DTIC/institución.

---

## 7.2 Identidad del firmante

El firmante siempre debe coincidir con:

* usuario autenticado;
* persona asignada a la etapa.

Diferenciar:

```ts
currentUser
```

de:

```ts
activeContext
```

Cambiar de contexto o rol nunca debe cambiar la identidad real del usuario.

---

## 7.3 Ubicación de firmas

No hardcodear:

* Página 4.
* Página 5.
* `pageCount - 1`.

El artefacto debe contener metadata real:

```ts
signatureSlots
```

Ejemplo:

```ts
{
  role: "docente",
  action: "ELABORADO_POR",
  label: "Elaborado por",
  pageIndex: 4,
  pageNumber: 4
}
```

La ubicación debe derivarse de las páginas generadas.

---

# 8. VERSIONES

No confundir:

## Versión formal del Plan

Ejemplos:

* 1.0
* 2.0
* 3.0

Solo cambia por decisión institucional formal.

Una devolución NO crea versión formal nueva.

## Ronda de revisión

Ejemplos:

* Ronda 1
* Ronda 2

Una devolución sí puede generar una nueva ronda.

## Versión de evidencia

Ejemplos:

* v1.0
* v2.0

Es independiente de la versión formal del Plan.

Nunca mezclar estos tres conceptos.

---

# 9. FLUJOS DE APROBACIÓN

Los flujos NO son universales.

Cada:

* grupo;
* comisión;
* unidad;

puede tener un flujo distinto.

Debe ser configurable.

Algunos destinos pueden ser órganos colegiados y no personas individuales.

No asumir que toda etapa:

* tiene nombre de firmante;
* requiere firma;
* requiere certificado.

---

# 10. RESPONSABLES DE ACTIVIDADES

Una actividad puede tener uno o varios responsables.

Debe existir opción:

`Seleccionar todos`

Cuando todos los integrantes aplicables del grupo/comisión sean seleccionados:

NO mostrar necesariamente todos los nombres concatenados en el documento final.

Debe permitirse representación colectiva, según lo solicitado institucionalmente, por ejemplo:

`Responsable de la comisión`

o denominación equivalente configurada para el grupo.

La selección individual sigue existiendo internamente para trazabilidad.

---

# 11. RECURSOS Y MEDIOS

Recursos y medios de verificación deben utilizar catálogos administrables.

Debe existir:

`Otro`

Al marcar `Otro`:

* aparece campo de texto;
* el valor es obligatorio;
* no permitir guardar vacío;
* mostrar error inline;
* conservar datos;
* enfocar el campo;
* contar solo valores no vacíos.

---

# 12. MEDIOS DE VERIFICACIÓN Y EVIDENCIAS

Durante la ejecución:

Cada medio de verificación seleccionado requiere exactamente:

`1 archivo PDF`

por evidencia.

No confundir:

* medio de verificación del Plan;
* anexo del documento;
* evidencia de ejecución.

Son entidades distintas.

---

# 13. OBSERVACIONES DE REVISIÓN

El revisor puede registrar:

* observaciones generales;
* observaciones asociadas a una sección/página;
* observaciones visuales.

Se requiere soporte de resaltado sencillo en el documento.

Objetivo:

Permitir seleccionar/resaltar visualmente una zona y asociarle una observación.

No implementar herramientas complejas de dibujo si no son necesarias.

Priorizar:

`resaltado + observación`

---

# 14. UI

## 14.1 Acciones

En tablas, priorizar iconos en lugar de texto cuando la acción sea comprensible.

Ejemplos:

* 👁 Ver
* ✏ Editar
* 🗑 Eliminar
* ⬇ Descargar
* 📎 Evidencia
* 💬 Observaciones

Todo botón iconográfico debe tener:

```html
title=""
```

y preferiblemente:

```html
aria-label=""
```

No reemplazar por iconos acciones críticas ambiguas sin tooltip.

---

## 14.2 Paleta

Usar principalmente:

* Azul institucional.
* Blanco.
* Gris claro.
* Verde semántico.
* Amarillo/ámbar para advertencia.
* Rojo solamente para error/destrucción.

Evitar morado como color predominante.

---

# 15. TEXTOS Y NOMBRES

El concepto general es:

`Gestión Documental Académica`

Evitar inconsistencias residuales como:

* Gestión de Planes de Trabajo.
* Mis Planes de Trabajo.

cuando se refiera al sistema general.

Puede utilizarse:

`Plan de Trabajo`

cuando específicamente se habla de ese tipo documental.

---

# 16. DOCUMENT ENGINE

El motor documental debe ser reutilizable.

No duplicar lógica de T1/T2 innecesariamente.

Debe soportar:

* DocumentArtifact.
* DocumentPage.
* signatureSlots.
* páginas dinámicas.
* artefactos inmutables.
* versionado.
* rondas.
* observaciones.
* historial.

Evitar `any` si existe estructura tipable.

No utilizar variables globales como:

```ts
window.previewPages
```

---

# 17. ESTADO

No derivar UI desde textos visuales.

Estados deben ser constantes/enums coherentes.

Ejemplos:

* BORRADOR
* FIRMADO_POR_ELABORADOR
* EN_REVISION
* DEVUELTO
* EN_CORRECCION
* VALIDADO
* EN_EJECUCION
* FINALIZADO

No crear sinónimos arbitrarios para un mismo estado.

---

# 18. PERSISTENCIA DEMO

El prototipo puede utilizar localStorage.

Sin embargo:

* no almacenar certificados;
* no almacenar contraseñas;
* no crear dependencias ocultas de estado;
* no permitir corrupción multidocumento.

Al recargar se acepta que algunos escenarios DEMO se reinicialicen mientras no se pretenda simular persistencia productiva.

---

# 19. REGLA DE CAMBIOS

Antes de modificar una funcionalidad:

1. Leer `requirements.md`.
2. Leer `implementation-status.md`.
3. Identificar componentes afectados.
4. Evitar regresiones.
5. Implementar.
6. Ejecutar:

```bash
npx tsc --noEmit
npm run build
```

7. Probar manualmente los escenarios afectados.

---

# 20. PROHIBICIÓN DE REGRESIONES

No modificar funcionalidades ya correctas solo por “mejorar” arquitectura visual.

Especial cuidado con:

* filtros históricos;
* aislamiento multidocumento;
* pageCount dinámico;
* firma;
* versiones;
* rondas;
* evidencias;
* notificaciones;
* auditoría;
* estados;
* documentos T1/T2.

---

# 21. CRITERIO DE TERMINACIÓN

Una tarea no está terminada solamente porque:

```bash
tsc --noEmit
```

pase.

Debe comprobarse también:

* comportamiento;
* UI;
* datos;
* consistencia institucional;
* navegación;
* estados;
* documento generado;
* ausencia de regresiones.

---

# 22. CUANDO HAYA DUDA

No inventar.

Añadir comentario:

`PENDIENTE DE VALIDACIÓN INSTITUCIONAL`

o mantener la opción configurable.

El objetivo del prototipo es representar fielmente el proceso conocido, no inventar normativa.

````
