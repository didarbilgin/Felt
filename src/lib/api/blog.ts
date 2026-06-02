import { BlogCategory, BlogPost, CreateBlogPostData } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const ADMIN_BLOG_PATH = '/api/admin/blog';
const PUBLIC_BLOG_PATH = '/api/blog-posts';

type BackendBlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory | string;
  content: string;
  excerpt: string;
  publish_date: string;
  status: BlogPost['status'];
  created_at: string;
  updated_at: string;
};

type BackendBlogPayload = {
  title?: string;
  category?: BlogCategory | string;
  content?: string;
  excerpt?: string;
  publish_date?: string;
  status?: BlogPost['status'];
};

const toFrontend = (item: BackendBlogPost): BlogPost => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  category: item.category as BlogPost['category'],
  content: item.content,
  excerpt: item.excerpt,
  publishDate: new Date(item.publish_date),
  status: item.status,
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at),
});

const byPublishDateDesc = (a: BlogPost, b: BlogPost) =>
  b.publishDate.getTime() - a.publishDate.getTime();

const mapToBackendPayload = (
  data: Partial<CreateBlogPostData>,
): BackendBlogPayload => {
  const payload: BackendBlogPayload = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.category !== undefined) payload.category = data.category;
  if (data.content !== undefined) payload.content = data.content;
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt;

  if (data.publishDate !== undefined) {
    payload.publish_date =
      data.publishDate instanceof Date
        ? data.publishDate.toISOString()
        : String(data.publishDate);
  }

  if (data.status !== undefined) payload.status = data.status;

  return payload;
};

export const blogApi = {
  /** Public site — published posts only (no auth). */
  getPublished: async (): Promise<BlogPost[]> => {
    const data = await apiRequest<BackendBlogPost[]>(PUBLIC_BLOG_PATH, { method: 'GET' });
    return data.map(toFrontend).sort(byPublishDateDesc);
  },

  getByCategory: async (category: BlogCategory | string): Promise<BlogPost[]> => {
    const all = await blogApi.getPublished();
    return all.filter((post) => post.category === category).sort(byPublishDateDesc);
  },

  getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    try {
      const data = await apiRequest<BackendBlogPost>(
        `${PUBLIC_BLOG_PATH}/slug/${encodeURIComponent(slug)}`,
        { method: 'GET' }
      );
      return toFrontend(data);
    } catch {
      return undefined;
    }
  },

  /** Admin — all posts (auth required). */
  getAll: async (): Promise<BlogPost[]> => {
    const data = await apiRequest<BackendBlogPost[]>(ADMIN_BLOG_PATH, { method: 'GET' });
    return data.map(toFrontend).sort(byPublishDateDesc);
  },

  getById: async (id: string): Promise<BlogPost | undefined> => {
    const data = await apiRequest<BackendBlogPost>(`${ADMIN_BLOG_PATH}/${id}`, { method: 'GET' });
    return toFrontend(data);
  },

  create: async (data: CreateBlogPostData): Promise<BlogPost> => {
    const created = await apiRequest<BackendBlogPost>(ADMIN_BLOG_PATH, {
      method: 'POST',
      body: JSON.stringify(mapToBackendPayload(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return toFrontend(created);
  },

  update: async (
    id: string,
    data: Partial<CreateBlogPostData>,
  ): Promise<BlogPost | undefined> => {
    const updated = await apiRequest<BackendBlogPost>(`${ADMIN_BLOG_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToBackendPayload(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return toFrontend(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${ADMIN_BLOG_PATH}/${id}`, { method: 'DELETE' });
    return true;
  },

  getRecent: async (limit = 3): Promise<BlogPost[]> => {
    const published = await blogApi.getPublished();
    return published.slice(0, limit);
  },
};
