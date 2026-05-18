import { BlogCategory, BlogPost, CreateBlogPostData } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const BLOG_PATH = '/api/admin/blog';

type BackendBlogPost = Omit<BlogPost, 'publishDate' | 'createdAt' | 'updatedAt'> & {
  publishDate: string;
  createdAt: string;
  updatedAt: string;
};

const toFrontend = (item: BackendBlogPost): BlogPost => ({
  ...item,
  publishDate: new Date(item.publishDate),
  createdAt: new Date(item.createdAt),
  updatedAt: new Date(item.updatedAt),
});

const byPublishDateDesc = (a: BlogPost, b: BlogPost) => b.publishDate.getTime() - a.publishDate.getTime();

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
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return toFrontend(created);
  },

  update: async (id: string, data: Partial<CreateBlogPostData>): Promise<BlogPost | undefined> => {
    const updated = await apiRequest<BackendBlogPost>(`${BLOG_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
