import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { contactApi, type AdminContactMessage } from '@/lib/api/contact';
import { contactTypeLabels } from '@/lib/types';

const formatDate = (date: Date) =>
  date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const subjectLabel = (subject: string) =>
  contactTypeLabels[subject as keyof typeof contactTypeLabels] || subject;

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminContactMessage | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await contactApi.listAdminMessages();
        setMessages(data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">İletişim Mesajları</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ziyaretçilerin iletişim formu üzerinden gönderdiği mesajlar.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted-foreground">Henüz mesaj yok.</p>
      ) : (
        <div className="admin-table-shell">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gönderen</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Konu</TableHead>
                <TableHead>Özet</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{subjectLabel(msg.subject)}</TableCell>
                  <TableCell className="max-w-[240px] truncate text-muted-foreground">
                    {msg.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(msg.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(msg)}>
                      Görüntüle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mesaj Detayı</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-foreground">{selected.name}</p>
                <p className="text-muted-foreground">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Konu</p>
                <p className="mt-1">{subjectLabel(selected.subject)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tarih</p>
                <p className="mt-1">{formatDate(selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Mesaj</p>
                <p className="mt-2 text-foreground leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
