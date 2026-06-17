import { useEffect, useState } from 'react';
import { Eye, Repeat, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi, type AnalyticsSummary } from '@/lib/api/analytics';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';

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
              Toplam ziyaret
            </CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold">{summary.total_visits}</div>
            <p className="text-xs text-muted-foreground">Sitenin toplam ziyaret sayısı.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bugünkü ziyaret
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold">{summary.today_visits}</div>
            <p className="text-xs text-muted-foreground">Bugünkü ziyaret sayısı.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Benzersiz ziyaretçi
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold">{summary.unique_visitors}</div>
            <p className="text-xs text-muted-foreground">
              Siteyi ziyaret eden farklı kişi sayısı.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geri dönen ziyaretçi
            </CardTitle>
            <Repeat className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-bold">{summary.returning_visitors}</div>
            <p className="text-xs text-muted-foreground">Birden fazla kez gelen ziyaretçi sayısı.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
