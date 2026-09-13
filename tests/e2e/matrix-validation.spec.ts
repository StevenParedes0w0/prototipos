import {test,expect} from '@playwright/test';
import {reset,openDocuments,createPlan,names} from './helpers';

async function openFirst(page:any){await reset(page);await openDocuments(page);await createPlan(page);const activity='Seguimiento al avance de trabajos de titulación';await page.getByRole('row').filter({hasText:activity}).getByRole('button',{name:'Completar',exact:true}).click();}

test('Otro vacío conserva drawer, enfoca errores y no incrementa contadores',async({page})=>{
 await openFirst(page);await page.getByLabel('Desde',{exact:true}).fill('2026-09-14');await page.getByLabel('Hasta',{exact:true}).fill('2026-12-18');
 await page.getByRole('checkbox',{name:'Seleccionar todos',exact:true}).check();await page.getByRole('checkbox',{name:'Matriz de seguimiento',exact:true}).check();
 await page.getByRole('checkbox',{name:'Otro recurso',exact:true}).check();await page.getByRole('checkbox',{name:'Otro medio de verificación',exact:true}).check();
 await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
 await expect(page.getByText('Especifique el recurso personalizado o desmarque ‘Otro’.',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Especifique el recurso',{exact:true})).toBeFocused();
 await expect(page.getByText('Configurar actividad',{exact:true})).toBeVisible();
 await expect(page.getByText('0 / 2 configuradas',{exact:true})).toBeVisible();
 for(const name of [names.andrea,names.carlos,names.patricia]) await expect(page.getByRole('checkbox',{name,exact:true})).toBeChecked();
 await page.getByLabel('Especifique el recurso',{exact:true}).fill('Calendario académico');
 await expect(page.getByText(/Especifique el recurso personalizado/)).toHaveCount(0);
 await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
 await expect(page.getByLabel('Especifique el medio de verificación',{exact:true})).toBeFocused();
 await page.getByLabel('Especifique el medio de verificación',{exact:true}).fill('Reporte mensual');
 await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
 const first=page.getByRole('row').filter({hasText:'Seguimiento al avance de trabajos de titulación'});
 await expect(first).toContainText('COMPLETA');await expect(first).toContainText('2 recursos');await expect(first).toContainText('Reporte mensual');
});

test('responsables múltiples y feriados usan fechas ISO sin desfase',async({page})=>{
 await openFirst(page);const all=page.getByRole('checkbox',{name:'Seleccionar todos',exact:true});await all.check();
 for(const name of [names.andrea,names.carlos,names.patricia]) await expect(page.getByRole('checkbox',{name,exact:true})).toBeChecked();
 await page.getByRole('checkbox',{name:names.carlos,exact:true}).uncheck();await expect(all).not.toBeChecked();await all.check();
 await page.getByLabel('Desde',{exact:true}).fill('2026-10-09');await page.getByLabel('Hasta',{exact:true}).fill('2026-10-12');
 await expect(page.getByText('La fecha coincide con un feriado o receso institucional.',{exact:true})).toBeVisible();
 await page.getByLabel('Desde',{exact:true}).fill('2026-10-08');await expect(page.getByText(/feriado o receso/)).toHaveCount(0);
 await expect(page.getByText(/hasta las 23:59 del día seleccionado/)).toBeVisible();
 await page.getByLabel('Hasta',{exact:true}).fill('2026-10-09');await expect(page.getByText(/feriado o receso/)).toBeVisible();
 await page.getByLabel('Hasta',{exact:true}).fill('2026-10-12');await expect(page.getByText(/feriado o receso/)).toHaveCount(0);
 await expect(page.getByLabel('Desde',{exact:true})).toHaveValue('2026-10-08');await expect(page.getByLabel('Hasta',{exact:true})).toHaveValue('2026-10-12');
});
