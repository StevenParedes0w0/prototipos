# AUDITORÍA E2E Y CORRECCIÓN INTEGRAL
# ASISTENTE IA + ADMINISTRACIÓN + PLANTILLAS + CATÁLOGOS + RESET DEMO
# Gestión Documental Académica FISEI

Fecha de referencia: 15 de septiembre de 2026.

Proyecto:
Mockup interactivo de alta fidelidad de Gestión Documental Académica FISEI.

IMPORTANTE:
Este NO es un proyecto productivo todavía.

No implementar en esta tarea:
- backend real;
- PostgreSQL;
- APIs externas reales;
- Groq;
- OpenAI;
- AWS;
- S3;
- DTIC;
- autenticación institucional real;
- criptografía real;
- firma electrónica productiva;
- correo real;
- notificaciones push reales.

Esta fase debe seguir siendo un mockup interactivo robusto, verificable y reproducible.

La futura arquitectura de IA y base de datos se abordará en otra tarea.

---

# 1. OBJETIVO

Realiza una auditoría profunda de cinco áreas que todavía pueden esconder inconsistencias funcionales:

1. Asistente IA de redacción.
2. Configuración administrativa de plantillas T1/T2.
3. Panel General / Dashboard de Administración.
4. Catálogos institucionales consumidos por T1/T2.
5. Persistencia y límites de los mecanismos de reset DEMO.

No te limites a leer código.

Debes:

- inspeccionar la implementación;
- ejecutar la aplicación;
- probarla mediante Playwright;
- reproducir comportamientos reales;
- localizar causas raíz;
- corregir bugs demostrados;
- añadir regresiones automáticas;
- volver a ejecutar la suite completa.

No des por correcto un comportamiento solo porque TypeScript compile.

---

# 2. FUENTES DE VERDAD

Antes de modificar código, revisa obligatoriamente:

- AGENTS.md
- requirements.md
- implementation-status.md
- package.json
- playwright.config.ts
- src/documentEngine/
- src/modulo7/
- src/modulo11/
- cualquier módulo relacionado con IA, plantillas, unidades institucionales y administración;
- tests/document-engine.test.mjs
- tests/a4-page-size.test.mjs
- tests/institutional-date-format.test.mjs
- tests/no-visible-emojis.test.mjs
- tests/e2e/
- Documentos_guia/

Revisa también los reportes recientes existentes en el repositorio si están disponibles.

NO modifiques requirements.md para que coincida con el código.

Si existe una contradicción:
primero identifica cuál es el comportamiento requerido y luego corrige la implementación.

---

# 3. ÁREAS QUE YA ESTÁN ESTABLES

La aplicación acaba de superar pruebas sobre:

- T1;
- T2;
- A4;
- fullscreen;
- scroll del visor;
- encabezados académico/administrativo;
- carrera académica;
- ausencia de carrera administrativa;
- formato DD/MM/YYYY en matrices institucionales;
- fechas largas de elaboración;
- paginación;
- footer;
- firma DEMO;
- revisión;
- rondas;
- artefactos firmados inmutables;
- evidencia;
- responsables colectivos;
- aislamiento Plan/Informe;
- flujo incompleto;
- permisos;
- cierre DEMO;
- snapshots visuales.

NO reestructures estas áreas innecesariamente.

No hagas refactors cosméticos amplios.

Si debes tocar una de ellas por dependencia directa, realiza el cambio mínimo y demuestra que no produjo regresiones.

---

# 4. REGLAS INNEGOCIABLES DEL PROYECTO

Conservar:

- React + TypeScript + Vite.
- Mockup de alta fidelidad.
- Tema institucional azul.
- Interfaz clara.
- Sin predominio morado.
- Sin emojis visibles.
- Utilizar iconos SVG/componentes de iconos.
- Documentos institucionales en A4.
- currentUser separado de activeContext.
- Identidad real del usuario separada del rol/contexto.
- Plan identificado por teacherId + groupId + periodId.
- T1 e Informe aislados entre sí.
- Artefactos firmados inmutables.
- Formal version distinta de review round.
- Firma y envío como acciones diferentes.
- No inventar reglas institucionales.
- No inventar actores institucionales.
- No introducir scores/rankings de docentes.
- No convertir reportes en evaluación de desempeño.
- No usar porcentajes como principal indicador cuando un conteo sea más claro.
- No introducir API keys ni secretos.
- No guardar certificados ni contraseñas.
- No modificar artefactos históricos firmados.

