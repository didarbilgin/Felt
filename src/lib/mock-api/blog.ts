import { BlogPost, CreateBlogPostData, BlogCategory } from '../types';
import { blogPosts, generateId } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const blogApi = {
  getAll: async (): Promise<BlogPost[]> => {
    await delay(100);
    return [...blogPosts].sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  },

  getByCategory: async (category: BlogCategory): Promise<BlogPost[]> => {
    await delay(100);
    return blogPosts
      .filter(p => p.category === category)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  },

  getPublished: async (): Promise<BlogPost[]> => {
    await delay(100);
    return blogPosts
      .filter(p => p.status === 'published')
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  },

  getById: async (id: string): Promise<BlogPost | undefined> => {
    await delay(100);
    return blogPosts.find(p => p.id === id);
  },

  getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    await delay(100);
    return blogPosts.find(p => p.slug === slug);
  },

  create: async (data: CreateBlogPostData): Promise<BlogPost> => {
    await delay(200);
    const newPost: BlogPost = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    blogPosts.push(newPost);
    return newPost;
  },

  update: async (id: string, data: Partial<CreateBlogPostData>): Promise<BlogPost | undefined> => {
    await delay(200);
    const index = blogPosts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    blogPosts[index] = {
      ...blogPosts[index],
      ...data,
      updatedAt: new Date(),
    };
    return blogPosts[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = blogPosts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    blogPosts.splice(index, 1);
    return true;
  },

  getRecent: async (limit: number = 3): Promise<BlogPost[]> => {
    await delay(100);
    return blogPosts
      .filter(p => p.status === 'published')
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, limit);
  },
};
