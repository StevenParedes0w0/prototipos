import {test,expect} from '@playwright/test';
import {reset,createPlan,completeMatrix} from './helpers';

test('T1 mantiene portada, matriz y página de firmas',async({page})=>{
 await reset(page);await createPlan(page);await completeMatrix(page);
 const documentPage=page.getByTestId('document-page');
 const header=documentPage.getByTestId('document-institutional-header');await expect(header.locator('tr')).toHaveCount(4);await expect(header).not.toContainText('Carrera:');await expect(header).toContainText('Carrera de Ingeniería de Software');
 await expect(documentPage).toHaveScreenshot('t1-portada.png');
 const count=Number(await documentPage.getAttribute('data-page-count'));
 for(let n=1;n<=count;n++){await page.getByTitle(`Ir a página ${n}`,{exact:true}).click();if(await documentPage.locator('[data-rendered-section="matrix"]').count())break;}
 await expect(documentPage).toHaveScreenshot('t1-matriz.png');
 for(let n=1;n<=count;n++){await page.getByTitle(`Ir a página ${n}`,{exact:true}).click();if(await documentPage.locator('[data-rendered-section="signatures"]').count())break;}
 await expect(documentPage).toHaveScreenshot('t1-firmas-historial.png');
});
