import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PageSection, PageSectionItem } from '@/lib/cms/types';
import { SectionCardShell } from './SectionCardShell';

type TabLabelsEditorProps = {
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

type TabRow = { key: string; label: string };

function itemsToRows(items: PageSectionItem[]): TabRow[] {
  return items.map((item) => ({
    key: item.title || '',
    label: item.content || item.title || '',
  }));
}

function rowsToItems(rows: TabRow[]): PageSectionItem[] {
  return rows
    .filter((row) => row.key.trim())
    .map((row) => ({
      title: row.key.trim(),
      content: row.label.trim() || row.key.trim(),
    }));
}

export function TabLabelsEditor({
  section,
  sectionIndex,
  displayName,
  onUpdateSection,
  onSave,
}: TabLabelsEditorProps) {
  const persistedRows = itemsToRows(section.items || []);
  const [rows, setRows] = useState<TabRow[]>(persistedRows);

  useEffect(() => {
    setRows(persistedRows);
  }, [section.id, persistedRows.map((r) => `${r.key}:${r.label}`).join('|')]);

  const commitRows = (next: TabRow[]) => {
    setRows(next);
    onUpdateSection(sectionIndex, 'items', rowsToItems(next));
  };

  const updateLabel = (index: number, label: string) => {
    const next = [...rows];
    next[index] = { ...next[index], label };
    commitRows(next);
  };

  return (
    <SectionCardShell
      title={displayName}
      section={section}
      sectionIndex={sectionIndex}
      onUpdateSection={onUpdateSection}
      onSave={() => onSave({ ...section, items: rowsToItems(rows) })}
      showActiveToggle={false}
    >
      <p className="text-sm text-muted-foreground">
        Sekme veya filtrede görünen etiketleri düzenleyin.
      </p>
      {rows.map((row, idx) => (
        <div key={row.key || idx} className="grid gap-1">
          <Label className="text-xs text-muted-foreground">Sekme {idx + 1}</Label>
          <Input
            value={row.label}
            onChange={(e) => updateLabel(idx, e.target.value)}
            placeholder="Görünen etiket"
          />
        </div>
      ))}
    </SectionCardShell>
  );
}
