import { useEffect, useState } from 'react';
import { BarChart3, Eye, Repeat, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi, type AnalyticsSummary } from '@/lib/api/analytics';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';

const formatVisitTime = (value: string) =>
  new Date(value).toLocaleString('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export default function AdminAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyticsApi.getSummary();
        setSummary(data);
      } catch (e) {
        setError(formatApiErrorMessage(e, 'Analitik verileri yüklenemedi.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Analitik</h1>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Analitik</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sayfa görüntüleme
            </CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.total_visits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bugünkü görüntüleme
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.today_visits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Benzersiz ziyaretçi
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.unique_visitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geri dönen ziyaretçi
            </CardTitle>
            <Repeat className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.returning_visitors}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              En çok ziyaret edilen sayfalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.top_pages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz ziyaret kaydı yok.</p>
            ) : (
              <ul className="space-y-3">
                {summary.top_pages.map((page) => (
                  <li
                    key={page.path}
                    className="flex items-center justify-between gap-4 text-sm border-b border-border/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-mono truncate">{page.path}</span>
                    <span className="shrink-0 font-medium">{page.visits}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Son ziyaretler</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recent_visits.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz ziyaret kaydı yok.</p>
            ) : (
              <ul className="space-y-3">
                {summary.recent_visits.map((visit) => (
                  <li
                    key={visit.id}
                    className="flex items-center justify-between gap-4 text-sm border-b border-border/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-mono truncate">{visit.path}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {formatVisitTime(visit.visited_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
