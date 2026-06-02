import { Instagram, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOCIAL_LINK_ITEMS, type SocialLinkId } from '@/lib/socialLinks';

const ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
} satisfies Record<SocialLinkId, typeof Linkedin>;

type SocialLinksProps = {
  variant?: 'footer' | 'card';
  className?: string;
};

export function SocialLinks({ variant = 'footer', className }: SocialLinksProps) {
  const linkClass =
    variant === 'footer'
      ? 'w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors'
      : 'w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors';

  return (
    <div className={cn('flex gap-3', variant === 'footer' && 'gap-4', className)}>
      {SOCIAL_LINK_ITEMS.map((item) => {
        const Icon = ICONS[item.id];
        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            className={linkClass}
            {...(item.opensInNewTab
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
