import {test,expect,type Page} from '@playwright/test';
import {reset,session,names,openDocuments,createPlan,completeMatrix,documents,sign} from './helpers';

async function startT2(page:Page){
  await reset(page); await session(page,names.andrea); await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
}

async function goToT2Preview(page:Page){
  const next=page.getByRole('button',{name:'Siguiente →',exact:true});
  for(let n=1;n<7;n++) await next.click();
  await expect(page.getByTestId('t2-preview-shell')).toBeVisible();
}

async function expectScrollableToEnd(page:Page, expectHorizontal=false){
  const result=await page.getByTestId('document-scroll-container').evaluate(node=>{
    node.scrollTop=node.scrollHeight; node.scrollLeft=node.scrollWidth;
    return {top:node.scrollTop,maxTop:node.scrollHeight-node.clientHeight,left:node.scrollLeft,maxLeft:node.scrollWidth-node.clientWidth};
  });
  expect(result.maxTop).toBeGreaterThan(0);
  expect(result.top).toBeGreaterThanOrEqual(result.maxTop-2);
  if(expectHorizontal){expect(result.maxLeft).toBeGreaterThan(0);expect(result.left).toBeGreaterThanOrEqual(result.maxLeft-2);}
}

test('T2 académico y administrativo renderizan procedencia institucional correcta',async({page})=>{
  await startT2(page); await goToT2Preview(page);
  const sheet=page.getByTestId('document-page');
  await expect(sheet).toContainText('UNIDAD ACADÉMICA:');
  await expect(sheet).toContainText('Facultad de Ingeniería en Sistemas, Electrónica e Industrial');
  await expect(sheet).toContainText('CARRERA: INGENIERÍA DE SOFTWARE');
  await expect(sheet).not.toContainText(/Unidad académica \/ administrativa/i);
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  await page.getByRole('radio',{name:/Informe independiente/}).check();
  const ids=(await documents(page)).map(item=>item.id);
  await page.getByTestId('institutional-unit-type').selectOption('ADMINISTRATIVE');
  await expect(page.getByTestId('career-select')).toHaveCount(0);
  await goToT2Preview(page);
  await expect(sheet).toContainText('UNIDAD ADMINISTRATIVA:');
  await expect(sheet).toContainText('Dirección de Planificación y Evaluación');
  await expect(sheet).not.toContainText(/CARRERA:/i);
  await expect(sheet).not.toContainText(/Unidad académica \/ administrativa/i);
  await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
  await sign(page,'FIRMAR Y FINALIZAR','FIRMAR Y FINALIZAR');
  const report=(await documents(page)).find(item=>!ids.includes(item.id))!;
  expect(report.currentArtifact.institutionalUnitType).toBe('ADMINISTRATIVE');
  expect(report.currentArtifact.careerId).toBeUndefined();
  expect(report.currentArtifact.carrera).toBe('');
});

test('T2 permite scroll completo y expansión full-viewport reversible con Escape',async({page})=>{
  await page.setViewportSize({width:1600,height:900}); await startT2(page); await goToT2Preview(page);
  await expectScrollableToEnd(page);
  const viewer=page.getByTestId('document-viewer');
  const pageNumber=await page.getByTestId('document-page').getAttribute('data-page-number');
  await page.getByTitle('Aumentar zoom').click();
  await page.getByLabel('Expandir previsualización').click();
  const box=await viewer.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(1598); expect(box!.height).toBeGreaterThanOrEqual(898);
  await expect(viewer).toHaveCSS('position','fixed');
  await expect(page.getByTestId('document-version-round')).toHaveCSS('white-space','nowrap');
  await expectScrollableToEnd(page);
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveAttribute('data-expanded','false');
  await expect(page.getByTestId('document-page')).toHaveAttribute('data-page-number',pageNumber!);
  await expect(page.getByTitle('Restablecer al 100%')).toHaveText('110%');
});

test('T1 mantiene scroll portrait/landscape, páginas y expansión full-viewport',async({page})=>{
  await page.setViewportSize({width:1366,height:768}); await reset(page); await session(page,names.andrea); await openDocuments(page);
  await createPlan(page); await completeMatrix(page);
  const sheet=page.getByTestId('document-page'); const count=Number(await sheet.getAttribute('data-page-count'));
  await expectScrollableToEnd(page);
  for(let n=1;n<=count;n++){await page.getByTitle(`Ir a página ${n}`,{exact:true}).click();if(await sheet.locator('[data-rendered-section="matrix"]').count())break;}
  await expect(sheet).toHaveAttribute('data-page-orientation','landscape');
  await expect(sheet).toContainText('14/09/2026');
  await expect(sheet).toContainText('18/12/2026');
  await expect(sheet).not.toContainText(/2026-09-14|2026-12-18/);
  for(let i=0;i<4;i++) await page.getByTitle('Aumentar zoom').click();
  await expectScrollableToEnd(page,true);
  const selected=await sheet.getAttribute('data-page-number');
  await page.getByLabel('Expandir previsualización').click();
  const box=await page.getByTestId('document-viewer').boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(1364); expect(box!.height).toBeGreaterThanOrEqual(766);
  await expectScrollableToEnd(page);
  await page.getByLabel('Salir de vista expandida').click();
  await expect(sheet).toHaveAttribute('data-page-number',selected!);
  await expect(sheet).toHaveAttribute('data-page-count',String(count));
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  await expect(page.getByLabel('Contraer barra lateral')).toBeVisible();
});
