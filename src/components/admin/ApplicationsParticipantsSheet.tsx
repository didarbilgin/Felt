import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { applicationsApi } from '@/lib/api/applications';
import type { Application, ApplicationSourceType, ApplicationStatus } from '@/lib/types';
import { ApplicationsListTable } from './ApplicationsListTable';

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
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Katılımcılar</SheetTitle>
          <SheetDescription>{sourceTitle}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz başvuru yok.</p>
          ) : (
            <div className="admin-table-shell admin-table-shell--wide">
              <ApplicationsListTable items={items} onStatusChange={updateStatus} />
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
