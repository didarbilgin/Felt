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
import { programsApi } from '@/lib/api/programs';
import { pagesApi } from '@/lib/cms/pages';
import { buildProgramCategoryOptions } from '@/lib/cms/programCategories';
import { Program, ProgramStatus, programCategoryLabels, programStatusLabels } from '@/lib/types';

const defaultCategory = 'education-module';

export default function AdminPrograms() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participantsProgram, setParticipantsProgram] = useState<Program | null>(null);
  const [form, setForm] = useState({
    title: '',
    category: defaultCategory,
    targetAudience: '',
    description: '',
    duration: '',
    status: 'draft' as ProgramStatus,
  });

  const [categoryOptions, setCategoryOptions] = useState(
    buildProgramCategoryOptions(undefined)
  );

  const loadCategories = async () => {
    const page = await pagesApi.getAdminPage('programs');
    const options = buildProgramCategoryOptions(page?.sections);
    if (options.length > 0) {
      setCategoryOptions(options.filter((o) => o.value !== 'all'));
    }
  };

  const load = async () => {
    setPrograms(await programsApi.getAll());
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const categoryLabelMap = useMemo(() => {
    const map: Record<string, string> = { ...programCategoryLabels };
    for (const opt of categoryOptions) {
      map[opt.value] = opt.label;
    }
    return map;
  }, [categoryOptions]);

  const resolveCategoryLabel = (slug: string) => categoryLabelMap[slug] || slug;

  const handleSave = async () => {
    try {
      if (editing) await programsApi.update(editing.id, form);
      else await programsApi.create(form);
      toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
      setOpen(false);
      setEditing(null);
      load();
      setForm({
        title: '',
        category: categoryOptions[0]?.value || defaultCategory,
        targetAudience: '',
        description: '',
        duration: '',
        status: 'draft',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(e),
      });
    }
  };

  const handleEdit = (p: Program) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      targetAudience: p.targetAudience,
      description: p.description,
      duration: p.duration,
      status: p.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await programsApi.delete(id);
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

  const categorySelectOptions =
    categoryOptions.length > 0
      ? categoryOptions
      : Object.entries(programCategoryLabels).map(([value, label]) => ({ value, label }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Programlar</h1>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setEditing(null);
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
              <DialogTitle>{editing ? 'Düzenle' : 'Yeni Program'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Başlık</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorySelectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Hedef Kitle</Label>
                <Input
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Süre</Label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Açıklama</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Durum</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as ProgramStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(programStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <TableHead>Kategori</TableHead>
              <TableHead>Hedef Kitle</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-36"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{resolveCategoryLabel(p.category)}</Badge>
                </TableCell>
                <TableCell>{p.targetAudience}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'active' ? 'default' : 'outline'}>
                    {programStatusLabels[p.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Katılımcılar"
                      onClick={() => {
                        setParticipantsProgram(p);
                        setParticipantsOpen(true);
                      }}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
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
        sourceType="program"
        sourceId={participantsProgram?.id}
        sourceTitle={participantsProgram?.title || ''}
      />
    </div>
  );
}
