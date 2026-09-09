CORRECCIÓN VISUAL DEFINITIVA — MÓDULO 9

IMPORTANTE:

La funcionalidad del Módulo 9 queda APROBADA.

NO modificar:
- datos históricos;
- filtros;
- historicosFiltrados;
- normPer;
- navegación;
- estados;
- cantidades;
- versiones;
- lógica de reportes;
- lógica de cierre;
- mockData.

El único objetivo de esta intervención es corregir DEFINITIVAMENTE
la identidad visual del Módulo 9.

==========================================================
PROBLEMA ACTUAL
==========================================================

El Módulo 9 todavía utiliza una apariencia de "dark theme" que NO
corresponde con el resto del aplicativo.

Actualmente siguen apareciendo:

- tarjetas con fondo azul casi negro;
- tablas completas con fondo azul oscuro;
- buscadores con fondo oscuro;
- bloques de planes con fondo oscuro;
- títulos blancos sobre el fondo claro de la página;
- contraste inconsistente con los módulos 5, 7 y 8.

Esto debe corregirse.

NO basta con cambiar botones.

Hay que eliminar la paleta oscura del ÁREA DE CONTENIDO del Módulo 9.

==========================================================
REFERENCIA VISUAL OBLIGATORIA
==========================================================

Tomar como referencia directa la identidad visual ya utilizada en:

- Mis Actividades;
- Evidencias;
- Gestión de Usuarios;
- Grupos Institucionales;
- Períodos Académicos;
- Auditoría Institucional;
- Centro de Notificaciones.

El Módulo 9 debe parecer parte del MISMO SISTEMA.

==========================================================
1. FONDO GENERAL
==========================================================

Mantener el sidebar azul institucional.

Pero el contenido principal debe utilizar fondo claro:

#F4F7FA
o el mismo token/color utilizado actualmente en los módulos anteriores.

NO utilizar azul marino oscuro como fondo general del contenido.

==========================================================
2. TÍTULOS
==========================================================

Actualmente existen textos blancos prácticamente invisibles sobre fondo
claro, por ejemplo:

"Mis Reportes de Gestión Docente"

"Planes del Período Académico Actual"

"Consulta Histórica de Períodos Anteriores"

Corregir TODOS los títulos del contenido principal.

Utilizar texto oscuro institucional:

#0F172A
#16263D
o el mismo color utilizado en módulos anteriores.

Subtítulos:
gris azulado legible.

NO utilizar texto blanco sobre fondo claro.

==========================================================
3. TARJETAS DE MÉTRICAS
==========================================================

Actualmente:

Planes
Actividades
Cargadas
Validadas
Observadas
Pendientes

utilizan tarjetas azul casi negro.

Cambiar a:

- fondo blanco;
- borde #DCE4EC;
- sombra muy suave;
- título gris azulado;
- cantidad principal azul oscuro.

Utilizar color semántico únicamente en icono o cifra cuando corresponda:

Cargadas → azul
Validadas → verde
Observadas → ámbar
Pendientes → gris/azul

NO colorear toda la tarjeta.

==========================================================
4. CARDS DE PLANES ACTUALES
==========================================================

Las cards de:

Unidad de Titulación

Comisión de Eventos Académicos

NO deben tener fondo azul oscuro.

Cambiar a cards blancas.

Estructura:

Título:
azul oscuro / negro.

Datos secundarios:
gris.

Badges:

EN EJECUCIÓN → azul suave
EN CORRECCIÓN → ámbar suave
Versión 1.0 → gris/azul suave

Acciones:

Generar Reporte → botón secundario
Evidencias → botón secundario
Ver Detalle de Plan → botón azul institucional primario

Eliminar totalmente el rojo como color principal de estos botones.

==========================================================
5. DETALLE DEL REPORTE DEL PLAN
==========================================================

El encabezado grande de:

Unidad de Titulación

actualmente utiliza fondo muy oscuro.

Convertirlo en tarjeta blanca institucional.

Las tarjetas:

ACTIVIDADES
CARGADAS
VALIDADAS
OBSERVADAS
PENDIENTES

