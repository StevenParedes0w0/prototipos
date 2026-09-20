import { test, expect } from '@playwright/test';
import { checklist, document, login, names, next, openReview, planToReview, reset, row, session } from './helpers';

test('resaltado normalizado persiste, navega y queda histórico en ronda 2', async ({ page }) => {
  await reset(page);
  const id = await planToReview(page);
  const signed = structuredClone((await document(page, id)).currentArtifact);
  const matrixPage = signed.pages!.findIndex(item => item.blocks?.some(block => block.type === 'matrix')) + 1;

  await session(page, names.carlos);
  await openReview(page, id);
  await checklist(page);
  await page.getByRole('button', { name: String(matrixPage), exact: true }).click();
  const highlightAction = page.getByRole('button', { name: 'Resaltar y observar', exact: true });
  await highlightAction.click();
  await page.keyboard.press('Escape');
  await expect(highlightAction).toHaveAttribute('aria-pressed', 'false');
  await highlightAction.click();
  const overlay = page.getByTestId('review-overlay');
  const box = await overlay.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.30, box!.y + box!.height * 0.35);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.58, box!.y + box!.height * 0.45, { steps: 6 });
  await page.mouse.up();
  await page.getByPlaceholder('Detalle la inconsistencia o corrección que debe realizar el elaborador...').fill('Corregir esta actividad');
  await page.getByRole('button', { name: 'REGISTRAR OBSERVACIÓN', exact: true }).click();
  await expect(page.getByTestId('review-observation-count')).toHaveText('Observaciones (1)');
  await expect(page.getByRole('button', { name: 'Existen observaciones activas.', exact: true })).toBeDisabled();

  let current = await document(page, id);
  const observation = current.observations[0];
  expect(observation).toMatchObject({ documentoId: id, artifactId: signed.id, ronda: 1, pageNumber: matrixPage, authorName: names.carlos, texto: 'Corregir esta actividad', status: 'ACTIVE' });
  expect(observation.anchor).toBeDefined();
  for (const value of [observation.anchor!.x, observation.anchor!.y, observation.anchor!.width, observation.anchor!.height]) expect(value).toBeGreaterThan(0);
  expect(observation.anchor!.x + observation.anchor!.width).toBeLessThanOrEqual(1);
  expect(observation.anchor!.y + observation.anchor!.height).toBeLessThanOrEqual(1);
  expect(current.currentArtifact).toEqual(signed);

  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Ir al resaltado de observación 1', exact: true }).click();
  await expect(page.getByTestId('document-page')).toHaveAttribute('data-page-number', String(matrixPage));
  const highlight = page.getByTestId(`observation-highlight-${observation.id}`);
  await expect(highlight).toBeVisible();
  const pageBefore = await page.getByTestId('document-page').boundingBox();
  const markBefore = await highlight.boundingBox();
  await page.getByTitle('Aumentar zoom').click();
  const pageAfter = await page.getByTestId('document-page').boundingBox();
  const markAfter = await highlight.boundingBox();
  expect(Math.abs((markBefore!.x - pageBefore!.x) / pageBefore!.width - (markAfter!.x - pageAfter!.x) / pageAfter!.width)).toBeLessThan(0.02);
  expect(Math.abs(markBefore!.width / pageBefore!.width - markAfter!.width / pageAfter!.width)).toBeLessThan(0.02);

  await page.reload();
  await login(page);
  await session(page, names.carlos);
  await openReview(page, id);
  await page.getByRole('button', { name: 'Ir al resaltado de observación 1', exact: true }).click();
  await expect(page.getByTestId(`observation-highlight-${observation.id}`)).toBeVisible();
  expect((await document(page, id)).observations[0].anchor).toEqual(observation.anchor);

  await page.getByRole('button', { name: 'Devolver documento', exact: true }).click();
  await page.getByPlaceholder('Indique las instrucciones de corrección para el docente...').fill('Corrija la zona resaltada.');
  await page.getByRole('button', { name: 'CONFIRMAR DEVOLUCIÓN', exact: true }).click();
  await session(page, names.andrea);
  await row(page, id).getByRole('button', { name: 'Continuar corrección', exact: true }).click();
  await page.getByText('Ver observaciones y resaltados del documento devuelto', { exact: true }).click();
  await expect(page.getByText('"Corregir esta actividad"', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ir al resaltado de observación 1', exact: true }).click();
  await expect(page.getByTestId(`observation-highlight-${observation.id}`)).toBeVisible();
  await page.getByRole('button', { name: 'Marcar como resuelta', exact: true }).click();
  await page.getByText('Ver observaciones y resaltados del documento devuelto', { exact: true }).click();

  await next(page);
  await page.getByPlaceholder('Defina el objetivo general...').fill('Objetivo corregido después de revisar el resaltado.');
  await next(page);
  await next(page);
  await next(page);
  await next(page);
  current = await document(page, id);
  expect(current).toMatchObject({ formalVersion: '1.0', reviewRound: 2 });
  expect(current.observations[0]).toMatchObject({ status: 'HISTORICAL', estado: 'historica', ronda: 1 });
  expect(current.artifactHistory[0]).toEqual(signed);
  expect(current.currentArtifact.signatures).toHaveLength(0);
});
