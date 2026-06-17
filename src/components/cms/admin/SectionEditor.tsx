import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getAdminSectionLabel,
  getSectionEditorVariant,
} from '@/lib/cms/adminConfig';
import {
  DEFAULT_LAB_PROJECT_TAGLINE,
  getLabProjects,
  labProjectsToItems,
  type LabProject,
} from '@/lib/cms/pages';
import type { PageSection, PageSectionItem } from '@/lib/cms/types';
import { AboutSectionsEditor } from './AboutSectionsEditor';
import { DisplayLabelsEditor } from './DisplayLabelsEditor';
import { SectionCardShell } from './SectionCardShell';

type SectionEditorProps = {
  section: PageSection;
  sectionIndex: number;
  onUpdateSection: (
    index: number,
    field: keyof PageSection,
    value: string | number | boolean | PageSectionItem[] | null
  ) => void;
  onUpdateItem: (sectionIndex: number, itemIndex: number, field: keyof PageSectionItem, value: string) => void;
  onPatchSectionItem?: (
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<PageSectionItem>
  ) => void;
  onAddItem: (sectionIndex: number, template?: Partial<PageSectionItem>) => void;
  onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
  onSortOrderChange?: (sectionIndex: number, targetPosition: number) => void;
  onSave: (section: PageSection) => void;
};

