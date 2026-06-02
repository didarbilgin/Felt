import { useEffect, useState } from 'react';
import { pagesApi } from '@/lib/cms/pages';
import type { PageContent, PageHeroFallback } from '@/lib/cms/types';

export function usePageContent(pageKey: string, heroFallback: PageHeroFallback) {
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const data = await pagesApi.getPage(pageKey);
      if (!cancelled) {
        setPage(data);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  const heroTitle = page?.title || heroFallback.title;
  const heroSubtitle = page?.subtitle ?? heroFallback.subtitle;

  return {
    page,
    sections: page?.sections ?? [],
    loading,
    heroTitle,
    heroSubtitle,
  };
}
