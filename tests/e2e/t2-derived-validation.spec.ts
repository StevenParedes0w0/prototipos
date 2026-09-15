import {test,expect} from '@playwright/test';
import {reset,planToReview,validatePlan,session,names,openDocuments,documents,document,sign} from './helpers';

test('T2 derivado exige Plan, importa la matriz y mantiene aislado el T1',async({page})=>{
 await reset(page);const planId=await planToReview(page);await validatePlan(page,planId);await session(page,names.andrea);
 const planBefore=structuredClone(await document(page,planId));const ids=(await documents(page)).map(d=>d.id);
 await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
 const planSelect=page.getByLabel('Plan de Trabajo Relacionado');await planSelect.selectOption('');
 const next=page.getByRole('button',{name:'Siguiente →',exact:true});await expect(next).toBeDisabled();
 await planSelect.selectOption(planId);await page.getByLabel('Título institucional del informe').fill('INFORME DE: INFORME DE: Seguimiento institucional');
 await next.click();await next.click();
 await expect(page.getByRole('cell',{name:'Seguimiento al avance de trabajos de titulación',exact:true})).toBeVisible();
 for(let i=0;i<4;i++)await next.click();
 const sheet=page.getByTestId('document-page');await expect(sheet).not.toContainText(/INFORME DE:\s*INFORME DE/i);
 await expect(sheet.locator('table').first()).not.toContainText('Carrera:');
 const count=Number(await sheet.getAttribute('data-page-count'));for(let n=1;n<=count;n++){await page.getByTitle(`Ir a página ${n}`,{exact:true}).click();if((await sheet.innerText()).includes('Seguimiento al avance de trabajos de titulación'))break;}await expect(sheet).toContainText('Seguimiento al avance de trabajos de titulación');
 await page.getByRole('button',{name:'Siguiente →',exact:true}).click();await sign(page,'FIRMAR Y FINALIZAR','FIRMAR Y FINALIZAR');
 const report=(await documents(page)).find(d=>!ids.includes(d.id))!;expect(report.currentArtifact.informeData?.relatedPlanId).toBe(planId);expect(report.currentArtifact.informeData?.actividadesInforme?.length).toBeGreaterThan(0);expect(report.currentArtifact.informeData?.actividadesInforme?.every(a=>a.mediosVerificacion.trim().length>0)).toBe(true);expect(report.currentArtifact.pageCount).toBe(report.currentArtifact.pages!.length);
 expect(await document(page,planId)).toEqual(planBefore);
});
