import { apiRequest } from '@/lib/api/client';

export type AboutItem = {
  number?: string;
  title: string;
  content: string;
};

export type AboutSection = {
  id: string | number;
  section_key: string;
  title: string;
  content?: string | null;
  items?: AboutItem[] | null;
  sort_order: number;
  is_active: boolean;
};

export type AboutSectionPayload = {
  section_key: string;
  title: string;
  content?: string | null;
  items?: AboutItem[] | null;
  sort_order: number;
  is_active: boolean;
};

type BackendAboutSection = AboutSection & {
  created_at?: string;
  updated_at?: string;
};

const PUBLIC_PATH = '/api/about-sections';
const ADMIN_PATH = '/api/admin/about-sections';

export function normalizeAboutSection(raw: BackendAboutSection): AboutSection {
  return {
    id: raw.id,
    section_key: raw.section_key,
    title: raw.title,
    content: raw.content ?? null,
    items: raw.items ?? null,
    sort_order: Number(raw.sort_order) || 0,
    is_active: Boolean(raw.is_active),
  };
}

export function isPersistedAboutSectionId(id: string | number | null | undefined): boolean {
  if (id == null) return false;
  if (id === 0 || id === '') return false;
  return true;
}

export const aboutSectionsApi = {
  listPublic: async (): Promise<AboutSection[]> => {
    const data = await apiRequest<BackendAboutSection[]>(PUBLIC_PATH, { method: 'GET' });
    return data.map(normalizeAboutSection);
  },

  listAdmin: async (): Promise<AboutSection[]> => {
    const data = await apiRequest<BackendAboutSection[]>(ADMIN_PATH, { method: 'GET' });
    return data.map(normalizeAboutSection);
  },

  create: async (payload: AboutSectionPayload): Promise<AboutSection> => {
    const data = await apiRequest<BackendAboutSection>(ADMIN_PATH, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeAboutSection(data);
  },

  update: async (
    id: string | number,
    payload: Partial<AboutSectionPayload>
  ): Promise<AboutSection> => {
    const data = await apiRequest<BackendAboutSection>(`${ADMIN_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return normalizeAboutSection(data);
  },
};
