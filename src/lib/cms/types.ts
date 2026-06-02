export type PageSectionItem = {
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[] | PageSectionItem[];
  meta?: Record<string, string>;
};

export type PageSection = {
  id: string;
  page_key: string;
  section_key: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  items: PageSectionItem[] | null;
  sort_order: number;
  is_active: boolean;
};

export type PageContent = {
  id: string;
  page_key: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  is_active: boolean;
  sort_order: number;
  sections: PageSection[];
};

export type PageHeroFallback = {
  title: string;
  subtitle?: string;
};
