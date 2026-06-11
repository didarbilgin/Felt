import { apiRequest } from '@/lib/api/client';

export type TopPage = {
  path: string;
  visits: number;
};

export type PageViewRecord = {
  id: string;
  path: string;
  visitor_id: string | null;
  visited_at: string;
};

export type AnalyticsSummary = {
  total_visits: number;
  today_visits: number;
  unique_visitors: number;
  returning_visitors: number;
  top_pages: TopPage[];
  recent_visits: PageViewRecord[];
};

export const analyticsApi = {
  trackPageView: async (path: string, visitorId: string): Promise<void> => {
    await apiRequest('/api/analytics/page-views', {
      method: 'POST',
      body: JSON.stringify({ path, visitor_id: visitorId }),
    });
  },

  getSummary: async (): Promise<AnalyticsSummary> => {
    return apiRequest<AnalyticsSummary>('/api/admin/analytics/summary', {
      method: 'GET',
    });
  },
};
