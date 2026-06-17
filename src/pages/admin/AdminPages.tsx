import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AboutSectionsEditor } from '@/components/cms/admin/AboutSectionsEditor';
import { SectionEditor } from '@/components/cms/admin/SectionEditor';
import {
  PAGE_LABELS,
  PAGE_ORDER,
  getAdminSectionLabel,
  shouldShowSectionInAdmin,
} from '@/lib/cms/adminConfig';
import { reorderPageSections } from '@/lib/cms/sectionOrder';
import { compareSortOrder } from '@/lib/cms/sortOrder';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { pagesApi } from '@/lib/cms/pages';
import type { PageContent, PageSection, PageSectionItem } from '@/lib/cms/types';

const PAGE_OPTIONS = PAGE_ORDER.filter((key) => PAGE_LABELS[key]).map((key) => ({
  key,
  label: PAGE_LABELS[key],
}));

export default function AdminPages() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = searchParams.get('page') || 'programs';
  const [selectedPageKey, setSelectedPageKey] = useState(
    PAGE_LABELS[initialPage] ? initialPage : 'programs'
  );
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPage = async (pageKey: string) => {
    if (pageKey === 'about') {
      setPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await pagesApi.getAdminPage(pageKey);
    setPage(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPage(selectedPageKey);
  }, [selectedPageKey]);

  useEffect(() => {
    setSearchParams({ page: selectedPageKey }, { replace: true });
  }, [selectedPageKey, setSearchParams]);

  const handlePageChange = (pageKey: string) => {
    setSelectedPageKey(pageKey);
  };

  const updatePageField = (field: 'title' | 'subtitle', value: string) => {
    if (!page) return;
    setPage({ ...page, [field]: value });
  };

  const updateSectionField = (
    sectionIndex: number,
    field: keyof PageSection,
    value: string | number | boolean | PageSectionItem[] | null
  ) => {
    if (!page) return;
    const sections = [...page.sections];
    sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
    setPage({ ...page, sections });
  };

  const patchSectionItem = (
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<PageSectionItem>
  ) => {
    if (!page) return;
    const sections = [...page.sections];
    const items = [...(sections[sectionIndex].items || [])];
    items[itemIndex] = { ...items[itemIndex], ...patch };
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    setPage({ ...page, sections });
  };

  const handleSortOrderChange = async (sectionIndex: number, targetPosition: number) => {
    if (!page) return;
    const section = page.sections[sectionIndex];
    if (!section) return;

    const previousSections = page.sections;
    const reordered = reorderPageSections(
      page.sections,
      section.id,
      targetPosition,
      shouldShowSectionInAdmin
    );
    setPage({ ...page, sections: reordered });

    try {
      const toPersist = reordered.filter(shouldShowSectionInAdmin);
      await Promise.all(
        toPersist.map((s) => pagesApi.updateSection(s.id, { sort_order: s.sort_order }))
      );
    } catch (e) {
      setPage({ ...page, sections: previousSections });
      toast({
        variant: 'destructive',
        title: 'Sıralama kaydedilemedi',
        description: formatApiErrorMessage(e, 'Sıralama kaydedilemedi.'),
      });
      await loadPage(selectedPageKey);
    }
  };

  const updateItemField = (
    sectionIndex: number,
    itemIndex: number,
    field: keyof PageSectionItem,
    value: string
  ) => {
    if (!page) return;
    const sections = [...page.sections];
    const items = [...(sections[sectionIndex].items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    setPage({ ...page, sections });
  };

  const addItem = (sectionIndex: number, template?: Partial<PageSectionItem>) => {
    if (!page) return;
    const sections = [...page.sections];
    const items = [...(sections[sectionIndex].items || [])];
    items.push({ title: '', content: '', ...template });
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    setPage({ ...page, sections });
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    if (!page) return;
    const sections = [...page.sections];
    const items = [...(sections[sectionIndex].items || [])];
    items.splice(itemIndex, 1);
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    setPage({ ...page, sections });
  };

  const savePageMeta = async () => {
    if (!page) return;
    try {
      await pagesApi.updatePage(page.id, {
        title: page.title,
        subtitle: page.subtitle,
      });
      toast({ title: 'Sayfa bilgileri kaydedildi' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(e),
      });
    }
  };

  const saveSection = async (section: PageSection) => {
    try {
      await pagesApi.updateSection(section.id, {
        section_type: section.section_type,
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        items: section.items,
        sort_order: section.sort_order,
        is_active: section.is_active,
      });
      toast({ title: `${getAdminSectionLabel(section)} kaydedildi` });
      loadPage(selectedPageKey);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(e),
      });
    }
  };

  const visibleSections =
    page?.sections
      .filter((s) => shouldShowSectionInAdmin(s))
      .sort(compareSortOrder) ?? [];

  const showPageHeroCard =
    page && selectedPageKey !== 'home' && selectedPageKey !== 'footer';

  const selectedLabel = PAGE_OPTIONS.find((o) => o.key === selectedPageKey)?.label;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Sayfaları Düzenle</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ziyaretçilerin gördüğü metinleri ve bölümleri buradan güncelleyin.
          </p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <Label htmlFor="page-select" className="text-xs font-medium text-primary">
            Düzenlenecek sayfa
          </Label>
          <Select value={selectedPageKey} onValueChange={handlePageChange}>
            <SelectTrigger
              id="page-select"
              className="mt-1.5 h-9 border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90 [&>span]:text-primary-foreground"
            >
              <SelectValue placeholder="Sayfa seçin">{selectedLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.key} value={opt.key}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : selectedPageKey === 'about' ? (
        <AboutSectionsEditor />
      ) : !page ? (
        <p className="text-muted-foreground">
          Sayfa bulunamadı. Veritabanında içerik oluşturmak için sunucuda seed çalıştırın.
        </p>
      ) : (
        <>
          {showPageHeroCard && (
            <Card>
              <CardHeader>
                <CardTitle>Sayfa Üst Alanı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Başlık</Label>
                  <Input
                    value={page.title}
                    onChange={(e) => updatePageField('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Alt başlık / kısa açıklama</Label>
                  <Textarea
                    value={page.subtitle || ''}
                    onChange={(e) => updatePageField('subtitle', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t bg-muted/20 pt-4">
                <Button onClick={savePageMeta}>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </Button>
              </CardFooter>
            </Card>
          )}

          {visibleSections.map((section) => {
            const sectionIndex = page.sections.findIndex((s) => s.id === section.id);
            if (sectionIndex < 0) return null;

            return (
              <SectionEditor
                key={section.id}
                section={section}
                sectionIndex={sectionIndex}
                onUpdateSection={updateSectionField}
                onUpdateItem={updateItemField}
                onPatchSectionItem={patchSectionItem}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onSortOrderChange={
                  selectedPageKey === 'contact' ? undefined : handleSortOrderChange
                }
                onSave={saveSection}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