export function SectionEditor(props: SectionEditorProps) {
  const {
    section,
    sectionIndex,
    onUpdateSection,
    onUpdateItem,
    onPatchSectionItem,
    onAddItem,
    onRemoveItem,
    onSortOrderChange,
    onSave,
  } = props;
  const variant = getSectionEditorVariant(section);
  const adminLabel = getAdminSectionLabel(section);
  const handleSave = () => onSave(section);

  if (variant === 'display-labels') {
    return (
      <DisplayLabelsEditor
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSortOrderChange={onSortOrderChange}
        onSave={onSave}
      />
    );
  }

  if (variant === 'section-heading') {
    const isContactPage = section.page_key === 'contact';

    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>{isContactPage ? 'Sayfada görünen başlık' : 'Başlık / rozet metni'}</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>{isContactPage ? 'Açıklama' : 'Alt başlık / açıklama'}</Label>
          <Textarea
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
            rows={isContactPage ? 2 : 3}
          />
        </div>
        {section.section_key === 'contact-sidebar-newsletter' ? (
          <p className="text-sm text-muted-foreground">
            Üstteki &quot;Bülten&quot; rozeti sabittir; yalnızca başlık ve açıklama düzenlenir.
          </p>
        ) : null}
      </SectionCardShell>
    );
  }

  if (variant === 'section-title-only') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Sayfada görünen başlık</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
            placeholder="Sosyal Medya"
          />
        </div>
      </SectionCardShell>
    );
  }

  if (variant === 'text-block') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Sayfada görünen başlık</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>Alt başlık</Label>
          <Textarea
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
            rows={2}
          />
        </div>
        {section.content !== null &&
          section.content !== undefined &&
          section.section_key !== 'newsletter' && (
          <div>
            <Label>Ek metin</Label>
            <Textarea
              className="mt-1"
              value={section.content || ''}
              onChange={(e) => onUpdateSection(sectionIndex, 'content', e.target.value)}
              rows={2}
            />
          </div>
        )}
      </SectionCardShell>
    );
  }

  if (variant === 'page-hero') {
    return null;
  }

  if (variant === 'content-only') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <Label>Metin / İçerik</Label>
        <Textarea
          className="mt-2"
          value={section.content || ''}
          onChange={(e) => onUpdateSection(sectionIndex, 'content', e.target.value)}
          rows={section.section_key === 'manifesto' ? 4 : 6}
        />
        {section.section_key === 'manifesto' && (
          <div className="mt-4">
            <Label>Alt açıklama (isteğe bağlı)</Label>
            <Textarea
              className="mt-2"
              value={section.subtitle || ''}
              onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
              rows={2}
            />
          </div>
        )}
      </SectionCardShell>
    );
  }

  if (variant === 'ecosystem-items') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <p className="text-sm text-muted-foreground">
          Ana sayfadaki ekosistem bölümünde hub kartlarının altında gösterilen kısa kartlar.
        </p>
        {(section.items || []).map((item, itemIndex) => (
          <div key={itemIndex} className="flex gap-2">
            <Input
              value={item.title || ''}
              placeholder="Kart başlığı"
              onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive shrink-0"
              onClick={() => onRemoveItem(sectionIndex, itemIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onAddItem(sectionIndex, { title: '' })}>
          <Plus className="mr-2 h-4 w-4" />
          Kart Ekle
        </Button>
      </SectionCardShell>
    );
  }

  if (variant === 'lab-cards') {
    const defaultTagline = section.subtitle?.trim() || DEFAULT_LAB_PROJECT_TAGLINE;

    const setLabProjects = (itemIndex: number, projects: LabProject[]) => {
      if (!onPatchSectionItem) return;
      onPatchSectionItem(sectionIndex, itemIndex, {
        items: labProjectsToItems(projects),
        subtitle: projects.map((p) => p.name).join('\n'),
      });
    };

    const updateLabProject = (
      itemIndex: number,
      projectIndex: number,
      field: keyof LabProject,
      value: string
    ) => {
      const item = section.items?.[itemIndex];
      if (!item) return;
      const projects = getLabProjects(item, defaultTagline, { includeEmptyNames: true });
      projects[projectIndex] = { ...projects[projectIndex], [field]: value };
      setLabProjects(itemIndex, projects);
    };

    const addLabProject = (itemIndex: number) => {
      const item = section.items?.[itemIndex];
      if (!item) return;
      const projects = getLabProjects(item, defaultTagline, { includeEmptyNames: true });
      projects.push({ name: '', tagline: defaultTagline });
      setLabProjects(itemIndex, projects);
    };

    const removeLabProject = (itemIndex: number, projectIndex: number) => {
      const item = section.items?.[itemIndex];
      if (!item) return;
      const projects = getLabProjects(item, defaultTagline, { includeEmptyNames: true });
      projects.splice(projectIndex, 1);
      setLabProjects(itemIndex, projects);
    };

    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Varsayılan proje alt yazısı</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Kartlarda görünen &quot;Prototip / araştırma&quot; metni. Proje satırında boş bırakılırsa
            bu metin kullanılır.
          </p>
          <Input
            className="mt-1"
            value={section.subtitle || ''}
            placeholder={DEFAULT_LAB_PROJECT_TAGLINE}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
          />
        </div>

        {(section.items || []).map((item, itemIndex) => {
          const projects = getLabProjects(item, defaultTagline, { includeEmptyNames: true });

          return (
            <div key={itemIndex} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Kart {itemIndex + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onRemoveItem(sectionIndex, itemIndex)}
                >
                  Sil
                </Button>
              </div>
              <div>
                <Label>Başlık</Label>
                <Input
                  className="mt-1"
                  value={item.title || ''}
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label>Açıklama</Label>
                <Textarea
                  className="mt-1"
                  value={item.content || ''}
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'content', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-3">
                <Label>Projeler</Label>
                {projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-start border border-border/60 rounded-md p-3 bg-background"
                  >
                    <div>
                      <Label className="text-xs text-muted-foreground">Proje adı</Label>
                      <Input
                        className="mt-1"
                        value={project.name}
                        onChange={(e) =>
                          updateLabProject(itemIndex, projectIndex, 'name', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Alt yazı</Label>
                      <Input
                        className="mt-1"
                        value={project.tagline}
                        placeholder={defaultTagline}
                        onChange={(e) =>
                          updateLabProject(itemIndex, projectIndex, 'tagline', e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive sm:mt-6 shrink-0"
                      onClick={() => removeLabProject(itemIndex, projectIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLabProject(itemIndex)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Proje Ekle
                </Button>
              </div>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddItem(sectionIndex, { title: '', content: '', items: [] })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Kart Ekle
        </Button>
      </SectionCardShell>
    );
  }

  if (variant === 'cta') {
    const showBulletItems =
      section.section_key === 'network-cta' || (section.items?.length ?? 0) > 0;

    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Başlık</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>Açıklama</Label>
          <Textarea
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
            rows={3}
          />
        </div>
        {showBulletItems ? (
          <div className="space-y-3 border-t pt-4">
            <Label>Çağrı maddeleri</Label>
            {(section.items || []).map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2">
                <Input
                  className="flex-1"
                  value={item.title || ''}
                  placeholder="Madde metni"
                  onChange={(e) =>
                    onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => onRemoveItem(sectionIndex, itemIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddItem(sectionIndex, { title: '' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Madde Ekle
            </Button>
          </div>
        ) : null}
      </SectionCardShell>
    );
  }

  if (variant === 'cards') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Sayfada görünen başlık</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>Bölüm açıklaması</Label>
          <Textarea
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
            rows={2}
          />
        </div>
        {(section.items || []).map((item, itemIndex) => (
          <div key={itemIndex} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Öğe {itemIndex + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onRemoveItem(sectionIndex, itemIndex)}
              >
                Sil
              </Button>
            </div>
            <div>
              <Label>Başlık</Label>
              <Input
                className="mt-1"
                value={item.title || ''}
                onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
              />
            </div>
            {section.section_key === 'highlights' || item.subtitle != null ? (
              <div>
                <Label>Alt başlık</Label>
                <Input
                  className="mt-1"
                  value={item.subtitle || ''}
                  onChange={(e) =>
                    onUpdateItem(sectionIndex, itemIndex, 'subtitle', e.target.value)
                  }
                />
              </div>
            ) : null}
            <div>
              <Label>Açıklama</Label>
              <Textarea
                className="mt-1"
                value={item.content || ''}
                onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'content', e.target.value)}
                rows={2}
              />
            </div>
            {Array.isArray(item.items) && section.section_key !== 'contributor-types' ? (
              <div>
                <Label>Liste maddeleri (her satır bir madde)</Label>
                <Textarea
                  className="mt-1"
                  value={(item.items as string[]).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    const updated = [...(section.items || [])];
                    updated[itemIndex] = { ...updated[itemIndex], items: lines };
                    onUpdateSection(sectionIndex, 'items', updated);
                  }}
                  rows={4}
                />
              </div>
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onAddItem(
              sectionIndex,
              section.section_key === 'contributor-types'
                ? { title: '', content: '' }
                : { title: '', content: '', items: [] }
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Öğe Ekle
        </Button>
      </SectionCardShell>
    );
  }

  if (variant === 'contact-items') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Kutucuk başlığı</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
            placeholder="İletişim Bilgileri"
          />
        </div>
        <p className="text-sm text-muted-foreground border-t pt-3">
          E-posta, telefon ve adres gibi satırlar aşağıda düzenlenir.
        </p>
        {(section.items || []).map((item, itemIndex) => (
          <div key={itemIndex} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Satır {itemIndex + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onRemoveItem(sectionIndex, itemIndex)}
              >
                Sil
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Etiket</Label>
                <Input
                  className="mt-1"
                  value={item.title || ''}
                  placeholder="E-posta, Telefon, Adres…"
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label>Değer</Label>
                <Input
                  className="mt-1"
                  value={item.content || ''}
                  placeholder="Görünecek bilgi"
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'content', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddItem(sectionIndex, { title: '', content: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Satır Ekle
        </Button>
      </SectionCardShell>
    );
  }

  if (variant === 'home-hero') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
        showActiveToggle={false}
      >
        <div>
          <Label>Üst satır</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>Ana başlık</Label>
          <Input
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
          />
        </div>
        <div>
          <Label>Alt metinler (her satır ayrı paragraf)</Label>
          <Textarea
            className="mt-1"
            value={section.content || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'content', e.target.value)}
            rows={5}
          />
        </div>
      </SectionCardShell>
    );
  }

  if (variant === 'hubs-ecosystem') {
    return (
      <SectionCardShell
        title={adminLabel}
        section={section}
        sectionIndex={sectionIndex}
        onUpdateSection={onUpdateSection}
        onSave={handleSave}
        onSortOrderChange={onSortOrderChange}
      >
        <div>
          <Label>Sayfada görünen başlık</Label>
          <Input
            className="mt-1"
            value={section.title || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label>Giriş metni</Label>
          <Textarea
            className="mt-1"
            value={section.subtitle || ''}
            onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
            rows={4}
          />
        </div>
        <p className="text-sm text-muted-foreground border-t pt-3">
          Hub / Circle / Lab kartları aşağıda düzenlenir.
        </p>
        {(section.items || []).map((item, itemIndex) => (
          <div key={itemIndex} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kart {itemIndex + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onRemoveItem(sectionIndex, itemIndex)}
              >
                Sil
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Ad</Label>
                <Input
                  className="mt-1"
                  value={item.title || ''}
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Tür (Hub, Lab…)</Label>
                <Input
                  className="mt-1"
                  value={item.subtitle || ''}
                  onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Açıklama</Label>
              <Textarea
                className="mt-1"
                value={item.content || ''}
                onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'content', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddItem(sectionIndex, { title: '', subtitle: '', content: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Hub Kartı Ekle
        </Button>
      </SectionCardShell>
    );
  }

  const showSectionFields = variant !== 'footer-brand';
  const showItems = (section.items?.length ?? 0) > 0;

  return (
    <SectionCardShell
      title={adminLabel}
      section={section}
      sectionIndex={sectionIndex}
      onUpdateSection={onUpdateSection}
      onSave={handleSave}
      onSortOrderChange={onSortOrderChange}
    >
      {showSectionFields && (
        <>
          <div>
            <Label>Sayfada görünen başlık</Label>
            <Input
              className="mt-1"
              value={section.title || ''}
              onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
            />
          </div>
          {section.subtitle !== null && section.section_key !== 'copyright' && (
            <div>
              <Label>Açıklama</Label>
              <Textarea
                className="mt-1"
                value={section.subtitle || ''}
                onChange={(e) => onUpdateSection(sectionIndex, 'subtitle', e.target.value)}
                rows={2}
              />
            </div>
          )}
          <div>
            <Label>İçerik</Label>
            <Textarea
              className="mt-1"
              value={section.content || ''}
              onChange={(e) => onUpdateSection(sectionIndex, 'content', e.target.value)}
              rows={3}
            />
          </div>
        </>
      )}
      {showItems && (
        <div className="space-y-3 border-t pt-4">
          <Label>Liste öğeleri</Label>
          {(section.items || []).map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <Input
                className="flex-1"
                value={item.title || ''}
                onChange={(e) => onUpdateItem(sectionIndex, itemIndex, 'title', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0"
                onClick={() => onRemoveItem(sectionIndex, itemIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => onAddItem(sectionIndex, { title: '' })}>
            <Plus className="mr-2 h-4 w-4" />
            Öğe Ekle
          </Button>
        </div>
      )}
    </SectionCardShell>
  );
}
