import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationsListTable } from '@/components/admin/ApplicationsListTable';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { applicationsApi } from '@/lib/api/applications';
import type { Application, ApplicationSourceType, ApplicationStatus } from '@/lib/types';

const TAB_SOURCES: { value: ApplicationSourceType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'program', label: 'Programlar' },
  { value: 'event', label: 'Etkinlikler' },
  { value: 'newsletter', label: 'Bülten' },
  { value: 'community', label: 'Topluluk' },
  { value: 'contact', label: 'İletişim' },
  { value: 'blog', label: 'Blog' },
];

export default function AdminApplications() {
  const { toast } = useToast();
  const [tab, setTab] = useState<string>('all');
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sourceType = tab === 'all' ? undefined : (tab as ApplicationSourceType);
      const data = await applicationsApi.listAdmin(
        sourceType ? { sourceType } : undefined
      );
      setItems(data);
    } catch (e) {
      toast({
        title: 'Liste yüklenemedi',
        description: formatApiErrorMessage(e),
        variant: 'destructive',
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      toast({ title: 'Durum güncellendi' });
    } catch (e) {
      toast({
        title: 'Güncellenemedi',
        description: formatApiErrorMessage(e),
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Başvurular</h1>
        <p className="text-muted-foreground mt-1">
          Program, etkinlik, bülten, topluluk ve iletişim başvuruları
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="tabs-scroll mb-6">
          <TabsList className="tabs-scroll-list bg-muted">
            {TAB_SOURCES.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm shrink-0">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={tab} className="mt-0">
          {loading ? (
            <p className="text-muted-foreground py-8">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground py-8">Bu filtrede başvuru yok.</p>
          ) : (
            <div className="admin-table-shell admin-table-shell--wide">
              <ApplicationsListTable
                items={items}
                showSource
                onStatusChange={updateStatus}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
