import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { applicationStatusLabels } from '@/lib/types';

type ApplicationsParticipantsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceType: ApplicationSourceType;
  sourceId?: string;
  sourceTitle: string;
};

export function ApplicationsParticipantsSheet({
  open,
  onOpenChange,
  sourceType,
  sourceId,
  sourceTitle,
}: ApplicationsParticipantsSheetProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applicationsApi.listAdmin({
        sourceType,
        sourceId,
      });
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
  }, [sourceId, sourceType, toast]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Katılımcılar / Başvurular</SheetTitle>
          <SheetDescription>{sourceTitle}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz başvuru yok.</p>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableCell className="font-medium align-top">
                        <div>{item.fullName}</div>
                        {item.message ? (
                          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] whitespace-pre-wrap">
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
          <p className="mt-4 text-xs text-muted-foreground">
            Toplam: <Badge variant="outline">{items.length}</Badge>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
