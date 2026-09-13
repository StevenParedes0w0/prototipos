import {test,expect} from '@playwright/test';
import {reset,planToReview,session,names,row,openReview,document} from './helpers';

test('identidad y secuencia bloquean acciones de otros actores',async({page})=>{
 await reset(page);const id=await planToReview(page);
 let d=await document(page,id);expect(d.documentState).toBe('EN REVISIÓN');
 await session(page,names.andrea);await expect(row(page,id).getByRole('button',{name:/Aprobar|Revisar documento/})).toHaveCount(0);
 await session(page,names.carlos);await openReview(page,id);
 await expect(page.getByText('Revisión',{exact:true}).first()).toBeVisible();
 await expect(page.locator('main').getByText(names.patricia,{exact:true}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:/Validar y firmar/i})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Complete todos los aspectos a verificar.',exact:true})).toBeDisabled();
 await expect(page.getByRole('status')).toContainText('Complete todos los aspectos');
 d=await document(page,id);expect(d.flowStages.filter(s=>s.estado==='EN_CURSO').map(s=>s.actorName).sort()).toEqual([names.carlos,names.patricia].sort());
 await page.getByText('Contexto: Revisor',{exact:true}).click();
 await expect(page.getByLabel('Cambiar persona de la sesión DEMO').locator('option:checked')).toHaveText(names.carlos);
 await page.getByText('Perfil',{exact:true}).click();
 await expect(page.getByText(names.carlos,{exact:true}).first()).toBeVisible();await expect(page.getByText('carlos.lopez@uta.edu.ec',{exact:true}).first()).toBeVisible();
});

test('revisor no asignado no recibe documentos ni evidencias ajenas',async({page})=>{
 await reset(page);await session(page,names.laura);await page.getByText('Contexto: Administrador',{exact:true}).click();await page.getByText('Contexto: Docente',{exact:true}).click();
 await expect(page.locator('nav').getByText('Bandeja de revisión (Documentos)',{exact:true})).toBeVisible();
 await page.locator('nav').getByText('Bandeja de revisión (Documentos)',{exact:true}).click();
 await expect(page.getByRole('button',{name:'Revisar documento',exact:true})).toHaveCount(0);
 await page.locator('nav').getByText('Evidencias por validar',{exact:true}).click();
 await expect(page.getByRole('button',{name:'REVISAR',exact:true})).toHaveCount(0);
});
