import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { syncProgramTabItems } from '@/lib/cms/programCategories';
import type { PageSection, PageSectionItem } from '@/lib/cms/types';
import { SectionCardShell } from './SectionCardShell';

type ProgramCategoriesEditorProps = {
  section: PageSection;
  sectionIndex: number;
  displayName: string;
  onUpdateSection: (
    index: number,
    field: keyof PageSection,
    value: string | number | boolean | PageSectionItem[] | null
  ) => void;
  onSave: (section: PageSection) => void;
};

export function ProgramCategoriesEditor({
  section,
  sectionIndex,
  displayName,
  onUpdateSection,
  onSave,
}: ProgramCategoriesEditorProps) {
  const persistedLabels = (section.items || [])
    .filter((i) => i.title !== 'all')
    .map((i) => i.content || '');

  const [rows, setRows] = useState<string[]>(persistedLabels);

  useEffect(() => {
    setRows(persistedLabels);
  }, [section.id, persistedLabels.join('\x00')]);

  const commitRows = (nextRows: string[]) => {
    setRows(nextRows);
    onUpdateSection(
      sectionIndex,
      'items',
      syncProgramTabItems(section.items || [], nextRows)
    );
  };

  const updateRow = (index: number, value: string) => {
    const next = [...rows];
    next[index] = value;
    commitRows(next);
  };

  const removeRow = (index: number) => {
    commitRows(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setRows([...rows, '']);
  };

  return (
    <SectionCardShell
      title={displayName}
      section={section}
      sectionIndex={sectionIndex}
      onUpdateSection={onUpdateSection}
      onSave={() => onSave({ ...section, items: syncProgramTabItems(section.items || [], rows) })}
      showActiveToggle={false}
    >
      <p className="text-sm text-muted-foreground">
        Programlar sayfasındaki filtre sekmeleri ve yeni program eklerken kullanılan kategoriler.
        Yalnızca görünen kategori adını girin.
      </p>
      {rows.map((label, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Input
            value={label}
            placeholder="Kategori adı"
            onChange={(e) => updateRow(idx, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive shrink-0"
            onClick={() => removeRow(idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" />
        Kategori Ekle
      </Button>
    </SectionCardShell>
  );
}
