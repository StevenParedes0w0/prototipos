import {test,expect,type Locator,type Page} from '@playwright/test';
import {reset,session,names,documents,createPlan,completeMatrix,openDocuments} from './helpers';
const order=async(list:Locator)=>list.locator(':scope > [data-section-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-section-id')!));
const content=(ids:string[])=>ids.filter(id=>id!=='header'&&id!=='footer');

async function openTemplate(page:Page,name:'Plan de Trabajo'|'Informe'){
  await page.getByRole('button',{name:`Configurar ${name}`}).click();
  return page.getByRole('dialog',{name:`Configurar plantilla ${name}`});
}

test('T1 reordena todas las secciones, confirma, renderiza y preserva documentos previos',async({page})=>{
  await reset(page);await session(page,names.laura);await page.getByText('Plantillas Documentales',{exact:true}).click();
  let dialog=await openTemplate(page,'Plan de Trabajo');let list=dialog.getByTestId('template-section-list');const initial=await order(list);
  for(const id of ['general','objective','signatures','history'])await expect(dialog.getByTestId(`template-section-${id}`)).toHaveAttribute('draggable','true');
  await dialog.getByTestId('template-section-objective').dragTo(dialog.getByTestId('template-section-general'));
  await dialog.getByTestId('template-section-signatures').dragTo(dialog.getByTestId('template-section-justification'));
  await dialog.getByTestId('template-section-history').dragTo(dialog.getByTestId('template-section-matrix'));
  const changed=await order(list);expect(changed).not.toEqual(initial);
  await dialog.getByRole('button',{name:'Guardar configuración',exact:true}).click();
  const confirm=page.getByRole('dialog',{name:'Confirmar cambio de estructura'});await expect(confirm).toBeVisible();await confirm.getByRole('button',{name:'Guardar nueva estructura'}).click();await expect(dialog.getByRole('status')).toContainText('guardada');
  await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();

  await session(page,names.andrea);await openDocuments(page);const ids=(await documents(page)).map(item=>item.id);await createPlan(page);await completeMatrix(page);
  const created=(await documents(page)).find(item=>!ids.includes(item.id)&&item.documentType==='PLAN_TRABAJO')!;
  expect(created.currentArtifact.templateConfiguration?.sectionOrder).toEqual(changed);
  const renderedOrder=created.currentArtifact.pages!.filter(item=>item.type!=='index').flatMap(item=>item.contentSections || []).filter((id,index,array)=>array.indexOf(id)===index);
  expect(renderedOrder).toEqual(content(changed));
  const indexPage=created.currentArtifact.pages!.findIndex(item=>item.type==='index')+1;await page.getByTitle(`Ir a página ${indexPage}`,{exact:true}).click();
  const indexIds=await page.getByTestId('dynamic-document-index').locator('[data-index-section]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-index-section')));
  expect(indexIds).toEqual(content(changed));
  const originalSnapshot=structuredClone(created.currentArtifact.templateConfiguration);

  await session(page,names.laura);await page.getByText('Plantillas Documentales',{exact:true}).click();dialog=await openTemplate(page,'Plan de Trabajo');list=dialog.getByTestId('template-section-list');
  await dialog.getByTestId('template-section-matrix').dragTo(dialog.getByTestId('template-section-objective'));await dialog.getByRole('button',{name:'Guardar configuración',exact:true}).click();await page.getByRole('dialog',{name:'Confirmar cambio de estructura'}).getByRole('button',{name:'Guardar nueva estructura'}).click();
  expect((await documents(page)).find(item=>item.id===created.id)!.currentArtifact.templateConfiguration).toEqual(originalSnapshot);
  await dialog.getByRole('button',{name:'Restaurar predeterminado',exact:true}).click();const restore=page.getByRole('dialog',{name:'Confirmar restauración de estructura'});await expect(restore).toBeVisible();await restore.getByRole('button',{name:'Restaurar predeterminado'}).click();expect(await order(list)).toEqual(initial);
  await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();dialog=await openTemplate(page,'Plan de Trabajo');expect(await order(dialog.getByTestId('template-section-list'))).toEqual(initial);
});

test('T2 conserva configuración independiente y el preview respeta el orden',async({page})=>{
  await reset(page);await session(page,names.laura);await page.getByText('Plantillas Documentales',{exact:true}).click();
  const dialog=await openTemplate(page,'Informe');const list=dialog.getByTestId('template-section-list');const initial=await order(list);
  await dialog.getByTestId('template-section-signatures').dragTo(dialog.getByTestId('template-section-background'));
  await dialog.getByTestId('template-section-general').dragTo(dialog.getByTestId('template-section-development'));
  const changed=await order(list);expect(changed).not.toEqual(initial);
  await dialog.getByRole('button',{name:'Guardar configuración',exact:true}).click();await page.getByRole('dialog',{name:'Confirmar cambio de estructura'}).getByRole('button',{name:'Guardar nueva estructura'}).click();await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
  await session(page,names.andrea);await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
  const next=page.getByRole('button',{name:'Siguiente →',exact:true});for(let i=0;i<6;i++)await next.click();
  const sheet=page.getByTestId('document-page');const count=Number(await sheet.getAttribute('data-page-count'));let found:string[]=[];
  for(let n=1;n<=count;n++){await page.getByTitle(`Ir a página ${n}`,{exact:true}).click();if(await page.getByTestId('dynamic-document-index').count()){found=await page.getByTestId('dynamic-document-index').locator('[data-index-section]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-index-section')!));break;}}
  expect(found).toEqual(content(changed));
});
