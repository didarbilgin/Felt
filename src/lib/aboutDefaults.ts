/** Fallback when founder-cv is not yet in the database (public + admin hints). */
export const FOUNDER_CV_DEFAULT = {
  section_key: 'founder-cv',
  title: 'Kurucunun Özgeçmişi',
  content: `Dr. Hümeyra Kalafat, eğitim liderliği, gelecek okuryazarlığı ve teknoloji destekli öğrenme alanlarında çalışan bir eğitimci ve eğitim stratejistidir.

Yüksek lisans ve doktora çalışmalarını eğitim bilimleri ve liderlik alanlarında tamamlamış; okul, üniversite ve uluslararası projelerde eğitim dönüşümü, yapay zekâ ve insan merkezli öğrenme modelleri üzerine araştırma ve uygulama programları yürütmüştür.

FELT'i, eğitimin geleceğine dair düşünce, araştırma ve uygulamayı bir araya getiren büyüyen bir ekosistem olarak kurmuştur.`,
  sort_order: 2,
  is_active: true,
} as const;
