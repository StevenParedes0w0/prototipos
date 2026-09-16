import { expect, type Page } from '@playwright/test';
import type { DocumentMasterState } from '../../src/documentEngine/types';

export const names = { andrea: 'Ing. Andrea Pérez, Mg.', carlos: 'Ing. Carlos López, Mg.', patricia: 'Ing. Patricia Salazar, Mg.', laura: 'Ing. Laura Medina, Mg.' };
async function solveLoginCaptcha(page: Page) {
 const question = await page.getByTestId('login-captcha-question').textContent();
 const operands = question?.match(/(\d+)\s*\+\s*(\d+)/);
 expect(operands, 'La verificación de seguridad debe mostrar una suma').not.toBeNull();
 await page.getByLabel('Respuesta de verificación').fill(String(Number(operands![1]) + Number(operands![2])));
}
export async function login(page: Page) {
 await page.goto('/');
 await page.getByPlaceholder('usuario@uta.edu.ec').fill('andrea.perez@uta.edu.ec');
 await page.getByPlaceholder('••••••••••', {exact:true}).fill('Mi$Clave2026');
 await solveLoginCaptcha(page);
 await page.getByRole('button', {name:'INICIAR SESIÓN',exact:true}).click();
 await expect(page.getByLabel('Cambiar persona de la sesión DEMO')).toBeVisible();
}
export async function reset(page: Page) {
 await page.clock.setFixedTime(new Date('2026-09-12T15:00:00-05:00'));
 await login(page);
 await page.getByRole('button',{name:'Restablecer documentos DEMO',exact:true}).click();
}
export async function session(page: Page, name: string) {
 await page.getByLabel('Cambiar persona de la sesión DEMO').selectOption({label:name});
 await expect(page.getByLabel('Cambiar persona de la sesión DEMO').locator('option:checked')).toHaveText(name);
}
// Read-only persistence inspection complements visible assertions; never seeds or mutates documents.
export async function documents(page: Page): Promise<DocumentMasterState[]> {
 return page.evaluate(() => JSON.parse(localStorage.getItem('fisei_documents_collection_v8') || '[]'));
}
export async function document(page: Page, id: string) {
 const doc = (await documents(page)).find(d=>d.id===id);
 expect(doc, `Documento canónico ${id}`).toBeDefined();
 return doc!;
}
export function row(page: Page, id: string) {return page.locator(`tr[data-document-id="${id}"]`);}
export async function openDocuments(page: Page) {
 await page.getByText('Documentación Académica',{exact:true}).click();
 await expect(page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true})).toBeVisible();
}
export async function next(page: Page) { await page.getByRole('button',{name:'Continuar →',exact:true}).click(); }
export async function createPlan(page: Page) {
 await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();
 await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Seleccionar grupo y período'});
 await dialog.getByLabel('Grupo institucional').selectOption('grp-1');
 await dialog.getByLabel('Período').selectOption('per-1');
 await expect(dialog.getByRole('button',{name:'Crear borrador'})).toBeEnabled();
 await dialog.getByRole('button',{name:'Crear borrador'}).click();
 const doc=(await documents(page)).find(d=>d.teacherId==='usr-andrea-01' && d.groupId==='grp-1' && d.periodId==='per-1')!;
 await next(page);
 await page.getByPlaceholder('Defina el objetivo general...').fill('Gestionar la ejecución de los procesos académicos y administrativos de la Unidad de Titulación.');
 await next(page);
 await next(page);
 return doc.id;
}
export async function completeMatrix(page: Page, validateOther=false) {
 for (const activity of ['Seguimiento al avance de trabajos de titulación','Difusión de normativa interna de titulación']) {
  await page.getByRole('row').filter({hasText:activity}).getByRole('button',{name:'Completar',exact:true}).click();
  await page.getByLabel('Desde',{exact:true}).fill('2026-09-14');
  await page.getByLabel('Hasta',{exact:true}).fill('2026-12-18');
  await page.getByRole('checkbox',{name:'Seleccionar todos',exact:true}).check();
  for (const name of [names.andrea,names.carlos,names.patricia]) await expect(page.getByRole('checkbox',{name,exact:true})).toBeChecked();
  await page.getByRole('checkbox',{name:'Matriz de seguimiento',exact:true}).check();
  await page.getByRole('checkbox',{name:'Informe',exact:true}).check();
  if (validateOther) {
   await page.getByRole('checkbox',{name:'Otro recurso',exact:true}).check();
   await page.getByRole('checkbox',{name:'Otro medio de verificación',exact:true}).check();
   await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
   await expect(page.getByLabel('Especifique el recurso',{exact:true})).toBeFocused();
   await page.getByLabel('Especifique el recurso',{exact:true}).fill('Calendario académico');
   await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
   await expect(page.getByLabel('Especifique el medio de verificación',{exact:true})).toBeFocused();
   await page.getByLabel('Especifique el medio de verificación',{exact:true}).fill('Reporte de seguimiento periódico');
  }
  await page.getByRole('button',{name:'Guardar actividad',exact:true}).click();
 }
 await next(page);
 await page.getByRole('button',{name:'Continuar a Anexos →',exact:true}).click();
 await page.getByRole('radio',{name:'No El documento se generará sin anexos',exact:true}).check();
 await next(page);
}
export async function sign(page: Page, action='FIRMAR Y FINALIZAR ELABORACIÓN', trigger=action) {
 await page.getByRole('button',{name:trigger,exact:true}).click();
 const modal=page.getByRole('dialog',{name:'Firma documental'});
 await modal.getByRole('button',{name:'Usar certificado DEMO',exact:true}).click();
 await modal.getByRole('checkbox').check();
 await modal.getByRole('button',{name:action,exact:true}).click();
 await expect(modal).toBeHidden();
}
export async function openReview(page: Page,id:string) {
 await row(page,id).getByRole('button',{name:'Revisar documento',exact:true}).click();
 await expect(page.getByTestId('document-status')).toBeVisible();
}
export async function checklist(page: Page) {
 for (const label of ['Información general','Justificación y objetivo','Matriz de actividades','Anexos y medios','Firmas de responsabilidad'])
  await page.getByRole('checkbox',{name:label,exact:true}).check();
}
export async function planToReview(page: Page) {
 const id=await createPlan(page); await completeMatrix(page); await next(page); await sign(page);
 return id;
}
export async function validatePlan(page: Page,id:string) {
 for (const actor of [names.carlos,names.patricia,names.carlos,names.patricia]) {
  await session(page,actor);await openReview(page,id);await checklist(page);
  const final=(await document(page,id)).documentState==='EN VALIDACIÓN FINAL';
  await sign(page,final?'VALIDAR Y FIRMAR':'APROBAR Y FIRMAR',final?'Validar y firmar':'Aprobar y firmar');
 }
}
