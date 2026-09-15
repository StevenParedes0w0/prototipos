import {test,expect} from '@playwright/test';
import {reset,session,names,openDocuments,documents,document} from './helpers';

test('reset DEMO deja un Plan canónico elegible para el T2 derivado de Andrea',async({page})=>{
  await reset(page);await session(page,names.andrea);
  const before=await documents(page);
  const eligible=before.find(item=>item.id==='doc-plan-andrea-vinculacion-2026')!;
  expect(eligible).toBeDefined();expect(['VALIDADO','EN EJECUCIÓN']).toContain(eligible.documentState);
  const planBefore=structuredClone(await document(page,eligible.id));
  await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  const select=page.getByLabel('Plan de Trabajo Relacionado');
  await expect(select.locator(`option[value="${eligible.id}"]`)).toHaveCount(1);
  await select.selectOption(eligible.id);
  const next=page.getByRole('button',{name:'Siguiente →',exact:true});await next.click();await next.click();
  for(const activity of eligible.currentArtifact.matriz || []){
    const row=page.getByRole('row').filter({hasText:activity.nombre});await expect(row).toBeVisible();
    for(const medium of activity.medios)await expect(row).toContainText(medium);
  }
  for(let step=3;step<7;step++)await next.click();
  await expect(page.getByTestId('document-page')).toBeVisible();
  expect(await document(page,eligible.id)).toEqual(planBefore);
});
