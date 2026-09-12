Lee COMPLETAMENTE antes de modificar cualquier archivo:

1. `AGENTS.md`
2. `requirements.md`
3. `implementation-status.md`
4. Todo el contenido de la carpeta `Documentos_guia/`, incluyendo documentos institucionales, formatos, referencias visuales y cualquier archivo relacionado.

NO empieces a modificar código hasta haber terminado de revisar esas fuentes y haber inspeccionado suficientemente el repositorio actual.

# OBJETIVO

Quiero que realices una auditoría integral del mockup interactivo actual y posteriormente implementes todas las correcciones necesarias para que los requisitos CONFIRMADOS del proyecto estén correctamente representados y sean demostrables de extremo a extremo.

Este proyecto es exclusivamente un MOCKUP INTERACTIVO DE ALTA FIDELIDAD.

NO debes convertirlo en una implementación productiva.

No implementar:
- backend real;
- servicios externos reales;
- infraestructura productiva;
- criptografía real;
- certificados reales;
- firma electrónica productiva;
- almacenamiento remoto;
- APIs externas reales;
- autenticación institucional real;
- despliegues productivos;

salvo que alguna pieza ya exista y sea estrictamente necesaria para mantener funcionando el mockup.

Cuando una funcionalidad necesite simular comportamiento real, utiliza datos y lógica DEMO coherentes.

---

# FUENTES DE VERDAD Y PRIORIDAD

Aplica esta prioridad cuando encuentres contradicciones:

1. `requirements.md`
   - Fuente principal de requisitos funcionales y decisiones confirmadas en reuniones.

2. Documentos institucionales dentro de `Documentos_guia/`
   - Fuente principal para fidelidad documental, estructura, terminología y apariencia de los formatos oficiales.

3. `implementation-status.md`
   - Describe qué existe actualmente, qué está incompleto y qué problemas conocidos deben revisarse.
   - NO debe interpretarse como especificación superior a `requirements.md`.

4. Código actual
   - Representa el estado de implementación, pero NO debe considerarse automáticamente correcto.

5. `AGENTS.md`
   - Define reglas de trabajo, restricciones técnicas, convenciones y comportamiento esperado del agente.

Si detectas una contradicción que no pueda resolverse con estas fuentes:

NO inventes una solución institucional.

Mantén el comportamiento:
- configurable;
- neutral;
- DEMO;
- o explícitamente pendiente de decisión institucional,

según corresponda.

---

# FASE 1 — AUDITORÍA ANTES DE IMPLEMENTAR

Primero inspecciona el sistema actual contra todas las fuentes anteriores.

No te limites a los archivos mencionados en `implementation-status.md`.

Debes localizar TODOS los consumidores de cada comportamiento afectado.

Revisa, entre otros:

- modelos y tipos;
- datos DEMO;
- hooks;
- estado global/local;
- navegación;
- vistas;
- wizards;
- modales;
- tablas;
- drawers;
- componentes compartidos;
- motor documental;
- generación de artefactos;
- flujos de aprobación;
- firmas simuladas;
- revisiones;
- observaciones;
- evidencias;
- informes;
- planes de trabajo;
- administración;
- auditoría;
- notificaciones;
- reportes;
- histórico;
- cierre de períodos;
- permisos por actor;
- localStorage;
- componentes reutilizados;
- estilos;
- textos;
- datos duplicados;
- estados derivados;
- contadores;
- relaciones entre documentos.

Construye INTERNAMENTE una matriz:

REQUISITO
→ ESTADO ACTUAL
→ DISCREPANCIA
→ ARCHIVOS AFECTADOS
→ DEPENDENCIAS
→ CORRECCIÓN NECESARIA

No hace falta mostrarme esta matriz completa por chat.

---

# FASE 2 — ORDEN DE IMPLEMENTACIÓN

Después de la auditoría crea internamente un plan por dependencias.

Implementa en este orden:

## 1. Problemas estructurales

Corrige primero cualquier problema que pueda generar inconsistencias en múltiples módulos.

Ejemplos:

