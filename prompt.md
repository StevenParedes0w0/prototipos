# MICROCORRECCIÓN FINAL T1 — RENDER DE ANEXOS + UNICIDAD DE IDs

No realizar ningún cambio adicional de UX o arquitectura.

El flujo T1 actual está aprobado.

NO modificar:
- wizard de 6 pasos;
- Información general;
- Actividades;
- activityType;
- obligatoriedad;
- fechas;
- responsables;
- matriz;
- Anexos Sí/No;
- uploader;
- firma;
- A4;
- T2;
- administración.

============================================================
1. CORREGIR DUPLICACIÓN DE ANEXOS EN EL DOCUMENTO T1
============================================================

En la previsualización oficial del T1, después de simplificar
los anexos para usar directamente el archivo seleccionado,
cada anexo está apareciendo duplicado.

Ejemplo actual incorrecto:

Anexo A: RestGest Mateos - Cronograma actualizado.pdf
RestGest Mateos - Cronograma actualizado.pdf ·

Anexo B: Acta_Detallada_Reunion_RestGest_Mateos_30-08-2026.pdf
Acta_Detallada_Reunion_RestGest_Mateos_30-08-2026.pdf ·

Esto debe corregirse.

Resultado esperado:

Anexo A: RestGest Mateos - Cronograma actualizado.pdf

Anexo B: Acta_Detallada_Reunion_RestGest_Mateos_30-08-2026.pdf

No repetir el filename en una segunda línea.

No imprimir separadores, puntos o bullets vacíos.

Auditar la composición del bloque Anexos.

Probablemente existe lógica heredada que todavía intenta imprimir:

- nombre;
- descripción;
- filename;

cuando ahora nombre/filename pueden representar el mismo dato.

La regla debe ser:

1. Mostrar etiqueta automática:
   Anexo A, Anexo B, Anexo C...

2. Mostrar una sola vez el nombre real del archivo.

3. Si existe description y description.trim() no está vacío:
   puede mostrarse debajo.

4. Si description está vacía:
   no generar una línea vacía,
   no repetir filename,
   no generar "." ni "·".

No alterar los archivos almacenados en el draft.

============================================================
2. PRESERVAR NUMERACIÓN
============================================================

Mantener:

Anexo A
Anexo B
Anexo C

Si se elimina un anexo y actualmente la regla aprobada
reordena la secuencia, conservar ese comportamiento.

No cambiarlo en esta tarea.

============================================================
3. IDS ÚNICOS DESPUÉS DE RELOAD
============================================================

La última modificación reemplazó Date.now() por IDs incrementales.

Verificar específicamente:

1. crear actividad A;
2. crear actividad B;
3. recargar la aplicación;
4. crear actividad C;
5. comprobar que C no reutiliza el ID de A ni B.

Realizar el mismo escenario para anexos.

La solución NO debe depender únicamente de un contador temporal
que vuelva a cero con cada mount.

Puede calcularse el siguiente identificador a partir de los
elementos persistidos o utilizar la estrategia estable existente.

No modificar IDs históricos.

============================================================
4. PRUEBAS
============================================================

Añadir/ampliar regresión para comprobar:

- dos anexos generan exactamente dos entradas documentales;
- filename no aparece duplicado;
- no existe separador vacío;
- descripción vacía no genera segunda línea;
- descripción real, si la arquitectura todavía la soporta,
  solo se imprime cuando contiene texto;
- IDs de actividades siguen siendo únicos después de reload;
- IDs de anexos siguen siendo únicos después de reload.

Ejecutar:

npx tsc --noEmit
npm run build
node --test tests/document-engine.test.mjs
node --test tests/a4-page-size.test.mjs
node --test tests/institutional-date-format.test.mjs
node --test tests/no-visible-emojis.test.mjs

E2E focalizada

npm run test:e2e

La línea base actual es:

36 PASS / 0 FAIL.

No reducir cobertura.

============================================================
5. INSPECCIÓN VISUAL
============================================================

Inspeccionar únicamente:

T1 → Previsualización → Anexos.

Debe verse:

5. ANEXOS

Anexo A: <archivo A>

Anexo B: <archivo B>

sin duplicaciones.

No modificar visualmente las demás páginas.

============================================================
6. REPORTE
============================================================

Entregar un reporte breve indicando:

- causa exacta de la duplicación;
- archivo corregido;
- estrategia de render del anexo;
- resultado de prueba de IDs después de reload;
- pruebas ejecutadas;
- E2E final;
- snapshots modificados, si realmente corresponde.

No realizar ningún otro cambio.