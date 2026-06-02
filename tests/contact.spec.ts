import { test, expect } from './fixtures';
import {
  assertMailtoContact,
  assertNoTwitterLinks,
  assertSocialLinksOnPage,
  gotoPublic,
} from './helpers';

test.describe('Contact & social links', () => {
  test('contact page social links use expected hrefs', async ({ page }) => {
    await gotoPublic(page, '/contact');
    await assertSocialLinksOnPage(page);
    await assertMailtoContact(page);
    await assertNoTwitterLinks(page);
  });

  test('footer social links on home', async ({ page }) => {
    await gotoPublic(page, '/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Instagram' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'E-posta' })).toBeVisible();
    await assertNoTwitterLinks(page);
  });

  test('contact form fields are interactive', async ({ page }) => {
    await gotoPublic(page, '/contact');
    const form = page.locator('main form').first();
    await expect(form).toBeVisible();
    await expect(form.getByLabel('Ad Soyad')).toBeVisible();
    await expect(form.locator('#email')).toBeVisible();
  });
});
