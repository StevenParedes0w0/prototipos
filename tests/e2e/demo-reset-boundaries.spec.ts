import {test,expect,type Locator,type Page} from '@playwright/test';
import {reset,login,session,names,documents,openDocuments} from './helpers';

const sectionOrder=(list:Locator)=>list.locator(':scope > [data-section-id]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-section-id')!));

async function createAdministrativeUnit(page:Page,name:string){
  await page.getByText('Unidades Institucionales',{exact:true}).click();
  await page.getByRole('button',{name:'NUEVA UNIDAD',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Unidad institucional'});
  await dialog.getByTestId('institutional-unit-type').selectOption('ADMINISTRATIVE');
  await dialog.getByLabel('Nombre de la unidad').fill(name);
  await dialog.getByRole('button',{name:'Guardar unidad',exact:true}).click();
}

test('reset documental restaura documentos sin borrar plantillas ni catálogos administrativos',async({page})=>{
  await reset(page);const baseDocuments=await documents(page);await session(page,names.laura);
  const unitName='Dirección DEMO persistente';await createAdministrativeUnit(page,unitName);
  await page.getByText('Plantillas Documentales',{exact:true}).click();
  let dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});
  await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();
  const list=dialog.getByTestId('template-section-list');
  await dialog.getByTestId('template-section-objective').dragTo(dialog.getByTestId('template-section-general'));
  const changedOrder=await sectionOrder(list);
  await dialog.getByRole('button',{name:'Guardar configuración',exact:true}).click();
  await page.getByRole('dialog',{name:'Confirmar cambio de estructura'}).getByRole('button',{name:'Guardar nueva estructura'}).click();
  await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
  const adminBefore=await page.evaluate(()=>localStorage.getItem('fisei_admin_configuration_v2'));

  await session(page,names.andrea);await openDocuments(page);
  await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();
  const create=page.getByRole('dialog',{name:'Seleccionar grupo y período'});await create.getByLabel('Grupo institucional').selectOption('grp-1');await create.getByLabel('Período').selectOption('per-1');await create.getByRole('button',{name:'Crear borrador'}).click();
  expect(await documents(page)).toHaveLength(baseDocuments.length+1);
  await page.getByRole('button',{name:'Restablecer documentos DEMO',exact:true}).click();
  expect((await documents(page)).map(item=>item.id)).toEqual(baseDocuments.map(item=>item.id));
  expect(await page.evaluate(()=>localStorage.getItem('fisei_admin_configuration_v2'))).toBe(adminBefore);

  await session(page,names.laura);await page.getByText('Unidades Institucionales',{exact:true}).click();await expect(page.getByRole('row').filter({hasText:unitName})).toBeVisible();
  await page.getByText('Plantillas Documentales',{exact:true}).click();await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});expect(await sectionOrder(dialog.getByTestId('template-section-list'))).toEqual(changedOrder);await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();

  await page.reload();await login(page);await session(page,names.laura);await page.getByText('Unidades Institucionales',{exact:true}).click();await expect(page.getByRole('row').filter({hasText:unitName})).toBeVisible();
  await page.getByText('Plantillas Documentales',{exact:true}).click();await page.getByRole('button',{name:'Configurar Plan de Trabajo'}).click();dialog=page.getByRole('dialog',{name:'Configurar plantilla Plan de Trabajo'});expect(await sectionOrder(dialog.getByTestId('template-section-list'))).toEqual(changedOrder);
});
