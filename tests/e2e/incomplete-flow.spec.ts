import { test, expect } from '@playwright/test';
import { reset, documents, document, login, openDocuments, row, session, names } from './helpers';

test('Club Académico bloquea el envío cuando el flujo de aprobación está incompleto', async ({ page }) => {
  await reset(page);
  await expect(page.getByRole('button', { name: 'NUEVO DOCUMENTO', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'NUEVO DOCUMENTO', exact: true }).click();
  await page.getByRole('button', { name: 'CREAR PLAN DE TRABAJO', exact: true }).click();
  const createDialog = page.getByRole('dialog', { name: 'Seleccionar grupo y período' });
  await expect(createDialog.getByLabel('Grupo institucional').locator('option[value="grp-3"]')).toHaveText('Club Académico de Software');
  await createDialog.getByLabel('Grupo institucional').selectOption('grp-3');
  await createDialog.getByLabel('Período').selectOption('per-1');
  await expect(createDialog.getByRole('button', { name: 'Crear borrador', exact: true })).toBeEnabled();
  await createDialog.getByRole('button', { name: 'Crear borrador', exact: true }).click();

  const created = (await documents(page)).find(doc =>
    doc.documentType === 'PLAN_TRABAJO' &&
    doc.teacherId === 'usr-andrea-01' &&
    doc.groupId === 'grp-3' &&
    doc.periodId === 'per-1'
  );
  expect(created).toBeDefined();
  const documentId = created!.id;

  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();
  await page.getByPlaceholder('Defina el objetivo general...').fill('Fomentar el desarrollo tecnológico y la participación estudiantil en programación universitaria.');
  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();

  await page.getByText('Competencias internas de programación universitaria', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();

  const activityRow = page.getByRole('row').filter({ hasText: 'Competencias internas de programación universitaria' });
  await activityRow.getByRole('button', { name: 'Completar', exact: true }).click();
  await page.getByLabel('Desde', { exact: true }).fill('2026-09-14');
  await page.getByLabel('Hasta', { exact: true }).fill('2026-12-18');
  await page.getByRole('checkbox', { name: 'Seleccionar todos', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Equipos de cómputo', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Informe', exact: true }).check();
  await page.getByRole('button', { name: 'Guardar actividad', exact: true }).click();
  await expect(activityRow).toContainText('COMPLETA');

  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar a Anexos →', exact: true }).click();
  await page.getByRole('radio', { name: 'No El documento se generará sin anexos', exact: true }).check();
  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();

  const preview = page.getByTestId('document-page');
  await expect(preview).toContainText('UTA-SGC-A-2-1-P7-T1');
  const beforeSignature = await document(page, documentId);
  expect(beforeSignature).toMatchObject({
    id: documentId,
    teacherId: 'usr-andrea-01',
    groupId: 'grp-3',
    periodId: 'per-1',
    formalVersion: '1.0',
    reviewRound: 1,
  });
  expect(beforeSignature.currentArtifact.pages?.length).toBeGreaterThan(0);
  expect(beforeSignature.flowStages.some(stage => ['Ing. Carlos López, Mg.', 'Ing. Patricia Salazar, Mg.'].includes(stage.actorName))).toBe(false);

  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Firma y Finalización', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText(/flujo de aprobación.+no está completamente configurado/i);
  await expect(page.getByRole('alert')).toContainText(/administrador.+configuración/i);
  await expect(page.getByRole('button', { name: 'FIRMAR Y FINALIZAR ELABORACIÓN', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'ENVIAR A REVISIÓN', exact: true })).toHaveCount(0);

  const blocked = await document(page, documentId);
  expect(blocked.documentState).toBe('LISTO PARA FIRMA');
  expect(blocked.documentState).not.toBe('EN REVISIÓN');
  expect(blocked.formalVersion).toBe('1.0');
  expect(blocked.reviewRound).toBe(1);
  expect(blocked.currentArtifact.signatures).toHaveLength(0);
  expect(blocked.flowStages.some(stage => stage.estado === 'EN_CURSO' && stage.actorRole !== 'docente')).toBe(false);
  expect(blocked.flowStages.some(stage => /Coordinación|Validación final/i.test(stage.stageName))).toBe(false);

  await page.reload();
  await login(page);
  await openDocuments(page);
  const persisted = await document(page, documentId);
  expect(persisted).toMatchObject({ documentState: 'LISTO PARA FIRMA', formalVersion: '1.0', reviewRound: 1 });
  expect(persisted.currentArtifact.matriz).toHaveLength(1);
  await expect(row(page, documentId)).toContainText('LISTO PARA FIRMA');
  await expect(row(page, documentId)).toContainText('Club Académico de Software');

  await session(page, names.laura);
  await page.getByText('Flujos de Aprobación', { exact: true }).click();
  const clubFlow = page.getByRole('row').filter({ hasText: 'Club Académico de Software' });
  await expect(clubFlow).toContainText('PENDIENTE');
  await expect(clubFlow).toContainText('Pendiente de configuración');
  await expect(clubFlow).toContainText('0 etapas');
});
