// Shared TypeScript types for FELT platform

export type Language = 'TR' | 'EN';

/** Article / research publication lifecycle */
export type ArticleStatus = 'draft' | 'published' | 'archived';

/** Program offering lifecycle */
export type ProgramStatus = 'draft' | 'active' | 'archived';

/** Event lifecycle stored in DB/admin */
export type EventStatus = 'active' | 'completed' | 'cancelled' | 'archived';

/** Event lifecycle displayed on public UI */
export type EventDisplayStatus = 'upcoming' | 'active' | 'completed' | 'cancelled' | 'archived';

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
  source: string;
  tags: string[];
  link?: string;
  doi?: string;
  abstract?: string;
  content: string;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Program types
export type ProgramCategory =
  | 'education-module'
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
export type EventType =
  | 'summit'
  | 'webinar'
  | 'masterclass'
  | 'conference'
  | 'podcast'
  | 'media';

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
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  lastActivity?: number;
}

// Helper type for form data
export type CreateArticleData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateProgramData = Omit<Program, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateBlogPostData = Omit<
  BlogPost,
  'id' | 'slug' | 'createdAt' | 'updatedAt'
>;
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
  'mentorship': 'Mentorluk',
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
  essay: 'Deneme',
  'future-notes': 'Gelecek Notları',
  'video-podcast-notes': 'Video & Podcast Notları',
  'weekly-insight': 'Haftalık İçgörü',
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
  active: 'Aktif',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  archived: 'Arşiv',
};

export const eventDisplayStatusLabels: Record<EventDisplayStatus, string> = {
  upcoming: 'Yaklaşan',
  active: 'Aktif',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  archived: 'Arşiv',
};

export const blogStatusLabels: Record<BlogStatus, string> = {
  draft: 'Taslak',
  published: 'Yayında',
  archived: 'Arşiv',
};

const UPCOMING_WINDOW_DAYS = 30;

/**
 * Public display status.
 *
 * Stored DB/admin status does not contain "upcoming".
 * "Upcoming" is calculated for active events whose date is within the next 30 days.
 */
export function getEventDisplayStatus(event: Event, now: Date = new Date()): EventDisplayStatus {
  if (event.status === 'archived') return 'archived';
  if (event.status === 'cancelled') return 'cancelled';
  if (event.status === 'completed') return 'completed';

  const eventDate = new Date(event.date);

  if (event.status === 'active' && eventDate.getTime() < now.getTime()) {
    return 'completed';
  }

  const upcomingLimit = new Date(now);
  upcomingLimit.setDate(now.getDate() + UPCOMING_WINDOW_DAYS);

  if (
    event.status === 'active' &&
    eventDate.getTime() >= now.getTime() &&
    eventDate.getTime() <= upcomingLimit.getTime()
  ) {
    return 'upcoming';
  }

  return 'active';
}

export function getEventDisplayStatusLabel(event: Event, now?: Date): string {
  return eventDisplayStatusLabels[getEventDisplayStatus(event, now)];
}