CORRECCIÓN UX DEL PASO 3 — MATRIZ DE ACTIVIDADES

No rediseñar el sistema completo.
Mantener identidad visual, sidebar, topbar, stepper, colores,
tipografía, tablas y componentes actuales.

Hay dos problemas que deben resolverse:
1. falta de espacio horizontal en la matriz;
2. flujo bloqueado cuando existen actividades incompletas.

============================================================
1. SIDEBAR COLAPSABLE
============================================================

NO sustituir la sidebar por una navbar superior.

Convertir la sidebar actual en colapsable.

Estado expandido:
mantener exactamente la sidebar actual.

Estado compacto:
ancho aproximado 64–72 px;
mostrar únicamente iconos;
mantener tooltips al pasar el cursor;
mantener visible cuál módulo está seleccionado.

Agregar un control claro para:
“Contraer navegación”
y
“Expandir navegación”.

En pantallas de alta densidad como “Matriz de actividades”,
puede utilizarse automáticamente el modo compacto o permitir
al usuario activarlo fácilmente.

No alterar la navegación del resto del sistema.

============================================================
2. TABLA DE MATRIZ
============================================================

Cuando NO se está editando una actividad, la tabla debe utilizar
prácticamente todo el ancho disponible.

Columnas:

ACTIVIDAD
DESDE
HASTA
RESPONSABLES
RECURSOS
MEDIOS
ESTADO
ACCIÓN

Evitar cualquier solapamiento visual como:
“RESPONSABLESRECURSOS”.

Mantener:
Responsables = cantidad numérica
Recursos = cantidad numérica
Medios = chips compactos

Los detalles completos aparecerán en el editor y en la vista de revisión.

============================================================
3. DRAWER DE EDICIÓN SUPERPUESTO
============================================================

Actualmente el panel lateral de “Configurar actividad” reduce
el ancho disponible de la tabla.

Cambiar este comportamiento.

Al presionar:
Editar
o
Completar

abrir un DRAWER SUPERPUESTO desde la derecha.

El drawer NO debe redimensionar ni comprimir la tabla.

Debe aparecer por encima del contenido.

Ancho aproximado:
420–480 px.

Puede incluir una sombra suave y overlay discreto.

Debe contener exactamente los campos actuales:

Desde
Hasta
Responsables
Recursos
Medios de verificación

Mantener:
Buscar recurso…
chips
checklists
validaciones
botones Cancelar / Guardar actividad.

Al guardar:
cerrar el drawer.

============================================================
4. FILAS INCOMPLETAS
============================================================

Las actividades incompletas deben ser fáciles de identificar.

Mostrar badge:

PENDIENTE DE CONFIGURAR

o

INCOMPLETA

Mantener botón:
Completar.

Además, permitir hacer clic sobre la fila incompleta para abrir
directamente el drawer correspondiente.

============================================================
5. ALERTA DE ACTIVIDADES PENDIENTES
============================================================

Cambiar el texto actual por:

“2 actividades están pendientes de configurar.”

No utilizar:
“revisiones pendientes”.

Cambiar el botón:

“Revisar pendientes”

por:

“COMPLETAR PENDIENTES”

============================================================
6. COMPORTAMIENTO DE “COMPLETAR PENDIENTES”
============================================================

Este botón debe ser FUNCIONAL.

Al presionarlo:

1. localizar la primera actividad incompleta;
2. hacer scroll automático hasta esa fila;
3. resaltarla brevemente;
4. abrir automáticamente su drawer de configuración.

Cuando el usuario guarda esa actividad:

si queda otra actividad incompleta,
mostrar dentro del drawer o después del guardado:

“Configurar siguiente pendiente”

y permitir avanzar directamente a la siguiente.

Opcionalmente puede abrirse automáticamente la siguiente
actividad incompleta.

============================================================
7. ESTADO COMPLETO
============================================================

Cuando todas las actividades estén configuradas:

mostrar:

5 / 5 configuradas

en verde.

Eliminar automáticamente la alerta amarilla.

Habilitar:

CONTINUAR →

Al presionar:

CONTINUAR →

abrir la vista:
“Revisar matriz de actividades”

y después permitir:

“Continuar a Contenido →”.

============================================================
8. VISTA REVISAR MATRIZ
============================================================

Mantener la vista actual de revisión.

Si existen actividades incompletas:

mostrar:
“2 actividades están pendientes de configurar.”

Botón:
“COMPLETAR PENDIENTES”

Ese botón debe regresar a la matriz de edición y abrir
automáticamente la primera actividad incompleta.

Si todas están completas:

mostrar:
“MATRIZ COMPLETA”

y habilitar:
“CONTINUAR A CONTENIDO →”.

============================================================
9. IMPORTANTE
============================================================

No modificar:
- reglas Desde/Hasta;
- feriados;
- responsables;
- recursos;
- medios de verificación;
- actividades obligatorias;
- actividades opcionales;
- actividad Otra;
- guardado automático;
- stepper;
- colores;
- navegación general.

No generar todavía las pantallas del Módulo 3.

Primero corregir completamente la experiencia de la matriz.