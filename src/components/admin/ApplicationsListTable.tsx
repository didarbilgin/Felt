import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Application, ApplicationStatus } from '@/lib/types';
import { applicationSourceTypeLabels, applicationStatusLabels } from '@/lib/types';

type ApplicationsListTableProps = {
  items: Application[];
  showSource?: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
};

export function ApplicationsListTable({
  items,
  showSource = false,
  onStatusChange,
}: ApplicationsListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showSource ? <TableHead>Kaynak</TableHead> : null}
          <TableHead>Ad Soyad</TableHead>
          <TableHead>E-posta</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Kurum</TableHead>
          <TableHead>Ünvan</TableHead>
          <TableHead>Mesaj</TableHead>
          <TableHead>Başvuru tarihi</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            {showSource ? (
              <TableCell className="align-top text-sm min-w-[140px]">
                <Badge variant="outline" className="mb-1">
                  {applicationSourceTypeLabels[item.sourceType]}
                </Badge>
                <div className="text-muted-foreground">{item.sourceTitle || '—'}</div>
              </TableCell>
            ) : null}
            <TableCell className="align-top font-medium whitespace-nowrap">
              {item.fullName}
            </TableCell>
            <TableCell className="align-top text-sm">{item.email}</TableCell>
            <TableCell className="align-top text-sm whitespace-nowrap">{item.phone}</TableCell>
            <TableCell className="align-top text-sm">{item.organization || '—'}</TableCell>
            <TableCell className="align-top text-sm">{item.title || '—'}</TableCell>
            <TableCell className="align-top text-sm max-w-[200px] whitespace-pre-wrap">
              {item.message || '—'}
            </TableCell>
            <TableCell className="align-top text-sm whitespace-nowrap">
              {item.createdAt.toLocaleString('tr-TR')}
            </TableCell>
            <TableCell className="align-top min-w-[140px]">
              <Select
                value={item.status}
                onValueChange={(v) => onStatusChange(item.id, v as ApplicationStatus)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(applicationStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
