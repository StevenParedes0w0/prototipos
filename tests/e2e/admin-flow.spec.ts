import {test,expect} from '@playwright/test';
import {reset,session,names,documents} from './helpers';

test('administración conserva flujos por grupo e incompletos explícitos',async({page})=>{
 await reset(page);await session(page,names.laura);await page.getByText('Flujos de Aprobación',{exact:true}).click();
 const unit=page.getByRole('row').filter({hasText:'Unidad de Titulación'});const club=page.getByRole('row').filter({hasText:'Club Académico de Software'});
 await expect(unit).toContainText('CONFIGURADO');await expect(unit).toContainText(/4 etapas/);
 await expect(club).toContainText('PENDIENTE');await expect(club).toContainText('Pendiente de configuración');await expect(club).toContainText('0 etapas');
 await unit.getByRole('button',{name:'Configurar flujo de Unidad de Titulación'}).click();await expect(page.getByRole('heading',{name:'Unidad de Titulación'})).toBeVisible();await expect(page.getByText(/ETAPA 4: Validación final/)).toBeVisible();
 await page.getByText('Volver a Flujos de Aprobación',{exact:true}).click();await club.getByRole('button',{name:'Configurar flujo de Club Académico de Software'}).click();
 await expect(page.getByRole('heading',{name:'Club Académico de Software'})).toBeVisible();await expect(page.getByText(/Autoridad correspondiente/)).toHaveCount(0);
 const incomplete=(await documents(page)).find(d=>d.groupId==='grp-3'&&d.documentType==='PLAN_TRABAJO')!;
 expect(incomplete.documentState).toBe('BORRADOR');expect(incomplete.flowStages.some(s=>s.actorName==='Responsable pendiente de configuración')).toBe(true);
});
