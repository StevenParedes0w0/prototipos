# AUDITORÍA Y CORRECCIÓN MAESTRA FINAL DEL MOCKUP
# GESTIÓN DOCUMENTAL ACADÉMICA FISEI — T1, T2, FLUJOS, EVIDENCIAS, ADMINISTRACIÓN, HISTÓRICO Y UX

Quiero realizar una AUDITORÍA FINAL COMPLETA del proyecto y corregir TODO lo que todavía esté incompleto, inconsistente, incorrecto, hardcodeado, contradictorio o poco demostrable.

Esta NO es una tarea de análisis únicamente.

Debes:

1. estudiar completamente el proyecto;
2. contrastarlo contra toda la documentación de requisitos;
3. localizar discrepancias reales;
4. corregirlas;
5. probar regresiones;
6. dejar el mockup preparado para una demostración académica completa de extremo a extremo.

NO te limites al último reporte.
NO asumas que algo está correcto porque anteriormente se reportó como corregido.
Comprueba la implementación REAL.

---

# 0. NATURALEZA DEL PROYECTO — REGLA ABSOLUTA

Este proyecto es un:

**MOCKUP INTERACTIVO DE ALTA FIDELIDAD**

Su finalidad es:

- demostrar UX;
- demostrar flujos;
- demostrar estados;
- demostrar documentos;
- demostrar revisión;
- demostrar evidencias;
- demostrar administración;
- demostrar trazabilidad;
- demostrar comportamiento esperado del futuro sistema.

NO debe convertirse en una implementación productiva.

NO implementar innecesariamente:

- backend real;
- API productiva;
- servidor;
- PostgreSQL;
- autenticación institucional real;
- servicios externos;
- almacenamiento cloud;
- firma criptográfica real;
- validación real de certificados;
- integración DTIC;
- correo real;
- QR real;
- hashes criptográficos;
- infraestructura;
- Docker;
- CI/CD;
- generación PDF productiva;
- Excel productivo;
- notificaciones push reales.

Si una característica necesita backend/integración institucional para existir realmente:

SIMULARLA correctamente en el mockup.

Debe quedar claro cuándo algo es:

- comportamiento DEMO;
- simulación;
- configuración pendiente;
- decisión institucional pendiente.

NO inventar reglas para cubrir vacíos institucionales.

---

# 1. FUENTES DE VERDAD

ANTES DE MODIFICAR CUALQUIER ARCHIVO, lee COMPLETAMENTE:

- `AGENTS.md`
- `requirements.md`
- `implementation-status.md`
- `reporte-correccion-integral.md`, si existe
- cualquier otro `reporte*.md`
- toda la carpeta `Documentos_guia`
- README u otra documentación funcional relevante
- tests existentes relacionados con document-engine o flujos

Inspecciona también todo el código fuente necesario.

NO asumas que los archivos enumerados en reportes anteriores son los únicos consumidores de cada comportamiento.

Busca referencias globalmente.

---

# 2. PRECEDENCIA DE REQUISITOS

Cuando exista contradicción, utilizar esta prioridad:

1. requerimientos confirmados en `requirements.md`;
2. aclaraciones institucionales/reuniones registradas en los documentos del proyecto;
3. `Documentos_guia` para fidelidad documental;
4. `implementation-status.md`;
5. comportamiento actual del código.

El código actual NO es fuente de verdad si contradice los requisitos.

NO “preservar” un error por compatibilidad con el mockup anterior.

---

# 3. PRIMERA FASE — AUDITORÍA ANTES DE PROGRAMAR

Antes de implementar cambios:

## 3.1 Construye internamente una matriz

Para cada requisito importante determina:

- requisito;
- implementado;
- parcialmente implementado;
- incorrecto;
- ausente;
- pendiente institucional;
- archivos consumidores;
- riesgo de regresión.

No hace falta mostrarme la matriz por chat.

Debe servirte para planificar la implementación.

---

# 4. IDENTIDAD, SESIÓN Y CONTEXTO

Verificar completamente la separación entre:

`currentUser`

y

`activeContext`

La identidad autenticada y el contexto/rol NO son lo mismo.

Ejemplo:

Andrea Pérez inicia sesión.

Puede existir contexto:

- Docente;
- Revisor;
- Administrador,

