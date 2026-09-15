# MICRO-PASADA FUNCIONAL FINAL
## Gestión Documental Académica FISEI
## T2 demostrable + A4 global + cero emojis + orden real de plantillas + decisiones de IA/BD

Quiero realizar una intervención MUY FOCALIZADA sobre el mockup actual.

NO es una auditoría general.
NO quiero refactor arquitectónico amplio.
NO quiero implementar backend todavía.
NO quiero conectar APIs reales.
NO quiero introducir PostgreSQL todavía en ejecución.
NO quiero romper los flujos ya estabilizados.

El objetivo es cerrar varios hallazgos concretos detectados durante la revisión manual posterior a la última pasada.

Antes de modificar código, lee:

- AGENTS.md
- requirements.md
- implementation-status.md
- reporte-pasada-focalizada-ui-documentos.md
- reporte-correcciones-post-reunion.md
- reporte-e2e-secundario.md
- tests/document-engine.test.mjs
- tests/e2e/*
- Documentos_guia/*
- package.json

Usa el estado real del proyecto como fuente de verdad técnica.

============================================================
1. ESTADO QUE DEBES PRESERVAR
============================================================

Actualmente el proyecto ya tiene aproximadamente:

- 25 E2E PASS
- TypeScript PASS
- build PASS
- motor documental PASS
- visual regression T1/T2

NO reducir cobertura.

Preservar expresamente:

- teacherId + groupId + periodId para unicidad de Plan;
- currentUser separado de activeContext;
- targetDocId explícito;
- formalVersion separado de reviewRound;
- artefactos firmados inmutables;
- artifactHistory;
- revisores paralelos;
- Coordinación secuencial;
- Validación final;
- observaciones y resaltados;
- responsables colectivos + IDs individuales;
- T1/T2 aislados;
- evidencias independientes;
- cierre/histórico;
- firma DEMO;
- flujo incompleto del Club;
- catálogos institucionales;
- nuevo selector Unidad académica/administrativa;
- encabezado T1 corregido;
- T2 con renderer propio;
- asistente IA ya corregido.

No reconstruyas estas áreas si ya funcionan.

============================================================
2. OBJETIVOS DE ESTA MICRO-PASADA
============================================================

Resolver exactamente estos bloques:

A. Hacer que el Informe T2 derivado sea demostrable desde el dataset DEMO canónico.
B. Compactar el stepper de 8 pasos del Informe.
C. Eliminar TODOS los emojis de la aplicación y reemplazarlos por iconos.
D. Normalizar TODOS los documentos institucionales a tamaño A4.
E. Permitir reordenación real de TODAS las secciones documentales configurables.
F. Hacer que el renderer respete realmente el orden configurado.
G. Añadir confirmación antes de guardar una estructura modificada.
H. Documentar la estrategia futura de IA: Groq DEV / OpenAI PROD.
I. Documentar PostgreSQL local/on-premise y gratuito como base de datos objetivo.

NO ampliar el alcance fuera de estos bloques.

============================================================
A. T2 DERIVADO DEMOSTRABLE DESDE RESET DEMO
============================================================

PROBLEMA MANUAL CONFIRMADO:

Después de pulsar:

RESTABLECER DOCUMENTOS DEMO

y entrar como:

Ing. Andrea Pérez, Mg.

al crear:

Informe
→ Derivado de un Plan de Trabajo

el combo:

Plan de Trabajo Relacionado

aparece vacío.

Solo muestra:

— Seleccione un Plan validado o en ejecución —

La validación del combo puede estar correctamente implementada, pero el dataset DEMO no contiene un Plan elegible para Andrea.

Esto hace imposible demostrar manualmente el flujo T2 derivado.

------------------------------------------------------------
A1. NO DEGRADAR LA REGLA
------------------------------------------------------------

NO permitas:

- BORRADOR;
- EN CORRECCIÓN;
- Plan de otro docente;
- Informe;
- documento inválido

solo para llenar el combo.

Mantener la regla canónica de elegibilidad existente.

------------------------------------------------------------
A2. DATASET DEMO
------------------------------------------------------------

Agregar al dataset canónico restaurable al menos UN Plan de Trabajo que:

- pertenezca a Andrea;
- esté VALIDADO o EN EJECUCIÓN;
- tenga un flujo coherentemente completado;
- tenga actividades configuradas;
- tenga responsables;
- tenga recursos;
- tenga medios de verificación;
- pueda usarse como Plan origen de T2;
- no rompa la unicidad existente;
- no ocupe combinaciones que necesitamos libres para pruebas T1.

IMPORTANTE:

NO usar como nueva combinación ocupada:

Andrea
+
Unidad de Titulación
+
Julio–Diciembre 2026

si actualmente esa combinación se utiliza para demostrar creación libre de Plan.

Selecciona otra combinación coherente del dataset.

Si es necesario:
- otro período;
- otro grupo;
- o un Plan canónico ya existente adaptado correctamente.

Pero no generes contradicciones.

------------------------------------------------------------
A3. EMPTY STATE REAL
------------------------------------------------------------

Si un usuario genuinamente no tiene Planes elegibles:

NO dejar un select vacío sin explicación.

Mostrar algo como:

“No dispone de Planes de Trabajo validados o en ejecución que puedan utilizarse como origen de un Informe.”

El botón Siguiente continúa bloqueado.

------------------------------------------------------------
A4. E2E
------------------------------------------------------------

Crear o ampliar:

tests/e2e/t2-canonical-dataset.spec.ts

Debe probar:

1. reset DEMO;
2. sesión Andrea;
3. Nuevo documento;
4. Informe;
5. Derivado de un Plan de Trabajo;
6. el select contiene al menos un Plan elegible;
7. seleccionar Plan;
8. actividades importadas;
9. medios importados;
10. completar hasta previsualización;
11. Plan origen permanece intacto.

Esta prueba DEBE usar el dataset canónico restaurado.

NO crear dentro de la propia prueba un Plan artificial antes de verificar el combo.

Queremos proteger precisamente que el escenario DEMO sea demostrable.

============================================================
B. COMPACTAR STEPPER T2
============================================================

PROBLEMA MANUAL:

El wizard T2 desperdicia demasiado espacio vertical.

Actualmente se muestran simultáneamente:

- Crear Informe;
- Formato;
- Paso X de 8;
- barra de progreso;
- título del paso;
- 8 pasos distribuidos en 2 filas.

Esto ocupa demasiado viewport antes del formulario.

T1 tiene mejor densidad.

------------------------------------------------------------
B1. DISEÑO ESPERADO
------------------------------------------------------------

Crear un header compacto.

Ejemplo conceptual:

Crear Informe
Paso 3 de 8 — Desarrollo de Actividades

[ barra fina de progreso ]

1 General
2 Antecedentes
3 Actividades
4 Conclusiones
5 Contactos
6 Anexos
7 Previsualización
8 Firma

En escritorio:
una sola fila.

En resoluciones más estrechas:
overflow horizontal controlado.

No volver a dos filas grandes salvo que sea estrictamente necesario.

------------------------------------------------------------
B2. NO PERDER INFORMACIÓN
------------------------------------------------------------

Los nombres completos deben mantenerse mediante:

- title;
- aria-label;
- tooltip si ya existe patrón.

Ejemplo visible:

“Conclusiones”

pero accesible:

“Conclusiones y Oportunidades”

------------------------------------------------------------
B3. ESTADOS
------------------------------------------------------------

Conservar diferenciación entre:

- completado;
- actual;
- bloqueado;
- pendiente.

No depender únicamente del color.

Usar iconos de la librería actual.

============================================================
C. CERO EMOJIS EN TODA LA APLICACIÓN
============================================================

NUEVA REGLA GLOBAL:

NO utilizar emojis en ningún lugar de la aplicación.

Todo elemento visual debe usar:

- iconos SVG;
- librería de iconos existente;
- CSS;
- texto.

Actualmente se observaron ejemplos como:

- candado emoji en configurador de plantillas;
- estrella/brillo emoji en botones de IA.

Debes hacer búsqueda global.

------------------------------------------------------------
C1. BUSCAR
------------------------------------------------------------

Auditar:

src/
tests/
fixtures DEMO
strings visibles
botones
modales
notificaciones
documentos
administración

Buscar emojis y caracteres decorativos Unicode usados como iconos.

------------------------------------------------------------
C2. REEMPLAZOS
------------------------------------------------------------

Usar iconos equivalentes de la librería ya instalada.

Ejemplos:

Lock
Sparkles
GripVertical
Check
Info
AlertTriangle
Eye
Pencil
FileText
ChevronRight
History

NO agregar una segunda librería de iconos si ya existe una.

------------------------------------------------------------
C3. ICONOS ACCESIBLES
------------------------------------------------------------

Si el icono es decorativo:

aria-hidden="true"

Si representa una acción sin texto:

aria-label obligatorio.

------------------------------------------------------------
C4. REGRESIÓN AUTOMÁTICA
------------------------------------------------------------

Agregar un check simple que detecte emojis visibles dentro de src/.

Puede ser:

- test Node;
- script;
- test de código.

No tiene que bloquear caracteres legítimos como tildes o símbolos técnicos.

El objetivo es impedir reintroducir emojis como iconografía.

============================================================
D. TODOS LOS DOCUMENTOS EN A4
============================================================

DECISIÓN CONFIRMADA:

TODO documento institucional generado por el proyecto debe usar A4.

No queda pendiente.

No usar tamaño Letter/Carta.

------------------------------------------------------------
D1. REGLAS
------------------------------------------------------------

Vertical:

210 × 297 mm

Horizontal:

297 × 210 mm

Aplicar a:

- T1;
- T2;
- cualquier página generada por el motor documental;
- previsualización;
- export futuro;
- snapshots.

------------------------------------------------------------
D2. ORIENTACIÓN
------------------------------------------------------------

A4 no significa siempre vertical.

Las páginas que requieran matriz horizontal pueden usar:

orientation = landscape

pero deben continuar siendo A4.

------------------------------------------------------------
D3. MODELO
------------------------------------------------------------

Evitar hardcodes contradictorios.

Centralizar algo equivalente a:

PAGE_SIZE_A4

y derivar:

portrait
landscape

según page.orientation.

------------------------------------------------------------
D4. T2
------------------------------------------------------------

Aunque el DOCX fuente esté configurado físicamente en tamaño Carta:

usar su contenido y estructura como referencia,
pero normalizar el renderer final a A4.

Documentar esta decisión.

------------------------------------------------------------
D5. TEST
------------------------------------------------------------

Agregar prueba de motor o E2E que compruebe:

T1 portrait = A4
T1 matrix landscape = A4 landscape
T2 portrait = A4
cualquier página T2 landscape = A4 landscape si existe.

============================================================
E. ORDEN LIBRE REAL DE SECCIONES DOCUMENTALES
============================================================

PROBLEMA:

El configurador actual permite mover algunas secciones, pero mantiene otras bloqueadas.

La decisión actual es:

EL ADMINISTRADOR DEBE PODER REORDENAR LAS SECCIONES DEL DOCUMENTO SIN LIMITACIONES DE ORDEN.

Esto aplica tanto a:

T1
como
T2.

IMPORTANTE:

Distinguir:

SECCIONES DOCUMENTALES
vs
MARCO DE PÁGINA.

------------------------------------------------------------
E1. MARCO DE PÁGINA
------------------------------------------------------------

NO tratar como sección movible:

- encabezado institucional;
- pie institucional.

Estos pertenecen al marco de cada página.

Pueden permanecer fijos.

------------------------------------------------------------
E2. SECCIONES T1 MOVIBLES
------------------------------------------------------------

Deben poder reordenarse:

- Información general;
- Justificación;
- Objetivo;
- Matriz de actividades;
- Anexos;
- Firmas de responsabilidad;
- Control de historial de cambios.

Si existen otras secciones de contenido:
incluirlas.

------------------------------------------------------------
E3. SECCIONES T2 MOVIBLES
------------------------------------------------------------

Deben poder reordenarse:

- Información general;
- Antecedentes;
- Desarrollo de actividades;
- Conclusiones y oportunidades;
- Registro de contactos;
- Anexos;
- Firmas de responsabilidad;
- Control de historial de cambios.

Si existen otras secciones:
incluirlas.

------------------------------------------------------------
E4. REQUERIDA ≠ BLOQUEADA
------------------------------------------------------------

Una sección:

REQUERIDA

significa:

no puede eliminarse/desactivarse.

NO significa:

no puede moverse.

Por ejemplo:

Firmas

puede ser requerida y movible.

Historial

puede ser requerido y movible.

Información general

puede ser requerida y movible.

------------------------------------------------------------
E5. OPCIONAL
------------------------------------------------------------

Una sección opcional puede:

- cambiar de posición;
- activarse/desactivarse.

No permitir que una sección requerida se desactive.

============================================================
F. EL RENDERER DEBE RESPETAR EL ORDEN
============================================================

ESTE ES EL PUNTO MÁS IMPORTANTE DEL CONFIGURADOR.

NO basta con mover tarjetas en Administración.

La configuración debe afectar realmente a NUEVOS documentos.

------------------------------------------------------------
F1. SNAPSHOT DE CONFIGURACIÓN
------------------------------------------------------------

Cuando se crea un documento nuevo:

guardar dentro del documento una copia de la configuración de plantilla vigente.

Ejemplo conceptual:

templateConfigurationSnapshot

Debe contener:

- templateId;
- version/configVersion;
- orden;
- visibilidad;
- estado de secciones.

------------------------------------------------------------
F2. INMUTABILIDAD
------------------------------------------------------------

Cambiar la plantilla administrativa después:

NO cambia documentos existentes.

NO cambia artefactos firmados.

NO cambia historial.

Solo afecta documentos creados posteriormente.

------------------------------------------------------------
F3. COMPOSICIÓN DINÁMICA
------------------------------------------------------------

El generador debe recorrer:

templateConfigurationSnapshot.sections

en el orden configurado.

Ejemplo:

Admin configura:

1 Objetivo
2 Justificación
3 Anexos
4 Matriz
5 Información general
6 Firmas
7 Historial

Un NUEVO Plan debe:

- construir el índice en ese orden;
- construir las páginas en ese orden;
- numerar las secciones en ese orden;
- generar referencias/páginas correctas;
- conservar orientation según la sección.

NO permitir cosas como:

“3. MATRIZ”

antes de:

“1. JUSTIFICACIÓN”

porque los números estaban hardcodeados.

------------------------------------------------------------
F4. NUMERACIÓN DINÁMICA
------------------------------------------------------------

Derivar:

1.
2.
3.
...

del orden real.

Los nombres institucionales se mantienen.

------------------------------------------------------------
F5. ÍNDICE
------------------------------------------------------------

El índice debe seguir el orden configurado.

Los números de página deben continuar derivados de:

artifact.pages

NO hardcodeados.

------------------------------------------------------------
F6. ORIENTACIÓN
------------------------------------------------------------

Si la Matriz se mueve:

su página sigue siendo horizontal A4.

Las demás secciones pueden continuar verticales.

El cambio de orden no debe perder la orientación específica.

------------------------------------------------------------
F7. T1 Y T2 INDEPENDIENTES
------------------------------------------------------------

Configurar T1 no modifica T2.

Configurar T2 no modifica T1.

============================================================
G. MODAL DE CONFIRMACIÓN
============================================================

Antes de guardar una configuración que cambie el orden:

mostrar modal.

Texto recomendado:

“Confirmar cambio de estructura”

“Ha modificado el orden de las secciones de esta plantilla. La nueva estructura se aplicará únicamente a los documentos creados a partir de este momento. Los documentos existentes y los artefactos firmados no serán modificados.”

Botones:

Cancelar

Guardar nueva estructura

NO usar emojis.

Usar icono Info o AlertTriangle.

------------------------------------------------------------
G1. RESTAURAR
------------------------------------------------------------

Mantener:

Restaurar predeterminado

También debe pedir confirmación si destruye cambios actuales.

============================================================
H. DECISIÓN ARQUITECTÓNICA DE IA
============================================================

NO conectar APIs reales en esta tarea.

NO poner claves en React.

NO poner:

VITE_GROQ_API_KEY
VITE_OPENAI_API_KEY

ni ninguna clave secreta en frontend.

La decisión de arquitectura futura será:

DESARROLLO:
GroqCloud
modelo objetivo de desarrollo:
GPT-OSS 120B

PRODUCCIÓN:
OpenAI API
modelo objetivo actual:
GPT-5.6 Luna

IMPORTANTE:

Tratar nombres de modelos como configuración futura, no como dependencia rígida del dominio.

------------------------------------------------------------
H1. ABSTRACCIÓN FUTURA
------------------------------------------------------------

Documentar una arquitectura como:

AiWritingService

↓

AiProvider

con implementaciones futuras:

GroqAiProvider

OpenAiProvider

Configuración:

AI_PROVIDER=groq

o

AI_PROVIDER=openai

------------------------------------------------------------
H2. SEGURIDAD
------------------------------------------------------------

La llamada real deberá ocurrir en backend.

Arquitectura prevista:

React
↓
Spring Boot
↓
AiWritingService
↓
Groq / OpenAI

Nunca navegador → proveedor directamente.

------------------------------------------------------------
H3. MOCKUP ACTUAL
------------------------------------------------------------

El mockup continúa utilizando:

MockAiProvider

o equivalente.

No conectar red externa.

------------------------------------------------------------
H4. DOCUMENTAR
------------------------------------------------------------

Crear:

docs/architecture/ai-provider-strategy.md

o ubicación coherente existente.

Incluir:

- propósito;
- proveedor DEV;
- proveedor PROD;
- interfaz;
- seguridad;
- variables de entorno futuras;
- fallback;
- no exposición de API keys.

============================================================
I. BASE DE DATOS LOCAL Y GRATUITA
============================================================

NUEVA DECISIÓN CONFIRMADA DEL PROYECTO:

La base de datos debe:

- ser local / on-premise;
- ser gratuita;
- no depender de servicios administrados de pago.

Decisión tecnológica:

PostgreSQL.

------------------------------------------------------------
I1. ALCANCE ACTUAL
------------------------------------------------------------

NO implementar todavía backend.

NO agregar PostgreSQL como dependencia obligatoria del mockup.

NO sustituir localStorage ahora.

Esta tarea es documental/arquitectónica.

------------------------------------------------------------
I2. ARQUITECTURA FUTURA
------------------------------------------------------------

Documentar:

React / TypeScript
↓
Spring Boot
↓
PostgreSQL local / institucional on-premise

PostgreSQL será la base principal.

------------------------------------------------------------
I3. NO USAR
------------------------------------------------------------

No diseñar el sistema alrededor de:

- Firebase;
- Supabase;
- MongoDB Atlas;
- Neon;
- PlanetScale;
- otros DBaaS obligatorios.

------------------------------------------------------------
I4. DESARROLLO
------------------------------------------------------------

Se debe permitir futuro desarrollo con:

PostgreSQL instalado localmente

o

Docker Compose local.

Sin servicios pagados.

------------------------------------------------------------
I5. DOCUMENTAR
------------------------------------------------------------

Actualizar requirements.md.

Actualizar architecture existente.

Crear si hace falta:

docs/architecture/database-strategy.md

Debe indicar:

- PostgreSQL;
- local/on-premise;
- gratuito;
- SQL relacional;
- auditoría;
- transacciones;
- migraciones futuras;
- datos de documentos vs archivos binarios.

IMPORTANTE:

No inventar todavía almacenamiento de PDFs si no está confirmado para este proyecto.

Limitar este documento a la base de datos.

============================================================
J. PRUEBAS DEL CONFIGURADOR
============================================================

Ampliar:

tests/e2e/template-builder.spec.ts

Caso T1:

1. reset;
2. Admin;
3. Plantillas;
4. Configurar T1;
5. mover Información general;
6. mover Objetivo;
7. mover Firmas;
8. mover Historial;
9. verificar que todas se mueven;
10. guardar;
11. confirmar modal;
12. cerrar/reabrir;
13. orden persiste;
14. crear NUEVO T1;
15. previsualizar;
16. índice respeta orden;
17. documento respeta orden;
18. numeración respeta orden.

Después:

19. modificar plantilla nuevamente;
20. abrir documento anterior;
21. comprobar que NO cambió.

Caso T2 equivalente mínimo.

------------------------------------------------------------
J1. RESTORE DEFAULT
------------------------------------------------------------

Probar:

Restaurar predeterminado

→ confirmación
→ orden original
→ persistencia.

============================================================
K. E2E STEPPER T2
============================================================

Añadir visual/smoke test:

- stepper ocupa una sola fila en 1600×900;
- no tapa formulario;
- paso actual visible;
- pasos completos diferenciados;
- navegación continúa funcionando.

No hacer prueba pixel-perfect innecesariamente frágil.

============================================================
L. E2E EMOJIS
============================================================

Añadir check de código y/o navegador que garantice que no existen emojis usados como iconografía en las pantallas principales.

Como mínimo:

- wizard T1;
- wizard T2;
- Administración;
- configurador;
- firma;
- revisión.

============================================================
M. DOCUMENTACIÓN
============================================================

Actualizar:

requirements.md
implementation-status.md

Crear:

reporte-micro-pasada-final.md

Debe incluir:

# Reporte — Micro-pasada funcional final

## 1. T2 derivado y dataset DEMO

- causa del combo vacío;
- Plan elegible añadido;
- combinación utilizada;
- estado;
- prueba canónica.

## 2. Stepper T2

- problema anterior;
- solución;
- comportamiento responsive.

## 3. Cero emojis

- lugares detectados;
- iconos sustituidos;
- check automático.

## 4. A4 global

- T1;
- T2;
- portrait;
- landscape;
- tests.

## 5. Configurador

- secciones movibles T1;
- secciones movibles T2;
- marco fijo;
- confirmación;
- persistencia;
- restauración.

## 6. Renderer dinámico

- snapshot;
- orden;
- numeración;
- índice;
- páginas;
- documentos históricos.

## 7. Estrategia IA

- DEV Groq;
- PROD OpenAI;
- abstracción;
- seguridad;
- mock actual.

## 8. Base de datos

- PostgreSQL;
- local/on-premise;
- gratuito;
- sin implementación backend en esta fase.

## 9. Bugs reales encontrados

## 10. Archivos modificados

## 11. Tests nuevos/modificados

## 12. Resultado final

## 13. Snapshots actualizados

## 14. Pendientes institucionales

============================================================
N. TESTS OBLIGATORIOS
============================================================

Ejecutar:

npx tsc --noEmit

npm run build

node --test tests/document-engine.test.mjs

Ejecutar individualmente:

- nuevo test dataset T2;
- template-builder;
- A4;
- emoji check;
- stepper T2;
- cualquier test nuevo.

Después:

npm run test:e2e

Toda la suite.

NO reducir el número de pruebas existentes.

NO modificar tests solamente para hacerlos pasar.

============================================================
O. SNAPSHOTS
============================================================

A4 y nuevo orden dinámico pueden afectar snapshots.

NO ejecutar update masivo.

Actualizar únicamente snapshots legítimamente afectados.

Especial atención:

- T1 portada;
- T1 matriz;
- T1 firmas;
- T2 portada;
- T2 contenido;
- T2 firmas.

Documentar cada actualización.

============================================================
P. CRITERIOS DE ACEPTACIÓN
============================================================

No declarar terminado hasta cumplir:

T2 DATASET
[ ] Andrea tiene al menos un Plan elegible tras Reset DEMO.
[ ] Combo no está vacío.
[ ] Plan seleccionado importa actividades.
[ ] Plan origen no se modifica.

STEPPER
[ ] T2 no desperdicia dos filas completas.
[ ] Una sola fila desktop.
[ ] Responsive razonable.
[ ] Accesible.

EMOJIS
[ ] No hay emojis visibles usados como iconos.
[ ] Candados son iconos.
[ ] IA usa icono real.
[ ] Check automático PASS.

A4
[ ] T1 portrait A4.
[ ] T1 landscape A4.
[ ] T2 portrait A4.
[ ] No queda Letter/Carta en renderer documental.

PLANTILLAS
[ ] Información general movible.
[ ] Justificación movible.
[ ] Objetivo movible.
[ ] Matriz movible.
[ ] Anexos movible.
[ ] Firmas movible.
[ ] Historial movible.
[ ] Equivalentes T2 movibles.
[ ] Header/footer permanecen marco fijo.
[ ] Modal de confirmación.
[ ] Restore default.

RENDERER
[ ] Orden administrativo afecta nuevos documentos.
[ ] Índice respeta orden.
[ ] Numeración respeta orden.
[ ] Orientación se conserva.
[ ] Documentos existentes no cambian.
[ ] Artefactos firmados no cambian.

IA ARQUITECTURA
[ ] Groq DEV documentado.
[ ] OpenAI PROD documentado.
[ ] Provider abstraction documentada.
[ ] Sin API keys frontend.
[ ] Mock actual permanece.

BD
[ ] PostgreSQL definido.
[ ] Local/on-premise.
[ ] Gratuito.
[ ] Sin DBaaS obligatorio.
[ ] No se implementó backend prematuramente.

REGRESIÓN
[ ] TypeScript PASS.
[ ] Build PASS.
[ ] Motor PASS.
[ ] Suite E2E completa PASS.
[ ] Snapshots válidos.

============================================================
Q. NO HACER
============================================================

NO backend real.
NO DB real todavía.
NO Groq real.
NO OpenAI real.
NO API keys.
NO Firebase.
NO Supabase.
NO redesign general.
NO cambios cosméticos no relacionados.
NO emojis.
NO destruir fixtures existentes.
NO cambiar reglas de revisión.
NO cambiar evidencias.
NO cambiar permisos.
NO cambiar firma.
NO cambiar cierre/histórico.
NO inventar políticas institucionales.

============================================================
R. ENTREGA
============================================================

Trabaja directamente sobre el proyecto.

NO me entregues solamente recomendaciones.

Haz:

INSPECCIONAR
→ REPRODUCIR
→ CORREGIR
→ PROBAR
→ VERIFICAR NO REGRESIÓN
→ DOCUMENTAR

Al terminar responde con:

1. resumen;
2. bugs reales encontrados;
3. combinación DEMO elegida para T2;
4. número final de E2E PASS/FAIL;
5. TypeScript/build/motor;
6. snapshots modificados;
7. prueba de que el renderer respeta el nuevo orden;
8. estado del check cero emojis;
9. documentos de arquitectura IA/BD creados;
10. pendientes restantes;
11. ruta de reporte-micro-pasada-final.md.

Después DETENTE.

No continúes con pulido visual.