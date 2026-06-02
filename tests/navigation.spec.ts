import { test, expect } from './fixtures';
import { NAV_ROUTES, gotoPublic } from './helpers';

test.describe('Desktop navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await gotoPublic(page, '/');
  });

  for (const item of NAV_ROUTES) {
    test(`nav link navigates to ${item.href}`, async ({ page }) => {
      await page.locator('header nav').getByRole('link', { name: item.label }).click();
      await expect(page).toHaveURL(new RegExp(`${item.href.replace('/', '\\/')}$`));
      await expect(page.locator('main').getByRole('heading').first()).toBeVisible();
    });
  }

  test('logo returns to home', async ({ page }) => {
    await page.locator('header nav').getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await page.getByRole('link', { name: 'FELT' }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile menu opens and closes', async ({ page }) => {
    await gotoPublic(page, '/');

    const menuButton = page.getByRole('button', { name: 'Menüyü aç' });
    await expect(menuButton).toBeVisible();

    await menuButton.click();
    await expect(page.getByRole('button', { name: 'Menüyü kapat' })).toBeVisible();
    const mobileNav = page.locator('header nav.lg\\:hidden');
    await expect(mobileNav.getByRole('link', { name: 'İletişim' })).toBeVisible();

    await mobileNav.getByRole('link', { name: 'İletişim' }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole('button', { name: 'Menüyü aç' })).toBeVisible();
  });

  test('mobile nav reaches programs', async ({ page }) => {
    await gotoPublic(page, '/');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await page
      .locator('header nav.lg\\:hidden')
      .getByRole('link', { name: 'Programlar' })
      .click();
    await expect(page).toHaveURL(/\/programs$/);
    await expect(page.locator('main h1').first()).toBeVisible();
  });
});