si el escenario DEMO lo permite.

Pero cambiar contexto NO debe transformar a Andrea en:

- Carlos;
- Patricia;
- Laura;
- otro usuario.

Para probar acciones de otra persona debe cambiarse explícitamente la persona/sesión DEMO.

Verificar en:

- encabezado;
- sidebar;
- Perfil;
- firmas;
- observaciones;
- aprobaciones;
- evidencias;
- auditoría;
- notificaciones;
- reportes.

Ninguna acción debe registrarse a nombre de una persona distinta a la sesión actual.

---

# 5. GESTIÓN DOCUMENTAL — PLANES E INFORMES

Auditar completamente la bandeja:

`Gestión Documental Académica`

Debe manejar correctamente:

- Plan de Trabajo;
- Informe;
- filtros;
- estados;
- versiones;
- rondas;
- grupo;
- período;
- acciones contextuales.

Preferir acciones compactas por iconos cuando sean repetitivas:

- ojo → Ver;
- lápiz → Editar;
- continuar/documento → Continuar;
- comentario → Observaciones;
- historial → Historial;
- papelera → Eliminar cuando corresponda.

Todo icono debe tener:

- `title`;
- `aria-label`.

No convertir acciones primarias importantes como `Firmar`, `Enviar`, `Continuar` o `Guardar` en iconos ambiguos.

---

# 6. UNICIDAD DE PLANES

Regla canónica:

`teacherId + groupId + periodId`

Debe existir como máximo un Plan de Trabajo por esa combinación.

Usar IDs estables.

NO nombres visibles.

Un Informe NO bloquea un Plan.

Un Plan de otro período NO bloquea.

Un Plan de otro grupo NO bloquea.

Un Plan de otro docente NO bloquea.

Si ya existe:

mostrar información del Plan y la acción correcta:

- Continuar borrador;
- Continuar corrección;
- Ver documento.

No crear otro.

---

# 7. DATASET DEMO

Auditar completamente los datos DEMO.

Debe ser posible demostrar el sistema sin quedar atrapado.

Después de:

`Restablecer documentos DEMO`

deben existir ejemplos suficientes para demostrar:

- BORRADOR;
- EN REVISIÓN;
- EN CORRECCIÓN;
- VALIDADO / EN EJECUCIÓN;
- Informe;
- actividad;
- evidencia pendiente;
- evidencia observada;
- evidencia validada;
- histórico;
- al menos una combinación libre para crear un Plan.

NO llenar todas las combinaciones disponibles.

Grupos canónicos:

- Unidad de Titulación
- Comisión de Eventos Académicos
- Comisión de Vinculación con la Sociedad
- Club Académico de Software

NO introducir grupos inventados.

---

# 8. RESTABLECER DEMO

Debe reemplazar completamente el estado DEMO.

No mezclar:

- documentos anteriores;
- documentos creados manualmente;
- snapshots viejos;
- localStorage incompatible.

Después de reset:

el sistema debe volver exactamente al dataset canónico.

---

# 9. CREACIÓN DE PLAN T1

Auditar los 7 pasos actuales.

Flujo esperado:

1. Información general
2. Contenido
3. Actividades
4. Matriz de actividades
5. Anexos
6. Previsualización
7. Firma y Finalización

Todos deben:

- conservar datos;
- bloquear avance cuando falten obligatorios;
- permitir volver atrás;
- no borrar valores;
- mostrar estado guardado;
- permitir guardar borrador.

No introducir pasos adicionales salvo que ya estén justificados por requisitos.

---

# 10. INFORMACIÓN GENERAL

Verificar:

- período;
- grupo;
- docente elaborador;
- plantilla;
- carrera;
- versión inicial;
- estado inicial.

Un docente puede pertenecer a múltiples grupos.

El Plan se relaciona con:

docente + grupo + período.

---

# 11. CONTENIDO DEL PLAN

Debe existir exactamente:

- una Justificación;
- un Objetivo.

No duplicar campos.

Asistente IA:

- solo propone;
- no sobrescribe automáticamente;
- debe mostrar propuesta;
- permitir aplicar;
- permitir descartar;
- conservar original hasta aceptación.

No usar chatbot flotante.

Si el mockup no llama a IA real:

simular correctamente.

---

