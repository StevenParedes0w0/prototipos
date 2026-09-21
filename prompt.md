# REDISEÑO VISUAL FINAL DEL LOGIN
# Gestión Documental Académica FISEI — Mockup de alta fidelidad

Trabaja ÚNICAMENTE sobre la pantalla de inicio de sesión del proyecto actual.

Este cambio proviene directamente del feedback del cliente:

- el login actual se percibe demasiado plano;
- existe demasiado blanco o demasiado azul en bloques separados;
- se desea una combinación visual de colores más atractiva;
- se desea mayor uso de iconografía;
- el acceso debe sentirse moderno, institucional y visualmente llamativo;
- se desea reemplazar el desafío matemático actual por un CAPTCHA visual alfanumérico.

IMPORTANTE:

NO modificar:
- T1;
- T2;
- wizard documental;
- administración;
- firma;
- dashboard;
- navegación interna;
- sesión DEMO existente;
- usuarios DEMO;
- permisos;
- currentUser;
- activeContext;
- reset documental;
- estructura de datos documental;
- A4;
- pruebas de documentos.

Esta tarea debe estar completamente aislada al LOGIN y, únicamente si es imprescindible, a componentes/helper específicos del CAPTCHA.

La aplicación sigue siendo un MOCKUP INTERACTIVO.
No implementar seguridad productiva real.

======================================================================
1. OBJETIVO VISUAL
======================================================================

Rediseñar el Login tomando como REFERENCIA CONCEPTUAL un estilo como:

- fondo azul institucional trabajado;
- tarjeta de acceso central;
- elementos geométricos/decorativos sutiles;
- mayor contraste y profundidad;
- formulario protagonista;
- iconos dentro de los campos;
- CAPTCHA visual de letras y números;
- botón de acceso destacado.

NO copiar literalmente ninguna interfaz externa.

La solución final debe sentirse:

- institucional;
- moderna;
- académica;
- profesional;
- limpia;
- atractiva;
- coherente con Universidad Técnica de Ambato / FISEI.

Evitar una estética:
- gamer;
- neón;
- demasiado tecnológica;
- infantil;
- excesivamente oscura;
- exageradamente corporativa.

======================================================================
2. DIRECCIÓN DE DISEÑO
======================================================================

Abandonar el layout actual rígido:

50% bloque azul
+
50% bloque blanco.

El Login debe sentirse como una sola composición visual.

Preferir:

FONDO GENERAL
+
TARJETA CENTRAL DE LOGIN.

El fondo puede utilizar:

- azul institucional oscuro;
- azul medio;
- ligeros degradados;
- figuras geométricas abstractas;
- líneas;
- puntos;
- patrones tecnológicos discretos;
- resplandores sutiles;
- formas relacionadas con sistemas/documentación.

NO usar imágenes externas con copyright.

Construir la ambientación utilizando:
- CSS;
- SVG;
- shapes;
- gradients;
- patrones internos.

No cargar assets externos innecesarios.

======================================================================
3. FONDO
======================================================================

Crear un fondo institucional más trabajado.

Conceptualmente:

azul marino institucional
→ azul intermedio
→ pequeñas variaciones de luminosidad.

Puede incluir formas decorativas en bordes/esquinas:

- líneas circuitales;
- cuadrados;
- puntos;
- formas geométricas;
- curvas suaves;
- bloques abstractos.

Deben mantenerse en segundo plano.

No permitir que interfieran con la lectura.

No convertir el fondo en una ilustración saturada.

Debe funcionar correctamente en:

1600×900
1366×768

y adaptarse razonablemente a resoluciones menores.

======================================================================
4. IDENTIDAD INSTITUCIONAL
======================================================================

Mantener visible:

logo institucional disponible en el proyecto.

Nombre principal:

Gestión Documental Académica

Complemento institucional:

FISEI — Universidad Técnica de Ambato

La identidad debe aparecer en la propia tarjeta o inmediatamente relacionada con ella.

NO mantener necesariamente toda la lista informativa actual:

- Planes de trabajo por período académico
- Matriz de actividades con evidencias PDF
- Flujo de aprobación institucional
- Historial de versiones y auditoría

El cliente pidió REDUCIR SATURACIÓN.

Por tanto, eliminar esa lista del Login salvo que exista una razón funcional real.

El Login debe concentrarse en:

IDENTIDAD
+
ACCESO.