---

# 5. FRENTE A — ASISTENTE IA DE REDACCIÓN

Este frente es PRIORITARIO.

Anteriormente existió un bug real:

el sistema podía producir una sugerencia, pero al presionar “Aplicar” el texto sugerido no terminaba correctamente en el campo correspondiente.

Debes auditar todas las funciones similares existentes en la aplicación.

Busca acciones como:

- Mejorar redacción
- Mejorar objetivo
- Mejorar antecedentes
- Mejorar conclusiones
- Mejorar oportunidades
- cualquier otra asistencia textual implementada.

No asumas que solamente T1 utiliza el asistente.

Revisa T1 y T2.

## A.1 Comportamiento requerido

La asistencia de IA del mockup debe funcionar así:

TEXTO ACTUAL
→ solicitar sugerencia
→ mostrar sugerencia
→ usuario decide
→ APLICAR o DESCARTAR.

La sugerencia NUNCA debe sobrescribir automáticamente el texto del usuario.

### APLICAR

Al presionar Aplicar:

- el campo correcto debe recibir exactamente la sugerencia;
- React debe reflejar inmediatamente el nuevo valor;
- el estado documental correspondiente debe actualizarse;
- el autosave/draft debe quedar actualizado;
- cambiar de paso y regresar debe conservarlo;
- recargar el navegador debe conservarlo si ese borrador es persistente;
- la sugerencia no debe terminar aplicada en otro campo.

### DESCARTAR

Al presionar Descartar:

- el texto original debe permanecer exactamente igual;
- el estado documental no debe mutar;
- la sugerencia temporal debe cerrarse/limpiarse.

### CANCELAR/CERRAR

Cerrar un diálogo o panel de sugerencia tampoco debe modificar el documento.

## A.2 Evitar estado cruzado

Prueba expresamente:

- sugerencia para Justificación;
- cerrar;
- sugerencia para Objetivo;
- aplicar.

El sistema NO debe aplicar por accidente la sugerencia anterior de Justificación al Objetivo.

Haz la prueba equivalente en T2.

## A.3 Campos vacíos

Investiga el comportamiento actual.

Si la función se denomina “Mejorar redacción”, no inventes silenciosamente contenido cuando no haya texto a mejorar salvo que requirements.md lo permita.

Si el campo está vacío y no existe una función explícita de generación:

mostrar un mensaje claro como:

“Ingrese un texto antes de solicitar una mejora.”

No inventes contenido institucional.

## A.4 Naturaleza DEMO

En esta tarea NO conectar Groq ni OpenAI.

La función puede continuar siendo simulada.

Si es necesario, centraliza la lógica en un servicio/proveedor DEMO limpio para evitar lógica duplicada.

Pero no sobrearquitectures.

No agregues claves ni variables de API.

## A.5 Seguridad conceptual

La funcionalidad de IA nunca debe recibir conceptualmente:

- certificado .p12/.pfx;
- contraseña de certificado;
- firma;
- credenciales;
- datos internos ajenos al campo textual objetivo.

## A.6 E2E obligatoria

Añade cobertura Playwright que pruebe como mínimo:

T1:
- sugerir;
- aplicar;
- comprobar textarea;
- cambiar de paso;
- regresar;
- comprobar persistencia.

T1:
- sugerir;
- descartar;
- comprobar texto original.

T2:
- mejorar Conclusiones;
- aplicar;
- comprobar persistencia.

T2:
- mejorar Oportunidades de Mejora;
- descartar;
- comprobar que no muta.

También prueba que dos solicitudes consecutivas a campos diferentes no compartan accidentalmente estado.

---

# 6. FRENTE B — CONFIGURACIÓN ADMINISTRATIVA DE PLANTILLAS

Ruta esperada:

Administración
→ Plantillas Documentales.

Actualmente existe una configuración visual de estructura para T1 y T2.

Debes auditar si la funcionalidad es REAL dentro del mockup o solamente decorativa.

---

# 7. PRINCIPIO DE REORDENAMIENTO

El administrador debe poder reordenar libremente las SECCIONES DE CONTENIDO del documento.

No establecer restricciones artificiales como:

“Firmas siempre debe estar después de matriz”
o
“Historial siempre debe estar al final”

si no existe una regla institucional confirmada que lo exija.

Ejemplo válido:

Objetivo
→ Firmas
→ Información general
→ Matriz
→ Justificación
→ Historial
→ Anexos

La aplicación ya ha mostrado este tipo de configuración.

Debe funcionar realmente.

## Excepción

El marco técnico de página puede mantenerse fijo únicamente cuando no sea conceptualmente una sección documental reordenable:

- encabezado institucional de página;
- pie institucional.

Estos elementos son marco de página repetido, no contenido narrativo.

No confundas:

“Encabezado institucional”

con una sección de contenido.

---

# 8. SECCIONES REQUERIDAS Y OPCIONALES

Las secciones obligatorias:

- deben permanecer activas;
- NO necesariamente deben permanecer en una posición fija;
- sí pueden reordenarse.

Las opcionales pueden:

- activarse/desactivarse;
- reordenarse.

Si Anexos está desactivado:

- no debe generar una página vacía innecesaria;
- el índice debe adaptarse;
- pageCount debe adaptarse;
- numeración debe adaptarse.

No elimines datos anteriores de documentos históricos por cambiar una plantilla.

---

# 9. GUARDAR NUEVA ESTRUCTURA

Cuando el administrador modifica el orden:

mostrar confirmación explícita antes de aplicar.

La confirmación debe indicar algo equivalente a:

“La nueva estructura se aplicará a los documentos creados a partir de este momento. Los documentos existentes y los artefactos firmados no serán modificados.”

Eso es importante.

Después de guardar:

- la estructura debe persistir;
- recargar la aplicación debe conservarla;
- Vista previa de estructura debe coincidir;
- un NUEVO documento debe usar el orden guardado.

---

# 10. NO MUTAR DOCUMENTOS ANTERIORES

Prueba expresamente este escenario:

1. Crear documento A con estructura predeterminada.
2. Guardarlo.
3. Cambiar plantilla desde Administración.
4. Crear documento B.
5. Comparar.

Resultado esperado:

Documento A:
permanece con su estructura original.

Documento B:
usa la nueva estructura.

Si A está firmado:
bajo ninguna circunstancia debe regenerarse usando la plantilla nueva.

Este requisito es CRÍTICO.

---

# 11. T1 Y T2 DEBEN SER CONFIGURACIONES INDEPENDIENTES

No permitas que cambiar T1 modifique T2 accidentalmente.

Prueba:

- cambiar orden T1;
- guardar;
- inspeccionar T2;
- comprobar que sigue intacto.

Luego hacer lo contrario.

---

# 12. COMPOSICIÓN DINÁMICA

Después de cambiar el orden, comprueba que siguen funcionando:

- índice;
- numeración de secciones;
- índice de tablas;
- pageCount;
- navegación entre páginas;
- orientation;
- signatureSlots;
- ubicación real de firma;
- historial;
- footer;
- número de página;
- A4;
- fullscreen;
- scroll.

NO deben existir números hardcodeados de página.

NO usar:

“Firma siempre está en página 5”.

Debe derivarse del artefacto real.

---

# 13. RESTAURAR PREDETERMINADO

Audita “Restaurar predeterminado”.

Debe:

- recuperar exactamente la estructura institucional DEMO base;
- actualizar la vista previa;
- persistir al guardar;
- no modificar documentos anteriores.

Si ya funciona, añade solamente regresión.

---

# 14. FRENTE C — PANEL GENERAL DEL ADMINISTRADOR

Existe o debe existir:

Administración
→ Panel General.

Audita su estado actual.

No quiero un dashboard decorativo con valores escritos a mano.

Los valores deben derivarse del estado DEMO real.

Como mínimo analiza si tiene sentido mostrar:

- usuarios;
- grupos institucionales;
- períodos;
- documentos;
- documentos que requieren atención;
- revisiones pendientes;
- evidencias pendientes de validación;
- flujos pendientes de configurar;
- período activo.

No es obligatorio usar exactamente estas tarjetas si la implementación actual tiene una estructura mejor.

Pero los valores deben ser coherentes con el dataset.

## Prohibido

No agregar:

- ranking de docentes;
- desempeño individual;
- puntuaciones;
- semáforos de productividad;
- predicciones;
- sanciones;
- score institucional.