# 12. ACTIVIDADES

Auditar:

- obligatorias;
- opcionales;
- Otra.

Categorías configurables:

- POA;
- Plan de Mejoras;
- Acción de Mejora;
- Otras.

Las obligatorias:

- aparecen seleccionadas;
- no pueden eliminarse.

Las opcionales:

- pueden seleccionarse/desmarcarse.

`Otra`:

- puede crearla libremente el docente.

No imponer un catálogo rígido para `Otra`.

---

# 13. MATRIZ DE ACTIVIDADES

Cada actividad debe soportar:

- Desde;
- Hasta;
- responsables;
- recursos;
- medios de verificación.

Las fechas deben quedar dentro del período correspondiente.

Regla confirmada:

una actividad puede abarcar feriados, pero NO debe:

- iniciar en feriado;
- terminar en feriado.

No inventar prórrogas.

Procedimientos extraordinarios quedan pendientes/configurables.

---

# 14. RESPONSABLES — REVISIÓN ESPECIAL

Esta fue una observación explícita.

Debe permitirse:

- uno;
- varios;
- todos los integrantes.

Si se seleccionan TODOS los integrantes del grupo, el documento institucional puede mostrar una denominación colectiva apropiada.

Ejemplos conceptuales:

- `Integrantes de la Unidad`;
- `Integrantes de la Comisión`;
- `Integrantes del Club`;

o denominación equivalente derivada del tipo/configuración del grupo.

IMPORTANTE:

La representación colectiva es SOLO de impresión/documentación.

Internamente conservar SIEMPRE:

- IDs individuales;
- nombres individuales;
- trazabilidad.

NO sustituir los responsables individuales en el modelo.

Auditar especialmente:

- checkbox “Seleccionar todos”;
- estado indeterminado;
- desmarcado parcial;
- impresión T1;
- pantalla de revisión;
- ejecución;
- permisos de evidencia.

---

# 15. RECURSOS Y MEDIOS — OPCIÓN “OTRO”

Revalidar la corrección anterior.

Al marcar `Otro`:

el texto personalizado pasa a ser obligatorio.

No guardar `""`.

Mostrar error inline.

No cerrar drawer.

Enfocar campo.

No contar valores vacíos.

Debe funcionar tanto para:

- Recursos;
- Medios de verificación.

---

# 16. ANEXOS

Debe permitirse elegir:

- Sí;
- No.

Si Sí:

- añadir;
- editar;
- eliminar;
- ordenar.

No confundir anexos del Plan con evidencias de actividades.

No imponer reglas no confirmadas sobre contenido interno del archivo.

---

# 17. FIDELIDAD DOCUMENTAL T1 — REVISIÓN COMPLETA

Comparar visual y estructuralmente contra los archivos T1 en `Documentos_guia`.

NO comparar únicamente contra la implementación actual.

---

# 18. PORTADA T1

Debe conservar encabezado institucional.

Después:

`UNIVERSIDAD TÉCNICA DE AMBATO`

Luego el bloque:

`UNIDAD ACADÉMICA / ADMINISTRATIVA: ...`

`PLAN DE TRABAJO DE: ...`

`PERÍODO: ...`

La observación confirmada de reunión es:

EL BLOQUE NO DEBE ESTAR EN LA PARTE INFERIOR.

Debe quedar visualmente equilibrado cerca de la zona central vertical.

No dejar un espacio desproporcionado entre:

`UNIVERSIDAD TÉCNICA DE AMBATO`

y el bloque institucional.

No arreglarlo moviendo el canvas externo del visor.

Corregir la composición interna de la página.

---

# 19. FOOTER T1

Texto exacto:

`Documento de uso interno controlado por la Universidad Técnica de Ambato`

Centro:

`Formato Nº: UTA-SGC-A-2-1-P7-T1`

Derecha:

número de página.

TODO EN UNA SOLA FILA.

Eliminar completamente la línea horizontal superior.

No usar:

- border-top;
- hr;
- pseudo-elemento;
- sombra equivalente.

Mantener legibilidad.

Aplicar a TODAS las páginas.

---

# 20. ENCABEZADO T1

Debe contener según formato institucional:

- logo/sello;
- SISTEMA DE GESTIÓN DE LA CALIDAD;
- UNIVERSIDAD TÉCNICA DE AMBATO;
- PLAN DE TRABAJO: grupo;
- unidad académica/administrativa;
- carrera;
- fecha de elaboración.

No agregar elementos ficticios.

---

# 21. ÍNDICE T1

Debe derivar de `artifact.pages`.

No números quemados.

Los números deben corresponder con las páginas reales.

Debe incluir las secciones realmente presentes.

Si no existen anexos, reflejar adecuadamente la estructura sin inventar contenido.

---

# 22. MATRIZ IMPRESA T1

Mantener estructura institucional:

- Actividades;
- Cronograma:
  - Desde;
  - Hasta;
- Responsable;
- Recursos;
- Medios de verificación.

Cuando necesite orientación horizontal:

la metadata de página debe indicarlo correctamente.

No cambiar toda la aplicación por ello.

---

# 23. FIRMAS T1

Título:

`FIRMAS DE RESPONSABILIDAD`

Tabla institucional:

`ACCIONES | NOMBRE | CARGO | FIRMA`

Filas derivadas dinámicamente del flujo.

No hardcodear nombres.

No hardcodear cantidad.

No hardcodear página.

Usar `signatureSlots`.

---

# 24. HISTORIAL T1

Título exacto:

`CONTROL DE HISTORIAL DE CAMBIOS`

Columnas:

`Versión | Descripción del Cambio | Fecha de Actualización`

Versión formal:

1.0 → 2.0 → 3.0

NO usar automáticamente 1.1.

Una devolución/corrección NO genera versión 2.0.

---

# 25. PAGINACIÓN DINÁMICA

Eliminar cualquier fuente de verdad fija del tipo:

- `pageCount = 5`;
- páginas 4 y 5;
- número de página asumido.

Fuente real:

`artifact.pages`

Debe cumplirse:

`artifact.pageCount === artifact.pages.length`

Los slots de firma deben derivarse de páginas reales.

---

# 26. FECHA DE ELABORACIÓN

Mientras está en edición puede existir fecha inicial correspondiente.

Después de firma:

queda congelada con el artefacto.

No recalcular al reload.

No actualizar con `new Date()` en render.

---

# 27. FIRMA DEL ELABORADOR

Firma y envío son DOS acciones distintas.

Secuencia:

BORRADOR
→ LISTO PARA FIRMA
→ FIRMADO POR ELABORADOR
→ EN REVISIÓN

La firma NO debe enviar automáticamente.

---

# 28. FIRMA DEMO

Debe existir opción:

`Usar certificado DEMO`

Debe explicar claramente:

`Credencial DEMO — no corresponde a una firma electrónica real.`

Puede simular:

- certificado;
- contraseña DEMO;
- confirmación.

No guardar permanentemente:

- archivo;
- contraseña.

El comportamiento debe poder demostrarse sin disponer de `.p12/.pfx` real.

Mantener también interacción manual simulada.

---

# 29. FLUJOS INCOMPLETOS

Si un grupo no tiene flujo configurado:

NO inventar revisor.

Mostrar:

`El flujo de aprobación de este grupo aún no está completamente configurado.`

Puede impedir firma/envío cuando corresponda.

Pero el entorno DEMO también debe disponer de un grupo con flujo completamente configurado para demostrar el proceso completo.

Unidad de Titulación puede utilizarse para ello.

---

# 30. ARTEFACTO FIRMADO INMUTABLE

CRÍTICO.

Cuando un documento se firma:

el revisor debe recibir EXACTAMENTE el mismo artefacto.

NO reconstruir desde datos actuales.

NO regenerar silenciosamente.

Corrección posterior:

nuevo artefacto;
nueva ronda.

Artefacto anterior:

histórico.

---

# 31. REVISIÓN

Auditar:

- bandeja;
- visor;
- observaciones;
- devolver;
- aprobar;
- firma;
- estado.

No permitir que un usuario no asignado revise.

---

# 32. ETAPAS SECUENCIALES

Una etapa futura NO debe acceder al documento hasta completarse la anterior.

---

# 33. REVISORES PARALELOS

Si existen varios revisores obligatorios en la misma etapa:

todos se activan en paralelo.

La siguiente etapa se habilita únicamente cuando TODOS los obligatorios aprobaron.

