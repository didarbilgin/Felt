import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { eventsApi } from '@/lib/api/events';
import { Event, EventStatus, EventType, eventStatusLabels, eventTypeLabels } from '@/lib/types';

type EventFormState = {
  title: string;
  type: EventType;
  date: string;
  location: string;
  description: string;
  link: string;
  status: EventStatus;
};

const emptyForm = (): EventFormState => ({
  title: '',
  type: 'webinar',
  date: '',
  location: '',
  description: '',
  link: '',
  status: 'upcoming',
});

export default function AdminEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormState>(emptyForm);

  const load = async () => {
    setEvents(await eventsApi.getAll());
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    const payload = {
      title: form.title,
      type: form.type,
      date: new Date(form.date),
      location: form.location,
      description: form.description,
      link: form.link.trim() ? form.link : undefined,
      status: form.status,
    };
    if (editing) await eventsApi.update(editing.id, payload);
    else await eventsApi.create(payload);
    toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
    setOpen(false);
    setEditing(null);
    setForm(emptyForm());
    load();
  };

  const handleEdit = (e: Event) => {
    setEditing(e);
    setForm({
      title: e.title,
      type: e.type,
      date: e.date.toISOString().split('T')[0],
      location: e.location,
      description: e.description,
      link: e.link || '',
      status: e.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await eventsApi.delete(id);
    toast({ title: 'Silindi' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Etkinlikler</h1>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) {
              setEditing(null);
              setForm(emptyForm());
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? 'Düzenle' : 'Yeni Etkinlik'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Başlık</Label>
                <Input value={form.title} onChange={(ev) => setForm({ ...form, title: ev.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tür</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as EventType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypeLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tarih</Label>
                  <Input type="date" value={form.date} onChange={(ev) => setForm({ ...form, date: ev.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Durum</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Konum</Label>
                <Input
                  value={form.location}
                  onChange={(ev) => setForm({ ...form, location: ev.target.value })}
                  placeholder="Online veya şehir"
                />
              </div>
              <div className="grid gap-2">
                <Label>Açıklama</Label>
                <Textarea value={form.description} onChange={(ev) => setForm({ ...form, description: ev.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Link</Label>
                <Input value={form.link} onChange={(ev) => setForm({ ...form, link: ev.target.value })} />
              </div>
              <Button onClick={handleSave}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{eventTypeLabels[e.type]}</Badge>
                </TableCell>
                <TableCell>{e.date.toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>
                  <Badge variant={e.status === 'cancelled' ? 'destructive' : 'outline'}>{eventStatusLabels[e.status]}</Badge>
                </TableCell>
                <TableCell>{e.location}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(e)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