======================================================================
5. TARJETA CENTRAL
======================================================================

Crear una tarjeta de inicio de sesión central o ligeramente desplazada según convenga al equilibrio visual.

Debe tener aproximadamente:

- ancho contenido;
- bordes redondeados moderados;
- sombra suave;
- transparencia o contraste elegante;
- excelente legibilidad.

Puede utilizar estilo:

dark-glass / blue-glass / card institucional

pero evitando glassmorphism excesivo.

Debe integrarse con el fondo, no parecer una card blanca pegada encima.

Ejemplo conceptual:

┌─────────────────────────────┐
│        [LOGO UTA]           │
│ Gestión Documental          │
│ Académica                   │
│ FISEI — UTA                 │
│                             │
│       INICIAR SESIÓN        │
│                             │
│ Correo institucional        │
│ [ icono | correo         ]  │
│                             │
│ Contraseña                  │
│ [ candado | ••••• | ojo ]  │
│                             │
│ Verificación de seguridad   │
│ ┌───────────────────────┐   │
│ │      A8RJ4K2          │ ↻ │
│ └───────────────────────┘   │
│ [ Introduzca el código ]    │
│                             │
│ [ ] Recordar sesión         │
│        ¿Olvidó contraseña?  │
│                             │
│      INICIAR SESIÓN         │
└─────────────────────────────┘

Esto es únicamente referencia estructural.

======================================================================
6. TÍTULO DEL LOGIN
======================================================================

Utilizar:

Iniciar sesión

Texto secundario breve:

Ingrese con sus credenciales institucionales.

No utilizar párrafos innecesarios.

No repetir información institucional varias veces.

======================================================================
7. CAMPO CORREO
======================================================================

Mantener:

Correo institucional *

Agregar icono SVG de correo dentro del input.

Placeholder:

usuario@uta.edu.ec

No introducir iconos externos raster.

Usar la librería de iconos ya existente.

El input debe mostrar claramente:

- estado normal;
- focus;
- error;
- disabled si existiese.

No utilizar colores excesivos.

======================================================================
8. CAMPO CONTRASEÑA
======================================================================

Mantener:

Contraseña *

Agregar:

- icono de candado;
- icono mostrar/ocultar contraseña.

El control de visibilidad debe tener:

aria-label dinámico:

"Mostrar contraseña"
"Ocultar contraseña"

y title cuando corresponda.

NO usar emoji.

======================================================================
9. REEMPLAZAR CAPTCHA MATEMÁTICO
======================================================================

Eliminar del Login el desafío matemático actual del tipo:

¿Cuánto es 8 + 4?

Reemplazarlo por un CAPTCHA VISUAL ALFANUMÉRICO DEMO.

IMPORTANTE:

Esto continúa siendo una SIMULACIÓN DEL MOCKUP.

No presentarlo internamente como un mecanismo de seguridad productivo.

======================================================================
10. CAPTCHA ALFANUMÉRICO
======================================================================

Generar un código corto, por ejemplo:

A8RJ4K2

o similar.

Usar únicamente caracteres fácilmente distinguibles.

Evitar, preferiblemente:

O / 0
I / l / 1

para reducir confusión.

Longitud sugerida:

6 caracteres.

Puede combinar:

A-Z
2-9

Ejemplos:

R8K4M7
P7DX93
N5T8Q2

No tiene que ser criptográficamente aleatorio.

Es una simulación visual.

======================================================================
11. PRESENTACIÓN DEL CAPTCHA
======================================================================

El código NO debe mostrarse como texto plano convencional.

Crear un pequeño panel CAPTCHA visual.

Debe tener:

- fondo claro o intermedio;
- contraste suficiente;
- caracteres grandes;
- ligera variación de posición/rotación;
- algunas líneas o puntos decorativos;
- distorsión VISUAL MODERADA.

NO hacerlo ilegible.

El objetivo es dar sensación visual de CAPTCHA, no dificultar la demostración.

Evitar canvas complejo si no es necesario.

SVG o CSS es suficiente.

======================================================================
12. REGENERAR CAPTCHA
======================================================================

Al lado del CAPTCHA incluir un botón de icono:

Regenerar CAPTCHA

Usar icono SVG tipo refresh.

Debe tener:

aria-label="Generar nuevo código de verificación"
title="Generar nuevo código"

Al pulsarlo:

- generar código nuevo;
- limpiar la respuesta ingresada;
- conservar correo y contraseña.

