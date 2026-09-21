import { expect, test, type Locator } from '@playwright/test';

async function captchaAnswer(question: Locator) {
  return (await question.textContent())!.trim();
}

async function fillCredentials(page: import('@playwright/test').Page) {
  await page.getByPlaceholder('usuario@uta.edu.ec').fill('andrea.perez@uta.edu.ec');
  await page.getByPlaceholder('••••••••••', { exact: true }).fill('Mi$Clave2026');
}

test.describe('CAPTCHA de inicio de sesión', () => {
  test('bloquea el acceso hasta resolver correctamente la operación', async ({ page }) => {
    await page.goto('/');
    await fillCredentials(page);
    const submit = page.getByRole('button', { name: 'INICIAR SESIÓN', exact: true });
    const answer = page.getByRole('textbox', { name: 'Código de verificación' });

    await expect(submit).toBeDisabled();
    await answer.fill('0');
    await answer.blur();
    await submit.click();
    await expect(page.getByRole('alert')).toHaveText('El código de verificación no coincide.');

    await answer.fill(await captchaAnswer(page.getByTestId('login-captcha-question')));
    await expect(page.getByRole('alert')).toBeHidden();
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByLabel('Cambiar persona de la sesión DEMO')).toBeVisible();
  });

  test('renueva el desafío y descarta la respuesta anterior', async ({ page }) => {
    await page.goto('/');
    await fillCredentials(page);
    const question = page.getByTestId('login-captcha-question');
    const initialQuestion = await question.textContent();
    const initialAnswer = await captchaAnswer(question);
    const answer = page.getByRole('textbox', { name: 'Código de verificación' });

    await answer.fill(initialAnswer);
    await expect(page.getByRole('button', { name: 'INICIAR SESIÓN', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Generar nuevo código de verificación', exact: true }).click();
    await expect(question).not.toHaveText(initialQuestion || '');
    await expect(answer).toHaveValue('');
    await expect(page.getByRole('button', { name: 'INICIAR SESIÓN', exact: true })).toBeDisabled();
  });
});