- estado compartido accidentalmente;
- mutaciones entre documentos;
- identidad del usuario;
- contexto activo;
- relaciones Plan ↔ Informe;
- datos DEMO inconsistentes;
- estados documentales;
- versiones formales;
- rondas de revisión;
- artefactos documentales;
- flujo de aprobación;
- permisos;
- contadores derivados;
- paginación;
- páginas dinámicas;
- slots de firma;
- persistencia;
- duplicación de fuentes de estado.

Evita parches locales si existe una causa estructural común.

---

## 2. Fidelidad documental

Revisa minuciosamente los formatos institucionales disponibles en `Documentos_guia/`.

Los documentos fuente tienen prioridad para:

- estructura;
- encabezados;
- tablas;
- textos;
- denominaciones;
- numeración;
- tipografía cuando pueda reproducirse razonablemente en el mockup;
- tamaños relativos;
- espaciado;
- alineación;
- orientación;
- portada;
- índices;
- matrices;
- firmas;
- historial;
- footer;
- distribución vertical;
- saltos de página.

No inventes elementos institucionales.

No añadir:

- códigos QR ficticios;
- hashes ficticios;
- seriales;
- sellos digitales inventados;
- resoluciones inexistentes;
- autoridades no confirmadas;
- normativas no confirmadas;
- metadatos criptográficos falsos.

La interfaz moderna del sistema puede conservar su diseño actual.

La fidelidad estricta aplica principalmente al DOCUMENTO FORMAL renderizado.

---

## 3. Funcionalidades pendientes

Implementa todos los requisitos confirmados que todavía no estén correctamente demostrados.

No basta con que exista un componente.

El flujo debe poder probarse desde la interfaz.

Comprueba especialmente flujos completos como:

CREAR
→ EDITAR
→ PREVISUALIZAR
→ FIRMAR SIMULADAMENTE
→ ENVIAR
→ REVISAR
→ OBSERVAR / DEVOLVER / APROBAR
→ CORREGIR
→ NUEVA RONDA
→ VALIDAR

cuando el requisito correspondiente exista.

Comprueba también la relación:

PLAN DE TRABAJO
→ ACTIVIDADES
→ EVIDENCIAS
→ INFORME

sin que un documento pueda mutar o sobrescribir accidentalmente a otro.

---

# FASE 3 — UX Y CONSISTENCIA

Revisa la aplicación completa buscando:

- acciones redundantes;
- botones innecesariamente verbosos;
- tablas demasiado anchas;
- modales sin scroll;
- drawers incompletos;
- elementos que desaparecen;
- acciones sin feedback;
- botones habilitados incorrectamente;
- errores silenciosos;
- información duplicada;
- estados contradictorios;
- datos DEMO que cambian según la pantalla;
- terminología inconsistente;
- acciones destructivas ambiguas;
- navegación sin retorno claro.

En tablas, utiliza preferentemente ICONOS para acciones frecuentes cuando sea comprensible.

Cada icono debe incluir como mínimo:

- `title`;
- `aria-label`;

describiendo claramente su acción.

No conviertas absolutamente todas las acciones en iconos si ello perjudica la comprensión.

Las acciones principales de flujo pueden conservar texto.

---

# FASE 4 — VALIDACIÓN DE DATOS DEMO

Los datos DEMO deben ser coherentes entre todas las pantallas.

Un mismo:

- usuario;
- grupo;
- actividad;
- documento;
- fecha;
- período;
- estado;
- versión;
- ronda;
- evidencia;
- observación;
- firmante;

debe mantener la misma información en todos sus consumidores.

NO arregles inconsistencias creando múltiples copias diferentes del mismo dato si puede existir una fuente común.

Los escenarios DEMO deben permitir demostrar los casos importantes del sistema.

---

# FASE 5 — PROTECCIÓN CONTRA REGRESIONES

No destruyas funcionalidades que actualmente estén correctas.

Antes de cambiar una implementación compartida, localiza sus consumidores.

No hagas refactors cosméticos masivos sin necesidad.

No reemplaces componentes estables únicamente por preferencia personal.