también deben ser blancas.

==========================================================
6. TABLA DE ACTIVIDADES
==========================================================

Actualmente:

"Desglose de Actividades y Medios de Verificación"

está dentro de una tabla completamente azul oscura.

Cambiar a diseño claro igual al resto de tablas del aplicativo:

Contenedor:
blanco.

Encabezado:
#F4F7FA o gris azulado muy claro.

Texto encabezado:
gris oscuro / azul institucional.

Filas:
blancas.

Separadores:
gris claro.

Texto:
#1F2937.

Mantener únicamente badges semánticos:

OBSERVADA → ámbar
PENDIENTE → gris/azul
VALIDADA → verde

==========================================================
7. CONSULTA HISTÓRICA
==========================================================

NO modificar los datos ni filtros.

Visualmente corregir:

- bloque informativo;
- buscador;
- select de período;
- tabla histórica.

El buscador y select deben tener:

fondo blanco;
borde gris claro;
texto oscuro.

No fondo azul oscuro.

==========================================================
8. PLANES HISTÓRICOS
==========================================================

La tabla:

PLANES HISTÓRICOS REGISTRADOS

debe utilizar exactamente la misma lógica visual clara de:

Gestión de Usuarios
Grupos Institucionales
Auditoría

Contenedor:
blanco.

Cabecera:
gris/azul muy claro.

Filas:
blancas.

CÓDIGO / PERÍODO
GRUPO DE TRABAJO
DOCENTE RESPONSABLE
VERSIÓN FINAL
EVIDENCIAS
ESTADO FINAL
ACCIONES

con texto oscuro y legible.

Mantener badges:

v2.0 → azul/violeta suave si ya existe
CERRADO → gris
Evidencias validadas → verde

NO usar fondo oscuro para toda la tabla.

==========================================================
9. BANNERS INFORMATIVOS
==========================================================

El bloque:

"Criterio de registro histórico..."

actualmente tiene fondo gris oscuro.

Cambiar por banner informativo igual a otros módulos:

fondo azul muy claro;
borde azul suave;
texto azul oscuro.

==========================================================
10. MODALES
==========================================================

Mantener los modales claros ya implementados:

- Generar reporte;
- Vista previa;
- Comparar versiones;
- Cierre DEMO.

No aplicar dark theme.

==========================================================
11. ROJO
==========================================================

Eliminar rojo como color decorativo o primario del Módulo 9.

Rojo se reserva para:

- error;
- bloqueo;
- acción destructiva;
- alerta crítica.

"Generar reporte"
"Ver detalle"
"Consulta histórica"

NO son acciones destructivas y NO deben ser rojas.

==========================================================
12. NO TOCAR SIDEBAR
==========================================================

El sidebar azul oscuro actual está correcto.

NO cambiarlo.

La corrección afecta el ÁREA DE CONTENIDO del Módulo 9.

==========================================================
13. REUTILIZAR TOKENS EXISTENTES
==========================================================

Antes de crear nuevos colores, revisar los estilos ya utilizados en:

Modulo 5
Modulo 7
Modulo 8

Reutilizar las mismas variables, clases o tokens cuando sea posible.

NO crear otra identidad visual específica para Reportes.

==========================================================
14. RESULTADO ESPERADO
==========================================================

Después de la corrección:

Módulo 8 — Auditoría
y
Módulo 9 — Reportes

deben verse claramente como pantallas del MISMO aplicativo.

No debe existir sensación de:

"tema oscuro"
"diferente sistema"
"dashboard externo"

==========================================================
15. VALIDACIÓN
==========================================================

Revisar visualmente al menos:

1. Mis Reportes
2. Detalle de Plan
3. Consulta Histórica
4. Planes Históricos Registrados

Asegurarse de que:

- ningún título quede blanco sobre fondo claro;
- ninguna tabla principal quede azul casi negra;
- ninguna card principal quede azul casi negra;
- no existan botones rojos no destructivos.

Ejecutar:

npx tsc --noEmit
npm run build

NO realizar cambios funcionales.