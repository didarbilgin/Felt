import { test, expect } from './fixtures';
import { attachPageHealth } from './helpers';

test.describe('Admin login', () => {
  test('login form renders and email has no placeholder hint', async ({ page }) => {
    const health = attachPageHealth(page);
    await page.goto('/admin/login');

    await expect(page.getByRole('heading', { name: /FELT Admin/i })).toBeVisible();
    const email = page.getByLabel('E-posta');
    const password = page.getByLabel('Şifre');

    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(email).toHaveAttribute('type', 'email');

    const placeholder = await email.getAttribute('placeholder');
    expect(placeholder === null || placeholder === '').toBeTruthy();

    await email.fill('test@example.com');
    await password.fill('invalid-password');
    await expect(page.getByRole('button', { name: /Giriş Yap/i })).toBeEnabled();
    health.assertClean();
  });

  test('invalid credentials keep user on login page', async ({ page }) => {
    const health = attachPageHealth(page);
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid credentials' }),
      });
    });

    await page.goto('/admin/login');
    await page.getByLabel('E-posta').fill('test@example.com');
    await page.getByLabel('Şifre').fill('wrong-password');
    await page.getByRole('button', { name: /Giriş Yap/i }).click();

    await expect(page).toHaveURL(/\/admin\/login/);
    health.assertClean();
  });

  test('empty submit keeps user on login page', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /Giriş Yap/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