Este sistema gestiona documentos.

No evalúa personal.

## Consistencia

Si la aplicación crea un nuevo Plan, el dashboard debe reflejarlo.

Si se restablece el dataset documental DEMO, los conteos deben regresar al estado base.

No hardcodear conteos independientes del estado.

---

# 15. FRENTE D — CATÁLOGOS INSTITUCIONALES

Audita:

Administración
→ Unidades Institucionales

y cualquier catálogo relacionado.

Los datos administrados deben alimentar realmente los formularios documentales.

Especialmente:

T1:
- Tipo de unidad;
- Unidad;
- Carrera.

T2:
- Tipo de unidad;
- Unidad;
- Carrera.

---

# 16. UNIDAD ACADÉMICA

Cuando sea:

Unidad académica

el formulario debe permitir seleccionar:

Unidad
+
Carrera.

Ejemplo DEMO actual:

Facultad de Ingeniería en Sistemas, Electrónica e Industrial

Carrera de Ingeniería de Software.

El artefacto debe mostrar ambos dentro del encabezado institucional correspondiente.

---

# 17. UNIDAD ADMINISTRATIVA

Cuando sea:

Unidad administrativa

debe:

- cambiar las opciones disponibles;
- ocultar Carrera;
- limpiar careerId;
- limpiar carrera;
- impedir que reaparezca una carrera antigua por estado residual;
- guardar correctamente la procedencia administrativa.

Ejemplo DEMO:

Dirección de Planificación y Evaluación.

El artefacto NO debe mostrar Carrera.

Esto ya fue corregido anteriormente.

NO REGRESIONAR.

---

# 18. ADMINISTRACIÓN → FORMULARIO

Comprueba que el catálogo administrativo no sea decorativo.

Escenario:

1. Administrador modifica/agrega/desactiva una opción DEMO permitida.
2. Guardar.
3. Cambiar sesión a docente.
4. Crear un documento nuevo.
5. Abrir selector correspondiente.

El selector debe reflejar la configuración administrativa.

No es obligatorio construir CRUD productivo si el mockup ya dispone de mecanismos suficientes.

Implementa solamente lo necesario para que el flujo DEMO sea coherente y demostrable.

---

# 19. NO MUTAR DOCUMENTOS EXISTENTES

Modificar un catálogo no debe cambiar retroactivamente el nombre almacenado en artefactos históricos.

Si un documento firmado guardó:

“Facultad X”

debe seguir mostrando ese valor aunque posteriormente el catálogo cambie a:

“Facultad Y”.

El documento debe conservar su snapshot documental.

---

# 20. FRENTE E — PERSISTENCIA Y RESET DEMO

Esta parte requiere mucho cuidado.

Hay diferentes conceptos:

A. Reset de documentos DEMO.
B. Restaurar plantilla predeterminada.
C. Datos administrativos/configuraciones.
D. Sesión/contexto.

No mezclar responsabilidades.

---

# 21. RESTABLECER DOCUMENTOS DEMO

El botón:

“Restablecer documentos DEMO”

debe hacer exactamente lo que su nombre indica.

No debería borrar indiscriminadamente configuraciones administrativas no relacionadas, salvo que requirements.md diga expresamente lo contrario.

Audita el comportamiento actual.

Comprueba que no resetee accidentalmente:

- configuración de plantilla;
- catálogos administrativos;
- preferencias no documentales;
- estructuras recién configuradas;

si el propósito del botón es únicamente restablecer documentos.

Si actualmente funciona como un reset global oculto:
corrígelo o renómbralo solo si requirements.md respalda esa semántica.

No cambies texto de UX sin justificación.

---

# 22. RESTAURAR PLANTILLA

“Restaurar predeterminado” dentro de Plantillas Documentales debe afectar esa plantilla/configuración.

No debe comportarse como reset general del sistema.

---

# 23. RECARGA NORMAL

F5 / page.reload() NO es un reset.

Después de recargar deben permanecer los elementos que el mockup documenta como persistentes:

- borradores;
- estado documental;
- firma DEMO aplicada;
- observaciones;
- configuración administrativa guardada;
- estructura de plantillas guardada.

Comprueba individualmente.

---

# 24. NUEVAS PRUEBAS E2E

No te limites a reutilizar tests actuales.

Añade regresiones focalizadas.

