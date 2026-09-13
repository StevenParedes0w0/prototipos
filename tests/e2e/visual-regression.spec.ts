import {test,expect} from '@playwright/test';
import {reset,createPlan,completeMatrix} from './helpers';

test('T1 mantiene portada, matriz y página de firmas',async({page})=>{
 await reset(page);await createPlan(page);await completeMatrix(page);
 const documentPage=page.getByTestId('document-page');
 await expect(documentPage).toHaveScreenshot('t1-portada.png');
 await page.getByRole('button',{name:'3',exact:true}).click();
 await expect(documentPage).toHaveScreenshot('t1-matriz.png');
 const count=Number(await documentPage.getAttribute('data-page-count'));
 await page.getByRole('button',{name:String(count),exact:true}).click();
 await expect(documentPage).toHaveScreenshot('t1-firmas-historial.png');
});