No reiniciar el formulario completo.

======================================================================
13. CAMPO CAPTCHA
======================================================================

Debajo mostrar:

Código de verificación *

Input:

[ Introduzca el código ]

La comparación DEMO puede ser case-insensitive para facilitar demostraciones.

Ejemplo:

A8RJ4K
a8rj4k

→ válido.

Eliminar espacios exteriores antes de validar.

======================================================================
14. ERROR CAPTCHA
======================================================================

Si el código no coincide:

mostrar error inline.

Ejemplo:

"El código de verificación no coincide."

No utilizar alert().

No regenerar automáticamente el CAPTCHA al primer error.

Permitir corregir el valor.

Si se desea generar uno nuevo:
el usuario usa el botón de refresh.

======================================================================
15. CAPTCHA Y ACCESIBILIDAD
======================================================================

Aunque este CAPTCHA sea DEMO, no dificultar innecesariamente la accesibilidad.

Añadir una representación accesible razonable.

Por ejemplo:

aria-label apropiado en el área visual:

"Código de verificación visual"

No escribir el propio código en un aria-label si eso crea un comportamiento absurdo para la simulación.

No implementar audio CAPTCHA en esta fase.

Documentar que accesibilidad CAPTCHA productiva deberá definirse posteriormente.

======================================================================
16. BOTÓN INICIAR SESIÓN
======================================================================

Debe ser visualmente protagonista.

Texto:

INICIAR SESIÓN

o:

Iniciar sesión

Elegir una sola convención y mantenerla.

Agregar icono únicamente si mejora la composición.

Preferencia:

texto + pequeño icono arrow/login.

No utilizar emoji.

Estado:

normal
hover
focus
disabled
loading si ya existe.

No mantener un botón gris apagado que parezca permanentemente deshabilitado si el formulario ya está listo.

Debe comunicar claramente cuándo puede utilizarse.

======================================================================
17. RECORDAR SESIÓN
======================================================================

Mantener si ya existe funcionalmente:

[ ] Recordar sesión

No modificar su lógica.

Puede colocarse en una misma fila con:

¿Olvidó su contraseña?

Mantener separación suficiente.

======================================================================
18. RECUPERACIÓN DE CONTRASEÑA
======================================================================

Mantener:

¿Olvidó su contraseña?

No modificar el flujo actual.

Solo adaptar visualmente.

======================================================================
19. NO MOSTRAR REGISTRO PÚBLICO
======================================================================

NO agregar:

"Crear una cuenta"

"Regístrate"

"No tienes cuenta"

El sistema no tiene registro público.

Los usuarios son institucionales/importados.

La referencia visual externa contiene esa opción, pero NO pertenece a este sistema.

======================================================================
20. FOOTER / AVISO INSTITUCIONAL
======================================================================

El mensaje actual:

"Este sistema es de uso institucional..."

puede mantenerse, pero más discreto.

Ubicarlo al final de la tarjeta o debajo de ella.

Debe ser legible pero no competir con el formulario.

Puede simplificarse a:

Acceso exclusivo para usuarios autorizados de la FISEI.

Si requirements actuales exigen otro texto exacto, conservarlo.

======================================================================
21. LOGO
======================================================================

Utilizar el logo institucional existente.

No modificarlo.

No recolorearlo artificialmente.

No generar otro logo.

No usar logos inventados.

Debe mantenerse nítido en alta resolución.

======================================================================
22. PALETA VISUAL
======================================================================

Mantener identidad azul institucional.

Propuesta conceptual:

Fondo:
azul marino / azul institucional.

Gradientes:
variaciones del mismo espectro.

Tarjeta:
azul medio oscuro / azul grisáceo / transparencia controlada.

Inputs:
fondo suficientemente claro u oscuro según contraste.

Botón:
azul institucional destacado.

Texto:
blanco o azul muy oscuro según superficie.

Acentos:
azul claro / celeste institucional.

Evitar:

- morado dominante;
- verde brillante;
- naranja dominante;
- rojo decorativo;
- colores neón.

Rojo solo para errores/destructivos.

Verde solo para estados de éxito cuando corresponda.

======================================================================
23. ICONOGRAFÍA
======================================================================

Utilizar iconos SVG de la librería actual.

Mínimos:

- mail;
- lock;
- eye / eye-off;
- refresh CAPTCHA;
- login/arrow si se utiliza.

