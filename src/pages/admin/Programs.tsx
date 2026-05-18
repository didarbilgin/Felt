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
import { programsApi } from '@/lib/api/programs';
import { Program, ProgramCategory, ProgramStatus, programCategoryLabels, programStatusLabels } from '@/lib/types';

export default function AdminPrograms() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState({ title: '', category: 'education-module' as ProgramCategory, targetAudience: '', description: '', duration: '', status: 'draft' as ProgramStatus });

  const load = async () => { setPrograms(await programsApi.getAll()); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) await programsApi.update(editing.id, form);
    else await programsApi.create(form);
    toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
    setOpen(false); setEditing(null); load();
    setForm({ title: '', category: 'education-module', targetAudience: '', description: '', duration: '', status: 'draft' as ProgramStatus });
  };

  const handleEdit = (p: Program) => { setEditing(p); setForm(p); setOpen(true); };
  const handleDelete = async (id: string) => { await programsApi.delete(id); toast({ title: 'Silindi' }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Programlar</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Yeni Ekle</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Düzenle' : 'Yeni Program'}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Başlık</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Kategori</Label><Select value={form.category} onValueChange={v => setForm({ ...form, category: v as ProgramCategory })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(programCategoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label>Hedef Kitle</Label><Input value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Süre</Label><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Açıklama</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Durum</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v as ProgramStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(programStatusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              <Button onClick={handleSave}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader><TableRow><TableHead>Başlık</TableHead><TableHead>Kategori</TableHead><TableHead>Hedef Kitle</TableHead><TableHead>Durum</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {programs.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell><Badge variant="secondary">{programCategoryLabels[p.category]}</Badge></TableCell>
                <TableCell>{p.targetAudience}</TableCell>
                <TableCell><Badge variant={p.status === 'active' ? 'default' : 'outline'}>{programStatusLabels[p.status]}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
