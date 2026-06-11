import { compareSortOrder } from '@/lib/cms/sortOrder';

/** Move one managed section to a 1-based position; renumber managed 1..n, preserve unmanaged. */
export function reorderPageSections<T extends { id: string | number; sort_order: number }>(
  allSections: T[],
  sectionId: string | number,
  targetPosition: number,
  isManaged: (section: T) => boolean = () => true
): T[] {
  const managed = allSections.filter(isManaged).sort(compareSortOrder);
  const fromIdx = managed.findIndex((s) => s.id === sectionId);
  if (fromIdx < 0) return allSections;

  const toIdx = Math.max(0, Math.min(targetPosition - 1, managed.length - 1));
  const [removed] = managed.splice(fromIdx, 1);
  managed.splice(toIdx, 0, removed);

  const renumbered = managed.map((section, index) => ({
    ...section,
    sort_order: index + 1,
  }));

  const byId = new Map(allSections.map((s) => [s.id, s]));
  for (const section of renumbered) {
    byId.set(section.id, section);
  }

  return allSections.map((section) => byId.get(section.id)!);
}

/** Resolve 1-based display numbers from current sort_order (after sorting). */
export function buildDisplayOrderMap<T extends { section_key?: string; sort_order: number }>(
  sections: T[],
  keyFn: (section: T) => string = (s) => (s as { section_key: string }).section_key
): Map<string, number> {
  const sorted = [...sections].sort(compareSortOrder);
  const map = new Map<string, number>();
  sorted.forEach((section, index) => {
    map.set(keyFn(section), index + 1);
  });
  return map;
}

export function formatSubsectionNumber(parentOrder: number, itemIndex: number): string {
  return `${parentOrder}.${itemIndex + 1}`;
}
