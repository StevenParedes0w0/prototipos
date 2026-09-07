CORRECCIÓN CRÍTICA DEL MÓDULO 4
IDENTIDAD, ESTADO GLOBAL Y DOCUMENTO FIRMADO

NO rediseñar las pantallas.

El diseño y flujo UX del Módulo 4 quedan aprobados.

Corregir únicamente:

1. identidad del usuario/contexto;
2. sincronización del estado DEVUELTO;
3. persistencia entre Revisor y Docente;
4. uso del documento firmado real;
5. consistencia de métricas;
6. acciones de observaciones.

============================================================
1. IDENTIDAD GLOBAL DEL USUARIO
============================================================

Actualmente existe una inconsistencia:

Sidebar:
Carlos López — Revisor

Topbar:
Ing. Andrea Pérez, Mg. — Docente

Esto NO puede ocurrir.

Crear una única fuente global:

currentUser

con:

id
nombre
avatar
roles disponibles

y otra:

activeContext

Ejemplo:

currentUser:
Carlos López

activeContext:
Revisor

Todo componente debe leer esos mismos datos:

- sidebar;
- topbar;
- avatar;
- nombre;
- perfil;
- firma;
- auditoría;
- observaciones.

NO mantener usuario independiente en sidebar y topbar.

============================================================
2. IDENTIDAD Y ROL SON DIFERENTES
============================================================

Cambiar de:

Docente
a
Revisor

NO debe cambiar automáticamente la identidad de una persona.

Si Carlos posee ambos roles:

Carlos López — Docente

puede cambiar a:

Carlos López — Revisor.

Nunca:

Andrea Pérez
→ seleccionar Revisor
→ convertirse en Carlos López.

Para la demostración con distintos actores:

usar sesiones simuladas separadas:

Andrea Pérez = Docente
Carlos López = Revisor.

Si se conserva un selector rápido durante desarrollo,
considerarlo únicamente un CONTROL DE DEMOSTRACIÓN y no parte
del producto final.

============================================================
3. IDENTIDAD DEL FIRMANTE
============================================================

El usuario que firma debe ser exactamente:

currentUser

y debe coincidir con el revisor asignado a la etapa.

No permitir seleccionar manualmente otro nombre.

Conceptualmente validar:

currentUser.id
=
reviewAssignment.userId.

Las observaciones y firmas también deben guardar:

currentUser.id.

============================================================
4. DEVOLUCIÓN DEL PLAN
============================================================

Existe otro error:

Carlos devuelve:

Plan de Trabajo
Comisión de Eventos Académicos
Versión 1.0

pero al regresar como Andrea aparece:

BORRADOR.

Esto es incorrecto.

Cuando Carlos confirma devolución:

actualizar inmediatamente el MISMO Plan persistido.

Estado:

EN REVISIÓN
→
DEVUELTO

Etapa:

REVISIÓN
→
ELABORADOR

Motivo:

CORRECCIÓN REQUERIDA.

Guardar:

fechaDevolucion
revisorQueDevuelve
mensajeGeneral
observaciones
rondaRevision.

============================================================
5. MIS PLANES DE TRABAJO DESPUÉS DE DEVOLVER
============================================================

Al iniciar sesión o cambiar al usuario Andrea:

mostrar:

Plan de Trabajo
Comisión de Eventos Académicos
Julio – Diciembre 2026
Versión 1.0
DEVUELTO

Última actualización:
fecha real de devolución.

Acciones:

VER OBSERVACIONES

CORREGIR

NO mostrar:

BORRADOR

NO mostrar:

Continuar edición

como si nunca hubiera sido enviado.

============================================================
6. DEVUELTO → EN CORRECCIÓN
============================================================

Utilizar esta regla:

inmediatamente después de devolución:

DEVUELTO

Cuando el elaborador pulsa:

CORREGIR

cambiar a:

EN CORRECCIÓN.

No crear automáticamente Versión 2.0.

La versión continúa siendo:

1.0

salvo que posteriormente una autoridad solicite formalmente
crear una nueva versión.

============================================================
7. CONSERVAR HISTORIAL
============================================================

La devolución NO elimina:

- PDF firmado anterior;
- firma del elaborador anterior;
- observaciones;
- aprobación previa de cualquier revisor;
- fecha/hora;
- auditoría.

Esos elementos quedan como HISTORIAL.

Sin embargo, dejan de ser válidos para la nueva ronda actual.

============================================================
8. NUEVA RONDA DE REVISIÓN
============================================================

Cuando Andrea:

corrige
→ firma nuevamente
→ reenvía

crear conceptualmente:

revisionRound = revisionRound + 1.

Ejemplo:

Ronda 1
DEVUELTA

Ronda 2
EN REVISIÓN

Las aprobaciones de la Ronda 1 permanecen en historial,
pero todos los revisores comienzan nuevamente como:

