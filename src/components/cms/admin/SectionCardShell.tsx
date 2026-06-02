import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { shouldShowActiveToggle, shouldShowSortOrder } from '@/lib/cms/adminConfig';
import type { PageSection } from '@/lib/cms/types';

type SectionCardShellProps = {
  title: string;
  section: PageSection;
  sectionIndex: number;
  onUpdateSection: (
    index: number,
    field: keyof PageSection,
    value: string | number | boolean | PageSection['items']
  ) => void;
  onSortOrderChange?: (sectionIndex: number, targetPosition: number) => void;
  onSave: () => void;
  children: React.ReactNode;
  showActiveToggle?: boolean;
};

export function SectionCardShell({
  title,
  section,
  sectionIndex,
  onUpdateSection,
  onSortOrderChange,
  onSave,
  children,
  showActiveToggle = true,
}: SectionCardShellProps) {
  const canToggle = showActiveToggle && shouldShowActiveToggle(section);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div className="space-y-3 min-w-0 flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          {shouldShowSortOrder(section) && (
            <div className="flex items-center gap-2">
              <Label htmlFor={`sort-${section.id}`} className="text-xs text-muted-foreground shrink-0">
                Sıra no <span className="text-primary/70">(otomatik kaydedilir)</span>
              </Label>
              <Input
                id={`sort-${section.id}`}
                type="number"
                min={0}
                className="h-8 w-20"
                value={section.sort_order}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') return;
                  const next = Math.max(1, Number(raw) || 1);
                  if (onSortOrderChange) {
                    onSortOrderChange(sectionIndex, next);
                  } else {
                    onUpdateSection(sectionIndex, 'sort_order', next);
                  }
                }}
              />
            </div>
          )}
        </div>
        {canToggle && (
          <div className="flex items-center gap-2 shrink-0">
            <Label htmlFor={`active-${section.id}`} className="text-sm">
              Aktif / Pasif
            </Label>
            <Switch
              id={`active-${section.id}`}
              checked={section.is_active}
              onCheckedChange={(checked) =>
                onUpdateSection(sectionIndex, 'is_active', checked)
              }
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/20 pt-4">
        <Button type="button" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
}
