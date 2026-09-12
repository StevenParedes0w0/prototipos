# Reporte de auditoría maestra final

## Alcance

Se auditó el mockup contra AGENTS.md, requirements.md, implementation-status.md, Documentos_guia, tests y consumidores del motor documental. El proyecto continúa como mockup de alta fidelidad, sin backend ni integraciones productivas.

## Implementación actual

### Identidad y documentos

- La sesión permanece separada del contexto Docente, Revisor o Administrador.
- Planes, firmas, observaciones, evidencias, notificaciones y reportes usan la identidad activa.
- La unicidad de Planes usa teacherId + groupId + periodId.
- Un Informe, otro docente, grupo o período no bloquean la creación.
- Los duplicados muestran grupo, período, versión, ronda, estado y una acción contextual.
- Restablecer documentos DEMO reemplaza completamente la colección persistida.

### Dataset DEMO

- BORRADOR: Club Académico de Software, Enero–Junio 2026.
- EN REVISIÓN: Comisión de Vinculación con la Sociedad.
- EN CORRECCIÓN: Comisión de Eventos Académicos.
- VALIDADO / EN EJECUCIÓN: Unidad de Titulación.
- Existen Informe y evidencias pendientes, observadas y validadas.
- Combinación libre: Andrea + Unidad de Titulación + Julio–Diciembre 2026.
- Duplicado esperado: Andrea + Comisión de Eventos Académicos + Julio–Diciembre 2026.

### T1 y T2

- T1 conserva siete pasos, validaciones, responsables múltiples, Otro y anexos.
- La portada T1 ubica el bloque principal cerca de la zona vertical media.
- El footer T1 usa una sola fila, texto exacto, Formato Nº y número dinámico, sin línea superior.
- Los índices consultan las secciones de artifact.pages.
- La orientación se obtiene de la metadata de página.
- pageCount se asigna como pages.length después de composeArtifactPages.
- signatureSlots se calcula con getSignatureSlots(pages).
- Firmas e historial se derivan del flujo.
- La fecha queda vinculada al artefacto firmado.
- T2 deriva actividades y medios del Plan, normaliza el título y mantiene aislamiento.

### Firma y revisión

- Secuencia: BORRADOR → LISTO PARA FIRMA → FIRMADO POR ELABORADOR → EN REVISIÓN.
- Firma y envío son acciones distintas.
- Existe certificado DEMO y modo manual simulado.
- Archivo y contraseña no se persisten.
- Un flujo incompleto no inventa responsables ni permite continuar.
- Los revisores obligatorios de una misma etapa se activan en paralelo.
- La siguiente etapa espera a todos.
- Devolución y corrección crean una nueva ronda sin cambiar automáticamente la versión formal.

### Actividades y evidencias

- La ejecución deriva de Planes validados.
- Cada medio requiere su propio PDF.
- Completa y validada son condiciones diferentes.
- Reemplazar genera una nueva versión y exige revalidación.
- Los responsables conservan nombres e IDs individuales.
- Los permisos de evidencia priorizan IDs.
- Se corrigieron fechas ISO para aplicar el límite de las 23:59.
- Inicio o fin en feriado se rechaza; un feriado intermedio se permite.

### Administración e histórico

- Usuarios, grupos, períodos, catálogos, flujos, feriados y plantillas permanecen demostrables.
- Los flujos se configuran por grupo.
- Club Académico de Software mantiene aviso de flujo incompleto.
- Reportes no incluyen ranking ni scoring.
- El cierre usa PROBAR CIERRE — DEMO y RESTABLECER DEMO.
- Períodos cerrados permanecen en solo lectura.

## Cambios de esta pasada

- Se completó el dataset con BORRADOR y EN REVISIÓN.
- Unidad de Titulación quedó libre para la prueba maestra de Andrea.
- Se alinearon autoría y relaciones del Plan validado y su Informe.
- Se completaron flujos DEMO mediante configuración.
- Los períodos administrativos se conectaron al motor.
- Se añadieron responsableIds a matriz y ejecución.
- Se eliminaron fallbacks de revisión dependientes de nombres concretos.
- Se corrigió el plazo para fechas YYYY-MM-DD.
- Se eliminó un as any del visor.
- Se amplió la suite con revisores paralelos, dataset, permisos y evidencias.

## Archivos modificados

- src/App.tsx
- src/documentEngine/documentIdentity.ts
- src/documentEngine/DocumentPdfPageViewer.tsx
- src/documentEngine/mockDataDocument.ts
- src/documentEngine/signatureCredential.ts
- src/documentEngine/t1Layout.ts
- src/documentEngine/types.ts
- src/documentEngine/useDocumentEngine.ts
- src/documentEngine/workflow.ts
- src/modulo5/types.ts
- src/modulo5/useActividadesState.ts
- src/modulo6/useSeguimientoState.ts
- src/modulo7/mockDataAdmin.ts
- src/modulo11/MisDocumentosView.tsx
- src/modulo11/WizardInformeView.tsx
- tests/document-engine.test.mjs

## Pruebas

- npx tsc --noEmit: correcto.
- npm run build: correcto.
- node tests/document-engine.test.mjs: correcto.

Se verificaron aislamiento T1/T2, inmutabilidad, firma DEMO, etapas separadas, identidad, flujo incompleto, observaciones, rondas, revisores paralelos, unicidad, reset, estados del dataset, footer, portada, paginación, slots, fechas ISO, evidencias por medio y permisos por ID.

Vite solo mantiene avisos no bloqueantes sobre configuración futura y tamaño del bundle.

## Ruta manual

1. Sesión Andrea → Gestión Documental Académica.
2. Nuevo documento → Plan de Trabajo.
3. Unidad de Titulación → Julio–Diciembre 2026.
4. Completar los siete pasos, responsables, matriz y anexos.
5. Revisar portada, índice, matriz, firmas, historial y footer.
6. Usar certificado DEMO → firmar.
7. Confirmar FIRMADO POR ELABORADOR.
8. Enviar y confirmar EN REVISIÓN.
9. Cambiar explícitamente a los revisores asignados para observar, devolver y aprobar.
10. Corregir como Andrea y confirmar ronda 2 con versión formal 1.0.
11. Crear un Informe derivado, firmarlo y comprobar que el Plan permanece intacto.
12. Probar dos medios de evidencia, observación, reemplazo v2.0 y revalidación.

Para duplicados: Andrea + Comisión de Eventos Académicos + Julio–Diciembre 2026 debe mostrar Continuar corrección.

## Pendientes institucionales

- Firma real y DTIC.
- Procedimiento externo/QIPOC.
- Informe independiente definitivo.
- Procedimientos extraordinarios.
- Cierre/reapertura institucional.
- Actores no confirmados en flujos.

Se mantienen configurables o marcados como DEMO.
