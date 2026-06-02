import type { PageSection } from '@/lib/cms/types';
import { getSection } from '@/lib/cms/pages';

export type CategoryTabOption = {
  value: string;
  label: string;
};

/** Build filter tabs from a CMS section (e.g. article-tabs, blog-tabs, event-tabs). */
export function buildCategoryTabOptions(
  sections: PageSection[] | undefined,
  sectionKey: string
): CategoryTabOption[] {
  const tabSection = getSection(sections, sectionKey);
  const items = tabSection?.items;
  if (!items?.length) return [];

  return items
    .filter((item) => item.title)
    .map((item) => ({
      value: item.title as string,
      label: (item.content || item.title) as string,
    }));
}

/** CMS categories for admin create/edit forms (filters non-assignable tab keys). */
export function buildFormCategoryOptions(
  sections: PageSection[] | undefined,
  sectionKey: string,
  excludeValues: string[] = ['all']
): CategoryTabOption[] {
  const skip = new Set(excludeValues);
  return buildCategoryTabOptions(sections, sectionKey).filter((opt) => !skip.has(opt.value));
}
