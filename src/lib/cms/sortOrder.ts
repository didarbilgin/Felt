/** Coerce CMS/API sort_order values to a finite number. */
export function toSortOrder(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function compareSortOrder(
  a: { sort_order?: unknown },
  b: { sort_order?: unknown }
): number {
  return toSortOrder(a.sort_order) - toSortOrder(b.sort_order);
}
