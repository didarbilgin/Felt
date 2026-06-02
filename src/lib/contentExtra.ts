/** True when admin provided extra detail text for a detail modal. */
export function hasExtraDetail(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

export function normalizeExternalLink(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
