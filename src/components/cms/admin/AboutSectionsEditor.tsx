import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FOUNDER_CV_DEFAULT } from '@/lib/aboutDefaults';
import { reorderPageSections } from '@/lib/cms/sectionOrder';
import { API_BASE_URL } from '@/lib/mock-api';
import { authApi } from '@/lib/api/auth';

type AboutItem = {
  number?: string;
  title: string;
  content: string;
};

type AboutSection = {
  id: string | number;
  section_key: string;
  title: string;
  content?: string | null;
  items?: AboutItem[] | null;
  sort_order: number;
  is_active: boolean;
};

const ABOUT_SECTION_LABELS: Record<string, string> = {
  founder: 'Kurucunun Mesajı',
  'founder-cv': 'Kurucunun Özgeçmişi',
  'what-is-felt': 'FELT Nedir?',
  manifesto: 'Manifesto',
  values: 'Değerler ve İlkeler',
  roadmap: 'Stratejik Yol Haritası',
  'research-areas': 'Araştırma Alanları',
};

const getAuthHeaders = () => {
  const currentUser = authApi.getCurrentUser();
  return {
    Authorization: `Bearer ${currentUser?.accessToken}`,
  };
};

export function AboutSectionsEditor() {
  const { toast } = useToast();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSections = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/about-sections`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setSections([]);
        return;
      }
      let loaded: AboutSection[] = [];
      if (Array.isArray(data)) loaded = data;
      else if (Array.isArray(data.items)) loaded = data.items;

      setSections(loaded);

      if (loaded.length > 0 && !loaded.some((s) => s.section_key === 'founder-cv')) {
        await createFounderCvSection(true);
      }
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const updateSectionField = (
    sectionIndex: number,
    field: keyof AboutSection,
    value: string | number | boolean
  ) => {
    const updated = [...sections];
    updated[sectionIndex] = { ...updated[sectionIndex], [field]: value };
    setSections(updated);
  };

  const updateItemField = (
    sectionIndex: number,
    itemIndex: number,
    field: keyof AboutItem,
    value: string
  ) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updated[sectionIndex].items = items;
    setSections(updated);
  };

  const canPersistSection = (section: AboutSection) =>
    section.id !== 0 && section.id !== '' && section.id != null;

  const persistSortOrders = async (list: AboutSection[]) => {
    const updates = list.filter(canPersistSection);
    const results = await Promise.all(
      updates.map((s) =>
        fetch(`${API_BASE_URL}/api/admin/about-sections/${s.id}`, {
          method: 'PUT',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: s.sort_order }),
        })
      )
    );
    if (results.some((res) => !res.ok)) {
      throw new Error('Sıralama kaydedilemedi');
    }
  };

  const handleSortOrderChange = async (sectionId: string | number, targetPosition: number) => {
    const previous = sections;
    const reordered = reorderPageSections(sections, sectionId, targetPosition);
    setSections(reordered);

    try {
      await persistSortOrders(reordered);
    } catch {
      setSections(previous);
      toast({
        title: 'Hata',
        description: 'Sıralama kaydedilemedi.',
        variant: 'destructive',
      });
      await loadSections();
    }
  };

  const addItem = (sectionIndex: number) => {
    const updated = [...sections];
    const section = updated[sectionIndex];
    const items = [...(section.items || [])];
    items.push({
      title: '',
      content: '',
    });
    section.items = items;
    setSections(updated);
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items || [])];
    items.splice(itemIndex, 1);
    updated[sectionIndex].items = items;
    setSections(updated);
  };

  const saveSection = async (section: AboutSection) => {
    const payload = {
      section_key: section.section_key,
      title: section.title,
      content: section.content || null,
      items: section.items || [],
      sort_order: Number(section.sort_order),
      is_active: section.is_active,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/about-sections/${section.id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast({ title: 'Hata', description: 'Bölüm güncellenemedi.', variant: 'destructive' });
        return;
      }

      toast({
        title: 'Kaydedildi',
        description: `${ABOUT_SECTION_LABELS[section.section_key] || section.title} güncellendi.`,
      });
      await loadSections();
    } catch {
      toast({ title: 'Hata', description: 'Bölüm güncellenemedi.', variant: 'destructive' });
    }
  };

  const createFounderCvSection = async (silent = false) => {
    const payload = {
      section_key: FOUNDER_CV_DEFAULT.section_key,
      title: FOUNDER_CV_DEFAULT.title,
      content: FOUNDER_CV_DEFAULT.content,
      items: [],
      sort_order: FOUNDER_CV_DEFAULT.sort_order,
      is_active: true,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/about-sections`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (!silent) {
          toast({
            title: 'Hata',
            description: 'Kurucunun Özgeçmişi bölümü oluşturulamadı.',
            variant: 'destructive',
          });
        }
        return;
      }

      if (!silent) {
        toast({ title: 'Oluşturuldu', description: 'Kurucunun Özgeçmişi bölümü eklendi.' });
      }
      await loadSections();
    } catch {
      if (!silent) {
        toast({
          title: 'Hata',
          description: 'Kurucunun Özgeçmişi bölümü oluşturulamadı.',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Yükleniyor...</p>;
  }

  const hasFounderCv = sections.some((s) => s.section_key === 'founder-cv');

  return (
    <div className="space-y-6">
      {!hasFounderCv && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Kurucunun Özgeçmişi eksik</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bu bölüm veritabanında yok. Tek tıkla ekleyip uzun metin düzenleyebilirsiniz.
              </p>
            </div>
            <Button type="button" onClick={() => createFounderCvSection()}>
              Kurucunun Özgeçmişi Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {[...sections]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => {
        const sectionIndex = sections.findIndex((s) => s.id === section.id);
        if (sectionIndex < 0) return null;
        const isCvSection = section.section_key === 'founder-cv';
        const sectionLabel =
          ABOUT_SECTION_LABELS[section.section_key] || section.section_key;

        return (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-3">
                <CardTitle className="text-lg">{sectionLabel}</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`about-sort-${section.id}`} className="text-xs text-muted-foreground">
                    Sıra no <span className="text-primary/70">(otomatik kaydedilir)</span>
                  </Label>
                  <Input
                    id={`about-sort-${section.id}`}
                    type="number"
                    min={0}
                    className="h-8 w-20"
                    value={section.sort_order}
                    onChange={(e) =>
                      handleSortOrderChange(
                        section.id,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Label htmlFor={`about-active-${section.id}`} className="text-sm">
                  Aktif
                </Label>
                <Switch
                  id={`about-active-${section.id}`}
                  checked={section.is_active}
                  onCheckedChange={(checked) =>
                    updateSectionField(sectionIndex, 'is_active', checked)
                  }
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label>Sayfada görünen başlık</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionField(sectionIndex, 'title', e.target.value)}
                />
              </div>

              {isCvSection ? (
                <div className="grid gap-2">
                  <Label>Uzun metin özgeçmiş</Label>
                  <p className="text-xs text-muted-foreground">
                    Paragrafları boş satırla ayırın. Hakkında sayfasında tam genişlikte gösterilir.
                  </p>
                  <Textarea
                    rows={18}
                    className="min-h-[320px] font-normal leading-relaxed"
                    value={section.content || ''}
                    onChange={(e) =>
                      updateSectionField(sectionIndex, 'content', e.target.value)
                    }
                    placeholder="Kurucunun akademik ve profesyonel geçmişi..."
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Alt Başlıklar / İçerikler</Label>
                    <Button type="button" variant="outline" onClick={() => addItem(sectionIndex)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Alt İçerik Ekle
                    </Button>
                  </div>

                  {(section.items || []).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border rounded-lg p-4 space-y-3 bg-muted/30"
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-1">
                          <Label>Alt Başlık</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              updateItemField(sectionIndex, itemIndex, 'title', e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8 shrink-0"
                          onClick={() => removeItem(sectionIndex, itemIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Label>İçerik</Label>
                        <Textarea
                          rows={4}
                          value={item.content}
                          onChange={(e) =>
                            updateItemField(sectionIndex, itemIndex, 'content', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end border-t bg-muted/20 pt-4">
              <Button type="button" onClick={() => saveSection(section)}>
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
