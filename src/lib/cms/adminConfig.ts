import type { PageSection } from '@/lib/cms/types';

export const PAGE_LABELS: Record<string, string> = {
  home: 'Ana Sayfa',
  about: 'Hakkında',
  research: 'Araştırma & Yayınlar',
  programs: 'Programlar',
  lab: 'FELT Lab',
  events: 'Etkinlikler',
  community: 'Topluluk',
  blog: 'Blog',
  contact: 'İletişim',
  footer: 'Alt Bilgi',
};

/** Display order for the Sayfaları Düzenle page selector. */
export const PAGE_ORDER: string[] = [
  'home',
  'about',
  'research',
  'programs',
  'lab',
  'events',
  'community',
  'blog',
  'contact',
  'footer',
];

/** Stable admin panel labels — never derived from public-facing section.title */
export const SECTION_ADMIN_LABELS: Record<string, string> = {
  hero: 'Sayfa Üst Alanı',
  manifesto: 'Manifesto Bölümü',
  hubs: 'Ekosistem Ana Bölümü',
  ecosystem: 'Ekosistem Alanları',
  highlights: 'Öne Çıkanlar',
  'blog-preview': 'Blog Önizleme Alanı',
  newsletter: 'Blog Bülten Alanı',
  'network-cta': 'Topluluk Çağrısı',
  'article-tabs': 'Yayın Kategorileri',
  'ui-labels': 'Arayüz Metinleri',
  'program-tabs': 'Program Kategorileri',
  cta: 'Çağrı Alanı',
  intro: 'Giriş Metni',
  'lab-sections': 'Laboratuvar Bölümleri',
  'event-tabs': 'Etkinlik Kategorileri',
  highlight: 'Aktif Etkinlikler Başlığı',
  'contributor-types': 'Katılım Alanları',
  'research-circles': 'Araştırma Çevreleri',
  'blog-tabs': 'Blog Kategorileri',
  'contact-info': 'İletişim Bilgileri',
  'contact-form': 'İletişim Formu',
  'contact-sidebar-newsletter': 'Yan Panel — Bülten',
  'contact-sidebar-social': 'Yan Panel — Sosyal Medya',
  brand: 'Marka Metni',
  copyright: 'Telif Metni',
};

/** Sections not shown in Sayfaları Düzenle (fixed in code only). */
export const HIDDEN_ADMIN_SECTION_KEYS = new Set(['ui-labels', 'network-intro', 'intro']);

export type SectionEditorVariant =
  | 'page-hero'
  | 'home-hero'
  | 'content-only'
  | 'program-categories'
  | 'lab-cards'
  | 'cta'
  | 'cards'
  | 'card-items'
  | 'text-with-items'
  | 'contact-items'
  | 'footer-brand'
  | 'hubs-ecosystem'
  | 'ecosystem-items'
  | 'display-labels'
  | 'section-heading'
  | 'section-title-only'
  | 'text-block'
  | 'default';

function formatSectionKey(key: string): string {
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Stable label for admin cards — independent of public section.title */
export function getAdminSectionLabel(section: PageSection): string {
  return SECTION_ADMIN_LABELS[section.section_key] || formatSectionKey(section.section_key);
}

/** @deprecated Use getAdminSectionLabel */
export function getSectionDisplayName(section: PageSection): string {
  return getAdminSectionLabel(section);
}

export function getSectionEditorVariant(section: PageSection): SectionEditorVariant {
  const { section_key: key, section_type: type, page_key: page } = section;

  if (key === 'hero' && page === 'home') return 'home-hero';
  if (key === 'hero') return 'page-hero';
  if (key === 'intro') return 'content-only';
  if (
    key === 'program-tabs' ||
    key === 'event-tabs' ||
    key === 'article-tabs' ||
    key === 'blog-tabs'
  ) {
    return 'display-labels';
  }
  if (key === 'highlight') return 'section-heading';
  if (
    key === 'contact-form' ||
    key === 'contact-sidebar-newsletter'
  ) {
    return 'section-heading';
  }
  if (key === 'contact-sidebar-social') return 'section-title-only';
  if (key === 'highlights') return 'cards';
  if (key === 'lab-sections') return 'lab-cards';
  if (key === 'hubs' && page === 'home') return 'hubs-ecosystem';
  if (key === 'ecosystem' && page === 'home') return 'ecosystem-items';
  if (type === 'cta' || key === 'cta' || key === 'network-cta') return 'cta';
  if (key === 'manifesto') return 'content-only';
  if (key === 'blog-preview') return 'text-block';
  if (type === 'cards' && key !== 'lab-sections') return 'cards';
  if (key === 'contact-info') return 'contact-items';
  if (type === 'text' && !section.items?.length) return 'text-block';
  if (page === 'footer') return key === 'brand' ? 'footer-brand' : 'default';
  if (type === 'text' && section.items?.length) return 'text-with-items';
  if (type === 'quote') return 'content-only';

  return 'default';
}

export function shouldShowSectionInAdmin(section: PageSection): boolean {
  return !HIDDEN_ADMIN_SECTION_KEYS.has(section.section_key);
}

export function shouldShowSortOrder(section: PageSection): boolean {
  return section.page_key !== 'contact';
}

const SECTION_ACTIVE_TOGGLE_HIDDEN_KEYS = new Set([
  'article-tabs',
  'blog-tabs',
  'event-tabs',
  'program-tabs',
]);

export function shouldShowActiveToggle(section: PageSection): boolean {
  if (SECTION_ACTIVE_TOGGLE_HIDDEN_KEYS.has(section.section_key)) return false;
  if (section.section_key === 'hero' && section.page_key === 'home') return false;
  return true;
}
