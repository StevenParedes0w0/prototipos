import {test,expect} from '@playwright/test';
import {reset,session,names,openDocuments,createPlan,completeMatrix} from './helpers';

async function openT2Preview(page:any){
  await reset(page); await session(page,names.andrea); await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  const next=page.getByRole('button',{name:'Siguiente →',exact:true});
  for(let n=1;n<7;n++) await next.click();
  await expect(page.getByTestId('t2-preview-shell')).toBeVisible();
}

test('T2 contrae y restaura la barra lateral al entrar y salir de la previsualización',async({page})=>{
  await page.setViewportSize({width:1600,height:900}); await openT2Preview(page);
  await expect(page.getByLabel('Expandir barra lateral')).toBeVisible();
  const layout=page.getByTestId('document-preview-layout');
  expect((await layout.boundingBox())!.width).toBeGreaterThan(1000);
  await expect(page.getByTestId('document-page-indicator')).toBeVisible();
  await expect(page.getByTestId('document-version-round')).toHaveCSS('white-space','nowrap');
  await expect(page.getByTitle('Ajustar documento a la pantalla visible')).toBeVisible();
  const before=(await layout.boundingBox())!.width;
  await page.getByLabel('Expandir previsualización').click();
  await expect(page.getByLabel('Salir de vista expandida')).toBeVisible();
  expect((await layout.boundingBox())!.width).toBeGreaterThan(before);
  await page.getByLabel('Salir de vista expandida').click();
  await page.getByRole('button',{name:'← Anterior',exact:true}).click();
  await expect(page.getByLabel('Contraer barra lateral')).toBeVisible();
});

test('T1 aplica el mismo auto-collapse y conserva sus páginas',async({page})=>{
  await reset(page); await session(page,names.andrea); await openDocuments(page);
  await createPlan(page); await completeMatrix(page);
  await expect(page.getByTestId('document-page')).toBeVisible();
  await expect(page.getByLabel('Expandir barra lateral')).toBeVisible();
  const pageCount=await page.getByTestId('document-page').getAttribute('data-page-count');
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  await expect(page.getByLabel('Contraer barra lateral')).toBeVisible();
  expect(pageCount).toBeTruthy();
});
