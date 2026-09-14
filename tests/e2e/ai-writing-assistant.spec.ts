import { test, expect } from '@playwright/test';
import { reset, login, openDocuments, documents, row } from './helpers';

async function startPlan(page: import('@playwright/test').Page) {
  await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Seleccionar grupo y período'});
  await dialog.getByLabel('Grupo institucional').selectOption('grp-1');
  await dialog.getByLabel('Período').selectOption('per-1');
  await dialog.getByRole('button',{name:'Crear borrador'}).click();
  const id=(await documents(page)).find(d=>d.teacherId==='usr-andrea-01'&&d.groupId==='grp-1')!.id;
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  return id;
}

test('asistente T1 aplica al campo correcto, descarta y persiste',async({page})=>{
  await reset(page); const id=await startPlan(page);
  const justification=page.getByRole('textbox',{name:'Justificación',exact:true});
  await justification.fill('texto inicial');
  await page.getByLabel('Mejorar redacción de Justificación').click();
  await page.getByRole('button',{name:'Mejorar redacción',exact:true}).click();
  await expect(page.getByTestId('ai-suggestion-apply')).toBeVisible();
  await page.getByTestId('ai-suggestion-apply').click();
  await expect(justification).not.toHaveValue('texto inicial');
  await expect(justification).toHaveValue(/texto inicial.*necesidades identificadas/i);
  const applied=await justification.inputValue();
  const objective=page.getByRole('textbox',{name:'Objetivo',exact:true});
  await objective.fill('objetivo original');
  await page.getByLabel('Mejorar redacción de Objetivo').click();
  await page.getByRole('button',{name:'Mejorar redacción',exact:true}).click();
  await page.getByTestId('ai-suggestion-discard').click();
  await expect(objective).toHaveValue('objetivo original');
  await page.reload(); await login(page); await openDocuments(page);
  await row(page,id).getByRole('button',{name:'Continuar elaboración'}).click();
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'Justificación',exact:true})).toHaveValue(applied);
  await expect(page.getByRole('textbox',{name:'Objetivo',exact:true})).toHaveValue('objetivo original');
});

test('asistente T2 aplica Antecedentes y conserva el borrador al reabrir',async({page})=>{
  await reset(page); await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  await page.getByRole('radio',{name:/Informe independiente/}).check();
  await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
  await page.getByLabel('Antecedentes').fill('antecedente inicial');
  await page.getByRole('button',{name:/Mejorar redacción/,exact:true}).click();
  await page.getByRole('button',{name:'Resumen ejecutivo del período académico',exact:true}).click();
  await page.getByTestId('ai-suggestion-apply').click();
  const applied=await page.getByLabel('Antecedentes').inputValue();
  expect(applied).toContain('antecedente inicial'); expect(applied).not.toBe('antecedente inicial');
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
  await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  await page.getByRole('radio',{name:/Informe independiente/}).check();
  await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
  await expect(page.getByLabel('Antecedentes')).toHaveValue(applied);
});
