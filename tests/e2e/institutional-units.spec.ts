import {test,expect} from '@playwright/test';
import {reset,session,names,documents,openDocuments} from './helpers';

async function createUnit(page:import('@playwright/test').Page,type:'ACADEMIC'|'ADMINISTRATIVE',name:string,career?:string){
 await page.getByText('Unidades Institucionales',{exact:true}).click();
 await page.getByRole('button',{name:'NUEVA UNIDAD',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Unidad institucional'});
 await dialog.getByTestId('institutional-unit-type').selectOption(type);
 await dialog.getByLabel('Nombre de la unidad').fill(name);
 if(career) await dialog.getByLabel('Carreras asociadas').fill(career);
 await dialog.getByRole('button',{name:'Guardar unidad',exact:true}).click();
 await expect(dialog).toBeHidden();
}

test('catálogo institucional compartido distingue unidades académicas y administrativas',async({page})=>{
 await reset(page); await session(page,names.laura);
 const academic='Facultad DEMO de Pruebas Institucionales'; const career='Carrera DEMO de Validación'; const administrative='Dirección Administrativa DEMO';
 await createUnit(page,'ACADEMIC',academic,career); await createUnit(page,'ADMINISTRATIVE',administrative);
 await session(page,names.andrea); await openDocuments(page);
 await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR PLAN DE TRABAJO',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Seleccionar grupo y período'});await dialog.getByLabel('Grupo institucional').selectOption('grp-1');await dialog.getByRole('button',{name:'Crear borrador'}).click();
 await expect(page.getByTestId('institutional-unit-select')).toBeDisabled();await expect(page.getByTestId('career-select')).toBeDisabled();
 const id=(await documents(page)).find(d=>d.teacherId==='usr-andrea-01'&&d.groupId==='grp-1')!.id;
 await page.getByRole('button',{name:'Continuar →',exact:true}).click();
 let persisted=(await documents(page)).find(d=>d.id===id)!;expect(persisted.currentArtifact).toMatchObject({unidadAcademica:'Facultad de Ingeniería en Sistemas, Electrónica e Industrial',institutionalUnitType:'ACADEMIC'});expect(persisted.currentArtifact.carrera).toBe('Ingeniería de Software');
 await session(page,names.laura);await page.getByText('Unidades Institucionales',{exact:true}).click();
 await page.getByRole('row').filter({hasText:academic}).getByRole('button',{name:`Desactivar ${academic}`}).click();
 persisted=(await documents(page)).find(d=>d.id===id)!;expect(persisted.currentArtifact.unidadAcademica).toBe('Facultad de Ingeniería en Sistemas, Electrónica e Industrial');
 await session(page,names.andrea);await openDocuments(page);await page.getByRole('button',{name:'NUEVO DOCUMENTO',exact:true}).click();await page.getByRole('button',{name:'CREAR INFORME',exact:true}).click();
 await page.getByRole('radio',{name:/Informe independiente/}).check();
 await expect(page.getByTestId('institutional-unit-select').locator('option',{hasText:academic})).toHaveCount(0);
 await page.getByTestId('institutional-unit-type').selectOption('ADMINISTRATIVE');await page.getByTestId('institutional-unit-select').selectOption({label:administrative});await expect(page.getByTestId('career-select')).toHaveCount(0);
 for(let i=0;i<6;i++)await page.getByRole('button',{name:'Siguiente →',exact:true}).click();
 await expect(page.getByTestId('document-page')).toContainText(administrative);
});
