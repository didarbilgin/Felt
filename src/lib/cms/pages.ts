import { apiRequest } from '@/lib/api/client';
import type { PageContent, PageSection, PageSectionItem } from '@/lib/cms/types';

const PUBLIC_PAGES_PATH = '/api/pages';

const normalizeItems = (raw: unknown): PageSectionItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item) => item && typeof item === 'object') as PageSectionItem[];
};

export const pagesApi = {
  getPage: async (pageKey: string): Promise<PageContent | null> => {
    try {
      const data = await apiRequest<PageContent>(`${PUBLIC_PAGES_PATH}/${pageKey}`);
      return {
        ...data,
        sections: (data.sections || []).map((section) => ({
          ...section,
          items: normalizeItems(section.items),
        })),
      };
    } catch {
      return null;
    }
  },

  getAdminPage: async (pageKey: string): Promise<PageContent | null> => {
    try {
      const data = await apiRequest<PageContent>(`/api/admin/pages/${pageKey}`);
      return {
        ...data,
        sections: (data.sections || []).map((section) => ({
          ...section,
          items: normalizeItems(section.items),
        })),
      };
    } catch {
      return null;
    }
  },

  listAdminPages: async () => {
    return apiRequest<Pick<PageContent, 'id' | 'page_key' | 'title' | 'sort_order'>[]>(
      '/api/admin/pages'
    );
  },

  updatePage: async (
    pageId: string,
    payload: Partial<Pick<PageContent, 'title' | 'subtitle' | 'is_active' | 'sort_order'>>
  ) => {
    return apiRequest(`/api/admin/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  updateSection: async (
    sectionId: string,
    payload: Partial<
      Pick<PageSection, 'section_type' | 'title' | 'subtitle' | 'content' | 'items' | 'sort_order' | 'is_active'>
    >
  ) => {
    return apiRequest(`/api/admin/pages/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

export const getSection = (
  sections: PageSection[] | undefined,
  sectionKey: string
): PageSection | undefined => sections?.find((s) => s.section_key === sectionKey);

export const getLabelMap = (section?: PageSection): Record<string, string> => {
  if (!section?.items?.length) return {};
  return section.items.reduce<Record<string, string>>((acc, item) => {
    if (item.title) acc[item.title] = item.content || item.title;
    return acc;
  }, {});
};

export const splitLines = (value?: string | null): string[] => {
  if (!value) return [];
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
};

export const getItemBenefits = (item: PageSectionItem): string[] => {
  if (Array.isArray(item.items)) {
    return item.items.filter((b): b is string => typeof b === 'string');
  }
  if (item.subtitle && item.subtitle.includes('\n') && !item.content?.includes('\n')) {
    return splitLines(item.subtitle);
  }
  return splitLines(item.subtitle);
};

export const DEFAULT_LAB_PROJECT_TAGLINE = 'Prototip / araştırma projesi';

export type LabProject = { name: string; tagline: string };

const LAB_DRAFT_PREFIX = '__draft__';

function normalizeLabProjectName(title: string | undefined): string {
  const raw = (title || '').trim();
  if (raw.startsWith(LAB_DRAFT_PREFIX)) return '';
  return raw;
}

/** Lab project cards: structured item.items or legacy subtitle lines (optional `ad | alt yazı`). */
export function getLabProjects(
  item: PageSectionItem,
  defaultTagline: string = DEFAULT_LAB_PROJECT_TAGLINE,
  options?: { includeEmptyNames?: boolean }
): LabProject[] {
  const fallback = defaultTagline.trim() || DEFAULT_LAB_PROJECT_TAGLINE;
  const includeEmpty = options?.includeEmptyNames ?? false;

  if (Array.isArray(item.items) && item.items.length > 0) {
    const structured = item.items
      .filter((entry): entry is PageSectionItem => typeof entry === 'object' && entry != null)
      .map((entry) => ({
        name: normalizeLabProjectName(entry.title),
        tagline: (entry.content || '').trim() || fallback,
      }))
      .filter((p) => includeEmpty || p.name);
    if (structured.length > 0) return structured;
  }

  return splitLines(item.subtitle).map((line) => {
    const pipe = line.indexOf('|');
    if (pipe >= 0) {
      return {
        name: line.slice(0, pipe).trim(),
        tagline: line.slice(pipe + 1).trim() || fallback,
      };
    }
    return { name: line, tagline: fallback };
  });
}

export function labProjectsToItems(projects: LabProject[]): PageSectionItem[] {
  return projects.map((p, index) => ({
    title: p.name.trim() || `${LAB_DRAFT_PREFIX}${index}`,
    content: p.tagline.trim(),
  }));
}

export const getItemProjects = (item: PageSectionItem): string[] => {
  return getLabProjects(item).map((p) => p.name);
};