No asumir suborden entre ellos.

---

# 34. OBSERVACIONES

Debe poder registrarse una observación:

- general;
- específica.

Cuando sea específica:

anclada al documento/sección/zona correspondiente.

El revisor que la creó puede editar/eliminar mientras esté activa si así está previsto.

Después de decisión:

queda histórica.

No desaparecer.

---

# 35. DEVOLUCIÓN Y CORRECCIÓN

Si se devuelve:

estado:

EN CORRECCIÓN / DEVUELTO según modelo canónico.

El docente puede corregir.

Aprobaciones anteriores:

históricas.

NO válidas para el artefacto corregido.

Al reenviar:

nueva ronda.

Ejemplo:

Versión formal 1.0
Ronda 1
→ devolución
→ corrección
→ Ronda 2

Sigue siendo versión formal 1.0.

---

# 36. INFORME T2

Auditar el flujo completo del Informe.

Puede derivarse de un Plan.

Debe importar/sincronizar conceptualmente:

- actividades;
- medios de verificación;
- contexto del grupo;
- período.

NO mutar el Plan original.

---

# 37. AISLAMIENTO MULTIDOCUMENTO

Toda operación debe afectar el `targetDocId` exacto.

Probar:

Plan validado
→ crear Informe
→ firmar Informe
→ enviar Informe

Resultado:

Plan conserva:

- estado;
- firmas;
- versión;
- ronda;
- contenido.

---

# 38. T2 — FIDELIDAD DOCUMENTAL

Comparar contra `Documentos_guia`.

Eliminar instrucciones internas de plantilla que no deberían aparecer en el documento final.

No hardcodear páginas.

Las firmas deben aparecer donde realmente correspondan.

Footer y encabezado según su formato institucional.

---

# 39. TÍTULOS T2

Evitar:

`INFORME DE: INFORME DE ...`

La normalización debe funcionar en:

- wizard;
- artefacto;
- visor;
- histórico;
- reportes.

---

# 40. EJECUCIÓN DE ACTIVIDADES

Solo un Plan aprobado/validado según flujo debe habilitar ejecución.

`Mis Actividades` debe derivarse de los Planes correspondientes, no de un dataset desconectado cuando sea posible dentro del mockup.

Mostrar únicamente las actividades relevantes al usuario/responsabilidad.

---

# 41. EVIDENCIAS

Regla:

cada medio de verificación seleccionado requiere EXACTAMENTE:

`1 archivo PDF`

durante ejecución.

Ejemplo:

Actividad:
- Acta
- Informe

Requiere:

- 1 PDF para Acta;
- 1 PDF para Informe.

No un PDF genérico para toda la actividad.

---

# 42. ARCHIVOS DE EVIDENCIA

Mockup:

- solo PDF;
- límite DEMO configurado actualmente en 10 MB si se mantiene como configuración;
- mostrar nombre;
- versión;
- medio;
- fecha.

No fingir almacenamiento real.

---

# 43. REEMPLAZO DE EVIDENCIA

Antes del vencimiento:

puede reemplazarse hasta 23:59 del día límite.

Nueva versión:

v1.0 → v2.0, etc.

ESTA versión es de EVIDENCIA.

No tiene relación con la versión formal del Plan.

---

# 44. VALIDACIÓN DE EVIDENCIA

Distinguir:

`evidencia completa`

de:

`evidencia validada`.

Completa:

PDF requerido cargado.

Validada:

revisor aprobó.

Estados:

- PENDIENTE DE VALIDACIÓN;
- VALIDADA;
- OBSERVADA.

---

# 45. EVIDENCIA OBSERVADA

Si revisor observa:

docente debe ver:

- medio;
- observación;
- revisor;
- fecha.

Si reemplaza:

requiere nueva validación.

---

# 46. PERMISOS DE EVIDENCIA

Solo responsables autorizados pueden cargar/reemplazar.

Un usuario no responsable:

solo lectura.

No hardcodear “Andrea” o “Carlos” como condición.

Usar identidad/IDs.

---

# 47. PLAZOS

Actividad:

Desde / Hasta.

La carga ordinaria termina:

23:59 del día Hasta.

No inventar extensión extraordinaria.

Mostrar texto neutral:

procedimiento extraordinario sujeto a definición institucional.

