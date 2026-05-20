import { BlogCategory, BlogPost, CreateBlogPostData } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const BLOG_PATH = '/api/admin/blog';

type BackendBlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  content: string;
  excerpt: string;
  publish_date: string;
  status: BlogPost['status'];
  created_at: string;
  updated_at: string;
};

type BackendBlogPayload = {
  title?: string;
  category?: BlogCategory;
  content?: string;
  excerpt?: string;
  publish_date?: string;
  status?: BlogPost['status'];
};

const toFrontend = (item: BackendBlogPost): BlogPost => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  category: item.category,
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
  getAll: async (): Promise<BlogPost[]> => {
    const data = await apiRequest<BackendBlogPost[]>(BLOG_PATH, { method: 'GET' });
    return data.map(toFrontend).sort(byPublishDateDesc);
  },

  getByCategory: async (category: BlogCategory): Promise<BlogPost[]> => {
    const all = await blogApi.getAll();
    return all.filter((post) => post.category === category).sort(byPublishDateDesc);
  },

  getPublished: async (): Promise<BlogPost[]> => {
    const all = await blogApi.getAll();
    return all.filter((post) => post.status === 'published').sort(byPublishDateDesc);
  },

  getById: async (id: string): Promise<BlogPost | undefined> => {
    const data = await apiRequest<BackendBlogPost>(`${BLOG_PATH}/${id}`, { method: 'GET' });
    return toFrontend(data);
  },

  getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const all = await blogApi.getAll();
    return all.find((post) => post.slug === slug);
  },

  create: async (data: CreateBlogPostData): Promise<BlogPost> => {
    const created = await apiRequest<BackendBlogPost>(BLOG_PATH, {
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
    const updated = await apiRequest<BackendBlogPost>(`${BLOG_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToBackendPayload(data)),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return toFrontend(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${BLOG_PATH}/${id}`, { method: 'DELETE' });
    return true;
  },

  getRecent: async (limit = 3): Promise<BlogPost[]> => {
    const published = await blogApi.getPublished();
    return published.slice(0, limit);
  },
};