import {test,expect,type Page} from '@playwright/test';
import path from 'node:path';
import {reset,session,names} from './helpers';

const fixture=path.join(process.cwd(),'tests','e2e','fixtures','evidencia.pdf');
const activity='Seguimiento al avance de trabajos de titulación';

async function openActivity(page:Page) {
 await page.getByText('Mis Actividades',{exact:true}).click();
 if (await page.getByRole('heading',{name:activity,exact:true}).isVisible()) return;
 const activityRow=page.getByRole('row').filter({hasText:activity});
 await expect(activityRow).toBeVisible();
 await activityRow.getByRole('button',{name:'VER ACTIVIDAD',exact:true}).click();
}

async function evidenceState(page:Page) {
 return page.evaluate(() => JSON.parse(localStorage.getItem('fisei_modulo6_actividades_v2') || '[]'));
}

test('evidencia PDF conserva observación, reemplazo, versión e historial',async({page})=>{
 await reset(page);await openActivity(page);
 await page.getByRole('button',{name:'CARGAR EVIDENCIA',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles(fixture);
 await page.locator('form').getByRole('button',{name:'CARGAR EVIDENCIA',exact:true}).click();
 await expect(page.getByText('evidencia.pdf',{exact:true})).toBeVisible();
 await expect(page.getByText('PENDIENTE DE VALIDACIÓN',{exact:false})).toBeVisible();

 await session(page,names.carlos);
 await page.getByText('Evidencias por validar',{exact:true}).click();
 const reviewRow=page.getByRole('row').filter({hasText:'evidencia.pdf'});
 await expect(reviewRow).toContainText('v1.0');
 await reviewRow.getByRole('button',{name:'REVISAR',exact:true}).click();
 await page.getByRole('button',{name:'Observar evidencia',exact:true}).click();
 await page.getByPlaceholder('Describa con precisión los motivos por los cuales la evidencia no es admitida...').fill('Incluir la firma de responsabilidad antes de validar.');
 await page.getByRole('button',{name:'CONFIRMAR OBSERVACIÓN',exact:true}).click();

 await session(page,names.andrea);await openActivity(page);
 await page.getByRole('button',{name:'VER OBSERVACIÓN',exact:true}).click();
 await expect(page.getByText('Incluir la firma de responsabilidad antes de validar.')).toBeVisible();
 await page.getByRole('button',{name:'REEMPLAZAR EVIDENCIA',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles({name:'evidencia_corregida.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 corrected')});
 await page.getByPlaceholder('Ej.: Corrección de firmas / Anexo complementario actualizado').fill('Se incorpora la firma solicitada.');
 await page.getByRole('button',{name:'REEMPLAZAR ARCHIVO',exact:true}).click();
 await expect(page.getByText('evidencia_corregida.pdf',{exact:true})).toBeVisible();
 await page.getByTitle('Ver trazabilidad y auditoría').click();
 await expect(page.getByText('v2.0',{exact:true})).toBeVisible();
 await expect(page.getByText('v1.0',{exact:true})).toBeVisible();
 await expect(page.getByText('Se incorpora la firma solicitada.')).toBeVisible();
 const state=await evidenceState(page);const medium=state.find((a:any)=>a.nombre===activity).medios.find((m:any)=>m.nombre==='Reporte de seguimiento');
 expect(medium.estado).toBe('PENDIENTE DE VALIDACIÓN');
 expect(medium.historialVersiones).toHaveLength(2);
 expect(medium.historialVersiones.map((v:any)=>[v.version,v.vigente])).toEqual([[1,false],[2,true]]);
 expect(medium.eventosAuditoria.map((e:any)=>e.tipo)).toEqual(['CARGA','OBSERVACION','REEMPLAZO']);
});