PENDIENTE

en la Ronda 2.

============================================================
9. DOCUMENTO QUE VE EL REVISOR
============================================================

Actualmente el PDF mostrado al revisor contiene información
diferente/incompleta respecto al documento configurado y firmado
por el elaborador.

Esto es crítico.

NO reconstruir el PDF del revisor con datos demostrativos.

El flujo debe ser:

PlanDraft
→ generar documento
→ previsualizar
→ firmar
→ DocumentoFirmado
→ enviar
→ revisor abre exactamente DocumentoFirmado.

El revisor debe recibir EXACTAMENTE el mismo contenido firmado
por el elaborador.

============================================================
10. NO REGENERAR DOCUMENTO DURANTE REVISIÓN
============================================================

El documento firmado debe tratarse como artefacto inmutable.

Durante revisión NO modificar:

- actividades;
- fechas;
- responsables;
- recursos;
- medios;
- justificación;
- objetivo;
- anexos.

Si existe una corrección:

generar posteriormente un nuevo artefacto firmado para la nueva
ronda de revisión.

============================================================
11. CONSISTENCIA DEL CONTENIDO
============================================================

No mostrar un Plan:

Comisión de Eventos Académicos

con contenido textual perteneciente a:

Unidad de Titulación

salvo que esos fueran realmente los datos escritos por el usuario.

Todos los datos deben proceder del Plan persistido correspondiente.

============================================================
12. MATRIZ DEL PDF
============================================================

No mostrar filas con:

—

si esas actividades ya fueron configuradas antes del envío.

El PDF del revisor debe conservar exactamente los valores que
existían en el documento firmado.

============================================================
13. MÉTRICAS DE BANDEJA
============================================================

Actualmente:

Pendientes de revisión = 3

pero la tabla muestra:

2 documentos pendientes.

Corregir.

Preferentemente las tarjetas superiores deben respetar los mismos
filtros aplicados a la tabla.

Si representan valores globales, etiquetar explícitamente:

Pendientes totales.

No mostrar métricas contradictorias sin explicación.

============================================================
14. OBSERVACIONES
============================================================

Mantener funcionalidad actual.

Agregar para observaciones propias del revisor actual:

EDITAR
ELIMINAR

antes de emitir una decisión.

No utilizar únicamente una “X” sin explicación.

Puede utilizarse:

icono lápiz
icono papelera

con tooltip.

Después de devolver o aprobar:

bloquear edición/eliminación de esas observaciones.

Pasan a formar parte del historial.

============================================================
15. APROBACIÓN CON OBSERVACIONES
============================================================

Mantener exactamente el comportamiento actual:

si existen observaciones activas:

APROBAR Y FIRMAR

debe bloquearse.

El modal actual con:

“Existen observaciones pendientes...”

queda aprobado.

============================================================
16. FLUJO 1/2
============================================================

Mantener:

Carlos aprobado
Patricia pendiente
Revisión 1/2
Coordinación bloqueada.

============================================================
17. FLUJO 2/2
============================================================

Mantener:

Carlos aprobado
Patricia aprobada
Revisión 2/2
Coordinación activa.

============================================================
18. CONTROL DE SIMULACIÓN
============================================================

El botón:

“Simular 2ª aprobación”

puede mantenerse TEMPORALMENTE para pruebas.

Marcarlo internamente como:

DEMO / DEBUG ONLY.

No debe formar parte de la interfaz de producción.

============================================================
19. PRUEBA OBLIGATORIA
============================================================

Ejecutar esta secuencia:

A) DEVOLUCIÓN

1. Iniciar sesión/simular usuario Andrea como Docente.
2. Enviar Plan Comisión de Eventos Académicos.
3. Iniciar sesión/simular Carlos como Revisor.
4. Verificar que sidebar y topbar muestren Carlos.
5. Abrir el documento.
6. Confirmar que es exactamente el firmado por Andrea.
7. Agregar observaciones.
8. Devolver.
9. Volver a Andrea.
10. Confirmar estado DEVUELTO.
11. Confirmar fecha de última actualización.
12. Confirmar acciones:
    VER OBSERVACIONES
    CORREGIR.
13. Presionar CORREGIR.
14. Confirmar estado EN CORRECCIÓN.

B) APROBACIÓN

1. Abrir un Plan EN REVISIÓN sin observaciones.
2. Carlos aprueba.
3. Confirmar 1/2.
4. Confirmar Coordinación bloqueada.
5. Simular Patricia.
6. Confirmar 2/2.
7. Confirmar Coordinación activa.

============================================================
20. NO GENERAR NUEVOS MÓDULOS TODAVÍA
============================================================

No desarrollar aún:

- edición completa del documento devuelto;
- evidencias;
- ejecución;
- ampliaciones;
- administración.

Primero corregir integralmente estas inconsistencias.