import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { applicationsApi } from '@/lib/api/applications';
import type { Application, ApplicationSourceType, ApplicationStatus } from '@/lib/types';
import { applicationSourceTypeLabels, applicationStatusLabels } from '@/lib/types';

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
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
          {TAB_SOURCES.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          {loading ? (
            <p className="text-muted-foreground py-8">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground py-8">Bu filtrede başvuru yok.</p>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kaynak</TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Kurum / Ünvan</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="align-top text-sm">
                        <Badge variant="outline" className="mb-1">
                          {applicationSourceTypeLabels[item.sourceType]}
                        </Badge>
                        <div className="text-muted-foreground">{item.sourceTitle || '—'}</div>
                      </TableCell>
                      <TableCell className="align-top font-medium">
                        <div>{item.fullName}</div>
                        {item.message ? (
                          <p className="text-xs text-muted-foreground mt-1 max-w-xs whitespace-pre-wrap">
                            {item.message}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top text-sm">
                        <div>{item.email}</div>
                        <div className="text-muted-foreground">{item.phone}</div>
                      </TableCell>
                      <TableCell className="align-top text-sm">
                        {item.organization || '—'}
                        {item.title ? (
                          <div className="text-muted-foreground">{item.title}</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top text-sm whitespace-nowrap">
                        {item.createdAt.toLocaleString('tr-TR')}
                      </TableCell>
                      <TableCell className="align-top min-w-[140px]">
                        <Select
                          value={item.status}
                          onValueChange={(v) => updateStatus(item.id, v as ApplicationStatus)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(applicationStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
