import { Article, ArticleStatus, ArticleType, CreateArticleData, Language } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const PUBLIC_ARTICLES_PATH = '/api/articles';
const ADMIN_ARTICLES_PATH = '/api/admin/articles';

interface BackendArticle {
  id: string;
  title: string;
  slug: string;
  abstract: string | null;
  content: string;
  article_type: string;
  year: number;
  language: string;
  source: string | null;
  tags: unknown;
  link: string | null;
  doi: string | null;
  authors: string | null;
  cover_image: string | null;
  pdf_link: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const normalizeTags = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === 'string');
  return [];
};

const normalizeStatus = (status?: string): ArticleStatus => {
  if (status === 'published') return 'published';
  if (status === 'archived') return 'archived';
  if (status === 'draft') return 'draft';
  return 'draft';
};

const toBackendStatus = (status: ArticleStatus): ArticleStatus => status;

const toDate = (value?: string | null): Date => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const mapBackendToFrontend = (article: BackendArticle): Article => ({
  id: article.id,
  title: article.title,
  slug: article.slug,
  type: article.article_type as ArticleType,
  year: article.year,
  language: article.language as Language,
  source: article.source ?? '',
  tags: normalizeTags(article.tags),
  link: article.link?.trim() || undefined,
  doi: article.doi?.trim() || undefined,
  authors: article.authors?.trim() || undefined,
  coverImage: article.cover_image?.trim() || undefined,
  pdfLink: article.pdf_link?.trim() || undefined,
  abstract: article.abstract ?? undefined,
  content: article.content,
  status: normalizeStatus(article.status),
  publishedAt: article.published_at ? toDate(article.published_at) : undefined,
  createdAt: toDate(article.created_at),
  updatedAt: toDate(article.updated_at),
});

interface BackendArticlePayload {
  title: string;
  abstract?: string | null;
  content: string;
  article_type: string;
  year: number;
  language: string;
  source?: string | null;
  tags: string[];
  authors?: string | null;
  cover_image?: string | null;
  pdf_link?: string | null;
  status: ArticleStatus;
}

const mapCreateToBackend = (data: CreateArticleData): BackendArticlePayload => ({
  title: data.title,
  content: data.content?.trim() || data.abstract?.trim() || data.title,
  abstract: data.abstract?.trim() || null,
  article_type: data.type,
  year: data.year,
  language: data.language,
  source: data.source?.trim() || null,
  tags: data.tags,
  authors: data.authors?.trim() || null,
  cover_image: data.coverImage?.trim() || null,
  pdf_link: data.pdfLink?.trim() || null,
  status: toBackendStatus(data.status),
});

const mapUpdateToBackend = (data: Partial<CreateArticleData>): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) {
    payload.title = data.title;
    payload.slug = slugify(data.title);
  }
  if (data.abstract !== undefined) payload.abstract = data.abstract.trim() || null;
  if (data.content !== undefined) payload.content = data.content;
  if (data.type !== undefined) payload.article_type = data.type;
  if (data.year !== undefined) payload.year = data.year;
  if (data.language !== undefined) payload.language = data.language;
  if (data.source !== undefined) payload.source = data.source.trim() || null;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.status !== undefined) payload.status = toBackendStatus(data.status);
  if (data.authors !== undefined) payload.authors = data.authors.trim() || null;
  if (data.coverImage !== undefined) payload.cover_image = data.coverImage.trim() || null;
  if (data.pdfLink !== undefined) payload.pdf_link = data.pdfLink.trim() || null;
  return payload;
};

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const items = await apiRequest<BackendArticle[]>(ADMIN_ARTICLES_PATH, { method: 'GET' });
    return items.map(mapBackendToFrontend).sort((a, b) => b.year - a.year);
  },

  getByType: async (type: ArticleType): Promise<Article[]> => {
    const all = await articlesApi.getAll();
    return all.filter((article) => article.type === type).sort((a, b) => b.year - a.year);
  },

  getByLanguage: async (language: Language): Promise<Article[]> => {
    const all = await articlesApi.getAll();
    return all.filter((article) => article.language === language).sort((a, b) => b.year - a.year);
  },

  getPublished: async (): Promise<Article[]> => {
    const items = await apiRequest<BackendArticle[]>(PUBLIC_ARTICLES_PATH, { method: 'GET' });
    return items.map(mapBackendToFrontend).sort((a, b) => b.year - a.year);
  },

  getPublishedBySlug: async (slug: string): Promise<Article | undefined> => {
    try {
      const article = await apiRequest<BackendArticle>(
        `${PUBLIC_ARTICLES_PATH}/slug/${slug}`,
        { method: 'GET' }
      );
      return mapBackendToFrontend(article);
    } catch {
      return undefined;
    }
  },

  getById: async (id: string): Promise<Article | undefined> => {
    const all = await articlesApi.getAll();
    return all.find((article) => article.id === id);
  },

  create: async (data: CreateArticleData): Promise<Article> => {
    const payload = mapCreateToBackend(data);
    const created = await apiRequest<BackendArticle>(ADMIN_ARTICLES_PATH, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendToFrontend(created);
  },

  update: async (id: string, data: Partial<CreateArticleData>): Promise<Article | undefined> => {
    const payload = mapUpdateToBackend(data);
    const updated = await apiRequest<BackendArticle>(`${ADMIN_ARTICLES_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapBackendToFrontend(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${ADMIN_ARTICLES_PATH}/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  getFeatured: async (): Promise<Article | undefined> => {
    const published = await articlesApi.getPublished();
    return published[0];
  },
};
