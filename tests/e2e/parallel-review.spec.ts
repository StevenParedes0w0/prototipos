import {test,expect} from '@playwright/test';
import {reset,planToReview,session,names,row,openReview,checklist,sign,document} from './helpers';

test('revisores paralelos completan la etapa antes de coordinación y validación',async({page})=>{
 await reset(page);const id=await planToReview(page);
 let d=await document(page,id);
 expect(d.flowStages.filter(s=>s.estado==='EN_CURSO').map(s=>s.actorId).sort()).toEqual(['usr-carlos-02','usr-patricia-03']);
 await session(page,names.carlos);await openReview(page,id);await checklist(page);await sign(page,'APROBAR Y FIRMAR','Aprobar y firmar');
 d=await document(page,id);expect(d.documentState).toBe('EN REVISIÓN');expect(d.flowStages.find(s=>s.actorId==='usr-patricia-03'&&s.approvalGroup==='etp-2')?.estado).toBe('EN_CURSO');expect(d.flowStages.find(s=>s.stageName==='Coordinación')?.estado).toBe('PENDIENTE');
 await session(page,names.patricia);await expect(row(page,id)).toBeVisible();await openReview(page,id);await checklist(page);await sign(page,'APROBAR Y FIRMAR','Aprobar y firmar');
 d=await document(page,id);expect(d.flowStages.find(s=>s.stageName==='Coordinación')?.estado).toBe('EN_CURSO');
 await session(page,names.carlos);await openReview(page,id);await checklist(page);await sign(page,'APROBAR Y FIRMAR','Aprobar y firmar');
 d=await document(page,id);expect(d.documentState).toBe('EN VALIDACIÓN FINAL');expect(d.flowStages.find(s=>s.stageName==='Validación final')?.estado).toBe('EN_CURSO');
 await session(page,names.patricia);await openReview(page,id);await checklist(page);await sign(page,'VALIDAR Y FIRMAR','Validar y firmar');
 d=await document(page,id);expect(d.documentState).toBe('VALIDADO');expect(d.operationalState).toBe('EN EJECUCIÓN');expect(d.currentArtifact.signatures).toHaveLength(5);
});
