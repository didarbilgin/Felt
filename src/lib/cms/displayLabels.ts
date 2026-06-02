import type { PageSectionItem } from '@/lib/cms/types';
import { slugifyKey } from '@/lib/cms/slug';

export type LabelEditorConfig = {
  title: string;
  description: string;
  addButtonLabel: string;
  /** Keys kept at the start and not shown in the editable list (e.g. "all"). */
  pinnedKeys: string[];
};

export const LABEL_EDITOR_CONFIG: Record<string, LabelEditorConfig> = {
  'program-tabs': {
    title: 'Program Kategorileri',
    description: 'Programlar sayfası ve program ekleme formundaki kategoriler.',
    addButtonLabel: 'Kategori Ekle',
    pinnedKeys: ['all'],
  },
  'event-tabs': {
    title: 'Etkinlik Kategorileri',
    description: 'Etkinlikler sayfası ve etkinlik ekleme formundaki kategoriler.',
    addButtonLabel: 'Kategori Ekle',
    pinnedKeys: [],
  },
  'article-tabs': {
    title: 'Yayın Kategorileri',
    description: 'Araştırma sayfası ve makale ekleme formundaki kategoriler.',
    addButtonLabel: 'Kategori Ekle',
    pinnedKeys: ['all'],
  },
  'blog-tabs': {
    title: 'Blog Kategorileri',
    description: 'Blog sayfası ve yazı ekleme formundaki kategoriler.',
    addButtonLabel: 'Kategori Ekle',
    pinnedKeys: ['all'],
  },
};

export function getEditableLabelState(
  items: PageSectionItem[] | null | undefined,
  pinnedKeys: string[]
): { keys: string[]; labels: string[] } {
  const editable = (items || []).filter(
    (item) => item.title && !pinnedKeys.includes(item.title)
  );
  return {
    keys: editable.map((item) => item.title as string),
    labels: editable.map((item) => item.content || ''),
  };
}

export function syncEditableLabelItems(
  items: PageSectionItem[] | null | undefined,
  keys: string[],
  labels: string[],
  pinnedKeys: string[]
): PageSectionItem[] {
  const source = items || [];
  const pinned = source.filter((item) => item.title && pinnedKeys.includes(item.title));
  const pinnedNormalized = pinnedKeys.map((key) => {
    const found = pinned.find((item) => item.title === key);
    if (found) return { ...found, content: found.content || (key === 'all' ? 'Tümü' : key) };
    if (key === 'all') return { title: 'all', content: 'Tümü' };
    return null;
  }).filter((item): item is PageSectionItem => item !== null);

  const next: PageSectionItem[] = [...pinnedNormalized];

  labels.forEach((label, index) => {
    const trimmed = label.trim();
    if (!trimmed) return;

    const existingKey = keys[index]?.trim();
    const key = existingKey || slugifyKey(trimmed) || `category-${index + 1}`;

    next.push({
      title: key,
      content: trimmed,
    });
  });

  return next;
}
