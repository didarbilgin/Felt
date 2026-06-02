import { test, expect } from './fixtures';
import {
  assertListEmptyOrError,
  assertListPageSettled,
  assertLoadingResolved,
  blogNewsletterSection,
  gotoPublic,
  mockBlogPageWithoutNewsletter,
} from './helpers';

test.describe('List & card content', () => {
  test('blog list settles without stuck loading', async ({ page }) => {
    await assertListPageSettled(page, '/blog');
  });

  test('programs list settles without stuck loading', async ({ page }) => {
    await assertListPageSettled(page, '/programs');
  });

  test('events list settles without stuck loading', async ({ page }) => {
    await assertListPageSettled(page, '/events');
  });

  test('research list settles without stuck loading', async ({ page }) => {
    await assertListPageSettled(page, '/research');
  });

  test('blog card detail link navigates when posts exist', async ({ page }) => {
    await gotoPublic(page, '/blog');
    await assertLoadingResolved(page);

    const readMore = page.locator('main a[href^="/blog/"]').first();
    const count = await readMore.count();
    if (count === 0) {
      await assertListEmptyOrError(page);
      return;
    }

    const href = await readMore.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);
    await readMore.click();
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/\//g, '\\/')}$`));
    await expect(page.locator('main h1').first()).toBeVisible();
    await assertLoadingResolved(page);
  });

  test('research card detail link navigates when articles exist', async ({ page }) => {
    await gotoPublic(page, '/research');
    await assertLoadingResolved(page);

    const detail = page.locator('main a[href^="/research/"]').first();
    const count = await detail.count();
    if (count === 0) {
      await assertListPageSettled(page, '/research');
      return;
    }

    const href = await detail.getAttribute('href');
    expect(href).toMatch(/^\/research\/.+/);
    await detail.click();
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/\//g, '\\/')}$`));
    await expect(page.locator('main h1').first()).toBeVisible();
    await assertLoadingResolved(page);
  });

  test('programs page shows grid, empty, or error state', async ({ page }) => {
    await gotoPublic(page, '/programs');
    await assertLoadingResolved(page);

    const main = page.locator('main');
    const states =
      (await main.locator('[class*="card"]').count()) +
      (await main.getByText(/bulunamadı/i).count()) +
      (await main.locator('.text-destructive').count());

    expect(states).toBeGreaterThan(0);
    await expect(main.getByRole('tablist')).toBeVisible();
  });

  test('home renders primary content blocks', async ({ page }) => {
    await gotoPublic(page, '/');
    await assertLoadingResolved(page);
    await expect(page.locator('main').getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page.locator('main a[href]').first()).toBeVisible();
  });
});

test.describe('CMS section visibility (public)', () => {
  test('inactive newsletter section is hidden on blog', async ({ page }) => {
    await mockBlogPageWithoutNewsletter(page);
    await gotoPublic(page, '/blog');
    await assertLoadingResolved(page);

    const newsletterBlocks = blogNewsletterSection(page);
    await expect(newsletterBlocks).toHaveCount(0);
  });
});