Nombres sugeridos, adapta si ya existe una organización mejor:

tests/e2e/ai-assistant.spec.ts

tests/e2e/admin-template-runtime.spec.ts

tests/e2e/admin-dashboard.spec.ts

tests/e2e/institutional-catalogs.spec.ts

tests/e2e/demo-reset-boundaries.spec.ts

No dupliques helpers existentes innecesariamente.

Amplía helpers.ts cuando tenga sentido.

---

# 25. ESCENARIOS AUTOMÁTICOS MÍNIMOS

## ESCENARIO A — IA T1

1. Reset documental DEMO.
2. Andrea.
3. Crear/abrir borrador T1.
4. Escribir Justificación original.
5. Solicitar mejora.
6. Capturar texto sugerido.
7. Aplicar.
8. Verificar que textarea contiene sugerencia.
9. Cambiar paso.
10. Volver.
11. Verificar persistencia.
12. Recargar.
13. Verificar persistencia.

Después:

14. escribir Objetivo.
15. solicitar mejora.
16. descartar.
17. comprobar Objetivo original intacto.

---

## ESCENARIO B — IA T2

Usar un Informe que permita llegar a campos asistidos.

Probar:

Conclusiones:
- sugerir;
- aplicar.

Oportunidades:
- sugerir;
- descartar.

Comprobar que las sugerencias no se cruzan entre campos.

---

## ESCENARIO C — PLANTILLA T1

1. Crear T1 A.
2. Recordar orden.
3. Administrador.
4. Reordenar secciones T1.
5. Confirmar.
6. Guardar.
7. Recargar.
8. Comprobar persistencia.
9. Crear T1 B.
10. Verificar orden nuevo.
11. Abrir T1 A.
12. Verificar orden antiguo.

Además:

- índice de B coincide con estructura;
- páginas dinámicas;
- firmas y signatureSlots correctos.

---

## ESCENARIO D — INDEPENDENCIA T1/T2

1. Guardar cambio T1.
2. Comprobar configuración T2.
3. Debe permanecer intacta.

Luego:

4. cambiar T2.
5. T1 no debe modificarse.

---

## ESCENARIO E — RESTAURAR PLANTILLA

1. Modificar plantilla.
2. Guardar.
3. Restaurar predeterminado.
4. Confirmar.
5. Guardar.
6. Recargar.
7. Debe coincidir exactamente con configuración DEMO base.

---

## ESCENARIO F — CATÁLOGO

1. Administrador.
2. modificar configuración DEMO de unidad permitida.
3. guardar.
4. docente.
5. crear documento.
6. comprobar selector.

Probar académico y administrativo.

Administrativo:
careerId y carrera deben quedar vacíos.

---

## ESCENARIO G — SNAPSHOT HISTÓRICO

1. Crear documento usando valor de catálogo X.
2. Guardarlo.
3. Cambiar catálogo X → Y.
4. Crear documento nuevo.
5. El antiguo conserva X.
6. El nuevo puede usar Y.

---

## ESCENARIO H — RESET

1. Cambiar una plantilla.
2. Guardar.
3. Crear un documento.
4. “Restablecer documentos DEMO”.
5. Documento vuelve al dataset canónico.
6. Comprobar si plantilla debe conservarse según semántica de requirements.md.
7. No debe existir borrado incidental.

Documenta la decisión exacta.

---

## ESCENARIO I — DASHBOARD

Registrar conteos iniciales.

Crear/modificar un documento que altere uno de los indicadores.

Volver a Panel General.

Comprobar que el conteo corresponde al estado real.

Reset documental.

Comprobar retorno al valor base.

---

# 26. ACCESIBILIDAD Y TESTABILIDAD

Cuando una acción use solamente un icono:

debe incluir:

- aria-label;
- title cuando corresponda.

No introducir texto artificial visible únicamente para tests.

Preferir:

getByRole()
getByLabel()
getByText()

antes que selectores CSS frágiles.

Añadir data-testid solamente cuando no exista una alternativa semántica razonable.

---

# 27. EMOJIS

Regla global:

NO utilizar emojis como iconos.

No introducir caracteres como:

✨
⚠️
🔒
📄
etc.

Usar componentes SVG/icon library.

Debe seguir pasando:

node --test tests/no-visible-emojis.test.mjs

