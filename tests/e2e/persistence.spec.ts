import {test,expect} from '@playwright/test';
import {reset,createPlan,completeMatrix,next,sign,document,login,row,openDocuments} from './helpers';

test('firma y envío automático persisten tras recarga sin segunda firma docente',async({page})=>{
 await reset(page);const id=await createPlan(page);await completeMatrix(page);await next(page);await sign(page);
 expect((await document(page,id)).currentArtifact.signatures).toHaveLength(1);
 await page.reload();await login(page);await openDocuments(page);
 await expect(row(page,id)).toContainText('EN REVISIÓN');
 await row(page,id).getByRole('button',{name:'Ver documento',exact:true}).click();
 await expect(page.getByText('FIRMAR Y FINALIZAR ELABORACIÓN',{exact:true})).toHaveCount(0);
 expect((await document(page,id)).currentArtifact.signatures).toHaveLength(1);
});
