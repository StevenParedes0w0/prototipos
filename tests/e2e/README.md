# Pruebas E2E

La suite usa Playwright con Chromium y levanta Vite automáticamente en `http://127.0.0.1:4173`. Cada prueba abre un contexto aislado y restablece el escenario documental DEMO.

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

Los artefactos de diagnóstico se guardan en `test-results/` cuando una prueba falla: captura, vídeo y traza. El reporte HTML se genera en `playwright-report/`.

Las pruebas cubren el flujo documental T1 de dos rondas, revisores paralelos, firma con envío automático, persistencia, bloqueo del Club Académico con flujo incompleto, denominación colectiva de responsables, resaltados normalizados asociados a observaciones, aislamiento Plan/Informe, evidencias PDF y regresión visual de portada, matriz y firmas.
