import { Article, Program, Event, BlogPost, ContactMessage, NewsletterSubscriber } from '../types';

// Generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock Articles
export let articles: Article[] = [
  {
    id: generateId(),
    title: 'Futuristic Leadership in Education: A New Paradigm',
    type: 'article',
    year: 2024,
    language: 'EN',
    source: 'Journal of Educational Leadership',
    tags: ['leadership', 'future', 'education'],
    doi: '10.1234/jel.2024.001',
    abstract: 'This study explores the concept of futuristic leadership in educational contexts...',
    content: '',
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: generateId(),
    title: 'Eğitimde Yapay Zeka: Fırsatlar ve Zorluklar',
    type: 'article',
    year: 2024,
    language: 'TR',
    source: 'Türk Eğitim Bilimleri Dergisi',
    tags: ['yapay zeka', 'eğitim', 'teknoloji'],
    abstract: 'Bu çalışma, yapay zekanın eğitim alanındaki potansiyel etkilerini incelemektedir...',
    content: '',
    status: 'published',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: generateId(),
    title: 'The Future of Teacher Education: 2040 Vision',
    type: 'conference',
    year: 2023,
    language: 'EN',
    source: 'International Education Summit 2023',
    tags: ['teacher education', 'future studies'],
    link: 'https://example.com/conference',
    content: '',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
  },
  {
    id: generateId(),
    title: 'Gelecekçi Liderlik Ölçeği: Geçerlik ve Güvenirlik Çalışması',
    type: 'scale',
    year: 2023,
    language: 'TR',
    source: 'FELT Research',
    tags: ['ölçek', 'liderlik', 'araştırma'],
    abstract: 'Bu çalışmada gelecekçi liderlik ölçeğinin geçerlik ve güvenirlik analizleri yapılmıştır.',
    content: '',
    status: 'published',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01'),
  },
  {
    id: generateId(),
    title: 'Policy Paper: Digital Transformation in Turkish Education',
    type: 'report',
    year: 2024,
    language: 'EN',
    source: 'FELT Policy Institute',
    tags: ['policy', 'digital transformation', 'Turkey'],
    link: 'https://example.com/policy-paper',
    content: '',
    status: 'published',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Mock Programs
export let programs: Program[] = [
  {
    id: generateId(),
    title: 'Gelecekçi Liderlik Sertifika Programı',
    category: 'certificate',
    targetAudience: 'Okul yöneticileri ve eğitim liderleri',
    description: '12 haftalık kapsamlı liderlik eğitimi programı. Katılımcılar, geleceğin eğitim kurumlarını yönetmek için gerekli becerileri kazanır.',
    duration: '12 hafta',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: generateId(),
    title: 'Öğretmenler için AI Okuryazarlığı',
    category: 'education-module',
    targetAudience: 'K-12 öğretmenleri',
    description: 'Yapay zeka araçlarını eğitimde etkin kullanma becerilerini geliştiren modül.',
    duration: '6 hafta',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: generateId(),
    title: 'Veliler için Dijital Ebeveynlik',
    category: 'education-module',
    targetAudience: 'Veliler ve bakım verenler',
    description: 'Dijital çağda çocuk yetiştirme stratejileri ve ekran süresi yönetimi.',
    duration: '4 hafta',
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: generateId(),
    title: 'FELT Model Okul Dönüşüm Paketi',
    category: 'transformation-package',
    targetAudience: 'Okullar ve eğitim kurumları',
    description: 'Kapsamlı okul dönüşüm programı. Vizyon geliştirme, müfredat yenileme ve öğretmen gelişimi.',
    duration: '1 akademik yıl',
    status: 'active',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: generateId(),
    title: 'Genç Liderler Mentorluk Programı',
    category: 'mentorship',
    targetAudience: 'Genç eğitimciler ve araştırmacılar',
    description: 'Birebir mentorluk ile kariyer gelişimi ve araştırma becerileri.',
    duration: '6 ay',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Events
export let events: Event[] = [
  {
    id: generateId(),
    title: 'FELT Summit 2025: Eğitimin Geleceği',
    type: 'summit',
    date: new Date('2025-06-15'),
    location: 'İstanbul, Türkiye',
    description: 'Eğitimin geleceğini şekillendiren liderler ve yenilikçiler bir araya geliyor.',
    link: 'https://example.com/summit2025',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: generateId(),
    title: 'AI in Education Webinar Series',
    type: 'webinar',
    date: new Date('2025-02-20'),
    location: 'Online',
    description: 'Monthly webinar series exploring AI applications in education.',
    link: 'https://example.com/webinar',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: generateId(),
    title: 'EdTech Podcast: Future of Learning',
    type: 'podcast',
    date: new Date('2024-12-01'),
    location: 'Online',
    description: 'Dr. Kalafat discusses the future of learning on EdTech podcast.',
    link: 'https://example.com/podcast',
    status: 'completed',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
];

// Mock Blog Posts
export let blogPosts: BlogPost[] = [
  {
    id: generateId(),
    title: '2040\'ta Eğitim Nasıl Görünecek?',
    slug: '2040ta-egitim-nasil-gorunecek',
    category: 'essay',
    content: `Eğitimin geleceği hakkında düşünürken, önce bugünün eğilimlerini anlamak gerekiyor...

Yapay zeka, kişiselleştirilmiş öğrenme, sanal gerçeklik ve küresel bağlantılılık, eğitimi köklü bir şekilde dönüştürüyor.

## Temel Trendler

1. **Kişiselleştirilmiş Öğrenme**: Her öğrenci için özelleştirilmiş müfredat
2. **Hibrit Modeller**: Fiziksel ve dijital öğrenme ortamlarının entegrasyonu
3. **Yaşam Boyu Öğrenme**: Kariyer boyunca sürekli beceri geliştirme

## FELT Perspektifi

FELT olarak, bu dönüşümün merkezinde insan değerlerini korumayı hedefliyoruz...`,
    excerpt: 'Eğitimin geleceği hakkında düşünürken, önce bugünün eğilimlerini anlamak gerekiyor...',
    publishDate: new Date('2024-12-01'),
    status: 'published',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: generateId(),
    title: 'Gelecekçi Liderlik Nedir?',
    slug: 'gelecekci-liderlik-nedir',
    category: 'essay',
    content: `Gelecekçi liderlik, sadece bugünü yönetmekle kalmayıp, yarını da şekillendiren bir liderlik anlayışıdır...

## Temel Özellikler

- Vizyon sahibi olmak
- Değişime açık olmak
- İnovasyon odaklı düşünmek
- Etik değerlere bağlı kalmak`,
    excerpt: 'Gelecekçi liderlik, sadece bugünü yönetmekle kalmayıp, yarını da şekillendiren bir liderlik anlayışıdır...',
    publishDate: new Date('2024-11-15'),
    status: 'published',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: generateId(),
    title: 'Weekly Insight: AI ve Etik',
    slug: 'weekly-insight-ai-ve-etik',
    category: 'weekly-insight',
    content: `Bu hafta, yapay zekanın eğitimde kullanımında etik kaygıları ele alıyoruz...`,
    excerpt: 'Bu hafta, yapay zekanın eğitimde kullanımında etik kaygıları ele alıyoruz...',
    publishDate: new Date('2024-12-02'),
    status: 'published',
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02'),
  },
];

// Mock Contact Messages
export let contactMessages: ContactMessage[] = [];

// Mock Newsletter Subscribers
export let newsletterSubscribers: NewsletterSubscriber[] = [];