No elimines datos o comportamientos existentes salvo que contradigan explícitamente los requisitos.

No utilices comandos destructivos de Git.

No hagas:

`git reset --hard`

ni descartes cambios existentes del usuario.

Si existe trabajo no relacionado con esta tarea, consérvalo.

---

# FASE 6 — REVISIÓN FINAL COMPLETA

Cuando termines de implementar, recorre nuevamente los requisitos.

No des por cumplido un requisito simplemente porque exista código relacionado.

Comprueba que sea realmente:

- visible;
- interactuable;
- coherente;
- demostrable;
- consistente con el actor correspondiente.

Busca además regresiones transversales.

Revisa especialmente:

- Docente;
- Revisor;
- Coordinador;
- Validador final;
- Administrador;

cuando dichos actores correspondan al escenario DEMO.

---

# VERIFICACIÓN TÉCNICA

Al terminar ejecuta por separado o encadenados correctamente:

```bash
npx tsc --noEmit
npm run build
````

O:

```bash
npx tsc --noEmit && npm run build
```

Si aparece un error:

NO te limites a reportarlo.

Investiga la causa, corrígelo y vuelve a ejecutar las comprobaciones.

No finalices la tarea con errores de TypeScript o build evitables.

---

# REPORTE FINAL

Crea en la raíz del proyecto:

`reporte.md`

Debe contener:

## 1. Problemas encontrados

Agrupados por:

* estructurales;
* funcionales;
* documentales;
* UX;
* datos DEMO;
* consistencia;
* regresiones detectadas.

## 2. Cambios realizados

Explica brevemente qué se corrigió y por qué.

## 3. Archivos modificados

Archivo + propósito principal de la modificación.

## 4. Requisitos cumplidos

Relaciona las correcciones con requisitos concretos de `requirements.md`.

## 5. Requisitos pendientes por decisión institucional

Incluye ÚNICAMENTE requisitos realmente no definidos institucionalmente.

No confundas:
“no implementado”
con
“pendiente de decisión institucional”.

Si un requisito está definido pero faltaba implementarlo, debes implementarlo.

## 6. Pruebas automáticas realizadas

Incluye resultado de:

* `npx tsc --noEmit`
* `npm run build`

## 7. Pruebas manuales que debo realizar

Dame instrucciones EXACTAS y cortas:

Inicio
→ menú
→ opción
→ botón
→ acción
→ resultado esperado.

Organízalas por escenario.

Prioriza pruebas de extremo a extremo y zonas modificadas.

---

# REGLAS IMPORTANTES

No inventes requisitos institucionales.

No conviertas este proyecto en producción.

No implementes tecnología innecesaria para el mockup.

No cambies arbitrariamente decisiones ya confirmadas.

No soluciones síntomas si existe una causa estructural común.

No asumas que `implementation-status.md` contiene todos los archivos afectados.

No confíes automáticamente en datos mock existentes: contrástalos con los requisitos.

No declares un requisito cumplido sin comprobar su representación en la interfaz.

No finalices después de una corrección parcial si existen más discrepancias confirmadas.

Trabaja hasta dejar representados correctamente todos los requisitos confirmados que sean viables dentro del alcance del mockup interactivo.

---

# COMUNICACIÓN DURANTE LA EJECUCIÓN

Por el chat escribe respuestas MÍNIMAS.

Evita narrar cada archivo que lees o cada pequeño cambio realizado.

Solo informa cuando:

* exista un bloqueo real;
* exista una contradicción que ninguna fuente pueda resolver;
* necesites una decisión mía que sea realmente imprescindible;
* ocurra un problema que imposibilite continuar;
* hayas finalizado.

No pidas confirmación para decisiones que ya estén determinadas por los documentos.

Si algo puede resolverse razonablemente mediante las fuentes disponibles, resuélvelo y continúa.

Al finalizar, dame únicamente:

1. estado general;
2. cantidad/resumen de correcciones relevantes;
3. resultado de TypeScript;
4. resultado de build;
5. ubicación de `reporte.md`.