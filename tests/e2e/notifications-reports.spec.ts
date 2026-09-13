import {test,expect} from '@playwright/test';
import {reset,session,names} from './helpers';

test('notificación contextual abre la evidencia indicada y actualiza no leídas',async({page})=>{
 await reset(page);await page.getByTitle('Notificaciones').click();
 await expect(page.getByText(/3 no leídas/)).toBeVisible();await page.getByRole('button',{name:'VER TODAS LAS NOTIFICACIONES',exact:true}).click();
 const card=page.getByRole('heading',{name:'Documento devuelto',exact:true}).locator('xpath=ancestor::div[.//button[contains(normalize-space(.),"Abrir documento")]][1]');
 await card.getByRole('button',{name:/Abrir documento/}).click();
 await expect(page.getByText('Plan de Trabajo: Comisión de Eventos Académicos',{exact:true}).first()).toBeVisible();
 await expect(page.getByTitle('Notificaciones')).toHaveText('2');
});

test('reportes por rol separan evidencia cargada y validada y conservan rótulo DEMO',async({page})=>{
 await reset(page);await page.getByText('Mis Reportes',{exact:true}).click();await expect(page.getByRole('heading',{name:/Mis Reportes/})).toBeVisible();
 await expect(page.getByText('Cargadas',{exact:true})).toBeVisible();await expect(page.getByText('Validadas',{exact:true})).toBeVisible();
 const body=(await page.locator('body').innerText()).toLowerCase();for(const forbidden of ['ranking de docentes','score individual','desempeño laboral','productividad individual','sanciones automáticas','predicciones','calificaciones del profesor']) expect(body).not.toContain(forbidden);
 await session(page,names.carlos);await page.getByText('Reportes de Seguimiento',{exact:true}).click();await expect(page.getByRole('heading',{name:/Reportes de Seguimiento/})).toBeVisible();
 await session(page,names.laura);await page.getByText('Reportes Institucionales',{exact:true}).click();await expect(page.getByRole('heading',{name:/Reportes Institucionales/})).toBeVisible();
 await page.getByRole('button',{name:/GENERAR REPORTE/i}).first().click();await expect(page.getByText(/DEMO/i).first()).toBeVisible();
});
