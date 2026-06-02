import type { PageSection, PageSectionItem } from '@/lib/cms/types';
import { getSection } from '@/lib/cms/pages';
import {
  getEditableLabelState,
  syncEditableLabelItems,
} from '@/lib/cms/displayLabels';

export type ProgramCategoryOption = {
  value: string;
  label: string;
};

const PINNED = ['all'];

export function buildProgramCategoryOptions(
  sections: PageSection[] | undefined
): ProgramCategoryOption[] {
  const tabSection = getSection(sections, 'program-tabs');
  const items = tabSection?.items;
  if (!items?.length) return [];

  return items
    .filter((item) => item.title)
    .map((item) => ({
      value: item.title as string,
      label: (item.content || item.title) as string,
    }));
}

export function syncProgramTabItems(
  items: PageSectionItem[],
  displayLabels: string[]
): PageSectionItem[] {
  const { keys } = getEditableLabelState(items, PINNED);
  return syncEditableLabelItems(items, keys, displayLabels, PINNED);
}

export function getProgramCategoryLabelsFromItems(
  items: PageSectionItem[] | undefined
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of items || []) {
    if (item.title) map[item.title] = item.content || item.title;
  }
  return map;
}
