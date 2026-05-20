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

type BlogFormState = {
  title: string;
  category: BlogCategory;
  content: string;
  excerpt: string;
  publishDate: string;
  status: BlogStatus;
};

const emptyForm = (): BlogFormState => ({
  title: '',
  category: 'essay',
  content: '',
  excerpt: '',
  publishDate: '',
  status: 'draft',
});

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm());

  const load = async () => {
    setPosts(await blogApi.getAll());
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm());
  };

  const handleSave = async () => {
    const data = {
      ...form,
      publishDate: new Date(form.publishDate),
    };

    if (editing) {
      await blogApi.update(editing.id, data);
    } else {
      await blogApi.create(data);
    }

    toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
    setOpen(false);
    setEditing(null);
    resetForm();
    load();
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      category: post.category,
      content: post.content,
      excerpt: post.excerpt,
      publishDate: post.publishDate.toISOString().split('T')[0],
      status: post.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await blogApi.delete(id);
    toast({ title: 'Silindi' });
    load();
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      setEditing(null);
      resetForm();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold">Blog Yazıları</h1>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ekle
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Düzenle' : 'Yeni Yazı'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Başlık</Label>
                <Input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value as BlogCategory })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(blogCategoryLabels).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Yayın Tarihi</Label>
                  <Input
                    type="date"
                    value={form.publishDate}
                    onChange={(event) =>
                      setForm({ ...form, publishDate: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Durum</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value as BlogStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(blogStatusLabels).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Özet</Label>
                <Textarea
                  value={form.excerpt}
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>İçerik</Label>
                <Textarea
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  rows={8}
                />
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
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{blogCategoryLabels[post.category]}</Badge>
                </TableCell>
                <TableCell>{post.publishDate.toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>
                  <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                    {blogStatusLabels[post.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)}>
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