# Reporte — rediseño institucional del Login

Fecha: 21/09/2026

## 1. Diagnóstico del Login anterior

El Login usaba una composición rígida de dos mitades, con un panel azul y otro blanco, demasiado texto lateral y un desafío matemático que no correspondía al feedback visual solicitado.

## 2. Dirección visual

Se creó una composición única centrada en la identidad UTA/FISEI: fondo azul institucional trabajado, tarjeta protagonista, contraste controlado y jerarquía enfocada en identidad y acceso.

## 3. Fondo

El fondo usa gradientes azules, una trama de puntos, líneas geométricas y formas abstractas CSS. Las decoraciones son sutiles, no requieren assets externos y quedan detrás del formulario.

## 4. Tarjeta

La tarjeta integra el logo institucional, `Gestión Documental Académica`, `FISEI — Universidad Técnica de Ambato`, título breve, campos con iconos SVG, controles de contraseña, CAPTCHA, recuperación y aviso institucional. Se eliminó la lista lateral de funcionalidades.

## 5. CAPTCHA

- Generación: código local de seis caracteres.
- Caracteres: `A-Z` y `2-9`, excluyendo caracteres ambiguos como `O`, `0`, `I` y `1`.
- Regeneración: botón SVG accesible; limpia solo la respuesta y conserva correo/contraseña.
- Validación: comparación sin distinguir mayúsculas y minúsculas; error inline sin `alert()`.
- Naturaleza: simulación DEMO del mockup, sin servicio externo ni seguridad productiva.

## 6. Accesibilidad

Los campos conservan labels, los controles de contraseña exponen `Mostrar contraseña`/`Ocultar contraseña`, el refresh tiene `aria-label` y `title`, y el panel visual declara `Código de verificación visual`. La interacción se mantiene mediante controles de formulario y botones de teclado.

## 7. Responsive

La tarjeta usa ancho máximo y padding adaptable; el fondo ocupa toda la ventana y las decoraciones no generan contenido horizontal adicional. La suite existente mantiene las resoluciones documentales y la interfaz se diseñó para 1600×900, 1366×768 y anchos menores.

## 8. Archivos modificados

- `src/App.tsx`
- `tests/e2e/helpers.ts`
- `tests/e2e/login-captcha.spec.ts`
- `implementation-status.md`
- `reporte-rediseño-login-institucional.md`

No se modificaron T1, T2, documentos, administración ni navegación interna.

## 9. Pruebas

- `npx tsc --noEmit` — aprobado.
- `npm run build` — aprobado.
- `node --test tests/no-visible-emojis.test.mjs` — aprobado.
- `npm run test:e2e` — **36 PASS / 0 FAIL**.
- E2E focalizada `tests/e2e/login-captcha.spec.ts` — 2 PASS / 0 FAIL.

La prueba focalizada cubre CAPTCHA correcto, CAPTCHA incorrecto, regeneración y limpieza de respuesta.

## 10. Snapshots

No se añadieron ni modificaron snapshots; el proyecto no tenía una referencia visual específica del Login que debiera actualizarse.

## 11. Riesgos

El CAPTCHA sigue siendo una simulación local y no constituye protección de producción. La accesibilidad específica de un CAPTCHA productivo deberá definirse cuando se integre un servicio institucional real.
