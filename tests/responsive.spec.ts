import { test, expect } from './fixtures';
import {
  PUBLIC_ROUTES,
  assertLoadingResolved,
  assertMainHasVisibleHeading,
  gotoPublic,
} from './helpers';

const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 390, height: 844 },
} as const;

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`Responsive – ${name}`, () => {
    test.use({ viewport });

    test('header and main are visible on home', async ({ page }) => {
      await gotoPublic(page, '/');
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    });

    if (name === 'mobile') {
      test('mobile menu control is available', async ({ page }) => {
        await gotoPublic(page, '/');
        await expect(page.getByRole('button', { name: 'Menüyü aç' })).toBeVisible();
      });
    } else {
      test('desktop nav links are visible without opening menu', async ({ page }) => {
        await gotoPublic(page, '/');
        await expect(
          page.locator('header nav').first().getByRole('link', { name: 'Blog' })
        ).toBeVisible();
      });
    }

    for (const path of PUBLIC_ROUTES.slice(0, 4)) {
      test(`core route ${path} loads`, async ({ page }) => {
        await gotoPublic(page, path);
        await assertMainHasVisibleHeading(page);
        await assertLoadingResolved(page);
      });
    }
  });
}
