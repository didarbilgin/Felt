import { useEffect, useMemo, useState } from 'react';
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
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { articlesApi } from '@/lib/api/articles';
import { buildFormCategoryOptions } from '@/lib/cms/categoryTabs';
import { pagesApi } from '@/lib/cms/pages';
import { Article, ArticleStatus, Language, articleTypeLabels, articleStatusLabels } from '@/lib/types';

const initialForm = {
  title: '',
  type: 'article',
  year: new Date().getFullYear(),
  language: 'TR' as Language,
  source: '',
  tags: '',
  abstract: '',
  detailDescription: '',
  content: '',
  status: 'draft' as ArticleStatus,
};

export default function AdminArticles() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(initialForm);
  const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);

  const loadCategories = async () => {
    const page = await pagesApi.getAdminPage('research');
    const options = buildFormCategoryOptions(page?.sections, 'article-tabs');
    if (options.length > 0) setTypeOptions(options);
  };

  const typeSelectOptions = useMemo(() => {
    if (typeOptions.length > 0) return typeOptions;
    return Object.entries(articleTypeLabels).map(([value, label]) => ({ value, label }));
  }, [typeOptions]);

  const resolveTypeLabel = (type: string) =>
    typeSelectOptions.find((o) => o.value === type)?.label ||
    articleTypeLabels[type as keyof typeof articleTypeLabels] ||
    type;

  const load = async () => {
    try {
      setArticles(await articlesApi.getAll());
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Liste yüklenemedi',
        description: formatApiErrorMessage(e, 'Liste yüklenemedi.'),
      });
      setArticles([]);
    }
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      ...initialForm,
      type: typeSelectOptions[0]?.value || 'article',
      year: new Date().getFullYear(),
    });
  };

  const handleSave = async () => {
    const data = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await articlesApi.update(editing.id, data);
      } else {
        await articlesApi.create(data);
      }
      toast({ title: editing ? 'Güncellendi' : 'Oluşturuldu' });
      setOpen(false);
      setEditing(null);
      resetForm();
      load();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(e),
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditing(article);
    setForm({
      title: article.title,
      type: article.type,
      year: article.year,
      language: article.language,
      source: article.source || '',
      tags: article.tags.join(', '),
      abstract: article.abstract || '',
      detailDescription: article.detailDescription || '',
      content: article.content || '',
      status: article.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await articlesApi.delete(id);
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

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      setEditing(null);
      resetForm();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Makaleler</h1>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ekle
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Düzenle' : 'Yeni Makale'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Başlık</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Tür</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                  >
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
                  <Label>Yıl</Label>
                  <Input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Dil</Label>
                  <Select
                    value={form.language}
                    onValueChange={(value) => setForm({ ...form, language: value as Language })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TR">Türkçe</SelectItem>
                      <SelectItem value="EN">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Kaynak</Label>
                <Input
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Etiketler</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="virgülle ayırın"
                />
              </div>

              <div className="grid gap-2">
                <Label>Özet (kartta görünür)</Label>
                <Textarea
                  value={form.abstract}
                  onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label>Ek Detay (Modal) — İsteğe Bağlı</Label>
                <Textarea
                  value={form.detailDescription}
                  onChange={(e) => setForm({ ...form, detailDescription: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label>İçerik</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  placeholder="Tam metin"
                />
              </div>

              <div className="grid gap-2">
                <Label>Durum</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value as ArticleStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(articleStatusLabels).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
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

      <div className="admin-table-shell">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Yıl</TableHead>
              <TableHead>Dil</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{resolveTypeLabel(article.type)}</Badge>
                </TableCell>
                <TableCell>{article.year}</TableCell>
                <TableCell>{article.language}</TableCell>
                <TableCell>
                  <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                    {articleStatusLabels[article.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(article)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(article.id)}>
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