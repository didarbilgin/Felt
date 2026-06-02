import { test as base } from '@playwright/test';
import { attachPageHealth, type PageHealth } from './helpers';

type Fixtures = {
  health: PageHealth;
};

export const test = base.extend<Fixtures>({
  health: async ({ page }, use) => {
    const health = attachPageHealth(page);
    await use(health);
    health.assertClean();
  },
});

export { expect } from '@playwright/test';