Si encuentras emojis existentes visibles que la prueba no cubre:
corrige la causa y amplía la prueba si corresponde.

---

# 28. NO HACER SNAPSHOT DRIVEN DEVELOPMENT

No actualices un snapshot únicamente porque falla.

Ante un cambio visual:

1. inspecciona la diferencia;
2. determina por qué cambió;
3. comprueba requirements.md;
4. confirma que el cambio es legítimo;
5. solo entonces actualiza snapshot.

En el reporte final debes explicar individualmente cualquier snapshot modificado.

---

# 29. NO FALSEAR PRUEBAS

Prohibido:

- introducir sleeps largos para hacer pasar E2E;
- desactivar tests;
- usar skip;
- relajar aserciones importantes;
- cambiar requirements para acomodar el código;
- mockear internamente el resultado que la prueba pretende comprobar;
- usar force:true salvo causa excepcional explicada;
- reemplazar validaciones funcionales por snapshots.

Las E2E deben recorrer la UI como un usuario.

---

# 30. AUDITORÍA DE ESTADO REACT

Presta atención especialmente a:

- stale closures;
- estados temporales compartidos;
- targetDocId equivocado;
- mutación de objetos compartidos;
- objetos shallow copied;
- índices como identidad;
- autosave contra documento incorrecto;
- estados derivados inconsistentes;
- localStorage versionado;
- setters que muten Plan al trabajar con Informe;
- sugerencia IA almacenada globalmente en lugar de por campo.

Si encuentras uno:
corrige la causa raíz.

---

# 31. NO SOBREARQUITECTURAR

No conviertas el mockup en una arquitectura enterprise.

Si basta con:

- un store DEMO;
- un helper;
- un hook;
- una pequeña abstracción;

úsalo.

No introducir:

- Redux;
- Zustand;
- nuevas bases de datos;
- nuevos servidores;
- colas;
- buses de eventos;
- microservicios.

---

# 32. SOBRE IA FUTURA

La decisión arquitectónica futura actualmente considerada es:

Desarrollo:
GroqCloud Free Tier + GPT-OSS 120B.

Producción:
OpenAI API, con GPT-5.6 Luna como posible proveedor/modelo oficial.

PERO:

NO IMPLEMENTAR ESO EN ESTA TAREA.

La actual funcionalidad asistida debe seguir siendo DEMO.

Si refactorizas el servicio de sugerencias, puedes dejar una interfaz suficientemente limpia para reemplazar posteriormente el proveedor, pero sin realizar integración externa.

---

# 33. SOBRE BASE DE DATOS FUTURA

Nuevo requisito de proyecto:

la base de datos futura será:

- local;
- gratuita.

La alternativa actualmente prevista es PostgreSQL local.

PERO:

NO integrar PostgreSQL durante esta tarea.

No modificar el mockup para fingir que ya existe backend.

La persistencia DEMO actual continúa siendo válida para esta fase.

---

# 34. PRUEBAS DE REGRESIÓN EXISTENTES

Antes de terminar ejecuta, como mínimo:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

node --test tests/a4-page-size.test.mjs

node --test tests/institutional-date-format.test.mjs

node --test tests/no-visible-emojis.test.mjs

npx playwright test <nuevas pruebas focalizadas>

npm run test:e2e

Si package.json define un comando equivalente más correcto:
usa el oficial y documenta cuál utilizaste.

Actualmente la suite completa existente estaba en:

31 E2E PASS / 0 FAIL

antes de esta auditoría.

Por tanto, al finalizar:

todos los 31 escenarios existentes
+
los nuevos

deben pasar.

---

# 35. REGRESIONES QUE NO PUEDEN APARECER

Comprueba expresamente que siguen funcionando:

- creación T1;
- T1 académico;
- T1 administrativo cuando corresponda;
- T2 académico;
- T2 administrativo;
- carrera académica;
- ausencia de carrera administrativa;
- encabezado específico;
- A4;
- fullscreen;
- Escape;
- scroll vertical;
- scroll horizontal;
- zoom;
- landscape;
- DD/MM/YYYY en matriz;
- fecha larga de elaboración;
- responsable colectivo;
- firma DEMO;
- revisión paralela;
- devolución;
- ronda 2;
- artefacto firmado inmutable;
- aislamiento T1/T2;
- evidencia;
- flujo incompleto;
- cierre DEMO;
- notificaciones;
- reportes;
- unicidad de Plan.

