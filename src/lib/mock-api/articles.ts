import { Article, CreateArticleData, Language, ArticleType } from '../types';
import { articles, generateId } from './data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const articlesApi = {
  // Get all articles
  getAll: async (): Promise<Article[]> => {
    await delay(100);
    return [...articles].sort((a, b) => b.year - a.year);
  },

  // Get articles by type
  getByType: async (type: ArticleType): Promise<Article[]> => {
    await delay(100);
    return articles.filter(a => a.type === type).sort((a, b) => b.year - a.year);
  },

  // Get articles by language
  getByLanguage: async (language: Language): Promise<Article[]> => {
    await delay(100);
    return articles.filter(a => a.language === language).sort((a, b) => b.year - a.year);
  },

  // Get published articles
  getPublished: async (): Promise<Article[]> => {
    await delay(100);
    return articles.filter(a => a.status === 'published').sort((a, b) => b.year - a.year);
  },

  // Get single article by ID
  getById: async (id: string): Promise<Article | undefined> => {
    await delay(100);
    return articles.find(a => a.id === id);
  },

  // Create new article
  create: async (data: CreateArticleData): Promise<Article> => {
    await delay(200);
    const newArticle: Article = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    articles.push(newArticle);
    return newArticle;
  },

  // Update article
  update: async (id: string, data: Partial<CreateArticleData>): Promise<Article | undefined> => {
    await delay(200);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    articles[index] = {
      ...articles[index],
      ...data,
      updatedAt: new Date(),
    };
    return articles[index];
  },

  // Delete article
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    articles.splice(index, 1);
    return true;
  },

  // Get featured article (most recent published)
  getFeatured: async (): Promise<Article | undefined> => {
    await delay(100);
    const published = articles
      .filter(a => a.status === 'published')
      .sort((a, b) => b.year - a.year);
    return published[0];
  },
};