---

# 48. ADMINISTRACIÓN

Auditar:

- usuarios;
- importación;
- grupos;
- períodos;
- catálogo de actividades;
- recursos;
- medios;
- flujos;
- feriados;
- plantillas.

Debe ser demostrable como mockup.

No conectar servicios reales.

---

# 49. GRUPOS

Entidad unificada:

`Grupo institucional`

Tipo:

- Comisión;
- Unidad;
- Club;
- Otro.

No mantener entidades artificialmente separadas cuando contradigan el modelo confirmado.

---

# 50. MEMBRESÍA

Rol dentro del grupo:

- Miembro;
- Coordinador;
- Otro.

NO usar `Responsable` como rol de membresía.

`Responsable` se reserva para actividades.

---

# 51. FLUJOS CONFIGURABLES

Configuración por grupo.

No asumir mismo flujo para todos.

Posibles etapas DEMO:

- Elaboración;
- Revisión;
- Coordinación;
- Validación final.

Pero responsables concretos deben provenir de configuración.

Si falta responsable:

mostrar pendiente de configuración.

---

# 52. ADMINISTRADOR Y AUTORIDADES

No inventar autoridad final.

Utilizar:

`Autoridad correspondiente`

u otra denominación configurable cuando no esté confirmada.

---

# 53. FERIADOS

Administrador puede configurarlos.

Actividad puede atravesarlos.

No puede empezar o terminar en ellos.

---

# 54. NOTIFICACIONES

Auditar que:

- pertenezcan al usuario correcto;
- naveguen al contexto correcto;
- no contradigan auditoría;
- no aparezcan eventos inexistentes.

Notificación y evento de auditoría deben ser coherentes.

---

# 55. AUDITORÍA

Debe mostrar eventos significativos:

- creación;
- firma;
- envío;
- observación;
- devolución;
- corrección;
- aprobación;
- validación;
- evidencia;
- configuración relevante.

No mostrar IDs internos al usuario.

No inventar hashes.

No inventar códigos institucionales.

---

# 56. REPORTES

Los reportes NO son evaluación laboral.

No mostrar:

- ranking;
- puntuación docente;
- sanciones;
- productividad comparativa;
- predicción;
- scoring.

Sí mostrar:

- cantidades;
- estados documentales;
- actividades;
- evidencias;
- trazabilidad;
- avance documental.

---

# 57. REPORTES DEMO

PDF/Excel pueden ser acciones DEMO.

No es necesario generar archivos productivos reales.

Si se simulan:

indicar `VISTA PREVIA — DEMO` cuando corresponda.

---

# 58. HISTÓRICO

Períodos cerrados:

solo lectura.

Mostrar:

- Plan;
- versión;
- actividades;
- evidencias;
- historial;
- cierre.

No inventar normativa de reapertura.

---

# 59. CIERRE DE PERÍODO

Como el período actual Julio–Diciembre 2026 todavía no finaliza en la fecha DEMO establecida, NO presentarlo como cierre ordinario real.

Usar:

`PROBAR CIERRE — DEMO`

y posteriormente:

`RESTABLECER DEMO`

NO llamarlo “reabrir período” si ese procedimiento institucional no está confirmado.

---

# 60. VERSIONES FORMALES

Plan:

1.0
2.0
3.0

Una versión 2.0 requiere una decisión institucional externa/formal simulada.

NO se crea porque:

- hubo observación;
- hubo devolución;
- se corrigió texto;
- cambió ronda.

---

# 61. PROFILE / PERFIL

Debe mostrar identidad actual.

No el contexto como si fuese otra persona.

No mezclar datos DEMO de diferentes usuarios.

---

# 62. NOMBRE DEL SISTEMA

Usar consistentemente:

`Gestión Documental Académica`

Eliminar textos residuales del nombre anterior cuando ya no correspondan.

Puede conservarse `Gestión de Planes de Trabajo` únicamente dentro del propio documento/contexto si semánticamente aplica, no como nombre general de toda la plataforma.

---

# 63. UX GENERAL

Auditar:

- alineación;
- espaciado;
- overflow;
- modales;
- drawers;
- tablas;
- botones;
- estados vacíos;
- errores;
- textos truncados;
- responsive desktop;
- scroll.

Evitar:

