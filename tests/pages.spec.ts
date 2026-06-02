import { test, expect } from './fixtures';
import {
  PUBLIC_ROUTES,
  assertLoadingResolved,
  assertMainHasVisibleHeading,
  gotoPublic,
} from './helpers';

test.describe('Public pages', () => {
  for (const path of PUBLIC_ROUTES) {
    test(`loads ${path}`, async ({ page }) => {
      await gotoPublic(page, path);
      await assertMainHasVisibleHeading(page);
      await assertLoadingResolved(page);
    });
  }

  test('home exposes primary navigation landmark', async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('link', { name: 'FELT' }).first()).toBeVisible();
    await expect(page.locator('header nav').first()).toBeVisible();
  });

  test('lab page renders content region', async ({ page }) => {
    await gotoPublic(page, '/lab');
    await expect(page.locator('main')).toBeVisible();
    await assertLoadingResolved(page);
  });
});
