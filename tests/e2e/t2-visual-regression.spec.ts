import {test,expect} from '@playwright/test';
import {reset,planToReview,validatePlan,session,names,documents,sign,document} from './helpers';

test('T2 mantiene estructura, paginación y firmas dinámicas',async({page})=>{
 await reset(page);const planId=await planToReview(page);await validatePlan(page,planId);await session(page,names.andrea);
 const ids=(await documents(page)).map(d=>d.id);
 await page.getByText('Documentación Académica',{exact:true}).click();await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
 await page.getByLabel('Plan de Trabajo Relacionado').selectOption(planId);for(let i=0;i<6;i++)await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
 const sheet=page.getByTestId('document-page');const count=Number(await sheet.getAttribute('data-page-count'));expect(count).toBeGreaterThanOrEqual(3);
 await expect(sheet).toContainText('UTA-SGC-A-2-1-P7-T2');await expect(sheet).not.toContainText('INFORME DE: INFORME DE:');
 await expect(sheet).toHaveScreenshot('t2-portada.png');
 const content=Math.min(3,count);await page.getByRole('button',{name:String(content),exact:true}).click();await expect(sheet).toHaveScreenshot('t2-contenido.png');
 await page.getByRole('button',{name:String(count),exact:true}).click();await expect(sheet).toContainText('ACCIONES');await expect(sheet).toContainText('FIRMA');await expect(sheet).toHaveScreenshot('t2-firmas.png');
 for(let n=1;n<=count;n++){await page.getByRole('button',{name:String(n),exact:true}).click();const text=await sheet.innerText();expect(text).not.toMatch(/Nota1:|se debe utilizar en caso|nombre del documento que lo respalda/i);expect(text).toContain('UTA-SGC-A-2-1-P7-T2');}
 await page.getByRole('button',{name:'Siguiente →',exact:true}).click();await sign(page,'FIRMAR Y FINALIZAR','FIRMAR Y FINALIZAR');
 const report=(await documents(page)).find(d=>!ids.includes(d.id))!;const persisted=await document(page,report.id);
 expect(persisted.currentArtifact.pageCount).toBe(persisted.currentArtifact.pages!.length);
 for(const slot of persisted.currentArtifact.signatureSlots!){expect(slot.pageIndex).toBeGreaterThanOrEqual(1);expect(slot.pageIndex).toBeLessThanOrEqual(persisted.currentArtifact.pages!.length);expect(slot.pageNumber).toBe(slot.pageIndex);}
});
