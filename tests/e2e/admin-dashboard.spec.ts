import {test,expect} from '@playwright/test';
import {reset,session,names,documents,openDocuments} from './helpers';

test('dashboard administrador muestra conteos operativos y navegación coherente',async({page})=>{
 await reset(page);const docs=await documents(page);await session(page,names.laura);
 const dashboard=page.getByTestId('admin-dashboard');await expect(dashboard).toBeVisible();
 await expect(dashboard.getByTestId('metric-drafts')).toContainText(String(docs.filter(d=>['BORRADOR','LISTO PARA FIRMA'].includes(d.documentState)).length));
 await expect(dashboard.getByTestId('metric-review')).toContainText(String(docs.filter(d=>['EN REVISIÓN','EN VALIDACIÓN FINAL'].includes(d.documentState)).length));
 await expect(dashboard).toContainText('Evidencias');await expect(dashboard).toContainText('Flujos pendientes');await expect(dashboard).not.toContainText(/ranking|score|productividad|desempeño docente|predicci/i);
 await session(page,names.andrea);await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();
 const create=page.getByRole('dialog',{name:'Seleccionar grupo y período'});await create.getByLabel('Grupo institucional').selectOption('grp-1');await create.getByLabel('Período').selectOption('per-1');await create.getByRole('button',{name:'Crear borrador'}).click();
 const withNew=await documents(page);expect(withNew).toHaveLength(docs.length+1);await session(page,names.laura);
 await expect(page.getByTestId('metric-drafts')).toContainText(String(withNew.filter(d=>['BORRADOR','LISTO PARA FIRMA'].includes(d.documentState)).length));
 await page.getByRole('button',{name:'Restablecer documentos DEMO',exact:true}).click();await page.getByText('Panel General',{exact:true}).click();
 await expect(page.getByTestId('metric-drafts')).toContainText(String(docs.filter(d=>['BORRADOR','LISTO PARA FIRMA'].includes(d.documentState)).length));
 await dashboard.getByRole('button',{name:/Flujos configurados/}).click();await expect(page.getByRole('heading',{name:'Flujos de Aprobación'})).toBeVisible();
 await page.getByText('Panel General',{exact:true}).click();await page.getByTestId('admin-dashboard').getByRole('button',{name:/Usuarios activos/}).click();await expect(page.getByRole('heading',{name:'Usuarios',exact:true})).toBeVisible();
});
