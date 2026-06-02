import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { ApplicationsParticipantsSheet } from '@/components/admin/ApplicationsParticipantsSheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { eventsApi } from '@/lib/api/events';
import { buildFormCategoryOptions } from '@/lib/cms/categoryTabs';
import { pagesApi } from '@/lib/cms/pages';
import { Event, EventStatus, EventType, eventStatusLabels, eventTypeLabels } from '@/lib/types';

const EVENT_FORM_EXCLUDE = ['all', 'upcoming', 'past'];

type EventFormState = {
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  detailDescription: string;
  link: string;
  status: EventStatus;
};

const emptyForm = (): EventFormState => ({
  title: '',
  type: 'webinar',
  date: '',
  location: '',
  description: '',
  detailDescription: '',
  link: '',
  status: 'active',
});

export default function AdminEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participantsEvent, setParticipantsEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);

  const typeSelectOptions = useMemo(() => {
    if (typeOptions.length > 0) return typeOptions;
    return Object.entries(eventTypeLabels)
      .filter(([k]) => k !== 'masterclass')
      .map(([value, label]) => ({ value, label }));
  }, [typeOptions]);

  const resolveTypeLabel = (type: string) =>
    typeSelectOptions.find((o) => o.value === type)?.label ||
    eventTypeLabels[type as keyof typeof eventTypeLabels] ||
    type;

  const loadCategories = async () => {
    const page = await pagesApi.getAdminPage('events');
    const options = buildFormCategoryOptions(page?.sections, 'event-tabs', EVENT_FORM_EXCLUDE);
    if (options.length > 0) setTypeOptions(options);
  };

  const load = async () => {
    setEvents(await eventsApi.getAll());
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const handleSave = async () => {
    const payload = {
      title: form.title,
      type: form.type as EventType,
      date: new Date(form.date),
      location: form.location,
      description: form.description,
      detailDescription: form.detailDescription.trim() || undefined,
      link: form.link.trim() ? form.link : undefined,
      status: form.status,
    };
    try {
      if (editing) await eventsApi.update(editing.id, payload);
      else await eventsApi.create(payload);
      toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
      setOpen(false);
      setEditing(null);
      setForm({
        ...emptyForm(),
        type: typeSelectOptions[0]?.value || 'webinar',
      });
      load();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(e),
      });
    }
  };

  const handleEdit = (e: Event) => {
    setEditing(e);
    setForm({
      title: e.title,
      type: e.type,
      date: e.date.toISOString().split('T')[0],
      location: e.location,
      description: e.description,
      detailDescription: e.detailDescription || '',
      link: e.link || '',
      status: e.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await eventsApi.delete(id);
      toast({ title: 'Silindi' });
      load();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Silinemedi',
        description: formatApiErrorMessage(e),
      });
    }
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
              setForm({
                ...emptyForm(),
                type: typeSelectOptions[0]?.value || 'webinar',
              });
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
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeSelectOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
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
                <Label>Kart açıklaması</Label>
                <Textarea value={form.description} onChange={(ev) => setForm({ ...form, description: ev.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Ek detay (modal)</Label>
                <Textarea
                  value={form.detailDescription}
                  onChange={(ev) => setForm({ ...form, detailDescription: ev.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Dış bağlantı</Label>
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
              <TableHead className="w-36" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{resolveTypeLabel(e.type)}</Badge>
                </TableCell>
                <TableCell>{e.date.toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>
                  <Badge variant={e.status === 'cancelled' ? 'destructive' : 'outline'}>{eventStatusLabels[e.status]}</Badge>
                </TableCell>
                <TableCell>{e.location}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Katılımcılar"
                      onClick={() => {
                        setParticipantsEvent(e);
                        setParticipantsOpen(true);
                      }}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
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

      <ApplicationsParticipantsSheet
        open={participantsOpen}
        onOpenChange={setParticipantsOpen}
        sourceType="event"
        sourceId={participantsEvent?.id}
        sourceTitle={participantsEvent?.title || ''}
      />
    </div>
  );
}
