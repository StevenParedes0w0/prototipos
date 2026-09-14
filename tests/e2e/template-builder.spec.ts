import {test,expect,type Locator} from '@playwright/test';
import {reset,session,names,documents,openDocuments} from './helpers';
const order=async(list:Locator)=>list.locator(':scope > [data-section-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-section-id')));

test('configurador HTML5 reordena, persiste, restaura y aísla T1/T2',async({page})=>{
 await reset(page);await session(page,names.laura);await page.getByText('Plantillas Documentales',{exact:true}).click();
 await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();let dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});const list=dialog.getByTestId('template-section-list');
 const initial=await order(list);
 await dialog.getByTestId('template-section-header').dragTo(dialog.getByTestId('template-section-justification'));expect(await order(list)).toEqual(initial);
 await dialog.getByTestId('template-section-justification').dragTo(dialog.getByTestId('template-section-annexes'));const changed=await order(list);expect(changed).not.toEqual(initial);
 await dialog.getByRole('button',{name:'Guardar configuración',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('guardada');await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
 await session(page,names.andrea);await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();const create=page.getByRole('dialog',{name:'Seleccionar grupo y período'});await create.getByLabel('Grupo institucional').selectOption('grp-1');await create.getByLabel('Período').selectOption('per-1');await create.getByRole('button',{name:'Crear borrador'}).click();const created=(await documents(page)).find(d=>d.teacherId==='usr-andrea-01'&&d.groupId==='grp-1')!;expect(created.currentArtifact.templateConfiguration?.sectionOrder).toEqual(changed);
 await session(page,names.laura);await page.getByText('Plantillas Documentales',{exact:true}).click();
 await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});expect(await order(dialog.getByTestId('template-section-list'))).toEqual(changed);await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Configurar Informe'}).click();dialog=page.getByRole('dialog',{name:'Configurar plantilla Informe'});const t2Order=await order(dialog.getByTestId('template-section-list'));expect(t2Order).toContain('background');expect(t2Order).not.toContain('justification');await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});await dialog.getByRole('button',{name:'Restaurar predeterminado',exact:true}).click();expect(await order(dialog.getByTestId('template-section-list'))).toEqual(initial);await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();expect(await order(page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'}).getByTestId('template-section-list'))).toEqual(initial);
});
