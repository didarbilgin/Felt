import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LABEL_EDITOR_CONFIG,
  getEditableLabelState,
  syncEditableLabelItems,
} from '@/lib/cms/displayLabels';
import { getAdminSectionLabel } from '@/lib/cms/adminConfig';
import type { PageSection, PageSectionItem } from '@/lib/cms/types';
import { SectionCardShell } from './SectionCardShell';

type DisplayLabelsEditorProps = {
  section: PageSection;
  sectionIndex: number;
  onUpdateSection: (
    index: number,
    field: keyof PageSection,
    value: string | number | boolean | PageSectionItem[] | null
  ) => void;
  onSortOrderChange?: (sectionIndex: number, targetPosition: number) => void;
  onSave: (section: PageSection) => void;
};

export function DisplayLabelsEditor({
  section,
  sectionIndex,
  onUpdateSection,
  onSortOrderChange,
  onSave,
}: DisplayLabelsEditorProps) {
  const config =
    LABEL_EDITOR_CONFIG[section.section_key] ?? {
      title: 'Kategoriler',
      description: '',
      addButtonLabel: 'Kategori Ekle',
      pinnedKeys: [],
    };

  const persistedSnapshot = useMemo(() => {
    const persisted = getEditableLabelState(section.items, config.pinnedKeys);
    return JSON.stringify(persisted);
  }, [section.items, config.pinnedKeys]);

  const [keys, setKeys] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const next = getEditableLabelState(section.items, config.pinnedKeys);
    setKeys(next.keys);
    setLabels(next.labels);
  }, [section.id, persistedSnapshot, config.pinnedKeys]);

  const updateLabel = (index: number, value: string) => {
    const nextLabels = [...labels];
    nextLabels[index] = value;
    setLabels(nextLabels);
  };

  const removeRow = (index: number) => {
    setKeys(keys.filter((_, i) => i !== index));
    setLabels(labels.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setKeys([...keys, '']);
    setLabels([...labels, '']);
  };

  const save = () => {
    const syncedItems = syncEditableLabelItems(
      section.items,
      keys,
      labels,
      config.pinnedKeys
    );
    onUpdateSection(sectionIndex, 'items', syncedItems);
    onSave({
      ...section,
      items: syncedItems,
    });
  };

  return (
    <SectionCardShell
      title={getAdminSectionLabel(section)}
      section={section}
      sectionIndex={sectionIndex}
      onUpdateSection={onUpdateSection}
      onSave={save}
      onSortOrderChange={onSortOrderChange}
      showActiveToggle={false}
    >
      {config.description ? (
        <p className="text-sm text-muted-foreground">{config.description}</p>
      ) : null}
      {labels.map((label, idx) => (
        <div key={`row-${idx}`} className="flex gap-2 items-center">
          <Input
            className="flex-1"
            value={label}
            placeholder="Örn. Raporlar"
            aria-label={`Kategori ${idx + 1}`}
            onChange={(e) => updateLabel(idx, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive shrink-0"
            onClick={() => removeRow(idx)}
            aria-label="Kategoriyi sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" />
        {config.addButtonLabel}
      </Button>
    </SectionCardShell>
  );
}
