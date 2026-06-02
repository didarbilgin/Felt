import { expect, type Page } from '@playwright/test';

/** Keep in sync with src/lib/socialLinks.ts */
export const EXPECTED_CONTACT_EMAIL = 'drhumeyrakalafat@gmail.com';
export const EXPECTED_SOCIAL = {
  linkedIn: 'https://www.linkedin.com/in/hümeyra-kalafat-a070833a1',
  instagram: 'https://www.instagram.com/humeyra_kalafat',
  email: `mailto:${EXPECTED_CONTACT_EMAIL}`,
} as const;

export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/research',
  '/programs',
  '/lab',
  '/events',
  '/community',
  '/blog',
  '/contact',
] as const;

export const NAV_ROUTES = [
  { href: '/about', label: 'Hakkında' },
  { href: '/research', label: 'Araştırma & Yayınlar' },
  { href: '/programs', label: 'Programlar' },
  { href: '/lab', label: 'FELT Lab' },
  { href: '/events', label: 'Etkinlikler' },
  { href: '/community', label: 'Topluluk' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'İletişim' },
] as const;

export const LIST_PAGES = [
  { path: '/blog', tablist: true },
  { path: '/programs', tablist: true },
  { path: '/events', tablist: true },
  { path: '/research', tablist: true },
] as const;

const IGNORED_CONSOLE_PATTERNS = [
  /404 Error: User attempted to access non-existent route/i,
  /vite/i,
  /hmr/i,
  /DevTools/i,
  /favicon/i,
];

const IGNORED_API_STATUSES = new Set([401]);

export type PageHealth = {
  assertClean: () => void;
};

function shouldIgnoreConsole(text: string): boolean {
  if (/Failed to load resource:.*\b401\b/.test(text)) return true;
  return IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

export async function assertListEmptyOrError(page: Page): Promise<void> {
  const main = page.locator('main');
  await expect(main).toContainText(/bulunamadı|yüklenemedi|İçerik yüklenemedi/i);
}

function isApiRequest(url: string): boolean {
  return url.includes('/api/') || url.includes(':8000/api/');
}

export function attachPageHealth(page: Page): PageHealth {
  const consoleErrors: string[] = [];
  const apiFailures: { url: string; status: number }[] = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (shouldIgnoreConsole(text)) return;
    consoleErrors.push(text);
  });

  page.on('response', (response) => {
    const url = response.url();
    if (!isApiRequest(url)) return;

    const status = response.status();
    if (IGNORED_API_STATUSES.has(status)) return;
    if (status === 403 || status === 404 || status === 500) {
      apiFailures.push({ url, status });
    }
  });

  return {
    assertClean() {
      expect(
        apiFailures,
        `Unexpected API responses:\n${apiFailures.map((f) => `${f.status} ${f.url}`).join('\n')}`
      ).toEqual([]);
      expect(
        consoleErrors,
        `Console errors:\n${consoleErrors.join('\n')}`
      ).toEqual([]);
    },
  };
}

export async function gotoPublic(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('main')).toBeAttached();
}

export async function assertMainHasVisibleHeading(page: Page): Promise<void> {
  await expect(page.locator('main').getByRole('heading').first()).toBeVisible();
}

export async function assertLoadingResolved(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {
    // API may be unavailable in some environments; still check stuck loading text.
  });
  await page.waitForTimeout(3_000);
  await expect(page.getByText('Yükleniyor...', { exact: true })).toHaveCount(0);
}

export async function assertListPageSettled(page: Page, path: string): Promise<void> {
  await gotoPublic(page, path);
  await assertLoadingResolved(page);

  const main = page.locator('main');
  const settled =
    (await main.locator('.text-destructive').count()) > 0 ||
    (await main.getByText(/bulunamadı/i).count()) > 0 ||
    (await main.locator('[class*="card"]').count()) > 0 ||
    (await main.locator('a[href*="/blog/"]').count()) > 0 ||
    (await main.locator('a[href*="/research/"]').count()) > 0;

  expect(settled).toBeTruthy();
}

export function blogNewsletterSection(page: Page) {
  return page.locator('section').filter({
    has: page.locator('input[type="email"]'),
  });
}

export async function mockBlogPageWithoutNewsletter(page: Page): Promise<void> {
  await page.route('**/api/pages/blog', async (route) => {
    const response = await route.fetch();
    if (!response.ok()) {
      await route.continue();
      return;
    }
    const body = await response.json();
    const sections = Array.isArray(body.sections)
      ? body.sections.filter(
          (section: { section_key?: string; is_active?: boolean }) =>
            section.section_key !== 'newsletter' && section.is_active !== false
        )
      : body.sections;

    await route.fulfill({
      status: response.status(),
      contentType: 'application/json',
      body: JSON.stringify({ ...body, sections }),
    });
  });
}

export async function assertSocialLinksOnPage(page: Page): Promise<void> {
  const linkedIn = page.getByRole('link', { name: 'LinkedIn' });
  const instagram = page.getByRole('link', { name: 'Instagram' });
  const email = page.getByRole('link', { name: 'E-posta' });

  await expect(linkedIn.first()).toBeVisible();
  await expect(instagram.first()).toBeVisible();
  await expect(email.first()).toBeVisible();

  await expect(linkedIn.first()).toHaveAttribute('href', EXPECTED_SOCIAL.linkedIn);
  await expect(instagram.first()).toHaveAttribute('href', EXPECTED_SOCIAL.instagram);
  await expect(email.first()).toHaveAttribute('href', EXPECTED_SOCIAL.email);
  await expect(linkedIn.first()).toHaveAttribute('target', '_blank');
  await expect(instagram.first()).toHaveAttribute('target', '_blank');
}

export async function assertNoTwitterLinks(page: Page): Promise<void> {
  const twitterLinks = page.locator(
    'a[href*="twitter.com"], a[href*="x.com"], a[href*="youtube.com"]'
  );
  await expect(twitterLinks).toHaveCount(0);
}

export async function assertMailtoContact(page: Page): Promise<void> {
  const mailLink = page.locator(`a[href="mailto:${EXPECTED_CONTACT_EMAIL}"]`);
  await expect(mailLink.first()).toBeVisible();
}