No cambies estas funciones salvo que encuentres un bug reproducible relacionado con la auditoría actual.

---

# 36. REPORTE OBLIGATORIO

Al finalizar crea:

reporte-auditoria-ia-administracion.md

Debe contener:

## 1. Resumen ejecutivo

Qué se auditó.

## 2. Estado inicial encontrado

Qué ya funcionaba y qué no.

## 3. Bugs reales encontrados

Para cada bug:

- comportamiento observado;
- causa raíz;
- requisito afectado;
- corrección aplicada;
- regresión añadida.

## 4. Asistente IA

Documentar:

- campos auditados;
- aplicar;
- descartar;
- persistencia;
- aislamiento entre campos;
- naturaleza DEMO.

## 5. Plantillas

Documentar:

- T1;
- T2;
- drag/reorder;
- confirmación;
- persistencia;
- restaurar predeterminado;
- efecto solo en documentos posteriores;
- protección de documentos anteriores.

## 6. Catálogos

Documentar:

- académico;
- administrativo;
- carrera;
- vínculo Administración → wizard;
- snapshot histórico.

## 7. Dashboard

Documentar:

- métricas mostradas;
- origen de los datos;
- ausencia de métricas de desempeño personal.

## 8. Reset DEMO

Explicar claramente qué resetea cada mecanismo.

## 9. Pruebas nuevas

Archivo por archivo.

## 10. Snapshots

Enumerar únicamente si cambiaron y por qué.

## 11. Archivos modificados

Lista exacta.

## 12. Comandos

Con resultado real.

## 13. Conteo final

Ejemplo:

E2E: XX PASS / 0 FAIL
Node: X PASS / 0 FAIL
TypeScript: PASS
Build: PASS

No uses cifras inventadas.

## 14. Riesgos restantes

Separar:

- bug real;
- limitación DEMO;
- pendiente institucional;
- trabajo futuro de producción.

---

# 37. IMPLEMENTATION STATUS

Después de que las pruebas confirmen el comportamiento:

actualiza implementation-status.md únicamente con funcionalidades efectivamente demostradas.

No marcar como implementado:

- Groq;
- OpenAI real;
- PostgreSQL;
- DTIC;
- firma real;
- SSO;
- almacenamiento real;

porque siguen fuera de alcance.

---

# 38. CRITERIO FINAL DE ÉXITO

La tarea solo puede declararse completada si es posible demostrar mediante pruebas que:

A.
Las sugerencias IA pueden aplicarse realmente al campo correcto.

B.
Descartar una sugerencia no cambia el texto original.

C.
Una sugerencia nunca se aplica automáticamente.

D.
T1 y T2 no comparten accidentalmente estado de sugerencias.

E.
El administrador puede reordenar las secciones de contenido T1/T2.

F.
El orden guardado realmente afecta documentos NUEVOS.

G.
Los documentos anteriores no cambian.

H.
Los artefactos firmados permanecen inmutables.

I.
T1 y T2 conservan configuraciones independientes.

J.
Restaurar predeterminado funciona.

K.
Los catálogos administrativos alimentan realmente los selectores documentales.

L.
Unidad administrativa elimina Carrera correctamente.

M.
Cambios de catálogo no alteran snapshots históricos.

N.
El dashboard deriva datos del estado DEMO real.

O.
Los mecanismos de reset tienen límites correctos y comprobables.

P.
No aparecen emojis.

Q.
No regresiona A4, fullscreen, scroll, fechas, firma, revisión ni composición institucional.

R.
Toda la suite final pasa.

---

# 39. FORMA DE TRABAJO

Primero investiga.

Después ejecuta pruebas focalizadas para reproducir.

Después corrige.

Después añade regresión.

Después ejecuta la suite completa.

NO comiences reescribiendo componentes grandes.

Quiero correcciones basadas en evidencia.

Si una característica ya funciona exactamente como debe:
NO la reimplementes.

Limítate a cubrirla con una prueba si no existe cobertura.

Prioridad:

1. Integridad del estado.
2. Fidelidad funcional.
3. No regresión.
4. Persistencia correcta.
5. UX.
6. Accesibilidad.
7. Limpieza interna.
8. Extras.

Comienza ahora con la auditoría.