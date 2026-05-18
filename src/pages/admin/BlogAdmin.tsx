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
import { blogApi } from '@/lib/api/blog';
import { BlogPost, BlogCategory, BlogStatus, blogCategoryLabels, blogStatusLabels } from '@/lib/types';

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', category: 'essay' as BlogCategory, content: '', excerpt: '', publishDate: '', status: 'draft' as BlogStatus });

  const load = async () => { setPosts(await blogApi.getAll()); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const data = { ...form, publishDate: new Date(form.publishDate) };
    if (editing) await blogApi.update(editing.id, data);
    else await blogApi.create(data);
    toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
    setOpen(false); setEditing(null); load();
    setForm({ title: '', slug: '', category: 'essay', content: '', excerpt: '', publishDate: '', status: 'draft' as BlogStatus });
  };

  const handleEdit = (p: BlogPost) => { setEditing(p); setForm({ ...p, publishDate: p.publishDate.toISOString().split('T')[0] }); setOpen(true); };
  const handleDelete = async (id: string) => { await blogApi.delete(id); toast({ title: 'Silindi' }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Blog Yazıları</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Yeni Ekle</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Düzenle' : 'Yeni Yazı'}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Başlık</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                <div className="grid gap-2"><Label>Kategori</Label><Select value={form.category} onValueChange={v => setForm({ ...form, category: v as BlogCategory })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(blogCategoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Yayın Tarihi</Label><Input type="date" value={form.publishDate} onChange={e => setForm({ ...form, publishDate: e.target.value })} /></div>
                <div className="grid gap-2"><Label>Durum</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v as BlogStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(blogStatusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid gap-2"><Label>Özet</Label><Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
              <div className="grid gap-2"><Label>İçerik</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} /></div>
              <Button onClick={handleSave}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader><TableRow><TableHead>Başlık</TableHead><TableHead>Kategori</TableHead><TableHead>Tarih</TableHead><TableHead>Durum</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {posts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell><Badge variant="secondary">{blogCategoryLabels[p.category]}</Badge></TableCell>
                <TableCell>{p.publishDate.toLocaleDateString('tr-TR')}</TableCell>
                <TableCell><Badge variant={p.status === 'published' ? 'default' : 'outline'}>{blogStatusLabels[p.status]}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