No añadir iconos puramente decorativos en exceso.

No utilizar emojis.

Debe continuar pasando:

tests/no-visible-emojis.test.mjs

======================================================================
24. RESPONSIVE
======================================================================

Validar:

1600×900
1366×768

y un ancho menor representativo.

Desktop:

tarjeta centrada y fondo completo.

Pantallas pequeñas:

- tarjeta ocupa ancho disponible razonable;
- decoraciones pueden ocultarse;
- formulario mantiene legibilidad;
- sin overflow horizontal.

No crear una versión móvil completamente distinta.

======================================================================
25. NO REGRESIONAR LOGIN FUNCIONAL
======================================================================

No cambiar:

- credenciales DEMO válidas;
- usuarios;
- login;
- recuperación de contraseña;
- mustChangePassword;
- bootstrap del primer ADMIN si existe;
- navegación después del login;
- currentUser;
- cambio de contexto;
- sesión.

Solo modificar presentación y CAPTCHA DEMO.

======================================================================
26. ESTADO DEL CAPTCHA
======================================================================

El CAPTCHA debe existir únicamente durante Login.

Después de autenticarse:

limpiar:

- código generado;
- texto introducido.

Al cerrar sesión:

generar un desafío nuevo al volver al Login.

No persistir CAPTCHA en localStorage.

No guardar la respuesta.

======================================================================
27. SEGURIDAD CONCEPTUAL
======================================================================

No afirmar que este CAPTCHA protege realmente el sistema productivo.

No implementar:

- Google reCAPTCHA;
- hCaptcha;
- Turnstile;
- API externa;
- claves;
- servicios externos.

El objetivo actual es:

MOCKUP VISUAL + FLUJO INTERACTIVO.

La solución de seguridad real se definirá en producción.

======================================================================
28. REDUCIR SATURACIÓN
======================================================================

El Login actual contiene mucho texto lateral.

Eliminar del Login cualquier bloque que no sea necesario para autenticarse.

En particular, revisar y probablemente eliminar:

- descripción extensa de UTAPED;
- listado de características del sistema;
- información repetida;
- bloques técnicos.

La pantalla debe poder entenderse en aproximadamente 3 segundos:

Gestión Documental Académica
→ Inicio de sesión
→ Credenciales
→ Verificación
→ Entrar.

======================================================================
29. MICROINTERACCIONES
======================================================================

Puede incluir:

- transición de focus;
- hover suave;
- entrada ligera de la card;
- efecto visual sutil en botón.

NO usar:

- animaciones largas;
- partículas pesadas;
- fondos dinámicos agresivos;
- parallax;
- video;
- efectos que distraigan.

Respeta prefers-reduced-motion si ya existe soporte o si es trivial añadirlo.

======================================================================
30. PRUEBAS E2E
======================================================================

Crear o modificar una prueba focalizada, por ejemplo:

tests/e2e/login-visual-flow.spec.ts

Debe comprobar como mínimo:

--------------------------------------------------
ESCENARIO A — RENDER
--------------------------------------------------

Login muestra:

- logo;
- nombre del sistema;
- correo;
- contraseña;
- CAPTCHA;
- input CAPTCHA;
- botón Iniciar sesión.

--------------------------------------------------
ESCENARIO B — CAPTCHA CORRECTO
--------------------------------------------------

Usar credenciales DEMO correctas.

Introducir CAPTCHA correcto.

Iniciar sesión.

Debe acceder correctamente.

--------------------------------------------------
ESCENARIO C — CAPTCHA INCORRECTO
--------------------------------------------------

Credenciales correctas.

CAPTCHA incorrecto.

Debe bloquear login.

Debe aparecer mensaje inline.

--------------------------------------------------
ESCENARIO D — REGENERAR
--------------------------------------------------

Capturar código/desafío actual de forma compatible con test.

Pulsar Regenerar.

Comprobar que cambia.

El input CAPTCHA debe limpiarse.

Correo/contraseña permanecen.

--------------------------------------------------
ESCENARIO E — CONTRASEÑA
--------------------------------------------------

Comprobar botón:

Mostrar contraseña
Ocultar contraseña.

--------------------------------------------------
ESCENARIO F — CERRAR SESIÓN
--------------------------------------------------

Login correcto.

Cerrar sesión.

Volver al Login.

Debe existir un nuevo desafío CAPTCHA.

