import {test,expect} from '@playwright/test';
import {reset,session,names,row,documents} from './helpers';

test('cierre DEMO vuelve documentos solo lectura y se puede restablecer',async({page})=>{
 await reset(page);await session(page,names.laura);await page.getByText('Cierre de Períodos',{exact:true}).click();
 await expect(page.getByText('PERÍODO EN CURSO',{exact:true})).toBeVisible();await page.getByRole('button',{name:'PROBAR CIERRE — DEMO',exact:true}).click();
 await expect(page.getByText('Aviso de Simulación de Cierre',{exact:true})).toBeVisible();await page.getByRole('button',{name:'CONTINUAR CON SIMULACIÓN',exact:true}).click();
 await page.getByRole('checkbox',{name:'Confirmo que esta acción corresponde a una simulación administrativa de cierre del período.',exact:true}).check();await page.getByRole('button',{name:'CERRAR PERÍODO — DEMO',exact:true}).click();
 await expect(page.getByText('Estado resultante simulado: CERRADO',{exact:true})).toBeVisible();
 await session(page,names.andrea);const own=(await documents(page)).filter(d=>d.teacherId==='usr-andrea-01'&&d.periodId==='per-1');
 for(const d of own){await expect(row(page,d.id)).toContainText('SOLO LECTURA');await expect(row(page,d.id).getByTitle(/Continuar|Corregir/)).toHaveCount(0);}
 await session(page,names.laura);await page.getByText('Cierre de Períodos',{exact:true}).click();await page.getByRole('button',{name:'RESTABLECER DEMO',exact:true}).click();await expect(page.getByText('PERÍODO EN CURSO',{exact:true})).toBeVisible();
 await page.getByText('Reportes Institucionales',{exact:true}).click();await page.getByRole('button',{name:/Consulta Histórica/i}).click();
 const historicSelect=page.locator('main select');await historicSelect.selectOption('Enero – Junio 2026');const historicRow=page.getByRole('row').filter({hasText:'Enero – Junio 2026'}).first();await expect(historicRow).toBeVisible();await historicRow.getByRole('button',{name:'Ver Histórico',exact:true}).click();await expect(page.getByText('FINALIZADO',{exact:true}).first()).toBeVisible();await expect(page.getByText(/modo solo lectura/i).first()).toBeVisible();
});

