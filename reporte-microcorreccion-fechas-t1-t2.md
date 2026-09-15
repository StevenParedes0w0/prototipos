# Reporte — normalización visual de fechas institucionales

### 1. Causa raíz

La composición dinámica de `MATRIZ DE ACTIVIDADES` copiaba `actividad.desde` y `actividad.hasta` directamente desde el modelo ISO a las celdas del bloque documental. La ruta compatible del visor aplicaba una transformación local distinta, por lo que no existía una única regla de presentación institucional.

### 2. Corrección

En `src/documentEngine/pagination.ts` se creó `formatInstitutionalCalendarDate`, utilizada por la composición dinámica de la matriz y el historial institucional. `src/documentEngine/DocumentPdfPageViewer.tsx` usa el mismo helper en la ruta compatible y en sus tablas de historial.

La utilidad transforma únicamente valores completos con patrón `YYYY-MM-DD`. Valores vacíos, `undefined`, fechas ya presentadas y otros textos se conservan de forma segura.

### 3. Separación modelo/presentación

Los formularios, reglas, persistencia, feriados y artefactos mantienen `YYYY-MM-DD`. La conversión se realiza al construir/renderizar las celdas del documento. La prueba confirma que `actividad.desde` continúa almacenada como `2026-09-01` mientras la página contiene `01/09/2026`.

### 4. Prevención de timezone

El helper usa una expresión regular anclada y reordena directamente año, mes y día. No construye `Date`, no interpreta UTC y no convierte a hora local. Por ello `2026-09-02` siempre produce `02/09/2026` en `America/Guayaquil` sin posibilidad de retroceder al día anterior.

### 5. T1

En `MATRIZ DE ACTIVIDADES`:

- Antes: `2026-09-14` / `2026-12-18`.
- Después: `14/09/2026` / `18/12/2026`.

La fecha de elaboración conserva el formato largo aprobado, por ejemplo `15 de septiembre de 2026`. A4 landscape, footer, responsable colectivo, fullscreen, scroll, zoom, paginación y firmas permanecen sin cambios.

### 6. T2

La auditoría de la composición T2 confirmó que la matriz de desarrollo actual no imprime fechas `desde/hasta` del Plan: contiene actividad, medios, porcentaje y observaciones. No se añadieron campos ni se cambió su estructura. El historial institucional usa el helper solo cuando recibe una fecha ISO exacta; los formatos ya preparados permanecen intactos.

### 7. Regresión visual

Se inspeccionaron T1 portada, matriz, firmas/historial y T2 portada. Solo cambió:

- `tests/e2e/visual-regression.spec.ts-snapshots/t1-matriz-chromium-win32.png`: fechas ISO reemplazadas por `DD/MM/YYYY`.

No cambiaron los snapshots de T1 portada, T1 firmas/historial ni ninguno de T2. La matriz conserva encabezado, tabla sin desbordamiento, orientación A4 landscape, footer, marca BORRADOR y `Responsable de la unidad`.

### 8. Pruebas

| Comando | Resultado |
|---|---:|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS |
| `node --test tests/document-engine.test.mjs` | PASS — 1/1 |
| `node --test tests/a4-page-size.test.mjs` | PASS — 1/1 |
| `node --test tests/institutional-date-format.test.mjs` | PASS — 1/1 |
| `node --test tests/no-visible-emojis.test.mjs` | PASS — 1/1 |
| E2E focalizadas de matriz y preview | PASS — 5/5 |
| Regresión visual T1 | PASS — 1/1 |
| `npm run test:e2e` | PASS — 31/31; 0 fallos |

### 9. Archivos modificados

- `src/documentEngine/pagination.ts`
- `src/documentEngine/DocumentPdfPageViewer.tsx`
- `tests/a4-page-size.test.mjs`
- `tests/institutional-date-format.test.mjs`
- `tests/e2e/preview-layout.spec.ts`
- `tests/e2e/visual-regression.spec.ts-snapshots/t1-matriz-chromium-win32.png`
- `reporte-microcorreccion-fechas-t1-t2.md`

### 10. Riesgos restantes

No se identificaron riesgos funcionales dentro del alcance. El formatter valida el patrón exacto y rangos básicos de día/mes; la validez completa de fechas internas continúa siendo responsabilidad de los formularios y reglas existentes.
