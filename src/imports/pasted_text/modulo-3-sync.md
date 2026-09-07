CORRECCIÓN FUNCIONAL DEL MÓDULO 3 — SINCRONIZACIÓN GLOBAL DEL PLAN

NO rediseñar las pantallas.
El diseño visual del Módulo 3 queda aprobado.

Corregir únicamente estado, persistencia y algunas etiquetas.

============================================================
1. PREVISUALIZACIÓN DEBE USAR EL PLAN REAL
============================================================

Actualmente el PDF de previsualización contiene datos de
demostración diferentes de los configurados por el docente.

Esto es incorrecto.

La previsualización debe construirse exclusivamente desde el
mismo PlanDraft compartido por todo el flujo.

Utilizar:

PlanDraft.informacionGeneral
PlanDraft.activities
PlanDraft.justificacion
PlanDraft.objetivo
PlanDraft.anexos
PlanDraft.version

NO utilizar una matriz hardcodeada independiente.

Si el docente configuró una actividad como:

Desde: 06/10/2026
Hasta: 03/11/2026
Responsables: 1
Recursos: 1
Medio: Resolución

el PDF debe mostrar EXACTAMENTE esos valores.

No cambiar:
- nombres;
- fechas;
- responsables;
- recursos;
- medios.

============================================================
2. DOCUMENTO A FIRMAR
============================================================

El documento firmado debe ser exactamente la misma versión
mostrada en Previsualización.

Conceptualmente:

PlanDraft
→ generar documento
→ previsualizar
→ firmar ESE MISMO documento.

No regenerar el documento utilizando datos distintos al entrar
en Firma y envío.

============================================================
3. LISTADO DE PLANES
============================================================

Después de:

CONFIRMAR ENVÍO

actualizar el Plan correspondiente.

Estado:

BORRADOR
→ EN REVISIÓN

Persistir:

- versión;
- grupo;
- período;
- fecha de envío;
- etapa actual;
- documento firmado.

Al pulsar:

VOLVER A MIS PLANES

el listado debe mostrar inmediatamente:

Plan de Trabajo
Unidad de Titulación
Julio – Diciembre 2026
Versión 1
EN REVISIÓN

Acciones:

VER
VER ESTADO

NO mostrar:

Continuar edición

mientras esté EN REVISIÓN.

============================================================
4. EVITAR DUPLICADOS
============================================================

Para el prototipo incorporar la siguiente regla:

Un docente no puede crear dos Planes independientes para la
misma combinación:

DOCENTE
+ GRUPO INSTITUCIONAL
+ PERÍODO

Si ya existe un Plan vigente para:

Unidad de Titulación
Julio – Diciembre 2026

no permitir crear otro “Versión 1”.

Mostrar mensaje:

“Ya existe un Plan de Trabajo para este grupo y período.”

Acciones posibles:

VER PLAN

o, cuando corresponda institucionalmente:

CREAR NUEVA VERSIÓN

La funcionalidad completa de nueva versión se desarrollará
posteriormente.

============================================================
5. ESTADO DEL FLUJO ANTES DE FIRMAR
============================================================

Antes de que el elaborador firme:

la etapa activa debe ser:

1. Elaborador
Firma pendiente

No destacar todavía “Revisión”.

Después de firmar:

1. Elaborador
✓ Firmado

y entonces mostrar como siguiente etapa activa:

2. Revisión
Pendiente.

============================================================
6. PANEL DE CONTENIDO
============================================================

En el panel lateral del Paso 4 corregir:

Información general → AUTO
Matriz de actividades → AUTO
Justificación → editable/completa
Objetivo → editable/completo
Anexos → OPCIONAL
Firmas → AUTO
Historial de cambios → AUTO

No marcar Anexos como AUTO.

Cambiar etiqueta:

“Historial”

por:

“Historial de cambios”.

============================================================
7. ANEXOS
============================================================

Mantener el comportamiento visual actual.

No imponer todavía nuevas restricciones de formato.

Conservar:

Sí / No
Agregar
Editar
Eliminar
Reordenar.

La decisión sobre si los archivos adjuntos serán incorporados
físicamente al PDF o permanecerán asociados al Plan se
validará posteriormente.

============================================================
8. VERIFICACIÓN DE PREVISUALIZACIÓN
============================================================

Si el Plan contiene anexos:

mostrar:
✓ Anexos revisados

Si el usuario seleccionó:

“No contiene anexos”

mostrar:

✓ Sin anexos

y NO generar una sección vacía de Anexos en el PDF.

============================================================
9. ESTADO EN REVISIÓN
============================================================

Después del envío:

bloquear edición de:

- Información general
- Actividades
- Matriz
- Justificación
- Objetivo
- Anexos

Permitir únicamente:

- Ver Plan
- Descargar documento
- Ver estado
- consultar observaciones cuando existan.

============================================================
10. UNA ÚNICA FUENTE DE VERDAD
============================================================

Todo debe continuar usando el mismo estado compartido.

No crear copias independientes para:

Contenido
Anexos
Previsualización
Firma
Listado

Conceptualmente:

PlanDraft
→ al enviar
→ Plan persistido

Todos los contadores, estados, datos y documentos deben derivarse
de esa misma información.

============================================================
11. PRUEBA FUNCIONAL
============================================================

Verificar esta secuencia:

1. Crear Plan.
2. Configurar las 5 actividades.
3. Escribir Justificación.
4. Escribir Objetivo.
5. Agregar anexos.
6. Previsualizar.
7. Confirmar que el PDF contiene exactamente los datos introducidos.
8. Volver a Contenido.
9. Cambiar una frase.
10. Volver a Previsualización.
11. Confirmar que la frase cambió.
12. Firmar.
13. Enviar a revisión.
14. Volver a Mis Planes.
15. Confirmar que aparece EN REVISIÓN.
16. Confirmar que ya no existe “Continuar edición”.

No crear nuevas pantallas todavía.