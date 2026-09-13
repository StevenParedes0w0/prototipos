import {test,expect,type Page} from '@playwright/test';
import {reset,planToReview,session,names,openReview,checklist,sign,document,documents} from './helpers';

async function validatePlan(page:Page,id:string) {
 for (const actor of [names.carlos,names.patricia,names.carlos,names.patricia]) {
  await session(page,actor);await openReview(page,id);await checklist(page);
  const final=(await document(page,id)).documentState==='EN VALIDACIÓN FINAL';
  await sign(page,final?'VALIDAR Y FIRMAR':'APROBAR Y FIRMAR',final?'Validar y firmar':'Aprobar y firmar');
 }
}

test('crear y firmar un Informe derivado no modifica su Plan base',async({page})=>{
 await reset(page);const planId=await planToReview(page);await validatePlan(page,planId);
 await session(page,names.andrea);
 const planBefore=structuredClone(await document(page,planId));
 const idsBefore=(await documents(page)).map(d=>d.id);
 await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
 await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
 await page.getByLabel('Plan de Trabajo Relacionado').selectOption(planId);
 for(let i=0;i<6;i++) await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
 await expect(page.getByText('UTA-SGC-A-2-1-P7-T2',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
 await sign(page,'FIRMAR Y FINALIZAR','FIRMAR Y FINALIZAR');
 const report=(await documents(page)).find(d=>!idsBefore.includes(d.id));
 expect(report).toBeDefined();expect(report!.documentType).toBe('INFORME');
 expect(report!.documentoRelacionadoId).toBe(planId);
 expect(report!.currentArtifact.informeData?.relatedPlanId).toBe(planId);
 await page.getByRole('button',{name:'ENVIAR A REVISIÓN',exact:true}).click();
 expect(await document(page,planId)).toEqual(planBefore);
 expect((await document(page,report!.id)).documentState).toBe('EN REVISIÓN');
});
