import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatApiErrorMessage } from '@/lib/api/errorMessage';
import { applicationsApi } from '@/lib/api/applications';
import { cn } from '@/lib/utils';
import {
  ApplicationFormFields,
  emptyApplicationFormValues,
  validateApplicationForm,
} from './ApplicationFormFields';

type NewsletterSubscribeBlockProps = {
  sourceTitle?: string;
  variant?: 'default' | 'inverted';
  className?: string;
};

export function NewsletterSubscribeBlock({
  sourceTitle = 'Bülten',
  variant = 'default',
  className,
}: NewsletterSubscribeBlockProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(emptyApplicationFormValues);

  const inverted = variant === 'inverted';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateApplicationForm(form);
    if (error) {
      toast({ title: 'Eksik bilgi', description: error, variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await applicationsApi.create({
        sourceType: 'newsletter',
        sourceTitle,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim() || null,
        title: form.title.trim() || null,
        message: form.message.trim() || null,
      });
      setSubmitted(true);
      setForm(emptyApplicationFormValues);
      toast({
        title: 'Abonelik kaydedildi',
        description: 'Bültenimize başarıyla kaydoldunuz.',
      });
    } catch (err) {
      toast({
        title: 'Kayıt başarısız',
        description: formatApiErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p
        className={cn(
          'text-sm text-center py-4',
          inverted ? 'text-primary-foreground/90' : 'text-muted-foreground',
          className
        )}
      >
        Kaydınız alındı. Teşekkürler!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('text-left w-full max-w-lg mx-auto min-w-0', className)}>
      <div
        className={cn(
          'rounded-lg border p-4 space-y-4',
          inverted
            ? 'border-primary-foreground/20 bg-primary-foreground/5'
            : 'border-border bg-card'
        )}
      >
        <ApplicationFormFields
          values={form}
          onChange={setForm}
          idPrefix="newsletter"
          messageLabel="Not (isteğe bağlı)"
        />
        <Button
          type="submit"
          className="w-full"
          variant={inverted ? 'secondary' : 'default'}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Abone Ol'}
        </Button>
      </div>
    </form>
  );
}
