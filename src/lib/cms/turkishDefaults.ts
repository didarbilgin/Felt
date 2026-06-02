/** Known English seed strings → Turkish display replacements (CMS keys unchanged). */
const EXACT_REPLACEMENTS: Record<string, string> = {
  'Futures of Education, Leadership & Technology':
    'Eğitim, Liderlik ve Teknolojinin Geleceği',
  'The future of education is being negotiated now.':
    'Eğitimin geleceği bugün şekilleniyor.',
  'Researching AI, ethics, leadership, and human learning in the post-digital age.':
    'Yapay zekâ, etik, liderlik ve insan öğrenmesi üzerine araştırma ve düşünce üretiyoruz.',
  'FELT explores how education systems, leaders, and learners can respond to the ethical, technological, and human challenges of the AI age.':
    'FELT, eğitim sistemlerinin, liderlerin ve öğrenenlerin yapay zekâ çağının etik, teknolojik ve insani zorluklarına nasıl yanıt verebileceğini araştırır.',
};

export function preferTurkishDisplay(
  value: string | null | undefined,
  fallback: string
): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return EXACT_REPLACEMENTS[trimmed] ?? trimmed;
}

export const HUB_TYPE_TR: Record<string, string> = {
  Circle: 'Çember',
  Lab: 'Laboratuvar',
  Hub: 'Merkez',
  Group: 'Grup',
  circle: 'Çember',
  lab: 'Laboratuvar',
  hub: 'Merkez',
  group: 'Grup',
};

export function translateHubType(type: string): string {
  const t = type.trim();
  return HUB_TYPE_TR[t] ?? t;
}