--------------------------------------------------
ESCENARIO G — ACCESIBILIDAD
--------------------------------------------------

Comprobar:

aria-label de iconos;
labels asociados;
orden razonable de tabulación;
botones accesibles.

======================================================================
31. PRUEBA VISUAL
======================================================================

Añadir snapshot del Login únicamente si la estrategia visual del proyecto ya utiliza regresión visual para esta pantalla.

No modificar snapshots documentales T1/T2.

Capturar como mínimo:

1600×900

Opcionalmente:

1366×768.

Inspeccionar manualmente antes de aceptar snapshot.

======================================================================
32. VALIDACIONES OBLIGATORIAS
======================================================================

Ejecutar:

npx tsc --noEmit

npm run build

node --test tests/no-visible-emojis.test.mjs

E2E focalizada Login

y posteriormente:

npm run test:e2e

La suite anterior está en:

36 PASS / 0 FAIL.

La suite nueva debe terminar con todos los tests existentes + los nuevos en verde.

No usar skip.

No debilitar tests para obtener PASS.

======================================================================
33. INSPECCIÓN VISUAL OBLIGATORIA
======================================================================

Después de implementar revisar manualmente:

1. Login 1600×900.
2. Login 1366×768.
3. Estado focus correo.
4. Estado focus contraseña.
5. CAPTCHA generado.
6. Regeneración CAPTCHA.
7. Error CAPTCHA.
8. Mostrar/ocultar contraseña.
9. Botón habilitado.
10. Inicio de sesión exitoso.
11. Volver al Login después de cerrar sesión.

No declarar terminado solo porque Playwright pasa.

======================================================================
34. CRITERIOS DE ACEPTACIÓN
======================================================================

[ ] Login ya no utiliza layout rígido azul/blanco 50/50.

[ ] Existe una composición visual unificada.

[ ] Fondo azul institucional trabajado.

[ ] Tarjeta de Login protagonista.

[ ] Logo UTA/FISEI visible.

[ ] Nombre Gestión Documental Académica visible.

[ ] Se redujo información innecesaria.

[ ] Correo tiene icono.

[ ] Contraseña tiene icono.

[ ] Existe mostrar/ocultar contraseña.

[ ] CAPTCHA matemático desapareció.

[ ] Existe CAPTCHA alfanumérico DEMO.

[ ] CAPTCHA tiene diseño visual.

[ ] CAPTCHA puede regenerarse.

[ ] Regenerar conserva credenciales.

[ ] CAPTCHA incorrecto bloquea acceso.

[ ] CAPTCHA correcto permite login.

[ ] El código se limpia tras autenticación.

[ ] Logout genera desafío nuevo.

[ ] No existe registro público.

[ ] Recuperar contraseña sigue funcionando.

[ ] Recordar sesión sigue funcionando.

[ ] No hay emojis.

[ ] Login es usable a 1600×900.

[ ] Login es usable a 1366×768.

[ ] No existe overflow horizontal.

[ ] El resto del sistema no fue modificado.

[ ] Suite completa PASS.

======================================================================
35. REPORTE FINAL
======================================================================

Crear:

reporte-rediseño-login-institucional.md

Incluir:

## 1. Diagnóstico del Login anterior

Qué problemas visuales tenía.

## 2. Dirección visual

Cómo se adaptó la referencia al contexto UTA/FISEI.

## 3. Fondo

Elementos visuales utilizados.

## 4. Tarjeta

Composición final.

## 5. CAPTCHA

- generación;
- caracteres;
- regeneración;
- validación;
- naturaleza DEMO.

## 6. Accesibilidad

Labels, iconos y teclado.

## 7. Responsive

Resultados 1600×900 y 1366×768.

## 8. Archivos modificados

Lista exacta.

## 9. Pruebas

Comandos + resultados reales.

## 10. Snapshots

Si cambió/añadió alguno.

## 11. Riesgos

Solo riesgos reales.

======================================================================
36. RESTRICCIÓN FINAL
======================================================================

Esta tarea es EXCLUSIVAMENTE:

REDISEÑO DEL LOGIN
+
CAPTCHA ALFANUMÉRICO DEMO.

NO realizar refactors generales.

NO tocar T1.

NO tocar T2.

NO tocar documentos.

NO tocar administración.

NO implementar producción.

El objetivo es presentar al cliente un Login considerablemente más atractivo, moderno e institucional sin poner en riesgo el flujo funcional ya aprobado.