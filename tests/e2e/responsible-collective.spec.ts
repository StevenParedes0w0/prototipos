import { test, expect } from '@playwright/test';
import { createPlan, document, login, names, next, openDocuments, reset, row } from './helpers';

async function configureActivity(page: import('@playwright/test').Page, activity: string) {
  const activityRow = page.getByRole('row').filter({ hasText: activity });
  await activityRow.getByRole('button', { name: 'Completar', exact: true }).click();
  await page.getByLabel('Desde', { exact: true }).fill('2026-09-14');
  await page.getByLabel('Hasta', { exact: true }).fill('2026-12-18');
  await page.getByRole('checkbox', { name: 'Seleccionar todos', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Matriz de seguimiento', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Informe', exact: true }).check();
  await page.getByRole('button', { name: 'Guardar actividad', exact: true }).click();
  await expect(activityRow).toContainText('Responsable de la unidad');
}

test('Seleccionar todos conserva identidades y usa responsable colectivo en UI y T1', async ({ page }) => {
  await reset(page);
  const id = await createPlan(page);
  const first = 'Seguimiento al avance de trabajos de titulación';
  await configureActivity(page, first);
  await configureActivity(page, 'Difusión de normativa interna de titulación');

  await next(page);
  await expect(page.getByText('Responsable de la unidad', { exact: true })).toHaveCount(2);

  await page.getByRole('button', { name: `Editar actividad ${first}`, exact: true }).click();
  await page.getByRole('checkbox', { name: names.patricia, exact: true }).uncheck();
  await page.getByRole('button', { name: 'Guardar actividad', exact: true }).click();
  const firstRow = page.getByRole('row').filter({ hasText: first });
  await expect(firstRow).toContainText(names.andrea);
  await expect(firstRow).toContainText(names.carlos);
  await expect(firstRow).not.toContainText(names.patricia);
  await expect(firstRow).not.toContainText('Responsable de la unidad');
  const partialDraft = await page.evaluate(documentId => JSON.parse(localStorage.getItem(`fisei-plan-draft-v1:${documentId}`) || '{}'), id);
  const partialActivity = partialDraft.matriz.find((item: { nombre: string }) => item.nombre === first);
  expect(partialActivity.responsableIds).toEqual(['usr-andrea-01', 'usr-carlos-02']);
  expect(partialActivity.responsableNames).toEqual([names.andrea, names.carlos]);

  await firstRow.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Seleccionar todos', exact: true }).check();
  await page.getByRole('button', { name: 'Guardar actividad', exact: true }).click();
  await expect(firstRow).toContainText('Responsable de la unidad');

  await next(page);
  await page.getByRole('button', { name: 'Continuar a Anexos →', exact: true }).click();
  await page.getByRole('radio', { name: 'No El documento se generará sin anexos', exact: true }).check();
  await next(page);
  const preview = page.getByTestId('document-page');
  const matrixPage = Number((await document(page, id)).currentArtifact.pages?.findIndex(item => item.blocks?.some(block => block.type === 'matrix'))) + 1 || 4;
  await page.getByRole('button', { name: String(matrixPage), exact: true }).click();
  await expect(preview).toContainText('Responsable de la unidad');
  await next(page);

  let persisted = await document(page, id);
  for (const activity of persisted.currentArtifact.matriz || []) {
    expect(activity.responsableIds).toEqual(['usr-andrea-01', 'usr-carlos-02', 'usr-patricia-03']);
    expect(activity.responsableNames).toEqual([names.andrea, names.carlos, names.patricia]);
    expect(new Set(activity.responsableIds).size).toBe(3);
    expect(activity.responsablesEtiqueta).toBe('Responsable de la unidad');
  }
  expect(persisted.currentArtifact.historialCambios?.[0]?.descripcion).toBe('Elaboración del Plan de Trabajo');

  await page.reload();
  await login(page);
  await openDocuments(page);
  persisted = await document(page, id);
  expect(persisted.currentArtifact.matriz?.[0].responsableIds).toEqual(['usr-andrea-01', 'usr-carlos-02', 'usr-patricia-03']);
  expect(persisted.currentArtifact.matriz?.[0].responsablesEtiqueta).toBe('Responsable de la unidad');
  await row(page, id).getByRole('button', { name: 'Ver documento', exact: true }).click();
  await page.getByRole('button', { name: String(matrixPage), exact: true }).click();
  await expect(page.getByTestId('document-page')).toContainText('Responsable de la unidad');
});
