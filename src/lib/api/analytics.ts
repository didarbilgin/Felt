import { apiRequest } from '@/lib/api/client';

export type AnalyticsSummary = {
  total_visits: number;
  today_visits: number;
  unique_visitors: number;
  returning_visitors: number;
};

export const analyticsApi = {
  trackSiteVisit: async (visitorId: string): Promise<void> => {
    await apiRequest('/api/analytics/page-views', {
      method: 'POST',
      body: JSON.stringify({ path: '/', visitor_id: visitorId }),
    });
  },

  getSummary: async (): Promise<AnalyticsSummary> => {
    return apiRequest<AnalyticsSummary>('/api/admin/analytics/summary', {
      method: 'GET',
    });
  },
};
