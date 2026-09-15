import {test,expect} from '@playwright/test';
import {reset,session,names,openDocuments} from './helpers';

test('stepper T2 permanece compacto, accesible y en una fila a 1600x900',async({page})=>{
  await reset(page);await session(page,names.andrea);await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  const stepper=page.getByTestId('t2-compact-stepper');await expect(stepper).toBeVisible();
  const box=await stepper.boundingBox();expect(box!.height).toBeLessThan(130);
  const steps=stepper.locator('button[data-step-number]');await expect(steps).toHaveCount(8);
  const y=await steps.evaluateAll(nodes=>nodes.map(node=>Math.round(node.getBoundingClientRect().top)));
  expect(Math.max(...y)-Math.min(...y)).toBeLessThanOrEqual(2);
  await expect(steps.nth(0)).toHaveAttribute('aria-current','step');await expect(steps.nth(1)).toBeDisabled();
  await expect(page.getByLabel('Plan de Trabajo Relacionado')).toBeVisible();
  await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
  await expect(steps.nth(0)).toHaveAccessibleName(/completado/);await expect(steps.nth(1)).toHaveAttribute('aria-current','step');
});