- pantallas amontonadas;
- demasiados textos de acción;
- morado excesivo;
- botones contradictorios;
- duplicidad de acciones.

Paleta:

- azul institucional como primario;
- verde éxito;
- amarillo advertencia;
- rojo error/destructivo;
- grises neutrales.

No reintroducir identidad morada dominante.

---

# 64. MODALES Y DRAWERS

Deben manejar correctamente:

- viewport pequeño;
- contenido alto;
- scroll interno;
- cabecera visible;
- acciones accesibles.

No permitir que el footer del modal quede inaccesible.

---

# 65. ESTADOS VACÍOS

Cada pantalla importante debe soportar vacío:

- sin documentos;
- sin actividades;
- sin evidencias;
- sin observaciones;
- sin notificaciones;
- sin resultados de filtro.

No mostrar tablas rotas.

---

# 66. ESTADOS DE ERROR

Simular errores razonables cuando aplique:

- campos obligatorios;
- formato archivo;
- flujo incompleto;
- identidad incorrecta;
- acción no autorizada;
- fecha inválida;
- duplicado;
- actividad incompleta.

Mensajes claros.

No errores silenciosos.

---

# 67. ESTADOS DE CARGA

No hace falta simular loading en todas partes.

Pero si existe:

no debe quedarse permanentemente.

---

# 68. ACCESIBILIDAD BÁSICA

Elementos interactivos:

- labels;
- title;
- aria-label cuando corresponda;
- botones reales;
- foco visible;
- teclado razonable.

No dedicar la pasada a WCAG completa, pero evitar errores obvios.

---

# 69. NO USAR `any` PARA EVITAR TIPOS

Revisar correcciones anteriores que hayan introducido:

`as any`

solo para evitar modelar algo.

Si existe modelo claro:

tiparlo correctamente.

No hace falta refactorizar todo el proyecto.

Priorizar estructuras críticas:

- DocumentArtifact;
- DocumentPage;
- signatureSlots;
- workflow;
- identity;
- evidence;
- group;
- period.

---

# 70. NO HARDCODEAR DEMO EN LÓGICA CENTRAL

Los datos pueden ser DEMO.

Pero las reglas no deben depender de:

`Andrea`
`Carlos`
`Patricia`

o valores concretos.

Usar IDs/configuración.

---

# 71. CONSUMIDORES

Cada vez que modifiques un comportamiento, buscar TODOS sus consumidores.

Ejemplos:

Si cambias `DocumentArtifact`:

buscar:

- viewer;
- wizard;
- revisor;
- histórico;
- auditoría;
- reportes;
- firmas.

Si cambias `groupId`:

buscar todos los filtros, creación y datos DEMO.

No reparar solo una pantalla.

---

# 72. PRUEBAS AUTOMÁTICAS EXISTENTES

No eliminar tests para hacer pasar build.

Actualizar los tests legítimamente.

Añadir casos cuando una corrección estructural lo justifique.

---

# 73. PRUEBA MAESTRA T1

Debe poder realizarse:

Andrea
→ Gestión Documental
→ Nuevo documento
→ Unidad de Titulación
→ período activo
→ completar Plan
→ responsables múltiples/todos
→ matriz
→ anexos
→ previsualización
→ certificado DEMO
→ firmar
→ FIRMADO POR ELABORADOR
→ enviar
→ EN REVISIÓN.

---

# 74. PRUEBA MAESTRA DE REVISIÓN

Cambiar persona DEMO al revisor asignado.

→ Bandeja
→ abrir
→ observar
→ devolver

Cambiar sesión a Andrea.

→ documento EN CORRECCIÓN
→ corregir
→ firmar/reprocesar según flujo correcto
→ reenviar

Resultado:

- Versión formal 1.0
- Ronda 2
- Ronda 1 histórica.

---

# 75. PRUEBA DE REVISORES PARALELOS

Configurar/usar escenario con dos revisores obligatorios misma etapa.

Reviewer A aprueba.

La etapa NO termina.

Reviewer B aprueba.

Solo entonces siguiente etapa activa.

---

# 76. PRUEBA T2

Plan validado.

→ crear Informe
→ derivar Plan
→ actividades importadas
→ completar ejecución
→ preview
→ firmar DEMO
→ enviar.

