import {test,expect} from '@playwright/test';
import {reset,session,names,documents} from './helpers';

test('dashboard administrador muestra conteos operativos y navegación coherente',async({page})=>{
 await reset(page);const docs=await documents(page);await session(page,names.laura);
 const dashboard=page.getByTestId('admin-dashboard');await expect(dashboard).toBeVisible();
 await expect(dashboard.getByTestId('metric-drafts')).toContainText(String(docs.filter(d=>['BORRADOR','LISTO PARA FIRMA'].includes(d.documentState)).length));
 await expect(dashboard.getByTestId('metric-review')).toContainText(String(docs.filter(d=>['EN REVISIÓN','EN VALIDACIÓN FINAL'].includes(d.documentState)).length));
 await expect(dashboard).toContainText('Evidencias');await expect(dashboard).toContainText('Flujos pendientes');await expect(dashboard).not.toContainText(/ranking|score|productividad|desempeño docente|predicci/i);
 await dashboard.getByRole('button',{name:/Flujos configurados/}).click();await expect(page.getByRole('heading',{name:'Flujos de Aprobación'})).toBeVisible();
 await page.getByText('Panel General',{exact:true}).click();await page.getByTestId('admin-dashboard').getByRole('button',{name:/Usuarios activos/}).click();await expect(page.getByRole('heading',{name:'Usuarios',exact:true})).toBeVisible();
});
