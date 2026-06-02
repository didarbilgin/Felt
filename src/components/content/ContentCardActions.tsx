import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasExtraDetail, normalizeExternalLink } from '@/lib/contentExtra';

type ContentCardActionsProps = {
  extraDetail?: string | null;
  externalLink?: string | null;
  applyLabel?: string;
  canApply?: boolean;
  onDetail?: () => void;
  onApply?: () => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
};

export function ContentCardActions({
  extraDetail,
  externalLink,
  applyLabel = 'Başvur',
  canApply = true,
  onDetail,
  onApply,
  className = '',
  size = 'sm',
}: ContentCardActionsProps) {
  const linkIconClass = size === 'lg' ? 'ml-2 h-4 w-4' : 'ml-1.5 h-3.5 w-3.5';
  const showDetail = hasExtraDetail(extraDetail);
  const href = normalizeExternalLink(externalLink);

  if (!showDetail && !canApply && !href) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showDetail ? (
        <Button type="button" size={size} variant="outline" onClick={onDetail}>
          Detay
        </Button>
      ) : null}
      {canApply && onApply ? (
        <Button type="button" size={size} onClick={onApply}>
          {applyLabel}
        </Button>
      ) : null}
      {href ? (
        <Button asChild size={size} variant="outline">
          <a href={href} target="_blank" rel="noopener noreferrer">
            Dış bağlantı
            <ExternalLink className={linkIconClass} />
          </a>
        </Button>
      ) : null}
    </div>
  );
}