Después abrir el Plan.

Debe permanecer intacto.

---

# 77. PRUEBA EVIDENCIA

Actividad con dos medios.

→ cargar PDF medio A
→ falta B
→ actividad aún incompleta documentalmente
→ cargar B
→ completa / pendiente validación
→ revisor observa A
→ docente reemplaza A
→ A v2.0
→ pendiente validación
→ revisor valida.

---

# 78. PRUEBA DE FECHAS

Intentar:

inicio en feriado → rechazar.

fin en feriado → rechazar.

feriado dentro del rango → permitir.

---

# 79. PRUEBA DE DUPLICADOS

Plan existente:

teacherId + groupId + periodId.

Debe bloquear.

Cambiar solo grupo:

permitir si libre.

Cambiar solo período:

permitir si libre.

Informe mismo grupo/período:

NO bloquear Plan.

---

# 80. PRUEBA DE RESET

Crear nuevo documento.

Modificar estados DEMO.

Restablecer DEMO.

Verificar dataset inicial exacto.

---

# 81. PRUEBA DOCUMENTAL T1

Revisar visualmente:

Página 1:
- encabezado correcto;
- Universidad;
- bloque principal en zona media vertical;
- footer una sola fila;
- sin línea superior.

Página 2:
- índice;
- footer correcto.

Página 3:
- contenido;
- footer.

Matriz:
- orientación;
- contenido;
- responsable colectivo cuando aplique.

Última:
- firmas;
- historial;
- slots correctos.

---

# 82. PRUEBA DOCUMENTAL T2

Revisar:

- encabezado;
- índices;
- secciones;
- actividades;
- contactos si aplica;
- anexos;
- firmas;
- historial;
- footer;
- paginación dinámica.

---

# 83. VERIFICACIÓN DE `pageCount`

Buscar globalmente:

`pageCount: 5`
`pageCount = 5`
`? 5`
y cualquier lógica equivalente.

Un número 5 puede existir como dato DEMO derivado de una composición específica, pero NO como regla de navegación.

Fuente de verdad:

`pages.length`.

---

# 84. VERIFICACIÓN DE FIRMAS

Buscar globalmente strings:

`Página 4`
`Página 5`

No deben usarse como ubicación fija para firma.

La ubicación debe venir de:

`signatureSlots`.

---

# 85. VERIFICACIÓN DE PERSONAS HARDCODEADAS

Buscar condiciones de negocio que dependan literalmente de:

Andrea
Carlos
Patricia
Laura

Los nombres pueden existir en datos DEMO.

No en reglas.

---

# 86. VERIFICACIÓN DE IDs INTERNOS

No mostrar al usuario:

- aud-XX;
- rep-plan-XX;
- IDs UUID;
- claves internas;
- códigos inventados.

---

# 87. PENDIENTES INSTITUCIONALES

Mantener explícitamente pendientes:

- firma electrónica real / DTIC;
- procedimiento externo/QIPOC;
- reglas definitivas de cierre/reapertura;
- criterios definitivos de Informe independiente;
- procedimientos extraordinarios;
- autoridad/actor cuando no esté confirmado;
- flujos no configurados.

No resolverlos inventando.

---

# 88. NO CAMBIAR LO QUE YA ESTÁ BIEN

No rediseñar arbitrariamente.

Si una pantalla ya cumple:

déjala.

No alterar:

- paleta actual correcta;
- navegación estable;
- componentes no relacionados;
- funcionalidad que supera todas las pruebas.

---

# 89. ORDEN DE IMPLEMENTACIÓN

Trabaja por dependencias:

FASE 1:
- modelos;
- IDs;
- identidad;
- flujo;
- relaciones documentales.

FASE 2:
- motor documental;
- paginación;
- firmas;
- inmutabilidad.

FASE 3:
- T1/T2 fidelidad documental.

FASE 4:
- actividades/evidencias.

FASE 5:
- admin/notificaciones/auditoría/reportes/histórico.

FASE 6:
- UX y acciones.

FASE 7:
- regresiones completas.

NO arreglar primero decoraciones si todavía existe un problema estructural.

---

# 90. COMPILACIÓN

Al terminar ejecutar:

```bash
npx tsc --noEmit
npm run build
node tests/document-engine.test.mjs