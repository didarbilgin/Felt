// Shared TypeScript types for FELT platform

export type Language = 'TR' | 'EN';

/** Article / research publication lifecycle */
export type ArticleStatus = 'draft' | 'published' | 'archived';

/** Program offering lifecycle */
export type ProgramStatus = 'draft' | 'active' | 'archived';

/** Event lifecycle */
export type EventStatus = 'upcoming' | 'active' | 'completed' | 'cancelled' | 'archived';

/** Blog post lifecycle */
export type BlogStatus = 'draft' | 'published' | 'archived';

// Article / Research types
export type ArticleType = 'article' | 'conference' | 'report' | 'book' | 'scale';

export interface Article {
  id: string;
  title: string;
  type: ArticleType;
  year: number;
  language: Language;
  source: string; // Journal / Conference / Publisher
  tags: string[];
  link?: string;
  doi?: string;
  abstract?: string;
  /** Full article body (admin / detail use) */
  content: string;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Program types
export type ProgramCategory =
  | 'education-module'
  | 'teachers'
  | 'leaders'
  | 'parents-communities'
  | 'mentorship'
  | 'certificate'
  | 'transformation-package';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  targetAudience: string;
  description: string;
  duration: string;
  status: ProgramStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Event types
export type EventType = 'summit' | 'webinar' | 'masterclass' | 'conference' | 'podcast' | 'media';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  location: string;
  description: string;
  link?: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Blog types
export type BlogCategory = 'essay' | 'future-notes' | 'video-podcast-notes' | 'weekly-insight';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  content: string;
  excerpt: string;
  publishDate: Date;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Contact form
export type ContactType = 'general' | 'collaboration' | 'press-academic';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  type: ContactType;
  message: string;
  createdAt: Date;
}

// Newsletter
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

// Admin user
export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
  /** Access JWT (alias of accessToken for compatibility) */
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  lastActivity?: number;
}

// Helper type for form data
export type CreateArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateProgramData = Omit<Program, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateBlogPostData = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

// Category labels for display
export const articleTypeLabels: Record<ArticleType, string> = {
  article: 'Akademik Makale',
  conference: 'Kongre & Sunum',
  report: 'Rapor / Policy Paper',
  book: 'Kitap / Kitap Bölümü',
  scale: 'Veri ve Ölçek',
};

export const programCategoryLabels: Record<ProgramCategory, string> = {
  'education-module': 'Eğitim Modülleri',
  'teachers': 'Öğretmenler için',
  'leaders': 'Yöneticiler için',
  'parents-communities': 'Veliler ve Topluluklar için',
  'mentorship': 'Mentorluk Programı',
  'certificate': 'Sertifika Programları',
  'transformation-package': 'Dönüşüm Paketleri',
};

export const eventTypeLabels: Record<EventType, string> = {
  summit: 'FELT Summit',
  webinar: 'Webinar',
  masterclass: 'Masterclass',
  conference: 'Konferans',
  podcast: 'Podcast',
  media: 'Basın & Medya',
};

export const blogCategoryLabels: Record<BlogCategory, string> = {
  essay: 'Essay',
  'future-notes': 'Future Notes',
  'video-podcast-notes': 'Video & Podcast Notes',
  'weekly-insight': 'FELT Weekly Insight',
};

export const contactTypeLabels: Record<ContactType, string> = {
  general: 'Genel İletişim',
  collaboration: 'İş Birliği',
  'press-academic': 'Basın & Akademik Davet',
};

export const articleStatusLabels: Record<ArticleStatus, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşiv',
};

export const programStatusLabels: Record<ProgramStatus, string> = {
  draft: 'Taslak',
  active: 'Aktif',
  archived: 'Arşiv',
};

export const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: 'Yakında',
  active: 'Aktif',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  archived: 'Arşiv',
};

/**
 * Public display status only: if date passed but DB still says upcoming, show as completed.
 * Does not change stored `event.status`.
 */
export function getEventDisplayStatus(event: Event, now: Date = new Date()): EventStatus {
  if (event.status === 'upcoming' && event.date.getTime() < now.getTime()) {
    return 'completed';
  }
  return event.status;
}

export function getEventDisplayStatusLabel(event: Event, now?: Date): string {
  return eventStatusLabels[getEventDisplayStatus(event, now)];
}

export const blogStatusLabels: Record<BlogStatus, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşiv',
};
